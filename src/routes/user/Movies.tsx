import React, { useEffect, useState } from "react";
import SortedPanel from "../../components/SortedVideoPanel";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";

export default function Movies() {
  const [token, setToken] = useGlobalState("token");
  const [userMovies, setUserMovies] = useState([]);
  const [catalogMovies, setCatalogMovies] = useState([]);

  // const [showCatalog, setShowCatalog] = useState(false);
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

      const videos = json.filter((item: { type: string }) => {
        // Try/catch filters if the user has an item which has been deleted/doesn't exist (i think)
        try {
          let type: string = item.type;
          return type.startsWith("video");
        } catch {
          return false;
        }
      });

      let titleCache = videos.map((video: any) => { return video.meta?.title });
      const catalogMovies = catalogJson.filter((item: { type: string, meta: { title: string } }) => {
        try {
          let type: string = item.type;
          const res = type.startsWith("video") && !titleCache.includes(item.meta?.title);
          titleCache[titleCache.length] = item.meta?.title;
          return res;
        } catch {
          return false;
        }
      }).map((video: any) => {
        return {
          ...video,
          meta: {
            ...video.meta,
            description: `[PREVIEW - NO ACCESS]\n ${video.meta.description}`
          },
          tags: [
            ...video.tags,
            'PREVIEW ONLY'
          ],
          previewOnly: true
        }
      });

      setUserMovies(videos);
      setCatalogMovies(catalogMovies);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var groupingKeys: string[] = [
    strings.movies_cat_movies,
    strings.movies_cat_genres,
    strings.movies_cat_year,
    strings.movies_cat_tags,
  ];

  return (
    <div>
      {/* debug: show full catalog?<input type="checkbox" checked={showCatalog} onChange={() => {setShowCatalog(!showCatalog)}}></input> */}
      <SortedPanel
        groupingKeys={groupingKeys}
        sortableItems={showCatalog ? [...userMovies, ...catalogMovies] : userMovies}
      ></SortedPanel>
    </div>
  );
}
