import { z } from 'zod'

/**
 * Shared contact payload contract — used by both the client form and the
 * API route, so client and server can never drift apart.
 * Localised, human messages live in the dictionary; this layer only enforces shape.
 */
export const contactPayloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  projectType: z.string().trim().min(1).max(80),
  budget: z.string().trim().max(80).optional().or(z.literal('')),
  message: z.string().trim().min(10).max(4000),
  consent: z.literal(true),
  locale: z.enum(['hu', 'en']),
  /** Honeypot — must stay empty. */
  company: z.string().max(0).optional().or(z.literal('')),
  /** Milliseconds the user spent on the form; very fast fills are suspicious. */
  elapsedMs: z.number().int().nonnegative().max(1000 * 60 * 60).optional(),
})

export type ContactPayload = z.infer<typeof contactPayloadSchema>

export type ContactResponse =
  | { ok: true; id: string }
  | { ok: false; code: 'validation' | 'rate_limit' | 'delivery' | 'bad_request'; errors?: Record<string, string> }

const SPAM_WORDS = [
  'viagra',
  'casino',
  'crypto giveaway',
  'seo backlinks cheap',
  'loan offer',
  'bitcoin doubler',
]

/** Cheap heuristic scoring on top of the honeypot. Returns true when likely spam. */
export function looksLikeSpam(payload: Partial<ContactPayload>): boolean {
  const text = `${payload.name ?? ''} ${payload.message ?? ''}`.toLowerCase()
  if (SPAM_WORDS.some((w) => text.includes(w))) return true
  const links = (text.match(/https?:\/\//g) ?? []).length
  if (links > 3) return true
  if (payload.elapsedMs !== undefined && payload.elapsedMs < 1200) return true
  return false
}
