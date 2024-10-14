import React, {useMemo, useState} from 'react';
import {Button, Input, Option, Select, Typography} from '@material-tailwind/react';
import {FoodTypes, IFood} from "../../../../models/foodModel";
import {IOrganization} from "../../../../models/organizationModel";
import ReactQuill from "react-quill";
import {FinanceHandler} from "./FinanceHandler";
import {IFinance} from "../../../../models/financeModel";
import OrganizationHandler from "./OrganizationHandler";
import excursion from "../excursions";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import {IExpense} from "@/models/ExpensesModel";
import {IActivity} from "@/models/activitiesModel";
import {PAYMENT_CONSTANTS} from "@/constants/payment.constants";
import {paymentTypeLabels} from "@/models/PaymentModel";
import SelectControl from "@/components/SelectControl";
import organizations from "@/pages/dashboard/organizations/organizations";

interface FoodsHandlerProps {
    foods: IFood[];
    updateFoods: (foods: IFood[]) => void;
}

const emptyFood: IFood = {
    finance: {price: 0, cost: 0, type: 'food'},
    menu: '',
    type: 'lunch',
    images: [],
    organization: {} as IOrganization,
}

const foodService = getCrudService('foods');

const FoodsHandler: React.FC<FoodsHandlerProps> = ({foods, updateFoods}) => {
    const [foodForm, setFoodForm] = useState<IFood>(emptyFood);
    const [editFoodIndex, setEditFoodIndex] = useState<number>();
    const [deleteFood] = foodService.useDeleteFoods();

    const onConfirmAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IFood>) => {
        switch (type) {
            case 'delete':
                handleDeleteFood(data as IFood);
                break;
        }
    }

    const onDeniedAction = (type?: CommonConfirmActions, data?: CommonConfirmActionsDataTypes<IFood>) => {

    }

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IFood>>(onConfirmAction, onDeniedAction);

    const handleDeleteFood = (food: IFood) => {
        const filteredFoods = foods.filter((f) => {
            if (food._id) {
                return f._id !== food._id;
            }
            return JSON.stringify(f) !== JSON.stringify(food);
        });

        updateFoods(filteredFoods);
        food._id && deleteFood(food._id);
    };

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isValid},
        setValue,
        getValues,
    } = useForm<IFood>({
        defaultValues: emptyFood,
        mode: "all",
    });

    const newFoods = useWatch({control})

    const handleSave: SubmitHandler<IFood> = (formData) => {
        if (formData._id || editFoodIndex !== undefined) {
            const updatedFd = foods.map((fd, idx) => {
                if (formData._id && fd._id === formData._id) {
                    return formData;
                } else if (idx === editFoodIndex) {
                    return formData;
                }
                return fd;
            });

            updateFoods(updatedFd);
        } else {
            updateFoods([...foods, formData]);
        }

        reset(emptyFood);
        setEditFoodIndex(undefined);
    };


    const handleFinanceChange = (finance: IFinance) => {
        const updatedFinance =
            {
                ...foodForm,
                finance
            };
        setValue("finance", updatedFinance.finance)
    }

    const onSelectOrganization = (organizations: IOrganization[]) => {
        reset({...foodForm, organization: organizations[0]});
    }

    const cleanFoodHandler = () => {
        reset(emptyFood);
        setEditFoodIndex(undefined);
    }

    const startEditing = (index: number) => () => {
        setFoodForm(foods[index]);
        setEditFoodIndex(index);
    }

    const isFoodsValid = useMemo(() => {
        // Verifica que cada campo necesario tenga un valor válido
        return isValid &&
            newFoods.organization?._id &&
            newFoods.menu &&
            newFoods.type &&
            newFoods.finance?.price &&
            newFoods.organization._id.length > 0 && newFoods.finance.price > 0;
    }, [isValid, newFoods.organization, newFoods.menu, newFoods.type, newFoods.finance, organizations]);

    return (
        <div className="p-4">

            <form onSubmit={handleSubmit(handleSave)}>
                <Typography variant="h4" className="mb-4">Restaurante</Typography>
                <OrganizationHandler selected={foodForm.organization?._id ? [foodForm.organization] : undefined}
                                     onSelect={onSelectOrganization}/>
                <Typography variant="h5" className="mb-4">Manage Foods</Typography>

                <div className="flex flex-col gap-5 pb-5">
                    <ReactQuill
                        theme="snow"
                        value={getValues("menu")}
                        onChange={(content) => setValue("menu", content)}
                    />
                    <SelectControl
                        name="type"
                        control={control}
                        label="Tipo de Comida"
                        options={[
                            { label: 'Desert', value: 'desert' },
                            { label: 'Lunch', value: 'lunch' },
                            { label: 'Snack', value: 'snack' }
                        ]}
                        rules={{ required: 'El tipo de comida es requerido' }}
                        className={'w-full'}
                    />
                    <FinanceHandler finance={foodForm.finance} type="food" updateFinance={handleFinanceChange}/>

                </div>
                <div className="flex justify-between">
                    <Button color="blue" disabled={!isFoodsValid}
                            type={"submit"}>{editFoodIndex !== undefined ? 'Actualizar' : 'Crear'} Comida</Button>
                </div>
            </form>

            {foods.map((food, index) => (
                <div key={index} className="mt-2 bg-gray-100 p-2 rounded">
                    <Typography variant="h6">{food.menu}</Typography>
                    <Typography variant="h6">Type: {food.type}</Typography>
                    <Typography variant="h6">Price: ${food.finance.price}</Typography>
                    <Typography variant="h6">Cost: ${food.finance.cost}</Typography>
                    <div className="flex space-x-2 mt-2">
                        <Button color="red"
                                onClick={() => handleSetActionToConfirm('delete', 'Eliminar Menu')(food)}>Delete</Button>
                        <Button onClick={startEditing(index)}>Editar</Button>
                    </div>
                </div>
            ))}

            <ConfirmDialog/>
        </div>
    );
};

export default FoodsHandler;
