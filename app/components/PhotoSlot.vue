<!-- Espacio para foto: sin `src` muestra un recuadro con la descripción de la foto que va ahí -->
<script setup lang="ts">
withDefaults(defineProps<{
  alt: string
  src?: string
  aspect?: string
}>(), {
  aspect: 'aspect-[4/5]',
})
</script>

<template>
  <div class="overflow-hidden" :class="aspect">
    <NuxtImg v-if="src" :src="src" :alt="alt" class="h-full w-full object-cover" loading="lazy" />
    <div v-else class="flex h-full w-full items-center justify-center bg-ink/10 p-6 text-center text-sm text-current opacity-60">
      Foto: {{ alt }}
    </div>
  </div>
</template>
