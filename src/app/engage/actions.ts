"use server";

import { redirect } from "next/navigation";

export async function submitInquiry(formData: FormData): Promise<{ success: boolean; message: string } | never> {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    const scoreRaw = formData.get("score") as string;
    const score = parseInt(scoreRaw || "0", 10);

    const inquiry = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
        role: formData.get("role") as string,
        companySize: formData.get("companySize") as string,
        serviceInterest: formData.get("serviceInterest") as string,
        operationalVolume: formData.get("operationalVolume") as string,
        challenge: formData.get("challenge") as string,
        timeline: formData.get("timeline") as string,
        budget: formData.get("budget") as string,
        context: formData.get("context") as string,
        score: scoreRaw,
    };

    if (scriptUrl) {
        try {
            await fetch(scriptUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(inquiry),
                redirect: "follow",
            });
        } catch {
            // Fire-and-forget — CRM logging failure does not block routing
        }
    }

    if (score >= 70) {
        redirect("/checkout?tier=strategy");
    } else if (score >= 40) {
        redirect("/checkout?tier=discovery");
    } else {
        redirect("/engage/confirmation");
    }
}
