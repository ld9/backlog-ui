import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { socket } from "../../socket";
import { useGlobalState } from "../../state";

import "../../styles/stages.css";
import {
  MessageInform,
  SocketBeaconMessageType,
  Payload,
  MessageSeek,
} from "../../types/SocketInfoMessage";

export default function Stage() {
  const [stage, setStage] = useGlobalState("stage");
  const [user, setUser] = useGlobalState("user");

  const location = useLocation();
  const history = useHistory();
  const video = useRef<HTMLVideoElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [isFull, setIsFull] = useState(false);

  // Makes sure that re-renders happen when needed
  const [msgCount, setMsgCount] = useState(0);

  const [contentQueue, setContentQueue] = useState([]);
  const [watchers, setWatchers] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [currentContent, setCurrentContent] = useState("");

  const currentBuffer = () => {
    let buffered = [];
    if (video.current !== null) {
      for (let i = 0; i < video.current.buffered.length; i++) {
        buffered[i] = {
          start: video.current.buffered.start(i),
          end: video.current.buffered.end(i),
        };
      }
    }
    return buffered;
  };

  function requestPause() {
    socket.emit(
      "inform-peer-self",
      JSON.stringify({
        from: socket.id,
        type: SocketBeaconMessageType.PAUSE,
      })
    );
  }

  function requestResume() {
    socket.emit(
      "inform-peer-self",
      JSON.stringify({
        from: socket.id,
        type: SocketBeaconMessageType.RESUME,
      })
    );
  }

  function requestSeek() {
    if (video.current !== null) {
      socket.emit(
        "inform-peer",
        JSON.stringify({
          from: socket.id,
          type: SocketBeaconMessageType.SEEK,
          to: video.current.currentTime,
        })
      );
    }
  }

  function sendInformMessage() {
    if (video.current != null) {
      const info: MessageInform = {
        from: socket.id,
        type: SocketBeaconMessageType.INFORM,
        payload: {
          time: video.current.currentTime,
          playing: !video.current.paused,
          name: user.name.first,
          buffer: currentBuffer(),
        },
      };
      socket.emit("inform-peer-self", JSON.stringify(info));
    }
  }

  // function bringMeBack() {
  //   function doTimingSync() {
  //     const totalTime: number = Object.values(watchers).reduce(
  //       (a: any, b: any) => a.status.time + b.status.time
  //     ) as number;
  //     const avg = totalTime / Object.keys(watchers).length;

  //     if (video.current !== null) {
  //       if (Math.abs(video.current.currentTime - avg) > 1) {
  //         console.log("outofsync");
  //         // requestPause();
  //         const min = Math.min.apply(
  //           Math,
  //           Object.values(watchers).map((watcher: any) => watcher.status.time)
  //         );
  //         video.current.currentTime = min;
  //         sendInformMessage();
  //       }
  //     }
  //   }
  // }

  // When the Video element changes, set the video's event listeners
  useEffect(() => {
    let timeUpdateDelay = 0;
    let lastSeekTo = 0;

    if (video.current != null) {
      video.current.ontimeupdate = function () {
        if (video.current != null) {
          setCurrentTime(video.current.currentTime);

          // if (timeUpdateDelay++ > 4) {
          // timeUpdateDelay = 0;
          sendInformMessage();
          // }
        }
      };

      // video.current.onpause = function () {
      //   requestPause();
      //   sendInformMessage();
      // };

      // video.current.onplay = function () {
      //   requestResume();
      //   sendInformMessage();
      // };

      // video.current.onseeked = function (event) {
      //   if (
      //     video.current != null &&
      //     lastSeekTo !== video.current.currentTime &&
      //     !ignoreThisSeek
      //   ) {
      //     lastSeekTo = video.current.currentTime;
      //     console.log("seeked");
      //     video.current.pause();
      //     // requestPause();
      //     requestSeek();
      //     // sendInformMessage();
      //   }
      // };
    }
  }, [video]);

  // Sets the activity of the videoplayer (large/small)
  useEffect(() => {
    setIsActive(stage.queue.length > 0);
    setIsFull(location.pathname === "/user/stage");
  }, [stage, location]);

  // Socket listeners - only make them once!!!
  useEffect(() => {
    // setInterval(() => {
    //   if (
    //     watchers != null &&
    //     Object.keys(watchers).length >= 2 &&
    //     video.current !== null
    //   ) {
    //     console.log("doing timing sync");
    //     doTimingSync();
    //   }
    // }, 2000);
    let messageCount = 0;

    socket.on("inform-peer", (beacon) => {
      const message: MessageInform = JSON.parse(beacon);

      if (message.type === SocketBeaconMessageType.INFORM) {
        let temp = watchers as { [key: string]: any };
        temp[message.from] = {
          ...temp[message.from],
          status: message.payload,
        };

        setWatchers(temp);
      } else if (message.type === SocketBeaconMessageType.PAUSE) {
        if (video.current != null) {
          if (video.current.paused === false) {
            video.current.pause();
          }
        }
      } else if (message.type === SocketBeaconMessageType.RESUME) {
        if (video.current != null) {
          if (video.current.paused === true) {
            video.current.play();
          }
        }
      } else if (message.type === SocketBeaconMessageType.SEEK) {
        console.log("got seek request");
        if (video.current != null) {
          video.current.currentTime = (message as any).to;
        }
      }

      setMsgCount(++messageCount);

      // console.log(watchers);
    });
  }, []);

  return (
    <div
      id="stage"
      className={`${isActive ? "stage-active" : "stage-inactive"} ${
        isFull ? "stage-full" : "stage-mini"
      }`}
    >
      <div id="stage-pseudo-header">A</div>
      <div id="stage-content">
        <div id="stage-player">
          <video id="stage-player-video" ref={video} controls muted>
            <source
              src="https://lynch.dev/vidtest/train_1.mp4"
              type="video/mp4"
            />
          </video>
        </div>
        <div id="stage-extra-content">
          <div id="global-controls">
            <h3>Global Controls</h3>
            <button
              onClick={() => {
                history.push("/user/stage/create");
              }}
            >
              Create joinable room
            </button>
            <button onClick={requestPause}>Pause All</button>
            <button onClick={requestResume}>Play All</button>
            <button onClick={requestSeek}>Jump to Me</button>
          </div>
          {stage.name !== "local" ? (
            <div id="stage-watchers">
              <h3>Stage Audience</h3>
              {Object.values(watchers).map(
                (watcher: any /* FIX ME!! */, key: number) => (
                  <div key={key}>
                    {watcher.status.name}.
                    {Object.keys(watchers)[key].substring(0, 4)}:{" "}
                    {watcher.status.time} (
                    {watcher.status.playing ? "playing" : "paused"})
                    <button
                      onClick={() => {
                        if (video.current != null) {
                          video.current.currentTime = watcher.status.time;
                        }
                      }}
                    >
                      Jump to Time
                    </button>
                  </div>
                )
              )}
              {/* {msgCount} */}
            </div>
          ) : null}
          <div id="stage-queue">
            <h3>Playback Queue</h3>
            <div id="stage-queue-list">
              {stage.queue.map((media, idx) =>
                <div className='stage-queue-item' key={idx}>
                  {media.meta.title} - {media.uri}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
