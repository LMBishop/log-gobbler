import { Request, Response } from "express";
import { options } from "../config/views.js";
import { timeSince, truncateString } from "../util/util.js";
import { getRecentSessions, getTopRequestsInLastDay, getUniqueVisitorsInLastDay } from "../service/log.service.js";
import { isValidServer } from "../service/servers.service.js";

export const getSite = async (req: Request, res: Response) => {
    const serverName = req.params.id;
    
    try {
        if (!isValidServer(serverName)) { 
            throw new Error(`Invalid site name ${serverName}`);
        }

        const topRequests = await getTopRequestsInLastDay(serverName);
        const topVisitors = await getUniqueVisitorsInLastDay(serverName);
        const recentSessions = await getRecentSessions(serverName);

        res.render('site', {
            serverName: serverName,
            timeSince: timeSince,
            truncateString: truncateString,
            topRequests: topRequests,
            topVisitors: topVisitors,
            recentSessions: recentSessions,
            ...options
        });
    } catch (e) {
        res.render('site', {
            serverName: serverName,
            error: e.message || `Could not load site ${serverName}`,
            ...options
        });
    }
}
