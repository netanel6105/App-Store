import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, doApiGet } from '../../services/apiServices';

const CategoriesClientList = () => {

  const nav = useNavigate();
  const [ar,setAr] = useState([]);
  


  useEffect(()=>{
    doApi();
  },[])


  const doApi = async()=>{
    let url = API_URL+"/categories";
    let data = await doApiGet(url);
    console.log(data);
    setAr(data);

  }

  return (

    <div className='row g-3'>
      {ar.map((item,i)=>{
        return(
          <article onClick={()=>{
            nav('/category/'+ item.url_code)
          }} key={item._id} className='col-md-3 shadow mt-5'>
            <div className='bg-category shadow center ' style=
            {{backgroundImage:`url(${item.img_url})`}}> 
              <h3>
              <Link to={'/category/'+ item.url_code}>{item.name}</Link>  
              </h3>
            </div>
          </article>
        )
      })}
    </div>

  )
}

export default CategoriesClientList