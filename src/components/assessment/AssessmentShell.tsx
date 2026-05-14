"use client";

import { useState, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { EmailGate } from "./EmailGate";
import { ResultsScreen } from "./ResultsScreen";
import {
  assessmentQuestions,
  getQuestionOptions,
  type Role,
} from "@/lib/assessment";
import { submitAssessmentForEmail } from "@/app/assessment/actions";
import type { EmailGateInput } from "@/lib/validation";
import styles from "./AssessmentShell.module.css";

type Step = "intro" | "questions" | "email-gate" | "results";

const STORAGE_KEY = "asor_assessment_answers";
const IDENTITY_KEY = "asor_user_identity";
const TOTAL_QUESTIONS = assessmentQuestions.length;

export function AssessmentShell() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<{
    score: number;
    tier: string;
    firstName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          answers: Record<number, string>;
          currentQ: number;
          step: string;
        };
        if (parsed.answers && parsed.step === "questions") {
          setAnswers(parsed.answers);
          setCurrentQ(parsed.currentQ ?? 0);
          setStep("questions");
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, currentQ, step })
      );
    }
  }, [answers, currentQ, step]);

  function handleAnswer(answer: string) {
    const q = assessmentQuestions[currentQ];
    const newAnswers = { ...answers, [q.id]: answer };
    setAnswers(newAnswers);

    if (currentQ < assessmentQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep("email-gate");
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function handleEmailSubmit(data: EmailGateInput) {
    setIsLoading(true);
    setEmailError(undefined);
    const res = await submitAssessmentForEmail(
      data.firstName,
      data.email,
      answers
    );
    setIsLoading(false);

    if (!res.success) {
      setEmailError(res.error || "Something went wrong. Please try again.");
      return;
    }

    localStorage.setItem(IDENTITY_KEY, JSON.stringify({ firstName: data.firstName, email: data.email }));

    setResult({
      score: res.score!,
      tier: res.tier!,
      firstName: data.firstName,
    });
    setStep("results");
  }

  const q = assessmentQuestions[currentQ];
  const role = (answers[1] as Role) || "Other";
  const displayQuestionNumber = currentQ + 1;

  if (step === "intro") {
    return (
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>Ready to find your score?</h2>
        <p className={styles.introSub}>
          8 questions · takes about 4 minutes · personalized score at the end
        </p>
        <button className={styles.startBtn} onClick={() => setStep("questions")}>
          Start Assessment
        </button>
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className={styles.questionWrap}>
        <ProgressBar current={displayQuestionNumber} total={TOTAL_QUESTIONS} />
        <QuestionCard
          question={q}
          options={getQuestionOptions(q.id, role)}
          selectedAnswer={answers[q.id]}
          onAnswer={handleAnswer}
        />
      </div>
    );
  }

  if (step === "email-gate") {
    return (
      <EmailGate
        onSubmit={handleEmailSubmit}
        isLoading={isLoading}
        error={emailError}
      />
    );
  }

  if (step === "results" && result) {
    return (
      <ResultsScreen
        score={result.score}
        tier={result.tier}
        firstName={result.firstName}
      />
    );
  }

  return null;
}
