import {IMedia} from "../models/mediaModel";
import React, {useMemo} from "react";
import YouTube, {YouTubeProps} from "react-youtube";

export const useRenderMedia = () => {
    // Options for the YouTube player
    const youtubeOpts: YouTubeProps['opts'] = useMemo(() => ({
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
        },
    }), []);

    const renderMedia = (media: IMedia) => {
        switch (media?.type) {
            case 'image':
                return <img src={media.content} alt={media.title} className="h-full"/>;
            case 'video':
                // @ts-ignore
                const videoId = new URLSearchParams(new URL(media.content).search).get('v');
                return <YouTube videoId={videoId} opts={youtubeOpts} className="w-full"/>;
                return null;
            default:
                return null;
        }
    };

    return { renderMedia };
}