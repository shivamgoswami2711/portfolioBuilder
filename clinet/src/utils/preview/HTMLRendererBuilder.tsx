import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import "./HTMLRendererBuilder.css";
import {generateRandomString} from '../util';
import ReactDOM from 'react-dom';
import EditActionButton from './EditActionButton/EditActionButton';
import {SiblingFinder} from './utils/util';

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

const debounce = <T extends (...args: any[]) => void>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const throttle = <T extends (...args: any[]) => void>(func: T, limit: number) => {
  let lastCallTime = 0;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now();

    if (now - lastCallTime >= limit) {
      func.apply(this, args);
      lastCallTime = now;
    }
  };
};




function jsonToJSX(jsonData: JSONElementBuilder, onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => void, onDragOver: (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => void, onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void, onDrop: (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => void, onTextChange: (text: string, id: string) => void, onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void, onBlurEvent: (e: React.FocusEvent<HTMLDivElement>) => void): JSX.Element {
  const {tag, text, customId, class: className, children} = jsonData;
  const attributes: {[key: string]: string | Function | Object} = {};

  if (className) attributes.className = className;
  // if (id) attributes.id = `${id} ${customId}`;
  if (customId) attributes.id = `${customId}`;
  attributes.draggable = 'true';
  attributes.onDragStart = (e: React.DragEvent<HTMLDivElement>) => onDragStart(e, jsonData);
  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => onDragOver(e, jsonData);
  attributes.onDragLeave = (e: React.DragEvent<HTMLDivElement>) => onDragLeave(e);
  attributes.onDrop = (e: React.DragEvent<HTMLDivElement>) => onDrop(e, jsonData);
  attributes.onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => onDoubleClick(e);
  attributes.onBlur = (e: React.FocusEvent<HTMLDivElement>) => onBlurEvent(e);
  attributes.key = customId || generateRandomString(3);
  attributes.onInput = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onTextChange(e.currentTarget.textContent || "", e.currentTarget.id);
  }


  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your className here
    e.currentTarget.classList.add("dragedElement");
    onDragOver(e, jsonData);
  };

  attributes.onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // Add your className here
    e.currentTarget.classList.remove("dragedElement");
    onDragOver(e, jsonData);
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
    return jsonToJSX(child, onDragStart, onDragOver, onDragLeave, onDrop, onTextChange, onDoubleClick, onBlurEvent)
  });

  return React.createElement(tag, {...attributes}, childElements);
}

interface HTMLRendererProps {
  jsonData: JSONElementBuilder;
}




