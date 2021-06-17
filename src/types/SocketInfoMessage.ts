export enum SocketBeaconMessageType {
    WHAT = "WHAT",
    SYNC = "SYNC",
    INFORM = "INFORM",
    PAUSE = "PAUSE",
    SEEK = "SEEK",
    RESUME = "RESUME",
    BACK = "BACK",
    SKIP = "SKIP",
    CHANGE = "CHANGE",
    TIME = "TIME",
    ENQUEUE = "ENQUEUE",
    DEQUEUE = "DEQUEUE",
    ALTER = "ALTER",
    MESSAGE = "MESSAGE",
    RENAME = "RENAME",
    KICK = "KICK"
}

interface BeaconMessage {
    from: string,
    type: SocketBeaconMessageType,
}

export interface Payload {
    time: number,
    playing: boolean,
    name: string,
    buffer: {
        start: number,
        end: number
    }[]
}

export interface MessageInform extends BeaconMessage {
    type: SocketBeaconMessageType.INFORM,
    payload: Payload
}

export interface MessagePause extends BeaconMessage {
    type: SocketBeaconMessageType.PAUSE
}

export interface MessageResume extends BeaconMessage {
    type: SocketBeaconMessageType.RESUME
}

export interface MessageSeek extends BeaconMessage {
    type: SocketBeaconMessageType.SEEK,
    to: number;
}