import React, { useEffect, useState } from 'react'
import { doApiMethod } from '../services/apiServices'

const TestScroll = () => {

    const [ar, setAr] = useState([]);
    let nextPage = 1;

    useEffect(() => {
        window.addEventListener("scroll", onScrollWindow)
        doApi();
    }, [])

    const doApi = async () => {
        console.log(nextPage)
        const url = `http://localhost:3001/gamesApps?page=${nextPage}`;
        const data = await doApiMethod(url);
        console.log(data);
        // setAr(data);
        // TODO: check if there more data and add loading
        setAr((ar) => [...ar, ...data])
        nextPage++;
    }


    const onScrollWindow = () => {
        // console.log("scroll");
        // מחזיר את גובה החלון של המשתמש
        const windowHeight = window.innerHeight;
        // נקודת הוואי שהחלון נמצא בו בגלילה , אם ניהיה הכי למעלה
        // ניהיה בנקודת 0
        const scrollTop = document.documentElement.scrollTop;
        // גובה כל המסמך
        const docHeight = document.documentElement.offsetHeight;

        if (Math.ceil(windowHeight + scrollTop) >= docHeight) {
            // alert("end screen");
            doApi();
        }

        // console.log("wh:",windowHeight,"st:",scrollTop,"dh:",docHeight);
    }




    return (
        <div style={{ minHeight: "200px" }} className='container'>
            <h1>Test scroll</h1>
            <div className="row">
                {ar.map(item => {
                    return (
                        <div className='p-5 my-4 border col-md-7' key={item._id}>
                            <h2>{item.name}</h2>
                            <div>Date:{item.date}</div>
                            <div>Category:{item.category_url}</div>
                            <img src={item.img_url} height="250" alt="image" />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TestScroll