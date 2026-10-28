import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    portafolio: defineCollection({
      type: 'page',
      source: 'portafolio/*.md',
      schema: z.object({
        marca: z.string(),
        plataforma: z.enum(['TikTok', 'Instagram', 'YouTube', 'Otro']),
        categoria: z.string(),
        portada: z.string().optional(),
        video: z.string().optional(),
        fecha: z.date(),
        destacado: z.boolean().default(false),
      }),
    }),
  },
})
