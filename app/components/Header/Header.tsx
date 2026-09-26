"use client"

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
      <button onClick={handleSignOUt}>Signout</button>
      {session ? (
        <div>Welcome</div>
      ) : (
        <div>
          <Link href={"/login"}>Login</Link>
          <Link href={"/register"}>Register</Link>
        </div>
      )}
    </>
  );
}

export default Header;
