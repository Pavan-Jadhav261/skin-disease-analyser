'use server';

import { detectSkinDisease } from '@/lib/skinDiseaseDetector';
import { getAuthSession } from '@/lib/auth';

export async function analyzeSkinCondition(formData: FormData) {
    const session = await getAuthSession();

    if (!session) {
        return {
            success: false,
            error: 'Please sign in before analyzing an image.',
        };
    }

    const imageFile = formData.get('image') as File | null;
    const symptoms = formData.get('symptoms') as string | null;

    let imageBuffer: Buffer | null = null;
    let mimeType: string | null = null;

    if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
        mimeType = imageFile.type || null;
    }

    try {
        const result = await detectSkinDisease(imageBuffer, mimeType, symptoms);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error analyzing skin condition:", error);
        return {
            success: false,
            error: "Failed to analyze skin condition. Please try again."
        };
    }
}
