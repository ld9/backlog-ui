import React, { useEffect, useState } from "react";
import { createGlobalState } from "react-hooks-global-state";
import { initialState } from "../../App";
import SortedPanel from "../../components/SortedVideoPanel";
import VideoFile from "../../types/VideoFile";
import { BASE_API_URL } from "../../variables";

export default function Movies() {
  
  const { useGlobalState } = createGlobalState(initialState);
  const [token, setToken] = useGlobalState("token");

  const [userMovies, setUserMovies] = useState([]);

  useEffect(() => {
    // Do it async, boys
    (async () => {
      const media = await fetch(`${BASE_API_URL}/api/media`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const json = await media.json();
      const videos = json.filter((item: { type: string; }) => {
          let type: string = item.type;
          return type.startsWith('video');
      })

      setUserMovies(videos);
    })();
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var groupingKeys: string[] = ["Movies", "Genres", "Year", "Tags"];

  return (
    <div>
      <SortedPanel
        groupingKeys={groupingKeys}
        sortableItems={userMovies}
      ></SortedPanel>
    </div>
  );
}


// title: "Test Movie",
// horiz_uri: "",
// meta: {
//     genre: genres[Math.floor(Math.random()*genres.length)],
//     year: (1980+Math.floor(Math.random()*40)).toString(),
//     tags: ['funny', 'superhero']
// }