import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useGlobalState } from "../state";
import { strings } from "../strings";

import "../styles/components/SortedVideoPanel.css";
import MediaItem from "../types/MediaItem";
import { SocketBeaconMessageType } from "../types/SocketInfoMessage";
import { ToastType } from "../types/ToastType";
import { BASE_API_URL } from "../variables";
import VideoThumb from "./VideoThumb";

export default function VideoSeriedPanel({
  sortableItems,
}: {
  sortableItems: MediaItem[];
}) {
  const [user, setUser] = useGlobalState("user");
  const [stage, setStage] = useGlobalState("stage");
  const [toasts, setToasts] = useGlobalState("toasts");

  const [selectedGrouping, setSelectedGrouping] = useState(0);
  const [filterString, setFilterString] = useState("");
  const [itemList, setItemList] = useState<MediaItem[]>([]);

  const [collections, setCollections] = useState([]);
  const [refresh, setRefresh] = useState(0);

  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

  const [collectionItemCache, setCollectionItemCache] = useState<{
    [key: string]: MediaItem;
  }>({});

  useEffect(() => {
    fetch(`${BASE_API_URL}/api/collection`)
      .then((res) => res.json())
      .then((json) => {
        setCollections(json);
        setRefresh(refresh + 1);

        let lsc = {};
        json.forEach((collection: any, i: number) => {
          collection.contents.forEach(async (itemId: any) => {
            const fetchResult = await fetch(
              `${BASE_API_URL}/api/media/${itemId}`
            );
            const fetchJson = await fetchResult.json();
            let obtainedJson = await fetchJson;

            lsc = {
              ...lsc,
              [obtainedJson._id]: obtainedJson,
            };

            setCollectionItemCache(lsc);
          });
        });
      });
  }, []);

  useEffect(() => {
    var _sortedItems;

    _sortedItems = sortableItems;

    let _filteredSortedItems = _sortedItems.filter((item) => {
      return JSON.stringify(item)
        .toLowerCase()
        .includes(filterString.toLowerCase());
    });

    let unique: any[] = [];
    _filteredSortedItems.forEach((item) => {
      let add = true;
      unique.forEach((item2) => {
        if (item.meta.title === item2.meta.title) {
          add = false;
        }
      });

      if (add) {
        unique.push(item);
      }
    });

    setItemList(unique);
  }, [selectedGrouping, sortableItems, filterString]);

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

      setToasts([
        ...toasts,
        {
          until: Date.now() + 2000,
          type: ToastType.GOOD,
          content: `Added "${media.meta.title}" to queue`,
        },
      ]);

      setStage({
        ...stage,
        queue: [...stage.queue, media],
      } as any);

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

  const renderPanelCollections = () => {
    let contentParent: any[] = [];

    if (!collections || collections.length == 0) {
      return;
    }

    collections.forEach((collection: any, i: number) => {
      let content: any[] = [];

      if (collection.members.includes(user._id)) {
        let marked = false;
        collection.contents.forEach(async (itemId: any, j: number) => {
          let item = collectionItemCache[itemId];

          if (item && item.type.startsWith("video")) {
            if (!marked) {
              marked = true;
              content.push(
                <div className="grouping-separator" key={i + 1000000}>
                  <div>{collection.title}</div>
                </div>
              );
            }

            content.push(
              <VideoThumb
                key={i * i + j}
                video={item}
                setMediaModal={() => {
                  addToQueueEnd(item, 0);
                }}
              ></VideoThumb>
            );
          }
        });
      }

      contentParent.push(<div className="series-thumb-parent">{content}</div>);
    });

    return contentParent;
  };

  return (
    <div className="sorted-panel">
      <div className="sorted-panel-inside">
        <h1>Video Collections</h1>
        <div className="sorted-content">
          <div className="display-panel-contain">
            <div>
              <label>
                {strings.panel_filter}:
                <input
                  type="text"
                  value={filterString}
                  onChange={(e) => {
                    setFilterString(e.target.value);
                  }}
                ></input>
              </label>
            </div>
            <div
              key={Math.floor(Math.random() * 999999)}
              className="display-panel"
            >
              {renderPanelCollections()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
