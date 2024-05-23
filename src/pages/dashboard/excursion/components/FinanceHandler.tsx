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
        type,
        enabledCost
    }: IFinanceProps) => {

    const [enableCost, setEnableCost] = React.useState(false);
    const toggleCost = () => setEnableCost(!enableCost);
    const handleOnChangeFinance = ({target: {name, value, type}}: any) => {
        if (type === 'number') {
            value = Number(value);
        }
        updateFinance({...finance, [name]: value});
    }

    useEffect(() => {
        setEnableCost(!!enabledCost)
    }, [enabledCost])

    useEffect(() => {
        if (type) {
            updateFinance({...finance, type})
        }
    }, [type])


    return (
        <div className="flex flex-col gap-5">
            <div className="flex w-100 justify-between">
                <span></span>
                <Button onClick={toggleCost} color={enableCost ? 'red' : 'green'}>{ enableCost ? 'Quitar Costo' :'Agregar Costo'}</Button>
            </div>
            <Input
                type="number"
                label="Price"
                name="price"
                value={finance?.price || ''}
                onChange={handleOnChangeFinance}
                className="mb-4"
            />
            {enableCost && <Input
                type="number"
                label="Cost"
                name="cost"
                value={finance?.cost || ''}
                onChange={handleOnChangeFinance}
                className="mb-4"
            />}
            <Select
                label="Type"
                name="type"
                disabled={!!type}
                value={finance?.type}
                onChange={(value) => updateFinance({...finance, type: value as FinanceTypes})}
                className="mb-4"
            >
                {financeTypes.map((type) => (
                    <Option key={type} value={type}>{type}</Option>
                ))}
                {/*<Option value="desert">Desert</Option>*/}
                {/*<Option value="lunch">Lunch</Option>*/}
                {/*<Option value="snack">Snack</Option>*/}
            </Select>
        </div>
    )
}