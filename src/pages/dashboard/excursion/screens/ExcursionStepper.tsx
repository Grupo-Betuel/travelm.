import React, {useEffect, useState} from 'react';
import {Button, Card, CardBody, CardHeader, Typography} from '@material-tailwind/react';
import {UserIcon} from '@heroicons/react/20/solid';
import ExcursionGeneralInfo from '../components/ExcursionGeneralnfo';
import {MediaHandlerStep} from '../components/Steps/MediaHandlerStep';
import {ExcursionStatusEnum, IExcursion} from '../../../../models/excursionModel';
import {
    validateStep1,
    validateStep2,
    validateStep3,
    validateStep4,
    validateStep5,
    validateStep6,
    validateStep7
} from "../../../../utils/excursionStepperValidations";
import {OrganizationsDestinationsStep} from "../components/Steps/OrganizationsDestinationsStep";
import ActivitiesHandlerStep from "../components/Steps/ActivitiesHandlerStep";
import FoodsHandlerStep from "../components/Steps/FoodsHandlerStep";
import {ProjectHandlerStep} from "../components/Steps/ProjectionsHandlerStep";
import {TransportHandlerStep} from "../components/Steps/TransportHandlerStep";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {useNavigate, useParams} from "react-router-dom";
import {EXCURSION_CONSTANTS} from "../../../../constants/excursion.constant";
import {useGCloudMediaHandler} from "../../../../hooks/useGCloudMedediaHandler";
import {IMediaFile} from "../../../../models/mediaModel";
import FinancesHandlerStep from "../components/Steps/FinancesHandlerStep";
import {IStep} from "../../../../models/common";
import {AppStepper} from "../../../../components/AppStepper";
import {useCheckUserAuthorization} from "../../../../hooks/useCheckUserAuthorization";
import {useAuth} from "../../../../context/authContext";


const excursionService = getCrudService("excursions");

