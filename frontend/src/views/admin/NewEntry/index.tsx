import Card from "../../../components/card";
import {Link} from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Store } from 'react-notifications-component';
import { addSecret } from "../../../redux/password/apiCalls";
import { passwordStrength as passwordStrengthChecker } from 'check-password-strength'
import RingLoader from "react-spinners/RingLoader";
const NewEntry = () => {
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

    const handleSubmit = async (event: any) => {
        event.preventDefault()
        try {
            setIsLoading(true)
            const strength = passwordStrengthChecker(formFields.password).value
           await addSecret(dispatch,
            {...formFields,passwordStrength: strength});
           Store.addNotification({
            container: "top-right",
            message: "Secret Added Successfully.",
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
                    Add Secret
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
                                       />
                            </div>
                        </div>

                        <div className="sm:col-span-11">
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                                Password</label>
                            <div className="mt-1">
                                <input id="password" name="password" type="password" autoComplete="email"
                                       className="block w-full rounded-md border-0 py-1.5 px-3
                                       text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                                       placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                                       focus:ring-indigo-600 sm:text-sm sm:leading-6
                                       dark:text-white bg-white/0"
                                       onChange={handleChange}
                                       />
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

export default NewEntry;
