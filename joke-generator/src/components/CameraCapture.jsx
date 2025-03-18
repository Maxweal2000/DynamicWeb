import React, { useState } from "react";
import { addPhoto, deletePhoto, usePhotos } from "../db"; // Import usePhotos

const CameraCapture = () => {
  const [viewMode, setViewMode] = useState(false); // Toggle between capture and view modes
  const [notification, setNotification] = useState(""); // Notification message

  // Use useLiveQuery to fetch photos reactively
  const savedImages = usePhotos() || [];

  // Handle capturing an image
  const handleCaptureImage = async () => {
    try {
      console.log("Attempting to capture image...");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/png");
      console.log("Image captured successfully:", imageData);

      // Save the captured image to Dexie database
      await addPhoto(imageData);

      // Show notification
      setNotification("Photo has been taken and saved!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds

      stream.getTracks().forEach((track) => track.stop()); // Stop the camera stream
      console.log("Camera stream stopped.");
    } catch (error) {
      console.error("Camera access denied:", error);
      setNotification("Failed to capture photo. Please try again.");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  // Handle deleting an image
  const handleDeleteImage = async (id) => {
    try {
      console.log(`Attempting to delete photo with id: ${id}...`);
      // Delete the image from the Dexie database
      await deletePhoto(id);

      // Show notification
      setNotification("Photo has been deleted!");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    } catch (error) {
      console.error("Error deleting image:", error);
      setNotification("Failed to delete photo. Please try again.");
      setTimeout(() => setNotification(""), 3000); // Clear notification after 3 seconds
    }
  };

  // Toggle between capture and view modes
  const toggleViewMode = () => {
    console.log(`Toggling view mode. Current mode: ${viewMode ? "View" : "Capture"}`);
    setViewMode(!viewMode);
  };

  return (
    <div className="mt-4 text-center">
      {/* Notification */}
      {notification && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {notification}
        </div>
      )}

      {/* Capture Mode */}
      {!viewMode && (
        <div>
          <button
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
            onClick={handleCaptureImage}
          >
            Take Photo
          </button>
        </div>
      )}

      {/* View Mode */}
      {viewMode && (
        <div>
          <h2 className="text-xl font-bold mb-4">Saved Photos</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {savedImages.map((photo) => (
              <div key={photo.id} className="relative">
                <img
                  src={photo.imageData}
                  alt={`Saved ${photo.id}`}
                  className="w-32 h-32 object-cover rounded-lg"
                />
                {/* Delete Button */}
                <button
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleDeleteImage(photo.id)}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg"
        onClick={toggleViewMode}
      >
        {viewMode ? "Take Photo" : "View Photos"}
      </button>
    </div>
  );
};

export default CameraCapture;