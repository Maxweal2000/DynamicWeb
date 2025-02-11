import React, { useState, useEffect } from "react";
import "./styles.css"; // Add your styles

const App = () => {
  const [user, setUser] = useState("user1"); // Default logged-in user
  const [userJokes, setUserJokes] = useState(() => {
    // Retrieve user jokes from localStorage on initial load
    const savedJokes = localStorage.getItem("userJokes");
    return savedJokes ? JSON.parse(savedJokes) : [];
  });
  const [currentIndex, setCurrentIndex] = useState(0); // Current joke index
  const [showAnswer, setShowAnswer] = useState(false); // To toggle showing the answer
  const [newJoke, setNewJoke] = useState({ question: "", answer: "" }); // For creating new jokes
  const [isCreating, setIsCreating] = useState(false); // To track if the user is creating a new joke

  // Geolocation State
  const [location, setLocation] = useState(null); // Store the user's location
  const [error, setError] = useState(null); // Store any error from Geolocation API

  // Camera State
  const [image, setImage] = useState(null); // Store the image captured from the camera

  // Update localStorage whenever the user jokes change
  useEffect(() => {
    if (userJokes.length > 0) {
      localStorage.setItem("userJokes", JSON.stringify(userJokes));
    }
  }, [userJokes]);

  // Get User's Location using Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  // Function to handle image capture from camera
  const handleCaptureImage = () => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const videoConstraints = { video: { facingMode: "user" } };

    navigator.mediaDevices
      .getUserMedia(videoConstraints)
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => console.log("Camera access denied:", err));

    // Capture the image once the video is ready
    video.onloadeddata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      setImage(canvas.toDataURL("image/png")); // Store captured image
      video.srcObject.getTracks().forEach((track) => track.stop()); // Stop the video stream after capture
    };
  };

  const nextCard = () => {
    setShowAnswer(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % userJokes.length);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const handleCreateJoke = () => {
    setIsCreating(true);
  };

  const handleSubmitJoke = () => {
    if (newJoke.question && newJoke.answer) {
      const newJokeWithUser = { ...newJoke, username: user };
      setUserJokes([...userJokes, newJokeWithUser]);
      setNewJoke({ question: "", answer: "" });
      setIsCreating(false);
      setCurrentIndex(userJokes.length); // Set the current index to the last added joke
    }
  };

  const handleDeleteJoke = (index) => {
    const updatedUserJokes = userJokes.filter(
      (_, jokeIndex) => jokeIndex !== index
    );
    setUserJokes(updatedUserJokes);
    if (index === currentIndex) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % updatedUserJokes.length);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-semibold mb-4">Welcome, {user}!</h2>

      {/* Display User-created Jokes */}
      {userJokes.length > 0 && (
        <div className="w-80 bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-800">
            {showAnswer
              ? userJokes[currentIndex].answer
              : userJokes[currentIndex].question}
          </h2>
        </div>
      )}

      {/* Display message if no jokes available */}
      {userJokes.length === 0 && (
        <div>No jokes available. Create your first joke!</div>
      )}

      {/* Buttons for next joke and show/hide answer */}
      <div className="mt-4 flex gap-4">
        <button
          className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
          onClick={nextCard}
        >
          Next Joke
        </button>
        <button
          className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow-md hover:bg-yellow-600"
          onClick={toggleAnswer}
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>
      </div>

      {/* Create Your Own Joke */}
      {!isCreating ? (
        <button
          className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600"
          onClick={handleCreateJoke}
        >
          Create Your Own Joke
        </button>
      ) : (
        <div className="mt-4 w-80 bg-white shadow-lg rounded-2xl p-6">
          <input
            className="w-full p-2 mb-2 border rounded-lg"
            type="text"
            placeholder="Enter question"
            value={newJoke.question}
            onChange={(e) =>
              setNewJoke({ ...newJoke, question: e.target.value })
            }
          />
          <input
            className="w-full p-2 mb-2 border rounded-lg"
            type="text"
            placeholder="Enter answer"
            value={newJoke.answer}
            onChange={(e) => setNewJoke({ ...newJoke, answer: e.target.value })}
          />
          <button
            className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
            onClick={handleSubmitJoke}
          >
            Submit Joke
          </button>
        </div>
      )}

      {/* Display User's Jokes */}
      {userJokes.length > 0 && (
        <div className="mt-4 w-80 bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Your Jokes</h3>
          <ul>
            {userJokes.map((joke, index) => (
              <li
                key={index}
                className="flex justify-between items-center mb-2"
              >
                <span>{joke.question}</span>
                <button
                  className="ml-4 text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteJoke(index)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display User's Location */}
      {location && (
        <div className="mt-4 bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Your Location</h3>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      )}

      {error && (
        <div className="mt-4 bg-red-500 text-white rounded-2xl p-6 text-center">
          <p>{error}</p>
        </div>
      )}

      {/* Display Captured Image */}
      {image && (
        <div className="mt-4 bg-white shadow-lg rounded-2xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Captured Image</h3>
          <img
            src={image}
            alt="Captured"
            className="w-64 h-64 object-cover rounded-full"
          />
        </div>
      )}

      {/* Button to capture image */}
      <button
        className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600"
        onClick={handleCaptureImage}
      >
        Capture Image
      </button>
    </div>
  );
};

export default App;
