import React, {useMemo} from 'react';
import {Button} from '@material-tailwind/react';
import MediaHandler, {IMediaHandled} from "../MediaHandler";
import {IExcursion} from "../../../../../models/excursionModel";
import {IMedia, IMediaFile} from "../../../../../models/mediaModel";

interface MediaProps {
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => any;
}

export const MediaHandlerStep: React.FC<MediaProps> = ({excursionData, updateExcursion}) => {

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
            <MediaHandler
                onChange={onSubmitMedia}
                medias={medias}
                flyerData={excursionData.flyer as IMediaFile}
            />
        </div>
    );
};