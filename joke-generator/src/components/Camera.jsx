import React, { useState } from 'react';

const Camera = () => {
  const [image, setImage] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    document.body.appendChild(videoElement);
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    const videoElement = document.querySelector("video");
    ctx.drawImage(videoElement, 0, 0, 400, 300);
    setImage(canvas.toDataURL("image/png"));
  };

  return (
    <div>
      <button onClick={startCamera}>Start Camera</button>
      <button onClick={captureImage}>Capture Selfie</button>
      {image && <img src={image} alt="Captured" />}
    </div>
  );
};

export default Camera;
