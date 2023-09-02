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
