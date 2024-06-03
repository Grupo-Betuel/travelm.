import {IMediaFile, MediaTypeEnum} from "../models/mediaModel";

export const parseFileToMedia = (type: MediaTypeEnum, file: File, owner: string): IMediaFile => {
    return {
        content: URL.createObjectURL(file),
        title: file?.name || 'No title',
        owner,
        file,
        type,
    }
}

export const parseMultipleFilesToMedia = (type: MediaTypeEnum, files: File[], owner: string): IMediaFile[] => {
    return files.map(file => parseFileToMedia(type, file, owner));
}
