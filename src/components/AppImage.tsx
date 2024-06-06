import {Typography, Dialog, DialogBody, Button, DialogFooter} from "@material-tailwind/react";
import React, {useState} from "react";
import {ICaption} from "../models/common";
import {CgClose} from "react-icons/cg";

export interface ICustomImageProps {
    src: string;
    alt?: string;
    className?: string;
    caption?: ICaption;
}

export function AppImage(
    {
        src,
        alt,
        caption,
        className
    }: ICustomImageProps) {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <figure className={`relative h-full w-auto ${className || ''} hover:opacity-90`} onClick={handleOpen}>
                <img
                    className="h-full w-full rounded-xl object-cover object-center cursor-pointer"
                    src={src}
                    alt={alt}
                />
                {caption && <figcaption
                    className="absolute bottom-3 left-2/4 flex w-[calc(100%-1rem)] -translate-x-2/4 justify-between rounded-xl border border-white bg-white/75 py-4 px-6 shadow-lg shadow-black/5 saturate-200 backdrop-blur-sm">
                    <div>
                        {caption?.title && <Typography variant="h5" color="blue-gray">
                            {caption?.title}
                        </Typography>}
                        {caption?.subtitle && <Typography color="gray" className="mt-2 font-normal">
                            {caption?.subtitle}
                        </Typography>}
                    </div>
                    {caption?.endTitle && <Typography variant="h5" color="blue-gray">
                        {caption?.endTitle}
                    </Typography>}
                </figcaption>}
            </figure>
            <Dialog open={open} handler={handleOpen} className="bg-transparent shadow-[unset]">
                <DialogBody className="flex justify-center bg-transparent">
                    <img
                        className="w-auto h-full max-h-[80dvh] rounded-xl object-cover object-center"
                        src={src}
                        alt={alt}
                    />
                </DialogBody>
                <DialogFooter className="flex justify-center p-4">
                    <Button size="lg" variant="text" color="white" className="flex items-center" onClick={handleOpen}>
                        <CgClose className="w-6 h-6 ml-2"/>
                        Cerrar
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
