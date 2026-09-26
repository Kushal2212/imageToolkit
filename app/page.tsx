"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { IVideo } from "@/models/video.model";
import VideoFeed from "@/app/components/VideoFeed";
import Header from "./components/Header/Header";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();

        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div>Loading videos...</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Latest Videos
      </h1>
      <Header/>
      <VideoFeed videos={videos} />
    </main>
  );
}