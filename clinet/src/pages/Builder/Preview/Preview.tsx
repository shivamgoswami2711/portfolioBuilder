import React, {useState, useEffect} from "react";
import HTMLRenderer from "../../../utils/HTMLRenderer";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../Redux/store";
import {JSONElement} from "../../../utils/HTMLRenderer";

function Preview() {
  const {template} = useSelector((state: RootState) => state.builder);
  // const dispatch = useDispatch()
  // useEffect(() => {
  //   // const storedData = localStorage.getItem("Template");

  //   // if (storedData) {
  //   //   // Parse the JSON data
  //   //   const parsedData = JSON.parse(storedData);
  //   //   dispatch({type: "TemplatelocalAdd", payload: parsedData})
  //   // }

  // }, []);

  // console.log({template})

  return <div>
    {
      template.map((item: JSONElement) => {
        if (!item) return <></>
        return (<HTMLRenderer jsonData={item} />)
      })
    }
  </div>;
}

export default Preview;
