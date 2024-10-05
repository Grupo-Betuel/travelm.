import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Popover, PopoverContent,
    PopoverHandler,
    Typography
} from "@material-tailwind/react";
import React, {useMemo} from "react";
import {color} from "@material-tailwind/react/types/components/button";
import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation, Pagination} from "swiper/modules";
import {AppImage} from "@/components/AppImage";
import {IMedia} from "@/models/mediaModel";

export interface InfoCardItemProps {
    title?: string;
    subtitle?: string;
    description?: string;
    actions: {
        icon?: React.ReactNode;
        text: string;
        onClick: () => void;
        color?: color;
    }[];
    icon?: React.ReactNode;
    medias?: IMedia[];
}

const maxDescriptionLength = 70;
const maxDescriptionLengthLess = 40;
export const InfoCardItem = ({title, medias, subtitle, actions, icon, description}: InfoCardItemProps) => {
    const maxLength = useMemo(() => {
        return (medias?.length || 0) > 0 ? maxDescriptionLengthLess : maxDescriptionLength;
    }, [medias])

    return (
        <Card className="border border-blue-gray-100 shadow-sm h-[230px] w-[220px]">
            {medias && medias.length > 0 && (
                <CardHeader
                    className="mt-[-40px] !min-h-[90px]"
                >
                    <Swiper modules={[Navigation, Pagination]}
                            spaceBetween={5}
                            slidesPerView={1}
                            className="text-xs custom-swiper relative max-h-[90px]"
                            navigation pagination={{clickable: true}}
                    >
                        {medias.map((media, i) => (
                            <SwiperSlide key={i}>
                                <AppImage src={media.content} alt={media.title}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CardHeader>
            )}

            <CardBody className="p-2 text-right h-full flex flex-col relative">
                {icon && <div className="top-5 left-3 absolute grid h-9 w-9 place-items-center bg-blue-400 rounded-lg">
                    {icon}
                </div>}
                <Typography className="font-normal text-blue-gray-600">
                    <Typography variant="small" className="max-w-[145px] break-all float-right">{subtitle}</Typography>
                </Typography>
                <Typography variant="h5" color="blue-gray">
                    {title}
                </Typography>
                <div className="px-2 text-justify border-0 shadow-none mt-1">
                    <Typography variant="small" className="font-normal text-blue-gray-600">
                        {description?.slice(0, maxLength)}
                        {(description?.length || 0) > maxLength && (
                            <Popover>
                                <PopoverHandler>
                                    <Button variant="text" size="sm" className="p-0 text-sm" color="blue">
                                        <Typography
                                            variant="small"
                                            className="font-bold text-[11px]"
                                        >... Ver más</Typography>
                                    </Button>
                                </PopoverHandler>
                                <PopoverContent className="z-[9999] w-[25rem]  break-all overflow-hidden">
                                    <Typography
                                        variant="small"
                                        color="gray"
                                        className="font-normal text-blue-gray-500 "
                                    >{description}</Typography>
                                </PopoverContent>
                            </Popover>

                        )}
                    </Typography>
                </div>
            </CardBody>
            <CardFooter
                className="border-t border-blue-gray-50 p-2 flex justify-around overflow-x-auto items-center min-h-[50px]">
                {actions.map((action, index) => (
                    <Button key={index}
                            variant="text"
                            className={`hover:bg-transparent ${index !== actions.length - 1 ? 'border-r' : ''} rounded-none flex items-center p-0 px-3 justify-center gap-2`}
                            color={action.color || "blue"}
                            onClick={action.onClick}>
                        {action.icon}
                        {action.text}
                    </Button>
                ))}
            </CardFooter>
        </Card>
    )
}
