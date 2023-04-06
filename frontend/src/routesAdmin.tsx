import React from "react";

import DataTables from "./views/admin/tables"
import NewEntry from "./views/admin/NewEntry"
// Icon Imports
import {
  MdHome,MdAdd
} from "react-icons/md";
import ViewDetail from "./views/admin/ViewDetail";

const routesAdmin = [
  {
    name: "Home",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <DataTables />,
  },
  {
    name: "New Entry",
    layout: "/admin",
    icon: <MdAdd className="h-6 w-6" />,
    path: "new-entry",
    component: <NewEntry />,
  },
  {
    name: "View Detail",
    layout: "/admin",
    icon: <MdAdd className="h-6 w-6" />,
    path: "view-detail",
    component: <ViewDetail />,
  },
];
export default routesAdmin;

