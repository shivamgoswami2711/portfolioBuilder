function jsonToJSX(
  jsonData: JSONElement,
  onDragStart: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void,
  onDragOver: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void,
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void,
  onDrop: (e: React.DragEvent<HTMLDivElement>, element: JSONElement) => void,
  onTextChange: (text: string, id: string) => void,
  onDoubleClick: (e: React.MouseEvent<HTMLDivElement>) => void,
  onBlurEvent: (e: React.FocusEvent<HTMLDivElement>) => void
): JSX.Element {
  const {
    tag,
    text,
    customId,
    class: className,
    children,
    childAllow,
    disableChild,
    customAttributes,
    style,
    selfClosing
  } = jsonData;

  const attributes: {[key: string]: string | Function | Object} = {
    ...customAttributes,
    style: {...style}
  };

  if (className) attributes.className = className;
  if (customId) attributes.id = customId;

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
  };

  attributes.onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add("dragedElement");
    onDragOver(e, jsonData);
  };

  attributes.onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("dragedElement");
    onDragOver(e, jsonData);
  };

  if (selfClosing) {
    return React.createElement("img", {...attributes}, null);
  }

  if (!children && !text) {
    return React.createElement(tag, {...attributes});
  }

  if (disableChild || childAllow && (childAllow.length > 0 && !childAllow.includes(tag))) {
    // Child is disabled or not allowed
    return React.createElement(tag, {...attributes}, text);
  }

  // Recursively process children
  const childElements = children?.map((child, index) => {
    return jsonToJSX(child, onDragStart, onDragOver, onDragLeave, onDrop, onTextChange, onDoubleClick, onBlurEvent);
  });

  return React.createElement(tag, {...attributes}, childElements);
}