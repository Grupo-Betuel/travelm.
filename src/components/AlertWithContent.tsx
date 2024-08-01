import React from "react";
import { Alert, Button, Typography } from "@material-tailwind/react";

function Icon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
        </svg>
    );
}

interface AlertWithContentProps<T> {
    content: string;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AlertWithContent<T>({content, open, setOpen}: AlertWithContentProps<T>) {
    // const [open, setOpen] = React.useState(true);

    return (
        <>
            <Alert
                open={open}
                className="w-96 h-32 bg-yellow-600 fixed bottom-10 left-10"
                icon={<Icon />}
                onClose={() => setOpen(false)}
            >
                <Typography variant="h5" color="white">
                    Warning
                </Typography>
                <Typography color="white" className="mt-2 font-normal">
                    {content}
                </Typography>
            </Alert>
        </>
    );
}