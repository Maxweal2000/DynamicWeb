import React, { useState, useEffect } from "react";
import JokeDisplay from "./components/JokeDisplay";
import CreateJokeForm from "./components/CreateJokeForm";
import UserJokes from "./components/UserJokes";
import CameraCapture from "./components/CameraCapture";
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
   // define the function that finds the users geolocation
  const geoFindMe = () => {
    if (navigator.geolocation) {
      // get the current users location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          // update the value of userlocation variable
          setUserLocation({ latitude, longitude });
        },
        // if there was an error getting the users location
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
    // if geolocation is not supported by the users browser
    else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  

  // 7️⃣ Function to add a new joke
  const addJoke = (newJoke) => {
    const newJokeWithUser = { ...newJoke, username: user };
    setUserJokes([...userJokes, newJokeWithUser]);
  };

  // 8️⃣ Function to delete a joke
  const deleteJoke = (index) => {
    const updatedUserJokes = userJokes.filter((_, i) => i !== index);
    setUserJokes(updatedUserJokes);
  };

  // 9️⃣ Function to set joke for editing
  const startEditingJoke = (index) => {
    setEditingJoke({ index, ...userJokes[index] });
  };

  // 🔟 Function to update the joke
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

      {/* 14️⃣ User Jokes List (Includes Edit Button) */}
      <UserJokes jokes={userJokes} deleteJoke={deleteJoke} startEditingJoke={startEditingJoke} />

      {/* 15️⃣ Location Display */}
      <button onClick={geoFindMe}>Show my location</button>
       {userLocation && (
         <div>
          <h2>Current location</h2>
          <p>Latitude: {userLocation.latitude}</p>
          <p>Longitude: {userLocation.longitude}</p>
        </div>
       )}

      {/* 16️⃣ Camera Capture */}
      <CameraCapture />
    </div>
  );
};

export default App;
