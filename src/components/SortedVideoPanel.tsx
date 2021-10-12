import React, { useEffect, useState } from "react";
import VideoThumb from "./VideoThumb";

import "../styles/components/SortedVideoPanel.css";
import MediaItem from "../types/MediaItem";
import MovieModal from "./MovieModal";

export default function SortedPanel({
  groupingKeys,
  sortableItems,
}: {
  groupingKeys: string[];
  sortableItems: MediaItem[];
}) {
  const [selectedGrouping, setSelectedGrouping] = useState(0);
  const [itemList, setItemList] = useState<MediaItem[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalMedia, setModalMedia] = useState<MediaItem | null>(null);

  const showMediaModal = (video: MediaItem) => {
    setShowModal(true);
    setModalMedia(video);
  };

  useEffect(() => {
    var _sortedItems;

    /*  0: default; title
            1: genre
            2: year
            3: tags
        */

    switch (selectedGrouping) {
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
        _sortedItems = [...sortableItems].sort((a, b) => {
          let am = a.meta.released || 0;
          let bm = b.meta.released || 0;
          return am - bm;
        });
        break;
      case 1:
        _sortedItems = [...sortableItems].sort((a, b) =>
          a.meta.primaryTag?.localeCompare(b.meta.primaryTag || "")
        );
        break;
      default:
        _sortedItems = [...sortableItems].sort((a, b) =>
          a.meta.title?.localeCompare(b.meta.title || "")
        );
    }

    setItemList(_sortedItems);
  }, [selectedGrouping, sortableItems]);

  const renderPanelItems = () => {
    let content: any[] = [];
    let prevMeta: string | number = "";

    itemList.forEach(
      (video: MediaItem /* VideoFile* any for primaryTag. */, i: number) => {
        let thisMeta: string | number;
        switch (selectedGrouping) {
          case 3:
            // thisMeta = (video.tags && video.tags.length > 0) ? video.tags[0] : "?";
            thisMeta = video.sortTag;
            break;
          case 2:
            thisMeta = video.meta.released || 0;
            break;
          case 1:
            thisMeta = video.meta.primaryTag || "?";
            break;
          default:
            // [0] group by first letter
            thisMeta = video.meta.title[0].toLowerCase();
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
          <VideoThumb
            key={i}
            video={video}
            setMediaModal={showMediaModal}
          ></VideoThumb>
        );
      }
    );

    return content;
  };

  return (
    <div className="sorted-panel">
      {showModal ? (
        <MovieModal media={modalMedia} setShowMedia={setShowModal} />
      ) : null}

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
              >
                {groupKey}
              </div>
            ))}
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
  );
}
