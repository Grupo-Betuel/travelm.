import React, { useState, useEffect } from 'react';
import { Switch, Typography } from "@material-tailwind/react";
import SearchableSelect, { IOption } from './SearchableSelect';
import { IExcursionConfigAction, ExcursionConfigTypeEnum } from '@/models/IConfiguration';

interface ExcursionConfigActionsProps {
    actions: IExcursionConfigAction[];
    onActionsChange: (actions: IExcursionConfigAction[]) => void;
    startDate: Date;
}

// const getRecurrenceOptions = (): IOption[] => {
//     // const days = [3, 5, 10, 15, 30];
//     const days = [1, 2, 5, 7, 10, 12];
//     return days.map(day => {
//         // const date = new Date(startDate);
//         // date.setDate(date.getDate() - day);
//         const date = new Date();
//         // increment 10 seconds to the current date
//         date.setMinutes(date.getMinutes() + day);
//
//         return {
//             // label: `${day} días antes`,
//             label: `${day} minutos despues de ahora`,
//             value: date.toLocaleString(),
//         };
//     });
// };

// const recurrentRules = getRecurrenceOptions();
export default function ExcursionConfigActions({ actions, onActionsChange, startDate }: ExcursionConfigActionsProps) {
    const [localActions, setLocalActions] = useState<IExcursionConfigAction[]>(actions);

    useEffect(() => {
        setLocalActions(actions);
    }, [actions]);

    const handleToggle = (index: number) => {
        const updatedActions = localActions.map((action, i) =>
            i === index ? { ...action, enabled: !action.enabled } : action
        );
        setLocalActions(updatedActions);
        onActionsChange(updatedActions);
    };

    const handleScheduleChange = (index: number, selectedDates: Date[]) => {
        const dates = selectedDates.map(date => new Date(date).toLocaleString());
        const updatedActions = localActions.map((action, i) =>
            i === index ? { ...action, schedule: dates } : action
        );
        setLocalActions(updatedActions);
        onActionsChange(updatedActions);
    };

    const getRecurrenceOptions = (): IOption[] => {
        const days = [3, 5, 10, 15, 30];
        return days.map(day => {
            const date = new Date(startDate);
            date.setDate(date.getDate() - day);

            return {
                label: `${day} días antes`,
                value: date.toLocaleString(),
            };
        });
    };

    return (
        <div className="flex flex-col w-full h-full gap-5 overflow-visible">
            {localActions.map((action, index) => (
                <div key={action.type} className="flex items-center justify-between overflow-visible flex-wrap">
                    <Switch
                        crossOrigin="true"
                        checked={action.enabled}
                        onChange={() => handleToggle(index)}
                        label={
                            <Typography color="blue-gray" className="font-medium text-nowrap">
                                {action.title}
                            </Typography>
                        }
                    />
                    <SearchableSelect
                        options={getRecurrenceOptions()}
                        // options={recurrentRules}
                        label="Recurrencia"
                        valueProperty="value"
                        multiple={true}
                        disabled={!action.enabled}
                        onSelect={(selectedValues: Date[]) => handleScheduleChange(index, selectedValues)}
                        selectedValues={action.schedule}
                        displayProperty="label"
                        className="w-[50%] max-w-[300px]"
                    />
                </div>
            ))}
        </div>
    );
}
