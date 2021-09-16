
export enum ToastType {
    INFO = "INFO",
    GOOD = "GOOD",
    ERROR = "ERROR",
    WARNING = "WARNING"
}


export default interface ToastPackage {
    content: string,
    type: ToastType,
    until: number
}
