import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom';
import Loading from '../../comps_general/loading';
import { API_URL, doApiGet } from '../../services/apiServices';
import GameAppItem from '../misc/gameAppItem';

export default function SearchGamesList() {
  // יכיל את הרשימה של האפליקציות/משחקים של אותה קטגוריה
  const [ar, setAr] = useState([]);
  const [query] = useSearchParams();
  // יכיל את המידע על הקטגוריה
  const [searchFor, setSearchFor] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log(params["catName"]);
    doApi();
  }, [query])

  const doApi = async () => {
    // ?s=
    setSearchFor(query.get("s"));
    let url = `${API_URL}/gamesApps/?search=${query.get("s")}&perPage=10`;
    let data = await doApiGet(url);
    console.log(data);
    setAr(data);
  }

  return (
    <div className='container py-4 text-center'>
      {loading ? <Loading /> :
      <React.Fragment>
        <h1 className='display-4'>Search for {searchFor}:</h1>
        
        <div className="row justify-content-center">

          {ar.map(item => {
            return (
              <GameAppItem key={item._id} item={item} />
            )
          })}
        </div>
      </React.Fragment>
      }
    </div>
  )
}