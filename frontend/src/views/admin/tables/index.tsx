import ComplexTable from "./components/ComplexTable";
import { useEffect } from 'react';
import { useState } from 'react';
import { getSecrets } from "../../../redux/password/apiCalls";
import { useDispatch, useSelector } from "react-redux";

const Tables = () => {
  const {currentUser} = useSelector((state:any) => state.user);
  const [data,setData] = useState<any[]>([{
  }])
  const controller = new AbortController()
  const dispatch = useDispatch();
  useEffect(()=>{
    const listSecretsDetails = async() => {
      try{
        const response = await getSecrets(dispatch,currentUser.token,controller.signal)
        setData(response.data.data)
        controller.abort()
      } catch(e){
        console.log(e)
      }
    }
    listSecretsDetails()
  },[]);

  const removeData = (identifierName: string) => {
    setData(data.filter((item: any)=>{
        return item.identifierName != identifierName;
    }))
  }
  return (
    <div>
      <div className="mt-6 w-full h-full">
        <ComplexTable tableData={data} removeDataHandler={removeData}/>
      </div>
    </div>
  );
};

export default Tables;
