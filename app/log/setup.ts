import config from 'config';
import { ingestLogForServer } from './log-ingest.js';
import { watch } from 'chokidar';
import { queue } from 'async';
import { logger } from '../logger.js';

const ingestQueue = queue(async (task: any, callback: any) => {
    await ingestLogForServer(task.serverName);
    callback();
}, 1);

export function watchFiles() {
    const servers: any[] = config.get('servers');
    const basePath = config.get('base-path');

    logger.info(`Creating watchers for ${basePath}`)

    for (const server of servers) {
        const logPath = `${basePath}/${server.file}`;
        watch(logPath, { persistent: true })
            .on('add', (path: string) => {
                ingestQueue.push({ serverName: server.name });
            })
            .on('change', (path: string) => {
                ingestQueue.push({ serverName: server.name });
            })
            .on('error', (error: any) => {
                logger.error(`Watcher error: ${error}`);
            });
    }
}
