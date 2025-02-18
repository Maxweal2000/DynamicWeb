import React, { useState } from "react";

const CreateJokeForm = ({ addJoke, initialJoke = { question: "", answer: "" }, isEditing = false }) => {
  const [joke, setJoke] = useState(initialJoke);

  const handleSubmit = () => {
    if (joke.question && joke.answer) {
      addJoke(joke);
      setJoke({ question: "", answer: "" });
    }
  };

  return (
    <div className="mt-4 w-80 bg-white shadow-lg rounded-2xl p-6">
      <input
        className="w-full p-2 mb-2 border rounded-lg"
        type="text"
        placeholder="Enter question"
        value={joke.question}
        onChange={(e) => setJoke({ ...joke, question: e.target.value })}
      />
      <input
        className="w-full p-2 mb-2 border rounded-lg"
        type="text"
        placeholder="Enter answer"
        value={joke.answer}
        onChange={(e) => setJoke({ ...joke, answer: e.target.value })}
      />
      <button className="w-full px-6 py-2 bg-blue-500 text-white rounded-lg" onClick={handleSubmit}>
        {isEditing ? "Update Joke" : "Submit Joke"}
      </button>
    </div>
  );
};

export default CreateJokeForm;
