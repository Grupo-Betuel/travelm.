import {Button, Input, Menu, MenuHandler, MenuList, MenuItem, Select, Option} from "@material-tailwind/react";
import React, {useEffect} from "react";
import {financeTypes, FinanceTypes, IFinance} from "@/models/financeModel";
import {PlusCircleIcon, TrashIcon} from "@heroicons/react/20/solid";

export interface IFinanceProps {
    finance: IFinance;
    updateFinance: (finance: IFinance) => void;
    type?: FinanceTypes;
    enabledCost?: boolean;
    options?: boolean;
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
        setEnableCost(!!enabledCost);
    }, [enabledCost]);

    useEffect(() => {
        if (financeType) {
            updateFinance({...finance, type: financeType});
        }
    }, [financeType]);

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center space-x-2">
                <Input
                    crossOrigin={false}
                    type="number"
                    label="Price"
                    name="price"
                    value={finance?.price || ""}
                    onChange={handleOnChangeFinance}
                    containerProps={{className: "max-w-1/2 min-w-[50%]"}}
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
                    <Input
                        crossOrigin={false}
                        type="number"
                        label="Cost"
                        name="cost"
                        value={finance?.cost || ""}
                        onChange={handleOnChangeFinance}
                        containerProps={{
                            className: "min-w-[50%] max-w-1/2",
                        }}
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
                        <Input
                            crossOrigin={false}
                            type="number"
                            label="Couples"
                            name="couples"
                            value={finance?.couple || ""}
                            onChange={handleOnChangeFinance}
                            containerProps={{
                                className: "max-w-1/2 min-w-[50%]",
                            }}
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
                        <Input
                            crossOrigin={false}
                            type="number"
                            label="Children"
                            name="children"
                            value={finance?.children || ""}
                            onChange={handleOnChangeFinance}
                            containerProps={{
                                className: "max-w-1/2 min-w-[50%]",
                            }}
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
                <Select
                    label="Type"
                    name="type"
                    disabled={!!financeType}
                    value={financeType || finance?.type}
                    onChange={(value) =>
                        updateFinance({...finance, type: value as FinanceTypes})
                    }
                    className="mb-4"
                >
                    {financeTypes.map((type) => (
                        <Option key={type} value={type}>
                            {type}
                        </Option>
                    ))}
                </Select>
            )}
        </div>
    );
};
