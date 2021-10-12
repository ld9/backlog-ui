import React from "react";
import AudioThumb from "../../components/AudioThumb";
import AudioFile from "../../types/AudioFile";
import VideoFile from "../../types/VideoFile";
import VideoThumb from "../../components/VideoThumb";

import "../../styles/userhome.css";
import { strings } from "../../strings";
import SocketTest from "../../components/SocketTest";
import { useHistory } from "react-router-dom";
import { useGlobalState } from "../../state";
import { ToastType } from "../../types/ToastType";

export default function Dashboard() {
  const [toasts, setToasts] = useGlobalState("toasts");
  const [user, setUser] = useGlobalState("user");

  const history = useHistory();

  let demoTrack: AudioFile = {
    title: "Example Song Title",
    artist: "John Smith",
    album: "Greatest Hits",
    art_uri:
      "https://i.pinimg.com/474x/05/23/a2/0523a2adeb72ac0835178cbba3d34b85.jpg",
  };

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
        <h2>{strings.dash_listened}</h2>
        <div>
          test test test test test test
          {/* <div className="test-contain-tracks">
            {[...Array(12)].map((x, i) => (
              <AudioThumb key={i} track={demoTrack}></AudioThumb>
            ))}
          </div> */}
        </div>
      </div>
      <div className="homepage-section">
        <h2>{strings.dash_watched}</h2>
        {/* <div className="test-contain-videos">
                    {[...Array(8)].map((x, i) => 
                        <VideoThumb key={i} video={demoVideo}></VideoThumb>
                    )}
                </div> */}
        ----
        {user.recent.video.map((video: { mediaId: any, time: number }, idx) => {
          return <div key={idx}>placeholder-testing: {video.mediaId} at {video.time}s</div>;
        })}
        ----
        <SocketTest></SocketTest>
        <button
          onClick={() => {
            history.push("/user/stage/test");
          }}
        >
          Join stage "test"
        </button>
        <button
          onClick={() => {
            setToasts([
              ...toasts,
              {
                content: "asdasd",
                type: ToastType.GOOD,
                until: Date.now() + 3000,
              },
            ]);
          }}
        >
          Test toasts
        </button>
      </div>
    </div>
  );
}
