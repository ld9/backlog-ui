import VideoFile from "../types/VideoFile";

import '../styles/components/VideoThumb.css';

export default function VideoThumb ({ video }: {video: VideoFile}) {
    return (
        <div className="video-thumb-behind">
            <div className="video-thumb-bgparent" style={{backgroundImage: `url(${video.horiz_uri})`}}>
                <div className="video-thumb">
                    <div className="video-thumb-text">
                        <div className="video-thumb-title">{video.title}, {video.meta.genre}, {video.meta.year}, [{video.meta.tags.toString()}]</div>
                    </div>
                </div>
            </div>
        </div>
    );
}