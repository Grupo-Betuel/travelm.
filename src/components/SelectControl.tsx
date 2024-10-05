import React from 'react';
import {Select, Option, Typography} from '@material-tailwind/react';
import {Controller, Control, useFormState, useForm} from 'react-hook-form';

interface OptionType {
    label: string;
    value: string;
}

interface SelectControlProps {
    name: string;
    control: Control<any>;
    label: string;
    options: OptionType[];
    rules?: any;
    className?: string;
    onChange?: (value: any) => void;
}

const SelectControl: React.FC<SelectControlProps> = ({
                                                         name,
                                                         control,
                                                         label,
                                                         options,
                                                         rules,
                                                         className,
                                                         onChange,
                                                     }) => {
    const {isSubmitted} = useFormState({control});

    const {watch} = useForm();

    const value = watch(name);

    React.useEffect(() => {
        if (onChange && value) {
            onChange(value);
        }
    }, [value, onChange]);


    return (
        <div className={`mb-4 ${className}`}>
            <Controller
                name={name}
                control={control}
                rules={rules}
                render={({field, fieldState: {error, isTouched}}) => {
                    const showError = error && (isTouched || isSubmitted);
                    return (
                        <>
                            <Select
                                label={label}
                                error={!!showError}
                                selected={(element) => element}
                                value={field.value || ''}
                                onBlur={field.onBlur}
                                onChange={(value) => {
                                    field.onChange(value);
                                }}
                            >
                                {options.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                        {option.label}
                                    </Option>
                                ))}
                            </Select>
                            {showError && (
                                <Typography variant="small" color="red" className="mt-1">
                                    {error.message}
                                </Typography>
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
};

export default SelectControl;

