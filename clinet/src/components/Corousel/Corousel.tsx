import React, {useEffect, useState} from 'react';
import "./style.css"
import HTMLRenderer from '../../utils/HTMLRenderer';
import {RootState} from '../../Redux/store';
import {useDispatch, useSelector} from 'react-redux';
// Define the CarouselProps interface

interface JSONElement {
  tag: string;
  text?: string;
  class?: string;
  id?: string;
  children?: JSONElement[];
}

interface CarouselProps {
  components: JSONElement[]; // An array of React components to render
  sectionIndex: number;
  selectedComponent: (Element: JSONElement, sectionIndex: number) => void
}

const Corousel: React.FC<CarouselProps> = ({components, sectionIndex, selectedComponent}) => {
  const [currentCorousel, setCurrentCorousel] = useState(0);
  const {template,corousel} = useSelector((state: RootState) => state.builder);
  const dispatch = useDispatch()

  const goToNextSlide = () => {
    setCurrentCorousel((prevCorousel) => {
      dispatch({type: "AddCorouselIndex", index: sectionIndex, CorouselIndex:prevCorousel === components.length - 1 ? 0 : prevCorousel + 1})
      return prevCorousel === components.length - 1 ? 0 : prevCorousel + 1
    }
    );
  };

  const goToPrevSlide = () => {
    setCurrentCorousel((prevCorousel) => {
      dispatch({type: "AddCorouselIndex", index: sectionIndex, CorouselIndex: prevCorousel === 0 ? components.length - 1 : prevCorousel - 1})
      return prevCorousel === 0 ? components.length - 1 : prevCorousel - 1
    }
    );
  };

  useEffect(() => {
    const storedData = localStorage.getItem(`corousel`);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      dispatch({type: 'LocalCorouselData', payload: parsedData})
      setCurrentCorousel(parsedData[sectionIndex] || 0)
    }
  }, [sectionIndex]);

  useEffect(() => {
    setCurrentCorousel(+corousel[sectionIndex] || 0)
  }, [sectionIndex,corousel]);


  return (
    <div className="carousel">
      <button onClick={goToPrevSlide}>Previous</button>
      {components.map((component, Corousel) => {
        return (
          <div
            key={Corousel}

            className={`slide ${Corousel === currentCorousel ? 'active' : ''}`}
          >
            <HTMLRenderer key={Corousel} jsonData={component} />
            <button disabled={JSON.stringify(template[sectionIndex]) == JSON.stringify(component
            )} onClick={() => selectedComponent(component, sectionIndex)}>selected</button>
          </div>
        )
      })}
      <button onClick={goToNextSlide}>Next</button>
    </div>
  );
};

export default Corousel;
