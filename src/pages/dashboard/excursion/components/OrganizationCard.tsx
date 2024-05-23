import React, {useMemo} from 'react';
import {Card, CardBody, Typography, Avatar, CardHeader} from "@material-tailwind/react";
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {GoogleMap, LoadScript, Marker} from '@react-google-maps/api';
import {IOrganization} from "../../../../models/organizationModel";
import {Navigation, Pagination} from "swiper/modules";
import {useRenderMedia} from "../../../../hooks/useRenderMedia"; // Adjust the path as necessary
import {FaFacebookF, FaTwitter, FaWhatsapp, FaPhone, FaInstagram} from 'react-icons/fa';
import {TravelMap} from "../../../../components/TravelMap";

interface OrganizationCardProps {
    organization: IOrganization;
    className?: string;
    onClick?: (data: IOrganization) => void;
}

export const OrganizationCard: React.FC<OrganizationCardProps> = ({onClick, organization, className}) => {
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


    const handleOnClick = () => {
        onClick && onClick(organization);
    }

    return (
        <Card className={className} onClick={handleOnClick}>
            <CardHeader>
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    spaceBetween={5}
                    slidesPerView={1}
                    className="text-xs"
                    // onSwiper={(swiper) => console.log(swiper)}
                    // onSlideChange={() => console.log('slide change')}
                >
                    {organization?.medias?.map((media, index) => (
                        <SwiperSlide key={index}>
                            {renderMedia(media)}
                        </SwiperSlide>
                    ))}
                    <SwiperSlide>
                        {organization?.contact?.location && <TravelMap location={organization.contact.location}/>}
                    </SwiperSlide>
                </Swiper>
            </CardHeader>
            <CardBody>
                <div className="flex items-center space-x-4">
                    <Avatar src={organization?.logo?.content} size="xl"/>
                    <Typography variant="h5" className="font-bold">{organization.name}</Typography>
                </div>

                <Typography>{organization.description}</Typography>
                <div className="flex mt-4">
                    {organization?.contact?.tel &&
                        <a target="_blank" href={`tel:${organization?.contact?.tel}`} className="mr-4"><FaPhone/></a>}
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
                </div>
                {organization.contact?.location?.address &&
                    <Typography>{organization.contact.location.address}</Typography>}
            </CardBody>
        </Card>
    );
};


