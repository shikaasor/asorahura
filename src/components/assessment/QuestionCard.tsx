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
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{question.text}</h2>
      </div>
      <div className="space-y-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all font-medium text-lg ${
              selectedAnswer === option
                ? "border-gray-900 bg-gray-900 text-white shadow-lg"
                : "border-gray-200 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