const ExcursionStepper: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<number | null>(null);
    const [excursion, setExcursion] = useState<IExcursion>({} as IExcursion);
    const [isFormValid, setIsFormValid] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [updateExcursion, {
        isLoading: isUpdatingExcursion,
        data: updatedExcursion
    }] = excursionService.useUpdateExcursions();
    const [addExcursion, {
        isLoading: isCreatingExcursion,
        data: createdExcursion
    }] = excursionService.useAddExcursions();
    const params = useParams();
    const {
        data: excursionData,
        isLoading: isLoadingExcursion
    } = excursionService.useFetchByIdExcursions(params.excursionId as string, {skip: !params.excursionId});
    const navigate = useNavigate();
    const {uploadSingleMedia, uploadMultipleMedias} = useGCloudMediaHandler();
    const {user} = useAuth();

    useEffect(() => {
        if (currentStep !== 0 && !currentStep) return;
        const key = `${EXCURSION_CONSTANTS.CURRENT_STEP_STORE_KEY}::${params.excursionId || 'new'}`;
        // @ts-ignore
        localStorage.setItem(key, JSON.stringify(currentStep));
    }, [currentStep]);

    useEffect(() => {
        const key = `${EXCURSION_CONSTANTS.CURRENT_STEP_STORE_KEY}::${params.excursionId || 'new'}`;
        // @ts-ignore
        const step = JSON.parse(localStorage.getItem(key) || 0);
        if (step !== null) setCurrentStep(step);
    }, [params.excursionId]);

    useEffect(() => {
        validateFormData();
    }, [excursion]);


    useEffect(() => {
        if (createdExcursion && createdExcursion._id) {
            navigate('/dashboard/excursions/handler/' + createdExcursion._id, {replace: true});
            setExcursion(createdExcursion);
        }
    }, [createdExcursion]);

    useEffect(() => {
        if (updatedExcursion) setExcursion(updatedExcursion);
    }, [updatedExcursion]);


    const validateFormData = (): void => {
        const errors: string[] = [];
        // Define validation functions for each step
        const validationFunctions = [
            validateStep0, // Informacion
            validateStep1, // Checkpoints
            validateStep2, // Media
            validateStep3, // Clients
            validateStep4, // Activities
            validateStep5, // Foods
            validateStep6, // Projections
            validateStep7  // TransportStep
        ];

        // Execute validation function for current step
        if (validationFunctions[currentStep]) {
            const stepErrors = validationFunctions[currentStep](excursion);
            errors.push(...stepErrors);
        }

        // Update form validity and validation errors
        setIsFormValid(errors.length === 0);
        setValidationErrors(errors);
    };

    const handleNext = (): void => {
        if (currentStep < excursionSteps.length
            // && isFormValid
        ) {
            setCurrentStep(currentStep + 1);
            handleExcursionSave();
        }
    };

    const handleBack = (): void => {
        if (currentStep > 0) setCurrentStep(currentStep - 1);
    };

    const updateExcursionData = async (data: Partial<IExcursion>): void => {
        const newData: IExcursion = {...excursion, ...data};
        const stepData = excursionSteps[currentStep || 0];

        console.log('updated', newData, stepData)
        setExcursion(newData);
    };

    const handleExcursionActivities = async () => {
        const activities = await Promise.all(excursion.activities.map(async (activity) => {
            // const activityAudios = activity.audios.filter((audio: any) => audio.file) as IMediaFile[];
            const activityMediaImages = await uploadMultipleMedias(activity.images as IMediaFile[]);
            // const activityAudiosUrls = await uploadMultipleMedias(activityAudios);
            return {...activity, images: activityMediaImages};
        }));

        return activities;
    }


    const handleExcursionMedia = async (): Promise<IExcursion> => {
        const excursionData: IExcursion = structuredClone({...excursion});
        const imageFiles: IMediaFile[] = [] as IMediaFile[];
        const audioFiles: IMediaFile[] = [] as IMediaFile[];

        [...excursion.images, ...excursion.audios].forEach((media: any) => {
            if (media.type === 'image') {
                imageFiles.push({
                    ...media,
                    owner: user?.organization || media.owner,
                });
            } else if (media.type === 'audio') {
                audioFiles.push({
                    ...media,
                    owner: user?.organization || media.owner,
                });
            }
        });

        const uploadedImages = await uploadMultipleMedias(imageFiles);
        const uploadedAudios = await uploadMultipleMedias(audioFiles);
        const images = uploadedImages;
        const audios = uploadedAudios;

        if (!!excursionData.flyer) {
            const flyer = await uploadSingleMedia(excursionData.flyer as IMediaFile);
            const newFlyerData = flyer || excursionData.flyer || {};
            excursionData.flyer = {
                ...newFlyerData,
                owner: user?.organization || flyer?.owner,
            };
        }

        excursionData.images = images;
        excursionData.audios = audios;

        return excursionData;
    }

    const handleExcursionActivitiesData = async (): Promise<IExcursion> => {
        const excursionData: IExcursion = structuredClone({...excursion});
        if (excursionData.activities && excursionData.activities.length > 0) {

            const activities = await handleExcursionActivities()
            excursionData.activities = activities;
        }


        return excursionData;
    }

    const handleExcursionSave = async (): Promise<void> => {
        const stepData = excursionSteps[currentStep || 0];
        let excursionData: IExcursion = structuredClone({...excursion});

        switch (stepData.type) {
            case 'images':
                excursionData = await handleExcursionMedia();
                break;
            case 'activities':
                excursionData = await handleExcursionActivitiesData();
                break;
        }

        if (!!excursion._id) {
            let excursionToUpdate: Partial<IExcursion> = {};
            if (stepData?.properties?.length && (stepData?.properties?.length || 0) > 0) {

                stepData.properties.forEach((property) => {
                    excursionToUpdate[property] = excursionData[property] as any;
                });

            } else {
                excursionToUpdate = excursionData;
            }

            await updateExcursion({_id: excursion._id, status: excursion.status, ...excursionToUpdate});
        } else {
            await addExcursion(excursion);
        }

    }


    const excursionSteps: IStep<IExcursion>[] = [
        {
            properties: ['title', 'description', 'startDate', 'endDate'],
            label: 'Informacion',
            icon: <UserIcon className="max-w-[20px]"/>,
            type: 'title',
            component: <ExcursionGeneralInfo
                excursionData={excursion}
                updateExcursion={updateExcursionData}
            />,
        },
        {
            properties: ['organizations'],
            label: 'Organizaciones',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <OrganizationsDestinationsStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['destinations'],
            label: 'Destinos',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <OrganizationsDestinationsStep
                type="destinations"
                excursionData={excursion}
                updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['images', 'audios', 'videos', 'flyer'],
            label: 'Imagenes',
            type: 'images',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <MediaHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['activities'],
            label: 'Actividades',
            type: 'activities',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <ActivitiesHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['foods'],
            label: 'Comidas',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <FoodsHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['transport'],
            label: 'Transporte',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <TransportHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['finance'],
            label: 'Finanzas',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <FinancesHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: ['projections'],
            label: 'Proyecciones',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <ProjectHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>,
        },
        {
            properties: [],
            label: 'Compartir',
            icon: <UserIcon className="max-w-[20px]"/>,
            component: <div></div>,
        },
    ];

    const onStepClick = (index: number, step: IStep<IExcursion>) => {
        setCurrentStep(index);
    }

    useEffect(() => {
        if (
            // excursion.organizations && excursion.organizations.length > 0 &&
            // excursion.activities && excursion.activities.length > 0 &&
            // excursion.foods && excursion.foods.length > 0 &&
            // excursion.projections && excursion.projections.length > 0 &&
            excursion.title, excursion.description && excursion.startDate && excursion.endDate &&
            excursion.destinations && excursion.destinations.length > 0 &&
            excursion.flyer &&
            excursion.transport &&
            excursion.finance
        ) {
            if (excursion.status !== 'completed') {
                setExcursion({...excursion, status: ExcursionStatusEnum.COMPLETED});
            }
        } else {
            console.log('draft')
            if (excursion.status !== 'draft') {
                setExcursion({...excursion, status: ExcursionStatusEnum.DRAFT});
            }
        }

    }, [excursion]);

    useEffect(() => {
        console.log('excursionData =>', excursionData)
        if (excursionData) setExcursion({...excursionData});
    }, [excursionData]);

    return (
        <Card>
            <CardHeader>
                <Typography variant="h1" className="p-2 text-center">
                    {params.excursionId ? 'Editar' : 'Create'} Excursión
                </Typography>
            </CardHeader>
            <CardBody>
                <AppStepper<IExcursion>
                    steps={excursionSteps}
                    activeStep={currentStep || 0}
                    onClickStep={onStepClick}
                />
                <div className="flex justify-between mt-2">
                    <Button size="lg" color="blue" onClick={handleBack} disabled={currentStep === 0}>
                        Back
                    </Button>
                    <Button
                        size="lg"
                        color="blue"
                        onClick={handleNext}
                        // disabled={currentStep === 7 || !isFormValid}
                    >
                        {currentStep === excursionSteps.length ? 'Finish' : 'Next'}
                    </Button>
                </div>
                {validationErrors.length > 0 && (
                    <div className="mt-2">
                        {validationErrors.map((error, index) => (
                            <Typography key={index} color="red">{error}</Typography>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

// Validation functions for each step
const validateStep0 = (formData: IExcursion): string[] => {
    const errors: string[] = [];
    if (!formData.title) errors.push('Title is required.');
    if (!formData.description) errors.push('Description is required.');
    return errors;
};

// Add validation functions for other steps as needed...

export default ExcursionStepper;


{/*<Stepper activeStep={currentStep || 0} className="p-4 overflow-x-scroll h-[200px] w-[100%]">*/
}
{/*    {excursionSteps.map((step, index) => (*/
}
{/*        <Step key={index} onClick={() => setCurrentStep(index)} >*/
}
{/*            {step.icon}*/
}
{/*            <div className="absolute -bottom-[2.5rem] w-max text-center">*/
}
{/*                <Typography*/
}
{/*                    className="min-w-[100px]"*/
}
{/*                    variant="h6"*/
}
{/*                    color={currentStep === index ? 'blue-gray' : 'gray'}*/
}
{/*                >*/
}
{/*                    {step.label}*/
}
{/*                </Typography>*/
}
{/*            </div>*/
}
{/*        </Step>*/
}
{/*    ))}*/
}
{/*</Stepper>*/
}
{/*<div>*/
}
{/*    {currentStep === 0 && (*/
}
{/*        <ExcursionGeneralInfo*/
}
{/*            excursionData={excursion}*/
}
{/*            updateExcursion={updateExcursionData}*/
}
{/*        />*/
}
{/*    )}*/
}
{/*    {currentStep === 1 &&*/
}
{/*        <OrganizationsDestinationsStep excursionData={excursion} updateExcursion={updateExcursionData}/>*/
}
{/*    }*/
}
{/*    {currentStep === 2 &&*/
}
{/*        <OrganizationsDestinationsStep type="destinations" excursionData={excursion} updateExcursion={updateExcursionData}/>*/
}
{/*    }*/
}

{/*    {currentStep === 3 &&*/
}
{/*        <MediaHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>*/
}
{/*    }*/
}
{/*    {currentStep === 4 &&*/
}
{/*        <ActivitiesHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>}*/
}
{/*    {currentStep === 5 &&*/
}
{/*        <FoodsHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>}*/
}
{/*    {currentStep === 6 &&*/
}
{/*        <ProjectHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>}*/
}
{/*    {currentStep === 7 &&*/
}
{/*        <TransportHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>*/
}
{/*    }*/
}
{/*    {currentStep === 8 &&*/
}
{/*        <FinancesHandlerStep excursionData={excursion} updateExcursion={updateExcursionData}/>*/
}
{/*    }*/
}

{/*    {currentStep === 9 &&*/
}
{/*        <div>*/
}
{/*            <Typography variant="h2">Comparte!</Typography>*/
}
{/*        </div>*/
}
{/*    }*/
}

{/*</div>*/
}