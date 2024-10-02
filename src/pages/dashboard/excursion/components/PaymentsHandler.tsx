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
import {SubmitHandler, useForm} from "react-hook-form";
import {IClient} from "@/models/clientModel";
import SelectControl from "@/components/SelectControl";
import FormControl from "@/components/FormControl";
import {IComment} from "@/models/commentModel";

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


    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        getValues,
        reset,
    } = useForm<IPayment>({mode: 'all', defaultValues: paymentFormData});

    const handleMedia = (media: IMediaHandled) => {
        const image = media.images && media.images[0];
        setValue('media', image as IMedia);
    };

    const addOrUpdatePayment: SubmitHandler<IPayment> = (payment) => {
        const paymentFormData = getValues();
        let paymentsData = structuredClone(payments);
        if (paymentFormData._id) {
            paymentsData = paymentsData.map(item => item._id === paymentFormData._id ? paymentFormData : item);
        } else {
            paymentsData = [...paymentsData, paymentFormData];
        }

        console.log('paymentsData', paymentsData);
        onUpdatePayment(paymentsData);
        setPaymentFormData(emptyPayment);
    };

    const startEditing = (index: number) => {
        const payment = payments[index];
        setValue('type', payment.type);
        setValue('date', payment.date);
        setValue('amount', payment.amount);
        setValue('comment', payment.comment);
        setValue('media', payment.media);
        setValue('_id', payment._id);
    };

    const cancelEditing = () => {
        reset(emptyPayment);
    };

    const handleOnDelete = (p: IPayment) => {
        onDeletePayment(p);
    }


    useEffect(() => {
        if (!paymentFormData.media) {
            // Re-render MediaHandler if media is undefined
            setPaymentFormData({...paymentFormData});
        }
    }, [paymentFormData.media]);

    console.log('paymentsFormData', paymentFormData);
    return (
        <div className="flex flex-col gap-3">
            <form onSubmit={handleSubmit(addOrUpdatePayment)}>
                    <input name="_id" disabled />
                <div className="flex gap-4">
                    <SelectControl
                        name="type"
                        control={control}
                        label="Tipo de Pago"
                        options={PAYMENT_CONSTANTS.PAYMENT_TYPES.map(type => ({
                            label: paymentTypeLabels[type],
                            value: type
                        }))}
                        rules={{required: 'El tipo de pago es requerido'}}
                        className={'w-full'}
                    />
                    <FormControl
                        name="amount"
                        control={control}
                        type={'number'}
                        label="Cantidad"
                        rules={{required: 'La cantidad es obligatoria'}}
                        className={'w-full'}
                    />
                </div>
                <FormControl
                    name="comment"
                    control={control}
                    label="Comentario (Opcional)"
                    type="textarea"
                    rules={{
                        minLength: {
                            value: 3,
                            message: 'El comentario debe tener al menos 3 caracteres',
                        },
                    }}
                />

                <MediaHandler onChange={handleMedia} medias={paymentFormData?.media ? [paymentFormData.media] : []}
                              handle={{images: true}} enableSingleSelection={true} disableUpload/>
                <div className="flex items-center gap-5">
                    {getValues('_id') ? (
                        <Button onClick={cancelEditing} color="red">
                            Cancel
                        </Button>
                    ) : null}
                    <Button type={'submit'} color={paymentFormData._id ? "blue" : "green"}>
                        {getValues('_id') ? "Guardar Cambios" : "Agregar Pago"}
                    </Button>
                </div>
            </form>
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
                                {`Type: ${paymentTypeLabels[payment.type] || payment.type}`}
                            </Typography>
                            <Typography variant="h5" color="blue-gray">
                                {`RD$${payment.amount.toLocaleString()}`}
                            </Typography>
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {payment?.comment
                                    ? payment.comment.length > 50
                                        ? `${payment.comment.slice(0, 50)}...`
                                        : payment.comment
                                    : "No comment"}
                            </Typography>
                            <Typography variant="small" color="blue-gray">
                                {new Date(payment.date).toLocaleDateString()}
                            </Typography>
                        </CardBody>
                        <CardFooter className="border-t border-blue-gray-50 p-2 mt-auto items-end">
                            <div className="flex space-x-1 justify-end">
                                {payment?.comment && payment.comment.length > 50 && (
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
