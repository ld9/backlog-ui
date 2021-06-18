import MediaItem from "./MediaItem";
import Watcher from "./Watcher";

export default interface Stage {
    name: string;
    watchers: Array<Watcher>;
    position: number;
    queue: Array<MediaItem>;
}

export const blankStage: Stage = {
    name: 'local',
    position: 0,
    watchers: [],
    queue: [],
}