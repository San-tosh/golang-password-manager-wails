import DataTables from "./views/admin/tables"
import NewEntry from "./views/admin/NewEntry"
import {
  MdHome,MdAdd
} from "react-icons/md";
import EditDetail from "./views/admin/EditDetail";

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
    name: "Edit Detail",
    layout: "/admin",
    icon: <MdAdd className="h-6 w-6" />,
    path: "edit-detail",
    component: <EditDetail />,
  },
];
export default routesAdmin;

