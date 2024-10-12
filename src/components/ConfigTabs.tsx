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
import { IExcursionConfiguration } from "@/models/IConfiguration";

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
}

interface ICustomComponentDialog {
    open: boolean;
    handler: () => void;
}

interface IConfigTabs {
    dialog?: ICustomComponentDialog;
    config?: IExcursionConfiguration;
}

export default function Component({ dialog }: IConfigTabs) {
    const [tabs, setTabs] = useState<TabData[]>([
        { label: "Recibos", value: "recibos", type: ExcursionConfigTypeEnum.RECEIPT },
        { label: "Promoción", value: "promocion", type: ExcursionConfigTypeEnum.PROMOTION },
        { label: "Motivar", value: "motivar", type: ExcursionConfigTypeEnum.MOTIVATION },
    ]);
    const [activeTab, setActiveTab] = useState("recibos");
    const [editingTabIndex, setEditingTabIndex] = useState<number | null>(null);
    const [textareaContent, setTextareaContent] = useState("");

    const addNewTab = (type: ExcursionConfigTypeEnum) => {
        const newTab: TabData = {
            label: type,
            value: type.toLowerCase(),
            type: type,
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

    const updateTabLabel = (index: number, newLabel: string) => {
        setTabs(prevTabs => prevTabs.map((tab, i) =>
            i === index ? { ...tab, label: newLabel } : tab
        ));
        setEditingTabIndex(null);
    };

    const insertText = (text: string) => {
        setTextareaContent(prevContent => prevContent + text);
    };

    const content = (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Tabs value={activeTab} className="mb-4">
                <TabsHeader>
                    {tabs.map(({ label, value }, index) => (
                        <div key={value} className="flex items-center">
                            {editingTabIndex === index ? (
                                <Input
                                    crossOrigin
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
                    {tabs.map(({ value }) => (
                        <TabPanel key={value} value={value}>
                            <div className="flex flex-col space-y-4">
                                <div className="flex space-x-2">
                                    <Button onClick={() => insertText("@firstname")}>Nombre</Button>
                                    <Button onClick={() => insertText("@lastname")}>Apellido</Button>
                                    <Button onClick={() => insertText("")}>Encuesta</Button>
                                    <Button onClick={() => insertText("")}>multimedia</Button>
                                </div>
                                <Textarea
                                    value={textareaContent}
                                    onChange={(e) => setTextareaContent(e.target.value)}
                                    placeholder="El contenido se insertará aquí"
                                    className="w-full h-64"
                                />
                            </div>
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