import {Button, Input, Menu, MenuHandler, MenuList, MenuItem, Select, Option} from "@material-tailwind/react";
import React, {useEffect} from "react";
import {FinanceOptionEnum, financeTypes, FinanceTypes, IFinance} from "@/models/financeModel";
import {PlusCircleIcon, TrashIcon} from "@heroicons/react/20/solid";
import {useForm} from "react-hook-form";
import {IExpense} from "@/models/ExpensesModel";
import FormControl from "@/components/FormControl";
import SelectControl from "@/components/SelectControl";

export interface IFinanceProps {
    finance: IFinance;
    updateFinance: (finance: IFinance) => void;
    type?: FinanceTypes;
    enabledCost?: boolean;
    options?: FinanceOptionEnum[];
}

export const FinanceHandler = ({
                                   finance,
                                   options,
                                   updateFinance,
                                   type: financeType,
                                   enabledCost,
                               }: IFinanceProps) => {
    const [enableCost, setEnableCost] = React.useState(false);
    const [enableRates, setEnableRates] = React.useState(false);
    const [enableChildren, setEnableChildren] = React.useState(false);

    const toggleCost = () => setEnableCost(!enableCost);
    const toggleRates = () => setEnableRates(!enableRates);
    const toggleChildren = () => setEnableChildren(!enableChildren);

    const handleOnChangeFinance = ({target: {name, value, type}}: any) => {
        if (type === "number") {
            value = Number(value);
        }
        updateFinance({
            ...finance,
            type: financeType || finance.type,
            [name]: value,
        });
    };

    useEffect(() => {
        console.log("options", options)
        if (!options) return

        setEnableCost(!!options?.includes(FinanceOptionEnum.COST));
        setEnableRates(!!options?.includes(FinanceOptionEnum.COUPLE));
        setEnableChildren(!!options?.includes(FinanceOptionEnum.CHILDREN));
    }, [options]);

    useEffect(() => {
        if (financeType) {
            updateFinance({...finance, type: financeType});
        }
    }, [financeType]);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<IFinance>({mode: 'all', values: finance});

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
                <FormControl
                    name="price"
                    control={control}
                    label="Price"
                    type="number"
                    className="w-full"
                    rules={{
                        required: "Price is required",
                        min: {
                            value: 1,
                            message: "Precio debe ser mayor a 0",
                        },
                    }}
                />
                {options && (
                    <Menu>
                        <MenuHandler>
                            <Button color="blue" className="flex items-center z-40 p-2">
                                <PlusCircleIcon className="h-5 w-6"/>
                            </Button>
                        </MenuHandler>
                        <MenuList className="p-2 z-[99999]">
                            {!enableCost && (
                                <MenuItem onClick={toggleCost}>
                                    Agregar Costos
                                </MenuItem>
                            )}
                            {!enableRates && (
                                <MenuItem onClick={toggleRates}>
                                    Precio en Pareja
                                </MenuItem>
                            )}
                            {!enableChildren && (
                                <MenuItem onClick={toggleChildren}>
                                    Precio para Niños
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                )}
            </div>

            {enableCost && (
                <div className="flex items-center gap-2">
                    <FormControl
                        name="cost"
                        control={control}
                        label="Cost"
                        type="number"
                        className="min-w-[50%] max-w-1/2"
                        rules={{ required: "Cost is required" }}
                    />
                    <Button
                        onClick={toggleCost}
                        color="red"
                        className='flex items-center p-2'
                    >
                        <TrashIcon className="h-5 w-6"/>
                    </Button>
                </div>
            )}

            <div className="flex flex-col gap-3">
                {enableRates && (
                    <div className="flex items-center gap-2">
                        <FormControl
                            name="couples"
                            control={control}
                            label="Couples"
                            type="number"
                            className="max-w-1/2 min-w-[50%]"
                            rules={{ required: "Couples is required" }}
                        />
                        <Button
                            onClick={toggleRates}
                            color="red"
                            className='p-2'
                        >
                            <TrashIcon className="h-5 w-6"/>
                        </Button>
                    </div>
                )}

                {enableChildren && (
                    <div className="flex items-center gap-2">
                        <FormControl
                            name="children"
                            control={control}
                            label="Children"
                            type="number"
                            className="max-w-1/2 min-w-[50%]"
                            rules={{ required: "Children is required" }}
                        />
                        <Button
                            onClick={toggleChildren}
                            color="red"
                            className='p-2'
                        >
                            <TrashIcon className="h-5 w-6"/>
                        </Button>
                    </div>
                )}
            </div>

            {!financeType && (
                <SelectControl
                    name="type"
                    control={control}
                    label="Type"
                    options={financeTypes.map((type) => ({ label: type, value: type }))}
                    rules={{ required: "Type is required" }}
                    className="mb-4"
                />
            )}
        </div>
    );
};
