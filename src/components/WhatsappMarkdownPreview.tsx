import React from "react";

export const WhatsAppMarkdownPreview: React.FC<{ content: string }> = ({content}) => {
    const renderMarkdown = (text: string) => {
        const lines = text.split(/<br\s*\/?>/i);
        return lines.map((line, index) => {
            let formattedLine = line
                .replace(/\*([^*]+)\*/g, '<strong>$1</strong>')
                .replace(/_([^_]+)_/g, '<em>$1</em>')
                .replace(/~([^~]+)~/g, '<del>$1</del>')
                .replace(/```([^`]+)```/g, '<code>$1</code>')

            if (line.startsWith('&gt; ')) {
                return (
                    <div key={index} className="bg-green-100 border-l-4 border-green-500 p-2 my-2">
                        <p className="text-green-700">{line.slice(4)}</p>
                    </div>
                );
            } else if (/^\d+\.\s/.test(line)) {
                return <li key={index}>{line.replace(/^\d+\.\s/, '')}</li>;
            } else if (/^[-*+]\s/.test(line)) {
                return <li key={index}>{line.slice(2)}</li>;
            }

            return <><p key={index} dangerouslySetInnerHTML={{__html: formattedLine}}/><br/></>;
        });
    };

    const results = renderMarkdown(content);
    return <div className="whatsapp-preview">{results}</div>;
};
