import {getToken, publicRequest, userRequest}  from "../../services/api";
import { passwordEntryFailure, passwordEntryStart, passwordEntrySuccess } from "./passwordSlice";

export const addSecret = async (dispatch: any, entries: any) => {
    dispatch(passwordEntryStart());
    try {
      const res = await userRequest.post("/admin/add-secret", entries,{
        headers :{
          token: getToken()
        } 
      });
      dispatch(passwordEntrySuccess());
      return Promise.resolve(res)
    } catch (err) {
      dispatch(passwordEntryFailure());
      return Promise.reject(err)
    }
  };

  export const editSecret = async (dispatch: any, entries: any) => {
    try {
      const res = await userRequest.post("/admin/edit-secret", entries,{
        headers :{
          token: getToken()
        } 
      });
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  };

  export const getSecrets = async (dispatch: any,token: string,signal: any) : Promise<any> => {
    dispatch(passwordEntryStart());
    try {
      const res = await publicRequest.get("/admin/get-secret",{
        headers :{
          token: token,
          'Content-Type' : 'application/json'
        } 
      });
      dispatch(passwordEntrySuccess());
      return Promise.resolve(res)
    } catch (err) {
      dispatch(passwordEntryFailure());
      return Promise.reject(err)
    }
  };

  export const getSecretByIdentifierName = async (dispatch: any,token: string,identifierName: string,signal: any) : Promise<any> => {
    
    try {
      const res = await publicRequest.get("/admin/get-secret-for-edit",{
        headers :{
          token: token,
          'Content-Type' : 'application/json'
        },
        params :{
          identifierName
        },
        signal
      });
      return Promise.resolve(res.data.data)
    } catch (err) {
      return Promise.reject(err)
    }
  };

  export const deleteSecret = async (dispatch: any,token: string,id: string) : Promise<any> => {
    try {
      const res = await publicRequest.post("/admin/delete-secret", {identifierName:id},{
        headers :{
          token: token,
          'Content-Type' : 'application/json'
        } 
      });
      return Promise.resolve(res)
    } catch (err) {
      return Promise.reject(err)
    }
  };
