import React, { useEffect} from 'react'
// import {useLocation, useParams} from 'react-router-dom'
import {data, elements} from '../../../utils/data'
import Corousel from '../../../components/Corousel/Corousel';
import {useDispatch, useSelector} from "react-redux"
import {RootState} from "../../../Redux/store"
import HTMLRendererBuilder, {JSONElement} from "../../../utils/preview/HTMLRendererBuilder"
import {Link} from 'react-router-dom';
import "./style.css";
import ElementReanderer from '../../../utils/ElementReanderer';


function Portfolio() {
    const dispatch = useDispatch()
    // const {portfolio} = useParams()
    // const {index} = useLocation().state
    const {section, custom} = useSelector((state: RootState) => state.builder);


    const selectedComponent = (Element: JSONElement, sectionIndex: number) => {
        dispatch({type: "AddTemplate", element: Element, index: sectionIndex})
    }

    useEffect(() => {
        const handleUndo = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                dispatch({type: "undo"})
            } else if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
                dispatch({type: "do"})
            }
        };

        // Add an event listener for the keydown event
        window.addEventListener('keydown', handleUndo);

        // Cleanup the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleUndo);
        };
    }, [dispatch]);

    useEffect(() => {
        const storedData = localStorage.getItem("section");
        const Template = localStorage.getItem("template");

        if (storedData) {
            const parsedData = JSON.parse(storedData);
            dispatch({type: "sectionlocalSectionAdd", payload: parsedData})
        }
        if (Template) {
            const parsedData = JSON.parse(Template);
            dispatch({type: "TemplatelocalAdd", payload: parsedData})
        }
    }, [dispatch]);


    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, element: {sectionType: string, index: number}) => {
        e.dataTransfer.setData('text/plain', JSON.stringify(element));
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetElement: {sectionType: string, index: number}) => {
        e.preventDefault();
        const elementData = e.dataTransfer.getData('text/plain');
        if (elementData) {
            const draggedElement = JSON.parse(elementData) as Element;
            dispatch({type: "DragAndDropSection", draggedElement, targetElement})
        }
    };




    return (
        <div className='portfolioBuilder'>
            <div>
                {
                    elements.map((element, Index) => <ElementReanderer key={Index} jsonData={element} />)
                }
            </div>
            <div>
                {
                    section.map((sectionType: string, index: number) => {
                        if (!sectionType) {
                            return (
                                <div key={index} >
                                    <select onChange={e => dispatch({type: "SectionSelectType", value: e.target.value, index})}>
                                        <option value="">select</option>
                                        {Object.keys(data).map(sectionType => <option value={sectionType}>{sectionType}</option>)}
                                        <option value="custom">Custom</option>
                                    </select>
                                    <div><input type="button" value="delete" onClick={() => {
                                        dispatch({type: "DeleteSectionSelectType", index});
                                        dispatch({type: "DeleteTemplate", index});
                                        dispatch({type: "DeleteCorousel", index});
                                    }} /> </div>
                                </div>
                            )
                        }
                        else if (sectionType === "custom") {
                            return <>
                                <HTMLRendererBuilder jsonData={custom} />
                                <div><input type="button" value="delete" onClick={() => {
                                    dispatch({type: "DeleteSectionSelectType", index});
                                    dispatch({type: "DeleteTemplate", index});
                                    dispatch({type: "DeleteCorousel", index});
                                }} /> </div>
                            </>
                        } else {
                            return (<div key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, {sectionType, index})}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, {sectionType, index})}>
                                <Corousel components={[...data[`${sectionType}`].component]} sectionIndex={index} selectedComponent={selectedComponent} />
                                <div><input type="button" value="delete" onClick={() => {
                                    dispatch({type: "DeleteSectionSelectType", index});
                                    dispatch({type: "DeleteTemplate", index});
                                    dispatch({type: "DeleteCorousel", index});
                                }} /> </div>


                            </div>)
                        }
                    })
                }
                <div><input type="button" value="new Section" onClick={() => {
                    dispatch({type: "AddSection"})
                }} /> </div>
                <div>
                    <Link to={"/builder/preview/1"}>Preview </Link>
                </div>
            </div>
        </div>

    )
}

export default Portfolio