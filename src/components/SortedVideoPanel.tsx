import React, { useEffect, useState } from "react";
import VideoThumb from "./VideoThumb";

import '../styles/components/SortedVideoPanel.css'

export default function SortedPanel({groupingKeys, sortableItems}: {groupingKeys: string[], sortableItems: any[]}) {
    
    const [selectedGrouping, setSelectedGrouping] = useState(0);
    const [itemList, setItemList] = useState<any[]>([]);

    useEffect(() => {
        var _sortedItems;
        
        /*  0: default; title
            1: genre
            2: year
            3: tags
        */
       
        switch(selectedGrouping) {
            case 3: 
                /* Creates a list of items where for each tag an item has, it gets an entry in the list
                    this means that if an item has three tags, it will be on the list three times (once for each of the tags.) */
                let _tempSingleTagItems: any[] = [];
                sortableItems.forEach((a) => {
                    let flag = false;
                    a.meta.tags.forEach((b: any) => {
                        flag = true;
                        let c: any = JSON.parse(JSON.stringify(a));
                        c.meta.primaryTag = b;
                        _tempSingleTagItems.push(c);
                    })

                    if (!flag) {
                        let c: any = JSON.parse(JSON.stringify(a));
                        c.meta.primaryTag = "Untagged";
                        _tempSingleTagItems.push(c);
                    }
                });

                /* The list will be sorted by the tags. */
                _sortedItems = _tempSingleTagItems.sort((a, b) => a.meta.primaryTag.localeCompare(b.meta.primaryTag));
                
                break;
            case 2:
                _sortedItems = [...sortableItems].sort((a, b) => a.meta.year - b.meta.year);
                break;
            case 1:
                _sortedItems = [...sortableItems].sort((a, b) => a.meta.genre.localeCompare(b.meta.genre));
                break;
            default:
                _sortedItems = [...sortableItems].sort((a, b) => a.title.localeCompare(b.title));
        }
        
        
        setItemList(_sortedItems);
    }, [selectedGrouping, sortableItems]);
    
    const renderPanelItems = () => {
        let content: any[] = [];
        let prevMeta = "";

        itemList.forEach((video: any/* VideoFile* any for primaryTag. */, i: number) => {
            let thisMeta;
            switch(selectedGrouping) {
                case 3:
                    thisMeta = video.meta.primaryTag;
                    break;
                case 2:
                    thisMeta = video.meta.year;
                    break;
                case 1:
                    thisMeta = video.meta.genre;
                    break;
                default:
                    thisMeta = video.title[0];
            }

            if (prevMeta !== thisMeta) {
                content.push(
                    <div className="grouping-separator" key={i+1333337}>
                        <div>{thisMeta}</div>
                    </div>
                );
            }

            prevMeta = thisMeta;
            
            content.push(<VideoThumb key={i} video={video}></VideoThumb>);
        })

        return content;
    }

    return (
        <div className="sorted-panel">
            <h1>{groupingKeys[0]}</h1>
            <div className="sorted-content">
                <div className="group-select-menu">
                    {groupingKeys.map((groupKey, i) =>
                        <div key={groupKey} className={i == selectedGrouping ? "group-select-button active-select-button" : "group-select-button"} onClick={() => setSelectedGrouping(i)}>{groupKey}</div>
                    )}
                </div>
                <div key={Math.floor(Math.random()*999999)} className="display-panel">
                    {renderPanelItems()}
                </div>
            </div>
        </div>
    );
}