"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../configs/index";
import { JsonForms } from "../../../configs/schema";
import { eq } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import FormListItemResp from "./_components/FormListItemResp";
import Loader from "../../_components/Loader";



const Responses = () => {
    const { user } = useUser();

    // get all forms
    const [formList, setFormList] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
      user && getFormList();
    }, [user]);

    const getFormList = async () => {
      setLoading(true);

      try {
        const result = await db
          .select()
          .from(JsonForms)
          .where(
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          );

        setFormList(result);
        console.log("Form List:", result); // Debugging output
      } catch (error) {
        console.error("Error fetching form list:", error);
      }

      setLoading(false);
    };


    return (
      <div className="p-6">
        <h2 className="font-bold text-3xl">Responses</h2>

        {loading ? (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        ) : formList.length === 0 ? (
          <div className="flex flex-col items-center justify-center col-span-2 lg:col-span-3 ">
            <img
              src="/empty.gif"
              alt="Illustration"
              className="w-64 h-64 mb-4"
            />
            <p className="font-semibold text-lg text-gray-900">No Responses</p>
          </div>
        ) : (
          <div className="my-5 grid grid-cols-2 gap-5 lg:grid-cols-3 ">
            {formList.map((form, index) => (
              <FormListItemResp
                formRecord={form}
                jsonForm={JSON.parse(form.jsonform)}
              />
            ))}
          </div>
        )}
      </div>
    );
}

export default Responses;