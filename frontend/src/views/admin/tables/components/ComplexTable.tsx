import React, { useEffect, useState } from "react";
import Card from "../../../../components/card";
import { Store } from 'react-notifications-component';
import RingLoader from "react-spinners/RingLoader";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { BsEye } from "react-icons/bs";
import {  RiDeleteBin2Line } from "react-icons/ri";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { deleteSecret } from "../../../../redux/password/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type RowObj = {
  identifierName: string;
  url: string;
  CreatedAt: string;
  UpdatedAt: string;
  passwordStrength: string;
  action: string;
  ID: number;
};

const columnHelper = createColumnHelper<RowObj>();

// const columns = columnsDataCheck;
export default function ComplexTable(props: { tableData: any, removeDataHandler: any }) {
  
  const {currentUser} = useSelector((state:any) => state.user);
  const { tableData } = props;
  const {removeDataHandler} = props
  const [sorting, setSorting] = React.useState<SortingState>([]);
  let defaultData = tableData;
  const dispatch = useDispatch();
  const columns = [
    columnHelper.accessor("identifierName", {
      id: "identifierName",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">IDENTIFIER NAME</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("url", {
      id: "url",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          URL
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("CreatedAt", {
      id: "CreatedAt",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">CREATED AT</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("UpdatedAt", {
      id: "UpdatedAt",
      header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">UPDATED AT</p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
      ),
    }),
    columnHelper.accessor("passwordStrength", {
      id: "passwordStrength",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          PASSWORD STRENGTH
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          {info.getValue()}
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  const [isloading,setIsLoading] = useState(false);
  let data = defaultData
  const navigate = useNavigate();
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  const confirmDelete =(identifierName:string)=>{
      deleteSecret(dispatch,currentUser.token,identifierName).then(()=>{
        Store.addNotification({
          container: "top-right",
          message: "Deleted Successfully.",
          type:"success",
          dismiss: {
            duration: 3000 
          }
          })
          removeDataHandler(identifierName);
      }).catch((e:any)=>{
            Store.addNotification({
                container: "top-right",
                title: e.response.data.description,
                message: JSON.stringify(e.response.data.error),
                type:"danger",
                dismiss: {
                  duration: 6000 
                }}
                )   
      })
  }

  const deleteHandler = (row:any)=>{
    const identifierName = row.getAllCells()[0].getValue()
    confirmAlert({
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => confirmDelete(identifierName)
        },
        {
          label: 'No',
        }
      ]
    });
  }

  const editHandler = (row: any) =>{
    const identifierName = row.getAllCells()[0].getValue()
    navigate("/admin/edit-detail",{
      state: {identifierName}
    });
  }


  return (
    (isloading ?
      <div className="absolute top-[50%] left-[43%] sm:left-[55%]">
      <RingLoader color="#4318FF"/>
      </div>
      :
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Passwords List
        </div>
      </div>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    </th>
                  );
                })}
                <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                  ACTION
                  </div>
                </th>
              </tr>
            ))}
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                    <td className="flex gap-2 items-center py-6">
                      <FiEdit onClick={()=>editHandler(row)} className="text-green-500 me-1 dark:text-green-300 cursor-pointer" />
                      <RiDeleteBin2Line onClick={()=>deleteHandler(row)} className="text-red-400 me-1 dark:text-red-300 cursor-pointer" />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </Card>)
  );
}
