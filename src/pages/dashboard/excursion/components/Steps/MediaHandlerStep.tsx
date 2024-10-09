import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import MediaHandler, {IMediaHandled} from "../MediaHandler";
import {IExcursion} from "@/models/excursionModel";
import {IMedia, IMediaFile} from "@/models/mediaModel";

interface MediaProps {
    excursionData: IExcursion;
    updateExcursion: (data: Partial<IExcursion>) => any;
    setIsValid: (isValid: boolean) => void;

}

export const MediaHandlerStep: React.FC<MediaProps> = ({excursionData, updateExcursion, setIsValid}) => {
    const prevExcursionDataRef = useRef(excursionData);

    const onSubmitMedia = useCallback(async (data: IMediaHandled) => {

        if (JSON.stringify(prevExcursionDataRef.current) !== JSON.stringify(data)) {
            updateExcursion({
                ...data,
            });
             prevExcursionDataRef.current = data as IExcursion;
        }
    }, [updateExcursion]);


    const medias: IMedia[] = useMemo(() => {
        return ([] as IMedia[]).concat(excursionData.images || [], excursionData.videos || [], excursionData.audios || []);
    }, [excursionData.images, excursionData.audios, excursionData.videos]);

    useEffect(() => {
        setIsValid(!!excursionData.flyer);
    }, [excursionData.flyer]);
    return (
        <div>
            <MediaHandler
                onChange={onSubmitMedia}
                medias={medias}
                flyerMedia={excursionData.flyer as IMediaFile}
            />
        </div>
    );
};