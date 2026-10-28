<script setup lang="ts">
useSeoMeta({
  title: 'Inicio',
  description: 'Hola, soy María José. Mercadóloga, creativa, ilustradora, repostera y creyente. Bienvenido a este pedacito de mi mundo.',
})
</script>

<template>
  <!-- Hola -->
  <section class="px-4 pt-12 pb-24 md:px-10 md:pt-20 md:pb-32">
    <div class="mx-auto grid max-w-7xl items-end gap-12 md:grid-cols-12">
      <div class="md:col-span-7">
        <p class="script text-5xl text-accent md:text-6xl">Hola,</p>
        <h1 class="mt-2">soy María José.</h1>
        <p class="mt-10 max-w-xl text-xl md:text-2xl">
          Y todavía me cuesta explicar exactamente a qué me dedico.
        </p>
      </div>
      <PhotoSlot class="md:col-span-5" alt="Retrato de María José" />
    </div>
  </section>

  <!-- Curiosidad -->
  <section class="bg-accent-light px-4 py-24 md:px-10 md:py-32">
    <div class="mx-auto max-w-4xl text-center">
      <p class="font-display text-3xl leading-tight tracking-[-0.04em] md:text-5xl">
        Desde chiquita he sido súper curiosa y creativa.
      </p>
      <p class="mx-auto mt-8 max-w-2xl">
        Siempre me ha gustado aprender, experimentar, imaginar cosas y, sobre todo, hacerlas realidad. Creo que por eso, cuando alguien me pregunta a qué me dedico, nunca sé exactamente por dónde empezar.
      </p>
    </div>
  </section>

  <!-- Profesionalmente -->
  <section class="px-4 py-24 md:px-10 md:py-32">
    <div class="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
      <PhotoSlot alt="María José dando una charla o taller" />
      <div>
        <p class="script text-4xl text-accent">Profesionalmente</p>
        <h2 class="mt-2">Ideas, storytelling y palabras.</h2>
        <p class="mt-8">
          Soy mercadóloga y tengo una agencia de marketing digital junto con mi esposo. Allí lidero toda la parte creativa, que es algo que disfruto muchísimo.
        </p>
        <p class="mt-4">
          Me encanta comunicar, hablar en público, compartir lo que sé, dar talleres y conferencias. Definitivamente, las ideas, el storytelling y las palabras son parte de mi mundo.
        </p>
      </div>
    </div>
  </section>

  <!-- Pasiones -->
  <section class="bg-accent-dark px-4 py-24 text-cream md:px-10 md:py-32">
    <div class="mx-auto max-w-7xl">
      <h2 class="max-w-3xl">Pero eso es solo una parte de mí.</h2>

      <div class="mt-16 grid gap-6 sm:grid-cols-3">
        <figure>
          <PhotoSlot alt="Ilustraciones y dibujos" />
          <figcaption class="script mt-3 text-3xl">Ilustrar</figcaption>
        </figure>
        <figure>
          <PhotoSlot alt="Postres recién horneados" />
          <figcaption class="script mt-3 text-3xl">Hornear</figcaption>
        </figure>
        <figure>
          <PhotoSlot alt="Prendas hechas por María José" />
          <figcaption class="script mt-3 text-3xl">Coser</figcaption>
        </figure>
      </div>

      <div class="mt-16 grid gap-10 md:grid-cols-2 md:gap-20">
        <p>
          También amo ilustrar, dibujar, cocinar y hacer postres. Me encanta que mi casa huela a algo recién horneado y descubrir que mezclando unos cuantos ingredientes puedo crear algo delicioso.
        </p>
        <p>
          Otra de mis grandes pasiones es hacer mi propia ropa. Sí, muchas de las prendas que me ven usar las hago yo misma. Y lo más bonito es que a otras personas también les han gustado tanto que han terminado quedándose con algunas de mis creaciones. Y ojo, ¡que son de muy buena calidad! Jajaja.
        </p>
      </div>

      <p class="mt-16 max-w-3xl font-display text-2xl leading-snug tracking-[-0.03em] md:text-3xl">
        Lo curioso es que nunca estudié diseño de modas, cocina ni repostería. Mucho de lo que sé lo he aprendido por intuición, curiosidad, equivocándome, volviendo a intentar y atreviéndome a crear.
      </p>
    </div>
  </section>

  <!-- Sueño pendiente -->
  <section class="px-4 py-24 md:px-10 md:py-32">
    <div class="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-20">
      <div class="md:order-2">
        <PhotoSlot alt="Arte, pinturas o materiales de dibujo" aspect="aspect-square" />
      </div>
      <div>
        <p class="script text-4xl text-accent">Un sueño pendiente</p>
        <h2 class="mt-2">Estudiar artes.</h2>
        <p class="mt-8">
          Tengo un sueño pendiente, que no considero frustrado porque sé que algún día lo voy a cumplir: estudiar artes. No necesariamente para dedicarme profesionalmente a ello, sino por el simple gusto de aprender y regalarme esa experiencia.
        </p>
      </div>
    </div>
  </section>

  <!-- Fe -->
  <section class="bg-ink px-4 py-24 text-cream md:px-10 md:py-40">
    <div class="mx-auto max-w-4xl text-center">
      <p class="mx-auto max-w-2xl">
        Pero hay algo mucho más importante que todas las cosas que hago y que, en realidad, es lo que le da sentido a mi vida:
      </p>
      <h2 class="mt-8 text-[clamp(4rem,14vw,9rem)]">Dios.</h2>
      <p class="mx-auto mt-12 max-w-2xl">
        Él cambió mi historia, mi manera de ver la vida y mi propósito. Por eso, si me sigues o llegas a conocerme, seguramente me escucharás hablar mucho de Él. No porque tenga que hacerlo, sino porque estoy profundamente agradecida. Y porque, así como yo lo conocí, también quisiera que tú lo conocieras.
      </p>
      <blockquote class="mt-16 font-display text-3xl leading-tight tracking-[-0.04em] md:text-5xl">
        Mi fe no es una parte más de lo que hago. <span class="text-accent-light">Es el centro de todo lo que soy.</span>
      </blockquote>
    </div>
  </section>

  <!-- Esta página -->
  <section class="bg-accent-light px-4 py-24 md:px-10 md:py-32">
    <div class="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:gap-20">
      <div>
        <p class="script text-4xl text-accent">Esta página</p>
        <h2 class="mt-2">Un poquito de todo eso.</h2>
      </div>
      <div>
        <p>
          De mis ideas, mis proyectos, mis aprendizajes, mi creatividad, mi fe y de todas esas cosas que me apasionan y que no caben en una sola profesión.
        </p>
        <p class="mt-4">
          Soy fiel creyente de que no tenemos que limitarnos a una sola cosa, que siempre podemos aprender algo nuevo y que muchas veces lo único que necesitamos para empezar es atrevernos.
        </p>
        <p class="mt-10 font-display text-2xl leading-snug tracking-[-0.03em] md:text-3xl">
          Porque si algo he aprendido es que no necesito saber hacerlo todo para comenzar a crear.
        </p>
      </div>
    </div>
  </section>

  <!-- Bienvenida -->
  <section class="px-4 py-24 md:px-10 md:py-32">
    <div class="mx-auto max-w-7xl">
      <PhotoSlot alt="Foto horizontal de María José" aspect="aspect-[16/9]" />
      <p class="mt-12 text-center text-xl">Y si llegaste hasta aquí,</p>
      <p class="script mt-2 text-center text-5xl text-accent md:text-7xl">¡bienvenido a este pedacito de mi mundo!</p>
    </div>
  </section>
</template>
