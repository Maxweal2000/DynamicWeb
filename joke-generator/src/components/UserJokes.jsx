import React from "react";

const UserJokes = ({ jokes, deleteJoke, startEditingJoke }) => {
  return (
    <div className="mt-4 w-80 bg-white shadow-lg rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4">Your Jokes</h3>
      <ul>
        {jokes.map((joke, index) => (
          <li key={index} className="flex justify-between items-center mb-2">
            <span>{joke.question}</span>
            <div>
              <button className="ml-4 text-blue-500 hover:text-blue-700" onClick={() => startEditingJoke(index)}>
                Edit
              </button>
              <button className="ml-4 text-red-500 hover:text-red-700" onClick={() => deleteJoke(index)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserJokes;
