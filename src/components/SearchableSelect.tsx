import React, {useState, useEffect, useRef, useMemo} from 'react';
import {Input, List, ListItem} from '@material-tailwind/react';
import {generateCustomID} from "../utils/text.utils";

export interface IOption {
    label: string;
    value: string;
}

interface SearchableSelectProps<T> {
    options: (IOption | T)[];
    displayProperty?: keyof T;
    label: string;
    disabled?: boolean;
    multiple?: boolean;
    onSelect?: ((selectedValues: string[], selectedItem: string) => void) | ((selectedValues: T[], selectedItem: T) => void);
    selectedValues?: string[] | T[];
}

function SearchableSelect<T>(
    {
        disabled,
        options,
        label,
        multiple = false,
        onSelect,
        selectedValues,
        displayProperty,
    }: SearchableSelectProps<T>) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filteredOptions, setFilteredOptions] = useState<(IOption | T)[]>(options);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const filtered = options.filter(option => {
                const value: string = ((option as T)[displayProperty as keyof T] || (option as IOption).label || '') as string;
                return value.toLowerCase().includes(searchTerm.toLowerCase())
            }
        );
        setFilteredOptions(filtered);
    }, [searchTerm, options]);

    useEffect(() => {
        const selected = selectedValues?.map(value => JSON.stringify(value)) || [];
        setSelectedOptions(selected);
    }, [selectedValues]);

    const toggleOption = (value: string | any) => {
        value = JSON.stringify(value);
        const included = selectedOptions.includes(value);
        const newSelectedOptions = multiple
            ? included
                ? selectedOptions.filter(item => item !== value)
                : [...selectedOptions, value]
            : included ? [] : [value];

        setSelectedOptions(newSelectedOptions);

        if (onSelect) {
            const list = newSelectedOptions.map(option => JSON.parse(option));
            const item = included ? null : JSON.parse(value);
            onSelect(list, item);
        }

        if (!multiple) {
            setIsFocused(false); // Automatically close the dropdown for single select
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        if (!ref.current?.contains(event.relatedTarget as Node)) {
            setIsFocused(false);
        }
    };

    const displayValue: string = useMemo(() => {
        if (multiple) {
            return selectedOptions.map(value => {
                const option = options.find(option => JSON.stringify(option) === value)
                return (option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || '';
            }).join(', ') as string;
        } else {
            const option = selectedOptions[0] ? JSON.parse(selectedOptions[0]) : null;
            return ((option as T)?.[displayProperty as keyof T] || (option as IOption)?.label || '') as string;
        }
    }, [selectedOptions, options, multiple, displayProperty])

    return (
        <div ref={ref} onBlur={handleBlur} className="p-4 w-100">
            <Input
                disabled={disabled}
                label={label}
                type="text"
                value={isFocused ? searchTerm : displayValue}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => {
                    setIsFocused(true);
                    setSearchTerm(''); // Clear search term on focus to show all options
                }}
                // onBlur={() => {
                //     console.log('blur')
                //     if (!multiple) {
                //         // setSearchTerm(displayValue); // Restore the display value for single select
                //     }
                // }}
                placeholder={!isFocused && multiple ? displayValue : ''}
            />
            {isFocused && (
                <List
                      className="max-h-60 overflow-auto mt-1 border absolute rounded bg-white z-50">
                    {filteredOptions.map((option, index) => (
                        <a
                            onClick={e => {
                                toggleOption(option)
                            }}
                        >
                            <ListItem
                                disabled={disabled}
                                key={`${(option as IOption).value || generateCustomID()}-${index}`}
                                className={`cursor-pointer ${
                                    selectedOptions.includes(JSON.stringify(option)) ? 'bg-gray-300' : ''
                                }`}
                            >
                                {displayProperty ? (option as any)[displayProperty] : (option as IOption).label}
                            </ListItem>
                        </a>
                    ))}
                </List>
            )}
        </div>
    );
};

export default SearchableSelect;
