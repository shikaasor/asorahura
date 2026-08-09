import { redirect } from "next/navigation";

export default function DeepAssessmentPage() {
  redirect("/assessment?depth=deep");
}
