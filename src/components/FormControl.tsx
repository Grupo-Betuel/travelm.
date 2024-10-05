import React, {useMemo} from 'react';
import {Input, Textarea, Typography} from '@material-tailwind/react';
import {Controller, Control, useFormState} from 'react-hook-form';
import InputMask from 'react-input-mask';
import {PHONE_COSNTANTS} from "@/constants/phone.constants";

interface FormControlProps {
    name: string;
    control: Control<any>;
    label: string;
    rules?: any;
    type?: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'tel';
    inputProps?: any;
    mask?: string;
    maskProps?: any;
    className?: string;
}

const FormControl: React.FC<FormControlProps> = (
    {
        name,
        control,
        label,
        rules,
        type = 'text',
        inputProps,
        mask,
        maskProps,
        className,
    }
) => {
    const {isSubmitted} = useFormState({control});

    const telRules = useMemo(() => {
        return type === 'tel' ? {
            pattern: {
                value: PHONE_COSNTANTS.PATTERN,
                message: PHONE_COSNTANTS.MESSSAGE,
            },
        } : {};

    }, [type]);

    const inputMask = useMemo(() => {
        return mask || type === 'tel' ? PHONE_COSNTANTS.MASK : undefined
    }, [type]);

    const inputRules = useMemo(() => {
        return {
            ...telRules,
            ...rules
        }
    }, [rules, telRules]);


    return (
        <div className={`mb-4 ${className}`}>
            <Controller
                name={name}
                control={control}
                rules={inputRules}
                render={({field, fieldState: {error, isTouched}}) => {
                    const isError = useMemo(
                        () => error && (isTouched || isSubmitted),
                        [error, isTouched, isSubmitted]
                    );

                    const InputComponent = inputMask ? (
                        <InputMask
                            mask={inputMask}
                            {...maskProps}
                            {...field}
                            beforeMaskedValueChange={(states: any) => {
                                if (field.value !== states.value) {
                                    field.onChange(states.value);
                                }
                                return states
                            }}
                        >
                            {(inputMaskProps: any) => (
                                <Input
                                    {...inputProps}
                                    {...inputMaskProps}
                                    label={label}
                                    error={!!isError}
                                    type={type}
                                />
                            )}
                        </InputMask>
                    ) : type === 'textarea' ? (
                        <Textarea
                            {...field}
                            {...inputProps}
                            label={label}
                            error={!!isError}
                        />
                    ) : (
                        <Input
                            {...field}
                            {...inputProps}
                            label={label}
                            error={!!isError}
                            type={type}
                        />
                    );

                    return (
                        <>
                            {InputComponent}
                            {isError && (
                                <Typography variant="small" color="red">
                                    {error?.message}
                                </Typography>
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
};

export default FormControl;
