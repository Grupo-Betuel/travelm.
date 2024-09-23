// PaymentHandler.tsx
import React, {useEffect, useState} from 'react';
import {
    Button,
    Input,
    Select,
    Option,
    Textarea,
    CardFooter,
    Card,
    Dialog,
    DialogHeader, DialogBody, DialogFooter
} from '@material-tailwind/react';
import {IPayment, paymentTypeLabels} from "@/models/PaymentModel";
import DatePicker from "../../../../components/DatePicker";
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid";
import {PAYMENT_CONSTANTS} from "@/constants/payment.constants";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import MediaHandler, {IMediaHandled} from "./MediaHandler";
import {IMedia} from "@/models/mediaModel";
import {AppImage} from "@/components/AppImage";
import {CardBody, CardHeader, Typography} from '@material-tailwind/react';
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {IExpense} from "@/models/ExpensesModel";

interface PaymentHandlerProps {
    enableAddPayment?: boolean;
    payments: IPayment[];
    onChangePayment: (payments: IPayment[]) => any;
    onUpdatePayment: (payments: IPayment[]) => any;
    onDeletePayment: (payment: IPayment) => any;
}

export const emptyPayment: IPayment = {type: 'cash', date: new Date(), amount: 0, comment: '', media: undefined};


const PaymentHandler: React.FC<PaymentHandlerProps> = (
    {
        payments,
        onDeletePayment,
        onChangePayment,
        onUpdatePayment
    }) => {
    // const [payment, setPayment] = useState<IPayment[]>(payments)
    const [paymentFormData, setPaymentFormData] = useState<IPayment>(emptyPayment);
    const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IPayment>) => {
        console.log('confirm action', type, data);
        switch (type) {
            case 'delete':
                handleOnDelete(data as IPayment);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IPayment>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IPayment>>(onConfirmAction, onDeniedAction);


    const handleInputChange = (field: keyof IPayment, value: any) => {
        setPaymentFormData({ ...paymentFormData, [field]: value });
    };

    const addOrUpdatePayment = () => {
        let paymentsData = structuredClone(payments);
        if (paymentFormData._id) {
            paymentsData = paymentsData.map(item => item._id === paymentFormData._id ? paymentFormData : item);
        } else {
            paymentsData = [...paymentsData, { ...paymentFormData }];
        }

        onUpdatePayment(paymentsData);
        setPaymentFormData(emptyPayment);
    };

    const startEditing = (index: number) => {
        setPaymentFormData(payments[index])
    };

    const cancelEditing = () => {
        setPaymentFormData(emptyPayment);
    };

    const handleOnDelete = (p: IPayment) => {
        onDeletePayment(p);
    }

    const handleMedia = (media: IMediaHandled) => {
        const image = media.images && media.images[0];
        if (paymentFormData._id) {
            const updatedPayments = payments.map(payment =>
                payment._id === paymentFormData._id ? { ...payment, media: image as IMedia } : payment
            );
            onChangePayment(updatedPayments);
        } else {
            setPaymentFormData({ ...paymentFormData, media: image as IMedia });
        }
    };

    useEffect(() => {
        if (!paymentFormData.media) {
            // Re-render MediaHandler if media is undefined
            setPaymentFormData({ ...paymentFormData });
        }
    }, [paymentFormData.media]);

    console.log('paymentsFormData', paymentFormData);
    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-between">
                <Select
                    label="Tipo de Pago"
                    value={paymentFormData.type}
                    onChange={(e) => handleInputChange('type', e)}
                >
                    {PAYMENT_CONSTANTS.PAYMENT_TYPES.map(type => (
                        <Option key={type} value={type}>{paymentTypeLabels[type]}</Option>
                    ))}
                </Select>
                <Input
                    crossOrigin={false}
                    type="number"
                    label="Cantidad"
                    value={paymentFormData.amount.toString()}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                />
            </div>
            <Textarea
                rows={1}
                label="Comentario (Opcional)"
                value={paymentFormData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
            />
            <div className="flex items-center gap-3 justify-between">
                <DatePicker
                    label="Fecha"
                    onChange={date => handleInputChange('date', date)}
                    date={paymentFormData.date}
                />
            </div>
            <MediaHandler onChange={handleMedia} medias={paymentFormData?.media ? [paymentFormData.media] : []} handle={{images: true}} enableSingleSelection={true} disableUpload/>
            <div className="flex items-center gap-5">
                {paymentFormData._id ? (
                    <Button onClick={cancelEditing} color="red">
                        Cancel
                    </Button>
                ): null}
                <Button onClick={addOrUpdatePayment} color={paymentFormData._id ? "blue" : "green"}>
                    {paymentFormData._id ? "Guardar Cambios" : "Agregar Pago"}
                </Button>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4">
                {payments.map((payment, index) => (
                    <Card className="border border-blue-gray-100 shadow-sm h-full space-y-4" key={index}>
                        {payment.media && (
                            <CardHeader className="h-32 w-full mx-0 p-0">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    navigation
                                    pagination={{clickable: true}}
                                    className="relative h-full rounded-md"
                                >
                                    <SwiperSlide>
                                        <AppImage src={payment.media.content} alt={payment.media.title}/>
                                    </SwiperSlide>
                                </Swiper>
                            </CardHeader>
                        )}
                        <CardBody className="p-2 text-right">
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {`Type: ${payment.type}`}
                            </Typography>
                            <Typography variant="h5" color="blue-gray">
                                {`RD$${payment.amount.toLocaleString()}`}
                            </Typography>
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {payment.comment.length > 50
                                    ? `${payment.comment.slice(0, 50)}...`
                                    : payment.comment}
                            </Typography>
                            <Typography variant="small" color="blue-gray">
                                {new Date(payment.date).toLocaleDateString()}
                            </Typography>
                        </CardBody>
                        <CardFooter className="border-t border-blue-gray-50 p-2 mt-auto items-end">
                            <div className="flex space-x-1 justify-end">
                                {payment?.comment?.length > 50 && (
                                    <Button
                                        variant="text"
                                        className="p-2"
                                        color="blue"
                                        onClick={() => setSelectedPayment(payment)}
                                    >
                                        Ver más
                                    </Button>
                                )}
                                <Button
                                    variant="text"
                                    className="p-2"
                                    color="blue"
                                    onClick={() => startEditing(index)}
                                >
                                    <PencilIcon className="w-5 h-5"/>
                                </Button>
                                <Button
                                    className="p-2"
                                    variant="text"
                                    color="red"
                                    onClick={() => handleSetActionToConfirm('delete')(payment)}
                                >
                                    <TrashIcon className="w-5 h-5"/>
                                </Button>
                            </div>
                        </CardFooter>
                        {selectedPayment && (
                            <Dialog open={true} handler={() => setSelectedPayment(null)}>
                                <DialogHeader>{selectedPayment.type}</DialogHeader>
                                <DialogBody divider>
                                    <Typography>{selectedPayment.comment}</Typography>
                                </DialogBody>
                                <DialogFooter>
                                    <Button variant="text" color="blue" onClick={() => setSelectedPayment(null)}>
                                        Cerrar
                                    </Button>
                                </DialogFooter>
                            </Dialog>
                        )}
                    </Card>
                ))}
            </div>

            <ConfirmDialog/>
        </div>
    );
};

export default PaymentHandler;
