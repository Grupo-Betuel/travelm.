import React, {useState} from "react";
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
    IWsUser, WhatsappRecipientTypes,
    WhatsappSeedTypes,
    WhatsappSessionTypes
} from "../models/WhatsappModels";
import {ICustomComponentDialog} from "../models/common";
import {CgClose} from "react-icons/cg";
import {IMediaHandled} from "../pages/dashboard/excursion/components/MediaHandler";
import {useAuth} from "@/context/authContext";
import ExcursionMessagesHandler from "@/components/ExcursionMessagesHandler";
import {IExcursion} from "@/models/excursionModel";
import {IExcursionMessage} from "@/models/ExcursionConfigurationModels";

export interface IWhatsappExcursionMessageHandler {
    dialog?: ICustomComponentDialog;
    excursion: IExcursion;
    recipients: IClient[];
    recipientType: WhatsappRecipientTypes;
}

export type SessionActionsTypes = 'restart' | 'close' | 'cancel-messaging' | WhatsappSeedTypes;

const WhatsappExcursionMessageHandler: React.FC<IWhatsappExcursionMessageHandler> = (
    {
        // sessionId,
        dialog,
        excursion,
        recipients,
        recipientType,
    }
) => {
    const [selectedSession, setSelectedSession] = useState<string | undefined>('')
    const [onlySendImagesIds, setOnlySendImagesIds] = useState<string[]>([]);
    const [medias, setMedias] = useState<IMediaHandled>()
    const lastSession = React.useRef<string>();
    const [actionToConfirm, setActionToConfirm] = React.useState<SessionActionsTypes | undefined>(undefined);
    const [fetchingSeed, setFetchingSeed] = React.useState<WhatsappSeedTypes>();
    const {user: authUser} = useAuth();
    const [excursionMessages, setExcursionMessages] = useState<IExcursionMessage[]>([])

    const onChangeExcursionMessage = (messages: IExcursionMessage[]) => {
        setExcursionMessages(messages);
    }

    React.useEffect(() => {
        lastSession.current = selectedSession
    }, [selectedSession]);

    React.useEffect(() => {
        setSelectedSession(authUser?.organization?.sessionId)
    }, [authUser]);

    //
    // React.useEffect(() => {
    //     setSelectedSession(sessionId)
    // }, [sessionId]);


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

    const handleSendMessage = (wsSessionId: string = selectedSession || '') => async () => {
        // let firstMessage: IWhatsappMessage = {
        //     text: message,
        //     media: medias?.images[0] || undefined
        // }
        //
        // // if(!firstMessage.text  !firstMessage.text.trim()) {
        //
        // if (medias?.images[0]) {
        //     delete medias?.images[0]
        // }
        //
        // const allMedias = Object.keys(medias as  any).map((key) => {
        //     const newMedia = (medias as any)[key] as IMedia;
        //     return newMedia;
        // }).flat();
        //
        //
        // console.log('all medias', allMedias, medias)
        //
        // const messages: IWhatsappMessage[] = allMedias.map((item: any) => {
        //     console.log('item ', item);
        //     if (!item || (Array.isArray(item) && !item.length) || JSON.stringify(item) === "{}") return;
        //
        //     return {media: item} as IWhatsappMessage;
        // }).filter(item => !!item);

        let recipientsData: IWsUser[] = structuredClone(recipients);

        if (recipientType === 'group') {
            recipientsData = [{
                id: excursion.whatsappGroupID
            }]
        }

        await sendMessage(wsSessionId, recipientsData, excursionMessages);
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


    const content = (
        <div className="relative">
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
            {!logged ?
                <div>
                    <h3 className="text-center mb-3">Escanear con Whatsapp</h3>
                    {qrElement}
                </div>
                :
                <div className="pt-5 flex flex-col gap-4">
                    <ExcursionMessagesHandler
                        enableCustomMessage={true}
                        onChange={onChangeExcursionMessage}
                        initialMessages={excursion.configuration.messages}/>
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
    return dialog ? (<Dialog open={dialog.open} handler={dialog.handler} dismiss={{enabled: false}}>
            <DialogHeader className="flex justify-between items-center gap-2">
                <Typography variant="h3" className="text-center w-full">Envia Mensajes</Typography>
                <CgClose color="red" onClick={dialog.handler}/>
            </DialogHeader>
            <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                {content}
                <Button color="light-green" variant="outlined" className="w-full" size="lg"
                        onClick={handleSendMessage(selectedSession as string)}>Enviar Mensajes</Button>
            </DialogBody>
            <DialogFooter className="flex justify-end">
                <Button variant="text" color="red" size="lg"
                        onClick={dialog.handler}>Cerrar</Button>
            </DialogFooter>
        </Dialog>)
        : content
}

export default WhatsappExcursionMessageHandler;
