<script setup lang="ts">
import type { NuxtError } from '#app'
defineProps<{ error: NuxtError }>()
</script>

<template>
  <NuxtLayout>
    <section class="mx-auto max-w-3xl px-4 py-32 text-center">
      <p class="font-display text-6xl">{{ error.statusCode }}</p>
      <p class="mt-4 text-ink/70">{{ error.statusCode === 404 ? 'Esta página no existe.' : error.statusMessage }}</p>
      <button class="btn mt-8" @click="clearError({ redirect: '/' })">Volver al inicio</button>
    </section>
  </NuxtLayout>
</template>
