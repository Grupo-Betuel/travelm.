import React, {ChangeEvent, useMemo, useState} from 'react';
import {Button, Input, Typography} from "@material-tailwind/react";
import {
    ArrowDownIcon,
    ArrowUpIcon, BackspaceIcon, ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon
} from "@heroicons/react/20/solid";
import SearchableSelect from './SearchableSelect';
import _ from "lodash";
import {ChevronLeftIcon, ChevronRightIcon} from "@heroicons/react/24/outline";

export type IFilterOptionItem = { label: string, value: string | number };

export interface IFilterOption<T> {
    key: keyof T;
    label: string;
    type: 'text' | 'select';
    options?: IFilterOptionItem[];
}

export type IDataTableColumn<T> = { key: keyof T, label: string };

interface DataTableProps<T> {
    data: T[];
    columns: IDataTableColumn<T>[];
    filterOptions: IFilterOption<T>[];
    renderRow: (item: T, index: number, selected: boolean, onSelect: (checked: boolean) => void) => React.ReactNode;
    enableSelection?: boolean;
    onSelect?: (selectedItems: T[]) => void;
    selectedItems?: T[];
}

export function DataTable<T>(
    {
        data,
        columns,
        filterOptions,
        renderRow,
        enableSelection = false,
        onSelect,
        selectedItems,
    }: DataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState<Record<keyof T, any>>({} as Record<keyof T, any>);
    const [sortConfig, setSortConfig] = useState<{ key: keyof T, direction: 'ascending' | 'descending' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [selectedItemsData, setSelectedItemsData] = useState<Set<T>>(new Set());

    React.useEffect(() => {
        setSelectedItemsData(new Set(selectedItems));
    }, [selectedItems]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        const val = event.target.value.toLowerCase();
        setSearchTerm(val);
        if (val.length === 3) {
            setCurrentPage(1)
        }
    };

    const handleFilterChange = (filterKey: keyof T, value: string[] | number[]) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterKey]: value
        }));
    };

    const handleSort = (key: keyof T ) => {
        setSortConfig(prevConfig => {
            if (prevConfig && prevConfig.key === key && prevConfig.direction === 'ascending') {
                return {key, direction: 'descending'};
            }
            return {key, direction: 'ascending'};
        });
    };

    const handleSelect = (item: T, checked: boolean) => {
        setSelectedItemsData(prevSelectedItems => {
            const newSelectedItems = new Set(prevSelectedItems);
            if (checked) {
                newSelectedItems.add(item);
            } else {
                newSelectedItems.delete(item);
            }

            if (onSelect) {
                onSelect(Array.from(newSelectedItems));
            }
            return newSelectedItems;
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
                    const value = _.get(item, filterKey as keyof T);
                    const filterWith = _.get(filters, filterKey);

                    if (typeof value === 'string') {
                        return filterWith.some((filter: string) => value.toLowerCase().includes(filter.toLowerCase()));
                    } else if (typeof value === 'object') {
                        return filterWith.some((filter: string) => JSON.stringify(value).toLowerCase().includes(filter?.toString()?.toLowerCase() || ''));
                    }

                    console.log(filterWith, value, filterWith);
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

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(Math.abs(Number(value)) || 1);
        setCurrentPage(1); // Reset to first page when changing items per page
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 2);

        if (totalPages <= 3) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            if (currentPage === 1) {
                pageNumbers.push(1, 2, 3);
            } else if (currentPage === totalPages) {
                pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
            } else {
                pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
            }
        }

        return (
            <>
                <Button
                    size="sm"
                    color="gray"
                    variant="outlined"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(1)}
                >
                    <ChevronDoubleLeftIcon className="h-5 w-5"/>
                </Button>
                <Button
                    size="sm"
                    color="gray"
                    variant="outlined"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ChevronLeftIcon className="h-5 w-5"/>
                </Button>
                {pageNumbers.map(page => (
                    <Button
                        key={page}
                        size="sm"
                        color={currentPage === page ? "blue" : "gray"}
                        variant="outlined"
                        className="rounded-full w-10 flex items-center justify-center"
                        ripple
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    size="sm"
                    variant="outlined"
                    color="gray"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    <ChevronRightIcon className="h-5 w-5"/>
                </Button>
                <Button
                    size="sm"
                    color="gray"
                    variant="outlined"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(totalPages)}
                >
                    <ChevronDoubleRightIcon className="h-5 w-5"/>
                </Button>
            </>
        );
    };

    const handleClear = (key : keyof T | 'search') => {
        if (key === 'search') {
            setSearchTerm('');
        } else {
            setFilters((prevFilters) => ({
                ...prevFilters,
                [key]: '',
            }));
        }
    };

    return (
        <div className="flex flex-col gap-4 mb-4">
            <div className="mb-1 flex flex-col gap-6">
                <Input
                    crossOrigin={false}
                    label="Buscar"
                    size="lg"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    icon={
                    searchTerm ? (
                        <BackspaceIcon className="h-5 w-5" onClick={() => handleClear('search')}/>
                        ): null
                    }
                />
            </div>
            <div className="flex gap-4">
                {filterOptions.map((option, index) => (
                    <div key={`${option.key as string}-${index}`}>
                        {option.type === 'text' && (
                            <Input
                                crossOrigin={false}
                                size="lg"
                                label={option.label}
                                value={filters[option.key] || ''}
                                onChange={(e) => handleFilterChange(option.key, [e.target.value])}
                                icon={
                                    (filters[option.key]) ? (
                                        <BackspaceIcon className="h-5 w-5" onClick={() => handleClear(option.key)}/>
                                    ): null
                                }
                            />
                        )}
                        {option.type === 'select' && (
                            <SearchableSelect
                                multiple
                                label={option.label}
                                options={option.options || []}
                                onSelect={(selectedValues: any[]) => handleFilterChange(option.key, selectedValues.map(value => value.value))}
                                displayProperty="label"
                                className="min-w-[200px]"
                            />
                        )}
                    </div>
                ))}
            </div>
            <div>
                <table className="min-w-full divide-y divide-gray-200 overflow-x-scroll">
                    <thead className="bg-gray-50">
                    <tr>
                        {enableSelection && <th className="px-6 py-3"/>}
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
                    {paginatedData.map((item, index) => renderRow(
                        item,
                        index,
                        selectedItemsData.has(item),
                        (checked) => handleSelect(item, checked)
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                    {renderPagination()}
                </div>
                <div className="flex items-center gap-3">
                    <Typography color="gray" className="text-sm whitespace-nowrap">
                        Total: {filteredData.length}
                    </Typography>
                    <Typography color="gray" className="text-sm whitespace-nowrap">
                        por pagina:
                    </Typography>
                    <Input
                        crossOrigin={false}
                        width={"50px"}
                        type="number"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(e.target.value || '1')}
                        color="light-blue"
                        containerProps={{
                            className: "!min-w-[50px] max-w-[100px]"
                        }}
                        className="text-center "
                    />
                </div>
            </div>
        </div>
    );
}
