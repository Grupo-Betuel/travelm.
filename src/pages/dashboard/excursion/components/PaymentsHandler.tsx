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
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import SelectControl from "@/components/SelectControl";
import FormControl from "@/components/FormControl";
import {InfoCardItem} from "@/components/InfoCardItem";
import {BiDollar, BiEdit, BiSave, BiTrash} from "react-icons/bi";
import {FaRegSave} from "react-icons/fa";

interface PaymentHandlerProps {
    enableAddPayment?: boolean;
    payments: IPayment[];
    onChangePayment: (payments: IPayment[]) => any;
    onDeletePayment: (payment: IPayment) => any;
}

export const emptyPayment: IPayment = {type: 'cash', date: new Date(), amount: 0, comment: '', media: undefined};


const PaymentHandler: React.FC<PaymentHandlerProps> = (
    {
        payments,
        onDeletePayment,
        onChangePayment,
    }) => {
    const [selectedPayment, setSelectedPayment] = useState<IPayment | null>(null);

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IPayment>) => {
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
        formState: {errors, isValid},
        setValue,
        getValues,
        reset,
    } = useForm<IPayment>({mode: 'all', values: emptyPayment});

    const currentPayment = useWatch({control});

    const handleMedia = (media: IMediaHandled) => {
        const image = media.images && media.images[0];
        setValue('media', image as IMedia);
    };

    const addOrUpdatePayment: SubmitHandler<IPayment> = (payment) => {
        let paymentsData = structuredClone(payments);

        if (payment._id) {
            paymentsData = paymentsData.map(item => item._id === payment._id ? payment : item);
        } else {
            paymentsData = [...paymentsData, payment];
        }

        onChangePayment(paymentsData);
        reset(emptyPayment);
    };

    const startEditing = (index: number) => {
        const payment = payments[index];
        reset(payment)
    };


    const cancelEditing = () => {
        reset(emptyPayment);
    };

    const handleOnDelete = (p: IPayment) => {
        onDeletePayment(p);
    }

    return (
        <div className="flex flex-col gap-3">
            <form onSubmit={handleSubmit(addOrUpdatePayment)}>
                <input name="_id" disabled/>
                <div className="flex gap-4">
                    <SelectControl
                        name="type"
                        control={control}
                        label="Tipo de Pago"
                        options={
                            PAYMENT_CONSTANTS.PAYMENT_TYPES.map(type => ({
                                label: paymentTypeLabels[type],
                                value: type
                            }))}
                        rules={{
                            required: 'El tipo de pago es requerido'
                        }}
                        className={'w-full'}
                    />
                    <FormControl
                        name="amount"
                        control={control}
                        type={'number'}
                        label="Cantidad"
                        rules={{
                            required: 'La cantidad es obligatoria',
                            min: {
                                value: 1, message: 'Seleccione un tipo de pago'
                            }
                        }}
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
                <MediaHandler
                    onChange={handleMedia}
                    medias={currentPayment.media ? [currentPayment.media as IMedia] : []}
                    handle={{images: true}}
                    enableSingleSelection={true}
                    disableUpload
                />
                <div className="flex justify-end gap-5">
                    {getValues('_id') ? (
                        <Button onClick={cancelEditing} color="red">
                            Cancel
                        </Button>
                    ) : null}
                    <Button
                        disabled={!isValid}
                        variant="text" className="text-sm flex items-center gap-3" type={'submit'}
                        color={getValues('_id') ? "blue" : "green"}>
                        <FaRegSave className="text-md"/>
                        {getValues('_id') ? "Guardar Cambios" : "Agregar"}
                    </Button>
                </div>
            </form>
            <div className="flex items-end overflow-x-auto gap-4 pt-10 pb-2">
                {payments.map((payment, index) => (
                    <InfoCardItem
                        icon={<BiDollar className="w-4 h-4 text-white"/>}
                        key={index}
                        medias={payment.media ? [payment.media] : undefined}
                        subtitle={paymentTypeLabels[payment.type] || payment.type}
                        title={`RD$${payment.amount.toLocaleString()}`}
                        description={payment.comment}
                        actions={[
                            {
                                icon: <BiEdit className="w-5 h-5"/>,
                                text: 'Editar',
                                color: 'blue',
                                onClick: () => startEditing(index)
                            },
                            {
                                icon: <BiTrash className="w-5 h-5"/>,
                                text: 'Eliminar',
                                color: 'red',
                                onClick: () => handleSetActionToConfirm('delete')(payment)
                            }
                        ]}/>
                ))}
            </div>

            <ConfirmDialog/>
        </div>
    );
};

export default PaymentHandler;
