// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/content', '@nuxt/image', '@nuxt/fonts'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      metaPixelId: '1272281247944176',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      titleTemplate: '%s · Maria Pez',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Creadora de contenido UGC.' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'icon', type: 'image/png', href: '/icon-512.png', sizes: '512x512' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },

  image: {
    quality: 80,
  },

  content: {
    experimental: { sqliteConnector: 'native' },
  },

  fonts: {
    families: [
      { name: 'Liter', provider: 'google' },
      { name: 'Imperial Script', provider: 'google' },
      // Identidad del ebook de postres (landing)
      { name: 'Archivo Black', provider: 'google' },
      { name: 'Caveat Brush', provider: 'google' },
      { name: 'Fraunces', provider: 'google', weights: ['400 700'], styles: ['normal', 'italic'] },
      { name: 'DM Sans', provider: 'google', weights: ['400 700'] },
    ],
  },
})
