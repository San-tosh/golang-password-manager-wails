import InputField from "../../components/fields/InputField";
import {Link} from "react-router-dom";
import { useDispatch,  } from "react-redux";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {signUp} from "../../redux/user/apiCalls"
import { Store } from 'react-notifications-component';

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [passphrase, setPassprase] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = (e: any) =>{
    e.preventDefault();
    const res = signUp(dispatch,{email, passphrase})
    res.then((data)=>{
      Store.addNotification({
        container: "top-right",
        message: "Sign Up Successfull",
        type:"success",
        dismiss: {
          duration: 3000 
        }
        })
        navigate("/auth/sign-in")
        
      }).catch((err)=>{
        console.log(err)
        console.log(err.response.data)
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
    <div className="mt-3 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Sign Up
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign up!
        </p>
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
        <button onClick={handleLogin} className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200">
          Sign Up
        </button>
        <div className="mt-4">
          <span className=" text-sm font-medium text-navy-700 dark:text-gray-600">
            Already registered?
          </span>
          <Link
            to="/"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
