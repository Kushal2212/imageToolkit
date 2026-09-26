"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { NextResponse } from "next/server";
import React from "react";

function Header() {
  const { data: session } = useSession();

  const handleSignOUt = async () => {
    try {
      await signOut();
      return NextResponse.json(
        { message: "User Successfully Signout" },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json({ error: "Failed To Signout" }, { status: 500 });
    }
  };
  return (
    <>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div className="flex justify-end items-center ">
           <button type="button" className="btn btn-secondary flex ">
            <Link href={"/login"}>Login</Link>
           </button>
          

          <button type="button" className="btn btn-primary flex ml-3">
            <Link href={"/register"}>Register</Link>
          </button>
          <button onClick={handleSignOUt} type="button" className="btn btn-error flex  ml-3 ">Signout</button>
        </div>
      )}
    </>
  );
}

export default Header;
