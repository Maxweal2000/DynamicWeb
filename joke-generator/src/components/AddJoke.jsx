import React, { useState } from 'react';

const AddJoke = ({ setJokes, jokes }) => {
  const [newJoke, setNewJoke] = useState("");

  const addJoke = () => {
    setJokes([...jokes, { text: newJoke, fromAPI: false }]);
    setNewJoke(""); // Reset input field
  };

  const updateJoke = (index, updatedJoke) => {
    const newJokes = [...jokes];
    newJokes[index].text = updatedJoke;
    setJokes(newJokes);
  };

  const deleteJoke = (index) => {
    setJokes(jokes.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2>Add Your Joke</h2>
      <textarea 
        value={newJoke} 
        onChange={(e) => setNewJoke(e.target.value)} 
        placeholder="Type your joke here" 
      />
      <button onClick={addJoke}>Add Joke</button>

      <h2>Your Jokes</h2>
      <ul>
        {jokes.map((joke, index) => (
          <li key={index}>
            <input 
              type="text" 
              value={joke.text} 
              onChange={(e) => updateJoke(index, e.target.value)} 
            />
            <button onClick={() => deleteJoke(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddJoke;
