import React, {useState} from "react";
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

import {IExpense} from "@/models/interfaces/ExpensesModel";
import {FinanceHandler} from "@/pages/dashboard/excursion/components/FinanceHandler";
import {FinanceTypes, IFinance} from "@/models/financeModel";

import {BiDollar, BiEdit, BiTrash} from "react-icons/bi";
import {useConfirmAction} from "@/hooks/useConfirmActionHook";
import {CommonConfirmActions, CommonConfirmActionsDataTypes} from "@/models/common";
import {getCrudService} from "@/api/services/CRUD.service";
import {IExcursion} from "@/models/excursionModel";
import {IUpdateClientExtra} from "@/pages/dashboard/excursion/components/ClientsExcursionTable";

interface ExpenseDialogProps {
    isOpen: boolean;
    handleClose: () => void;
    expenses: IExpense[];
    addExpense: (expense: IExpense) => void;
    excursion?: IExcursion;
    onUpdateExcursion: (excursion: Partial<IExcursion>, extra?: IUpdateClientExtra) => void;
}

const DefaultExpense: IExpense = {
    finance: {
        price: 0,
        type: "excursion" as FinanceTypes,
    },
    title: "",
    description: "",
    createDate: new Date(),
    updateDate: new Date(),
};

const expensesService = getCrudService("travelExpenses");

export const ExpenseDialog: React.FC<ExpenseDialogProps> = ({
                                                                isOpen,
                                                                handleClose,
                                                                expenses,
                                                                addExpense,
                                                                excursion,
                                                                onUpdateExcursion,
                                                            }) => {
    const [newExpense, setNewExpense] = useState<IExpense>(DefaultExpense);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<IExpense | null>(null);

    const [deleteExpense] = expensesService.useDeleteTravelExpenses();
    const [updateExpense] = expensesService.useUpdateTravelExpenses();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setNewExpense((prev) => ({...prev, [name]: value}));
    };

    const handleAddOrUpdateExpense = () => {
        if (isEditing && newExpense?._id) {
            updateExpense({_id: newExpense._id, ...newExpense});
            setNewExpense(DefaultExpense);
        } else {
            addExpense(newExpense);
        }
        setIsEditing(false);
        handleClose();
    };

    const handleEditExpense = (expense: IExpense) => {
        setNewExpense(expense);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setNewExpense(DefaultExpense);
        setIsEditing(false);
    };

    const onUpdateFinances = (financeUpdate: Partial<IFinance>) => {
        setNewExpense((prev) => ({
            ...prev,
            finance: {
                ...prev.finance,
                ...financeUpdate,
            },
        }));
    };

    const handleDeleteExpenses = (expense: IExpense) => {
        const filteredExpenses = expenses.filter((E) => E._id !== expense._id);
        setSelectedExpense(null);
        expense._id && deleteExpense(expense._id);
        onUpdateExcursion({expenses: filteredExpenses}, {isOptimistic: true, avoidConfirm: true });
    };

    const onConfirmAction = (type?: CommonConfirmActions, data?: IExpense) => {
        if (type === 'delete') {
            handleDeleteExpenses(data as IExpense);
        }
    };

    const {
        handleSetActionToConfirm,
        resetActionToConfirm,
        ConfirmDialog
    } = useConfirmAction<CommonConfirmActions, CommonConfirmActionsDataTypes<IExpense>>(onConfirmAction);

    return (
        <>
            <Dialog open={isOpen} handler={handleClose}>
                <DialogHeader>Gastos</DialogHeader>
                <DialogBody className="h-[70vh] overflow-y-auto" divider>
                    <FinanceHandler
                        enabledCost={false}
                        finance={newExpense.finance}
                        updateFinance={onUpdateFinances}
                        type="excursion"
                    />
                    <div className="mb-4">
                        <Input
                            crossOrigin={false}
                            label="Nombre del Gasto"
                            type="text"
                            name="title"
                            value={newExpense.title}
                            onChange={handleInputChange}
                            placeholder="Título del Gasto"
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <Textarea
                            label="Descripción"
                            name="description"
                            value={newExpense.description}
                            onChange={handleInputChange}
                            className="w-full"
                        />
                    </div>
                    <Typography variant="h6" className="mb-2">
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
                                    <BiDollar className="w-4 h-4 text-white"/>
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
                                        {expense.description.length > 200 && (
                                            <Button
                                                variant="text"
                                                className="p-2"
                                                color="blue"
                                                onClick={() => setSelectedExpense(expense)}
                                            >
                                                Ver más
                                            </Button>
                                        )}
                                        <Button
                                            variant="text"
                                            className="p-2"
                                            color="blue"
                                            onClick={() => handleEditExpense(expense)}
                                        >
                                            <BiEdit className="w-5 h-5"/>
                                        </Button>
                                        <Button
                                            className="p-2"
                                            variant="text"
                                            color="red"
                                            onClick={() => handleSetActionToConfirm('delete', 'Eliminar Gasto')(expense)}
                                        >
                                            <BiTrash className="w-5 h-5"/>
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </DialogBody>
                <DialogFooter>
                    <div className="flex gap-2">
                        {isEditing && (
                            <Button variant="text" color="red" onClick={handleCancelEdit}>
                                Cancelar
                            </Button>
                        )}
                        <Button variant="gradient" color="green" onClick={handleAddOrUpdateExpense}>
                            {isEditing ? "Actualizar" : "Agregar"}
                        </Button>
                    </div>
                </DialogFooter>
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
            <ConfirmDialog/>
        </>
    );
};
