import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../../comps_general/loading'
import { API_URL, doApiGet } from '../../services/apiServices'
import GameAppItem from '../misc/gameAppItem'


const PageGamesList = () => {

    const [ar,setAr]= useState([])
    const params = useParams()
    const [catInfo, setCatInfo] = useState([])
    const [loading,setLoadig] = useState(false);

    useEffect(()=>{
        
        doApi();
    },[])

    const doApi = async() =>{
        setLoadig(true)
        let catName = params["catName"];
        let urlCat = `${API_URL}/categories/byCode/${catName}`;
        let dataCat = await doApiGet(urlCat);
        console.log(dataCat);
        setCatInfo(dataCat)



        let url = `${API_URL}/gamesApps/?cat=${catName}`;
        let data = await doApiGet(url);
        console.log(data);
        setAr(data);
        setLoadig(false)

    }

  return (
   
    <div className='container py-4 text-center'>
        {loading && <Loading/>}
        <React.Fragment>
        <h1 className='display-4'>Apps/gemes list: {catInfo.name}</h1>
        <p className='lead'>{catInfo.info}</p>
        <div className='row justify-content-center'>

            {ar.map(item =>{
                return(
                    <GameAppItem key={item._id} item={item}/>
                )
            })}
        </div>
        </React.Fragment>
    </div>

  )
}

export default PageGamesList