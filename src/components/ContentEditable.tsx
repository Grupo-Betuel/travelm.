import React, {useEffect, useRef} from "react";

export const ContentEditableDiv: React.FC<{
    content: string;
    onChange: (content: string) => void;
}> = ({content, onChange}) => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (divRef.current && divRef.current.innerHTML !== content) {
            divRef.current.innerHTML = content;
        }
    }, [content]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        onChange(e.currentTarget.innerHTML);
    };

    return (
        <div
            ref={divRef}
            contentEditable
            onInput={handleInput}
            className="w-full h-64 p-2 border rounded overflow-auto whitespace-pre-wrap"
        />
    );
};

