import {
  IconArrowRightSquare,
  IconMusic,
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerTrackNext,
  IconPlayerTrackPrev,
  IconQuestionMark,
  IconVideo,
  IconVolume,
  IconVolume2,
  IconVolume3,
} from "@tabler/icons";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { socket } from "../../socket";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";

import "../../styles/stages.css";
import {
  MessageInform,
  SocketBeaconMessageType,
} from "../../types/SocketInfoMessage";
import { BASE_API_URL, BASE_CONTENT_URL } from "../../variables";

export default function Stage() {
  const [stage, setStage] = useGlobalState("stage");
  const [user, setUser] = useGlobalState("user");
  const [isRemote, setIsRemote] = useGlobalState("isRemote");
  const [token, setToken] = useGlobalState("token");
  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  const location = useLocation();
  const history = useHistory();
  const video = useRef<HTMLVideoElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [completeCount, setCompleteCount] = useState(0);
  const [localPlayState, setLocalPlayState] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(0);
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  // Makes sure that re-renders happen when needed
  const [msgCount, setMsgCount] = useState(12);

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

  function sendRecentProgress(time: number) {
    if (stage.queue.length < 1) {
      return;
    }

    fetch(`${BASE_API_URL}/user/recent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user._id,
        payload: {
          mediaId: bestCurrentVideo()?._id,
          time,
        },
        type: bestCurrentVideo()?.uri.includes("mp4") ? "video" : "audio",
      }),
    });
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
            imaremote: isRemote,
            buffer: currentBuffer(),
          },
        };
        socket.emit("inform-peer-self", JSON.stringify(info));
      }
    }

    // Setting Event Listeners
    if (video.current != null) {
      video.current.ontimeupdate = function () {
        if (video.current != null) {
          setCurrentVideoTime(video.current.currentTime);

          sendInformMessage();

          if (Math.round(video.current.currentTime) % 5 == 0) {
            sendRecentProgress(video.current.currentTime);
          }
        }
      };

      video.current.onpause = function () {
        sendRecentProgress((video as any).current.currentTime);
        setLocalPlayState(false);
      };

      video.current.onplaying = function () {
        setLocalPlayState(true);
      };

      // Effectively re-runs this useEffect.
      video.current.onended = function () {
        console.log(stage.queue.length);
        if (completeCount < stage.queue.length) {
          setCompleteCount(completeCount + 1);
        }
      };
    }

    // Maybe this should just be in the onended function?
    if (
      video.current != null &&
      video.current.currentTime == video.current.duration &&
      !(bestCurrentIndex() == 0 && stage.queue.length != 1)
    ) {
      let queueItem = bestCurrentVideo();

      if (queueItem == undefined) {
        return;
      }

      let storedKeyJson = localStorage.getItem(`mediaKey-${queueItem._id}`);

      if (storedKeyJson != null) {
        let storedKey = JSON.parse(storedKeyJson);

        console.log(stage.queue, storedKey);
        video.current.src = `${BASE_CONTENT_URL}/content/restrict/${queueItem.uri}?token=${storedKey.token}`;

        if (queueItem.startsAt) {
          video.current.currentTime = queueItem.startsAt;
        }

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
          imaremote: isRemote,
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

        if (stage.queue[0].startsAt) {
          video.current.currentTime = stage.queue[0].startsAt;
        }

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

  useEffect(() => {
    if (video.current !== null) {
      video.current.volume = playerVolume;
    }
  }, [playerVolume]);

  const formattedSeconds = (seconds: number = 0) => {
    if (!(seconds >= 0)) {
      return "0:00";
    }

    const hhmmss: string = new Date(Math.floor(seconds) * 1000)
      .toISOString()
      .substr(11, 8);
    if (hhmmss.substr(0, 2) === "00") {
      // if (hhmmss.substr(2, 2) === "00") {}
      return hhmmss.substr(3);
    }
    return hhmmss;
  };

  const bestCurrentIndex = () => {
    if (completeCount < stage.queue.length) {
      return completeCount;
    } else {
      return 0;
    }
  };

  const bestCurrentVideo = () => {
    if (stage.queue.length >= 1) {
      return stage.queue[bestCurrentIndex()];
    } else {
      return null;
    }
  };

  const playLocal = () => {
    if (video.current) {
      video.current.play();
    }
  };

  const pauseLocal = () => {
    if (video.current) {
      video.current.pause();
    }
  };

  const nextLocal = () => {
    if (video.current) {
      video.current.currentTime = video.current.duration - 0.001;
      video.current.play();
    }
  };

  const prevLocal = () => {
    return;
  };

  const skipTo = (time: number) => {
    if (video.current) {
      video.current.currentTime = time;
    }
  };

  return (
    <div
      id="stage"
      className={`${isActive ? "stage-active" : "stage-inactive"} ${
        isFull ? "stage-full" : "stage-mini"
      } ${isRemote ? "stage-remote" : null}
      ${
        video.current && video.current.src.includes(".mp3")
          ? "stage-music"
          : "stage-video"
      }`}
    >
      <div id="stage-pseudo-header">A</div>
      <div id="stage-content">
        <div id="stage-player">
          <video id="stage-player-video" ref={video} controls autoPlay>
            <source type="video/mp4" />
          </video>
          <div className="video-controls-track">
            <IconPlayerTrackPrev
              tabIndex={0}
              onClick={prevLocal}
            ></IconPlayerTrackPrev>
            <IconPlayerTrackNext
              tabIndex={0}
              onClick={nextLocal}
            ></IconPlayerTrackNext>
          </div>
          <div className="music-content">
            <div
              className="music-image"
              style={{
                backgroundImage: `url(${bestCurrentVideo()?.meta.thumb})`,
              }}
            >
              &nbsp;
            </div>
            <div className="music-details">
              <div>
                {bestCurrentVideo() ? (
                  <div>
                    <div>{bestCurrentVideo()?.meta.title}</div>
                    <div>{bestCurrentVideo()?.meta.artist}</div>
                  </div>
                ) : (
                  "Nothing Playing"
                )}
              </div>
            </div>
            <div className="music-controls">
              <div className="music-controls-track">
                <IconPlayerTrackPrev
                  tabIndex={0}
                  onClick={prevLocal}
                ></IconPlayerTrackPrev>

                {localPlayState ? (
                  <IconPlayerPause
                    tabIndex={0}
                    onClick={pauseLocal}
                  ></IconPlayerPause>
                ) : (
                  <IconPlayerPlay
                    tabIndex={0}
                    onClick={playLocal}
                  ></IconPlayerPlay>
                )}
                <IconPlayerTrackNext
                  tabIndex={0}
                  onClick={nextLocal}
                ></IconPlayerTrackNext>
              </div>
              <div className="music-controls-volume">
                {playerVolume != 0 ? (
                  playerVolume > 0.35 ? (
                    <IconVolume></IconVolume>
                  ) : (
                    <IconVolume2></IconVolume2>
                  )
                ) : (
                  <IconVolume3></IconVolume3>
                )}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={playerVolume * 100}
                  onChange={(e) => {
                    setPlayerVolume(Number(e.target.value) / 100);
                  }}
                ></input>
              </div>
              <div className="music-controls-seek">
                <div>{formattedSeconds(currentVideoTime)}</div>
                <input
                  type="range"
                  min={0}
                  max={video.current?.duration || 0}
                  value={currentVideoTime}
                  onChange={(e) => {
                    setCurrentVideoTime(Number(e.target.value));
                    skipTo(Number(e.target.value));
                  }}
                ></input>
                <div>{formattedSeconds(video.current?.duration)}</div>
              </div>
            </div>
          </div>
        </div>
        <div id="stage-extra-content">
          <div id="global-controls">
            <h3>{strings.stage_global_title}</h3>
            {stage.name === "local" ? (
              <button
                onClick={() => {
                  history.push("/user/stage/create");
                }}
              >
                {strings.stage_global_createRoom}
              </button>
            ) : null}
            <button onClick={requestPause}>{strings.stage_global_pause}</button>
            <button onClick={requestResume}>{strings.stage_global_play}</button>
            <button onClick={requestSeek}>{strings.stage_global_jump}</button>
          </div>
          {stage.name !== "local" ? (
            <div id="stage-watchers">
              <h3>{strings.stage_audience_title}</h3>
              {Object.values(watchers).map(
                (watcher: any /* FIX ME!! UNTYPED */, key: number) => (
                  <div
                    key={key}
                    className={`stage-watcher ${
                      watcher.status.imaremote ? "watcher-remote-hide" : ""
                    }`}
                  >
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
                        <IconPlayerPlay tabIndex={0}></IconPlayerPlay>
                      ) : (
                        <IconPlayerPause tabIndex={0}></IconPlayerPause>
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
                      <IconArrowRightSquare tabIndex={0}></IconArrowRightSquare>
                    </button>
                  </div>
                )
              )}
              {/* {msgCount} */}
            </div>
          ) : null}
          <div id="stage-queue">
            <h3>{strings.stage_queue_title}</h3>
            <div id="stage-queue-list">
              {stage.queue.map((media, idx) => {
                return (
                  <div
                    className={`stage-queue-item ${
                      idx == bestCurrentIndex()
                        ? "stage-queue-item-playing"
                        : null
                    }`}
                    key={idx}
                  >
                    <span className="stage-queue-item-thumb">
                      {media.type.includes("video") ? (
                        <IconVideo></IconVideo>
                      ) : media.type.includes("audio") ? (
                        <IconMusic></IconMusic>
                      ) : (
                        <IconQuestionMark></IconQuestionMark>
                      )}
                    </span>
                    {media.meta.title}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
