import { getAnalysisModel, getOpenAIClient } from '@/lib/openai'

export type SkinAnalysisResult = {
  predictedDisease: string
  confidenceScore: number
  observations: string
  prevention: string
  cure: string
  additionalNotes: string
}

type SkinAnalysisSchema = {
  predictedDisease: string
  confidenceScore: number
  observations: string
  prevention: string
  cure: string
  additionalNotes: string
}

const schema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    predictedDisease: {
      type: 'string',
      description: 'Likely skin condition name.',
    },
    confidenceScore: {
      type: 'number',
      minimum: 0,
      maximum: 100,
      description: 'Estimated confidence score from 0 to 100.',
    },
    observations: {
      type: 'string',
      description: 'Short summary of visual cues and symptoms that influenced the assessment.',
    },
    prevention: {
      type: 'string',
      description: 'Prevention guidance.',
    },
    cure: {
      type: 'string',
      description: 'Possible care, treatment, or next-step guidance.',
    },
    additionalNotes: {
      type: 'string',
      description: 'Safety note or medical disclaimer.',
    },
  },
  required: [
    'predictedDisease',
    'confidenceScore',
    'observations',
    'prevention',
    'cure',
    'additionalNotes',
  ],
} as const

export async function detectSkinDisease(
  imageBuffer: Buffer | null,
  imageMimeType: string | null,
  symptomsText: string | null,
): Promise<SkinAnalysisResult> {
  if (!imageBuffer && !symptomsText) {
    throw new Error('An image or symptoms are required for analysis.')
  }

  const client = getOpenAIClient()
  const model = getAnalysisModel()
  const content: Array<
    | { type: 'input_text'; text: string }
    | { type: 'input_image'; image_url: string; detail: 'high' | 'low' | 'auto' }
  > = []

  if (symptomsText?.trim()) {
    content.push({
      type: 'input_text',
      text: `Symptoms provided by the user:\n${symptomsText.trim()}`,
    })
  }

  content.push({
    type: 'input_text',
    text:
      'Analyze this image and the symptoms together. Focus on visible patterns, likely condition, and practical next steps. Do not claim certainty or provide a formal diagnosis.',
  })

  if (imageBuffer) {
    const mimeType = imageMimeType && imageMimeType.startsWith('image/')
      ? imageMimeType
      : 'image/jpeg'

    content.push({
      type: 'input_image',
      image_url: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
      detail: 'high',
    })
  }

  const response = await client.responses.create({
    model,
    input: [
      {
        role: 'user',
        content,
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'skin_condition_assessment',
        schema,
        strict: true,
      },
    },
  })

  const outputText = response.output_text?.trim()

  if (!outputText) {
    throw new Error('OpenAI returned an empty analysis response.')
  }

  const parsed = JSON.parse(outputText) as SkinAnalysisSchema

  return {
    predictedDisease: parsed.predictedDisease,
    confidenceScore: parsed.confidenceScore,
    observations: parsed.observations,
    prevention: parsed.prevention,
    cure: parsed.cure,
    additionalNotes: parsed.additionalNotes,
  }
}
