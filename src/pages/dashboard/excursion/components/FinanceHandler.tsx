import {Button, Input, Option, Select} from "@material-tailwind/react";
import React, {useEffect} from "react";
import {financeTypes, FinanceTypes, IFinance} from "../../../../models/financeModel";

export interface IFinanceProps {
    finance: IFinance;
    updateFinance: (finance: IFinance) => void;
    type?: FinanceTypes
    enabledCost?: boolean
}

export const FinanceHandler = (
    {
        finance,
        updateFinance,
        type: financeType,
        enabledCost
    }: IFinanceProps) => {

    const [enableCost, setEnableCost] = React.useState(false);
    const toggleCost = () => setEnableCost(!enableCost);
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
        setEnableCost(!!enabledCost)
    }, [enabledCost])

    useEffect(() => {
        if (financeType) {
            updateFinance({...finance, type: financeType})
        }
    }, [financeType])


    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-100 justify-between gap-3">
                <Input
                    type="number"
                    label="Price"
                    name="price"
                    value={finance?.price || ''}
                    onChange={handleOnChangeFinance}
                    className="mb-4"
                />
            </div>
                <Button
                    className={"whitespace-nowrap"}
                    onClick={toggleCost}
                    color={enableCost ? 'red' : 'green'}>
                    {enableCost ? 'Quitar Costo' : 'Agregar Costo'}</Button>
            {enableCost && <Input
                type="number"
                label="Cost"
                name="cost"
                value={finance?.cost || ''}
                onChange={handleOnChangeFinance}
                className="mb-4"
            />}
            {!financeType && <Select
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
            </Select>}
        </div>
    )
}