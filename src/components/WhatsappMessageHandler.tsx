import React, {useState} from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    Textarea,
} from "@material-tailwind/react";
import InputMask from "react-input-mask";
import useWhatsapp from "../hooks/UseWhatsapp";
import {IClient} from "../models/clientModel";
import {
    IAudioFile, IWsGroup, IWsLabel,
    IWsUser,
    WhatsappSeedTypes,
    whatsappSessionKeys, whatsappSessionList, whatsappSessionNames,
    WhatsappSessionTypes
} from "../models/WhatsappModels";
import {ICustomComponentDialog} from "../models/common";
import SearchableSelect from "./SearchableSelect";
import {IoReload} from "react-icons/io5";

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
    const [photo, setPhoto] = useState<any>()
    const [audio, setAudio] = useState<IAudioFile>()
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

    const handleSendMessage = (sessionId: WhatsappSessionTypes) => async () => {
        const whatsappUsers = getWhatsappUsers();
        sendMessage(sessionId, whatsappUsers, {text: message, photo, audio});
    }

    const onChangeMessage = (e: any) => {
        const {value} = e.target;
        setMessage(value);
    }

    /* onSelectPhoto, select the photo to set it in order  we can send it*/
    const onSelectPhoto = async (event: any) => {

        const {files} = event.target;
        if (FileReader && files.length) {
            const fr = new FileReader();

            fr.onload = async () => {
                setPhoto(fr.result);
            }

            fr.readAsDataURL(files[0]);
        }
    }

    const onSelectAudio = async (event: any) => {
        const {files} = event.target;
        if (FileReader && files.length) {
            const fr = new FileReader();
            const file = files[0];

            fr.onload = async () => {
                setAudio({content: fr.result as any, fileName: file.name});
                // TODO: toast('Audio cargado con exito', {type: 'success'});
            }
            fr.readAsDataURL(file);
        }
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

    const handleUserSelection = (isRemove: boolean) => (users: IWsUser[], currentUser: IWsUser) => {
        if (isRemove) {
            setSelectedWhatsappUsers(selectedWhatsappUsers.filter(item => item.phone !== currentUser.phone));
        } else {
            setSelectedWhatsappUsers([...selectedWhatsappUsers, currentUser]);
        }
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
            await restartWhatsapp(selectedSession);
        } else if (actionToConfirm === 'close') {
            await logOut(selectedSession)
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


    const content = (
        <div className="position-relative">
            {/*<div className="d-flex w-100">*/}
            {/*    {*/}
            {/*        whatsappSessionList.map((sessionKey, key) => (*/}
            {/*            <div onClick={selectSession(sessionKey)} key={key}>*/}
            {/*                <span>{whatsappSessionNames[sessionKey]}</span>*/}
            {/*            </div>*/}
            {/*        ))*/}
            {/*    }*/}
            {/*</div>*/}
            <div
                title="Cerrar Sesión"
                className="bi bi-power text-danger log-out-icon cursor-pointer"
                onClick={handleActionToConfirm('close')}/>
            {
                loading ?
                    (
                        <div className="loading-sale-container">
                            {/* TODO: <Spinner animation="grow" variant="secondary"/>*/}
                            {stopMessagingId &&
                                <Button onClick={handleActionToConfirm('cancel-messaging')} color="danger">
                                    Cancelar
                                    <i className={`bi bi-x-lg`}/>
                                </Button>}
                        </div>
                    ) : null
            }

            <div className="messaging-actions">
                <Button onClick={handleActionToConfirm('restart')} color="warning" outline>Reiniciar Sesion</Button>
            </div>
            {!!logged && <>
                <InputMask className="form-control mb-3" placeholder="Numeros de whatsapp"
                           onChange={onChangeCustomContact}
                           mask="+1 (999) 999-9999"/>
                <div className="d-flex align-items-center gap-2 w-100 mb-3 users-multiselect-wrapper">
                    <Button disabled={fetchingSeed === 'users'} onClick={handleActionToConfirm('users')} color="blue"><i
                        className={`bi bi-arrow-clockwise ${fetchingSeed === 'users' ? 'rotate' : ''}`}></i></Button>
                </div>

                <div className="mb-3 flex items-center">
                    <div className="flex items-center">
                        <SearchableSelect<IWsGroup>
                            multiple
                            options={seedData.groups.filter(item => !item.subject?.toLowerCase()?.includes('sin filtro'))}
                            displayProperty="subject"
                            label="Selecciona un grupo"
                            disabled={fetchingSeed === 'groups'}
                            onSelect={handleGroupSelection}
                        />
                        <Button loading={fetchingSeed === 'groups'}
                                disabled={fetchingSeed === 'groups'}
                                onClick={handleActionToConfirm('groups')}
                                color="blue" variant="text">
                            <IoReload/>
                        </Button>
                    </div>
                    <SearchableSelect<IWsUser>
                        multiple
                        options={labeledUsers || []}
                        displayProperty="firstName"
                        label="Excepto estos usuarios"
                        onSelect={handleUserExcluding(false)}
                    />
                </div>

                <div className="mb-3 flex items-center">
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
                            <IoReload/>
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
            </>}

            {!logged ?
                <div>
                    <h3 className="text-center mb-3">Escanear con Whatsapp</h3>
                    {qrElement}
                </div>
                :
                <div>
                    <p className="mt-2">Puedes usar @firstName, @lastName, @fullName y @number para personalizar el
                        mensaje</p>
                    <Textarea
                        className="mb-3 w-100"
                        onChange={onChangeMessage}
                    />
                    {!!photo &&
                        <div>
                            <img src={photo} alt=""/>
                        </div>}
                    <div className="mt-3 mb-5">
                        <label className="btn btn-outline-info w-100" htmlFor="file">
                            Cargar Imagen
                        </label>
                        <input
                            className="invisible"
                            onChange={onSelectPhoto}
                            type="file"
                            name="file"
                            id="file"
                            accept="image/png,image/jpg,image/gif,image/jpeg"
                        />
                    </div>
                    <div className="mt-3 mb-5">
                        {audio?.fileName && <span className="text-success">Audio: {audio?.fileName}</span>}
                        <label className="btn btn-outline-info w-100" htmlFor="audioFile">
                            Subir Audio
                        </label>
                        <input
                            className="invisible"
                            onChange={onSelectAudio}
                            type="file"
                            name="audioFile"
                            id="audioFile"
                            accept="audio/*"
                        />
                    </div>
                    <Button className="float-right" color="light-green" outline
                            onClick={handleSendMessage(selectedSession)}>Send
                        Message</Button>
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
                Envia Mensajes
            </DialogHeader>
            <DialogBody>
                {content}
            </DialogBody>
        </Dialog>)
        : content
}

export default Messaging;
