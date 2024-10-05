// formValidator.ts

import { FieldErrors, RegisterOptions } from 'react-hook-form';

export type FormValidatorEntityType<T> = {
    [N in keyof T]: RegisterOptions;
};

export type FormValidatorEntityClassNamesType<T> = {
    [N in keyof T]: string;
};

export default function getFormValidatorClassNames<T>(
    entity: FormValidatorEntityType<T>,
    formErrors: FieldErrors<T>
): FormValidatorEntityClassNamesType<T> {
    const validatorEntityClassNames: any = {};
    Object.keys(entity).forEach((entityFieldName: string) => {
        const fieldError = formErrors[entityFieldName as keyof T];
        if (fieldError) {
            validatorEntityClassNames[entityFieldName] = 'error-message';
        } else {
            validatorEntityClassNames[entityFieldName] = '';
        }
    });
    return validatorEntityClassNames;
}
