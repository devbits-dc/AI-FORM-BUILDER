"use client"

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  useEffect(() => {
    console.log(path)
  })



  return !path.includes('aiform')&&(
    <div className="p-5 border-b shadow-sm">
      <div className="flex justify-between items-center">
        <img src={"/logo.svg"} alt="logo" width={180} height={50} />
        {isSignedIn ? (
          <div className="flex items-center gap-5">
            <Link href={'/dashboard'}>
             
                <Button variant="outline">Dashboard</Button>
              
            </Link>
            <UserButton />
          </div>
        ) : (
          <SignInButton>
            <Button>Get Started</Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
};

export default Header;
