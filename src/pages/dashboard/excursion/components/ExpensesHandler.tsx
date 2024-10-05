import React, {useMemo, useState} from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import {IExpense} from "@/models/ExpensesModel";
import {FinanceHandler} from "@/pages/dashboard/excursion/components/FinanceHandler";
import {FinanceTypes, IFinance} from "@/models/financeModel";
import {BiDollar, BiTrash, BiEdit, BiSave, BiSolidSave} from "react-icons/bi";
import {ICustomComponentDialog} from "@/models/common";
import {SubmitHandler, useForm, useWatch} from "react-hook-form";
import FormControl from "@/components/FormControl";
import {InfoCardItem} from "@/components/InfoCardItem";
import {FaRegSave} from "react-icons/fa";

interface ExpenseFormProps {
    initialExpenses: IExpense[];
    onUpdateExpense: (expenses: IExpense) => void;
    onDeleteExpense: (expenses: IExpense) => void;
    dialog?: ICustomComponentDialog;
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

export const ExpensesHandler: React.FC<ExpenseFormProps> = (
    {
        dialog,
        initialExpenses,
        onUpdateExpense,
        onDeleteExpense,
    }
) => {
    const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors, isValid},
        setValue,
    } = useForm<IExpense>({
        defaultValues: defaultExpense,
        mode: "all",
    });

    const newExpense: IExpense = useWatch({control}) as IExpense;

    const onUpdateFinance = (updatedFields: Partial<IFinance>) => {
        const currentFinance = newExpense.finance;
        const updatedFinance: IFinance = {
            ...currentFinance,
            ...updatedFields,
        };
        setValue("finance", updatedFinance);
    };

    const handleSave: SubmitHandler<IExpense> = (formData) => {
        if (formData._id) {
            onUpdateExpense(formData);
        } else {
            onUpdateExpense(formData);
        }
        reset(defaultExpense);
    };

    const startEditing = (expense: IExpense) => {
        reset(expense);
    };

    const cancelEditing = () => {
        reset(defaultExpense);
    };

    const handleDelete = (expense: IExpense) => {
        onDeleteExpense(expense);
    };

    const isExpenseValid = useMemo(() => {
        return isValid && newExpense.finance.price > 0;
    }, [isValid, newExpense.finance]);

    const renderFormContent = () => (
        <>
            <form onSubmit={handleSubmit(handleSave)} className="flex flex-col">
                <div className="flex gap-2">
                    <FinanceHandler
                        enabledCost={false}
                        finance={newExpense.finance}
                        updateFinance={onUpdateFinance}
                        type="excursion"
                    />
                    <FormControl
                        name="title"
                        control={control}
                        label="Nombre del Gasto"
                        rules={{required: 'El título de gasto es requerido'}}
                        className="w-full"
                    />
                </div>
                <FormControl
                    name="description"
                    control={control}
                    label="Descripción"
                    type="textarea"
                    className="w-full"
                    rules={{
                        minLength: {
                            value: 3,
                            message: 'La descripción debe tener al menos 3 caracteres',
                        },
                    }}
                />
                <div className="self-end flex gap-3">
                    {newExpense._id && (
                        <Button variant="text" className="text-sm" onClick={cancelEditing} color="red">
                            Cancelar
                        </Button>
                    )}
                    <Button variant="text"
                            disabled={!isExpenseValid}
                            type={'submit'} color={newExpense._id ? "blue" : "green"}
                            className="flex gap-3 items-center text-sm">
                        <FaRegSave className="text-lg"/>
                        {newExpense._id ? "Guardar" : "Agregar"}
                    </Button>
                </div>
            </form>
            <Typography variant="h5" className="mb-2 my-4">
                Gastos Agregados
            </Typography>
            <div className="flex overflow-x-auto gap-4 pb-5">
                {initialExpenses.map((expense) => (
                    <InfoCardItem
                        key={expense._id}
                        icon={<BiDollar className="w-4 h-4 text-white"/>}
                        subtitle={expense.title}
                        title={`RD$${expense.finance.price.toLocaleString()}`}
                        description={expense.description}
                        actions={[
                            {
                                icon: <BiEdit className="w-5 h-5"/>,
                                text: "Editar",
                                onClick: () => startEditing(expense),
                                color: 'blue',
                            },
                            {
                                icon: <BiTrash className="w-5 h-5"/>,
                                text: "Eliminar",
                                onClick: () => handleDelete(expense),
                                color: 'red',
                            },
                        ]}
                    />
                ))}
            </div>
        </>
    );

    const dialogHandler = () => {
        dialog?.handler && dialog.handler();
        reset(defaultExpense);
    }

    return dialog ? (
        <Dialog open={dialog.open} handler={dialogHandler} dismiss={{enabled: false}}>
            <DialogHeader className="flex justify-center">
                Gestor de Gastos
            </DialogHeader>
            <DialogBody className="overflow-y-auto">
                {renderFormContent()}
            </DialogBody>
            <DialogFooter>
                <Button size="lg" variant="text" color="red" onClick={dialogHandler}>
                    Cerrar
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
