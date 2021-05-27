import MediaItem from "./MediaItem";
import Watcher from "./Watcher";

export default interface Stage {
    name: string;
    watchers: Array<Watcher>;
    queue: Array<MediaItem>;
    socket: null | any;
}

export const blankStage: Stage = {
    name: '',
    watchers: [],
    queue: [],
    socket: null
}