import React, { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {toast} from "react-toastify";

import { API_URL, doApiGet, doApiMethod, TOKEN_KEY } from '../services/apiServices';
import { AuthAdmin } from './authAdmin';


export const EditCategory = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const nav = useNavigate();
  const params = useParams();  
  const [info, setInfo] = useState({});  



   useEffect(()=>{
    doApiInit();
   },[])




// TODO: load the data of the document to the input of the recode we want to edit
  // request for get the info of the item we want to edit
  const doApiInit = async() => {
    let url = API_URL+"/categories/single/"+params["id"]
    try{
      let data = await doApiGet(url);
      console.log({data});
      setInfo(data);
    }
    catch(err){
      console.log(err);
      alert("There problem , come back later")
    }
  }




  const onSub = (bodyData) => {
    console.log(bodyData)
    doApi(bodyData);
  }



  const doApi = async(bodyData) => {
    try{
      let url = API_URL+"/categories/"+params["id"];
      let data = await doApiMethod(url,"PUT",bodyData);
      console.log(data)
      if(data.modifiedCount== 1){
        // alert("category updated")
        toast.info('category updated')
        nav(-1)
      }
      else{
        toast.error("You not change nothing from the last update")
        // alert("You not change nothing from the last update")
      }
    }
    catch(err){
      console.log(err);
      alert("There problem come back later");
    }
  }
      
    
    


  return (
    <div className='container'>
        <AuthAdmin/>
      <h1 className='display-5'>Edit Category</h1>

      {!info._id ? <h1>loading...</h1> :
      <form onSubmit={handleSubmit(onSub)} id="id_form" className='col-md-6 shadow p-2' >
       

        <label>name</label>
        <input defaultValue={info.name} {...register("name", { minLength: 2, required: true })} className="form-control" type="text" />
        {errors.name && <div className='text-danger'>
          * Enter valid name (min 2 chars)
        </div>}

        <label>url_code</label>
        <input  defaultValue={info.url_code} {...register("url_code", { minLength: 2, required: true })} className="form-control" type="hidden" />
        {errors.url_code && <div className='text-danger'>
          * Enter valid url_code (min 2 chars)
        </div>}

        <label>img_url</label>
        <input defaultValue={info.img_url} {...register("img_url", { minLength: 2, required: false })} className="form-control" type="text" />
        {info.img_url.length > 1 && 
        <img src={info.img_url} alt="img" className='w-25 d-block'/>}

        {errors.img_url && <div className='text-danger'>
          * Enter valid img_url (min 2 chars)
        </div>}

        <label>info</label>
        <input defaultValue={info.info} {...register("info", { minLength: 2, required: true })} className="form-control" type="text" />
        {errors.info && <div className='text-danger'>
          * Enter valid info (min 2 chars)
        </div>}

        <div className='mt-4'>
          <button className='btn btn-warning'>Update</button>
        </div>

      </form>
      }
    </div>
  )
}
