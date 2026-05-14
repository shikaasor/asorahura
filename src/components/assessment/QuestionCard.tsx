"use client";

interface Props {
  question: { id: number; text: string };
  options: string[];
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({
  question,
  options,
  selectedAnswer,
  onAnswer,
}: Props) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">{question.text}</h2>
      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all ${
              selectedAnswer === option
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 hover:border-gray-400 text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
