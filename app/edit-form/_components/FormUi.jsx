import React, { useRef, useState } from "react";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Checkbox } from "../../../components/ui/checkbox";
import FieldEdit from "../_components/FieldEdit";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { userResponses, JsonForms } from "../../../configs/schema"; // Import JsonForms schema
import { db } from "../../../configs/index";
import { toast } from "sonner";
import moment from "moment";
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "../../../components/ui/button";

const FormUi = ({
  jsonForm,
  selectedTheme,
  selectedStyle,
  onFieldUpdate,
  deleteField,
  editable = true,
  formId = 0,
  enabledSignIn = false,
}) => {
  const { user, isSignedIn } = useUser();
  const [formData, setFormData] = useState({});
  let formRef = useRef();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (fieldName, itemName, value) => {
    const list = formData?.[fieldName] || [];

    if (value) {
      list.push({ label: itemName, value });
    } else {
      const result = list.filter((item) => item.label !== itemName);
      setFormData({ ...formData, [fieldName]: result });
    }
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData);
    console.log(formId);

    const result = await db.insert(userResponses).values({
      jsonResponse: formData,
      createdAt: moment().format("DD/MM/yyy"),
      formRef: formId,
    });
    console.log(typeof formId);

    if (result) {
      formRef.reset();
      toast("Response Submitted Successfully !");
    } else {
      toast("Error while saving your form !");
    }
  };

  return (
    <form
      ref={(e) => (formRef = e)}
      onSubmit={onFormSubmit}
      className="border rounded-md p-5 md:w-[720px]"
      data-theme={selectedTheme}
      style={{
        boxShadow: selectedStyle?.key === "boxshadow" && "5px 5px 0px black",
        border: selectedStyle?.key === "border" && selectedStyle.value,
      }}
    >
      <h2 className="font-bold text-center text-2xl">{jsonForm?.formTitle}</h2>
      <h3 className="text-sm text-gray-500 mb-5 text-center">
        {jsonForm?.formHeading}
      </h3>

      {jsonForm?.fields?.map((field, index) => (
        <div key={index} className="flex items-center gap-2">
          {field?.fieldType === "select" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field.label}</label>
              <Select
                required={field?.required}
                onValueChange={(v) => handleSelectChange(field.fieldName, v)}
              >
                <SelectTrigger className="w-full bg-transparent">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field?.options?.map((item, index) => (
                    <SelectItem key={index} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : field.fieldType === "radio" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field.label}</label>
              <RadioGroup required={field?.required}>
                {field?.options?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <RadioGroupItem
                      value={item.label}
                      id={item.label}
                      onClick={() =>
                        handleSelectChange(field.fieldName, item.label)
                      }
                    />
                    <Label htmlFor={item.label}>{item.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ) : field.fieldType === "checkbox" ? (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              {field?.options ? (
                field?.options?.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Checkbox
                      onCheckedChange={(v) =>
                        handleCheckboxChange(field?.label, item.label, v)
                      }
                    />
                    <h2>{item.label}</h2>
                  </div>
                ))
              ) : (
                <div className="flex gap-2 items-center">
                        <Checkbox required={field.required} />
                  <h2>{field.label}</h2>
                </div>
              )}
            </div>
          ) : (
            <div className="my-3 w-full">
              <label className="text-xs text-gray-500">{field?.label}</label>
              <Input
                className="bg-transparent"
                type={field?.fieldType}
                placeholder={field?.placeholder}
                name={field?.fieldName}
                required={field?.required}
                onChange={handleInputChange}
              />
            </div>
          )}

          {editable && (
            <div>
              <FieldEdit
                defaultValue={field}
                onUpdate={(value) => onFieldUpdate(value, index)}
                deleteField={() => deleteField(index)}
              />
            </div>
          )}
        </div>
      ))}

      {!enabledSignIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : isSignedIn ? (
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      ) : (
        <Button>
          <SignInButton mode="modal">Sign in before Submit</SignInButton>
        </Button>
      )}
    </form>
  );
};

export default FormUi;
