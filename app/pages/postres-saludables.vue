<script setup lang="ts">
definePageMeta({ layout: 'landing' })

// ⚠️ Configura aquí la oferta antes de publicar
const oferta = {
  checkoutUrl: 'https://pay.hotmart.com/Y108221755S?checkoutMode=10',
  precioUsd: 9.97,
  // Precio después del lanzamiento: debe ser real, porque se muestra tachado
  precioRegularUsd: 19.97,
  // Fecha real en que termina el precio de lanzamiento (hora de Colombia)
  finLanzamiento: '2026-11-10T23:59:59-05:00',
  garantiaDias: 7,
}

useSeoMeta({
  title: '30 recetas de postres sin azúcar añadida',
  description: '30 postres sin azúcar añadida, sin harina de trigo y sin aceite, probados en la cocina de María José. Ebook en PDF con acceso inmediato.',
  ogTitle: '30 recetas de postres sin azúcar añadida, sin harina de trigo y sin aceite',
  ogDescription: 'Para que digas: «¡Qué torta tan deliciosa!». Ebook en PDF con acceso inmediato.',
  ogImage: '/images/ebook/portada.jpg',
  twitterCard: 'summary_large_image',
})

// Lleva los UTM y parámetros de la campaña hasta el checkout de Hotmart para medir el ROAS
const checkoutHref = ref(oferta.checkoutUrl)

