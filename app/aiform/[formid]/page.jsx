"use client"
import { and, eq } from "drizzle-orm";
import React, { useEffect,useState } from 'react'
import { JsonForms } from '../../../configs/schema'
import { db } from "../../../configs";
import FormUi from "../../edit-form/_components/FormUi";
import Image from "next/image";
import Link from "next/link";


const LiveAiForm = ({ params }) => {
  const [record, setRecord] = useState();
  const [jsonForm, setJsonForm] = useState([]);

  useEffect(() => {
    console.log(params);
    params && GetFormData();
  }, [params]);

  const GetFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(params?.formid)));

    setRecord(result[0]);
    setJsonForm(JSON.parse(result[0].jsonform));
    console.log(result);
  };

  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{
        backgroundImage: record?.background,
      }}
    >
      {record && (
        <div className="my-10">
          <FormUi
            jsonForm={jsonForm}
            onFieldUpdate={() => console.log()}
            deleteField={() => console.log()}
            selectedStyle={JSON.parse(record.style)}
            selectedTheme={record?.theme}
            editable={false}
            formId={record?.id}
          />
        </div>
      )}

      {/* AI Badge */}
      <Link
        className="flex gap-2 items-center
         bg-black text-white px-3 py-1 rounded-full
         fixed bottom-5 left-5 cursor-pointer 
         "
        href={"/"}
      >
        <Image src={"/badge-logo.png"} width={26} height={26} />
        Build your Own AI form
      </Link>
    </div>
  );
};

export default LiveAiForm
