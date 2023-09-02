import { Request, Response } from "express";
import { options } from "../config/views.js";
import { timeSince, truncateString } from "../util/util.js";
import { getRecentSessions, getTopRequestsInLastDay, getUniqueVisitorsInLastDay } from "../service/log.service.js";

export const getSite = async (req: Request, res: Response) => {
    const serverName = req.params.id;
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
}
