import {
    Button,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Option,
    Select,
    Textarea,
    Typography
} from "@material-tailwind/react";
import SocialNetworkForm from "./SocialNetworkForm";
import MediaHandler, {IMediaHandled} from "./MediaHandler";
import MapPicker from "../../../../components/MapPicker";
import BedroomsHandler from "./BedroomssHandler";
import {FinanceHandler} from "./FinanceHandler";
import {IFinance} from "@/models/financeModel";
import React, {useEffect, useMemo, useState} from "react";
import {IOrganization, organizationTypeList, OrganizationTypesEnum} from "@/models/organizationModel";
import {ILocation} from "@/models/ordersModels";
import {IMediaFile} from "@/models/mediaModel";
import {IBedroom} from "@/models/bedroomModel";
import {ICustomComponentDialog, IPathDataParam} from "@/models/common";
import {getCrudService} from "@/api/services/CRUD.service";
import UserForm from "../../users/components/UserForm";
import IUser, {UserRoleTypes, UserTypes} from "../../../../models/interfaces/userModel";

export interface OrganizationHandlerProps {
    dialog?: ICustomComponentDialog;
    onCreate?: (organization: IOrganization) => any;
    onUpdate?: (organization: Partial<IOrganization>) => any;
    organizationData?: IOrganization;
}

export const emptyOrganization: IOrganization = {
    type: OrganizationTypesEnum.CHURCH,
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

const userService = getCrudService('travelUsers');

export const OrganizationForm: React.FC<OrganizationHandlerProps> = (
    {
        dialog,
        onCreate,
        onUpdate,
        organizationData
    }) => {


    const [organization, setOrganization] = useState<IOrganization>(emptyOrganization);
    const {data: organizationUserData} = userService.useFetchAllTravelUsers({organization: organization?._id}, {skip: !organization?._id});
    const [isOrganizationUserDialogOpen, setIsOrganizationUserDialogOpen] = useState(false);
    const [addUser] = userService.useAddTravelUsers();
    const [updateUser] = userService.useUpdateTravelUsers('organization');
    const [organizationUser, setOrganizationUser] = useState<IUser>()

    useEffect(() => {
        organizationUserData?.[0] && setOrganizationUser(organizationUserData?.[0])
    }, [organizationUserData]);

    const toggleOrganizationUserDialog = () => setIsOrganizationUserDialogOpen(!isOrganizationUserDialogOpen);

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

    const handleLogoChange = ({logo}: IMediaHandled): void => {
        if (logo) {
            setOrganization((prevFormData) => ({
                ...prevFormData,
                logo,
            }));
        }
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
        if (!fee.price) return;
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

    const enableUserIsActive = useMemo(() => !!organization._id, [organization]);
    useEffect(() => {
        if (!dialog?.open) {
            setOrganization(emptyOrganization);
        }
    }, [dialog?.open]);

    const onCreateOrganizationUser = async (user: IUser) => {
        const userData: IUser & IPathDataParam = {
            ...user,
            organization: organization._id as string,
            type: UserTypes.ORGANIZATION,
            role: UserRoleTypes.ADMIN,
            path: 'register'
        }

        const {data: createdUser} = await addUser(userData);
        console.log('created user', createdUser);
        setOrganizationUser({...createdUser, password: ''} as IUser);
    }

    const onUpdateOrganizationUser = async (user: IUser) => {
        const {data: updatedUser} = await updateUser(user);
        console.log('updated user', updatedUser);
        setOrganizationUser({...updatedUser, password: ''} as IUser);
    }

    const onSubmitOrganizationUser = async (user: IUser) => {
        if (!organization._id) {
            // TODO: TOAST ALERT THE ORGANIZATION MUST BE CREATED FIRST
            return;
        }

        if (user._id) {
            // UPDATe
            await onUpdateOrganizationUser(user);
        } else {
            await onCreateOrganizationUser(user);
        }

        toggleOrganizationUserDialog();
    }


    console.log('organization user', organizationUser)
    const form = (
        <div className="space-y-4">
            <MediaHandler logoMedia={organization.logo} medias={organization.medias} onChange={handleLogoChange} handle={{logo: true}}/>
            {/*<div className="flex items-center space-x-4">*/}
            {/*    <Avatar src={organization.logo?.content} size="lg"/>*/}
            {/*    <input type="file" accept="image/*"*/}
            {/*           onChange={(e: any) => handleLogoChange(e.target.files?.[0])}/>*/}
            {/*</div>*/}

            <Input label="Name" name="name" value={organization.name} onChange={handleInputChange}/>
            <Select
                label="Type"
                name="type"
                value={organization.type}
                onChange={(value) => handleInputChange({target: {value: value, name: 'type'}} as any)}
                className="mb-4"
            >
                {organizationTypeList.map((type) => (
                    <Option key={type} value={type}>{type}</Option>
                ))}
            </Select>
            <Textarea label="Description" name="description" value={organization.description}
                      onChange={handleInputChange}/>
            <SocialNetworkForm onChange={handleSocialNetworksChange}/>
            <MediaHandler handle={{images: true}} onChange={onChangeMedia} medias={organization.medias}/>
            <MapPicker onLocationSelect={handleLocationChange}/>
            <BedroomsHandler bedrooms={organization.bedrooms} updateBedrooms={handleBedrooms}/>
            <FinanceHandler finance={organization.entryFee || {} as IFinance} updateFinance={handleEntryFee}/>
            {enableUserIsActive && <Button
                onClick={toggleOrganizationUserDialog}>{organizationUser ? 'Editar Usuario' : 'Habilitar Usuario'}</Button>}
            {/*<ContactForm onChange={handleContactChange}/>*/}
        </div>

    )


    return (
        <div>
            {dialog ? (
                    <Dialog open={dialog.open} handler={dialog.handler} size="xxl" dismiss={{enabled: false}}>
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

            <UserForm
                dialog={{
                    open: isOrganizationUserDialogOpen,
                    handler: toggleOrganizationUserDialog,
                }}
                role={'admin'}
                initialUser={organizationUser}
                onSubmit={onSubmitOrganizationUser}
            ></UserForm>
        </div>
    )

}