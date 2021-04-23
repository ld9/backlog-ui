export default interface VideoFile {
    title: string,
    horiz_uri?: string,
    meta: {
        genre: string,
        year: string,
        tags: string[]
    }
}