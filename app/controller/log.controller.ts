import { Request, Response } from "express";
import { options } from "../config/views.js";
import { timeSince, truncateString } from "../util/util.js";
import { getLogs } from "../service/log.service.js";

export const getLog = async (req: Request, res: Response) => {
    const serverName = req.params.id;
    const ipAddress = req.query.ipAddress as string;
    const path = req.query.path as string;
    const userAgent = req.query.userAgent as string;
    const hideFailed = req.query.hideFailed;

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
}
