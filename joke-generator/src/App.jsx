import React, { useState, useEffect } from "react";
import JokeDisplay from "./components/JokeDisplay";
import CreateJokeForm from "./components/CreateJokeForm";
import UserJokes from "./components/UserJokes";
import CameraCapture from "./components/CameraCapture";
import { getCapturedPhotos } from "./src/db"; // Ensure db functions are imported
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

  // 5️⃣ State for managing captured images
  const [capturedPhotos, setCapturedPhotos] = useState([]); // Store captured images

  // 6️⃣ Save jokes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("userJokes", JSON.stringify(userJokes));
  }, [userJokes]);

  // Load captured photos from IndexedDB
  useEffect(() => {
    const loadCapturedPhotos = async () => {
      const photos = await getCapturedPhotos(); // Fetch photos from IndexedDB
      setCapturedPhotos(photos); // Update state
    };

    loadCapturedPhotos();
  }, []); // Empty dependency array means it runs once on mount

  // 7️⃣ Retrieve User's Location
  const geoFindMe = () => {
    if (!navigator.geolocation) {
      setUserLocation("Geolocation is not supported!");
    } else {
      setUserLocation("Locating...");
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  // Success callback when geolocation is retrieved
  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(latitude, longitude);

    setUserLocation({
      latitude: latitude,
      longitude: longitude,
    });
  };

  // Error callback if geolocation fails
  const error = () => {
    setUserLocation("Unable to retrieve your location");
  };

  // 8️⃣ Function to add a new joke
  const addJoke = (newJoke) => {
    const newJokeWithUser = { ...newJoke, username: user };
    setUserJokes([...userJokes, newJokeWithUser]);
  };

  // 9️⃣ Function to delete a joke
  const deleteJoke = (index) => {
    const updatedUserJokes = userJokes.filter((_, i) => i !== index);
    setUserJokes(updatedUserJokes);
  };

  // 🔟 Function to set joke for editing
  const startEditingJoke = (index) => {
    setEditingJoke({ index, ...userJokes[index] });
  };

  // 1️⃣1️⃣ Function to update the joke
  const updateJoke = (updatedJoke) => {
    const updatedJokes = userJokes.map((joke, i) =>
      i === editingJoke.index ? updatedJoke : joke
    );
    setUserJokes(updatedJokes);
    setEditingJoke(null); // Clear editing state
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user}!</h2>

      {/* Joke Display and Navigation */}
      <JokeDisplay joke={userJokes[currentIndex]} showAnswer={showAnswer} />

      {/* Joke Navigation Buttons */}
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

      {/* Create or Edit Joke Form */}
      {editingJoke ? (
        <CreateJokeForm addJoke={updateJoke} initialJoke={editingJoke} isEditing={true} />
      ) : (
        <CreateJokeForm addJoke={addJoke} />
      )}

      {/* User Jokes List (Includes Edit Button) */}
      <UserJokes jokes={userJokes} deleteJoke={deleteJoke} startEditingJoke={startEditingJoke} />

      {/* Location Display */}
      <button onClick={geoFindMe}>Show my location</button>
      {userLocation && typeof userLocation === 'object' ? (
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
        <p>{userLocation}</p> // Shows error or "Locating..." message
      )}

      {/* Camera Capture Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Capture an Image</h3>
        <CameraCapture />
      </div>

      {/* Display Captured Photos */}
      <div className="mt-6">
        <h3>Captured Photos</h3>
        <div className="flex flex-wrap gap-4">
          {capturedPhotos.map((photo, index) => (
            <div key={index} className="w-32 h-32">
              <img
                src={photo.imageData}
                alt={`Captured ${index}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
