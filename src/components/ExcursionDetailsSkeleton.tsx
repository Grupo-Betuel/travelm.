import React from 'react';
import { Typography } from '@material-tailwind/react';

const ExcursionDetailsSkeleton: React.FC = () => {
    return (
        <div className="p-4 space-y-4 animate-pulse">
            {/* Header */}
            <div className="flex justify-between items-center">
                <Typography as="div" variant="h1" className="w-1/3 h-10 mb-4 bg-gray-300 rounded-full">&nbsp;</Typography>
                <div className="flex space-x-2">
                    <div className="w-20 h-10 bg-gray-300 rounded-full"></div>
                    <div className="w-20 h-10 bg-gray-300 rounded-full"></div>
                </div>
            </div>

            {/* Image Carousel */}
            <div className="flex justify-center space-x-4">
                <div className="w-1/4 h-[500px] bg-gray-300 rounded-lg"></div>
                <div className="w-1/4 h-[500px] bg-gray-300 rounded-lg"></div>
                <div className="w-1/4 h-[500px] bg-gray-300 rounded-lg"></div>
            </div>

            {/* Title */}
            <Typography as="div" variant="h1" className="w-1/3 h-8 mx-auto bg-gray-300 rounded-full">&nbsp;</Typography>

            {/* Table Section */}
            <div className="mt-4 p-4 border rounded-lg">
                {/* Table Controls */}
                <div className="flex justify-between items-center mb-4">
                    <div className="w-36 h-10 bg-gray-300 rounded-full"></div>
                    <div className="w-36 h-10 bg-gray-300 rounded-full"></div>
                </div>

                {/* Table Headers */}
                <div className="grid grid-cols-5 gap-4 mb-2">
                    <div className="h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded-full"></div>
                    <div className="h-6 bg-gray-300 rounded-full"></div>
                </div>

                {/* Table Rows */}
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="grid grid-cols-5 gap-4 mb-2">
                        <div className="h-6 bg-gray-300 rounded-full"></div>
                        <div className="h-6 bg-gray-300 rounded-full"></div>
                        <div className="h-6 bg-gray-300 rounded-full"></div>
                        <div className="h-6 bg-gray-300 rounded-full"></div>
                        <div className="h-6 bg-gray-300 rounded-full"></div>
                    </div>
                ))}

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <div className="w-1/4 h-6 bg-gray-300 rounded-full"></div>
                    <div className="w-1/4 h-6 bg-gray-300 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default ExcursionDetailsSkeleton;
