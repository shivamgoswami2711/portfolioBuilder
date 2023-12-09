import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import "./HTMLRendererBuilder.css";
import {generateRandomString} from '../util';
import ReactDOM from 'react-dom';
import EditActionButton from './EditActionButton/EditActionButton';

export interface JSONElement {
  tag: string;
  text?: string;
  class?: string;
  customId?: string;
  id?: string;
  children?: JSONElement[];
}

export interface JSONElementBuilder extends JSONElement {
  editable?: boolean;
}
interface EditTextStateDataType {
  text: string;
  id: string;
}

type ActionButtonComponentProps = {
  onClick: () => void;
};



function jsonToJSX(jsonData: JSONElementBuilder, onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>) => void, onDrop: (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => void, onTextChange: (text: string, id: string) => void, onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void, onBlurEvent: (e: React.FocusEvent<HTMLDivElement>) => void): JSX.Element {
  const {tag, text, customId, class: className, children} = jsonData;
  const attributes: {[key: string]: string | Function | Object} = {};

  if (className) attributes.className = className;
  // if (id) attributes.id = `${id} ${customId}`;
  if (customId) attributes.id = `${customId}`;
  attributes.draggable = 'true';
  attributes.onDragStart = (e: React.DragEvent<HTMLDivElement>) => onDragStart(e, jsonData);
  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => onDragOver(e);
  attributes.onDrop = (e: React.DragEvent<HTMLDivElement>) => onDrop(e, jsonData);
  attributes.onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => onDoubleClick(e);
  attributes.onBlur = (e: React.FocusEvent<HTMLDivElement>) => onBlurEvent(e);
  attributes.key = customId || generateRandomString(3);
  attributes.onInput = (e: React.FormEvent<HTMLElement>) => onTextChange(e.currentTarget.textContent || "", e.currentTarget.id);


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
    return jsonToJSX(child, onDragStart, onDragOver, onDrop, onTextChange, onDoubleClick, onBlurEvent)
  });

  return React.createElement(tag, {...attributes}, childElements);
}

interface HTMLRendererProps {
  jsonData: JSONElementBuilder;
}




const HTMLRenderer: React.FC<HTMLRendererProps> = ({jsonData}) => {
  const dispatch = useDispatch()
  const [changeData, setChangeData] = useState<EditTextStateDataType>()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => {
    e.dataTransfer.setData('object', JSON.stringify(element));
    e.stopPropagation();
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => {
    e.preventDefault();
    e.stopPropagation();
    const dropTarget = e.target as HTMLElement;
    const elementData = e.dataTransfer.getData('object');
    let id = "";
    let dropPosition: 'above' | 'below' = 'above';
    if (elementData) {
      // Convert NodeList to an array and then iterate
      const childNodesArray = Array.from(dropTarget.childNodes);
      for (const childNode of childNodesArray) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const element = childNode as HTMLElement;
          if (element.id) {
            id = element.id;
            const mouseX = e.clientX;
            const elementLeft = element.getBoundingClientRect().left;
            if (mouseX > elementLeft + element.clientWidth / 2) {
              dropPosition = 'below';
            }
            const mouseY = e.clientY;
            const elementTop = element.getBoundingClientRect().top;
            if (mouseY > elementTop + element.clientHeight / 2) {
              dropPosition = 'below';
            }

            break; // Exit the loop after the first element with an ID is found
          }
        }
      }
    }
    e.currentTarget.classList.remove("dragedElement");
    if (elementData) {
      const draggedElement = JSON.parse(elementData) as Element;
      dispatch({type: "DropElement", draggedElement, customId: element?.customId, dropId: id, dropPosition})
    }
  };




  const onTextChange = (text: string, id: string) => {
    setChangeData({text, id})
    // dispatch({type: "CustomTextEdit", text, id})
    // const contentEditableElement = document.getElementById(id);
    // if (contentEditableElement) {
    //   const selection = window.getSelection();

    //   // Save the current selection
    //   if (selection) {
    //     const range = selection.getRangeAt(0);
    //     // Update the content
    //     contentEditableElement.textContent = text;

    //     // Restore the selection
    //     const updatedRange = document.createRange();
    //     const offset = range.startOffset;
    //     console.log(contentEditableElement.firstChild!)
    //     updatedRange.setStart(contentEditableElement.firstChild!, offset);
    //     updatedRange.setEnd(contentEditableElement.firstChild!, offset);
    //     selection.removeAllRanges();
    //     selection.addRange(updatedRange);
    //   }
    // }
  }


  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.contentEditable = "true";
    target.classList.add("edit")


    // Check if the action button already exists
    const addedElement = document.querySelector('.EditActionComponent');
    if (!addedElement) {
      // If not, insert the action button before the editable content
      const actionButtonContainer = document.createElement("div");
      ReactDOM.render(<EditActionButton />, actionButtonContainer);
      target.insertAdjacentElement('beforebegin', actionButtonContainer.firstChild as Element);
    }
    target.tabIndex = 0;
    console.log(target)
  }

  const onBlurEvent = (e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target
    target.contentEditable = "false"
    target.classList.remove("edit")
    const addedElement = document.querySelector('.EditActionComponent');
    if (addedElement) {
      addedElement.remove();
    }
    dispatch({type: "CustomTextEdit", text: changeData?.text, id: changeData?.id})
    setChangeData({text: "", id: ""})
  }

  const jsxElement = jsonToJSX(jsonData, handleDragStart, handleDragOver, handleDrop, onTextChange, onDoubleClick, onBlurEvent);
  return jsxElement
};

export default HTMLRenderer;

