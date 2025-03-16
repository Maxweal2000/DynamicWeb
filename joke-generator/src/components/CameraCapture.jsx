import React, { useState } from "react";

const CameraCapture = () => {
  const [image, setImage] = useState(null);

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

      setImage(canvas.toDataURL("image/png"));
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Camera access denied:", error);
    }
  };

  return (
    <div className="mt-4 text-center">
      {image && <img src={image} alt="Captured" className="w-64 h-64 object-cover rounded-full" />}
      <button className="mt-4 px-6 py-2 bg-red-600 text-black rounded-lg" onClick={handleCaptureImage}>
        Capture Image
      </button>
    </div>
  );
};

export default CameraCapture;
