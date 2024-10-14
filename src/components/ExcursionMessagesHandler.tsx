import React, {useState, useCallback, useRef, useEffect} from 'react';
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
    Button,
    IconButton,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Tooltip,
} from "@material-tailwind/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import {
    ExcursionConfigTypeEnum, excursionConfigTypeLabels,
    IExcursionMessage
} from "@/models/ExcursionConfigurationModels";
import {ContentEditableDiv} from "@/components/ContentEditable";
import {WhatsAppMarkdownPreview} from "@/components/WhatsappMarkdownPreview";
import {ListBulletIcon, TrashIcon} from "@heroicons/react/20/solid";
import {BiBold, BiItalic, BiStrikethrough} from "react-icons/bi";
import {GrBlockQuote, GrMonospace} from "react-icons/gr";
import {BsQuote} from "react-icons/bs";
import {CgQuote} from "react-icons/cg";
import {ImListNumbered} from "react-icons/im";

interface IExcursionSettingHandlerProps {
    initialMessages?: IExcursionMessage[];
    onChange: (messages: IExcursionMessage[]) => void;
    enableCustomMessage?: boolean
}


export default function ExcursionMessagesHandler(
    {
        initialMessages,
        onChange,
        enableCustomMessage
    }: IExcursionSettingHandlerProps) {
    const [messages, setMessages] = useState<IExcursionMessage[]>(!enableCustomMessage ? initialMessages || [] : []);
    const [customMessage, setCustomMessage] = useState<IExcursionMessage>({
        text: "",
        type: 'custom'
    } as IExcursionMessage);
    const [activeTab, setActiveTab] = useState(enableCustomMessage ? ExcursionConfigTypeEnum.CUSTOM : messages[0]?.type || "");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const editorRef = useRef<HTMLDivElement>(null);
    const [savedSelection, setSavedSelection] = useState(null);

    React.useEffect(() => {
        if (enableCustomMessage) return;
        setMessages(initialMessages || messages);
    }, [initialMessages]);

    const addNewTab = useCallback((type: ExcursionConfigTypeEnum) => {
        const existingMessage: Partial<IExcursionMessage> = initialMessages?.find(tab => tab.type === type) || {} as IExcursionMessage;
        console.log(existingMessage);
        const newTab: IExcursionMessage = {
            type,
            text: "",
            medias: [],
            ...existingMessage,
        };
        setMessages(prevTabs => [...prevTabs, newTab]);
        setActiveTab(type);
    }, []);

    const deleteTab = useCallback((type: ExcursionConfigTypeEnum) => {
        setMessages(prevTabs => {
            const updatedTabs = prevTabs.filter(tab => tab.type !== type);
            if (activeTab === type && updatedTabs.length > 0) {
                setActiveTab(updatedTabs[0].type);
            }
            return updatedTabs;
        });
    }, [activeTab]);

    const insertText = useCallback((text: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (range) {
                range.deleteContents();
                const textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
            editorRef.current.focus();
            const inputEvent = new Event('input', {bubbles: true, cancelable: true});
            editorRef.current.dispatchEvent(inputEvent);
        }
    }, []);

    const handleEmojiClick = useCallback(
        (emojiData: any) => {
            if (editorRef.current) {
                editorRef.current.focus();
                // Restore the selection
                if (savedSelection) {
                    const selection = window.getSelection();
                    selection?.removeAllRanges();
                    selection?.addRange(savedSelection);
                    // Insert the emoji
                    const range = selection?.getRangeAt(0);
                    if (range) {
                        range.deleteContents();
                        const textNode = document.createTextNode(emojiData.emoji);
                        range.insertNode(textNode);
                        // Move cursor after emoji
                        range.setStartAfter(textNode);
                        range.setEndAfter(textNode);
                        selection?.removeAllRanges();
                        selection?.addRange(range);
                    }
                }
            }
            // Update content state
            const inputEvent = new Event('input', {bubbles: true, cancelable: true});
            editorRef?.current?.dispatchEvent(inputEvent);
            setShowEmojiPicker(false);
        },
        [editorRef, savedSelection]
    );


    const applyMarkdown = useCallback((markdown: string) => {
        if (editorRef.current) {
            const selection = window.getSelection();
            const range = selection?.getRangeAt(0);
            if (range) {
                const selectedText = range.toString();
                const formattedText = selectedText ? `${markdown}${selectedText}${markdown}` : markdown;
                range.deleteContents();
                const textNode = document.createTextNode(formattedText);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.setEndAfter(textNode);
                selection?.removeAllRanges();
                selection?.addRange(range);
            }
            editorRef.current.focus();
            // Trigger onInput event to update state
            const inputEvent = new Event('input', {bubbles: true, cancelable: true});
            editorRef.current.dispatchEvent(inputEvent);
        }
    }, []);

    const renderTabHeader = useCallback((tab: IExcursionMessage, index: number) => (
        <Tab key={tab.type} value={tab.type} className="flex items-center whitespace-nowrap">
            {tab.type}
            <IconButton
                variant="text"
                color="blue-gray"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    deleteTab(tab.type);
                }}
            >
                <TrashIcon className="h-4 w-4"/>
            </IconButton>
        </Tab>

    ), [deleteTab]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleContentChange = useCallback((content: string) => {
        setMessages(prevTabs => prevTabs.map(tab =>
            tab.type === activeTab ? {...tab, text: content} : tab
        ));
    }, [activeTab]);

    const handleCustomContentChange = useCallback((content: string) => {
        setCustomMessage({...customMessage, text: content});
    }, []);

    React.useEffect(() => {
        const messageData = structuredClone(messages);
        if (enableCustomMessage && (customMessage.text || customMessage.medias?.length)) {
            messageData.unshift(customMessage);
        }
        onChange(messageData);

    }, [messages, customMessage]);

    return (
        <div className="w-full">
            <div className="flex flex-col space-y-4">
                <div className="flex space-x-2">
                    <Button onClick={() => insertText("@firstName")}>Nombre</Button>
                    <Button onClick={() => insertText("@lastName")}>Apellido</Button>
                    <Button onClick={() => insertText("https://forms.google.com")}>Encuesta</Button>
                    <Button onClick={() => {
                    }}>multimedia</Button>
                </div>
                <div className="relative">
                    <div className="flex space-x-2 mb-2">
                        <Tooltip content="Bold">
                            <Button onClick={() => applyMarkdown('*')} className='p-2 border-2' color={'white'}>
                                <BiBold className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Italic">
                            <Button onClick={() => applyMarkdown('_')} className='p-2 border-2' color={'white'}>
                                <BiItalic className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Strikethrough">
                            <Button onClick={() => applyMarkdown('~')} className='p-2 border-2' color={"white"}>
                                <BiStrikethrough className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Monospace">
                            <Button onClick={() => applyMarkdown('```')} className="p-2 border" color={"white"}>
                                <GrMonospace className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Blockquote">
                            <Button onClick={() => {
                                const selection = window.getSelection();
                                const range = selection?.getRangeAt(0);
                                if (range) {
                                    const selectedText = range.toString();
                                    const quoteText = selectedText ? `> ${selectedText}` : '> ';
                                    insertText(quoteText);
                                }
                            }} className="p-2 border-2" color={"white"}>
                                <GrBlockQuote className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Ordered List">
                            <Button onClick={() => insertText('\n1. ')} className="p-2 border-2" color={'white'}>
                                <ImListNumbered className="w-4 h-4 text-black"/>
                            </Button>
                        </Tooltip>
                        <Tooltip content="Unordered List">
                            <Button onClick={() => insertText('\n- ')} className="p-2 border-2" color={'white'}>
                                <ListBulletIcon className="w-5 h-5 text-black"/>
                            </Button>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <Tabs value={activeTab} className="mb-4">
                <TabsHeader className="overflow-auto">
                    {enableCustomMessage &&
                        <Tab key="custom" value="custom" className="flex items-center whitespace-nowrap p-2">
                            Mensaje Personalizado
                        </Tab>
                    }
                    {messages.map((tab, index) => renderTabHeader(tab, index))}
                    <Menu>
                        <MenuHandler>
                            <Button
                                className="flex items-center flex-shrink-0 justify-center w-8 h-8 my-auto rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            >
                                <PlusIcon className="w-6 h-6 text-white flex-shrink-0"/>
                            </Button>
                        </MenuHandler>
                        <MenuList className="z-[99999]">
                            {Object.values(ExcursionConfigTypeEnum).map((type) => (
                                <MenuItem key={type} onClick={() => addNewTab(type)}>
                                    {excursionConfigTypeLabels[type]}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </TabsHeader>
                <TabsBody>
                    {enableCustomMessage &&
                        <TabPanel key="custom" value="custom">
                            <div className="flex gap-4 justify-around flex-wrap">
                                <div ref={editorRef} className="relative min-w-[300px] w-[30%]">
                                    <ContentEditableDiv
                                        content={customMessage.text}
                                        onChange={handleCustomContentChange}
                                    />
                                </div>
                                <div className="border rounded p-2 overflow-auto h-64 min-w-[300px] w-[30%]">
                                    <WhatsAppMarkdownPreview content={customMessage.text}/>
                                </div>
                            </div>
                        </TabPanel>
                    }
                    {messages.map((tab) => (
                        <TabPanel key={tab.type} value={tab.type}>
                            <div className="flex gap-4 justify-around flex-wrap">
                                <div ref={editorRef} className="relative min-w-[300px] w-[30%]">
                                    <ContentEditableDiv
                                        content={tab.text}
                                        onChange={handleContentChange}
                                    />
                                </div>
                                <div className="border rounded p-2 overflow-auto h-64 min-w-[300px] w-[30%]">
                                    <WhatsAppMarkdownPreview content={tab.text}/>
                                </div>
                            </div>
                        </TabPanel>
                    ))}
                </TabsBody>
            </Tabs>
        </div>
    )

}
