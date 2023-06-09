import InputField from "../../components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import Checkbox from "../../components/checkbox";
import {Link} from "react-router-dom";
import { useDispatch,  } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {login} from "../../redux/user/apiCalls"
import { Store } from 'react-notifications-component';
import RingLoader from "react-spinners/RingLoader";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [passphrase, setPassprase] = useState("");
  const [isloading,setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (e: any) =>{
    e.preventDefault();
    setIsLoading(true)
    const res = login(dispatch,{email, passphrase})
    res.then((data : any)=>{
      Store.addNotification({
        container: "top-right",
        message: "Login Successfull",
        type:"success",
        dismiss: {
          duration: 3000 
        }
        })
        setIsLoading(false)
        navigate("/admin/default")
      }).catch((err)=>{
        setIsLoading(false)
        Store.addNotification({
          container: "top-right",
          title: err.response.data.description,
          message: JSON.stringify(err.response.data.error),
          type:"danger",
          dismiss: {
            duration: 3000 
          }}
          )    
      })
  }
  return (
    (isloading ?
      <div className="flex justify-center items-center w-full h-full absolute top-0">
      <RingLoader color="#4318FF"/>
      </div>
      :
      <div className="mt-3 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign In
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Sign In with Google
          </h5>
        </div>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email*"
          placeholder="mail@simmmple.com"
          id="email"
          type="email"
          handler={setEmail}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Password*"
          placeholder="Min. 8 characters"
          id="password"
          type="password"
          handler={setPassprase}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
              Keep me logged In
            </p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            Forgot Password?
          </a>
        </div>
        <Link to="/admin/default">
        <button onClick={handleLogin} type="submit" className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign In
        </button>
        </Link>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Not registered yet?
          </span>
          <Link
              to="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
    )
  );
}
