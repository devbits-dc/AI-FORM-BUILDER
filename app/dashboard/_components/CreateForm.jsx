"use client";
import { AiChatSession } from "../../../configs/AiModal";
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Textarea } from "../../../components/ui/textarea";
import { JsonForms } from "../../../configs/schema";
import moment from "moment";
import { db } from "../../../configs/index";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const PROMPT =
  ",On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle,FieldType, Placeholder, label , required fields, and checkbox and select field type options will be in array only and in JSON format";

const CreateForm = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState();
  const { user } = useUser();
  const route = useRouter();

  
  const onCreateFrom = async () => {
    setLoading(true);
    const result = await AiChatSession.sendMessage(
      "Description:" + userInput + PROMPT
    );
    const responseText = await result.response.text();

    // Extract JSON safely
    const jsonStart = responseText.indexOf("{");
    const jsonEnd = responseText.lastIndexOf("}");
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error("No JSON found in response");
      setLoading(false);
      return;
    }

    const jsonString = responseText.substring(jsonStart, jsonEnd + 1);
    console.log("dc",jsonString);
    try {
      const cleanedJson = JSON.parse(jsonString); // Ensure it's valid JSON
      // console.log("Extracted JSON:", cleanedJson);
      // Store in database
      const resp = await db
        .insert(JsonForms)
        .values({
          jsonform: JSON.stringify(cleanedJson),
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD/MM/YYYY"),
        })
        .returning({ id: JsonForms.id });

      console.log("New form ID:", resp[0]?.id);
      if (resp[0]?.id) {
        route.push("/edit-form/" + resp[0]?.id);
      }
    } catch (error) {
      console.error("Invalid JSON:", error);
    }

    setLoading(false);
    
  };

  return (
    <div>
      <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new form</DialogTitle>
          </DialogHeader>
          <div>
            <Textarea
              className="my-2"
              onChange={(event) => setUserInput(event.target.value)}
              placeholder="Write description of your form"
            />
            <div className="flex gap-2 my-3 justify-end">
              <Button
                onClick={() => setOpenDialog(false)}
                variant="destructive"
              >
                Cancel
              </Button>
              <Button disabled={loading} onClick={() => onCreateFrom()}>
                {loading ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateForm;
