"use client";

import { useState, useEffect } from "react";
import { QuestionCard } from "./QuestionCard";
import { ProgressBar } from "./ProgressBar";
import { EmailGate } from "./EmailGate";
import { ResultsScreen } from "./ResultsScreen";
import { SectorPicker } from "./SectorPicker";
import {
  assessmentQuestions,
  getQuestionOptions,
  getQuestionText,
  isValidSector,
  DEFAULT_SECTOR,
  type Sector,
} from "@/lib/assessment";
import { submitAssessmentForEmail } from "@/app/assessment/actions";
import type { EmailGateInput } from "@/lib/validation";
import styles from "./AssessmentShell.module.css";

type Step = "intro" | "sector" | "questions" | "email-gate" | "results";

const STORAGE_KEY = "asor_assessment_answers_v3";
const IDENTITY_KEY = "asor_user_identity";
const SECTOR_KEY = "asor_user_sector";

// Q1 in assessmentQuestions is the sector routing question (served by SectorPicker).
// The questions step iterates from index 1 onward.
const FIRST_QUESTION_INDEX = 1;
const SCORED_TOTAL = assessmentQuestions.length - FIRST_QUESTION_INDEX;

export function AssessmentShell() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(FIRST_QUESTION_INDEX);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [sector, setSector] = useState<Sector>(DEFAULT_SECTOR);
  const [result, setResult] = useState<{
    score: number;
    tier: string;
    firstName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();

  useEffect(() => {
    try {
      const storedSector = localStorage.getItem(SECTOR_KEY);
      if (storedSector && isValidSector(storedSector)) {
        setSector(storedSector);
        setAnswers((a) => ({ ...a, 1: storedSector }));
      }
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          answers: Record<number, string>;
          currentQ: number;
          step: string;
          sector?: string;
        };
        if (parsed.answers && parsed.step === "questions") {
          setAnswers(parsed.answers);
          setCurrentQ(parsed.currentQ ?? FIRST_QUESTION_INDEX);
          if (parsed.sector && isValidSector(parsed.sector)) setSector(parsed.sector);
          setStep("questions");
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers, currentQ, step, sector })
      );
    }
  }, [answers, currentQ, step, sector]);

  function handleSectorSelect(s: Sector) {
    setSector(s);
    setAnswers((a) => ({ ...a, 1: s }));
    try { localStorage.setItem(SECTOR_KEY, s); } catch { /* ignore */ }
    setCurrentQ(FIRST_QUESTION_INDEX);
    setStep("questions");
  }

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
  // Position within the scored set (1..SCORED_TOTAL), used for progress display.
  const displayQuestionNumber = currentQ - FIRST_QUESTION_INDEX + 1;

  if (step === "intro") {
    return (
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>Ready to find your score?</h2>
        <p className={styles.introSub}>
          Pick your sector, then answer 7 questions · about 4 minutes · personalized score at the end
        </p>
        <button className={styles.startBtn} onClick={() => setStep("sector")}>
          Start Discovery
        </button>
      </div>
    );
  }

  if (step === "sector") {
    return (
      <div className={styles.questionWrap}>
        <SectorPicker
          selectedSector={sector}
          onSelect={handleSectorSelect}
        />
      </div>
    );
  }

  if (step === "questions") {
    return (
      <div className={styles.questionWrap}>
        <ProgressBar current={displayQuestionNumber} total={SCORED_TOTAL} />
        <QuestionCard
          question={{ id: q.id, text: getQuestionText(q.id, sector) }}
          options={getQuestionOptions(q.id, sector)}
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
        sector={sector}
      />
    );
  }

  return null;
}
