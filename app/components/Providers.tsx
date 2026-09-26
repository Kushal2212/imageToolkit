"use client"
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./Notification";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ImageKitProvider
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
      >
        <NotificationProvider>

        {children}
        </NotificationProvider>
      </ImageKitProvider>
    </SessionProvider>
  );
}
