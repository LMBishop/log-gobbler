import { Request, Response } from "express";
import { options } from "../config/views.js";
import { getConfiguredServers } from "../service/servers.service.js";
import { getRequestsInLastDay } from "../service/log.service.js";

export const getIndex = async (req: Request, res: Response) => {
    const servers = getConfiguredServers();
    const listing = {};

    for (const server of servers) {
        const requestsInLastDay = await getRequestsInLastDay(server);
        listing[server] = requestsInLastDay;
    }

    res.render('index', {
        servers: listing,
        ...options
    });
}
