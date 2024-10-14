import {IMedia} from "@/models/mediaModel";

export type WhatsappSessionTypes = 'wpadilla' | 'betuelgroup' | 'betueltravel' | 'bibleAssistant';
export const whatsappSessionList: WhatsappSessionTypes[] = ['betuelgroup', 'betueltravel', 'wpadilla', 'bibleAssistant']
export const whatsappSessionKeys: { [K in WhatsappSessionTypes]: WhatsappSessionTypes } = {
    wpadilla: 'wpadilla',
    betuelgroup: 'betuelgroup',
    betueltravel: 'betueltravel',
    bibleAssistant: 'bibleAssistant',
}

export interface IAudioFile {
    content: string,
    fileName: string
}

// export interface IMessageMedia {
//     content: Buffer | string | Blob | ArrayBuffer | null;
//     type: 'audio' | 'image' | 'video';
//     caption?: string;
//     name?: string;
//     mimetype?: string;
// }

export interface IWhatsappMessage {
    // photo?: Blob;
    // audio?: IAudioFile;
    text?: string;
    media?: IMedia;
}

export const whatsappSessionNames: { [K in WhatsappSessionTypes & any]: string } = {
    betueldance: 'Betuel Dance Shop',
    betuelgroup: 'Betuel Group',
    betueltravel: 'Betuel Travel',
    wpadilla: 'Williams',
    bibleAssistant: 'Asistente Biblico',
}


export interface IWsUser {
    id?: string;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    phone?: string;
}

export interface IWsGroup {
    subject: string;
    participants: IWsUser[];
    id?: string;
    title?: string;
    description?: string;
    createAt?: any;
}

export interface IWsLabel {
    id: string;
    predefinedId: string;
    title: string;
    color: string;
    deleted?: boolean;
    recipients: IWsUser[];
}

export interface ISeed {
    groups: IWsGroup[];
    users: IWsUser[];
    labels: IWsLabel[];
}

export type WhatsappSeedTypes = 'users' | 'groups' | 'labels' | 'all';

export type WhatsappRecipientTypes = 'user' | 'group';

export type WhatsappGroupActionTypes = 'create-ws-group'
    | 'sync-ws-group'
    | 'delete-ws-group'
    | 'assign-ws-group'
