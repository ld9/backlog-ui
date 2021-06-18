import {
  IconArrowRightSquare,
  IconGitPullRequest,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { socket } from "../../socket";
import { useGlobalState } from "../../state";

import "../../styles/stages.css";
import MediaItem from "../../types/MediaItem";
import {
  MessageInform,
  SocketBeaconMessageType,
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

  const [watchers, setWatchers] = useState({});

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

  // When the Video element changes, set the video's event listeners
  useEffect(() => {
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

    if (video.current != null) {
      video.current.ontimeupdate = function () {
        if (video.current != null) {
          sendInformMessage();
        }
      };
    }
  }, [video, user]);

  // Sets the activity of the videoplayer (large/small)
  useEffect(() => {
    setIsActive(stage.queue.length > 0);
    setIsFull(location.pathname === "/user/stage");
  }, [stage, location]);

  // Socket listeners - only make them once!!!
  useEffect(() => {
    let messageCount = 0;

    socket.off("inform-join");
    socket.off("inform-peer");

    socket.on("inform-join", (joined) => {
      const joiner = JSON.parse(joined);

      console.log("joiner", joiner);

      let temp = watchers as { [key: string]: any };
      temp[joiner.user] = {
        status: {
          name: joiner.display,
          time: 0,
          buffer: [],
          playing: false,
        },
      };

      setWatchers(temp);

      socket.emit(
        "inform-peer",
        JSON.stringify({
          type: SocketBeaconMessageType.CURRENTQUEUE,
          queue: stage.queue,
        })
      );

      const info: MessageInform = {
        from: socket.id,
        type: SocketBeaconMessageType.INFORM,
        payload: {
          time: 0,
          playing: false,
          name: user.name.first,
          buffer: [],
        },
      };
      socket.emit("inform-peer-self", JSON.stringify(info));
    });

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
        if (video.current != null) {
          video.current.currentTime = (message as any).to;
        }
      } else if (message.type === SocketBeaconMessageType.QUEUE) {
        let newItem = (message as any).queue;
        setStage({
          ...stage,
          queue: [...stage.queue, newItem],
        });
      } else if (message.type === SocketBeaconMessageType.CURRENTQUEUE) {
        let queue = (message as any).queue;
        if (stage.queue.length === 0) {
          setStage({
            ...stage,
            queue,
          });
        }
      }

      setMsgCount(++messageCount);
    });
  }, [stage, stage.queue]);

  const formattedSeconds = (seconds: number = 0) => {
    const hhmmss: string = new Date(Math.floor(seconds) * 1000)
      .toISOString()
      .substr(11, 8);
    if (hhmmss.substr(0, 2) === "00") {
      // if (hhmmss.substr(2, 2) === "00") {}
      return hhmmss.substr(3);
    }
    return hhmmss;
  };

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
                if (
                  stage.name !== "local" &&
                  !window.confirm("Really abandon this room?")
                ) {
                  return;
                }

                history.push("/user/stage/create");
              }}
            >
              {stage.name === "local"
                ? "Create joinable room"
                : "Abandon & create new room"}
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
                  <div key={key} className="stage-watcher">
                    <div className="stage-watcher-name">
                      {watcher.status.name}
                      <span className="watcher-uid-tag">
                        {Object.keys(watchers)[key].substring(0, 4)}
                        {Object.keys(watchers)[key] === socket.id
                          ? " (You)"
                          : null}
                      </span>
                    </div>
                    <div className="stage-watcher-time">
                      {formattedSeconds(watcher.status.time)}
                    </div>
                    <div className="stage-watcher-pause-contain">
                      {watcher.status.playing ? (
                        <IconPlayerPlay></IconPlayerPlay>
                      ) : (
                        <IconPlayerPause></IconPlayerPause>
                      )}
                    </div>
                    <button
                      title={`Jump to ${watcher.status.name}'s time in the video`}
                      className="button-has-svg"
                      onClick={() => {
                        if (video.current != null) {
                          // console.log(watcher.status.time);
                          video.current.currentTime = watcher.status.time;
                        }
                      }}
                    >
                      <IconArrowRightSquare></IconArrowRightSquare>
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
              {stage.queue.map((media, idx) => (
                <div className="stage-queue-item" key={idx}>
                  {media.meta.title} - {media.uri}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
