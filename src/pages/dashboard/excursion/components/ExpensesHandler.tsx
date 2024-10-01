import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Input,
    Textarea,
    CardHeader,
    CardBody,
    CardFooter,
    Card,
} from "@material-tailwind/react";
import { IExpense } from "@/models/ExpensesModel";
import { FinanceHandler } from "@/pages/dashboard/excursion/components/FinanceHandler";
import { FinanceTypes, IFinance } from "@/models/financeModel";
import { BiDollar, BiTrash, BiEdit } from "react-icons/bi";
import {ICustomComponentDialog} from "@/models/common";
import {emptyClient} from "@/pages/dashboard/excursion/components/ClientForm";
import {useForm} from "react-hook-form";
import {IService} from "@/models/serviceModel";
import FormControl from "@/components/FormControl";

interface ExpenseFormProps {
    initialExpenses: IExpense[];
    onUpdateExpense: (expenses: IExpense) => void;
    onDeleteExpense: (expenses: IExpense) => void;
    dialog? : ICustomComponentDialog;
}

const defaultExpense: IExpense = {
    finance: {
        price: 0,
        type: "excursion" as FinanceTypes,
    },
    title: "",
    description: "",
    createDate: new Date(),
    updateDate: new Date(),
};

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
                                                            dialog,
                                                            initialExpenses,
                                                            onUpdateExpense,
                                                            onDeleteExpense,
                                                        }) => {
    const [expenses, setExpenses] = useState<IExpense[]>(initialExpenses);
    const [newExpense, setNewExpense] = useState<IExpense>(defaultExpense);
    const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);

    useEffect(() => {
        if (initialExpenses && initialExpenses.length > 0) {
            setExpenses(initialExpenses);
        }
    }, [initialExpenses]);

    const handleInputChange = (name: string, value: string) => {
        setNewExpense((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (newExpense._id) {
            const updatedExpenses = expenses.map((exp) =>
                exp._id === newExpense._id ? { ...exp, ...newExpense } : exp
            );
            setExpenses(updatedExpenses);
            onUpdateExpense(newExpense);
        } else {
            const newExpenses = [...expenses, newExpense];
            setExpenses(newExpenses);
            onUpdateExpense(newExpense);
        }
        setNewExpense(defaultExpense);
    };

    const startEditing = (expense: IExpense) => {
        setNewExpense(expense);
    };

    const cancelEditing = () => {
        setNewExpense(defaultExpense);
    };

    const handleDelete = (expense: IExpense) => {
        const filteredExpenses = expenses.filter((e) => e._id !== expense._id);
        setExpenses(filteredExpenses);
        onDeleteExpense(expense);
    };
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<IExpense>({mode: 'all', values: newExpense});

    const renderFormContent = () => (
        <>
            <form onSubmit={handleSubmit(handleSave)}>
            <FinanceHandler
                enabledCost={false}
                finance={newExpense.finance}
                updateFinance={(financeUpdate: Partial<IFinance>) =>
                    setNewExpense((prev) => ({
                        ...prev,
                        finance: { ...prev.finance, ...financeUpdate },
                    }))
                }
                type="excursion"
            />
            <div className="mb-4">
                <FormControl
                    name="title"
                    control={control}
                    label="Nombre del Gasto"
                    rules={{ required: 'El título de gasto es requerido' }}
                    className="w-full"
                />
            </div>
            <div className="mb-4">
                <FormControl
                    name="description"
                    control={control}
                    label="Descripción"
                    type="textarea"
                    className="w-full"
                    rules={{
                        required: 'La descripción es requerida',
                        minLength: {
                            value: 3,
                            message: 'La descripción debe tener al menos 3 caracteres',
                        },
                    }}
                />
            </div>
            <Button type={'submit'} color={newExpense._id ? "blue" : "green"}>
                {newExpense._id ? "Guardar Cambios" : "Agregar Gasto"}
            </Button>
            {newExpense._id && (
                <Button onClick={cancelEditing} color="red">
                    Cancelar
                </Button>
            )}
            </form>

            <Typography variant="h6" className="mb-2 mt-4">
                Gastos Agregados
            </Typography>
            <div className="grid grid-cols-3 gap-4">
                {expenses.map((expense) => (
                    <Card className="border border-blue-gray-100 shadow-sm h-full" key={expense._id}>
                        <CardHeader
                            variant="gradient"
                            color="blue"
                            floated={false}
                            shadow={false}
                            className="absolute grid h-7 w-7 place-items-center"
                        >
                            <BiDollar className="w-4 h-4 text-white" />
                        </CardHeader>
                        <CardBody className="p-2 text-right">
                            <Typography variant="small" className="font-normal text-blue-gray-600">
                                {expense.title}
                            </Typography>
                            <Typography variant="h5" color="blue-gray">
                                {`RD$${expense.finance.price.toLocaleString()}`}
                            </Typography>
                            <Card className="px-2 text-justify border-0 shadow-none">
                                <Typography variant="small" className="font-normal text-blue-gray-600">
                                    {expense.description.length > 50
                                        ? `${expense.description.slice(0, 50)}...`
                                        : expense.description}
                                </Typography>
                            </Card>
                        </CardBody>
                        <CardFooter className="border-t border-blue-gray-50 p-2 mt-auto items-end">
                            <div className="flex space-x-1 justify-end">
                                {expense.description.length > 50 && (
                                    <Button variant="text" className="p-2" color="blue" onClick={() => setSelectedExpense(expense)}>
                                        Ver más
                                    </Button>
                                )}
                                <Button variant="text" className="p-2" color="blue" onClick={() => startEditing(expense)}>
                                    <BiEdit className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="text"
                                    className="p-2"
                                    color="red"
                                    onClick={() => handleDelete(expense)}
                                >
                                    <BiTrash className="w-5 h-5" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        setNewExpense(defaultExpense);
    }

    return dialog ? (
        <Dialog open={dialog.open} handler={dialogHandler} dismiss={{enabled: false}}>
            <DialogHeader>Gastos</DialogHeader>
            <DialogBody className="h-[70vh] overflow-y-auto" divider>
                {renderFormContent()}
            </DialogBody>
            <DialogFooter>
                <Button variant="text" color="red" onClick={dialogHandler}>
                    Cancelar
                </Button>
            </DialogFooter>

            {/* Dialog to show full description */}
            {selectedExpense && (
                <Dialog open={true} handler={() => setSelectedExpense(null)}>
                    <DialogHeader>{selectedExpense.title}</DialogHeader>
                    <DialogBody divider>
                        <Typography>{selectedExpense.description}</Typography>
                    </DialogBody>
                    <DialogFooter>
                        <Button variant="text" color="blue" onClick={() => setSelectedExpense(null)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </Dialog>
            )}
        </Dialog>
    ) : (
        <div className="form-container">
            {renderFormContent()}
            <div className="flex justify-end space-x-2">
                <Button onClick={dialogHandler} className="bg-gray-500 text-white p-2 rounded-md">
                    Cancelar
                </Button>
            </div>
        </div>
    );
};
