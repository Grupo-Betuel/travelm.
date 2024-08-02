import React, {useMemo, useState} from 'react';
import {Card, CardBody, Typography, Avatar, CardHeader, CardFooter, Button} from "@material-tailwind/react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {IOrganization} from "../../../../models/organizationModel";
import {Navigation, Pagination} from "swiper/modules";
import {useRenderMedia} from "../../../../hooks/useRenderMedia"; // Adjust the path as necessary
import {FaFacebookF, FaTwitter, FaWhatsapp, FaPhone, FaInstagram} from 'react-icons/fa';
import {TravelMap} from "../../../../components/TravelMap";
import {IMG_CONSTANTS} from "../../../../constants/img.utils";
import {Link} from "react-router-dom";
import {GrLocation} from "react-icons/gr";
import {AlertWithContent} from "@/components/AlertWithContent";

interface OrganizationCardProps {
    organization: IOrganization;
    className?: string;
    onEdit?: (data: IOrganization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({onEdit, organization, className}) => {
    if (!organization) return null;
    const {renderMedia} = useRenderMedia();
    const mapStyles = {
        height: "100%",
        width: "100%"
    };

    const center = useMemo(() => ({
        lat: organization.contact?.location?.latitude,
        lng: organization.contact?.location?.longitude
    }), [organization?.contact?.location])


    const handleOnEdit = () => {
        onEdit && onEdit(organization);
    }
    const [alertVisible, setAlertVisible] = useState(false);
    const handleCopyToClipboard = (text : string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setAlertVisible(true);
                setTimeout(() => {
                    setAlertVisible(false);
                }, 2000); // La alerta será visible durante 2 segundos
            })
            .catch(err => console.error('Error copying text: ', err));
    };

    return (
        <Card className={`${className} min-w-[250px]`}>
            {!!organization?.medias?.length &&
                <CardHeader className="min-h-[100px]">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        spaceBetween={5}
                        slidesPerView={1}
                        className="text-xs custom-swiper relative max-h-[100px]"
                    >
                        {organization?.medias?.map((media, index) => (
                            <SwiperSlide key={index}>
                                {renderMedia(media)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </CardHeader>
            }

            <CardBody className="h-full">
                <div className="flex items-center space-x-4">
                    <Avatar src={organization?.logo?.content || IMG_CONSTANTS.LOGO_PLACEHOLDER} size="xl"/>
                    <span className="font-bold whitespace-break-spaces line-clamp-2">{organization.name}</span>
                </div>
                <div className="flex flex-col gap-2 py-4">
                    {organization.description && <Typography
                        className="whitespace-pre-line line-clamp-2">{organization.description}</Typography>}
                    {organization.entryFee?.price &&
                        <Typography><b>Entrada:</b> RD${organization.entryFee?.price.toLocaleString()}</Typography>}
                    {organization?.contact?.tel &&
                        <a target="_blank" href={`tel:${organization?.contact?.tel}`}
                           className="mr-4"><FaPhone/></a>}
                    {organization?.contact?.phone &&
                        <a target="_blank" href={`https://wa.me/${organization?.contact?.phone}`}
                           className="mr-4"><FaWhatsapp/></a>}
                    {organization.socialNetworks?.map((network, index) => (
                        <a key={index} href={network.url} target="_blank" rel="noopener noreferrer">
                            {network.type === 'instagram' && <FaInstagram className="text-blue-600 text-lg"/>}
                            {network.type === 'facebook' && <FaFacebookF className="text-blue-600 text-lg"/>}
                            {network.type === 'twitter' && <FaTwitter className="text-blue-600 text-lg"/>}
                        </a>
                    ))}
                    {/*Codigo sustituido por boton mas estetico conservando la funcionalidad*/}
                    {/*{!!(organization.contact?.location?.link || organization.contact?.location?.link) &&*/}
                    {/*    <div className="flex items-center gap-2">*/}
                    {/*        <GrLocation color="red" className="w-16 h-16"/>*/}
                    {/*        {*/}
                    {/*            organization.contact?.location?.link ?*/}

                    {/*                <Link target={"_blank"} to={organization.contact?.location?.link}*/}
                    {/*                      className="font-light text-blue-500 whitespace-pre-line line-clamp-1">*/}
                    {/*                    {organization.contact.location.address}*/}
                    {/*                </Link>*/}
                    {/*                : organization.contact?.location?.address &&*/}
                    {/*                <span*/}
                    {/*                    className="font-light whitespace-pre-line line-clamp-1">*/}
                    {/*            {organization.contact.location.address}*/}
                    {/*        </span>*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*}*/}

                </div>
            </CardBody>
            <CardFooter className="flex justify-between pt-0">
                {/*Funcionalidad de ubicacion mejor posicionada*/}
                {!!(organization.contact?.location?.link || organization.contact?.location?.address) &&
                    <div className="flex">
                        {
                            !organization.contact?.location?.link ?
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    onClick={() => window.open(organization.contact?.location?.link, '_blank')}
                                    className="text-blue-500 whitespace-pre-line line-clamp-1 px-4">
                                    {/*{organization.contact.location.address}*/}
                                    Ubicacion
                                </Button>
                                : organization.contact?.location?.address &&
                                <Button
                                    variant="outlined"
                                    color="blue"
                                    onClick={() => handleCopyToClipboard(organization.contact?.location?.address as string)}
                                    className="whitespace-pre-line line-clamp-1 px-4">
                                    Direccion
                                </Button>

                        }
                    </div>
                }
                <AlertWithContent content='Direccion Copiada en el portapapeles' open={alertVisible} setOpen={setAlertVisible} type="success"/>
                {onEdit && <Button className="px-4" variant="outlined" color="blue"
                                   onClick={handleOnEdit}>Editar</Button>}
            </CardFooter>
        </Card>
    );
};


