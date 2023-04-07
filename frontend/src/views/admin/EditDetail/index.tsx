import Card from "../../../components/card";
import {Link, useLocation} from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store } from 'react-notifications-component';
import { editSecret, getSecretByIdentifierName } from "../../../redux/password/apiCalls";
import { passwordStrength as passwordStrengthChecker } from 'check-password-strength'
import RingLoader from "react-spinners/RingLoader";
const EditDetail = () => {
    const {state} = useLocation();
    const {identifierName} = state
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {currentUser} = useSelector((state:any) => state.user);
    const [formFields, setFormFields] = useState({
        'identifierName' : '',
        'passwordStrength':'',
        'password':'',
        'note':'',
        'url':''
    });
    const [isloading,setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleChange = (event: any) => {
        const {name,value} = event.target;
        setFormFields({...formFields,[name]:value})
    }
    const controller = new AbortController()
    const getData = useCallback(()=>{
            setIsLoading(true)
            getSecretByIdentifierName(dispatch,currentUser.token,identifierName,controller.signal).then((data)=>{
                setFormFields(data)
                controller.abort()
                setIsLoading(false)
            }).catch((error)=>{
                console.log(error)
                setIsLoading(false)
            })
    },[])

    useEffect(()=>{
        getData()
    },[getData]) 

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            const strength = passwordStrengthChecker(formFields.password).value
           await editSecret(dispatch,
            {...formFields,passwordStrength: strength});
           Store.addNotification({
            container: "top-right",
            message: "Secret Edited Successfully.",
            type:"success",
            dismiss: {
              duration: 3000 
            }
            })
            setIsLoading(false)
            navigate("/admin/default")
        } catch(e: any) {
            setIsLoading(false)
            Store.addNotification({
                container: "top-right",
                title: e.response.data.description,
                message: JSON.stringify(e.response.data.error),
                type:"danger",
                dismiss: {
                  duration: 6000 
                }}
                )    
        }
    }
  return (
    (isloading ?
        <div className="absolute top-[50%] left-[43%] sm:left-[55%]">
        <RingLoader color="#4318FF"/>
        </div>
        :
    <div>
        <Card extra={"mt-3 !z-5 overflow-hidden"}>
            {/* HistoryCard Header */}
            <div className="flex items-center justify-between rounded-t-3xl p-3 bg-gray-200 dark:bg-brand-500">
                <div className="text-lg font-bold text-navy-700 dark:text-white pl-[44px]">
                    Edit Secret
                </div>
                {/*<button className="linear rounded-[20px] bg-lightPrimary px-4 py-2 text-base font-medium text-brand-500 transition duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-white/5 dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20">*/}
                {/*    See all*/}
                {/*</button>*/}
            </div>

            {/* History CardData */}

                <div className="flex h-full w-full items-start justify-between bg-white px-[60px] py-[20px] hover:shadow-2xl dark:!bg-navy-800 dark:shadow-none dark:hover:!bg-navy-700">
                    <div className="mt-1 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="identifierName"
                                   className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Identifier Name</label>
                            <div className="mt-1">
                                <input type="text" name="identifierName" id="identifierName" autoComplete="given-name"
                                       className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1
                                       ring-inset ring-gray-300 placeholder:text-gray-400
                                       focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6
                                       dark:text-white bg-white/0"
                                       onChange={handleChange}
                                       value={formFields.identifierName}
                                       />
                            </div>
                        </div>

                        <div className="sm:col-span-11 relative">
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Password</label>
                            <div className="mt-1">
                                <input 
                                id="password" 
                                name="password" 
                                type={showPassword ? "text":"password"}
                                autoComplete="email"
                                       className="block w-full rounded-md border-0 py-1.5 px-3
                                       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                       focus:ring-indigo-600 sm:text-sm sm:leading-6
                                       dark:text-white bg-white/0"
                                       onChange={handleChange}
                                       value={formFields.password}
                                       />
                   <div className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer" onClick={()=>setShowPassword(!showPassword)}>
                        {!showPassword && <svg className="h-4 text-gray-700" fill="none" viewBox="0 0 576 512">
                            <path fill="currentColor"
                                d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
                            </path>
                            </svg>}

                        {showPassword && <svg className="h-4 text-gray-700" fill="none"
                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                        <path fill="currentColor"
                            d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
                        </path>
                        </svg>}
                                    </div>
                            </div>
                        </div>

                        <div className="sm:col-span-11">
                            <label htmlFor="url" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                URL</label>
                            <div className="mt-1">
                                <input id="url" name="url" type="url"
                                       className="block w-full rounded-md border-0 py-1.5 px-3
                                       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                       focus:ring-indigo-600 sm:text-sm sm:leading-6
                                       dark:text-white bg-white/0
                                       "
                                       value={formFields.url}
                                       onChange={handleChange}
                                       />
                            </div>
                        </div>

                    <div className="col-span-full">
                        <label htmlFor="note"
                               className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Note</label>
                        <div className="mt-1">
                            <textarea id="note" name="note"
                                      className="block w-full rounded-md border-0 px-3
                                      text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                      placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                      focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6
                                      dark:text-white bg-white/0
                                      "  
                                      onChange={handleChange}
                                      value={formFields.note}
                                      rows={3}></textarea>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Write a few sentences about secret.</p>
                    </div>
                        <div className="col-span-12">
                            <div className="flex items-right justify-content-right gap-8">
                                <button type="submit" 
                                onClick={handleSubmit}
                                className="linear mt-1 w-full rounded-xl bg-green-500 py-[10px] text-base font-medium text-white transition duration-200 hover:bg-green-600 active:bg-green-700 dark:bg-green-400 dark:text-white dark:hover:bg-green-300 dark:active:bg-green-200">
                                    Save
                                </button>
                                <Link to="/admin/default" className="linear mt-1 w-full rounded-xl bg-brand-500 py-[10px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700
                                dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200
                                flex justify-center
                                ">
                                    Cancel
                                </Link>
                            </div>
                        </div>
                </div>
                </div>
        </Card>
    </div>)
  )
};

export default EditDetail;
