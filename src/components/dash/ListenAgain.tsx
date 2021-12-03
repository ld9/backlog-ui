import { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { BASE_API_URL } from "../../variables";
import { socket } from "../../socket";

import VideoThumb from "../VideoThumb";
import MediaItem from "../../types/MediaItem";
import { SocketBeaconMessageType } from "../../types/SocketInfoMessage";
import AudioThumb from "../AudioThumb";
import { ToastType } from "../../types/ToastType";

export default function ListenAgain() {
  const [user, setUser] = useGlobalState("user");
  const [stage, setStage] = useGlobalState("stage");
  const [toasts, setToasts] = useGlobalState("toasts");

  const [songCache, setSongCache] = useState<Record<string, MediaItem>>({});
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    let lsc = songCache;

    user.recent.audio.forEach(
      async (audio: { mediaId: any; time: number }, i) => {
        console.log(audio.mediaId);

        const fetchResult = await fetch(
          `${BASE_API_URL}/api/media/${audio.mediaId}`
        );
        const fetchJson = await fetchResult.json();

        let obtainedJson = await fetchJson;

        // Only list recent videos in the continue watching field
        if ((obtainedJson as MediaItem).type.includes("audio")) {
          lsc[audio.mediaId] = obtainedJson;
        }

        setSongCache(lsc);
        // Forces a re-render
        setUpdate(i + 31);
      }
    );
  }, [user]);

  const addToQueueEnd = (rawMedia: MediaItem, time: number) => {
    if (rawMedia !== null) {
      const media: MediaItem = {
        ...rawMedia,
        startsAt: time,
      };

      fetch(`${BASE_API_URL}/user/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user._id,
          media: media._id,
          payload: {
            mediaId: media._id,
            time: 0,
          },
          type: "audio",
        }),
      });

      setStage({
        ...stage,
        queue: [...stage.queue, media],
      } as any);

      setToasts([
        ...toasts,
        {
          until: Date.now() + 2000,
          type: ToastType.GOOD,
          content: `Added "${media.meta.title}" to queue`,
        },
      ]);

      socket.emit(
        "inform-peer",
        JSON.stringify({
          from: socket.id,
          type: SocketBeaconMessageType.QUEUE,
          queue: media,
        })
      );
    }
  };

  return (
    <div className="dash-continue-list">
      {user.recent.audio.map((audio: { mediaId: any; time: number }, idx) => {
        if (!songCache[audio.mediaId]) {
          return null;
        }

        return (
          <div className="dash-continue-item" data-test={update} key={idx}>
            <AudioThumb
              setMediaModal={function () {
                console.log("aa");
                addToQueueEnd(songCache[audio.mediaId], /*audio.time*/ 0);
              }}
              track={songCache[audio.mediaId]}
            ></AudioThumb>
          </div>
        );
      })}
    </div>
  );
}
