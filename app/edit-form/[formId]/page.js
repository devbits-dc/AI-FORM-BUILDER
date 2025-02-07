"use client";

import { Button } from "../../../components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../configs";
import { JsonForms } from "../../../configs/schema";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, Share2, SquareArrowOutUpRight } from "lucide-react";
import { toast } from "sonner";
import FormUi from "../_components/FormUi";
import Controller from "../_components/Controller";
import Link from "next/link";
import { RWebShare } from "react-web-share";

const EditForm = () => {
  const params = useParams();
  const { user } = useUser();
  const router = useRouter();
  const [jsonForm, setJsonForm] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState();
  const [record, setRecord] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [selectedBackground, setSelectedBackground] = useState("light");
  const [selectedStyle, setSelectedStyle] = useState("light");

  useEffect(() => {
    if (user && params?.formId) {
      GetFormData();
    }
  }, [user, params]);

  const GetFormData = async () => {
    try {
      const result = await db
        .select()
        .from(JsonForms)
        .where(
          and(
            eq(JsonForms.id, params?.formId),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        );

      if (result.length > 0) {
        setRecord(result[0]);
        const cleanedJson = result[0].jsonform
          .trim()
          .replace(/^```json|```$/g, "");
        setJsonForm(JSON.parse(cleanedJson));
        setSelectedBackground(result[0].background);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      toast.error("Failed to load form data. Please check the JSON format.");
    }
  };

  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm);
      updateJsonFormInDb();
    }
  }, [updateTrigger]);

  const onFieldUpdate = (value, index) => {
    jsonForm.fields[index].label = value.label;
    jsonForm.fields[index].placeholder = value.placeholder;
    setUpdateTrigger(Date.now());
  };

  const updateJsonFormInDb = async () => {
    await db
      .update(JsonForms)
      .set({ jsonform: jsonForm })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      )
      .returning({ id: JsonForms.id });
    toast("Updated your form!");
  };

  const deleteField = (indexToRemove) => {
    jsonForm.fields = jsonForm.fields.filter(
      (_, index) => index !== indexToRemove
    );
    setUpdateTrigger(Date.now());
    toast("Deleted successfully");
  };

  const updateControllerFields = async (value, columnName) => {
    await db
      .update(JsonForms)
      .set({ [columnName]: value })
      .where(
        and(
          eq(JsonForms.id, record.id),
          eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
        )
      )
      .returning({ id: JsonForms.id });
    toast("Updated database!");
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
        <h2
          className="flex gap-2 items-center my-5 cursor-pointer hover:font-bold"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back
        </h2>
        <div className="flex gap-2 ">
          <Link href={"/aiform/" + record?.id} target="_blank">
            <Button className="flex gap-2">
              <SquareArrowOutUpRight className="h-5 w-5" /> Live Preview
            </Button>
          </Link>
          <RWebShare
            data={{
              text:
                jsonForm?.formSubheading +
                ", Build your form in secondes with AI form Builder",
              url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
              title: jsonForm?.formTitle,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <Button className="bg-green-500 flex gap-2 hover:bg-green-700">
              <Share2 /> Share
            </Button>
          </RWebShare>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 border rounded-lg shadow-md">
          <Controller
            selectedTheme={(value) => {
              updateControllerFields(value, "theme");
              setSelectedTheme(value);
            }}
            selectedBackground={(value) => {
              updateControllerFields(value, "background");
              setSelectedBackground(value);
            }}
            selectedStyle={(value) => {
              updateControllerFields(value, "style");
              setSelectedStyle(value);
            }}
          />
        </div>
        <div
          className="md:col-span-2 border rounded-lg p-5 flex items-center justify-center "
          style={{ backgroundImage: selectedBackground }}
        >
          <FormUi
            jsonForm={jsonForm}
            onFieldUpdate={onFieldUpdate}
            deleteField={deleteField}
            selectedTheme={selectedTheme}
            selectedBackground={selectedBackground}
            selectedStyle={selectedStyle}
            formId={params?.formId}
          />
        </div>
      </div>
    </div>
  );
};

export default EditForm;
