export default interface VideoFile {
    uri: string;
    meta: {
        title: string;
        released?: number;
        thumb?: string;
        /* Allow any meta things to be present. */
        [key: string]: any;
    };
    tags: [];
    type: string;
}