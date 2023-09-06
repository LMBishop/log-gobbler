import config from "config";

export function getConfiguredServers(): string[] {
    const servers: any[] = config.get('servers');
    return servers.map((server: any) => server.name);
}

export function isValidServer(server: string): boolean {
    const servers: any[] = config.get('servers');
    return servers.some((s: any) => s.name === server);
}
