import React from "react";

const JokeDisplay = ({ joke, showAnswer }) => {
  if (!joke) return <div>No jokes available. Create your first joke!</div>;

  return (
    <div className="w-80 bg-white shadow-lg rounded-2xl p-6 text-center">
      <h2 className="text-xl font-semibold text-gray-800">
        {showAnswer ? joke.answer : joke.question}
      </h2>
    </div>
  );
};

export default JokeDisplay;
