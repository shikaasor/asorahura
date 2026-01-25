"use server";

interface InquiryData {
    name: string | null;
    email: string | null;
    company: string | null;
    role: string | null;
    companySize: string | null;
    operationalVolume: string | null;
    challenge: string | null;
    timeline: string | null;
    budget: string | null;
    context: string | null;
}

export async function submitInquiry(formData: FormData) {
    const inquiry: InquiryData = {
        name: formData.get("name") as string | null,
        email: formData.get("email") as string | null,
        company: formData.get("company") as string | null,
        role: formData.get("role") as string | null,
        companySize: formData.get("companySize") as string | null,
        operationalVolume: formData.get("operationalVolume") as string | null,
        challenge: formData.get("challenge") as string | null,
        timeline: formData.get("timeline") as string | null,
        budget: formData.get("budget") as string | null,
        context: formData.get("context") as string | null,
    };

    // In a real app, you would send this to a CRM or email service
    console.log("Inquiry received:", inquiry);

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Inquiry submitted successfully. We will be in touch." };
}
