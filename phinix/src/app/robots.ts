import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/site'

/**
 * Explicitly welcomes the AI crawlers that matter for discoverability
 * (ChatGPT, Perplexity, Claude, Gemini) in addition to classic search engines.
 * Remove / adjust if you ever want to opt out.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
