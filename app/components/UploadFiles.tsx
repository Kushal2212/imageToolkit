"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";

import { useRef, useState } from "react";

const UploadFiles = () => {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const authenticator = async () => {
    const response = await fetch("/api/upload-auth",{
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate upload");
    }

    return await response.json();
  };

  const handleUpload = async () => {
    if (!video) {
      alert("Please select a video");
      return;
    }

    const file = video;

    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title");
      return;
    }

    // Validate size
    const maxSize = 500 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Video must be smaller than 500 MB");
      return;
    }

    try {
      setUploading(true);
      setProgress(0);

      const abortController = new AbortController();

      abortControllerRef.current = abortController;

      const videoAuth = await authenticator();

      const uploadResponse = await upload({
        ...videoAuth,
        file,
        fileName: file.name,

        onProgress: (event) => {
          const percentage = (event.loaded / event.total) * 100;

          setProgress(Math.round(percentage));
        },

        abortSignal: abortController.signal,
      });

      // console.log("ImageKit response:", uploadResponse);

      if (!thumbnail) {
        alert("Please select a thumbnail");
        return;
      }

      const thumbnailAuth = await authenticator();

      const thumbnailResponse = await upload({
        ...thumbnailAuth,
        file: thumbnail,
        fileName: thumbnail.name,
      });

      // console.log("Thumbnail uploaded:", thumbnailResponse);

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          videoUrl: uploadResponse.url,
          thumbnailUrl: thumbnailResponse.url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save video");
      }

      const data = await response.json();

      // console.log("Saved to MongoDB:", data);

      alert("Video uploaded successfully!");
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        console.error("Upload error:", error);
      }
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          {/* Header */}
          <h2 className="card-title text-2xl">Upload Video</h2>
          <p className="text-base-content/60 mb-4">
            Upload your video and provide some basic information.
          </p>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-medium">Video Title</span>
            </label>

            <input
              type="text"
              placeholder="Enter video title"
              className="input input-bordered w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>

            <textarea
              placeholder="Enter video description"
              className="textarea textarea-bordered h-32 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text font-medium">Video</span>
            </label>

            <input
              type="file"
              accept="video/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => {
                setVideo(e.target.files?.[0] || null);
              }}
            />

            {video && (
              <label className="label">
                <span className="label-text-alt">Selected: {video.name}</span>
              </label>
            )}
          </div>

          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text font-medium">Thumbnail</span>
            </label>

            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              onChange={(e) => {
                setThumbnail(e.target.files?.[0] || null);
              }}
            />

            {thumbnail && (
              <label className="label">
                <span className="label-text-alt">
                  Selected: {thumbnail.name}
                </span>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-primary flex-1"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? `Uploading ${progress}%` : "Upload Video"}
            </button>

            {uploading && (
              <button
                type="button"
                className="btn btn-error"
                onClick={cancelUpload}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
