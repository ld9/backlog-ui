import Tag from "./Tag";

export default interface AudioFile {
    title: string,
    artist: string,
    album: string,
    art_uri?: string,
    tags?: Tag[]
}