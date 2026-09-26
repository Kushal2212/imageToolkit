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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const authenticator = async () => {
    const response = await fetch("/api/upload-auth");

    if (!response.ok) {
      throw new Error("Failed to authenticate upload");
    }

    return await response.json();
  };

  const handleUpload = async () => {
    const fileInput = fileInputRef.current;

    if (!fileInput?.files?.length) {
      alert("Please select a video");
      return;
    }

    const file = fileInput.files[0];

    // Validate type
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file");
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

      const {
        signature,
        expire,
        token,
        publicKey,
      } = await authenticator();

      const abortController = new AbortController();

      abortControllerRef.current = abortController;

      const uploadResponse = await upload({
        expire,
        token,
        signature,
        publicKey,
        file,
        fileName: file.name,

        onProgress: (event) => {
          const percentage =
            (event.loaded / event.total) * 100;

          setProgress(Math.round(percentage));
        },

        abortSignal: abortController.signal,
      });

      console.log("ImageKit response:", uploadResponse);

      // Later:
      // send uploadResponse to your database API

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
    <div>
      <input
        type="file"
        ref={fileInputRef}
        accept="video/*"
      />

      <button
        type="button"
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload video"}
      </button>

      {uploading && (
        <>
          <progress
            value={progress}
            max={100}
          />

          <p>{progress}%</p>

          <button
            type="button"
            onClick={cancelUpload}
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
};

export default UploadFiles;