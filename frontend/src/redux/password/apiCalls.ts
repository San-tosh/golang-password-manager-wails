import { publicRequest } from "../../services/api";
import { passwordEntryFailure, passwordEntryStart, passwordEntrySuccess } from "./userSlice";

export const addSecret = async (dispatch: any, entries: any) => {
    dispatch(passwordEntryStart());
    try {
      const res = await publicRequest.post("/user/sigin", entries);
      dispatch(passwordEntrySuccess());
      return Promise.resolve(res)
    } catch (err) {
      dispatch(passwordEntryFailure());
      return Promise.reject(err)
    }
  };
