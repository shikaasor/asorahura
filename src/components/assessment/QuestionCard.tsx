"use client";

import styles from "./QuestionCard.module.css";

const LETTERS = ["A", "B", "C", "D", "E"];

interface Props {
  question: { id: number; text: string };
  options: string[];
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
}

export function QuestionCard({ question, options, selectedAnswer, onAnswer }: Props) {
  return (
    <div className={styles.wrap}>
      <h2 className={styles.question}>{question.text}</h2>
      <div className={styles.options}>
        {options.map((option, i) => (
          <button
            key={option}
            onClick={() => onAnswer(option)}
            className={`${styles.option} ${selectedAnswer === option ? styles.selected : ""}`}
          >
            <span className={styles.letter}>{LETTERS[i]}</span>
            <span className={styles.optionText}>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
