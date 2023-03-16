import formHelperStyles from '@styles/forms-helpers.module.scss'
import { FieldErrors, RegisterOptions } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types/fields'

export type IFieldValidatorStructure = (
  criteria?: Partial<RegisterOptions>
) => {
  className: string
}

export type FieldValidatorTypes = keyof RegisterOptions

export type IFieldValidatorTypes = {
  [N in FieldValidatorTypes]: IFieldValidatorStructure
}

export const formValidatorTypes: IFieldValidatorTypes = {
  required: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  min: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  max: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  maxLength: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  minLength: (criteria = { minLength: 1 }) => ({
    className: formHelperStyles[`minLength${criteria.minLength}`],
  }),
  pattern: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  validate: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  valueAsNumber: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  valueAsDate: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  setValueAs: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  shouldUnregister: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  value: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  onChange: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  onBlur: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  disabled: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
  deps: () => ({
    className: formHelperStyles.requiredFieldError,
  }),
}

export function getFieldValidatorClassName(
  type: FieldValidatorTypes,
  criteria?: RegisterOptions
) {
  return formValidatorTypes[type](criteria).className
}

export type FormValidatorEntityType<T> = {
  [N in keyof T]: RegisterOptions
}

export type FormValidatorEntityClassNamesType<T> = {
  [N in keyof T]: string
}

export default function getFormValidatorClassNames<T>(
  entity: FormValidatorEntityType<T>,
  formError: FieldErrors<T & FieldValues>
): FormValidatorEntityClassNamesType<T> {
  const validatorEntityClassNames: any = {}
  Object.keys(entity).forEach((entityFieldName: string) => {
    const entityValidationClassNames: string[] = []
    const fieldValidation = (entity as any)[entityFieldName]

    Object.keys(fieldValidation).forEach((optionValidatorKey: any) => {
      const fieldError = (formError as any)[entityFieldName]

      if (fieldError && fieldError.type === optionValidatorKey) {
        entityValidationClassNames.push(
          getFieldValidatorClassName(optionValidatorKey, fieldValidation)
        )
      }
    })

    validatorEntityClassNames[entityFieldName] =
      entityValidationClassNames.join(' ')
  })

  return validatorEntityClassNames
}
