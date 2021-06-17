import MediaItem from "./MediaItem";
import Watcher from "./Watcher";

export default interface Stage {
    name: string;
    watchers: Array<Watcher>;
    queue: Array<MediaItem>;
}

export const blankStage: Stage = {
    name: 'local',
    watchers: [],
    queue: [],
}