"use server";

import { redirect } from "next/navigation";
import { inquirySchema } from "@/lib/validation";

export async function submitInquiry(formData: FormData): Promise<{ success: boolean; message: string } | never> {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;

    const isEnterprise = formData.get("enterprise") === "true";

    const parsed = inquirySchema.safeParse({
        name: formData.get("name") ?? "",
        email: formData.get("email") ?? "",
        company: formData.get("company") ?? "",
        role: formData.get("role") ?? "",
        companySize: formData.get("companySize") ?? "",
        serviceInterest: formData.get("serviceInterest") ?? "",
        operationalVolume: formData.get("operationalVolume") ?? "",
        challenge: formData.get("challenge") ?? "",
        timeline: formData.get("timeline") ?? "",
        budget: formData.get("budget") ?? "",
        context: formData.get("context") ?? "",
        score: formData.get("score") ?? "",
    });

    if (!parsed.success) {
        return {
            success: false,
            message: parsed.error.issues[0]?.message || "Please check your inputs and try again.",
        };
    }

    const inquiry = {
        formType: "inquiry",
        ...parsed.data,
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

    if (isEnterprise) {
        redirect("https://calendly.com/asorahura");
    } else {
        redirect("/engage/confirmation");
    }
}
