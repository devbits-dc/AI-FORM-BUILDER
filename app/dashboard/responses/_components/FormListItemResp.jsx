import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { userResponses } from "../../../../configs/schema";
import { Loader2 } from "lucide-react";
import { db } from "../../../../configs/index";
import { eq } from "drizzle-orm";
import * as XLSX from "xlsx";

const FormListItemResp = ({ jsonForm, formRecord }) => {
    const [loading, setLoading] = useState(false);
    let jsonData = [];

    const ExportData = async () => {
      setLoading(true);
      const result = await db
        .select()
        .from(userResponses)
        .where(eq(userResponses.formRef, formRecord.id));

      console.log(result);

      if (result) {
        result.forEach((item) => {
          const jsonItem = JSON.parse(item.jsonResponse);
          jsonData.push(jsonItem);
        });
        setLoading(false);
      }

      console.log(jsonData);
      exportToExcel(jsonData);
    };

    // Convert JSON into EXCEL File to download it
    const exportToExcel = (jsonData) => {
      const worksheet = XLSX.utils.json_to_sheet(jsonData);
      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

      XLSX.writeFile(workbook, jsonForm?.formTitle + ".xlsx");
    };
    return (
      <div className="border shadow-sm rounded-lg p-4 my-5">
        <h2 className="text-lg text-black">{jsonForm?.formTitle}</h2>
        <h2 className="text-sm text-gray-500">{jsonForm?.formSubheading}</h2>
        <hr className="my-4" />
        <div className="flex justify-between items-center">
          <h2 className="text-sm">
            <strong>45</strong> Responses
          </h2>
          <Button
            className=""
            size="sm"
            onClick={() => ExportData()}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Export"}
          </Button>
        </div>
      </div>
    );
};

export default FormListItemResp;
