import React, { useEffect, useState } from "react";
import SortedPanel from "../../components/SortedVideoPanel";
import { useGlobalState } from "../../state";
import { strings } from "../../strings";
import { BASE_API_URL } from "../../variables";

export default function Movies() {
  const [token, setToken] = useGlobalState("token");
  const [userMovies, setUserMovies] = useState([]);

  useEffect(() => {
    (async () => {
      const media = await fetch(`${BASE_API_URL}/api/media`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const json = await media.json();
      const videos = json.filter((item: { type: string }) => {
        // Try/catch filters if the user has an item which has been deleted/doesn't exist (i think)
        try {
          let type: string = item.type;
          return type.startsWith("video");
        } catch {
          return false;
        }
      });

      setUserMovies(videos);
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
      <SortedPanel
        groupingKeys={groupingKeys}
        sortableItems={userMovies}
      ></SortedPanel>
    </div>
  );
}
