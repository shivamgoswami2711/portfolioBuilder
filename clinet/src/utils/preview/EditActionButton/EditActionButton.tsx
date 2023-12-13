import React, {useEffect, useRef} from 'react'
import "./EditActionComponent.css"
import {AppDispatch} from '../../../Redux/store'
interface EditActionButtonProps {
  id: string,
  dispatch: AppDispatch
}

const EditActionButton: React.FC<EditActionButtonProps> = ({id,dispatch}) => {
  const removeRef = useRef<HTMLLIElement>(null);
  const copyRef = useRef<HTMLLIElement>(null);
  const classNameRef = useRef<HTMLLIElement>(null);

  // Define the click event handler
  const handleClick = () => {
    dispatch({type: "deleteElement", id})
  };

  useEffect(() => {
    // Attach the click event handler when the component mounts
    const remove = removeRef.current;
    const copy = copyRef.current;
    const className = classNameRef.current;

    remove && remove.addEventListener('click', handleClick);
    copy && copy.addEventListener('click', handleClick);
    className && className.addEventListener('click', handleClick);
    // Clean up the event listener when the component unmounts
    return () => {
      remove && remove.removeEventListener('click', handleClick);
      copy && copy.removeEventListener('click', handleClick);
      className && className.removeEventListener('click', handleClick);
    };

  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className='EditActionComponent'>
      <ul>
        <li ref={copyRef}><img src="/icons/copy.svg" alt="" /></li>
        <li ref={removeRef}><img src="/icons/delete.svg" alt="" /></li>
        <li ref={classNameRef}><img src="/icons/edit.svg" alt="" /></li>
      </ul>
    </div>
  )
}

export default EditActionButton