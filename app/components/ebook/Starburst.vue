<!-- Sello en forma de estrella con picos, como los números de receta del ebook -->
<script setup lang="ts">
const props = withDefaults(defineProps<{ points?: number, depth?: number }>(), {
  points: 18,
  depth: 0.12,
})

const clipPath = computed(() => {
  const coords: string[] = []
  const steps = props.points * 2
  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    const r = i % 2 === 0 ? 50 : 50 * (1 - props.depth)
    coords.push(`${(50 + r * Math.cos(angle)).toFixed(2)}% ${(50 + r * Math.sin(angle)).toFixed(2)}%`)
  }
  return `polygon(${coords.join(',')})`
})
</script>

<template>
  <div class="flex aspect-square items-center justify-center text-center" :style="{ clipPath }">
    <slot />
  </div>
</template>
