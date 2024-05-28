// PaymentHandler.tsx
import React, {useState} from 'react';
import {Button, Input, Select, Option, Textarea} from '@material-tailwind/react';
import {IPayment} from "../../../../models/PaymentModel";
import DatePicker from "../../../../components/DatePicker";
import {PencilIcon, TrashIcon} from "@heroicons/react/20/solid";
import {PAYMENT_CONSTANTS} from "../../../../constants/payment.constants";

interface PaymentHandlerProps {
    payments: IPayment[];
    onChangePayment: (payments: IPayment[]) => any;
    onUpdatePayment: (payments: IPayment[]) => any;
    onDeletePayment: (payment: IPayment) => any;
}

export const emptyPayment: IPayment = {type: 'cash', date: new Date(), amount: 0, comment: ''}

const PaymentHandler: React.FC<PaymentHandlerProps> = ({
                                                           payments,
                                                           onDeletePayment,
                                                           onChangePayment,
                                                           onUpdatePayment
                                                       }) => {
    const [newPayment, setNewPayment] = useState<IPayment>(emptyPayment);
    const [editing, setEditing] = useState<boolean>(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleInputChange = (field: keyof IPayment, value: any) => {
        if (editing && editIndex !== null) {
            const updatedPayments = [...payments];
            const updatedPayment = {...updatedPayments[editIndex], [field]: value};
            if (field === 'date') {
                updatedPayment.date = value;
            }
            updatedPayments[editIndex] = updatedPayment;
            onChangePayment(updatedPayments);
        } else {
            setNewPayment({...newPayment, [field]: value});
        }
    };

    const addOrUpdatePayment = () => {
        let paymentsData = payments;
        if (editing) {
            setEditing(false);
            setEditIndex(null);
        } else {
            paymentsData = [...paymentsData, {...newPayment}];
            onChangePayment(paymentsData);
            setNewPayment(emptyPayment);
        }

        onUpdatePayment(paymentsData);
        setNewPayment(emptyPayment);
    };

    const startEditing = (index: number) => {
        setEditIndex(index);
        setEditing(true);
    };

    const cancelEditing = () => {
        setEditing(false);
        setEditIndex(null);
    };

    const handleOnDelete = (p: IPayment) => () => {
        // TODO: Loading state
        onDeletePayment(p);
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 justify-between">
                <Select
                    label="Payment Type"
                    value={editing && editIndex !== null ? payments[editIndex].type : newPayment.type}
                    onChange={(e) => handleInputChange('type', e)}
                >
                    {PAYMENT_CONSTANTS.PAYMENT_TYPES.map(type => (
                        <Option key={type} value={type}>{type}</Option>
                    ))}
                </Select>
                <Input
                    type="number"
                    label="Amount"
                    value={(editing && editIndex !== null ? payments[editIndex].amount : newPayment.amount).toString()}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value))}
                />
            </div>
            <Textarea
                rows={1}
                label="Comment"
                value={editing && editIndex !== null ? payments[editIndex].comment : newPayment.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
            />
            <div className="flex items-center gap-3 justify-between">
                <DatePicker
                    label="Select Date"
                    onChange={date => handleInputChange('date', date)}
                    date={editing && editIndex !== null ? payments[editIndex].date : newPayment.date}
                />
                <Button className="w-[100%]" onClick={addOrUpdatePayment} color={editing ? "orange" : "green"}>
                    {editing ? "Save Changes" : "Add Payment"}
                </Button>
            </div>

            {editing && (
                <Button onClick={cancelEditing} color="red">
                    Cancel
                </Button>
            )}
            <div className="flex flex-wrap -mx-4">
                {
                    payments.map((payment, index) => (
                        <div key={index} className="p-2 rounded w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 px-4 mb-4">
                            <p>Type: {payment.type}</p>
                            <p>Amount: RD$ {payment.amount.toLocaleString()}</p>
                            <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
                            <p>Comment: {payment.comment}</p>
                            <div className="flex items-center gap-3 justify-between">
                                <Button onClick={() => startEditing(index)} color="blue">
                                    <PencilIcon className=" h-5 w-5"/>
                                </Button>

                                <Button onClick={handleOnDelete(payment)} color="red">
                                    <TrashIcon className=" h-5 w-5"/>
                                </Button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default PaymentHandler;
