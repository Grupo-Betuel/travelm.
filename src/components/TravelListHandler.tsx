import React, {useEffect, useState} from 'react';
import { Button } from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ITravelList } from "@/models/ExcursionConfigurationModels";
import {useForm, useFieldArray, useWatch} from 'react-hook-form';
import FormControl from "@/components/FormControl";
import {BiEdit} from "react-icons/bi";

export type IList = Pick<ITravelList, 'title' | 'items' | 'description'>

interface ListManagerProps {
    initialList: IList;
    onUpdate: (updatedList: IList) => void;
    setIsValid?: (isValid: boolean) => void;
}

export default function TravelListHandler({ initialList, onUpdate, setIsValid }: ListManagerProps) {
    const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);

    const { control, handleSubmit, reset, setValue, formState: { isValid } } = useForm<IList>({
        defaultValues: initialList,
        mode: 'all',

    });

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "items",
    });

    const list: IList = useWatch({ control }) as IList;

    useEffect(() => {
        onUpdate(list);
    }, [list]);
    const onSubmit = (data: IList) => {
        onUpdate(data);
    };

    const handleAddItem = (item: string) => {
        if (item.trim()) {
            append(item.trim());
        }
    };

    const handleEditItem = (index: number) => {
        setEditingItemIndex(index);
    };

    const handleUpdateItem = (index: number, newValue: string) => {
        if (newValue.trim()) {
            update(index, newValue.trim());
            setEditingItemIndex(null);
        }
    };

    const handleDeleteItem = (index: number) => {
        remove(index);
    };

    useEffect(() => {
        setIsValid && setIsValid(isValid);
    }, [isValid]);



    return (
        <form className="space-y-4">
            <FormControl
                name="title"
                control={control}
                label="Title"
                rules={{ required: "Title is required", minLength: { value: 5, message: "Title must be at least 5 characters" } }}
            />
            <FormControl
                name="description"
                control={control}
                label="Description"
                type="textarea"
                rules={{ required: "Description is required", minLength: { value: 5, message: "Description must be at least 5 characters" } }}
            />
            <div className="py-2 flex items-center space-x-2">
                <FormControl
                    className="!mb-0 w-full"
                    name="newItem"
                    control={control}
                    label="New item"
                    rules={{ minLength: { value: 5, message: "Item must be at least 5 characters" } }}
                />
                <Button
                    color="green"
                    size="sm"
                    className="p-2"
                    onClick={() => {
                        const newItemValue = (document.querySelector('input[name="newItem"]') as HTMLInputElement)?.value;
                        if (newItemValue && newItemValue.length >= 5) {
                            handleAddItem(newItemValue);
                            setValue('newItem', '');
                        }
                    }}
                >
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </div>
            {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                    {editingItemIndex === index ? (
                        <FormControl
                            className="!mb-0 w-full"
                            name={`items.${index}`}
                            control={control}
                            label="Edit item"
                            rules={{ required: "Item is required", minLength: { value: 5, message: "Item must be at least 5 characters" } }}
                        />
                    ) : (
                        <FormControl
                            className="!mb-0 w-full"
                            name={`items.${index}`}
                            control={control}
                            label="Item"
                            inputProps={{ readOnly: true }}
                        />
                    )}
                    <Button
                        color="blue"
                        size="sm"
                        variant="outlined"
                        className="p-2"
                        onClick={() => editingItemIndex === index ? handleUpdateItem(index, field.value) : handleEditItem(index)}
                    >
                        <BiEdit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outlined"
                        color="red"
                        size="sm"
                        className="p-2"
                        onClick={() => handleDeleteItem(index)}
                    >
                        <TrashIcon className="h-4 w-4" />
                    </Button>
                </div>
            ))}

        </form>
    );
}
