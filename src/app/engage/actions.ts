"use server";

export async function submitInquiry(formData: FormData) {
    const scriptUrl = process.env.GOOGLE_SCRIPT_URL;
    if (!scriptUrl) {
        return { success: false, message: "Form submission is not configured." };
    }

    const inquiry = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        company: formData.get("company") as string,
        role: formData.get("role") as string,
        companySize: formData.get("companySize") as string,
        operationalVolume: formData.get("operationalVolume") as string,
        challenge: formData.get("challenge") as string,
        timeline: formData.get("timeline") as string,
        budget: formData.get("budget") as string,
        context: formData.get("context") as string,
    };

    try {
        await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inquiry),
            redirect: "follow",
        });

        return { success: true, message: "Inquiry submitted successfully. We will be in touch." };
    } catch {
        return { success: false, message: "Something went wrong. Please try again later." };
    }
}
