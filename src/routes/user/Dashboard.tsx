import React from 'react';
import AudioThumb from '../../components/AudioThumb';
import AudioFile from '../../types/AudioFile';
import VideoFile from '../../types/VideoFile';
import VideoThumb from '../../components/VideoThumb';

import "../../styles/userhome.css";
import { strings } from '../../strings';

export default function Dashboard() {
    
    let demoTrack: AudioFile = {
        title: "Example Song Title",
        artist: "John Smith",
        album: "Greatest Hits",
        art_uri: "https://i.pinimg.com/474x/05/23/a2/0523a2adeb72ac0835178cbba3d34b85.jpg"
    }

    // let demoVideo: VideoFile = {
    //     title: "Demo Movie or Documentary Title",
    //     horiz_uri: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__340.jpg",
    //     meta: {
    //         genre: "Void",
    //         year: "Void",
    //         tags: []
    //     }
    // }

    return (
        <div className="homepage-section-parent">
            <div className="homepage-section">
                <h1>{strings.dash_title}</h1>
            </div>
            <div className="homepage-section">
                <h2>
                    {strings.dash_listened}
                </h2>
                <div>
                    <div className="test-contain-tracks">
                        {[...Array(12)].map((x, i) => 
                            <AudioThumb key={i} track={demoTrack}></AudioThumb>
                        )}
                    </div>
                </div>
            </div>
            <div className="homepage-section">
                <h2>
                    {strings.dash_watched}
                </h2>
                {/* <div className="test-contain-videos">
                    {[...Array(8)].map((x, i) => 
                        <VideoThumb key={i} video={demoVideo}></VideoThumb>
                    )}
                </div> */}
            </div>
        </div>
    );
}