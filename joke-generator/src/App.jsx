import React, { useState, useEffect } from "react";
import JokeDisplay from "./components/JokeDisplay";
import CreateJokeForm from "./components/CreateJokeForm";
import UserJokes from "./components/UserJokes";
import CameraCapture from "./components/CameraCapture";
import { useAllPhotos, db } from "./db";  // 🆕 Import Dexie hooks and db
import "./styles.css";

const App = () => {
  // 1️⃣ State for managing user and jokes
  const [user] = useState("user1"); // Default user
  const [userJokes, setUserJokes] = useState(() => {
    const savedJokes = localStorage.getItem("userJokes");
    return savedJokes ? JSON.parse(savedJokes) : [];
  });

  // 2️⃣ State for controlling joke display
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // 3️⃣ State for editing jokes
  const [editingJoke, setEditingJoke] = useState(null); // Tracks the joke being edited

  // 4️⃣ State for location tracking
  const [userLocation, setUserLocation] = useState(null);

  // 5️⃣ Save jokes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userJokes", JSON.stringify(userJokes));
  }, [userJokes]);

  // 6️⃣ Retrieve User's Location
  const geoFindMe = () => {
    if (!navigator.geolocation) {
      setUserLocation("Geolocation is not supported!");
    } else {
      setUserLocation("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);

    setUserLocation({
      latitude: latitude,
      longitude: longitude,
    });
  };

  const error = () => {
    setUserLocation("Unable to retrieve your location");
  };

  // 7️⃣ Add, delete, and update jokes
  const addJoke = (newJoke) => {
    const newJokeWithUser = { ...newJoke, username: user };
    setUserJokes([...userJokes, newJokeWithUser]);
  };

  const deleteJoke = (index) => {
    const updatedUserJokes = userJokes.filter((_, i) => i !== index);
    setUserJokes(updatedUserJokes);
  };

  const startEditingJoke = (index) => {
    setEditingJoke({ index, ...userJokes[index] });
  };

  const updateJoke = (updatedJoke) => {
    const updatedJokes = userJokes.map((joke, i) =>
      i === editingJoke.index ? updatedJoke : joke
    );
    setUserJokes(updatedJokes);
    setEditingJoke(null);
  };

  // 🆕 State for managing photos
  const photos = useAllPhotos();

  // 🆕 Function to delete a photo
  const deletePhoto = async (id) => {
    await db.photos.delete(id);  // Remove from IndexedDB
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user}!</h2>

      {/* 11️⃣ Joke Display Component */}
      <JokeDisplay joke={userJokes[currentIndex]} showAnswer={showAnswer} />

      {/* 12️⃣ Joke Navigation Buttons */}
      <div className="mt-4 flex gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => setCurrentIndex((prev) => (prev + 1) % userJokes.length)}
        >
          Next Joke
        </button>
        <button
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>

      {/* 13️⃣ Create or Edit Joke Form */}
      {editingJoke ? (
        <CreateJokeForm addJoke={updateJoke} initialJoke={editingJoke} isEditing={true} />
      ) : (
        <CreateJokeForm addJoke={addJoke} />
      )}

      {/* 14️⃣ User Jokes List */}
      <UserJokes jokes={userJokes} deleteJoke={deleteJoke} startEditingJoke={startEditingJoke} />

      {/* 15️⃣ Location Display */}
      <button onClick={geoFindMe}>Show my location</button>
      {userLocation && typeof userLocation === "object" ? (
        <div>
          <h2>Current location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
          <a
            href={`https://www.openstreetmap.org/#map=18/${userLocation.latitude}/${userLocation.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500"
          >
            View on Map
          </a>
        </div>
      ) : (
        <p>{userLocation}</p>
      )}

      {/* 16️⃣ Camera Capture */}
      <CameraCapture />

      {/* 🆕 17️⃣ Photo Gallery */}
      <h2 className="text-xl font-bold mt-8">Captured Photos</h2>
      {photos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative border rounded-lg shadow-lg overflow-hidden">
              <img
                src={photo.imgSrc}
                alt={`Captured on ${new Date(photo.timestamp).toLocaleString()}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-2">
                <p className="text-sm text-gray-600">
                  {new Date(photo.timestamp).toLocaleString()}
                </p>
                <button
                  className="mt-2 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => deletePhoto(photo.id)}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 mt-4">No photos captured yet.</p>
      )}
    </div>
  );
};

export default App;
