import React, {useEffect, useMemo, useState} from 'react';
import {Button, Select, Option, Input} from '@material-tailwind/react';
import {IService, ServiceDetailActions, ServiceDetailActionsDataTypes} from "../../../../models/serviceModel";
import {IFinance} from "../../../../models/financeModel";
import {SERVICE_CONSTANTS} from "../../../../constants/service.constant";
import PaymentHandler from "./PaymentsHandler";
import {IPayment} from "../../../../models/PaymentModel";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {IExcursion} from "../../../../models/excursionModel";

import {IClient} from "../../../../models/clientModel";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {PAYMENT_CONSTANTS} from "../../../../constants/payment.constants";

interface ServiceFormProps {
    services: IService[];
    onUpdateServices: (services: IService[]) => void;
    onUpdateSingleService?: (services: IService) => void;
    service?: Partial<IService>;
}

const emptyService: IService = {
    status: 'interested',
    type: 'excursion',
    payments: [],
    finance: {price: 0, type: 'service'},
}

export const paymentService = getCrudService('payments');

const ServiceHandler: React.FC<ServiceFormProps> = ({services, onUpdateSingleService, service, onUpdateServices}) => {
    const [newService, setNewService] = useState<IService>(emptyService);
    const [deletePayment] = paymentService.useDeletePayments();

    const onConfirmAction = (type?: ServiceDetailActions, data?: ServiceDetailActionsDataTypes) => {
        switch (type) {
            case 'delete-payment':
                handleDeletePayment(data as IPayment);
                break;
        }
    }

    const onDeniedAction = (type?: ServiceDetailActions, data?: ServiceDetailActionsDataTypes) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<ServiceDetailActions, ServiceDetailActionsDataTypes>(onConfirmAction, onDeniedAction);

    useEffect(() => {
        if (service) {
            setNewService({...newService, ...service});
        }
    }, [service])
    const handleServiceChange = (field: keyof IService, value: any) => {
        setNewService({...newService, [field]: value});
    };

    const handleFinanceChange = (field: keyof IFinance, value: any) => {
        setNewService({
            ...newService,
            finance: {...newService.finance, [field]: Number(value)},
        });
    };

    const addService = () => {
        newService.finance = {
            ...newService.finance,
            type: 'service',
        }
        onUpdateServices([...services, newService]);
        setNewService(emptyService);
    };


    const handleUpdatePayment = (payments: IPayment[]) => {
        setNewService({...newService, payments});
    }

    const handleDeletePayment = (payment: IPayment) => {
        setNewService({
            ...newService,
            payments: newService.payments.filter(p => p._id !== payment._id),
        });
        payment._id && deletePayment(payment._id);
    }

    useEffect(() => {
        if (service && onUpdateSingleService) {
            onUpdateSingleService(newService);
        }
    }, [newService]);


    const allPayments = useMemo(() => {
        // const allData = ([...(service?.payments || []), ...(newService?.payments || [])]);
        const allData = ([...(newService?.payments || [])]);
        const unrepeated = new Set(allData.map(item => item._id))

        // const response: IPayment[] = Array.from(unrepeated).map(id => allData.find(item => item._id === id)) as IPayment[];
        const response: IPayment[] = allData.filter(p => {
            if (p._id) {
                return unrepeated.has(p._id);
            } else if (!p._id) {
                return true;
            }

            return false;
        }) as IPayment[];

        return response;
    }, [newService?.payments]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 bg-blue-50 p-3 rounded-md">
                <div className="flex items-center justify-between gap-3">
                    {!service?.type && <Select
                        className={!!service?.type ? "hidden" : ""}
                        label="Service Type"
                        value={service?.type || newService.type}
                        placeholder="Selecciona"
                        onChange={(e) => handleServiceChange('type', e)}
                    >
                        {SERVICE_CONSTANTS.TYPES.map(type => (
                            <Option key={type} value={type}>{type}</Option>
                        ))}
                    </Select>}
                    <Select
                        label="Estado del Servicio"
                        value={newService.status}
                        onChange={(e) => handleServiceChange('status', e)}
                    >
                        {SERVICE_CONSTANTS.STATUS_TYPES.map(status => (
                            <Option key={status} value={status}>{status}</Option>
                        ))}
                    </Select>
                </div>

                {!service?.finance?.price &&
                    <Input
                        type="number"
                        label="Price"
                        value={service?.finance?.price || newService.finance?.price}
                        disabled={!!service?.finance?.price}
                        onChange={(e) => handleFinanceChange('price', e.target.value)}
                    />
                }

                <PaymentHandler payments={allPayments} onChangePayment={handleUpdatePayment}
                                onDeletePayment={handleSetActionToConfirm('delete-payment', PAYMENT_CONSTANTS.DELETE_PAYMENT)}/>
                {!service && <Button onClick={addService} color="green" className="w-[100%]">
                    Add Service
                </Button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {
                    services.map((service, index) => (
                        <div key={index} className="relative">
                            <p>{service.type}</p>
                            <p>{service.status}</p>
                            <p>RD$ {service.finance.price.toLocaleString()}</p>
                        </div>
                    ))
                }
            </div>
            <ConfirmDialog/>
        </div>
    );
};

export default ServiceHandler;
