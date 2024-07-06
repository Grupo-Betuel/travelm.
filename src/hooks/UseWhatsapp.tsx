import React from "react";
import QRCode from 'qrcode';
import * as io from "socket.io-client";
import {ISeed, IWhatsappMessage, IWsUser, WhatsappSeedTypes, WhatsappSessionTypes} from "../models/WhatsappModels";
import {localStorageImpl} from "../utils/localStorage.utils";
import {CONNECTED_EVENT, onSocketOnce, PROD_SOCKET_URL} from "../utils/socket.utils";
import {
    cancelWhatsappMessaging,
    closeWhatsappServices, getGroupChatParticipants,
    getWhatsappSeedData,
    restartWhatsappServices, sendWhatsappMessage,
    startWhatsappServices
} from "../api/services/whatsapp.service";
import {WhatsappEvents} from "../models/socket-events";
import {IClient} from "../models/clientModel";


export const whatsappSeedStorePrefix = 'whatsappSeedData::';

const useWhatsapp = (whatsappSessionId?: string, autologin = false) => {
    const [logged, setLogged] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [stopMessagingId, setStopMessagingId] = React.useState('');
    const [socket, setSocket] = React.useState<io.Socket>();
    const [seedData, setSeedData] = React.useState<ISeed>({groups: [], users: [], labels: []});

    React.useEffect(() => {
        if (!whatsappSessionId) return;
        const localData = localStorageImpl.getItem(`${whatsappSeedStorePrefix}${whatsappSessionId}`)
        const storedSeedData = localData && JSON.parse(localData);
        storedSeedData && setSeedData(storedSeedData);
    }, []);


    React.useEffect(() => {
        if (!socket) {
            setSocket(io.connect(PROD_SOCKET_URL));
        }
    }, [])

    const startWhatsapp = async (start: boolean, sessionId: string, removeSession?: boolean) => {
        const response: any = await (await startWhatsappServices(start, sessionId, removeSession)).json();
        return response;
    }

    const restartWhatsapp = async (sessionId: string) => {
        const response: any = await (await restartWhatsappServices(sessionId)).json();
        return response;
    }

    const closeWhatsapp = async (sessionId: string) => {
        const response: any = await (await closeWhatsappServices(sessionId)).json();
        return response;
    }

    const updateSeedDataWithLocalStorage = (sessionKey: string) => {
        const localData = localStorageImpl.getItem(`${whatsappSeedStorePrefix}${sessionKey}`)
        const storedSeedData = localData && JSON.parse(localData);
        // const newSeed = JSON.parse(localStorageImpl.getItem(`${whatsappSeedStorePrefix}${sessionKey}`) || '[]');
        storedSeedData && setSeedData(storedSeedData);
    }

    const login = async (sessionId: string) => {
        updateSeedDataWithLocalStorage(sessionId);
        return startWhatsapp(true, sessionId).then(res => {
            const {status} = res;
            // TODO: toast(`Whatsapp is ${status}`);
            setLogged(status === 'connected')
            setLoading(status !== 'connected')
        });
    }

    const logOut = async (sessionId: string) => {
        return closeWhatsapp(sessionId);
    };

    const destroyWsClient = async (sessionId: WhatsappSessionTypes) => {
        setLoading(true);
        await startWhatsapp(false, sessionId);
        setLoading(false);
    };

    const generateQr = (data: any) => {
        const canvas = document.getElementById('canvas-qr');
        if (canvas && data) {
            QRCode.toCanvas(canvas, data, function (error) {
                if (error) console.error('qr error:', error);
            })
        }
    }

    const fetchWsSeedData = async (sessionId = whatsappSessionId, seedType: WhatsappSeedTypes) => {
        if (!sessionId) return;
        const emptySeed = seedData.groups?.length === 0 && seedData.users?.length === 0 && seedData.labels?.length === 0;
        setLoading(emptySeed)
        const data = await (await getWhatsappSeedData(sessionId, seedType)).json()
        if (!data.error) {
            const localData = JSON.parse(localStorageImpl.getItem(`${whatsappSeedStorePrefix}${sessionId}`) || '{}');
            localStorageImpl.setItem(`${whatsappSeedStorePrefix}${sessionId}`, JSON.stringify({...localData, ...data}));
            setSeedData({...seedData, ...data});
        }
        setLoading(false);
    }

    const fetchGroupParticipants = async (groupChatId: string) => {
        if (!whatsappSessionId) return;
        setLoading(true);
        const data = await (await getGroupChatParticipants(whatsappSessionId, groupChatId)).json();
        const localData = JSON.parse(localStorageImpl.getItem(`${whatsappSeedStorePrefix}${whatsappSessionId}`) || '{}');

        if (!data.error) {
            localData.groups = localData.groups.map((group: any) => {
                if (group.id === groupChatId) {
                    group.participants = data.participants;
                }
                return group;
            });

            localStorageImpl.setItem(`${whatsappSeedStorePrefix}${whatsappSessionId}`, JSON.stringify({...localData}));

            setSeedData({...seedData, ...localData});
        }

        setLoading(false);

        return data.participants as IWsUser[];
    }

    // handling whatsapp service
    React.useEffect(() => {
        if (socket) {
            generateQr('initinitinitinitinitinitinitinitinitinitinitinitinitinitinit');
            socket.on(CONNECTED_EVENT, () => {
                onSocketOnce(socket, WhatsappEvents.ON_LOADING, ({loading}) => {
                    setLoading(loading)
                })
                // generating qr code
                onSocketOnce(socket, WhatsappEvents.ON_QR, ({qrCode}) => {
                    generateQr(qrCode);
                    setLoading(false);
                });

                onSocketOnce(socket, WhatsappEvents.ON_AUTH_SUCCESS, ({sessionId}) => {
                    setLogged(true)
                    setLoading(false)
                });

                onSocketOnce(socket, WhatsappEvents.ON_AUTH_FAILED, async () => {
                    setLogged(false)
                    setLoading(false);
                });

                onSocketOnce(socket, WhatsappEvents.ON_READY, () => {
                    // TODO: toast('¡Whatsapp listo para usar!');
                    setLoading(false);
                });

                onSocketOnce(socket, WhatsappEvents.ON_LOGOUT, () => {
                    // TODO: toast('Sesión de Whatsapp Cerrada');
                    setLogged(false);
                });
                whatsappSessionId && autologin && login(whatsappSessionId)
            })
        }

        return () => socket ? socket.disconnect() : {} as any;
    }, [socket]);

    const handleWhatsappMessaging = (sent: (contact: IClient) => any, end: (contacts: IClient[]) => any) => {
        if (socket) {
            onSocketOnce(socket, WhatsappEvents.ON_SENT_MESSAGE, sent);
            onSocketOnce(socket, WhatsappEvents.ON_END_MESSAGE, end);
        }
    }

    const sendMessage = async (sessionId: string, contacts: (IClient | IWsUser)[], message: IWhatsappMessage) => {
        const {stopMessagesId} = await sendWhatsappMessage(sessionId, contacts, message);
        setStopMessagingId(stopMessagesId);
    }

    const stopMessaging = async () => {
        await cancelWhatsappMessaging(stopMessagingId);
        setStopMessagingId('');
    }


    return {
        logged,
        loading,
        login,
        logOut,
        handleWhatsappMessaging,
        sendMessage,
        setLogged,
        setLoading,
        seedData,
        qrElement: <canvas id="canvas-qr" style={{width: "500px", height: "500px"}}/>,
        destroyWsClient,
        fetchWsSeedData,
        updateSeedDataWithLocalStorage,
        restartWhatsapp,
        stopMessaging,
        stopMessagingId,
        fetchGroupParticipants
    };

}

export default useWhatsapp
