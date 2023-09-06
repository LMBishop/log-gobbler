import { LogEntryModel } from "../model/log-entry.model.js";
import { LogEntry } from "../types/log-entry.js";

export async function getRequestsInLastDay(serverName: string): Promise<number> {
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return await LogEntryModel.countDocuments({
        serverName: serverName,
        datetime: { $gt: oneDayAgo }
    }).exec();
}

export async function getTopRequestsInLastDay(serverName: string): Promise<any[]> {
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return await LogEntryModel.aggregate([
        {
            $match: {
                serverName: serverName,
                datetime: { $gt: oneDayAgo },
                status: {
                    $gte: 200,
                    $lt: 400
                }
            }
        },
        {
            $group: {
                _id: "$url",
                count: { $sum: 1 },
                uniqueVisitors: { $addToSet: "$ipAddress" }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 20
        }
    ]).exec();
};

export async function getUniqueVisitorsInLastDay(serverName: string): Promise<any[]> {
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return await LogEntryModel.aggregate([
        {
            $match: {
                serverName: serverName,
                datetime: { $gt: oneDayAgo },
                status: {
                    $gte: 200,
                    $lt: 400
                }
            }
        },
        {
            $group: {
                _id: {
                    ipAddress: "$ipAddress",
                    userAgent: "$userAgent"
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: {
                count: -1
            }
        },
        {
            $limit: 10
        }
    ]).exec();
}

export async function getRecentSessions(serverName: string): Promise<any[]> {
    const oneDayAgo = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    return await LogEntryModel.aggregate([
        {
            $match: {
                serverName: serverName,
                datetime: { $gt: oneDayAgo },
                status: {
                    $gte: 200,
                    $lt: 400
                }
            }
        },
        {
            $group: {
                _id: {
                    ipAddress: "$ipAddress",
                    userAgent: "$userAgent"
                },
                count: { $sum: 1 },
                lastRequest: { $max: "$datetime" }
            },
        },
        {
            $match: {
                count: { $gt: 1 }
            }
        },
        {
            $sort: {
                lastRequest: -1
            },
        },
        {
            $limit: 10
        }
    ]).exec(); 
}

type GetLogsOptions = {
    ipAddress?: string;
    url?: string;
    userAgent?: string;
    hideFailed?: boolean;
    limit: number;
    offset: number;
}

export async function getLogs(serverName: string, options: GetLogsOptions): Promise<any[]> {
    const query: any = {
        serverName: serverName
    };

    if (options.ipAddress) {
        query.ipAddress = options.ipAddress;
    }

    if (options.url) {
        query.url = options.url;
    }

    if (options.userAgent) {
        query.userAgent = options.userAgent;
    }
    
    if (options.hideFailed) {
        query.status = {
            $gte: 200,
            $lt: 400
        }
    }

    return await LogEntryModel.find(query).sort({ datetime: -1 }).skip(options.offset).limit(options.limit).exec();
};

export async function getLogEntry(serverName: string, logId: string): Promise<any> {
    return await LogEntryModel.findOne({
        _id: logId,
        serverName: serverName
    }).exec();
}
