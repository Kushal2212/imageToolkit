import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import {connectToDatabase }from "@/lib/dbConfig";
import Video from "@/models/video.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid video ID",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const video = await Video.findById(id).lean();

    if (!video) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(video);
  } catch (error) {
    console.error("Get video error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch video",
      },
      { status: 500 }
    );
  }
}