export interface Command {
    command: string,
    description: string,
}

export interface CommandList {
    serviceName: string,
    commands: Array<Command>
}