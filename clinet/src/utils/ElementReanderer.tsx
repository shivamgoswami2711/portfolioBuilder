import React from 'react';

export interface JSONElement {
  tag: string;
  text?: string;
  class?: string;
  customId?: string;
  id?: string;
  children?: JSONElement[];
}





function jsonToJSX(jsonData: JSONElement, onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>) => void): JSX.Element {
  const {tag, text, customId, class: className, children} = jsonData;

  const attributes: {[key: string]: string | Function} = {};

  if (className) attributes.className = className;
  // if (id) attributes.id = `${id} ${customId}`;
  if (customId) attributes.id = `${customId}`;
  attributes.draggable = 'true';
  attributes.onDragStart = (e: React.DragEvent<HTMLDivElement>) => onDragStart(e, jsonData);
  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => onDragOver(e);




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
    return <div key={index}>{jsonToJSX(child, onDragStart, onDragOver)}</div>
  });

  return React.createElement(tag, {...attributes}, childElements);
}

interface HTMLRendererProps {
  jsonData: JSONElement;
}

const ElementReanderer: React.FC<HTMLRendererProps> = ({jsonData}) => {

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => {
    e.dataTransfer.setData('object', JSON.stringify(element));
    e.stopPropagation();
  };




  const jsxElement = jsonToJSX(jsonData, handleDragStart,handleDragOver);


  return jsxElement
};

export default ElementReanderer;

