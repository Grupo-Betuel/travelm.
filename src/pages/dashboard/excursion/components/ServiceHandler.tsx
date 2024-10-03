import React, {useEffect} from 'react';
import {
    IService,
    serviceStatusLabels, serviceTypeLabels
} from "@/models/serviceModel";
import {SERVICE_CONSTANTS} from "@/constants/service.constant";
import SelectControl from "@/components/SelectControl";
import {useForm, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";

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
    seats: 1,
}

const ServiceHandler: React.FC<ServiceFormProps> = ({services, service, onUpdateServices}) => {

    const {
        control,
        formState: {errors},
    } = useForm<IService>({mode: 'all', values: (service || {}) as IService});

    const newService: IService = useWatch({ control }) as IService;

    useEffect(() => {
        console.log("newService", newService);
        if (services.length === 0) {
            onUpdateServices([newService]);
            return;
        }
        const serviceExists = services.some(s => s._id === newService._id);
        if (serviceExists) {
            onUpdateServices(services.map(s => s._id === newService._id ? newService : s));
        } else {
            onUpdateServices([...services, newService]);
        }
    }, [newService]);

    const ServiceTypeActions = false;
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 rounded-md">
                    <div className="flex items-center justify-between gap-3">
                        {ServiceTypeActions && (
                            <SelectControl
                                name="type"
                                control={control}
                                label="Service Type"
                                options={SERVICE_CONSTANTS.TYPES.map(type => ({
                                    label: serviceTypeLabels[type],
                                    value: type
                                }))}
                                rules={{required: 'El Estado del Servicio es requerido'}}
                                className={'w-full'}
                            />
                        )}
                        <SelectControl
                            name="status"
                            control={control}
                            label="Estado del Servicio"
                            options={SERVICE_CONSTANTS.STATUS_TYPES.map(type => ({
                                label: serviceStatusLabels[type],
                                value: type
                            }))}
                            rules={{required: 'El Estado del Servicio es requerido'}}
                            className={'w-full'}
                        />
                        <FormControl
                            name="seats"
                            control={control}
                            label="Cantidad De Asientos"
                            type="number"
                            className={'w-full'}
                            rules={{
                                required: 'La cantidad de asientos es requerida',
                                min: {value: 1, message: 'Debe ser al menos 1'}
                            }}
                            inputProps={{
                                step: 1,
                                min: 1,
                                // onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                //     const value = parseInt(e.target.value, 10);
                                //     if (value >= 1) {
                                //         handleServiceChange('seats', value);
                                //     }
                                // }
                            }}
                        />
                    </div>
            </div>
        </div>
    );
};

export default ServiceHandler;
