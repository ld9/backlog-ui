import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useGlobalState } from "../../state";

import "../../styles/stages.css";

export default function Stage() {
  const [stage, setStage] = useGlobalState("stage");
  const [currentTime, setCurrentTime] = useState(0);
  const location = useLocation();
  const video = useRef<HTMLVideoElement>(null);

  // When the Video element changes, set the video's event listeners
  useEffect(() => {
    
    if (video.current != null) {
      video.current.ontimeupdate = function () {
        if (video.current != null) {
          setCurrentTime(video.current.currentTime);
        }
      }
    }

  }, [video]);

  const isActive = stage.name !== "";
  const isFull = location.pathname === "/user/stage";

  return (
    <div
      id="stage"
      className={`${isActive ? "stage-inactive" : "stage-active"} ${
        isFull ? "stage-full" : "stage-mini"
      }`}
    >
      <div id="stage-player">
        <video id="stage-player-video" ref={video} controls>
          <source
            src="https://lynch.dev/vidtest/train_1.mp4"
            type="video/mp4"
          />
        </video>
        {currentTime}
      </div>
      <div id="stage-extra-content"></div>
    </div>
  );
}
