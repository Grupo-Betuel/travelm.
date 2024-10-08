import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, List, ListItem, Typography } from '@material-tailwind/react';
import { CgClose } from 'react-icons/cg';
import { Control, useController, useFormState } from 'react-hook-form';

export interface IOption<T = any> {
    label: string;
    value: T;
}

interface SearchableSelectProps<T> {
    name?: string;
    control?: Control<any>;
    options: (IOption | T)[];
    displayProperty?: keyof T;
    label: string;
    disabled?: boolean;
    multiple?: boolean;
    rules?: any;
    className?: string;
    onSelect?: (selectedValues: T[] | string[], selectedItem: T | string | null) => void;
}

function SearchableSelect<T>({
                                 name,
                                 control,
                                 options,
                                 label,
                                 multiple = false,
                                 displayProperty,
                                 className,
                                 rules,
                                 disabled,
                                 onSelect,
                             }: SearchableSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<(IOption | T)[]>(options);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const refDiv = useRef<HTMLDivElement>(null);

    // For internal state management when control is not provided
    const [internalValue, setInternalValue] = useState<any>(multiple ? [] : null);

    // Determine if react-hook-form is being used
    const isControlled = control && name;

    // Declare variables
    let value: any;
    let onChange: (value: any) => void;
    let ref: any;
    let onBlur: () => void;
    let error: any;
    let isTouched: boolean;
    let isSubmitted: boolean;

    if (isControlled) {
        // Setup for react-hook-form
        const {
            field,
            fieldState,
        } = useController({
            name: name!,
            control: control!,
            rules,
        });
        value = field.value;
        onChange = field.onChange;
        ref = field.ref;
        onBlur = field.onBlur;
        error = fieldState.error;
        isTouched = fieldState.isTouched;
        isSubmitted = useFormState({ control }).isSubmitted;
    } else {
        // Uncontrolled mode
        value = internalValue;
        onChange = (newValue: any) => {
            setInternalValue(newValue);
            if (onSelect) {
                const selectedItem = multiple ? null : newValue;
                onSelect(newValue, selectedItem);
            }
        };
        ref = undefined;
        onBlur = () => {};
        error = null;
        isTouched = false;
        isSubmitted = false;
    }

    useEffect(() => {
        const filtered = options.filter((option) => {
            const optionLabel: string =
                ((option as T)[displayProperty as keyof T] || (option as IOption).label || '') as string;
            return optionLabel.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredOptions(filtered);
    }, [searchTerm, options]);

    const handleOptionClick = (option: T | IOption) => {
        let newValue;

        if (multiple) {
            const optionValue = JSON.stringify(option);
            const currentValues = Array.isArray(value)
                ? value.map((v: any) => JSON.stringify(v))
                : [];
            const isSelected = currentValues.includes(optionValue);
            if (isSelected) {
                newValue = value.filter((v: any) => JSON.stringify(v) !== optionValue);
            } else {
                newValue = [...(value || []), option];
            }
        } else {
            newValue = option;
            setIsFocused(false);
        }

        onChange(newValue);

        if (isControlled) {
            // Call onBlur to trigger validation
            onBlur();
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!refDiv.current?.contains(event.relatedTarget as Node)) {
            setIsFocused(false);
            if (isControlled) {
                onBlur();
            }
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        onChange(multiple ? [] : null);
        setIsFocused(false);
        if (isControlled) {
            onBlur();
        }
    };

    const displayValue: string = useMemo(() => {
        if (multiple && Array.isArray(value)) {
            return value
                .map((val: any) => {
                    const option = val;
                    return (
                        (option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || ''
                    );
                })
                .join(', ') as string;
        } else if (!multiple && value) {
            const option = value;
            return (
                ((option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || '') as string
            );
        }
        return '';
    }, [value, multiple, displayProperty]);

    const showError = isControlled && error && (isTouched || isSubmitted);

    return (
        <div ref={refDiv} onBlur={handleBlur} className={`${className || ''} relative w-full`}>
            <Input
                disabled={disabled}
                crossOrigin={false}
                label={label}
                type="text"
                value={isFocused ? searchTerm : displayValue}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                    setIsFocused(true);
                    setSearchTerm(''); // Clear search term on focus to show all options
                }}
                icon={
                    searchTerm || displayValue ? (
                        <CgClose className="h-5 w-5 cursor-pointer" onClick={handleClear} />
                    ) : null
                }
                placeholder={!isFocused && multiple ? displayValue : ''}
                error={!!showError}
                inputRef={ref}
            />
            {isFocused && (
                <List className="max-h-60 overflow-auto mt-1 border absolute w-full rounded bg-white z-50">
                    {filteredOptions.map((option, index) => {
                        const optionValue = JSON.stringify(option);
                        const isSelected = multiple
                            ? Array.isArray(value) &&
                            value.some((v: any) => JSON.stringify(v) === optionValue)
                            : JSON.stringify(value) === optionValue;
                        return (
                            <a key={`selectable-options-${index}`} onClick={() => handleOptionClick(option)}>
                                <ListItem
                                    disabled={disabled}
                                    className={`cursor-pointer ${isSelected ? 'bg-gray-300' : ''}`}
                                >
                                    {displayProperty
                                        ? (option as any)[displayProperty]
                                        : (option as IOption).label}
                                </ListItem>
                            </a>
                        );
                    })}
                </List>
            )}
            {showError && (
                <Typography variant="small" color="red" className="mt-1">
                    {error?.message}
                </Typography>
            )}
        </div>
    );
}

export default SearchableSelect;
