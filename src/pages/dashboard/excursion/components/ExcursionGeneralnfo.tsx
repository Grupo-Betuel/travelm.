import React, {useEffect} from "react";
import {
    Input,
    Popover,
    PopoverHandler,
    PopoverContent, Textarea, Button,
} from "@material-tailwind/react";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import {IExcursion} from "../../../../models/excursionModel";
import DatePicker from "../../../../components/DatePicker";
import MapPicker from "../../../../components/MapPicker";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset;

interface GeneralInfoProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const defaultValues = {
    title: "",
    description: "",
    startDate: null,
    endDate: null,
}

const ExcursionGeneralInfo: React.FC<GeneralInfoProps> = ({excursionData, updateExcursion}) => {
    const {
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm<any>({ mode: 'all', defaultValues: excursionData });

    const startDate = useWatch({
        control,
        name: "startDate",
    });
    const endDate = useWatch({
        control,
        name: "endDate",
    });
    const previousData = React.useRef(excursionData);

    useEffect(() => {
        if (startDate !== previousData.current.startDate || endDate !== previousData.current.endDate) {
            updateExcursion({
                startDate,
                endDate,
            });

            previousData.current = {
                ...previousData.current,
                startDate,
                endDate,
            };
        }
    }, [startDate, endDate]);

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
