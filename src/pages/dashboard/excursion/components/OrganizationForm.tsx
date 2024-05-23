import {
    Avatar, Button,
    Dialog,
    DialogBody, DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Textarea,
    Typography
} from "@material-tailwind/react";
import SocialNetworkForm from "./SocialNetworkForm";
import MediaHandler, {IMediaHandled} from "./MediaHandler";
import MapPicker from "../../../../components/MapPicker";
import BedroomsHandler from "./BedroomssHandler";
import {FinanceHandler} from "./FinanceHandler";
import {IFinance} from "../../../../models/financeModel";
import React, {useEffect, useState} from "react";
import {useGCloudMediaHandler} from "../../../../hooks/useGCloudMedediaHandler";
import {IOrganization} from "../../../../models/organizationModel";
import {ILocation} from "../../../../models/ordersModels";
import {IMediaFile} from "../../../../models/mediaModel";
import {IBedroom} from "../../../../models/bedroomModel";
import {ICustomComponentDialog} from "../../../../models/common";

export interface OrganizationHandlerProps {
    dialog?: ICustomComponentDialog;
    onCreate?: (organization: IOrganization) => any;
    onUpdate?: (organization: Partial<IOrganization>) => any;
    organizationData?: IOrganization;
}

export const emptyOrganization: IOrganization = {
    type: 'church',
    name: '',
    description: '',
    logo: {} as IMediaFile,
    socialNetworks: [],
    medias: [],
    contact: {
        location: {
            latitude: 0,
            longitude: 0,
        },
        phone: '',
        email: '',
        tel: ''
    },
    reviews: [],
    bedrooms: [],
};


export const OrganizationForm: React.FC<OrganizationHandlerProps> = (
    {
        dialog,
        onCreate,
        onUpdate,
        organizationData
    }) => {


    const {uploadMultipleMedias, uploadSingleMedia, deleteMedias} = useGCloudMediaHandler()
    const [organization, setOrganization] = useState<IOrganization>(emptyOrganization);

    const handleInputChange = (event: React.ChangeEvent<any>): void => {
        const {name, value} = event.target;
        setOrganization((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handleLocationChange = (location: ILocation): void => {
        setOrganization({
            ...organization,
            contact: {
                ...organization.contact,
                location,
            },
        })
    }
    const handleLogoChange = (file: any | null): void => {
        // Handle logo upload here

        const logo: IMediaFile = {
            // @ts-ignore
            content: URL.createObjectURL(file),
            type: 'image',
            title: organization.name || 'No title',
            file,
        };

        setOrganization((prevFormData) => ({
            ...prevFormData,
            logo,
        }));
    };

    const handleSocialNetworksChange = (socialNetworks: any[]): void => {
        setOrganization((prevFormData) => ({
            ...prevFormData,
            socialNetworks,
        }));
    };

    const handleMediasChange = (medias: any[]): void => {
        setOrganization((prevFormData) => ({
            ...prevFormData,
            medias,
        }));
    };

    const handleContactChange = (contact: any): void => {
        setOrganization((prevFormData) => ({
            ...prevFormData,
            contact,
        }));
    };

    const handleSubmit = async () => {
        if (organization._id) {
            onUpdate && onUpdate(organization);
        } else {
            onCreate && onCreate(organization);
        }

        dialog?.handler();
    };

    const onChangeMedia = (data: IMediaHandled) => {
        setOrganization({
            ...organization,
            medias: [
                ...data.audios,
                ...data.images,
                ...data.videos,
            ]
        })
    }

    const handleBedrooms = (bedrooms: IBedroom[]) => {
        setOrganization({
            ...organization,
            bedrooms,
        });
    }

    const handleEntryFee = (fee: IFinance) => {
        setOrganization({
            ...organization,
            entryFee: fee,
        });
    }

    useEffect(() => {
        if (organizationData) {
            setOrganization(organizationData)
        }
    }, [organizationData]);


    const form = (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <Avatar src={organization.logo?.content} size="lg"/>
                <input type="file" accept="image/*"
                       onChange={(e: any) => handleLogoChange(e.target.files?.[0])}/>
            </div>
            <Input label="Name" name="name" value={organization.name} onChange={handleInputChange}/>
            <Textarea label="Description" name="description" value={organization.description}
                      onChange={handleInputChange}/>
            <SocialNetworkForm onChange={handleSocialNetworksChange}/>
            <MediaHandler onChange={onChangeMedia} medias={organization.medias}/>
            <MapPicker onLocationSelect={handleLocationChange}/>
            <BedroomsHandler bedrooms={organization.bedrooms} updateBedrooms={handleBedrooms}/>
            <FinanceHandler finance={organization.entryFee || {} as IFinance} updateFinance={handleEntryFee}/>
            {/*<ContactForm onChange={handleContactChange}/>*/}
        </div>

    )

    useEffect(() => {
        if (!dialog?.open) {
            setOrganization(emptyOrganization);
        }
    }, [dialog?.open]);

    return (
        <div>
            {dialog ? (
                    <Dialog open={dialog.open} handler={dialog.handler} size="xxl">
                        <DialogHeader className="justify-between">
                            <Typography>{organization._id ? 'Actualizar' : 'Crear'} Organizacion.</Typography>
                            <IconButton
                                color="blue-gray"
                                size="sm"
                                variant="text"
                                onClick={dialog.handler}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </IconButton>
                        </DialogHeader>
                        <DialogBody className="overflow-y-scroll">
                            {form}
                        </DialogBody>
                        <DialogFooter>
                            <Button
                                variant="text"
                                color="red"
                                onClick={dialog.handler}
                                className="mr-1"
                            >
                                <span>Cancel</span>
                            </Button>
                            <Button variant="gradient" color="green"
                                    onClick={handleSubmit}
                            >
                                <span>Confirmar</span>
                            </Button>
                        </DialogFooter>
                    </Dialog>)
                : form
            }
        </div>
    )

}