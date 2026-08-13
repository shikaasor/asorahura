"use client";

import { useEffect } from "react";
import styles from "./Toast.module.css";

interface Props {
  message: string;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ message, onDismiss, durationMs = 5000 }: Props) {
  useEffect(() => {
    const id = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(id);
  }, [onDismiss, durationMs]);

  return (
    <div className={styles.toast} role="status">
      {message}
    </div>
  );
}
