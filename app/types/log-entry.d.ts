export interface LogEntry {
    ipAddress: string;
    serverName?: string;
    user?: string;
    datetime: Date;
    method: string;
    url: string;
    protocol: string;
    status: number;
    bytesSent: number;
    referer?: string;
    userAgent?: string;
}
