import React from 'react';
import {generateRandomString} from './util';
import {useDispatch} from 'react-redux';

export interface JSONElement {
  tag: string;
  text?: string;
  class?: string;
  customId?: string;
  id?: string;
  children?: JSONElement[];
}





function jsonToJSX(jsonData: JSONElement, onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, onDrop: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void): JSX.Element {
  const {tag, text, customId, class: className, id, children} = jsonData;

  const attributes: {[key: string]: string | Function} = {};

  if (className) attributes.className = className;
  if (id) attributes.id = `${id} ${customId}`;
  if (customId) attributes.id = `${customId}`;
  attributes.draggable = 'true';
  attributes.onDragStart = (e: React.DragEvent<HTMLDivElement>) => onDragStart(e, jsonData);
  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => onDragOver(e);
  attributes.onDrop = (e: React.DragEvent<HTMLDivElement>) => onDrop(e, jsonData);

  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your className here
    e.currentTarget.classList.add("dragedElement");
    onDragOver(e);
  };

  attributes.onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your className here
    e.currentTarget.classList.remove("dragedElement");
    onDragOver(e);
  };

  if (!children && !text) {
    // Self-closing tag
    return React.createElement(tag, {...attributes});
  }

  if (children?.length == 0) {
    // No children, just text content
    return React.createElement(tag, {...attributes}, text);
  }
  if (!children) {
    // No children, just text content
    return React.createElement(tag, {...attributes}, text);
  }

  // Recursively process children

  const childElements = children.map((child, index) => {
    return jsonToJSX(child, onDragStart, onDragOver, onDrop)
  });

  return React.createElement(tag, {...attributes}, childElements);
}

interface HTMLRendererProps {
  jsonData: JSONElement;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({jsonData}) => {
  const dispatch = useDispatch()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => {
    e.dataTransfer.setData('object', JSON.stringify(element));
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => {
    e.preventDefault();
    e.stopPropagation();

    const elementData = e.dataTransfer.getData('object');
    if (elementData) {
      const draggedElement = JSON.parse(elementData) as JSONElement;

      // Get the target element where the drop occurred
      const targetElement = e.target as HTMLElement;
      console.log(e.target)

      }
      e.currentTarget.classList.remove("dragedElement");
      if (elementData) {
        const draggedElement = JSON.parse(elementData) as Element;
        dispatch({type: "dropElement", draggedElement, customId: element?.customId})
      }
    };



    const jsxElement = jsonToJSX(jsonData, handleDragStart, handleDragOver, handleDrop);


    return jsxElement
  };

  export default HTMLRenderer;

