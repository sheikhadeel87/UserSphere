import React from "react";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";

function Users(props) {
  return (
    <div>
         
      <UserTable {...props} />
      <Pagination {...props} />
    </div>
  );
}
 export default Users;
