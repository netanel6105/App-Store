import React, { useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { MyContext } from '../../context/myContext';
import { API_URL, doApiMethod } from '../../services/apiServices';
// the search input comp in the header of the app
const HeaderSearch = () => {

    const { userInfo, setUserInfo } = useContext(MyContext)
    const searchRef = useRef();
    const nav = useNavigate();

    const onSearchClick = () => {
        nav(`/search?s=${searchRef.current.value}`)
        // נשמור במאפיין לסט סירצ איי אר את המערך החדש עם 
        // החיפוש הנוכחי
        let search_ar = [...userInfo.last_search_ar];
        search_ar.unshift(searchRef.current.value)
        // מונע שכפול של תאים, חיפושים
        // ככה שאם חופש בעבר הביטוי לא יופיע שוב
        search_ar = [...new Set(search_ar)];

        setUserInfo({ ...userInfo, last_search_ar: search_ar })
        doApiSaveSearch(search_ar)
    }


    const doApiSaveSearch = async (search_ar) => {
        try {
            search_ar.splice(20, Infinity);
            let url = API_URL + "/users/updateSearch";
            let data = await doApiMethod(url, "PATCH", { search_ar });
            console.log(data);
        }
        catch (err) {

        }
    }

    return (
        <div className='col-md-4 d-flex'>
            <input list="id_dataList" onKeyDown={(e) => {
                e.key == "Enter" && onSearchClick();
            }} ref={searchRef} type="search" className='form-control' placeholder='search for app/game...' />
            <button onClick={() => {
                onSearchClick();
            }} className='btn btn-dark'>Search</button>

            <datalist id="id_dataList">
                {userInfo.last_search_ar && userInfo.last_search_ar.map((val, i) => {
                    return (
                        <option key={i}> {val}</option>
                    )
                })}
            </datalist>

            {/* <datalist id="id_dataList">
                <option>clash</option>
                <option>mario</option>
                <option>monster</option>
                <option>linkd</option>
                <option>fifa</option>
            </datalist> */}
        </div>
    )
}

export default HeaderSearch