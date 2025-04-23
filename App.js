import React, { useState } from "react";

const techSupportPhrases = [
  "Have you tried restarting?",
  "Clear your cache",
  "Check your internet connection",
  "It works on my machine",
  "Let's escalate this",
  "Try a different browser",
  "Can you share your screen?",
  "We're investigating the issue",
  "Update your software",
  "I'll create a ticket",
  "This is a known issue",
  "Try turning it off and on again",
  "I'll loop in IT",
  "Let me remote in",
  "Please send a screenshot",
  "That's not expected behavior",
  "Let me replicate the issue",
  "We’ll follow up via email",
  "What’s your system version?",
  "Let me check the logs"
];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export default function TechSupportBingo() {
  const [phrases, setPhrases] = useState(shuffle([...techSupportPhrases]).slice(0, 16));
  const [marked, setMarked] = useState(Array(16).fill(false));

  const toggleMark = (index) => {
    const updated = [...marked];
    updated[index] = !updated[index];
    setMarked(updated);
  };

  const resetBoard = () => {
    setPhrases(shuffle([...techSupportPhrases]).slice(0, 16));
    setMarked(Array(16).fill(false));
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">TD Bank Tech Support Bingo</h1>
      <button onClick={resetBoard} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-xl">Reset Board</button>
      <div className="grid grid-cols-4 gap-2">
        {phrases.map((phrase, i) => (
          <div
            key={i}
            onClick={() => toggleMark(i)}
            className={\`cursor-pointer p-2 rounded-xl shadow \${marked[i] ? "bg-green-300" : "bg-white"}\`}
          >
            {phrase}
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-gray-500">Multiplayer coming soon!</p>
    </div>
  );
}
