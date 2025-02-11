import React, { useState, useEffect } from 'react';
import AddJoke from './components/AddJoke';
import Location from './components/Location';
import Camera from './components/Camera';

const App = () => {
  const [joke, setJoke] = useState("");
  const [jokes, setJokes] = useState([]);

  // Fetch Joke from API
  const fetchJoke = async () => {
    const response = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await response.json();
    setJoke(`${data.setup} - ${data.punchline}`);
    localStorage.setItem("lastJoke", JSON.stringify({ text: `${data.setup} - ${data.punchline}`, fromAPI: true }));
  };

  // Retrieve stored jokes from localStorage on app load
  useEffect(() => {
    const savedJoke = JSON.parse(localStorage.getItem("lastJoke"));
    if (savedJoke) {
      setJoke(savedJoke.text);
    }
  }, []);

  return (
    <div>
      <h1>Joke Generator App</h1>
      <button onClick={fetchJoke}>Get New Joke</button>
      <p>{joke}</p>

      {/* Add a joke section */}
      <AddJoke setJokes={setJokes} jokes={jokes} />
      <Location />
      <Camera />
    </div>
  );
};

export default App;
