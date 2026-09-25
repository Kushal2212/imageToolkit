import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/dbConfig";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }
    await connectToDatabase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    await User.create({
      email,
      password,
    });

    return NextResponse.json(
      { message: "User register Successfully" },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
        {error:"Failed to register user"},
        {status:500}
    )
  }
}
