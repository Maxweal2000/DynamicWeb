import React, { useState, useEffect } from "react";
import db from "../db"; // Import Dexie database

const CameraCapture = () => {
  const [image, setImage] = useState(null);
  const [photos, setPhotos] = useState([]);

  // Load saved photos when the component mounts
  useEffect(() => {
    const loadPhotos = async () => {
      const savedPhotos = await db.photos.toArray();
      setPhotos(savedPhotos);
    };

    loadPhotos();
  }, []);

  // Handle photo capture
  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/png");

      // Save photo to IndexedDB
      const timestamp = new Date().toISOString();
      await db.photos.add({ timestamp, image: imageData });

      setImage(imageData);

      // Stop camera stream
      stream.getTracks().forEach((track) => track.stop());

      // Reload photos from the DB
      const savedPhotos = await db.photos.toArray();
      setPhotos(savedPhotos);
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  // Function to delete a photo
  const deletePhoto = async (id) => {
    await db.photos.delete(id);
    const savedPhotos = await db.photos.toArray();
    setPhotos(savedPhotos);
  };

  return (
    <div className="mt-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Camera Capture with IndexedDB</h1>

      {/* Camera capture section */}
      {image && (
        <div className="flex justify-center my-4">
          <img
            src={image}
            alt="Captured"
            className="w-64 h-64 object-cover rounded-lg shadow-lg"
          />
        </div>
      )}

      <button
        className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        onClick={handleCaptureImage}
      >
        📸 Capture Image
      </button>

      {/* Gallery section */}
      <h2 className="text-xl font-bold mt-8">Saved Photos</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.image}
                alt={`Captured on ${new Date(photo.timestamp).toLocaleString()}`}
                className="w-full h-auto rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-600 mt-1">
                {new Date(photo.timestamp).toLocaleString()}
              </p>
              <button
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => deletePhoto(photo.id)}
              >
                ❌ Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No saved photos.</p>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;

