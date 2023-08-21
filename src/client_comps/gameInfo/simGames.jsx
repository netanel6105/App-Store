import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { API_URL, doApiGet } from '../../services/apiServices';
import GameAppItem from '../misc/gameAppItem';

const SimGames = (props) => {
    const [ar,setAr]= useState([])
    let {category_url} = props;

    useEffect(()=>{
        doApi()
    },[])

    const doApi = async() => {
      console.log(category_url);
      
      let urlCat = `${API_URL}/gamesApps/?cat=${category_url}&perPage=5`;
      let dataCat = await doApiGet(urlCat);
      // console.log(dataCat);
      let appAr = dataCat;
      console.log(props._id);
      console.log(appAr);
      // לבדוק אם האיידי של האפליקציה המוצגת קיים במערך ואז להוריד אותו
      // אם לא לדאוג שהמערך יהיה באורך 4 פריטים בלבד
      let gameAppIndex = appAr.findIndex(item => item._id == props._id)
  
      gameAppIndex > -1 ? appAr.splice(gameAppIndex,1) : 
      appAr.pop();
  
  
  
      setAr(appAr);
    }

  return (

    <div className='row'>
        <h2>Games/app you may have:</h2>
    {ar.map(item => {
      return(
      <GameAppItem key={item._id} item={item} />
      )
    })}
  </div>

  )
}

export default SimGames