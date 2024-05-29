import {gcloudPublicURL, uploadGCloudImage} from "../api/services/gcloud.service";
import {IMedia, IMediaFile} from "../models/mediaModel";
import {generateCustomID} from "./text.utils";
import {dataURItoBlob} from "./blob.utils";

export const uploadMedia = async (media: IMediaFile): Promise<IMedia> => {
    if(!media.file) return media as IMedia;

    const type = media.file.type.split('/')[1];
    const mediaNameClean = `${media.title?.split('.')?.[0] || 'media'}`.replace(/ /g, '-').toLowerCase();
    const mediaName = `${mediaNameClean}-${Date.now()}-${generateCustomID()}.${type}`;

    // @ts-ignore
    const file = new File([media.file], mediaName);
    // return;
    const responseImage = await uploadGCloudImage(file, 'media', file.type);
    const url = `${gcloudPublicURL}${mediaName}`;
    media.content = url;

    return {
        ...media,
        title: mediaName,
        content: url,
        type: media.type,
    };
}

export const onChangeMediaToUpload = (selectedTag: string, callBack?: (content: IMedia) => void, mediaName: string = 'media') => async (event: any) => {
    const input = event.target;
    const url = event.target?.value;
    const ext = url ? '.' + url.substring(url.lastIndexOf('.') + 1).toLowerCase() : '.png';
    if (input.files && input.files[0]) {
        let fileType = input.files[0].type;

        if (fileType === 'audio/mpeg') {
            fileType = 'audio/mp3';
        }

        // @ts-ignore
        const file = new File([input.files[0]], Date.now() + ext, {type: fileType});
        // @ts-ignore
        const reader = new FileReader();
        reader.onload = async function (e: any) {
            // setLoading(true);
            const res = e.target.result;
            const mediaObject: IMedia = {
                name: file.name,
                content: res,
                type: file.type,
                tag: selectedTag,
            };
            const media = await uploadMedia(mediaObject, selectedTag, mediaName);

            callBack && media && callBack(media);
        }

        await reader.readAsDataURL(input.files[0]);
    }

}
