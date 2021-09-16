import {
  IconArrowRightSquare,
  IconPlayerPause,
  IconPlayerPlay,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { socket } from "../../socket";
import { useGlobalState } from "../../state";

import "../../styles/stages.css";
import {
  MessageInform,
  SocketBeaconMessageType,
} from "../../types/SocketInfoMessage";
import { BASE_API_URL, BASE_CONTENT_URL } from "../../variables";

export default function Stage() {
  const [stage, setStage] = useGlobalState("stage");
  const [user, setUser] = useGlobalState("user");
  const [token, setToken] = useGlobalState("token");

  const location = useLocation();
  const history = useHistory();
  const video = useRef<HTMLVideoElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [completeCount, setCompleteCount] = useState(0);

  // Makes sure that re-renders happen when needed
  const [msgCount, setMsgCount] = useState(0);

  const [myWatchKeys, setMyWatchKeys] = useState({});
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
  // When the video is finished, play the next one.
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

      // Effectively re-runs this useEffect.
      video.current.onended = function () {
        setCompleteCount(completeCount + 1);
      }
    }

    // Maybe this should just be in the onended function?
    if (
      video.current != null &&
      video.current.currentTime == video.current.duration
    ) {
      console.log("next");

      let queueItem;
      for (let i = 0; i < stage.queue.length; i++) {
        if (
          video.current.src
            .substr(video.current.src.lastIndexOf("/") + 1)
            .split("?")[0] == stage.queue[i].uri
        ) {
          queueItem = stage.queue[i + 1];
          break;
        }
      }
      if (queueItem == undefined) {
        return;
      }

      let storedKeyJson = localStorage.getItem(`mediaKey-${queueItem._id}`);

      if (storedKeyJson != null) {
        let storedKey = JSON.parse(storedKeyJson);

        console.log(stage.queue, storedKey);
        video.current.src = `${BASE_CONTENT_URL}/content/restrict/${queueItem.uri}?token=${storedKey.token}`;
        console.log("updating source");
      } else {
        console.error("could not find key for media item");
      }
    }
  }, [video, user, completeCount]);

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

  useEffect(() => {
    async function setInitialVideo(sources: any) {
      // Sets the current video if there isn't a source set yet.
      if (
        video.current !== null &&
        video.current.src == "" &&
        stage.queue.length > 0
      ) {
        console.log(
          stage.queue[0],
          await sources,
          await sources[stage.queue[0]._id]
        );
        video.current.src = `${BASE_CONTENT_URL}/content/restrict/${
          stage.queue[0].uri
        }?token=${sources[stage.queue[0]._id].token}`;
        console.log("set source");
      }
    }

    (async () => {
      let temp: { [key: string]: any } = {};

      // Load the tokens to let the user authenticate when requesting video files
      stage.queue.forEach(async (queueItem) => {
        let storedKey = localStorage.getItem(`mediaKey-${queueItem._id}`);
        let mediaToken;
        console.log(storedKey);
        if (storedKey === null) {
          let newKey = fetch(`${BASE_API_URL}/user/request-media-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              mediaId: queueItem.uri,
            }),
          }).then((body) => body.json());

          mediaToken = await newKey;
          localStorage.setItem(
            `mediaKey-${queueItem._id}`,
            JSON.stringify(await newKey)
          );

          temp[queueItem._id] = mediaToken;
          setInitialVideo(temp);
        } else {
          mediaToken = JSON.parse(await storedKey);
          temp[queueItem._id] = mediaToken;
          setInitialVideo(temp);
        }
      });

      // Saves the keys (TODO: Do even need to do this?)
      setMyWatchKeys(temp);
    })();
  }, [stage.queue]);

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
          <video id="stage-player-video" ref={video} controls muted autoPlay>
            <source type="video/mp4" />
          </video>
        </div>
        <div id="stage-extra-content">
          <div id="global-controls">
            <h3>Global Controls</h3>
            {stage.name === "local" ? (
              <button
                onClick={() => {
                  history.push("/user/stage/create");
                }}
              >
                Create Joinable Room
              </button>
            ) : null}
            <button onClick={requestPause}>Pause All</button>
            <button onClick={requestResume}>Play All</button>
            <button onClick={requestSeek}>Jump to Me</button>
          </div>
          {stage.name !== "local" ? (
            <div id="stage-watchers">
              <h3>Stage Audience</h3>
              {Object.values(watchers).map(
                (watcher: any /* FIX ME!! UNTYPED */, key: number) => (
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
