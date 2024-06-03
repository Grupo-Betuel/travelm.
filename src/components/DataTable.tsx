import React, {ChangeEvent, useMemo, useState} from 'react';
import {Input, Typography} from "@material-tailwind/react";
import {ArrowDownIcon, ArrowUpIcon} from "@heroicons/react/20/solid";
import SearchableSelect, {IOption} from './SearchableSelect';
import _ from "lodash";

export interface IFilterOption<T> {
    key: keyof T;
    label: string;
    type: 'text' | 'select';
    options?: { label: string, value: string | number }[];
}

export type IDataTableColumn<T> = { key: keyof T | string, label: string }

interface DataTableProps<T> {
    data: T[];
    columns: IDataTableColumn<T>[];
    filterOptions: IFilterOption<T>[];
    renderRow: (item: T) => React.ReactNode;
}

export function DataTable<T>({data, columns, filterOptions, renderRow}: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Record<keyof T, any>>({});
    const [sortConfig, setSortConfig] = useState<{ key: keyof T, direction: 'ascending' | 'descending' } | null>(null);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleFilterChange = (filterKey: keyof T, value: string[] | number[]) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: value
        }));
    };

    const handleSort = (key: keyof T) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key && prevConfig.direction === 'ascending') {
                return {key, direction: 'descending'};
            }
            return {key, direction: 'ascending'};
        });
    };

    const filteredData = useMemo(() => {
        let result = data;
        if (searchTerm) {
            result = result.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
        }

        (Object.keys(filters) as (keyof T)[]).forEach(filterKey => {
            if (filters[filterKey] && filters[filterKey].length > 0) {
                result = result.filter(item => {
                    const value = item[filterKey as keyof T];
                    const filterWith = filters[filterKey];
                    if (typeof value === 'string') {
                        return filterWith.some((filter: string) => value.toLowerCase().includes(filter.toLowerCase()));
                    } else if (typeof value === 'object') {
                        return filterWith.some((filter: string) => JSON.stringify(value).toLowerCase().includes(filter.toLowerCase()));
                    }

                    return filterWith.includes(value);
                });
            }
        });

        if (sortConfig) {
            result = [...result].sort((a, b) => {
                if (_.get(a, sortConfig.key) < _.get(b, sortConfig.key)) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (_.get(a, sortConfig.key) > _.get(b, sortConfig.key)) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchTerm, filters, sortConfig]);

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="mb-1 flex flex-col gap-6">
                <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                    Buscar
                </Typography>
                <Input
                    size="lg"
                    placeholder="Buscar..."
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="flex gap-4">
                {filterOptions.map((option, index) => (
                    <div key={`${option.key as string}-${index}`}>
                        {option.type === 'text' && (
                            <Input
                                size="lg"
                                label={option.label}
                                value={filters[option.key] || ''}
                                onChange={(e) => handleFilterChange(option.key, [e.target.value])}
                            />
                        )}
                        {option.type === 'select' && (
                            <SearchableSelect
                                multiple
                                label={option.label}
                                options={option.options || []}
                                onSelect={(selectedValues) => handleFilterChange(option.key, selectedValues.map(value => value.value))}
                                displayProperty="label"
                                className="min-w-[200px]"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column, i) => (
                            <th key={`${column.key as string}-column-${i}`} scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                <div onClick={() => handleSort(column.key)} className="whitespace-nowrap">
                                    {column.label}
                                    {sortConfig?.key === column.key && (
                                        sortConfig.direction === 'ascending' ?
                                            <ArrowUpIcon className="ml-2 inline h-4 w-4"/> :
                                            <ArrowDownIcon className="ml-2 inline h-4 w-4"/>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map(renderRow)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
