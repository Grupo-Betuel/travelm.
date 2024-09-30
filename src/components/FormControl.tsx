import React from 'react';
import {Input, Typography} from '@material-tailwind/react';
import {useController, Control} from 'react-hook-form';

interface FormControlProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    type?: string;
}

const FormControl: React.FC<FormControlProps> = (
    {
        name,
        control,
        label,
        rules,
        type = 'text',
    }) => {
    const {
        field,
        fieldState: {error, isTouched},
    } = useController({
        name,
        control,
        rules,
    });

    return (
        <div className="mb-4">
            <Input
                {...field}
                label={label}
                error={!!error && isTouched}
                success={!error && isTouched}
                type={type}
            />
            {error && isTouched && (
                <Typography variant="small" color="red">
                    {error.message}
                </Typography>
            )}
        </div>
    );
};

export default FormControl;
