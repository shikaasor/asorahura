"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ProgressBar } from "./ProgressBar";
import { EmailGate } from "./EmailGate";
import { RevenueResultsScreen } from "./RevenueResultsScreen";
import { AssessmentSectorGate } from "./AssessmentSectorGate";
import {
  DIMENSIONS,
  calculateDeepScore,
  getDeepQuestionsForSector,
  resolveDeepQuestion,
  type Dimension,
} from "@/lib/deepAssessment";
import { DEFAULT_SECTOR, isValidSector, type Sector } from "@/lib/assessment";
import { submitDeepAssessmentForEmail } from "@/app/assessment/deep/actions";
import type { EmailGateInput } from "@/lib/validation";
import styles from "./DeepAssessmentShell.module.css";

type Step = "gate" | "intro" | "questions" | "email-gate" | "results";

const STORAGE_KEY = "asor_deep_assessment_answers_v3";
const IDENTITY_KEY = "asor_user_identity";
const SECTOR_KEY = "asor_user_sector";

export function DeepAssessmentShell() {
  const [step, setStep] = useState<Step>("gate");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [sector, setSector] = useState<Sector>(DEFAULT_SECTOR);
  const [result, setResult] = useState<{
    total: number;
    byDimension: Record<Dimension, number>;
    firstName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [savedIdentity, setSavedIdentity] = useState<{ firstName: string; email: string } | null>(null);

  const sectorQuestions = useMemo(() => getDeepQuestionsForSector(sector), [sector]);
  const total = sectorQuestions.length;

  useEffect(() => {
    try {
      const identity = localStorage.getItem(IDENTITY_KEY);
      if (identity) setSavedIdentity(JSON.parse(identity));
    } catch { /* ignore */ }

    try {
      const storedSector = localStorage.getItem(SECTOR_KEY);
      if (storedSector && isValidSector(storedSector)) {
        setSector(storedSector);
      }
    } catch { /* ignore */ }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          answers: Record<number, number>;
          currentQ: number;
          step: string;
          sector?: string;
        };
        if (parsed.answers && parsed.step === "questions") {
          setAnswers(parsed.answers);
          setCurrentQ(parsed.currentQ ?? 0);
          if (parsed.sector && isValidSector(parsed.sector)) {
            setSector(parsed.sector);
          }
          setStep("questions");
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (step === "questions") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, currentQ, step, sector }));
    }
  }, [answers, currentQ, step, sector]);

  function startFlow() {
    setCurrentQ(0);
    setStep("questions");
  }

  async function handleAnswer(value: number) {
    const q = sectorQuestions[currentQ];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (currentQ < sectorQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
      return;
    }

    // All questions done
    localStorage.removeItem(STORAGE_KEY);

    if (savedIdentity) {
      // Skip gate — submit with stored identity
      setIsLoading(true);
      const res = await submitDeepAssessmentForEmail(savedIdentity.firstName, savedIdentity.email, newAnswers, sector);
      setIsLoading(false);

      if (!res.success) {
        setEmailError(res.error || "Something went wrong. Please try again.");
        setStep("email-gate");
        return;
      }

      const scored = calculateDeepScore(newAnswers, sector);
      setResult({ total: scored.total, byDimension: scored.byDimension, firstName: savedIdentity.firstName });
      setStep("results");
    } else {
      setStep("email-gate");
    }
  }

  async function handleEmailSubmit(data: EmailGateInput) {
    setIsLoading(true);
    setEmailError(undefined);
    const res = await submitDeepAssessmentForEmail(data.firstName, data.email, answers, sector);
    setIsLoading(false);

    if (!res.success) {
      setEmailError(res.error || "Something went wrong. Please try again.");
      return;
    }

    localStorage.setItem(IDENTITY_KEY, JSON.stringify({ firstName: data.firstName, email: data.email }));
    const scored = calculateDeepScore(answers, sector);
    setResult({ total: scored.total, byDimension: scored.byDimension, firstName: data.firstName });
    setStep("results");
  }

  const rawQ = sectorQuestions[currentQ];
  const q = rawQ ? resolveDeepQuestion(rawQ, sector) : undefined;
  const dim = q?.dimension;
  const dimInfo = dim ? DIMENSIONS[dim] : null;
  const prevDim = currentQ > 0 ? sectorQuestions[currentQ - 1].dimension : null;
  const isNewDimension = dim !== prevDim;

  if (isLoading) {
    return (
      <div className={styles.intro}>
        <p className={styles.introSub}>Calculating your score…</p>
      </div>
    );
  }

  if (step === "gate") {
    return <AssessmentSectorGate onContinue={() => setStep("intro")} />;
  }

  if (step === "intro") {
    return (
      <div className={styles.intro}>
        <h2 className={styles.introTitle}>The full scorecard — 6 dimensions, 24 questions</h2>
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
        <button className={styles.startBtn} onClick={startFlow}>
          Start Full Scorecard
        </button>
        <Link href="/assessment" className={styles.introSub}>
          Prefer the quick 4-minute version instead? →
        </Link>
      </div>
    );
  }

  if (step === "questions" && q && dimInfo) {
    return (
      <div className={styles.questionWrap}>
        <ProgressBar current={currentQ + 1} total={total} />

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
      <RevenueResultsScreen
        assessmentType="deep"
        score={result.total}
        byDimension={result.byDimension}
        firstName={result.firstName}
        sector={sector}
      />
    );
  }

  return null;
}
