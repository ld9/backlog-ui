import React, { useEffect, useState } from "react";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { socket } from "../../socket";
import { BASE_API_URL } from "../../variables";
import { SocketBeaconMessageType } from "../../types/SocketInfoMessage";
import AudioThumb from "../../components/AudioThumb";
import SortedAudioPanel from "../../components/SortedAudioPanel";

export default function Music() {
  const [token, setToken] = useGlobalState("token");
  const [stage, setStage] = useGlobalState("stage");

  const [userSongs, setUserSongs] = useState([]);
  const [catalogMovies, setCatalogMovies] = useState([]);

  const [showCatalog, setShowCatalog] = useGlobalState("showCatalog");const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode])

  useEffect(() => {
    (async () => {
      const media = await fetch(`${BASE_API_URL}/api/media`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const catalog = await fetch(`${BASE_API_URL}/api/media/catalog`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const json = await media.json();
      const catalogJson = await catalog.json();

      const songs = json.filter((item: { type: string }) => {
        // Try/catch filters if the user has an item which has been deleted/doesn't exist (i think)
        try {
          let type: string = item.type;
          return type.startsWith("audio");
        } catch {
          return false;
        }
      });

      let titleCache = songs.map((audio: any) => {
        return audio.meta?.title;
      });

      const catalogMovies = catalogJson
        .filter((item: { type: string; meta: { title: string } }) => {
          try {
            let type: string = item.type;
            const res =
              type.startsWith("audio") &&
              !titleCache.includes(item.meta?.title);
            titleCache[titleCache.length] = item.meta?.title;
            return res;
          } catch {
            return false;
          }
        })
        .map((audio: any) => {
          return {
            ...audio,
            meta: {
              ...audio.meta,
              description: `[PREVIEW - NO ACCESS]\n ${audio.meta.description}`,
            },
            tags: [...audio.tags, "PREVIEW ONLY"],
            previewOnly: true,
          };
        });

      setUserSongs(songs);
      setCatalogMovies(catalogMovies);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var groupingKeys: string[] = [
    strings.audio_cat_songs,
    strings.audio_cat_artist,
    strings.audio_cat_album,
    strings.audio_cat_tags,
    'Collections'
  ];

  return (
    <div>
      <SortedAudioPanel
        sortableItems={userSongs}
        groupingKeys={groupingKeys}
      ></SortedAudioPanel>
    </div>
  );
}
