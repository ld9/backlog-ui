export default interface MediaItem {
    _id: any;
    uri: string;
    meta: {
        title: string;
        released?: number;
        thumb?: string;
        tmdb?: any;
        /* Allow any meta things to be present. */
        [key: string]: any;
    };
    tags: [];
    type: string;
    sortTag: any;
    previewOnly?: boolean;
}