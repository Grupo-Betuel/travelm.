import React from 'react';
import { Button, Input, Typography } from "@material-tailwind/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (value: string) => void;
}

export function DataPagination({ currentPage, totalPages, itemsPerPage, onPageChange, onItemsPerPageChange }: PaginationProps) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Button
                    size="sm"
                    color="gray"
                    variant="outlined"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ArrowLeftIcon className="h-5 w-5" />
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <Button
                        key={index}
                        size="sm"
                        color={currentPage === index + 1 ? "blue" : "gray"}
                        variant="outlined"
                        className="rounded-full"
                        ripple
                        onClick={() => onPageChange(index + 1)}
                    >
                        {index + 1}
                    </Button>
                ))}
                <Button
                    size="sm"
                    variant="outlined"
                    color="gray"
                    className="rounded-full"
                    ripple
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ArrowRightIcon className="h-5 w-5" />
                </Button>
            </div>
            <div className="flex items-center gap-3">
                <Typography color="gray" className="text-sm whitespace-nowrap">
                    Items per page:
                </Typography>
                <Input
                    type="number"
                    value={itemsPerPage}
                    onChange={(e) => onItemsPerPageChange(e.target.value || '1')}
                    color="light-blue"
                    className="text-center"
                />
            </div>
        </div>
    );
}
