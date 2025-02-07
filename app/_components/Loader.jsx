import { LucideLoader } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="w-full p-10 flex items-center justify-center">
      <div className="h-[200px] w-[200px] flex flex-col items-center justify-center gap-4 p-10 text-center">
        <LucideLoader className="animate-spin text-primary h-6 w-6" />
        <p>Wait... Loading your data</p>
      </div>
    </div>
  );
};

export default Loader;
