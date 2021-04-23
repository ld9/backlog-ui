import React from "react";
import SortedPanel from "../../components/SortedVideoPanel";
import VideoFile from "../../types/VideoFile";

export default function Movies() {
    
    var groupingKeys: string[] = [
        'Movies',
        'Genres',
        'Year',
        'Tags'
    ];
    
    var genres = ['Action', 'Sci-Fi', 'Adventure', 'Drama', 'Comedy'];

    var demoMovies:VideoFile[] = [];
    for (let i = 0; i < 20; i++) {
        let demoFile:VideoFile = {
            title: "Test Movie",
            horiz_uri: "",
            meta: {
                genre: genres[Math.floor(Math.random()*genres.length)],
                year: (1980+Math.floor(Math.random()*40)).toString(),
                tags: ['funny', 'superhero']
            }
            
        }
        demoMovies.push(demoFile);
    }

    return (
        <div>
            <SortedPanel groupingKeys={groupingKeys} sortableItems={demoMovies} ></SortedPanel>
        </div>
    );
}