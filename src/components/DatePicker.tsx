import React, {useMemo} from "react";
import {
    Input,
    Popover,
    PopoverHandler,
    PopoverContent,
    Typography,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import {useController, Control, RegisterOptions, useFormState} from "react-hook-form";

interface DatePickerProps {
    name: string;
    control: Control<any>;
    label?: string;
    rules?: RegisterOptions;
    disabled?: boolean;
}

const DatePicker: React.FC<DatePickerProps> = ({
                                                   name,
                                                   control,
                                                   label,
                                                   rules,
                                                   disabled,
                                               }) => {
    const {
        field: { value, onChange, ref, onBlur },
        fieldState: { error, isTouched },
    } = useController({
        name,
        control,
        rules,
    });

    const { isSubmitted } = useFormState({ control });

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

    const handleDateSelect = (date?: Date) => {
        onChange(date);
        onBlur();
        setIsPopoverOpen(false);
    };

    const handleInputClick = () => {
        setIsPopoverOpen(!isPopoverOpen);
    };

    const handlePopoverClose = () => {
        setIsPopoverOpen(false);
        onBlur();
    };

    const formattedValue = value ? format(new Date(value), "dd / MM / yyyy") : "";

    const showError = useMemo(() => (error && (isTouched || isSubmitted)), [error, isTouched, isSubmitted]);

    return (
        <div className="mb-4">
            <Popover
                placement="bottom"
                open={isPopoverOpen}
                handler={setIsPopoverOpen}
                onClose={handlePopoverClose}
            >
                <PopoverHandler>
                    <div>
                        <Input
                            crossOrigin={false}
                            ref={ref}
                            name={name}
                            label={label}
                            value={formattedValue}
                            readOnly
                            disabled={disabled}
                            onClick={handleInputClick}
                            error={!!showError}
                        />
                    </div>
                </PopoverHandler>
                <PopoverContent className="z-[9999]" onBlur={onBlur}>
                    <DayPicker
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={handleDateSelect}
                        showOutsideDays
                        onDayBlur={onBlur}
                        className="border-0"
                        classNames={{
                            caption: "flex justify-center py-2 mb-4 relative items-center",
                            caption_label: "text-sm font-medium text-gray-900",
                            nav: "flex items-center",
                            nav_button:
                                "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                            nav_button_previous: "absolute left-1.5",
                            nav_button_next: "absolute right-1.5",
                            table: "w-full border-collapse",
                            head_row: "flex font-medium text-gray-900",
                            head_cell: "m-0.5 w-9 font-normal text-sm",
                            row: "flex w-full mt-2",
                            cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 font-normal",
                            day_selected:
                                "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                            day_today: "rounded-md bg-gray-200 text-gray-900",
                            day_outside:
                                "text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                            day_disabled: "text-gray-500 opacity-50",
                            day_hidden: "invisible",
                        }}
                        components={{
                            IconLeft: ({ ...props }) => (
                                <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                            ),
                            IconRight: ({ ...props }) => (
                                <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                            ),
                        }}
                    />
                </PopoverContent>
            </Popover>
            {showError && (
                <Typography variant="small" color="red">
                    {error?.message}
                </Typography>
            )}
        </div>
    );
};

export default DatePicker;




