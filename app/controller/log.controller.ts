import { Request, Response } from "express";
import { options } from "../config/views.js";
import { humanFileSize, timeSince, truncateString } from "../util/util.js";
import { getLogEntry, getLogs } from "../service/log.service.js";
import { isValidServer } from "../service/servers.service.js";
import mongoose from "mongoose";

export const getLog = async (req: Request, res: Response) => {
    const serverName = req.params.id;
    const ipAddress = req.query.ipAddress as string;
    const path = req.query.path as string;
    const userAgent = req.query.userAgent as string;
    const hideFailed = req.query.hideFailed;

    try {
        if (!isValidServer(serverName)) { 
            throw new Error(`Invalid site name ${serverName}`);
        }

        const logs = await getLogs(serverName, {
            ipAddress: ipAddress,
            url: path,
            userAgent: userAgent,
            hideFailed: !!hideFailed,
            limit: 1000,
            offset: 0
        }); 

        res.render('log', {
            serverName: serverName,
            timeSince: timeSince,
            truncateString: truncateString,
            logs: logs,
            ...options
        });
    } catch (e) {
        res.render('log', {
            serverName: serverName,
            error: e.message || `Could not load logs for site ${serverName}`,
            ...options
        });
    }
}

export const getLogById = async (req: Request, res: Response) => {
    const serverName = req.params.id;
    const logId = req.params.logid;

    try {
        if (!isValidServer(serverName)) { 
            throw new Error(`Invalid site name ${serverName}`);
        }
        
        const logEntry = await getLogEntry(serverName, logId);
        
        if (!logEntry) {
            throw new Error(`Log entry ${logId} not found`);
        }

        res.render('log-entry', {
            serverName: serverName,
            timeSince: timeSince,
            humanFileSize: humanFileSize,
            log: logEntry,
            ...options
        });
    } catch (e) {
        res.render('log-entry', {
            serverName: serverName,
            error: e.message || "Could not load log entry",
            ...options
        });
        return;
    }

}
