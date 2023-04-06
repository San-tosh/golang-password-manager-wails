import { loginFailure, loginStart, loginSuccess } from "./userSlice";
import { publicRequest } from "../../services/api";

export const login = async (dispatch: any, user: any) => {
    dispatch(loginStart());
    try {
      const res = await publicRequest.post("/user/sigin", user);
      dispatch(loginSuccess(res.data.data));
      return Promise.resolve(res)
    } catch (err) {
      dispatch(loginFailure());
      return Promise.reject(err)
    }
  };

  export const signUp = async (dispatch: any, user: any) => {
    // dispatch(loginStart());
    try {
      const res = await publicRequest.post("user/signup", user);
      return Promise.resolve(res)
      // dispatch(loginSuccess(res.data));
    } catch (err) {
      return Promise.reject(err)
      // dispatch(loginFailure());
    }
  };