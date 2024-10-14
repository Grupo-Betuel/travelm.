import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Input, List, ListItem } from '@material-tailwind/react';
import { CgClose } from "react-icons/cg";

export interface IOption<T = any> {
    label: string;
    value: T;
}

interface SearchableSelectProps<T> {
    options: (IOption | T)[];
    displayProperty?: keyof T;
    valueProperty?: keyof T;
    label: string;
    disabled?: boolean;
    multiple?: boolean;
    onSelect?: ((selectedValues: any[], selectedItem: any) => void);
    selectedValues?: any[];
    className?: string;
}

function SearchableSelect<T>({
                                 disabled,
                                 options,
                                 label,
                                 multiple = false,
                                 onSelect,
                                 selectedValues,
                                 displayProperty,
                                 valueProperty,
                                 className,
                             }: SearchableSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<(IOption | T)[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filtered = options.filter(option => {
            const value: string = ((option as T)[displayProperty as keyof T] || (option as IOption).label || '') as string;
            return value.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredOptions(filtered);
    }, [searchTerm, options, displayProperty]);

    useEffect(() => {
        if(!selectedValues) return;
        const selected = selectedValues?.map(value => {
            if (valueProperty) {
                return JSON.stringify(options.find(option =>
                    (option as T)[valueProperty as keyof T] === value
                ));
            }
            return JSON.stringify(value);
        }) || [];
        setSelectedOptions(selected);
    }, [selectedValues, options, valueProperty]);

    const toggleOption = (option: IOption | T) => {
        const value = JSON.stringify(option);
        const included = selectedOptions.includes(value);
        let newSelectedOptions = multiple
            ? included
                ? selectedOptions.filter(item => item !== value)
                : [...selectedOptions, value]
            : included ? [] : [value];

        newSelectedOptions = newSelectedOptions.filter(item => item !== undefined);

        setSelectedOptions([...newSelectedOptions]);
        if (onSelect) {
            let selectedItems;
            if (valueProperty) {
                selectedItems = newSelectedOptions.map(opt => JSON.parse(opt)?.[valueProperty as keyof T]).filter(item => item !== undefined);
            } else {
                selectedItems = newSelectedOptions.map(opt => JSON.parse(opt));
            }
            const selectedItem = included ? null : (valueProperty ? (option as T)[valueProperty as keyof T] : option);
            onSelect(selectedItems, selectedItem);
        }

        if (!multiple) {
            setIsFocused(false);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!ref.current?.contains(event.relatedTarget as Node)) {
            setIsFocused(false);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedOptions([]);
        if (onSelect) {
            onSelect([], null);
        }
        setIsFocused(false);
    };

    const displayValue: string = useMemo(() => {
        if (multiple) {
            return selectedOptions.map(value => {
                const option = options.find(opt => JSON.stringify(opt) === value);
                return (option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || '';
            }).join(', ') as string;
        } else {
            const option = selectedOptions[0] ? JSON.parse(selectedOptions[0]) : null;
            return ((option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || '') as string;
        }
    }, [selectedOptions, options, multiple, displayProperty, valueProperty]);

    return (
        <div ref={ref} onBlur={handleBlur} className={`${className || ''} relative w-full`}>
            <Input
                disabled={disabled}
                crossOrigin={false}
                label={label}
                type="text"
                value={isFocused ? searchTerm : displayValue}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                    setIsFocused(true);
                    setSearchTerm('');
                }}
                icon={
                    (searchTerm || displayValue) ? (
                        <CgClose className="h-5 w-5 cursor-pointer" onClick={handleClear}/>
                    ) : null
                }
                placeholder={!isFocused && multiple ? displayValue : ''}
            />
            {isFocused && (
                <List className="max-h-60 overflow-auto mt-1 border absolute w-full rounded bg-white z-50">
                    {filteredOptions.map((option, index) => (
                        <a
                            key={`selectable-options-${index}`}
                            onClick={() => toggleOption(option)}
                        >
                            <ListItem
                                disabled={disabled}
                                className={`cursor-pointer ${selectedOptions.includes(JSON.stringify(option)) ? 'bg-blue-300' : ''}`}
                            >
                                {displayProperty ? (option as T)[displayProperty as keyof T] : (option as any).label}
                            </ListItem>
                        </a>
                    ))}
                </List>
            )}
        </div>
    );
}

export default SearchableSelect;
