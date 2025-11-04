import { z } from "zod"

const envSchema = z.object({
  // Public URLs accessible from browser
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_VECTORS_URL: z.string().url().optional(),
  
  // Optional feature flags
  NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH: z
    .string()
    .optional()
    .default("true")
    .transform((val) => val === "true"),
  NEXT_PUBLIC_ENABLE_CHAT_RECS: z
    .string()
    .optional()
    .default("false")
    .transform((val) => val === "true"),
})

// Validate at build/startup
const env = envSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_VECTORS_URL: process.env.NEXT_PUBLIC_VECTORS_URL,
  NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH: process.env.NEXT_PUBLIC_ENABLE_SEMANTIC_SEARCH,
  NEXT_PUBLIC_ENABLE_CHAT_RECS: process.env.NEXT_PUBLIC_ENABLE_CHAT_RECS,
})

export default env
