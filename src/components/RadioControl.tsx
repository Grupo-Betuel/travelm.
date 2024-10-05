import React from 'react';
import { Radio, Typography } from '@material-tailwind/react';
import { useController, Control, useFormState } from 'react-hook-form';

interface RadioOption {
    label: string;
    value: string;
}

interface RadioControlProps {
    name: string;
    control: Control<any>;
    label: string;
    options: RadioOption[];
    rules?: any;
    orientation?: 'horizontal' | 'vertical';
}

const RadioControl: React.FC<RadioControlProps> = ({
                                                       orientation,
                                                       name,
                                                       control,
                                                       label,
                                                       options,
                                                       rules,
                                                   }) => {
    const {
        field,
        fieldState: { error, isTouched },
    } = useController({
        name,
        control,
        rules,
    });

    const { isSubmitted } = useFormState({ control });

    const showError = (error && (isTouched || isSubmitted));

    return (
        <div className="mb-4">
            <Typography variant="small" color="blue-gray" className="mb-2">
                {label}
            </Typography>
            <div className={`flex ${orientation === 'vertical' ? 'flex-col' : ''}`}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-center mb-2">
                        <Radio
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                            color="blue"
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="ml-2 text-sm cursor-pointer"
                        >
                            {option.label}
                        </label>
                    </div>
                ))}
            </div>
            {showError && (
                <Typography variant="small" color="red" className="mt-1">
                    {error.message}
                </Typography>
            )}
        </div>
    );
};

export default RadioControl;