// Cuenta regresiva hasta el fin real del precio de lanzamiento
const fin = new Date(oferta.finLanzamiento).getTime()
const restante = ref<number | null>(null)
const enLanzamiento = computed(() => restante.value === null || restante.value > 0)
const reloj = computed(() => {
  const ms = restante.value ?? 0
  const s = Math.floor(ms / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return [
    { valor: pad(Math.floor(s / 86400)), unidad: 'días' },
    { valor: pad(Math.floor((s % 86400) / 3600)), unidad: 'horas' },
    { valor: pad(Math.floor((s % 3600) / 60)), unidad: 'min' },
    { valor: pad(s % 60), unidad: 'seg' },
  ]
})
const fechaFin = new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(fin)

const mostrarBarra = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function onScroll() {
  mostrarBarra.value = window.scrollY > 700
}

onMounted(() => {
  const url = new URL(oferta.checkoutUrl)
  new URLSearchParams(window.location.search).forEach((v, k) => url.searchParams.set(k, v))
  checkoutHref.value = url.toString()

  const tick = () => { restante.value = Math.max(0, fin - Date.now()) }
  tick()
  timer = setInterval(tick, 1000)

  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
})

// Precio en la moneda local según el país del visitante (Vercel lo detecta por IP; ?pais=MX para probar)
const route = useRoute()
const headers = useRequestHeaders(['x-vercel-ip-country'])
const { data: local } = await useFetch('/api/precio', {
  key: 'precio-local',
  query: {
    pais: (route.query.pais as string) || headers['x-vercel-ip-country'] || '',
    usd: `${oferta.precioUsd},${oferta.precioRegularUsd}`,
  },
})

// Todos los precios terminan en el código de moneda ("$186 MXN", "9.97 USD")
const usd = (n: number) => `${n.toFixed(2)} USD`
const enMonedaLocal = (i: number) => {
  const precio = local.value?.precios[i]
  return precio ? `${precio} ${local.value!.moneda}` : null
}
const precioUsdActual = computed(() => (enLanzamiento.value ? oferta.precioUsd : oferta.precioRegularUsd))
const precioActual = computed(() => enMonedaLocal(enLanzamiento.value ? 0 : 1) ?? usd(precioUsdActual.value))
const precioRegular = computed(() => enMonedaLocal(1) ?? usd(oferta.precioRegularUsd))
const conversion = computed(() => (local.value?.precios.length ? `${usd(precioUsdActual.value)} · aprox. en ${local.value.nombre}` : null))

const capitulos = [
  {
    n: 1, titulo: 'Las tortas que me hicieron amar la repostería', bg: 'bg-pz-rosa', text: 'text-pz-verde',
    recetas: ['Torta María Luisa', 'Torta de manzana y canela', 'Torta de chocolate de Bruce, de Matilda', 'Torta Red Velvet', 'Torta de banano y chocolate', 'Torta de zanahoria con crema de queso', 'Torta de limón y arándanos', 'Torta de naranja y almendras'],
  },
  {
    n: 2, titulo: 'Galletas que desaparecen en minutos', bg: 'bg-pz-durazno', text: 'text-pz-azul-oscuro',
    recetas: ['Galletas New York de chocolate', 'Galletas de linaza y miel', 'Galletitas de coco', 'Galletas de mantequilla de maní y chocolate', 'Galletas de avena, manzana y canela', 'Galletas de doble chocolate'],
  },
  {
    n: 3, titulo: 'Postres cremosos y fríos', bg: 'bg-pz-lavanda', text: 'text-pz-azul-oscuro',
    recetas: ['Cheesecake de frutos rojos', 'Helado cremoso de vainilla', 'Helado de chocolate intenso', 'Mousse de chocolate', 'Panna cotta de vainilla y fresas', 'Tiramisú en vasitos'],
  },
  {
    n: 4, titulo: 'Postres para compartir', bg: 'bg-pz-lima', text: 'text-pz-verde',
    recetas: ['Crumble de manzana y canela', 'Brownies de chocolate', 'Blondies de vainilla y chocolate blanco', 'Donas horneadas de vainilla', 'Rollitos de canela', 'Muffins de arándanos y limón'],
  },
  {
    n: 5, titulo: 'Pequeños antojos', bg: 'bg-pz-menta', text: 'text-pz-vino',
    recetas: ['Trufas de chocolate y avellanas', 'Barras de cheesecake y chocolate', 'Vasitos de limón tipo lemon pie', 'Torta tres leches de vainilla'],
  },
]

const recetas = capitulos.flatMap(c => c.recetas)
const img = (i: number) => `/images/ebook/postres/${String(i + 1).padStart(2, '0')}.jpg`
const filaA = recetas.slice(0, 15).map((titulo, i) => ({ titulo, src: img(i), n: i + 1 }))
const filaB = recetas.slice(15).map((titulo, i) => ({ titulo, src: img(i + 15), n: i + 16 }))

const dolores = [
  { t: 'Te encanta lo dulce…', d: 'pero cada antojo viene con culpa. Y dejar el azúcar parece significar despedirte de los postres para siempre.' },
  { t: '«Está rica… para ser saludable»', d: 'Ya probaste recetas «fit» que sabían a cartón, quedaban secas o tenían una textura rara que nadie en tu casa quiso repetir.' },
  { t: 'Tu familia ama lo engordador', d: 'Tortas, panes, galletas… y terminas cocinando dos veces o comiendo lo mismo que ellos para no quedarte por fuera.' },
  { t: 'Recetas para 20 personas', d: 'Las de internet rinden para un batallón y se terminan dañando en la nevera porque en tu casa son pocos.' },
  { t: 'Cambias un ingrediente y todo se derrumba', d: 'Tortas que no crecen, galletas que quedan como piedra, mezclas que terminan siendo algo que nunca imaginaste.' },
  { t: 'No sabes qué usar en vez de azúcar y harina', d: '¿Alulosa? ¿Eritritol? ¿Harina de almendras o de avena? ¿Cuánto? Demasiadas dudas para algo que debería ser un placer.' },
]

const incluye = [
  { t: '30 recetas probadas en mi cocina', d: 'Tortas, galletas, helados, cheesecakes, brownies, donas, trufas… cada una con su ilustración, ingredientes en tazas y gramos, y paso a paso numerado.' },
  { t: '«Mi secreto» y «Mi consejo»', d: 'Los trucos que aprendí equivocándome, para que tú no tengas que hacerlo: cuándo no abrir el horno, cómo lograr cortes perfectos, cómo evitar grumos.' },
  { t: 'Porciones pequeñas', d: 'Moldes de 15 a 18 cm. Postres que se terminan frescos, sin desperdiciar ingredientes caros.' },
  { t: 'Guía de medidas y equivalencias', d: 'Tazas, cucharadas, mililitros, temperaturas y cómo usar cada endulzante para que te quede igual que a mí.' },
  { t: 'Los ingredientes, explicados', d: 'Alulosa, eritritol con estevia, harina de almendras, avena, coco, linaza: qué hace cada uno y por qué funciona.' },
  { t: 'Tabla de conservación', d: 'Cuántos días dura cada preparación y cómo guardarla para que siga deliciosa.' },
]

const preguntas = [
  { p: '¿Cómo recibo el ebook?', r: 'Apenas se confirme tu pago, Hotmart te envía un correo con el acceso para descargar el PDF. Lo puedes leer en el celular, la tablet, el computador o imprimirlo.' },
  { p: '¿Es un libro físico?', r: 'No. Es un ebook en PDF de 74 páginas, totalmente ilustrado. No pagas envío y lo tienes en minutos.' },
  { p: '¿Las recetas son bajas en calorías o sirven para bajar de peso?', r: 'No necesariamente. Que una receta no tenga azúcar añadida, harina de trigo ni aceite no significa que sea baja en calorías o carbohidratos, ni que se pueda comer sin límite. No soy nutricionista: lo que busco es que disfrutes postres deliciosos con otros ingredientes.' },
  { p: '¿Las puedo comer si tengo diabetes u otra condición de salud?', r: 'Si tienes una condición de salud o una dieta especial, consulta con tu médico o nutricionista antes. Este libro no reemplaza una recomendación profesional.' },
  { p: '¿Dónde consigo los ingredientes?', r: 'La alulosa, la harina de almendras y la harina de avena se consiguen en supermercados grandes, tiendas naturistas y tiendas en línea. En el libro te explico qué hace cada ingrediente y cómo reemplazarlo cuando se puede.' },
  { p: '¿Necesito ser experta en repostería?', r: 'Para nada. Yo nunca estudié cocina ni tomé clases. Las recetas tienen medidas exactas, temperaturas, tiempos y el paso a paso numerado. Muchas ni siquiera necesitan batidora.' },
  { p: '¿Algunas recetas llevan miel?', r: 'Sí, un par. Te lo indico en cada receta y te doy la alternativa con alulosa si buscas una versión estrictamente sin azúcar añadida.' },
  { p: '¿Es seguro pagar?', r: 'Sí. El pago se procesa en Hotmart, una de las plataformas de productos digitales más grandes de Latinoamérica. Ahí verás los medios de pago disponibles en tu país.' },
  { p: '¿Y si no me gusta?', r: `Tienes ${oferta.garantiaDias} días de garantía. Si el libro no es para ti, solicitas el reembolso desde Hotmart y te devuelven tu dinero.` },
]
</script>

<template>
  <div class="pz overflow-x-clip">
    <!-- Barra de urgencia -->
    <div class="sticky top-0 z-50 bg-pz-verde px-4 py-2.5 text-center text-sm text-pz-crema">
      <template v-if="enLanzamiento">
        <span class="font-bold">Precio de lanzamiento</span><span class="hidden sm:inline"> hasta el {{ fechaFin }}</span>
        <span v-if="restante !== null" class="ml-1 inline-flex gap-1 font-bold tabular-nums text-pz-rosa">
          · {{ reloj[0].valor }}d {{ reloj[1].valor }}h {{ reloj[2].valor }}m {{ reloj[3].valor }}s
        </span>
      </template>
      <template v-else>
        <span class="font-bold">Acceso inmediato</span> · PDF de 74 páginas ilustradas
      </template>
    </div>

    <!-- HERO -->
    <section class="checker relative px-4 pt-10 pb-20 md:pt-16 md:pb-28" style="--s: 56px">
      <div class="mx-auto grid max-w-6xl items-center gap-10 rounded-[2.5rem] bg-pz-crema p-6 shadow-[0_12px_0_rgba(0,0,0,0.12)] md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div>
          <p class="script text-3xl text-pz-coral md:text-4xl">Hola, soy María José y quiero que digas…</p>
          <h1 class="mt-3 text-[clamp(2.4rem,6.5vw,4.6rem)] text-pz-verde">
            «¡Qué torta tan deliciosa!»
          </h1>
          <p class="mt-6 max-w-xl font-pz-serif text-xl italic leading-snug md:text-2xl">
            Y no «está rica para ser saludable». <strong class="font-semibold not-italic">30 postres sin azúcar añadida, sin harina de trigo y sin aceite</strong> que saben a pastelería de verdad.
          </p>

          <ul class="mt-8 flex flex-wrap gap-3">
            <li class="rounded-2xl bg-pz-verde px-4 py-2 text-center text-pz-crema">
              <span class="script block text-2xl leading-none text-pz-durazno">Sin</span>
              <span class="text-xs font-bold tracking-widest uppercase">azúcar añadida</span>
            </li>
            <li class="rounded-2xl bg-pz-azul px-4 py-2 text-center text-pz-crema">
              <span class="script block text-2xl leading-none text-pz-durazno">Sin</span>
              <span class="text-xs font-bold tracking-widest uppercase">harina de trigo</span>
            </li>
            <li class="rounded-2xl bg-pz-coral px-4 py-2 text-center text-pz-crema">
              <span class="script block text-2xl leading-none text-pz-crema">Sin</span>
              <span class="text-xs font-bold tracking-widest uppercase">aceite</span>
            </li>
          </ul>

          <div class="mt-10 flex flex-col items-start gap-3">
            <a :href="checkoutHref" class="btn-pz wiggle w-full sm:w-auto">Quiero mis 30 recetas →</a>
            <p class="text-sm text-ink/70">
              <span v-if="enLanzamiento" class="mr-1 text-ink/50 line-through">{{ precioRegular }}</span>
              <strong class="text-pz-coral">{{ precioActual }}</strong>
              <template v-if="conversion"> ({{ usd(precioUsdActual) }})</template>
              · Pago único · Acceso inmediato
            </p>
          </div>
        </div>

        <div class="relative mx-auto w-full max-w-sm">
          <div class="float">
            <div class="stamp bg-pz-verde shadow-xl">
              <NuxtImg src="/images/ebook/portada.jpg" alt="Portada del ebook 30 recetas de postres saludables y deliciosos" width="600" height="800" class="block h-auto w-full" />
            </div>
          </div>
          <EbookStarburst class="absolute -top-6 -right-2 w-28 bg-pz-coral text-white md:-right-8 md:w-32">
            <span class="font-pz-display text-sm leading-tight uppercase">74<br>páginas<br>ilustradas</span>
          </EbookStarburst>
          <EbookSparkle class="absolute -bottom-4 -left-6 w-10 text-pz-coral" />
          <EbookSparkle class="absolute top-1/3 -left-8 w-6 text-pz-verde" />
        </div>
      </div>
    </section>

    <!-- Carrusel de postres -->
    <section aria-label="Las 30 recetas" class="marquee-wrap space-y-5 overflow-hidden bg-pz-crema py-10">
      <div class="marquee flex w-max gap-5" style="--dur: 80s">
        <figure v-for="(item, i) in [...filaA, ...filaA]" :key="`a${i}`" class="w-48 shrink-0 md:w-60">
          <div class="stamp bg-pz-rosa">
            <NuxtImg :src="item.src" :alt="item.titulo" width="300" height="300" class="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <figcaption class="script mt-1 text-center text-xl text-pz-verde">{{ item.titulo }}</figcaption>
        </figure>
      </div>
      <div class="marquee flex w-max gap-5 [animation-direction:reverse]" style="--dur: 70s">
        <figure v-for="(item, i) in [...filaB, ...filaB]" :key="`b${i}`" class="w-48 shrink-0 md:w-60">
          <div class="stamp bg-pz-azul">
            <NuxtImg :src="item.src" :alt="item.titulo" width="300" height="300" class="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <figcaption class="script mt-1 text-center text-xl text-pz-azul-oscuro">{{ item.titulo }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- DOLORES -->
    <section class="bg-pz-verde px-4 py-20 text-pz-crema md:py-28">
      <div class="mx-auto max-w-6xl">
        <p class="script text-center text-4xl text-pz-rosa">¿Te suena?</p>
        <h2 class="mx-auto mt-2 max-w-4xl text-center text-[clamp(2rem,5vw,3.6rem)]">
          Amas los postres, pero cada antojo es una batalla
        </h2>
        <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="(d, i) in dolores" :key="d.t" class="rounded-3xl bg-pz-crema p-7 text-ink" :class="i % 2 ? 'md:-rotate-1' : 'md:rotate-1'">
            <p class="font-pz-display text-4xl text-pz-coral">✕</p>
            <h3 class="mt-3 text-xl text-pz-verde">{{ d.t }}</h3>
            <p class="mt-3 text-base leading-relaxed text-ink/80">{{ d.d }}</p>
          </article>
        </div>
        <p class="mx-auto mt-16 max-w-3xl text-center font-pz-serif text-2xl italic leading-snug md:text-3xl">
          No tienes que elegir entre cuidarte y disfrutar. <span class="text-pz-rosa">Solo necesitas las recetas correctas.</span>
        </p>
      </div>
    </section>

    <!-- HISTORIA -->
    <section class="px-4 py-20 md:py-28">
      <div class="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div class="relative">
          <div class="stamp rotate-[-2deg] bg-pz-coral">
            <PhotoSlot alt="María José en su cocina" class="bg-pz-crema" />
          </div>
          <EbookStarburst class="absolute -right-3 -bottom-6 w-32 bg-pz-rosa text-pz-verde">
            <span class="script px-3 text-xl leading-none">Nunca estudié cocina</span>
          </EbookStarburst>
        </div>
        <div>
          <p class="text-xs font-bold tracking-[0.3em] text-pz-coral uppercase">Un pedacito de mí</p>
          <h2 class="mt-3 text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">Mi mayor adicción fue el azúcar</h2>
          <div class="mt-8 space-y-4 font-pz-serif text-lg leading-relaxed">
            <p>Me encantaban los postres y prácticamente cualquier cosa dulce. Dejarla no fue nada fácil, sobre todo porque <strong>no quería renunciar a todo lo que tanto disfrutaba.</strong></p>
            <p>Y a mi esposo le encantan las tortas, los panes, las galletas… mejor dicho, todo lo engordador. Así que empecé a preparar mis propias versiones, cambiando ingredientes, equivocándome y volviendo a intentar.</p>
            <p>Descubrí que sí se pueden preparar cosas realmente deliciosas <strong>sin azúcar añadida, sin harina de trigo y sin aceite.</strong> No se trata de quitarlo todo, sino de aprender a usar ingredientes que funcionen y, sobre todo, que sepan delicioso.</p>
          </div>
          <blockquote class="mt-8 rounded-3xl bg-pz-rosa-claro p-6">
            <p class="script text-3xl leading-tight text-pz-verde">«Cocinar es uno de mis lenguajes de amor. No quedo satisfecha hasta que lo prueban y me dicen qué tal quedó.»</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- QUÉ INCLUYE -->
    <section class="checker px-4 py-20 md:py-28" style="--a: var(--color-pz-azul); --b: var(--color-pz-durazno); --s: 48px">
      <div class="mx-auto max-w-6xl rounded-[2.5rem] bg-pz-crema p-6 md:p-14">
        <p class="script text-center text-4xl text-pz-coral">Todo lo que vas a preparar</p>
        <h2 class="mt-2 text-center text-[clamp(2rem,5vw,3.6rem)] text-pz-azul-oscuro">30 recetas en 5 capítulos</h2>

        <div class="mt-12 gap-6 md:columns-2">
          <article v-for="c in capitulos" :key="c.n" class="mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-white/70">
            <header class="px-6 py-5" :class="[c.bg, c.text]">
              <p class="script text-2xl leading-none">Capítulo {{ c.n }}</p>
              <h3 class="mt-1 text-lg">{{ c.titulo }}</h3>
            </header>
            <ol class="divide-y divide-dashed divide-ink/15 px-6 py-3">
              <li v-for="r in c.recetas" :key="r" class="flex gap-3 py-2.5 text-[0.95rem]">
                <span class="script w-7 shrink-0 text-xl leading-none text-pz-coral">{{ String(recetas.indexOf(r) + 1).padStart(2, '0') }}</span>
                {{ r }}
              </li>
            </ol>
          </article>
        </div>
      </div>
    </section>

    <!-- POR DENTRO -->
    <section class="px-4 py-20 md:py-28">
      <div class="mx-auto max-w-6xl">
        <p class="script text-center text-4xl text-pz-coral">Mira cómo es por dentro</p>
        <h2 class="mx-auto mt-2 max-w-3xl text-center text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">Tan bonito que vas a querer imprimirlo</h2>
        <div class="mt-14 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <figure v-for="(p, i) in [
            { src: '/images/ebook/paginas/pagina-9.jpg', t: 'Cada receta, paso a paso' },
            { src: '/images/ebook/paginas/pagina-6.jpg', t: 'Índice por capítulos' },
            { src: '/images/ebook/paginas/pagina-5.jpg', t: 'Medidas y equivalencias' },
            { src: '/images/ebook/paginas/pagina-73.jpg', t: 'Cómo conservar cada postre' },
          ]" :key="p.src" class="transition hover:z-10 hover:scale-105" :class="['rotate-[-2deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[2deg]'][i]">
            <NuxtImg :src="p.src" :alt="p.t" width="400" height="533" class="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)]" loading="lazy" />
            <figcaption class="script mt-3 text-center text-2xl text-pz-verde">{{ p.t }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="bg-pz-rosa px-4 py-20 md:py-28">
      <div class="mx-auto max-w-6xl">
        <h2 class="mx-auto max-w-3xl text-center text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">Lo que hace diferente este libro</h2>
        <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="(b, i) in incluye" :key="b.t" class="rounded-3xl bg-pz-crema p-7">
            <EbookStarburst class="w-14 bg-pz-durazno">
              <span class="font-pz-display text-lg text-white">{{ i + 1 }}</span>
            </EbookStarburst>
            <h3 class="mt-4 text-lg text-pz-verde">{{ b.t }}</h3>
            <p class="mt-2 text-base leading-relaxed text-ink/80">{{ b.d }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- ANTES / DESPUÉS -->
    <section class="px-4 py-20 md:py-28">
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div class="rounded-3xl border-2 border-dashed border-ink/25 p-8">
          <p class="script text-3xl text-ink/50">Sin este libro</p>
          <ul class="mt-5 space-y-3 text-ink/70">
            <li>✕ Culpa cada vez que te provoca algo dulce</li>
            <li>✕ Recetas «fit» secas que nadie repite</li>
            <li>✕ Ingredientes caros desperdiciados en pruebas fallidas</li>
            <li>✕ Cocinar aparte para ti y para tu familia</li>
            <li>✕ Postres gigantes que se dañan en la nevera</li>
          </ul>
        </div>
        <div class="rounded-3xl bg-pz-verde p-8 text-pz-crema">
          <p class="script text-3xl text-pz-rosa">Con este libro</p>
          <ul class="mt-5 space-y-3">
            <li>✓ Un postre delicioso cuando se te antoje</li>
            <li>✓ Tortas húmedas y galletas gorditas de verdad</li>
            <li>✓ Medidas exactas y trucos para que te salgan bien</li>
            <li>✓ Postres que tu familia pide repetir sin notar el cambio</li>
            <li>✓ Porciones pequeñas que siempre están frescas</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- OFERTA -->
    <section id="comprar" class="checker px-4 py-20 md:py-28" style="--a: var(--color-pz-coral); --b: var(--color-pz-crema); --s: 48px">
      <div class="mx-auto max-w-2xl rounded-[2.5rem] bg-pz-crema p-6 text-center shadow-[0_14px_0_rgba(0,0,0,0.15)] md:p-12">
        <p class="script text-4xl text-pz-coral">Con mucho amor, desde mi cocina</p>
        <h2 class="mt-2 text-[clamp(1.8rem,4.5vw,3rem)] text-pz-verde">30 recetas de postres saludables y deliciosos</h2>

        <ul class="mx-auto mt-8 max-w-md space-y-2 text-left">
          <li v-for="b in incluye" :key="b.t" class="flex gap-3"><span class="text-pz-verde">✓</span>{{ b.t }}</li>
          <li class="flex gap-3"><span class="text-pz-verde">✓</span>PDF de 74 páginas ilustradas, para leer o imprimir</li>
          <li class="flex gap-3"><span class="text-pz-verde">✓</span>Acceso inmediato y de por vida</li>
        </ul>

        <div v-if="enLanzamiento && restante !== null" class="mt-10">
          <p class="text-xs font-bold tracking-[0.3em] text-pz-coral uppercase">El precio de lanzamiento termina en</p>
          <div class="mt-3 flex justify-center gap-2 md:gap-3">
            <div v-for="r in reloj" :key="r.unidad" class="w-16 rounded-2xl bg-pz-verde py-3 text-pz-crema md:w-20">
              <span class="block font-pz-display text-2xl tabular-nums md:text-3xl">{{ r.valor }}</span>
              <span class="text-xs uppercase">{{ r.unidad }}</span>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <p v-if="enLanzamiento" class="text-lg text-ink/50 line-through">Antes {{ precioRegular }}</p>
          <p class="font-pz-display text-[clamp(2.4rem,10vw,4.5rem)] leading-tight whitespace-nowrap text-pz-coral">
            {{ precioActual.slice(0, -4) }}<span class="text-[0.4em]"> {{ precioActual.slice(-3) }}</span>
          </p>
          <p class="text-sm text-ink/60">{{ conversion ?? 'Pago único' }}</p>
          <p v-if="conversion" class="mt-1 text-xs text-ink/50">Pago único. El valor exacto en tu moneda lo muestra Hotmart al pagar.</p>
        </div>

        <a :href="checkoutHref" class="btn-pz wiggle mt-8 w-full">Sí, quiero mis 30 recetas →</a>
        <p class="mt-4 text-sm text-ink/60">🔒 Pago seguro con Hotmart · Recibes el acceso en tu correo</p>

        <div class="mt-10 flex flex-col items-center gap-5 rounded-3xl bg-pz-rosa-claro p-6 text-center sm:flex-row sm:text-left">
          <EbookStarburst class="w-24 shrink-0 bg-pz-verde text-pz-crema">
            <span class="font-pz-display text-sm leading-tight uppercase">{{ oferta.garantiaDias }} días<br>de<br>garantía</span>
          </EbookStarburst>
          <p class="text-sm leading-relaxed">
            <strong>Pruébalo sin riesgo.</strong> Si en {{ oferta.garantiaDias }} días sientes que el libro no es para ti, pides el reembolso desde Hotmart y te devuelven el 100% de tu dinero.
          </p>
        </div>
      </div>
    </section>

    <!-- PARA QUIÉN -->
    <section class="px-4 py-20 md:py-28">
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div class="rounded-3xl bg-pz-lima/40 p-8">
          <h3 class="text-xl text-pz-verde">Este libro es para ti si…</h3>
          <ul class="mt-5 space-y-3">
            <li>✓ Te encanta hacer postres y quieres versiones sin azúcar añadida</li>
            <li>✓ Estás dejando el azúcar pero no quieres dejar los antojos</li>
            <li>✓ Quieres consentir a tu familia con algo rico y un poco más saludable</li>
            <li>✓ Cocinas para pocas personas y odias desperdiciar</li>
            <li>✓ No eres experta, pero te encanta intentar cosas nuevas</li>
          </ul>
        </div>
        <div class="rounded-3xl bg-pz-rosa-claro p-8">
          <h3 class="text-xl text-pz-vino">No es para ti si…</h3>
          <ul class="mt-5 space-y-3">
            <li>✕ Buscas un plan de dieta o recetas para bajar de peso</li>
            <li>✕ Necesitas recetas bajas en calorías o carbohidratos</li>
            <li>✕ Esperas un libro físico</li>
          </ul>
          <p class="mt-6 text-sm text-ink/70">No soy nutricionista. Si tienes una condición de salud, consulta con un profesional.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-pz-lavanda/40 px-4 py-20 md:py-28">
      <div class="mx-auto max-w-3xl">
        <p class="script text-center text-4xl text-pz-coral">Preguntas frecuentes</p>
        <h2 class="mt-2 text-center text-[clamp(2rem,5vw,3rem)] text-pz-azul-oscuro">Antes de que preguntes</h2>
        <div class="mt-12 space-y-3">
          <details v-for="q in preguntas" :key="q.p" class="group rounded-2xl bg-pz-crema p-5 open:shadow-sm">
            <summary class="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-pz-azul-oscuro">
              {{ q.p }}
              <span class="font-pz-display text-2xl text-pz-coral transition group-open:rotate-45">+</span>
            </summary>
            <p class="mt-3 text-base leading-relaxed text-ink/80">{{ q.r }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="checker px-4 py-20 md:py-28" style="--s: 56px">
      <div class="mx-auto max-w-3xl rounded-[2.5rem] bg-pz-crema p-8 text-center md:p-14">
        <h2 class="text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">Tu próximo antojo puede ser tu mejor postre</h2>
        <p class="mx-auto mt-6 max-w-xl font-pz-serif text-xl italic leading-snug">
          Espero que estas recetas te acompañen en muchos momentos bonitos, que tu casa huela delicioso y que puedas compartir lo que prepares con las personas que quieres.
        </p>
        <a :href="checkoutHref" class="btn-pz wiggle mt-10">Quiero empezar hoy →</a>
        <p class="script mt-10 text-3xl text-pz-coral">Con cariño,</p>
        <p class="script text-5xl text-pz-verde">María José Ramírez</p>
      </div>
      <p class="mt-10 text-center text-xs text-pz-crema/90 drop-shadow">© {{ new Date().getFullYear() }} María José Ramírez · Pago procesado por Hotmart · <a href="https://www.exchangerate-api.com" class="underline" rel="noopener">Tasas de cambio por Exchange Rate API</a></p>
    </section>

    <!-- Barra fija de compra en celular -->
    <Transition enter-from-class="translate-y-full" leave-to-class="translate-y-full">
      <div v-if="mostrarBarra" class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t-4 border-pz-coral bg-pz-crema px-4 py-3 transition-transform md:hidden">
        <div class="leading-tight">
          <p v-if="enLanzamiento" class="text-xs text-ink/50 line-through">{{ precioRegular }}</p>
          <p class="font-pz-display text-lg text-pz-coral">{{ precioActual }}</p>
        </div>
        <a :href="checkoutHref" class="btn-pz px-5 py-3 text-sm">Comprar ahora</a>
      </div>
    </Transition>
  </div>
</template>
