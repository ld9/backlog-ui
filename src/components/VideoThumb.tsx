import { useState } from 'react';
import MediaItem from "../types/MediaItem";

import '../styles/components/VideoThumb.css';

export default function VideoThumb ({ video, setMediaModal }: {video: MediaItem, setMediaModal: any}) {

    return (
        <div className="video-thumb-behind">
            <div className="video-thumb-bgparent" style={{backgroundImage: `url(${video.meta.thumb})`}}>
                <div className="video-thumb" onClick={() => { setMediaModal(video) }} >
                    <div className="video-thumb-text">
                        <div className="video-thumb-title">{video.meta.title} [{video.tags.toString()}]</div>
                    </div>
                </div>
            </div>
        </div>
    );
}