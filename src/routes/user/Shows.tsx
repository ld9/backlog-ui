import { useEffect, useState } from "react";
import VideoSeriedPanel from "../../components/VideoSeriesPanel";
import { useGlobalState } from "../../state";
import { BASE_API_URL } from "../../variables";

export default function Shows() {
  const [userMovies, setUserMovies] = useState([]);
  const [catalogMovies, setCatalogMovies] = useState([]);

  const [token, setToken] = useGlobalState("token");
  const [showCatalog, setShowCatalog] = useGlobalState("showCatalog");

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

      let titleCache = videos.map((video: any) => {
        return video.meta?.title;
      });
      const catalogMovies = catalogJson
        .filter((item: { type: string; meta: { title: string } }) => {
          try {
            let type: string = item.type;
            const res =
              type.startsWith("video") &&
              !titleCache.includes(item.meta?.title);
            titleCache[titleCache.length] = item.meta?.title;
            return res;
          } catch {
            return false;
          }
        })
        .map((video: any) => {
          return {
            ...video,
            meta: {
              ...video.meta,
              description: `[PREVIEW - NO ACCESS]\n ${video.meta.description}`,
            },
            tags: [...video.tags, "PREVIEW ONLY"],
            previewOnly: true,
          };
        });

      setUserMovies(videos);
      setCatalogMovies(catalogMovies);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <VideoSeriedPanel
        sortableItems={
          showCatalog ? [...userMovies, ...catalogMovies] : userMovies
        }
      ></VideoSeriedPanel>
    </div>
  );
}
