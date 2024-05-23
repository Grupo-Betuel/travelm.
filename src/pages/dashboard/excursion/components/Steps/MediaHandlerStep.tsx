import React, {useMemo} from 'react';
import {Button} from '@material-tailwind/react';
import MediaHandler, {IMediaHandled} from "../MediaHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {IMedia} from "../../../../../models/mediaModel";

interface MediaProps {
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => any;
}

export const MediaHandlerStep: React.FC<MediaProps> = ({excursionData, updateExcursion}) => {
    const [loadedMedia, setLoadedMedia] = React.useState<IMedia[]>([]);

    // const { mediaData}
    const addMedia = (type: string) => {
        const newMedia = {type, content: 'http://example.com/new-media.jpg'}; // Simplified example
        const updatedMedia = excursionData.media ? {
            ...excursionData.media,
            [type]: [...excursionData.media[type], newMedia]
        } : {[type]: [newMedia]};
        updateExcursion({media: updatedMedia});
    };

    const onSubmitMedia = async (data: IMediaHandled) => {
        updateExcursion({
            ...data,
        });
    }

    const medias: IMedia[] = useMemo(() => {
        return ([] as IMedia[]).concat(excursionData.images || [], excursionData.videos || [], excursionData.audios || []);
    }, [excursionData.images, excursionData.audios, excursionData.videos]);

    return (
        <div>
            <Button color="blue" onClick={() => addMedia('images')}>Add Image</Button>
            <Button color="blue" onClick={() => addMedia('videos')}>Add Video</Button>
            {/* Displaying media for demonstration purposes */}
            {/*{formData.media?.images?.map((image, index) => (*/}
            {/*    <div key={index}>*/}
            {/*        <img src={image.content} alt="Uploaded" />*/}
            {/*    </div>*/}
            {/*))}*/}

            <MediaHandler
                onChange={onSubmitMedia}
                medias={medias}
            />

        </div>
    );
};