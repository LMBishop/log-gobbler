import fs from 'fs-extra';
import config from 'config';
import { parseNginxLog } from './log-parser.js';
import { logger } from '../logger.js';
import { LogEntryModel } from '../model/log-entry.model.js';

const getLastIngestedLogTime = async (server: string) => {
    const lastLog = await LogEntryModel.find({ serverName: server }).sort({ datetime: -1 }).limit(1).exec();
    if (lastLog.length > 0) {
        return lastLog[0].datetime;
    } else {
        return new Date(0);
    }
};

export const ingestLog = async () => {
    const servers: any[] = config.get('servers');
    const basePath = config.get('base-path');

    logger.info(`Ingesting logs from ${basePath}`)

    servers.forEach(async (server: any) => {
        ingestLogForServer(server.name);
    });
}

export const ingestLogForServer = async (serverName: string) => {
    const servers: any[] = config.get('servers');
    const server = servers.find((server: any) => server.name === serverName);
    if (!server) {
        throw new Error(`Server ${serverName} not found`);
    }
    
    logger.info(`[${server.name}] Ingesting logs from ${server.file}`)

    const lastIngestedLogTime = await getLastIngestedLogTime(server.name);
    const logPath = `${config.get('base-path')}/${server.file}`;

    logger.info(`[${server.name}] Last ingested log time for ${server.name}: ${lastIngestedLogTime}`)

    if (await fs.pathExists(logPath)) {
        const log = await fs.readFile(logPath, 'utf8');
        const lines = log.split('\n');

        const logEntries = [];
        const ignoredLines = [];
        for (const line of lines) {
            try {
                const logEntry = parseNginxLog(line);
                logEntries.push(logEntry);
            } catch (e) { 
                ignoredLines.push(line);
            }
        }
        
        
        logger.info(`[${server.name}] Parsed ${logEntries.length} log entries from ${server.file}`);
        
        const logEntriesToInsert = logEntries.filter(logEntry => logEntry.datetime > lastIngestedLogTime);
        logger.info(`[${server.name}] ${logEntriesToInsert.length} log entries are newer than the last ingested log entry`);
        
        if (logEntriesToInsert.length > 0) {
            for (const logEntry of logEntriesToInsert) {
                await LogEntryModel.create({
                    serverName: server.name,
                    ...logEntry,
                });
            }
            
            logger.info(`[${server.name}] Inserted ${logEntriesToInsert.length} log entries from ${server.file}`);
        }
    }
}
