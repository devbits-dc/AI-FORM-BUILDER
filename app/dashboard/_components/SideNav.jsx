"use client";
import Link from "next/link";
import { LibraryBig, LineChart, MessageSquare, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { Progress } from "../../../components/ui/progress";
import { db } from "../../../configs";
import {desc, eq } from "drizzle-orm";
import { JsonForms } from "../../../configs/schema";
import { useUser } from "@clerk/nextjs";

const SideNav = () => {
  const menuList = [
    {
      id: 1,
      name: "my form",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Responses",
      icon: MessageSquare,
      path: "/dashboard/responses",
    },
    {
      id: 3,
      name: "Analytics",
      icon: LineChart,
      path: "/dashboard/analytics",
    },
    {
      id: 4,
      name: "Upgrade",
      icon: Shield,
      path: "/dashboard/upgrade",
    },
  ];


  const { user } = useUser();
  const [formList, setFormList] = useState();
  const [percFileCreated, setPercFileCreated] = useState(0);

  const path = usePathname();
  useEffect(() => {
    user && GetFormList();
  }, [user]);

  const GetFormList = async () => {
    const result = await db.select().from(JsonForms)
      .where(
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
      ).orderBy(desc(JsonForms.id));

    setFormList(result);
    console.log(result);
    const perc = (result.length / 10) * 100;
    setPercFileCreated(perc);
  }
  return (
    <div className="h-screen shadow-md border">
      <div className="p-5">
        {menuList.map((menu, index) => {
          return (
            <Link
              href={menu.path}
              key={index}
              className={`text-sm  font-semibold flex items-center gap-3 px-4 py-2 mb-2 hover:bg-primary 
            hover:text-white rounded-lg 
            cursor-pointer text-gray-500
            ${path == menu.path && "bg-primary text-white"}
            `}
            >
              <menu.icon />
              {menu.name}
            </Link>
          );
        })}
      </div>
      <div className="flxed bottom-7 p-6 w-64">
        <Button className="w-full">+ Create Form</Button>
        <div className="my-7 ">
          <Progress value={percFileCreated} />
          <h2 className="text-sm mt-2 text-gray-600">
            <strong>{formList?.length}</strong> Out of <strong>10</strong> File
            Created
          </h2>
          <h2 className="text-sm mt-3 text-gray-600">
            Upgrade your plan for unlimted AI form build
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
