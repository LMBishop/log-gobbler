import config from "config";

export function getConfiguredServers(): string[] {
    const servers: any[] = config.get('servers');
    return servers.map((server: any) => server.name);
}
