import React, {useEffect, useMemo, useState} from 'react';
import {Button, Input, Option, Select, Textarea, Typography} from '@material-tailwind/react';
import {
    IService,
    ServiceDetailActions,
    ServiceDetailActionsDataTypes,
    serviceStatusLabels
} from "../../../../models/serviceModel";
import {IFinance} from "../../../../models/financeModel";
import {SERVICE_CONSTANTS} from "../../../../constants/service.constant";
import PaymentHandler from "./PaymentsHandler";
import {IPayment} from "../../../../models/PaymentModel";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {PAYMENT_CONSTANTS} from "../../../../constants/payment.constants";
import ProtectedElement from "../../../../components/ProtectedElement";
import {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";

interface ServiceFormProps {
    services: IService[];
    onUpdateServices: (services: IService[]) => void;
    onUpdateSingleService?: (services: IService) => void;
    service?: Partial<IService>;
}

const emptyService: IService = {
    status: 'interested',
    type: 'excursion',
    finance: {price: 0, type: 'service'},
    seats: 1,
}

// export const paymentService = getCrudService('payments');

const ServiceHandler: React.FC<ServiceFormProps> = ({services, onUpdateSingleService, service, onUpdateServices}) => {
    const [newService, setNewService] = useState<IService>(emptyService);
    // const [deletePayment] = paymentService.useDeletePayments();

    const onConfirmAction = (type?: ServiceDetailActions, data?: ServiceDetailActionsDataTypes) => {
        switch (type) {
            case 'delete-payment':
                // handleDeletePayment(data as IPayment);
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

    useEffect(() => {
        if (service && onUpdateSingleService) {
            onUpdateSingleService(newService);
        }
    }, [newService]);


    console.log('service', service);
    // temporal fix
    const  ServiceTypeActions = false;
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-md">
                <div className="flex items-center justify-between gap-3">
                    {ServiceTypeActions && (
                        <Select
                            label="Service Type"
                            value={newService.type}
                            placeholder="Selecciona"
                            onChange={(e) => handleServiceChange('type', e)}
                        >
                            {SERVICE_CONSTANTS.TYPES.map(type => (
                                <Option key={type} value={type}>{serviceStatusLabels ? [type] : ''}</Option>
                            ))}
                        </Select>
                    )}
                    <Select
                        label="Estado del Servicio"
                        value={service?.status || newService.status}
                        onChange={(e) => handleServiceChange('status', e)}
                    >
                        {SERVICE_CONSTANTS.STATUS_TYPES.map(status => (
                            <Option key={status} value={status}>
                                {serviceStatusLabels[status]}
                            </Option>
                        ))}
                    </Select>
                    <Input
                        crossOrigin={"true"}
                        type="number"
                        label="Cantidad De Asientos"
                        value={newService.seats}
                        // disabled={!!service?.seats}
                        onChange={(e) => {
                            console.log(e.target.value)
                            const value = parseInt(e.target.value, 10);
                            if (value >= 1) {
                                handleServiceChange('seats', value);
                            }
                        }}
                        step={1}
                        min={1}
                    />
                </div>
            </div>
            <ConfirmDialog/>
        </div>
    );
};

export default ServiceHandler;