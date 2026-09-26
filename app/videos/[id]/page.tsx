"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/api-client";
import { IVideo } from "@/models/video.model";

export default function VideoPage() {
  const { id } = useParams<{ id: string }>();

  const [video, setVideo] = useState<IVideo | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const data = await apiClient.getAVideo(id);
        setVideo(data);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    if (id) {
      fetchVideo();
    }
  }, [id]);

  if (!video) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">
        {video.title}
      </h1>

      <p className="mt-4 text-base-content/70">
        {video.description}
      </p>
    </main>
  );
}