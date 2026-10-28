<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto max-w-3xl px-4 py-32 text-center">
      <p class="text-6xl font-display">{{ error.statusCode }}</p>
      <p class="mt-4 text-ink/70">{{ error.statusCode === 404 ? 'Esta página no existe.' : error.statusMessage }}</p>
      <button class="mt-8 rounded-full bg-ink px-6 py-3 text-cream" @click="clearError({ redirect: '/' })">Volver al inicio</button>
    </section>
  </NuxtLayout>
</template>
