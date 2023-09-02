import { LogEntry } from "../types/log-entry.js";

export const parseNginxDatetime = (datetime: string): Date => {
    const [day, month, year, hour, minute, second, timezone] = datetime.split(/\/|:| /);
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'].indexOf(month);
    const timezoneOffsetMilliseconds = parseInt(timezone.slice(0, 3)) * 60 * 60 * 1000 + parseInt(timezone.slice(3)) * 60 * 1000;
    
    const utcString = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${hour}:${minute}:${second}.000Z`;

    const serverDate = new Date(utcString);

    return new Date(serverDate.getTime() - timezoneOffsetMilliseconds);
}

export const parseNginxLog = (line: string): LogEntry => {
    const regex = /(?<ip>.*) \- (?<user>[^ ]+) \[(?<datetime>\d{2}\/[a-zA-Z]{3}\/\d{4}:\d{2}:\d{2}:\d{2} (?:\+|\-)\d{4})\] "(?<method>\w+) (?<url>.+) (?<proto>[^ ]+)" (?<status>\d+) (?<bytes>\d+) "(?<referrer>.*)" "(?<userAgent>.*)"/gm;
    const match = regex.exec(line);
    if (!match?.groups) {
        throw new Error(`Unable to parse line: ${line}`);
    }

    const { ip, user, datetime, method, url, proto, status, bytes, referrer, userAgent } = match.groups;
    return {
        ipAddress: ip,
        user: user == '-' ? undefined : user,
        datetime: parseNginxDatetime(datetime),
        method,
        url,
        protocol: proto,
        status: parseInt(status),
        bytesSent: parseInt(bytes),
        referer: referrer == '-' ? undefined : referrer,
        userAgent: userAgent == '-' ? undefined : userAgent
    };
}
