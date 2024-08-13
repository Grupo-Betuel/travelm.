import {Button, Input, Option, Select} from "@material-tailwind/react";
import React, {useEffect} from "react";
import {financeTypes, FinanceTypes, IFinance} from "@/models/financeModel";

export interface IFinanceProps {
    finance: IFinance;
    updateFinance: (finance: IFinance) => void;
    type?: FinanceTypes;
    enabledCost?: boolean;
}

export const FinanceHandler = (
    {
        finance,
        updateFinance,
        type: financeType,
        enabledCost
    }: IFinanceProps
) => {

    const [enableCost, setEnableCost] = React.useState(false);
    const [enableCouples, setEnableCouples] = React.useState(false);
    const [enableChildren, setEnableChildren] = React.useState(false);

    const toggleCost = () => setEnableCost(!enableCost);
    const toggleCouples = () => setEnableCouples(!enableCost);
    const toggleChildren = () => setEnableChildren(!enableCost);

    const handleOnChangeFinance = ({target: {name, value, type}}: any) => {
        if (type === 'number') {
            value = Number(value);
        }
        updateFinance({
            ...finance,
            type: financeType || finance.type,
            [name]: value,
        });
    }

    useEffect(() => {
        setEnableCost(!!enabledCost);
    }, [enabledCost]);

    useEffect(() => {
        if (financeType) {
            updateFinance({...finance, type: financeType});
        }
    }, [financeType]);
    console.log(financeType);
    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="flex w-full justify-between gap-3">
                <Input
                    crossOrigin={false}
                    type="number"
                    label="Price"
                    name="price"
                    value={finance?.price || ''}
                    onChange={handleOnChangeFinance}
                    className="mb-4 flex-grow"
                />
            </div>
            <Button
                className={"whitespace-nowrap"}
                onClick={toggleCost}
                color={enableCost ? 'red' : 'green'}>
                {enableCost ? 'Quitar Costo' : 'Agregar Costo'}
            </Button>
            <div className='flex flex-wrap gap-2 '>
            {enableCost &&
                <div className="flex flex-wrap gap-2">
                    {/*<Button*/}
                    {/*    className=""*/}
                    {/*    onClick={toggleCost}*/}
                    {/*    color="red"*/}
                    {/*>*/}
                    {/*    Cancelar*/}
                    {/*</Button>*/}
                    <Input
                        crossOrigin={false}
                        type="number"
                        label="Cost"
                        name="cost"
                        value={finance?.cost || ''}
                        onChange={handleOnChangeFinance}
                        className="mb-4 "
                    />
                </div>
            }

                {enableCost &&
                    <div className="flex items-center gap-2">
                        {/*{enableCouples &&*/}
                            <Input
                                crossOrigin={false}
                                type="number"
                                label="Couples"
                                name="couples"
                                value={finance?.couples || ''}
                                onChange={handleOnChangeFinance}
                                className="mb-4"
                            />
                        {/*}*/}
                        {/*<Button*/}
                        {/*    className="whitespace-nowrap"*/}
                        {/*    onClick={toggleCouples}*/}
                        {/*    color={enableCouples ? 'red' : 'green'}*/}
                        {/*>*/}
                        {/*    {enableCouples ? 'Cancelar' : 'Agregar Couples'}*/}
                        {/*</Button>*/}
                    </div>
                }
                {enableCost &&
                    <div className="flex items-center gap-2">
                        {/*{enableChildren &&*/}
                            <Input
                                crossOrigin={false}
                                type="number"
                                label="Children"
                                name="children"
                                value={finance?.children || ''}
                                onChange={handleOnChangeFinance}
                                className="mb-4 flex-grow"
                            />
                        {/*}*/}
                        {/*<Button*/}
                        {/*    className="whitespace-nowrap"*/}
                        {/*    onClick={toggleChildren}*/}
                        {/*    color={enableChildren ? 'red' : 'green'}*/}
                        {/*>*/}
                        {/*    {enableChildren ? 'Cancelar' : 'Agregar Children'}*/}
                        {/*</Button>*/}
                    </div>
                }
            </div>
            {!financeType &&
                <Select
                    label="Type"
                    name="type"
                    disabled={!!financeType}
                    value={financeType || finance?.type}
                    onChange={(value) => updateFinance({...finance, type: value as FinanceTypes})}
                    className="mb-4"
                >
                    {financeTypes.map((type) => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>
            }
        </div>
    );
}
