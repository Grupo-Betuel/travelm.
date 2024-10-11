import React, { useState } from 'react';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Textarea,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
} from "@material-tailwind/react";
import { PlusIcon, XMarkIcon, PencilIcon } from "@heroicons/react/24/solid";

enum ExcursionConfigTypeEnum {
    PROMOTION = 'promotion',
    REQUEST_PAYMENT = 'request-payment',
    MOTIVATION = 'motivation',
    TICKET = 'ticket',
    RECEIPT = 'receipt',
    RULE = 'rules',
    ADVICE = 'advices',
}

interface TabData {
    label: string;
    value: string;
    type: ExcursionConfigTypeEnum;
    subTabs: {
        label: string;
        content: string;
    }[];
}

interface ICustomComponentDialog {
    open: boolean;
    handler: () => void;
}

interface IConfigTabs {
    dialog?: ICustomComponentDialog;
}

export default function Component({ dialog }: IConfigTabs) {
    const [tabs, setTabs] = useState<TabData[]>([
        { label: "Recibos", value: "recibos", type: ExcursionConfigTypeEnum.RECEIPT, subTabs: [
                { label: "Nombre", content: "Contenido para Nombre en Recibos" },
                { label: "Apellido", content: "Contenido para Apellido en Recibos" },
                { label: "Encuesta", content: "Contenido para Encuesta en Recibos" },
                { label: "multimedia", content: "Contenido para multimedia en Recibos" },
            ]},
        { label: "Promoción", value: "promocion", type: ExcursionConfigTypeEnum.PROMOTION, subTabs: [
                { label: "Nombre", content: "Contenido para Nombre en Promoción" },
                { label: "Apellido", content: "Contenido para Apellido en Promoción" },
                { label: "Encuesta", content: "Contenido para Encuesta en Promoción" },
                { label: "multimedia", content: "Contenido para multimedia en Promoción" },
            ]},
        { label: "Motivar", value: "motivar", type: ExcursionConfigTypeEnum.MOTIVATION, subTabs: [
                { label: "Nombre", content: "Contenido para Nombre en Motivar" },
                { label: "Apellido", content: "Contenido para Apellido en Motivar" },
                { label: "Encuesta", content: "Contenido para Encuesta en Motivar" },
                { label: "multimedia", content: "Contenido para multimedia en Motivar" },
            ]},
    ]);
    const [activeTab, setActiveTab] = useState("recibos");
    const [activeSubTab, setActiveSubTab] = useState("Nombre");
    const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);

    const addNewTab = (type: ExcursionConfigTypeEnum) => {
        const newTab: TabData = {
            label: type,
            value: type.toLowerCase(),
            type: type,
            subTabs: [
                { label: "Nombre", content: "" },
                { label: "Apellido", content: "" },
                { label: "Encuesta", content: "" },
                { label: "multimedia", content: "" },
            ],
        };
        setTabs([...tabs, newTab]);
    };

    const deleteTab = (tabValue: string) => {
        const updatedTabs = tabs.filter(tab => tab.value !== tabValue);
        setTabs(updatedTabs);
        if (activeTab === tabValue && updatedTabs.length > 0) {
            setActiveTab(updatedTabs[0].value);
        }
    };

    const updateSubTabContent = (tabValue: string, subTabLabel: string, newContent: string) => {
        setTabs(prevTabs => prevTabs.map(tab => {
            if (tab.value === tabValue) {
                return {
                    ...tab,
                    subTabs: tab.subTabs.map(subTab =>
                        subTab.label === subTabLabel ? { ...subTab, content: newContent } : subTab
                    )
                };
            }
            return tab;
        }));
    };

    const updateTabLabel = (index: number, newLabel: string) => {
        setTabs(prevTabs => prevTabs.map((tab, i) =>
            i === index ? { ...tab, label: newLabel } : tab
        ));
        setEditingTabIndex(null);
    };

    const content = (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Tabs value={activeTab} className="mb-4">
                <TabsHeader>
                    {tabs.map(({ label, value }, index) => (
                        <div key={value} className="flex items-center">
                            {editingTabIndex === index ? (
                                <Input
                                    type="text"
                                    defaultValue={label}
                                    onBlur={(e) => updateTabLabel(index, e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            updateTabLabel(index, e.currentTarget.value);
                                        }
                                    }}
                                    className="mr-2"
                                />
                            ) : (
                                <Tab value={value} onClick={() => setActiveTab(value)}>
                                    {label}
                                </Tab>
                            )}
                            <IconButton
                                variant="text"
                                color="blue-gray"
                                size="sm"
                                className="ml-2"
                                onClick={() => setEditingTabIndex(index)}
                            >
                                <PencilIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                                variant="text"
                                color="red"
                                size="sm"
                                className="ml-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteTab(value);
                                }}
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    ))}
                    <Menu>
                        <MenuHandler>
                            <Button className="flex items-center gap-3">
                                <PlusIcon className="h-5 w-5" />
                            </Button>
                        </MenuHandler>
                        <MenuList className="z-[99999]">
                            {Object.values(ExcursionConfigTypeEnum).map((type) => (
                                <MenuItem key={type} onClick={() => addNewTab(type)}>
                                    {type}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </TabsHeader>
                <TabsBody>
                    {tabs.map(({ value, subTabs }) => (
                        <TabPanel key={value} value={value}>
                            <Tabs value={activeSubTab}>
                                <TabsHeader>
                                    {subTabs.map(({ label }) => (
                                        <Tab
                                            key={label}
                                            value={label}
                                            onClick={() => setActiveSubTab(label)}
                                        >
                                            {label}
                                        </Tab>
                                    ))}
                                </TabsHeader>
                                <TabsBody>
                                    {subTabs.map(({ label, content }) => (
                                        <TabPanel key={label} value={label}>
                                            <div className="border-2 border-gray-300 rounded-lg p-4 h-64">
                                                <h2 className="text-2xl font-bold mb-4">
                                                    {tabs.find(tab => tab.value === activeTab)?.label} - {label}
                                                </h2>
                                                <Textarea
                                                    value={content}
                                                    onChange={(e) => updateSubTabContent(value, label, e.target.value)}
                                                    placeholder={`Edita el contenido para ${label} en ${tabs.find(tab => tab.value === activeTab)?.label}`}
                                                    className="w-full h-40"
                                                />
                                            </div>
                                        </TabPanel>
                                    ))}
                                </TabsBody>
                            </Tabs>
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    );

    return (
        <>
            {dialog ? (
                <Dialog open={dialog.open} handler={dialog.handler} dismiss={{ enabled: false }} size="xxl">
                    <DialogHeader className="flex justify-between items-center gap-2">
                        Pestañas Dinámicas
                    </DialogHeader>
                    <DialogBody className="overflow-y-scroll max-h-[80dvh]">
                        {content}
                    </DialogBody>
                    <DialogFooter className="flex justify-end">
                        <Button onClick={dialog.handler} color="red">
                            Cerrar
                        </Button>
                    </DialogFooter>
                </Dialog>
            ) : content}
        </>
    );
}