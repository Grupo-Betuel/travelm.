import React, {useMemo, useState} from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader, Spinner,
    Textarea, Typography,
} from "@material-tailwind/react";
import useWhatsapp from "../hooks/UseWhatsapp";
import {IClient} from "../models/clientModel";
import {
    IAudioFile, IWhatsappMessage, IWsGroup, IWsLabel,
    IWsUser,
    WhatsappSeedTypes,
    whatsappSessionKeys, whatsappSessionList, whatsappSessionNames,
    WhatsappSessionTypes
} from "../models/WhatsappModels";
import {ICustomComponentDialog} from "../models/common";
import SearchableSelect from "./SearchableSelect";
import {IoReload} from "react-icons/io5";
import {CgClose} from "react-icons/cg";
import MediaHandler, {IMediaHandled} from "../pages/dashboard/excursion/components/MediaHandler";
import {IMedia, IMediaFile} from "@/models/mediaModel";

export interface IMessaging {
    dialog?: ICustomComponentDialog;
    sessionId?: string;

}

export type SessionActionsTypes = 'restart' | 'close' | 'cancel-messaging' | WhatsappSeedTypes;

const Messaging: React.FC<IMessaging> = (
    {
        sessionId,
        dialog
    }
) => {
    const [selectedSession, setSelectedSession] = useState<string | undefined>(sessionId)
    const [message, setMessage] = useState<string>('')
    const [onlySendImagesIds, setOnlySendImagesIds] = useState<string[]>([]);
    const [medias, setMedias] = useState<IMediaHandled>()
    const [labeledUsers, setLabeledUsers] = React.useState<IWsUser[]>([]);
    const [groupedUsers, setGroupedUsers] = React.useState<IWsUser[]>([]);
    const [excludedWhatsappUsers, setExcludedWhatsappUsers] = React.useState<IWsUser[]>([]);
    const [selectedWhatsappUsers, setSelectedWhatsappUsers] = React.useState<IWsUser[]>([]);
    const lastSession = React.useRef<string>();
    const [actionToConfirm, setActionToConfirm] = React.useState<SessionActionsTypes | undefined>(undefined);
    const [fetchingSeed, setFetchingSeed] = React.useState<WhatsappSeedTypes>();
    React.useEffect(() => {
        lastSession.current = selectedSession
    }, [selectedSession]);

    const {
        logged,
        loading,
        logOut,
        handleWhatsappMessaging,
        sendMessage,
        qrElement,
        login,
        seedData,
        updateSeedDataWithLocalStorage,
        fetchWsSeedData,
        restartWhatsapp,
        stopMessaging,
        stopMessagingId,
        fetchGroupParticipants,
    } = useWhatsapp(selectedSession, true);


    const handleSendOnlyImage = (id: string) => () => {
        if (onlySendImagesIds.indexOf(id) !== -1) {
            setOnlySendImagesIds(onlySendImagesIds.filter((imageId: string) => imageId !== id))
            return;
        } else {
            setOnlySendImagesIds([...onlySendImagesIds, id])
        }
    };


    const onMessageSent = (contact: IClient) => {
        console.log('message sent', contact);
        // TODO: toast(`Mensaje enviado a ${contact.firstName}`);
    }

    const onMessageEnd = (contacts: IClient[]) => {
        console.log('messages end', contacts);
        //TODO:  toast('¡Mensajes Enviados con Exito!', {type: 'success'});
    }

    // handling whatsapp service
    React.useEffect(() => {
        handleWhatsappMessaging(onMessageSent, onMessageEnd);
    }, [logged]);

    const changeSession = (sessionKey: WhatsappSessionTypes) => {
        login(sessionKey)
    }

    const selectSession = (sessionKey: WhatsappSessionTypes) => async () => {
        // if(!logged) await destroyWsClient(selectedSession);
        setSelectedSession(sessionKey)
        changeSession(sessionKey)
        updateSeedDataWithLocalStorage(sessionKey);
    }

    const parseUrlToBase64 = (url: string, callback: (base64: Blob) => void) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            const reader = new FileReader();
            reader.onloadend = function () {
                callback((reader as any).result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const handleSendMessage = (sessionId: string) => async () => {
        const whatsappUsers = getWhatsappUsers();
        let firstMessage: IWhatsappMessage = {
            text: message,
            media: medias?.images[0] || undefined
        }

        // if(!firstMessage.text  !firstMessage.text.trim()) {

        if(medias?.images[0]) {
            delete medias?.images[0]
        }

        const allMedias = Object.keys(medias).map((key) => {
            const newMedia = medias[key] as IMedia;
            return newMedia;
        }).flat();


        console.log('all medias', allMedias, medias)

        const messages:  IWhatsappMessage[] = allMedias.map((item: any) => {
            console.log('item ', item);
            if(!item || (Array.isArray(item) && !item.length) || JSON.stringify(item) === "{}") return;

            return {media: item} as IWhatsappMessage;
        }).filter(item => !!item);

        console.log('messages =>', messages);

        await sendMessage(sessionId, whatsappUsers, [firstMessage, ...messages]);
    }

    const onChangeMessage = (e: any) => {
        const {value} = e.target;
        setMessage(value);
    }

    const handleLabelSelection = (selectedList: IWsLabel[]) => {
        let labeled: IWsUser[] = [];
        selectedList.forEach(label => labeled = [...labeled, ...label.users]);
        setLabeledUsers(labeled);
    }

    const [groupSelectedList, setGroupSelectedList] = React.useState<IWsGroup[]>([]);

    const handleGroupSelection = async (selectedList: IWsGroup[], selectedItem: IWsGroup) => {
        if (!selectedItem.id) {
            // TODO: toast('No se puede obtener los participantes de este grupo', {type: 'error'});
            return;
        }
        await fetchGroupParticipants(selectedItem.id);
        setGroupSelectedList(selectedList);
    }


    React.useEffect(() => {
        let grouped: IWsUser[] = [];
        groupSelectedList.map((g) => {
            return seedData.groups.find((group: IWsGroup) => group.id === g.id)?.participants.map((user: IWsUser) => {
                grouped.push(user);
            });
        });

        setGroupedUsers(grouped);
    }, [groupSelectedList, seedData.groups])


    const handleUserExcluding = (isRemove: boolean) => (users: IWsUser[], currentUser: IWsUser) => {
        if (isRemove) {
            setExcludedWhatsappUsers(excludedWhatsappUsers.filter(item => item.phone !== currentUser.phone));
        } else {
            setExcludedWhatsappUsers([...excludedWhatsappUsers, currentUser]);
        }
    };

    const handleUserSelection = (users: IWsUser[]) => {
        setSelectedWhatsappUsers(users);
    };

    const getWhatsappUsers = (): IWsUser[] => {
        const excluded: { [N in string]: boolean } = {};
        excludedWhatsappUsers.forEach(item => excluded[item.phone] = true);

        const data = [...labeledUsers, ...groupedUsers, ...selectedWhatsappUsers].filter(user => {
            return !excluded[user.phone]
        });

        return data;
    }

    const onChangeCustomContact = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => {

    }

    const handleSessionAction = async () => {

        if (actionToConfirm === 'restart') {
            selectedSession && await restartWhatsapp(selectedSession);
        } else if (actionToConfirm === 'close') {
            selectedSession && await logOut(selectedSession)
        } else if (actionToConfirm === 'all' || actionToConfirm === 'users' || actionToConfirm === 'groups' || actionToConfirm === 'labels') {
            setFetchingSeed(actionToConfirm);
            fetchWsSeedData(selectedSession, actionToConfirm).then(() => {
                // TODO: toast('¡Datos Actualizados!', {type: 'success'});
                setFetchingSeed(undefined);
            });

            if (actionToConfirm === 'users') {
                // ([]);
            }


            if (actionToConfirm === 'groups') {
                setGroupedUsers([]);
            }

            if (actionToConfirm === 'labels') {
                setLabeledUsers([]);
            }

        } else if (actionToConfirm === 'cancel-messaging') {
            stopMessaging();
        }
        setActionToConfirm(undefined);

    }

    const handleActionToConfirm = (value?: SessionActionsTypes) => () => {
        setActionToConfirm(value);
    }

    const handleMedia = (media: IMediaHandled) => {
        setMedias(media);
    }

    const usersData: IWsUser[] = useMemo(() => {
        return seedData.users?.map((user: IWsUser) => ({
            ...user,
            fullName: `${user.firstName || user.phone || ''} ${user.lastName || ''}`,
        })) || [];
    }, [seedData.users]);


    const content = (
        <div className="relative">
            {/*<div*/}
            {/*    title="Cerrar Sesión"*/}
            {/*    className="bi bi-power text-danger log-out-icon cursor-pointer"*/}
            {/*    onClick={handleActionToConfirm('close')} />*/}
            {
                loading ?
                    (
                        <div
                            className="absolute w-full h-full flex items-center justify-center bg-[rgba(255,255,255,.5)] z-50 rounded-2xl">
                            <Spinner className="h-16 w-16 text-blue-900/50"/>;
                            {stopMessagingId &&
                                <Button variant="text" onClick={handleActionToConfirm('cancel-messaging')} color="red">
                                    Cancelar
                                    <CgClose/>
                                </Button>}
                        </div>
                    ) : null
            }

            <div className="pb-5 flex justify-end">
                <Button onClick={handleActionToConfirm('restart')} color="yellow">Reiniciar Sesion</Button>
            </div>
            {logged &&
                <div className="flex flex-col gap-4">
                    <div className="flex items-center w-100">
                        <SearchableSelect<IWsUser>
                            multiple
                            options={usersData || []}
                            displayProperty="fullName"
                            label="Selecciona clientes"
                            disabled={fetchingSeed === 'users'}
                            onSelect={handleUserSelection}
                        />
                        <Button loading={fetchingSeed === 'users'}
                                disabled={fetchingSeed === 'users'}
                                onClick={handleActionToConfirm('users')}
                                color="blue" variant="text">
                            {fetchingSeed !== 'users' && <IoReload/>}
                        </Button>
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center">
                            <SearchableSelect<IWsGroup>
                                multiple
                                options={seedData.groups?.filter(item => !item.subject?.toLowerCase()?.includes('sin filtro'))}
                                displayProperty="title"
                                label="Selecciona un grupo"
                                disabled={fetchingSeed === 'groups'}
                                onSelect={handleGroupSelection}
                            />
                            <Button loading={fetchingSeed === 'groups'}
                                    disabled={fetchingSeed === 'groups'}
                                    onClick={handleActionToConfirm('groups')}
                                    color="blue" variant="text">
                                {fetchingSeed !== 'groups' && <IoReload/>}
                            </Button>
                        </div>
                        <SearchableSelect<IWsUser>
                            multiple
                            options={groupedUsers || []}
                            displayProperty="firstName"
                            label="Excepto estos usuarios"
                            onSelect={handleUserExcluding(false)}
                        />
                    </div>

                    <div className="flex items-center">
                        <div className="flex items-center">
                            <SearchableSelect<IWsLabel>
                                multiple
                                options={seedData.labels || []}
                                displayProperty="name"
                                label="Etiquetas"
                                disabled={fetchingSeed === 'labels'}
                                onSelect={handleLabelSelection}
                            />
                            <Button loading={fetchingSeed === 'labels'}
                                    disabled={fetchingSeed === 'labels'}
                                    onClick={handleActionToConfirm('labels')}
                                    color="blue" variant="text">
                                {fetchingSeed !== 'labels' && <IoReload/>}
                            </Button>
                        </div>
                        <SearchableSelect<IWsUser>
                            multiple
                            options={labeledUsers}
                            displayProperty="firstName"
                            label="Excepto estos usuarios"
                            onSelect={handleUserExcluding(false)}
                        />
                    </div>
                </div>}

            {!logged ?
                <div>
                    <h3 className="text-center mb-3">Escanear con Whatsapp</h3>
                    {qrElement}
                </div>
                :
                <div className="pt-5 flex flex-col gap-4">
                    <p className="mt-2">Puedes usar @firstName, @lastName, @fullName y @number para personalizar el
                        mensaje</p>
                    <Textarea
                        onChange={onChangeMessage}
                        value={message}
                        placeholder="Escribe tu mensaje aquí"
                    />

                    <MediaHandler onChange={handleMedia} handle={{images: true, audios: true}}/>

                    {/*<label className="btn btn-outline-info w-100" htmlFor="file">*/}
                    {/*    Cargar Imagen*/}
                    {/*</label>*/}
                    {/*<input*/}
                    {/*    className="invisible"*/}
                    {/*    onChange={onSelectPhoto}*/}
                    {/*    type="file"*/}
                    {/*    name="file"*/}
                    {/*    id="file"*/}
                    {/*    accept="image/png,image/jpg,image/gif,image/jpeg"*/}
                    {/*/>*/}
                    {/*<div className="mt-3 mb-5">*/}
                    {/*    {audio?.fileName && <span className="text-success">Audio: {audio?.fileName}</span>}*/}
                    {/*    <label className="btn btn-outline-info w-100" htmlFor="audioFile">*/}
                    {/*        Subir Audio*/}
                    {/*    </label>*/}
                    {/*    <input*/}
                    {/*        className="invisible"*/}
                    {/*        onChange={onSelectAudio}*/}
                    {/*        type="file"*/}
                    {/*        name="audioFile"*/}
                    {/*        id="audioFile"*/}
                    {/*        accept="audio/*"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {!dialog &&
                        <Button variant="text" color="light-green"
                                onClick={handleSendMessage(selectedSession as string)}>Send
                            Message</Button>}
                </div>
            }
            <Dialog open={!!actionToConfirm} handler={handleActionToConfirm()}>
                <DialogHeader>Confirmación</DialogHeader>
                <DialogBody>
                    ¿Estas Seguro que deseas realizar esta acción?
                </DialogBody>
                <DialogFooter>
                    <Button color="light-green" onClick={handleSessionAction}>Confirmar</Button>{' '}
                    <Button color="gray" onClick={handleActionToConfirm()}>Cancel</Button>
                </DialogFooter>
            </Dialog>
            <Dialog open={!!actionToConfirm} handler={handleActionToConfirm()}>
                <DialogHeader>Confirmación</DialogHeader>
                <DialogBody>
                    ¿Estas Seguro que deseas realizar esta acción?
                </DialogBody>
                <DialogFooter>
                    <Button color="blue" onClick={handleSessionAction}>Confirmar</Button>{' '}
                    <Button color="gray" onClick={handleActionToConfirm()}>Cancel</Button>
                </DialogFooter>
            </Dialog>
        </div>

    )
    return dialog ? (<Dialog open={dialog.open} handler={dialog.handler}>
            <DialogHeader>
                <Typography variant="h3" className="text-center w-full">Envia Mensajes</Typography>
            </DialogHeader>
            <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                {content}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="light-green" className="w-full" size="lg"
                        onClick={handleSendMessage(selectedSession as string)}>Send
                    Message</Button>
            </DialogFooter>
        </Dialog>)
        : content
}

export default Messaging;
