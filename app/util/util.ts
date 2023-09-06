export function timeSince(date: Date): string {
    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        const floor = Math.floor(interval);
        return `${floor} year${floor > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        const floor = Math.floor(interval);
        return `${floor} month${floor > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 86400;
    if (interval > 1) {
        const floor = Math.floor(interval);
        return `${floor} day${floor > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 3600;
    if (interval > 1) {
        const floor = Math.floor(interval);
        return `${floor} hour${floor > 1 ? 's' : ''} ago`;
    }
    interval = seconds / 60;
    if (interval > 1) {
        const floor = Math.floor(interval);
        return `${floor} minute${floor > 1 ? 's' : ''} ago`;
    }

    const floor = Math.floor(seconds);
    return `${floor} second${floor > 1 ? 's' : ''} ago`;
}

export function truncateString(str: string, maxLength: number = 50): string {
    if (!str) return str;
    return str.length > maxLength ? str.slice(0, 50) + '...' : str;
}

export function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}