const HTMLRenderer: React.FC<HTMLRendererProps> = ({jsonData}) => {
  const dispatch = useDispatch()
  const [changeData, setChangeData] = useState<EditTextStateDataType>({text: "", id: ""})

  // const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   const mouseY = e.clientY;
  //   const mouseX = e.clientX;
  //   const dropTarget = e.target as HTMLElement;
  //   let dropPosition: 'above' | 'below' = 'above';

  //   // Get the position of the target element
  //   const targetRect = dropTarget.getBoundingClientRect();
  //   // Calculate the vertical midpoint of the target element
  //   const targetMidY = targetRect.top + targetRect.height / 2;

  //   // Determine if the mouse is above or below the midpoint
  //   if (mouseY > targetMidY) {
  //     dropPosition = 'below';
  //   } else {
  //     dropPosition = 'above';
  //   }

  //   // Example: Logging the drop position
  //   const DropLocationBox = document.querySelector('.dropDetectionBox');
  //   if (!DropLocationBox) {
  //     const dropDetectionBox = document.createElement('div');
  //     dropDetectionBox.className = 'dropDetectionBox';
  //     const dropDetectionBoxDotted = document.createElement('div');
  //     dropDetectionBoxDotted.className = 'dropDetectionBoxDotted';
  //     const spanText = document.createElement('span');
  //     spanText.innerText = `drop here`;
  //     dropDetectionBoxDotted.append(spanText)
  //     dropDetectionBox.append(dropDetectionBoxDotted)
  //     dropTarget.insertAdjacentElement(dropPosition == "above" ? 'beforebegin' : 'beforeend', dropDetectionBox);

  //   }
  // };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => {
    e.preventDefault();
    e.stopPropagation();
    const mouseY = e.clientY;
    const mouseX = e.clientX;
    const dropTarget = e.target as HTMLElement;
    let dropPosition: 'above' | 'below' = 'above';

    // Get the position of the target element
    const targetRect = dropTarget.getBoundingClientRect();

    // Calculate the vertical midpoint of the target element
    const targetMidY = targetRect.top + targetRect.height / 2;

    // Determine if the mouse is above or below the midpoint
    if (element.customId !== "doZ6iZUR") {
      if (mouseY > targetMidY) {
        dropPosition = 'below';
      } else {
        dropPosition = 'above';
      }
    } else {
      dropPosition = 'below';
    }

    SiblingFinder()
    
    // Remove existing drop position indicators
    const existingIndicators = document.querySelectorAll('.dropDetectionBox');
    existingIndicators.forEach(indicator => indicator.remove());
    
    // Add a new drop position indicator
    const dropDetectionBox = document.createElement('div');
    dropDetectionBox.className = 'dropDetectionBox';
    dropDetectionBox.id = dropTarget.id;
    const dropDetectionBoxDotted = document.createElement('div');
    dropDetectionBoxDotted.className = 'dropDetectionBoxDotted';
    const spanText = document.createElement('span');
    spanText.innerText = `drop here`;
    dropDetectionBoxDotted.append(spanText);
    dropDetectionBox.append(dropDetectionBoxDotted);

    // Add the new indicator based on the drop position
    dropTarget.insertAdjacentElement(dropPosition === 'above' ? 'beforebegin' : 'beforeend', dropDetectionBox);
  };


  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => {
    e.dataTransfer.setData('object', JSON.stringify(element));
    e.stopPropagation();
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    document.querySelector('.dropDetectionBox')?.remove()
  }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, element: JSONElementBuilder) => {
    e.preventDefault();
    e.stopPropagation();
    const dropTarget = e.target as HTMLElement;
    const elementData = e.dataTransfer.getData('object');
    let id = dropTarget.id;
    let dropPosition: 'above' | 'below' = 'above';
    if (elementData) {
      // Convert NodeList to an array and then iterate
      const childNodesArray = Array.from(dropTarget.childNodes);
      for (const childNode of childNodesArray) {
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const element = childNode as HTMLElement;
          if (element.id !== "doZ6iZUR") {
            if (element.id) {
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
          } else {
            dropPosition = 'below';
          }
        }
      }
    }
    e.currentTarget.classList.remove("dragedElement");
    if (elementData) {
      const draggedElement = JSON.parse(elementData) as Element;
      console.log({draggedElement, customId: element?.customId, dropId: id, dropPosition})
      dispatch({type: "DropElement", draggedElement, customId: element?.customId, dropId: id, dropPosition})
    }
    document.querySelector('.dropDetectionBox')?.remove()
  };


  const onTextChange = (text: string, id: string) => {
    setChangeData((pre: EditTextStateDataType) => ({...pre, text}))
  }


  const onDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target as HTMLDivElement;
    target.contentEditable = "true";
    target.classList.add("edit")


    // Check if the action button already exists
    const addedElement = document.querySelector('.EditActionComponent');
    if (!addedElement) {
      // If not, insert the action button before the editable content
      const actionButtonContainer = document.createElement("div");
      ReactDOM.render(<EditActionButton id={target.id} dispatch={dispatch} />, actionButtonContainer);
      target.insertAdjacentElement('beforeend', actionButtonContainer.firstChild as Element);
    }
    target.tabIndex = 0;
    setChangeData((pre: EditTextStateDataType) => ({...pre, id: target.id}))
  }

  const onBlurEvent = (e: React.FocusEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target
    target.contentEditable = "false"
    target.classList.remove("edit")
    const addedElement = document.querySelector('.EditActionComponent');
    if (addedElement) {
      addedElement.remove();
    }
    if (changeData?.text) {
      dispatch({type: "CustomTextEdit", text: changeData.text, id: changeData?.id})
      setChangeData({text: "", id: ""})
    }
  }

  const jsxElement = jsonToJSX(jsonData, handleDragStart, throttle(handleDragOver, 1000), onDragLeave, handleDrop, onTextChange, onDoubleClick, onBlurEvent);
  return jsxElement
};

export default HTMLRenderer;

