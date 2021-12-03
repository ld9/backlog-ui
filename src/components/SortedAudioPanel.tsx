import React, { useEffect, useState } from "react";
import { socket } from "../socket";
import { useGlobalState } from "../state";
import { strings } from "../strings";

import "../styles/components/SortedVideoPanel.css";
import MediaItem from "../types/MediaItem";
import { SocketBeaconMessageType } from "../types/SocketInfoMessage";
import { ToastType } from "../types/ToastType";
import { BASE_API_URL } from "../variables";
import AudioThumb from "./AudioThumb";

export default function SortedAudioPanel({
  groupingKeys,
  sortableItems,
}: {
  groupingKeys: string[];
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

  const [collectionItemCache, setCollectionItemCache] = useState<{
    [key: string]: MediaItem;
  }>({});

  const [languageCode, setLanguageCode] = useGlobalState("language");

  useEffect(() => {
    strings.setLanguage(languageCode);
  }, [languageCode]);

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

    /*  0: default; title
            1: artist
            2: album
            3: tags
        */

    switch (selectedGrouping) {
      case 4:
        _sortedItems = sortableItems;
        break;
      case 3:
        /* Creates a list of items where for each tag an item has, it gets an entry in the list
                    this means that if an item has three tags, it will be on the list three times (once for each of the tags.) */
        let _tempSingleTagItems: any[] = [];
        sortableItems.forEach((a: MediaItem) => {
          let flag = false;
          a.tags.forEach((b: any) => {
            flag = true;
            let c: any = JSON.parse(JSON.stringify(a));
            c.sortTag = b;
            _tempSingleTagItems.push(c);
          });

          if (!flag) {
            let c: any = JSON.parse(JSON.stringify(a));
            c.sortTag = "Untagged";
            _tempSingleTagItems.push(c);
          }
        });

        /* The list will be sorted by the tags. */
        _sortedItems = _tempSingleTagItems.sort((a, b) =>
          a.sortTag.localeCompare(b.sortTag)
        );

        break;
      case 2:
        _sortedItems = [...sortableItems].sort((a, b) =>
          a.meta.album?.localeCompare(b.meta.album || "")
        );
        break;
      case 1:
        _sortedItems = [...sortableItems].sort((a, b) =>
          a.meta.artist?.localeCompare(b.meta.artist || "")
        );
        break;
      default:
        _sortedItems = [...sortableItems].sort((a, b) =>
          a.meta.title?.localeCompare(b.meta.title || "")
        );
    }

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

  const renderPanelCollections = () => {
    let content: any[] = [];

    if (!collections || collections.length == 0) {
      console.log("no collections");
      return;
    }

    collections.forEach((collection: any, i) => {
      if (collection.members.includes(user._id)) {
        let marked = false;
        collection.contents.forEach(async (itemId: any) => {
          let item = collectionItemCache[itemId];

          if (item && item.type.startsWith("audio")) {
            if (!marked) {
              marked = true;
              content.push(
                <div className="grouping-separator" key={i + 1000000}>
                  <div>{collection.title}</div>
                </div>
              );
            }

            content.push(
              <AudioThumb
                key={i}
                track={item}
                setMediaModal={() => {
                  addToQueueEnd(item, 0);
                }}
              ></AudioThumb>
            );
          }
        });
      }
    });

    return content;
  };

  const renderPanelItems = () => {
    let content: any[] = [];
    let prevMeta: string | number = "";

    if (selectedGrouping == 4) {
      return renderPanelCollections();
    }

    itemList.forEach((audio: MediaItem, i: number) => {
      let thisMeta: string | number;
      switch (selectedGrouping) {
        case 3:
          thisMeta = audio.sortTag;
          break;
        case 2:
          thisMeta = audio.meta.album || 0;
          break;
        case 1:
          thisMeta = audio.meta.artist || "?";
          break;
        default:
          // [0] group by first letter
          thisMeta = audio.meta.title[0].toLowerCase();
      }

      if (prevMeta !== thisMeta) {
        content.push(
          <div className="grouping-separator" key={i + 1000000}>
            <div>{thisMeta}</div>
          </div>
        );
      }

      prevMeta = thisMeta;

      content.push(
        <AudioThumb
          key={i}
          track={audio}
          setMediaModal={() => {
            addToQueueEnd(audio, 0);
          }}
        ></AudioThumb>
      );
    });

    return content;
  };

  return (
    <div className="sorted-panel">
      <div className="sorted-panel-inside">
        <h1>{groupingKeys[selectedGrouping]}</h1>
        <div className="sorted-content">
          <div className="group-select-menu">
            {groupingKeys.map((groupKey, i) => (
              <div
                key={groupKey}
                className={
                  i == selectedGrouping
                    ? "group-select-button active-select-button"
                    : "group-select-button"
                }
                onClick={() => setSelectedGrouping(i)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSelectedGrouping(i)
                  }
                }}
              >
                {groupKey}
              </div>
            ))}
          </div>
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
              {renderPanelItems()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
