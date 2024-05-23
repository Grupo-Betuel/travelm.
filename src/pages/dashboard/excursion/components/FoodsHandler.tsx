import React, {useState} from 'react';
import {Button, Input, Option, Select, Typography} from '@material-tailwind/react';
import {FoodTypes, IFood} from "../../../../models/foodModel";
import {IOrganization} from "../../../../models/organizationModel";
import ReactQuill from "react-quill";
import {FinanceHandler} from "./FinanceHandler";
import {IFinance} from "../../../../models/financeModel";
import OrganizationHandler from "./OrganizationHandler";
import excursion from "../excursion";
import {getCrudService} from "../../../../api/services/CRUD.service";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "../../../../models/common";
import {useConfirmAction} from "../../../../hooks/useConfirmActionHook";

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

    const handleAddOrUpdateFood = () => {
        if (foodForm._id || editFoodIndex) {
            const updatedFoods = foods.map((fd, idx) => {
                if ((foodForm._id && fd._id === foodForm._id) || idx === editFoodIndex) {
                    return foodForm;
                }
                return fd;
            });

            updateFoods(updatedFoods);
        } else {
            updateFoods([...foods, foodForm]);
        }

        cleanFoodHandler()
    };

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

    const handleFinanceChange = (finance: IFinance) => {
        setFoodForm({...foodForm, finance});
    }

    const onSelectOrganization = (organizations: IOrganization[]) => {
        setFoodForm({...foodForm, organization: organizations[0]});
    }

    const cleanFoodHandler = () => {
        setFoodForm(emptyFood);
        setEditFoodIndex(undefined);
    }

    const startEditing = (index: number) => () => {
        setFoodForm(foods[index]);
        setEditFoodIndex(index);
    }

    return (
        <div className="p-4">

            <Typography variant="h4" className="mb-4">Restaurante</Typography>
            <OrganizationHandler onSelect={onSelectOrganization}
            />
            <Typography variant="h5" className="mb-4">Manage Foods</Typography>
            <div className="flex flex-col gap-5 pb-5">
                <ReactQuill
                    theme="snow"
                    value={foodForm.menu}
                    onChange={(content) => setFoodForm({...foodForm, menu: content})}
                />
                <Select
                    label="Type"
                    value={foodForm.type}
                    onChange={(value) => setFoodForm({...foodForm, type: value as FoodTypes})}
                    className="mb-4"
                >
                    <Option value="desert">Desert</Option>
                    <Option value="lunch">Lunch</Option>
                    <Option value="snack">Snack</Option>
                </Select>
                <FinanceHandler finance={foodForm.finance} type="food" updateFinance={handleFinanceChange}/>

            </div>
            <div className="flex justify-between">
                <Button color="blue"
                        onClick={handleAddOrUpdateFood}>{editFoodIndex !== undefined ? 'Actualizar' : 'Crear'} Comida</Button>
            </div>

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
