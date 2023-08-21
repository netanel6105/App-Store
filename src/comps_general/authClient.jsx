import React, { useEffect } from 'react'
import { API_URL, TOKEN_KEY, doApiGet } from '../services/apiServices'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';

const AuthClient = () => {
  const nav = useNavigate();

  useEffect(() => {
    doApi();
  }, [])

  const doApi = async () => {
    let url = API_URL + "/users/checkToken"
    try {
      let data = await doApiGet(url);
      if (!data.role) {
        alert("There problem , com back later")
      }
    }
    catch (err) {
      toast.error("You need login to be here, or your token expired , log in again")
      // כשאנחנו מזהים שגיאה בטוקן , חשוב  גם למחוק את הלוקאל של הטוקן
      localStorage.removeItem(TOKEN_KEY)
      nav("/login")
    }
  }

  return (

    <React.Fragment></React.Fragment>

  )
}

export default AuthClient