import React, {useEffect} from "react";
import {IExcursion} from "@/models/excursionModel";
import DatePicker from "../../../../components/DatePicker";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";
import {Simulate} from "react-dom/test-utils";

interface GeneralInfoProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
    setIsValid: (isValid: boolean) => void;
}

const defaultValues = {
    title: "",
    description: "",
    startDate: null,
    endDate: null,
}

const ExcursionGeneralInfo: React.FC<GeneralInfoProps> = ({excursionData, setIsValid, updateExcursion}) => {
    const {
        control,
        formState: {errors, isValid },
        reset,
    } = useForm<any>({mode: 'all', defaultValues: excursionData});

    const newExcusion: IExcursion = useWatch({control});
    useEffect(() => {
        updateExcursion({...excursionData, ...newExcusion});
    }, [newExcusion]);

    useEffect(() => {
        if (excursionData._id) {
            reset(excursionData)
        }
    }, [excursionData._id]);

    useEffect(() => {
        setIsValid(isValid);
    }, [isValid]);

    return (

        <form className="flex flex-col gap-4 mb-6">
            <FormControl
                name="title"
                control={control}
                label="Nombre Excusion"
                rules={{required: 'El título de excursion es requerido'}}
                className="w-full"
            />
            <FormControl
                name="description"
                control={control}
                label="Descripción"
                type="textarea"
                className="w-full"
                rules={{
                    minLength: {
                        value: 3,
                        message: 'La descripción debe tener al menos 3 caracteres',
                    },
                }}
            />
            <DatePicker
                label="Dia de comienzo"
                control={control}
                name="startDate"
                rules={{required: 'Fecha de finalizacion es requerida'}}
            />
            <DatePicker
                control={control}
                name="endDate"
                rules={{required: 'Fecha de finalizacion es requerida'}}
                label="Dia de Finalizacion"
            />
        </form>
    );
};

export default ExcursionGeneralInfo;
