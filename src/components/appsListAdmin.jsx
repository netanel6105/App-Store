import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import Loading from '../comps_general/loading';

import PagesComps from '../comps_general/pagesComps';
import { API_URL, doApiGet, doApiMethod } from '../services/apiServices'
import { AuthAdmin } from './authAdmin'

export const AppsListAdmin = () => {

  const [getQuery] = useSearchParams();
  const [ar, setAr] = useState([]);
  const [loading,setLoadig] = useState(false);

  // [getQuery ] -> כל פעם שהכתובת משתנה יבצע דו איי פי איי מחדש
  useEffect(() => {
    setLoadig(true)
    doApi();
  }, [getQuery])

  const doApi = async () => {
    let perPage = getQuery.get("perPage") || 5;
    let page = getQuery.get("page") || 1;

    let url = `${API_URL}/gamesApps?page=${page}&perPage=${perPage}`;
    // let url = API_URL + "/gamesApps";
    try {
      let data = await doApiGet(url);
      console.log(data);
      setAr(data)
      setLoadig(false)
    }
    catch (err) {
      console.log(err)
      alert("There problem , come back late")
    }
  }

  const onXClick = async(_delId) => {
    if(!window.confirm("Delete app?")){
      return ;
    }
    let url = API_URL + "/gamesApps/"+_delId;
    try{
      let data = await doApiMethod(url, "DELETE");
      if(data.deletedCount){
        alert("app/game deleted");
        doApi();
      }
    }
    catch(err){
      console.log(err)
      alert("There problem , come back late")
    }
    
  }



  return (
    <div className='container'>
        <AuthAdmin/>
        <h1>List of apps/games in the system</h1>

        <PagesComps apiPages={API_URL+"/gamesApps/count?perPage=5"} 
        linkTo={"/admin/apps?page="} 
        linkCss={"btn btn-warning me-2"} />

        {loading && <Loading/>}
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>Info</th>
            <th>Category</th>
            <th>Date</th>
            <th>Del</th>
          </tr>
        </thead>
        <tbody>
        {ar.map((item,i) => {
            return (
              <tr key={item._id}>
                <td>{i+1}</td>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td title={item.info}>{item.info.substring(0,15)}...</td>
                <td>{item.category_url}</td>
                <td>{item.date.substring(0,10)}</td>
                <td>
                  <button onClick={()=>{
                    onXClick(item._id);
                  }} className='bg-danger'>X</button>
                </td>
              </tr>
            )
          })}

        </tbody>
        </table>

    </div>
  )
}
