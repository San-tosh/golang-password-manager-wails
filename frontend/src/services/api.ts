import axios from "axios";
import {API_URL} from "../config/index"

export const publicRequest = axios.create({
    baseURL: API_URL,
  });

  //ts-ignore
  export const getToken = ()=> {
  let user = localStorage.getItem("persist:root")
  let token = ''
  if(user) {
      user = JSON.parse(user)?.user
      const currentUser = user && JSON.parse(user).currentUser;
      token = currentUser?.token;
  }
  console.log(token)
  return token;
}

export const userRequest = axios.create({
  baseURL: API_URL,
  headers: { 
    'Content-Type' : 'application/json'
   },
});