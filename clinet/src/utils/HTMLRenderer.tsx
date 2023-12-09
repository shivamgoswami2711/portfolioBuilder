import React from 'react';

export interface JSONElement {
    tag: string;
    text?: string;
    class?: string;
    customId?: string;
    id?: string;
    children?: JSONElement[];
}





function jsonToJSX(jsonData: JSONElement): JSX.Element {
    const {tag, text, class: className, id, children} = jsonData;

    const attributes: {[key: string]: string | Function} = {};

    if (className) attributes.className = className;
    if (id) attributes.id = id;


    if (!children && !text) {
        // Self-closing tag
        return React.createElement(tag, {...attributes});
    }

    if (children?.length === 0) {
        // No children, just text content
        return React.createElement(tag, {...attributes}, text);
    }
    if (!children) {
        // No children, just text content
        return React.createElement(tag, {...attributes}, text);
    }

    // Recursively process children

    const childElements = children.map((child, index) => {
        return <div key={index}>{jsonToJSX(child)}</div>
    });

    return React.createElement(tag, {...attributes}, childElements);
}

interface HTMLRendererProps {
    jsonData: JSONElement;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({jsonData}) => {

    const jsxElement = jsonToJSX(jsonData);


    return jsxElement
};

export default HTMLRenderer;

