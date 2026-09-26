import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  });

  try {
    return Response.json({
      token,
      expire,
      signature,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "ImageKit Auth Failed" },
      { status: 500 },
    );
  }
}
