import React from "react";
import {
    Input,
    Popover,
    PopoverHandler,
    PopoverContent, Textarea,
} from "@material-tailwind/react";
// import { format } from "date-fns";
// import { DayPicker } from "react-day-picker";
// import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import {IExcursion} from "../../../../models/excursionModel";
import DatePicker from "../../../../components/DatePicker";
import MapPicker from "../../../../components/MapPicker";

interface GeneralInfoProps {
    excursionData: IExcursion;
    updateExcursion: (excursion: Partial<IExcursion>) => void;
}

const ExcursionGeneralInfo: React.FC<GeneralInfoProps> = ({excursionData, updateExcursion}) => {
    const handleInputChange = (event: any): void => {
        if (event.target.name === 'startDate' && !excursionData.endDate) {
            updateExcursion({
                [event.target.name]: event.target.value,
                endDate: event.target.value
            });
        } else {
            updateExcursion({[event.target.name]: event.target.value});
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-6">
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
                onChange={date => handleInputChange({target: {name: 'startDate', value: date}})}
                date={excursionData.startDate}
            />
            <DatePicker
                label="Dia de Finalizacion"
                onChange={date => handleInputChange({target: {name: 'endDate', value: date}})}
                date={excursionData.endDate || excursionData.startDate}
            />
        </div>
    );
};

export default ExcursionGeneralInfo;
