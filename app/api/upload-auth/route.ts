import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("ImageKit Auth Error:", error);

    return NextResponse.json(
      {
        error: "ImageKit Auth Failed",
      },
      {
        status: 500,
      },
    );
  }
}