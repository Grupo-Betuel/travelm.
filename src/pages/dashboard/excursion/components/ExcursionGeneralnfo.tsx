import React from "react";
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
import {useForm} from "react-hook-form";

interface GeneralInfoProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const ExcursionGeneralInfo: React.FC<GeneralInfoProps> = ({excursionData, updateExcursion}) => {
    const handleInputChange = (event: any): void => {
        console.log(event);
        if (event.target.name === 'startDate' && !excursionData.endDate) {
            updateExcursion({
                [event.target.name]: event.target.value,
                endDate: event.target.value
            });
        } else {
            updateExcursion({[event.target.name]: event.target.value});
        }
    };

    const {
        control,
        handleSubmit,
    } = useForm<any>({ mode: 'onBlur' });


    return (

        <form onSubmit={handleSubmit(handleInputChange)} className="flex flex-col gap-4 mb-6">
            <Input
                label="Title"
                name="title"
                value={excursionData.title || ''}
                onChange={handleInputChange}
            />
            <Textarea
                label="Description"
                name="description"
                value={excursionData.description || ''}
                onChange={handleInputChange}
            />
            <DatePicker
                label="Dia de comienzo"
                control={control}
                name="startDate"
                rules={{required: 'Fecha de finalizacion es requerida'}}
                // onChange={date => handleInputChange({target: {name: 'startDate', value: date}})}
                // date={excursionData.startDate}
            />
            <DatePicker
                control={control}
                name="endDate"
                rules={{required: 'Fecha de finalizacion es requerida'}}
                label="Dia de Finalizacion"
                // onChange={date => handleInputChange({target: {name: 'endDate', value: date}})}
                // date={excursionData.endDate || excursionData.startDate}
            />
            <Button
                color="blue"
                type="submit"
            >
                Guardar
            </Button>
        </form>
    );
};

export default ExcursionGeneralInfo;
