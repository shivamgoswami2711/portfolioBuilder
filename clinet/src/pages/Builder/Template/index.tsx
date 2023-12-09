import React from 'react'
import HTMLRenderer from '../../../utils/preview/HTMLRendererBuilder';
import {useNavigate} from 'react-router-dom';
const htmlData = [
  {
    tag: 'div',
    class: 'section',
    id: 'section1',
    children: [
      {
        tag: 'h1',
        text: 'Section 1'
      },
      {
        tag: 'p',
        text: 'This is the first section of the HTML data.'
      }
    ]
  },
  {
    tag: 'div',
    class: 'section',
    id: 'section2',
    children: [
      {
        tag: 'h1',
        text: 'Section 2'
      },
      {
        tag: 'p',
        text: 'This is the second section of the HTML data.'
      }
    ]
  }
];

function Index() {
  const navigate = useNavigate();
  return (
    <div>
      {
        htmlData.map((template, index) => [(
          <div key={index} onClick={() => navigate("/builder/1", {state: {index}})}>
            <HTMLRenderer jsonData={template} />
          </div>
        )])
      }
    </div >
  )
}

export default Index