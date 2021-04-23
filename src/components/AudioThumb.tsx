import AudioFile from "../types/AudioFile";

import '../styles/components/AudioThumb.css';

export default function AudioThumb ({ track }: {track: AudioFile}) {

    return (
        <div className="audio-thumb-behind">
            <div className="audio-thumb-bgparent" style={{backgroundImage: `url(${track.art_uri})`}}>
                <div className="audio-thumb">
                    <div className="audio-thumb-text">
                        <div className="audio-thumb-title">{track.title}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}