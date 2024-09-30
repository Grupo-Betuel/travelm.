import React, {useMemo} from 'react';
import {Input, Typography} from '@material-tailwind/react';
import {useController, Control, useFormState} from 'react-hook-form';

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

    const { isSubmitted } = useFormState({ control });

    const isError = useMemo(() => error && (isTouched || isSubmitted), [error, isTouched, isSubmitted]);

    return (
        <div className="mb-4">
            <Input
                {...field}
                label={label}
                error={!!isError}
                success={!isError}
                type={type}
            />
            {isError && (
                <Typography variant="small" color="red">
                    {error?.message}
                </Typography>
            )}
        </div>
    );
};

export default FormControl;
