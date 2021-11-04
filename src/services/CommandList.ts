export interface Command {
    command: string,
    description: string,
}

export interface CommandList {
    commandPrefix: string,
    serviceName: string,
    commands: Array<Command>
}