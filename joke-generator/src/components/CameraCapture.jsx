// CameraCapture.jsx
import React, { useState } from "react";
import { addPhoto } from "./src/db.jsx"; // Import the addPhoto function

const CameraCapture = () => {
  const [image, setImage] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);

  const handleCaptureImage = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement("video");
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);

      const imageData = canvas.toDataURL("image/png");
      setImage(imageData);

      // Save the captured image to IndexedDB
      await addPhoto(imageData);

      // Optionally, update the captured photos list
      const photos = await getCapturedPhotos();
      setCapturedPhotos(photos);

      // Stop the video stream
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  return (
    <div className="mt-4 text-center">
      <h1>Camera Capture</h1>

      {/* Display the captured image */}
      {image && <img src={image} alt="Captured" className="w-64 h-64 object-cover rounded-full" />}

      {/* Button to trigger image capture */}
      <button className="mt-4 px-6 py-2 bg-red-600 text-black rounded-lg" onClick={handleCaptureImage}>
        Capture Image
      </button>

      {/* Display a list of all captured photos */}
      <div className="mt-4">
        <h2>Captured Photos</h2>
        <ul>
          {capturedPhotos.map((photo, index) => (
            <li key={index}>
              <img src={photo.imageData} alt={`Captured ${index}`} className="w-32 h-32 object-cover rounded-full" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CameraCapture;
