import React from "react";
import CreateForm from "../dashboard/_components/CreateForm";
import FormList from "../dashboard/_components/FormList"
const page = () => {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl flex items-center justify-between">
        Dashboard
        <CreateForm />
      </h2> 
      {/* List of Forms */}
      <FormList/>
    </div>
  );
};

export default page;
