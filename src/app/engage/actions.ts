"use server";

export async function submitInquiry(formData: FormData) {
    const name = formData.get("name");
    const company = formData.get("company");
    const details = formData.get("details");

    // In a real app, you would send this to a CRM or email service
    console.log("Inquiry received:", { name, company, details });

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Inquiry submitted successfully. We will be in touch." };
}
