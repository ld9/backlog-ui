import React, { useEffect } from "react";
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
import ContinueWatching from "../../components/dash/ContinueWatching";
import ListenAgain from "../../components/dash/ListenAgain";

export default function Dashboard() {
  const [toasts, setToasts] = useGlobalState("toasts");
  const [user, setUser] = useGlobalState("user");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode])

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
          <ListenAgain></ListenAgain>
        </div>
      </div>
      <div className="homepage-section">
        <h2>{strings.dash_watched}</h2>
        <div>
          <ContinueWatching></ContinueWatching>
        </div>
      </div>
    </div>
  );
}
