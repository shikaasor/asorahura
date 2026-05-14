"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailGateSchema, type EmailGateInput } from "@/lib/validation";
import styles from "./EmailGate.module.css";

interface Props {
  onSubmit: (data: EmailGateInput) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function EmailGate({ onSubmit, isLoading, error }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailGateInput>({ resolver: zodResolver(emailGateSchema) });

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>You&apos;re done — unlock your results</h2>
        <p className={styles.sub}>
          Enter your details to see your personalized AI readiness score.
          We&apos;ll also send your full report to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.field}>
          <input
            {...register("firstName")}
            placeholder="First name"
            className={`${styles.input} ${errors.firstName ? styles.inputError : ""}`}
          />
          {errors.firstName && (
            <span className={styles.fieldError}>{errors.firstName.message}</span>
          )}
        </div>

        <div className={styles.field}>
          <input
            {...register("email")}
            type="email"
            placeholder="Work email"
            className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          />
          {errors.email && (
            <span className={styles.fieldError}>{errors.email.message}</span>
          )}
        </div>

        {error && <p className={styles.formError}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.submit}>
          {isLoading ? "Sending your report..." : "See My Results"}
        </button>
      </form>

      <p className={styles.privacy}>No spam. Unsubscribe any time.</p>
    </div>
  );
}
