"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "./ProgressBar";
import { EmailGate } from "./EmailGate";
import { DeepResultsScreen } from "./DeepResultsScreen";
import {
  deepQuestions,
  DIMENSIONS,
  calculateDeepScore,
  type Dimension,
} from "@/lib/deepAssessment";
import { submitDeepAssessmentForEmail } from "@/app/assessment/deep/actions";
import type { EmailGateInput } from "@/lib/validation";
import styles from "./DeepAssessmentShell.module.css";

type Step = "intro" | "questions" | "email-gate" | "results";

const STORAGE_KEY = "asor_deep_assessment_answers";
const IDENTITY_KEY = "asor_user_identity";
const TOTAL = deepQuestions.length;

export function DeepAssessmentShell() {
  const [step, setStep] = useState<Step>("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{
    total: number;
    byDimension: Record<Dimension, number>;
    firstName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [savedIdentity, setSavedIdentity] = useState<{ firstName: string; email: string } | null>(null);

  useEffect(() => {
    try {
      const identity = localStorage.getItem(IDENTITY_KEY);
      if (identity) setSavedIdentity(JSON.parse(identity));
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { answers: Record<number, number>; currentQ: number; step: string };
        if (parsed.answers && parsed.step === "questions") {
          setAnswers(parsed.answers);
          setCurrentQ(parsed.currentQ ?? 0);
          setStep("questions");
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentQ, step }));
    }
  }, [answers, currentQ, step]);

  async function handleAnswer(value: number) {
    const q = deepQuestions[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQ < deepQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // All questions done
    localStorage.removeItem(STORAGE_KEY);

    if (savedIdentity) {
      // Skip gate — submit with stored identity
      setIsLoading(true);
      await submitDeepAssessmentForEmail(savedIdentity.firstName, savedIdentity.email, newAnswers);
      setIsLoading(false);
      const { total, byDimension } = calculateDeepScore(newAnswers);
      setResult({ total, byDimension, firstName: savedIdentity.firstName });
      setStep("results");
    } else {
      setStep("email-gate");
    }
  }

  async function handleEmailSubmit(data: EmailGateInput) {
    setIsLoading(true);
    setEmailError(undefined);
    const res = await submitDeepAssessmentForEmail(data.firstName, data.email, answers);
    setIsLoading(false);

    if (!res.success) {
      setEmailError(res.error || "Something went wrong. Please try again.");
      return;
    }

    localStorage.setItem(IDENTITY_KEY, JSON.stringify({ firstName: data.firstName, email: data.email }));
    const { total, byDimension } = calculateDeepScore(answers);
    setResult({ total, byDimension, firstName: data.firstName });
    setStep("results");
  }

  const q = deepQuestions[currentQ];
  const dim = q?.dimension;
  const dimInfo = dim ? DIMENSIONS[dim] : null;
  const prevDim = currentQ > 0 ? deepQuestions[currentQ - 1].dimension : null;
  const isNewDimension = dim !== prevDim;

  if (isLoading) {
    return (
      <div className={styles.intro}>
        <p className={styles.introSub}>Calculating your score…</p>
      </div>
    );
  }

  if (step === "intro") {
    return (
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>The full scorecard — 5 dimensions, 20 questions</h2>
        <p className={styles.introSub}>
          Score yourself 0–3 on each question. Be honest — inflating scores only misleads your own planning.
        </p>
        <div className={styles.dimensions}>
          {(Object.entries(DIMENSIONS) as [Dimension, typeof DIMENSIONS[Dimension]][]).map(([code, d]) => (
            <div key={code} className={styles.dimRow}>
              <span className={styles.dimCode}>{code}</span>
              <span className={styles.dimName}>{d.name}</span>
              <span className={styles.dimMax}>{d.max} pts</span>
            </div>
          ))}
        </div>
        <button className={styles.startBtn} onClick={() => setStep("questions")}>
          Start Full Scorecard
        </button>
      </div>
    );
  }

  if (step === "questions" && q && dimInfo) {
    return (
      <div className={styles.questionWrap}>
        <ProgressBar current={currentQ + 1} total={TOTAL} />

        {isNewDimension && (
          <div className={styles.dimHeader}>
            <span className={styles.dimHeaderLabel}>Dimension {dim}</span>
            <span className={styles.dimHeaderName}>{dimInfo.name}</span>
            <span className={styles.dimHeaderDesc}>{dimInfo.description}</span>
          </div>
        )}

        <div className={styles.ratingWrap}>
          <h2 className={styles.ratingQuestion}>{q.text}</h2>
          <p className={styles.ratingSubtext}>{q.subtext}</p>
          <div className={styles.ratingOptions}>
            {q.options.map((label, value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`${styles.ratingOption} ${answers[q.id] === value ? styles.selected : ""}`}
              >
                <span className={styles.ratingBadge}>{value}</span>
                <span className={styles.ratingLabel}>{label}</span>
              </button>
            ))}
          </div>
        </div>
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
      <DeepResultsScreen
        total={result.total}
        byDimension={result.byDimension}
        firstName={result.firstName}
      />
    );
  }

  return null;
}
