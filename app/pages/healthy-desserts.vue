<script setup lang="ts">
// Versión en inglés de /postres-saludables, para el ebook en inglés
definePageMeta({ layout: 'landing' })

// Link único de compra del ebook en INGLÉS: lo usan todos los botones (con los UTM de la visita agregados en onMounted)
// Si se deja vacío, los botones no llevan al checkout y Google no indexa la página
const HOTMART_CHECKOUT_URL = 'https://pay.hotmart.com/D108455461B?checkoutMode=10'

// Imágenes sacadas del PDF del ebook en inglés (public/images/ebook/en/). Si una queda vacía se muestra un recuadro con la descripción
const imagenes = {
  // Libro en 3D con fondo transparente (como /images/ebook/portada-libro.webp)
  portada: '/images/ebook/en/cover-book.webp',
  // Imagen al compartir el link
  og: '/images/ebook/en/cover.jpg',
  paginas: [
    { src: '/images/ebook/en/page-recipe.jpg', t: 'Every recipe, step by step' },
    { src: '/images/ebook/en/page-contents.jpg', t: 'Chapter index' },
    { src: '/images/ebook/en/page-measurements.jpg', t: 'US cups, °F and °C' },
    { src: '/images/ebook/en/page-storage.jpg', t: 'How to store each dessert' },
  ],
}

// ⚠️ Configura aquí la oferta antes de publicar
const oferta = {
  checkoutUrl: HOTMART_CHECKOUT_URL,
  precioUsd: 14,
  // Precio después del lanzamiento: debe ser real, porque se muestra tachado
  precioRegularUsd: 26,
  // Fecha real en que termina el precio de lanzamiento (hora de Colombia)
  finLanzamiento: '2026-12-10T23:59:59-05:00',
  garantiaDias: 7,
}

useHead({ htmlAttrs: { lang: 'en' } })
useSeoMeta({
  title: 'Your favorite desserts, made healthier',
  description: '30 desserts with no added sugar, no wheat flour and no oil, tested in María José\'s kitchen. PDF ebook with instant access.',
  ogTitle: 'Your favorite desserts, made healthier. Same taste you love.',
  ogDescription: '30 recipes for cakes, cookies, brownies and ice cream with no added sugar, no wheat flour and no oil. Instant-download ebook.',
  ogImage: imagenes.og,
  twitterCard: 'summary_large_image',
  robots: HOTMART_CHECKOUT_URL ? undefined : 'noindex, nofollow',
})

// Lleva los UTM y parámetros de la campaña hasta el checkout de Hotmart para medir el ROAS
const checkoutHref = ref(oferta.checkoutUrl || '#buy')

// Cuenta regresiva hasta el fin real del precio de lanzamiento
const fin = new Date(oferta.finLanzamiento).getTime()
const restante = ref<number | null>(null)
const enLanzamiento = computed(() => restante.value === null || restante.value > 0)
const reloj = computed(() => {
  const ms = restante.value ?? 0
  const s = Math.floor(ms / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return [
    { valor: pad(Math.floor(s / 86400)), unidad: 'days' },
    { valor: pad(Math.floor((s % 86400) / 3600)), unidad: 'hours' },
    { valor: pad(Math.floor((s % 3600) / 60)), unidad: 'min' },
    { valor: pad(s % 60), unidad: 'sec' },
  ]
})
const fechaFin = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(fin)

const mostrarBarra = ref(false)
let timer: ReturnType<typeof setInterval> | undefined

function onScroll() {
  mostrarBarra.value = window.scrollY > 700
}

const { metaPixelIdEn } = useRuntimeConfig().public

onMounted(() => {
  if (oferta.checkoutUrl) {
    const url = new URL(oferta.checkoutUrl)
    new URLSearchParams(window.location.search).forEach((v, k) => { if (!url.searchParams.has(k)) url.searchParams.set(k, v) })
    checkoutHref.value = url.toString()
  }

  const tick = () => { restante.value = Math.max(0, fin - Date.now()) }
  tick()
  timer = setInterval(tick, 1000)

  window.addEventListener('scroll', onScroll, { passive: true })

  // Solo al pixel de esta landing (ver plugins/meta-pixel.client.ts)
  window.fbq?.('trackSingle', metaPixelIdEn, 'ViewContent', {
    content_name: '30 healthy dessert recipes',
    content_type: 'product',
    value: precioUsdActual.value,
    currency: 'USD',
  })
})

onBeforeUnmount(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
})

// Esta página muestra siempre el precio en dólares (sin conversión a moneda local)
// Todos los precios terminan en el código de moneda ("14 USD", "9.97 USD"); los enteros van sin decimales
const usd = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)} USD`
const precioUsdActual = computed(() => (enLanzamiento.value ? oferta.precioUsd : oferta.precioRegularUsd))
const precioActual = computed(() => usd(precioUsdActual.value))
const precioRegular = computed(() => usd(oferta.precioRegularUsd))

// Títulos tal como aparecen en el índice del ebook en inglés
const capitulos = [
  {
    n: 1, titulo: 'The cakes that made me fall in love with baking', bg: 'bg-pz-rosa', text: 'text-pz-verde',
    recetas: ['María Luisa Cake', 'Apple Cinnamon Cake', 'Bruce\'s Chocolate Cake from Matilda', 'Red Velvet Cake', 'Chocolate Banana Bread', 'Carrot Cake with Cream Cheese Frosting', 'Lemon Blueberry Cake', 'Orange Almond Cake'],
  },
  {
    n: 2, titulo: 'Cookies that disappear in minutes', bg: 'bg-pz-durazno', text: 'text-pz-azul-oscuro',
    recetas: ['New York–Style Chocolate Chip Cookies', 'Flaxseed Honey Cookies', 'Coconut Macaroons', 'Peanut Butter Chocolate Chip Cookies', 'Apple Cinnamon Oatmeal Cookies', 'Double Chocolate Cookies'],
  },
  {
    n: 3, titulo: 'Creamy, chilled desserts', bg: 'bg-pz-lavanda', text: 'text-pz-azul-oscuro',
    recetas: ['Berry Cheesecake', 'Creamy Vanilla Ice Cream', 'Rich Chocolate Ice Cream', 'Chocolate Mousse', 'Vanilla Panna Cotta with Strawberries', 'Tiramisu Cups'],
  },
  {
    n: 4, titulo: 'Desserts to share', bg: 'bg-pz-lima', text: 'text-pz-verde',
    recetas: ['Apple Cinnamon Crumble', 'Chocolate Brownies', 'Vanilla White Chocolate Blondies', 'Baked Vanilla Donuts', 'Cinnamon Rolls', 'Blueberry Lemon Muffins'],
  },
  {
    n: 5, titulo: 'Little treats', bg: 'bg-pz-menta', text: 'text-pz-vino',
    recetas: ['Chocolate Hazelnut Truffles', 'Chocolate Cheesecake Bars', 'Lemon Pie Cups', 'Vanilla Tres Leches Cake'],
  },
]

const recetas = capitulos.flatMap(c => c.recetas)
const img = (i: number) => `/images/ebook/postres/${String(i + 1).padStart(2, '0')}.jpg`
const filaA = recetas.slice(0, 15).map((titulo, i) => ({ titulo, src: img(i), n: i + 1 }))
const filaB = recetas.slice(15).map((titulo, i) => ({ titulo, src: img(i + 15), n: i + 16 }))

const dolores = [
  { t: 'You love sweets…', d: 'but every craving comes with guilt. And cutting out sugar feels like saying goodbye to dessert forever.' },
  { t: '“It\'s good… for a healthy dessert”', d: 'You\'ve tried “fit” recipes that tasted like cardboard, came out dry or had a weird texture nobody at home wanted again.' },
  { t: 'Your family loves the indulgent stuff', d: 'Cakes, breads, cookies… so you end up cooking twice, or eating what they eat so you don\'t feel left out.' },
  { t: 'Recipes that feed a crowd', d: 'Online recipes make enough for an army, and half of it goes bad in the fridge because there are only a few of you at home.' },
  { t: 'Swap one ingredient and it all falls apart', d: 'Cakes that don\'t rise, cookies that turn into rocks, batters that end up as something you never imagined.' },
  { t: 'You don\'t know what to use instead of sugar and flour', d: 'Allulose? Erythritol? Almond flour or oat flour? How much? Too many questions for something that should be a pleasure.' },
]

const incluye = [
  { t: '30 recipes tested in my kitchen', d: 'Cakes, cookies, ice cream, cheesecakes, brownies, donuts, truffles… each one illustrated, with ingredients in cups and grams and numbered step-by-step instructions.' },
  { t: '“My secret” and “My tip”', d: 'The tricks I learned by making mistakes, so you don\'t have to: when not to open the oven, how to get clean slices, how to avoid lumps.' },
  { t: 'Small batches', d: '6–7 inch (15–18 cm) pans. Desserts you finish while they\'re fresh, without wasting pricey ingredients.' },
  { t: 'Measurement guide', d: 'Standard US cups and spoons, grams for precision, °F and °C, and how to use each sweetener so yours turns out just like mine.' },
  { t: 'The ingredients, explained', d: 'Allulose, erythritol with stevia, almond flour, oats, coconut, flaxseed: what each one does, and a shopping guide so you know exactly what to buy.' },
  { t: 'Storage chart', d: 'How many days each dessert keeps and how to store it so it stays delicious.' },
]

// Testimonios REALES de compradoras del ebook en español, traducidos (se aclara en la página)
const testimonios: { nombre: string, ciudad?: string, receta?: string, texto: string, foto?: string }[] = [
  { nombre: 'Laura Marcela Gómez', receta: 'Chocolate Brownies', texto: 'I thought that since they were healthy recipes they\'d be kind of plain haha, but I made the brownies and they were SO good. Even my husband ate them and had no idea they had no added sugar 😂' },
  { nombre: 'Daniela Giraldo', receta: 'Peanut Butter Chocolate Chip Cookies', texto: 'I loved the book!! Everything is really well explained. I\'m not great at making desserts, but I already made the peanut butter chocolate cookies and they came out delicious. The carrot cake is next 😍' },
  { nombre: 'Paola Andrea Castaño', texto: 'I\'m trying to cut back on sugar, and the hardest part for me was giving up desserts. This recipe book came at the perfect time. I\'ve made 3 recipes so far and I\'ve really liked them.' },
  { nombre: 'Carolina Jaramillo', receta: 'Chocolate Cake', texto: 'Yesterday I made the chocolate cake to share with my family and they loved it. My mom even asked me for the recipe haha. The best part is that it\'s moist, not like those healthy cakes that taste like dry bread.' },
  { nombre: 'Natalia Restrepo', receta: 'Cinnamon Rolls', texto: 'At first I wasn\'t sure about buying it, since you can find lots of free recipes online, but honestly I really liked it. The measurements are clear and I don\'t have to search everywhere for what to make. I already made the cinnamon rolls and they were amazing.' },
]

// Color del círculo con la inicial de cada testimonio, en el mismo orden de la lista
const coloresInicial = ['bg-pz-verde', 'bg-pz-coral', 'bg-pz-azul', 'bg-pz-vino', 'bg-pz-azul-oscuro']

const preguntas = [
  { p: 'How do I get the ebook?', r: 'As soon as your payment is confirmed, Hotmart emails you a link to download the PDF. You can read it on your phone, tablet or computer, or print it.' },
  { p: 'Is it a physical book?', r: 'No. It\'s a fully illustrated 74-page PDF ebook. No shipping costs, and you\'ll have it in minutes.' },
  { p: 'Are the recipes low-calorie or meant for weight loss?', r: 'Not necessarily. A recipe with no added sugar, no wheat flour and no oil isn\'t automatically low in calories or carbs, and it doesn\'t mean you can eat it without limits. I\'m not a nutritionist: my goal is for you to enjoy delicious desserts made with different ingredients.' },
  { p: 'Can I eat them if I have diabetes or another health condition?', r: 'If you have a health condition or follow a special diet, check with your doctor or nutritionist first. This book doesn\'t replace professional advice.' },
  { p: 'Where can I find the ingredients?', r: 'Allulose, almond flour and oat flour are available at large supermarkets, health food stores and online. In the book I explain what each ingredient does and how to substitute it when possible.' },
  { p: 'Do I need to be an expert baker?', r: 'Not at all. I never went to culinary school or took classes. The recipes have exact measurements, temperatures, times and numbered steps. Many don\'t even need a mixer.' },
  { p: 'Do any recipes use honey?', r: 'Yes, one: the flaxseed honey cookies. I point it out in the recipe and give you an allulose alternative if you want a strictly no-added-sugar version.' },
  { p: 'Is it safe to pay?', r: 'Yes. Payment is processed by Hotmart, one of the largest digital product platforms in Latin America. You\'ll see the payment methods available in your country at checkout.' },
  { p: 'What if I don\'t like it?', r: `You have a ${oferta.garantiaDias}-day guarantee. If the book isn't for you, request a refund through Hotmart and you'll get your money back.` },
]
</script>

<template>
  <div class="pz overflow-x-clip">
    <!-- Barra de urgencia -->
    <div class="sticky top-0 z-50 bg-pz-verde px-4 py-2.5 text-center text-sm text-pz-crema">
      <template v-if="enLanzamiento">
        <span class="font-bold">Launch price</span><span class="hidden sm:inline"> until {{ fechaFin }}</span>
        <span v-if="restante !== null" class="ml-1 inline-flex gap-1 font-bold tabular-nums text-pz-rosa">
          · {{ reloj[0].valor }}d {{ reloj[1].valor }}h {{ reloj[2].valor }}m {{ reloj[3].valor }}s
        </span>
      </template>
      <template v-else>
        <span class="font-bold">Instant access</span> · 74 illustrated pages in PDF
      </template>
    </div>

    <!-- HERO -->
    <section class="checker relative px-4 pt-5 pb-20 md:pt-16 md:pb-28" style="--s: 56px">
      <div class="mx-auto grid max-w-6xl items-center gap-10 rounded-[2.5rem] bg-pz-crema p-5 shadow-[0_12px_0_rgba(0,0,0,0.12)] md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div>
          <p class="script text-[1.7rem] text-pz-coral md:text-4xl">For people who love dessert</p>
          <h1 class="mt-2 text-[clamp(1.85rem,4.5vw,3.2rem)] text-pz-verde md:mt-3">
            Your favorite desserts, made healthier. <span class="text-pz-coral">Same taste you love.</span>
          </h1>
          <div class="mt-4 flex items-center gap-4 md:mt-6 md:block">
            <p class="max-w-xl font-pz-serif text-base italic leading-snug md:text-2xl">
              <strong class="font-semibold not-italic">30 recipes for cakes, cookies, brownies and ice cream with no added sugar, no wheat flour and no oil</strong>, so good your family won't notice the swap. Instant-download ebook.
            </p>
            <!-- Portada en la primera pantalla del celular (en escritorio se ve la grande de la derecha). Misma URL que la grande: se descarga una sola vez -->
            <NuxtImg v-if="imagenes.portada" :src="imagenes.portada" alt="Cover of the ebook 30 healthy and delicious dessert recipes" width="412" height="604" format="webp" loading="eager" fetchpriority="high" preload class="block h-auto w-28 shrink-0 drop-shadow-[0_10px_12px_rgba(0,0,0,0.25)] md:hidden" />
            <PhotoSlot v-else alt="English ebook cover" aspect="aspect-[412/604]" class="w-28 shrink-0 rounded-lg md:hidden" />
          </div>

          <ul class="mt-5 grid grid-cols-3 gap-2 md:mt-8 md:flex md:flex-wrap md:gap-3">
            <li class="rounded-2xl bg-pz-verde px-2 py-1.5 text-center leading-tight text-pz-crema md:px-4 md:py-2 md:leading-normal">
              <span class="script block text-xl leading-none text-pz-durazno md:text-2xl">No</span>
              <span class="block text-[0.65rem] font-bold tracking-wide uppercase md:inline md:text-xs md:tracking-widest">added sugar</span>
            </li>
            <li class="rounded-2xl bg-pz-azul px-2 py-1.5 text-center leading-tight text-pz-crema md:px-4 md:py-2 md:leading-normal">
              <span class="script block text-xl leading-none text-pz-durazno md:text-2xl">No</span>
              <span class="block text-[0.65rem] font-bold tracking-wide uppercase md:inline md:text-xs md:tracking-widest">wheat flour</span>
            </li>
            <li class="rounded-2xl bg-pz-coral px-2 py-1.5 text-center leading-tight text-pz-crema md:px-4 md:py-2 md:leading-normal">
              <span class="script block text-xl leading-none text-pz-crema md:text-2xl">No</span>
              <span class="block text-[0.65rem] font-bold tracking-wide uppercase md:inline md:text-xs md:tracking-widest">oil</span>
            </li>
          </ul>

          <div class="mt-6 flex flex-col items-start gap-3 md:mt-10">
            <a :href="checkoutHref" class="btn-pz wiggle w-full px-5 text-base sm:w-auto md:px-8 md:text-lg">I want my 30 recipes →</a>
            <div>
              <p class="flex flex-wrap items-baseline gap-x-3">
                <span v-if="enLanzamiento" class="text-lg text-ink/50 line-through">{{ precioRegular }}</span>
                <strong class="font-pz-display text-4xl whitespace-nowrap text-pz-coral md:text-5xl">
                  {{ precioActual.slice(0, -4) }}<span class="text-[0.45em]"> {{ precioActual.slice(-3) }}</span>
                </strong>
              </p>
              <p class="mt-1 text-sm text-ink/70">One-time payment · Instant access</p>
              <p class="mt-1 text-xs text-ink/50">Hotmart confirms the exact amount at checkout.</p>
            </div>
          </div>
        </div>

        <div class="relative mx-auto hidden w-full max-w-sm md:block">
          <div class="float">
            <NuxtImg v-if="imagenes.portada" :src="imagenes.portada" alt="Cover of the ebook 30 healthy and delicious dessert recipes" width="412" height="604" format="webp" fetchpriority="high" class="block h-auto w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.3)]" />
            <PhotoSlot v-else alt="English ebook cover" aspect="aspect-[412/604]" class="rounded-2xl" />
          </div>
          <EbookStarburst class="absolute -top-6 -right-2 w-28 bg-pz-coral text-white md:-right-8 md:w-32">
            <span class="font-pz-display text-sm leading-tight uppercase">74<br>illustrated<br>pages</span>
          </EbookStarburst>
          <EbookSparkle class="absolute -bottom-4 -left-6 w-10 text-pz-coral" />
          <EbookSparkle class="absolute top-1/3 -left-8 w-6 text-pz-verde" />
        </div>
      </div>
    </section>

    <!-- Carrusel de postres -->
    <section aria-label="The 30 recipes" class="marquee-wrap space-y-5 overflow-hidden bg-pz-crema py-10">
      <!-- Margen en vez de gap: así el -50% de la animación mide justo una vuelta y no salta al reiniciar -->
      <div class="marquee flex w-max" style="--dur: 80s">
        <figure v-for="(item, i) in [...filaA, ...filaA]" :key="`a${i}`" class="mr-5 w-48 shrink-0 md:w-60">
          <div class="stamp bg-pz-rosa">
            <NuxtImg :src="item.src" :alt="item.titulo" width="300" height="300" class="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <figcaption class="script mt-1 text-center text-xl text-pz-verde">{{ item.titulo }}</figcaption>
        </figure>
      </div>
      <div class="marquee flex w-max [animation-direction:reverse]" style="--dur: 70s">
        <figure v-for="(item, i) in [...filaB, ...filaB]" :key="`b${i}`" class="mr-5 w-48 shrink-0 md:w-60">
          <div class="stamp bg-pz-azul">
            <NuxtImg :src="item.src" :alt="item.titulo" width="300" height="300" class="aspect-square w-full object-cover" loading="lazy" />
          </div>
          <figcaption class="script mt-1 text-center text-xl text-pz-azul-oscuro">{{ item.titulo }}</figcaption>
        </figure>
      </div>
    </section>

    <!-- DOLORES -->
    <section class="bg-pz-verde px-4 py-12 text-pz-crema md:py-28">
      <div class="mx-auto max-w-6xl">
        <p class="script text-center text-4xl text-pz-rosa">Sound familiar?</p>
        <h2 class="mx-auto mt-2 max-w-4xl text-center text-[clamp(2rem,5vw,3.6rem)]">
          You love desserts, but every craving is a battle
        </h2>
        <div class="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article v-for="(d, i) in dolores" :key="d.t" class="rounded-3xl bg-pz-crema p-7 text-ink" :class="i % 2 ? 'md:-rotate-1' : 'md:rotate-1'">
            <p class="font-pz-display text-4xl text-pz-coral">✕</p>
            <h3 class="mt-3 text-xl text-pz-verde">{{ d.t }}</h3>
            <p class="mt-3 text-base leading-relaxed text-ink/80">{{ d.d }}</p>
          </article>
        </div>
        <p class="mx-auto mt-16 max-w-3xl text-center font-pz-serif text-2xl italic leading-snug md:text-3xl">
          You don't have to choose between taking care of yourself and enjoying yourself. <span class="text-pz-rosa">You just need the right recipes.</span>
        </p>
      </div>
    </section>

    <!-- HISTORIA -->
    <section class="px-4 py-12 md:py-28">
      <div class="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <div class="relative">
          <div class="stamp rotate-[-2deg] bg-pz-coral">
            <PhotoSlot src="/images/maria-jose/cocina.png" alt="María José in her kitchen" aspect="aspect-[3/4]" class="bg-pz-crema" />
          </div>
          <EbookStarburst class="absolute -right-3 -bottom-6 w-32 bg-pz-rosa text-pz-verde">
            <span class="script px-3 text-xl leading-none">I never went to culinary school</span>
          </EbookStarburst>
        </div>
        <div>
          <p class="text-xs font-bold tracking-[0.3em] text-pz-coral uppercase">A little piece of me</p>
          <h2 class="mt-3 text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">My biggest addiction was sugar</h2>
          <div class="mt-8 space-y-4 font-pz-serif text-lg leading-relaxed">
            <p>I loved desserts and pretty much anything sweet. Giving it up wasn't easy at all, especially because <strong>I didn't want to give up everything I enjoyed so much.</strong></p>
            <p>And my husband loves cakes, breads, cookies… basically everything indulgent. So I started making my own versions, swapping ingredients, getting it wrong and trying again.</p>
            <p>I discovered that you really can make delicious things <strong>with no added sugar, no wheat flour and no oil.</strong> It's not about cutting everything out, it's about learning to use ingredients that work and, above all, taste delicious.</p>
          </div>
          <blockquote class="mt-8 rounded-3xl bg-pz-rosa-claro p-6">
            <p class="script text-3xl leading-tight text-pz-verde">“Cooking is one of my love languages. I'm not happy until people taste it and tell me how it turned out.”</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="bg-pz-rosa px-4 py-12 md:py-28">
      <div class="mx-auto max-w-6xl">
        <h2 class="mx-auto max-w-3xl text-center text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">What makes this book different</h2>
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
    <section class="px-4 py-12 md:py-28">
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div class="rounded-3xl border-2 border-dashed border-ink/25 p-8">
          <p class="script text-3xl text-ink/50">Without this book</p>
          <ul class="mt-5 space-y-3 text-ink/70">
            <li>✕ Guilt every time you crave something sweet</li>
            <li>✕ Dry “fit” recipes nobody makes twice</li>
            <li>✕ Pricey ingredients wasted on failed attempts</li>
            <li>✕ Cooking separately for you and your family</li>
            <li>✕ Giant desserts that go bad in the fridge</li>
          </ul>
        </div>
        <div class="rounded-3xl bg-pz-verde p-8 text-pz-crema">
          <p class="script text-3xl text-pz-rosa">With this book</p>
          <ul class="mt-5 space-y-3">
            <li>✓ A delicious dessert whenever you feel like it</li>
            <li>✓ Moist cakes and truly chunky cookies</li>
            <li>✓ Exact measurements and tricks so they turn out right</li>
            <li>✓ Desserts your family asks for again without noticing the swap</li>
            <li>✓ Small batches that are always fresh</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- PARA QUIÉN (sin espacio arriba: viene justo después de otra sección del mismo fondo) -->
    <section class="px-4 pb-12 md:pb-28">
      <div class="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
        <div class="rounded-3xl bg-pz-lima/40 p-8">
          <h3 class="text-xl text-pz-verde">This book is for you if…</h3>
          <ul class="mt-5 space-y-3">
            <li>✓ You love making desserts and want versions with no added sugar</li>
            <li>✓ You're cutting back on sugar but don't want to give up your cravings</li>
            <li>✓ You want to treat your family to something tasty and a little healthier</li>
            <li>✓ You cook for just a few people and hate wasting food</li>
            <li>✓ You're not an expert, but you love trying new things</li>
          </ul>
        </div>
        <div class="rounded-3xl bg-pz-rosa-claro p-8">
          <h3 class="text-xl text-pz-vino">It's not for you if…</h3>
          <ul class="mt-5 space-y-3">
            <li>✕ You're looking for a diet plan or weight-loss recipes</li>
            <li>✕ You need low-calorie or low-carb recipes</li>
            <li>✕ You're expecting a physical book</li>
          </ul>
          <p class="mt-6 text-sm text-ink/70">I'm not a nutritionist. If you have a health condition, check with a professional.</p>
        </div>
      </div>
    </section>

    <!-- QUÉ INCLUYE -->
    <section class="checker px-4 py-12 md:py-28" style="--a: var(--color-pz-azul); --b: var(--color-pz-durazno); --s: 48px">
      <div class="mx-auto max-w-6xl rounded-[2.5rem] bg-pz-crema p-6 md:p-14">
        <p class="script text-center text-4xl text-pz-coral">Everything you'll make</p>
        <h2 class="mt-2 text-center text-[clamp(2rem,5vw,3.6rem)] text-pz-azul-oscuro">30 recipes in 5 chapters</h2>

        <div class="mt-12 gap-6 md:columns-2">
          <article v-for="c in capitulos" :key="c.n" class="mb-6 break-inside-avoid overflow-hidden rounded-3xl bg-white/70">
            <header class="px-6 py-5" :class="[c.bg, c.text]">
              <p class="script text-2xl leading-none">Chapter {{ c.n }}</p>
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
    <section class="px-4 py-12 md:py-28">
      <div class="mx-auto max-w-6xl">
        <p class="script text-center text-4xl text-pz-coral">Take a look inside</p>
        <h2 class="mx-auto mt-2 max-w-3xl text-center text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">So pretty you'll want to print it</h2>
        <div class="mt-14 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <figure v-for="(p, i) in imagenes.paginas" :key="p.t" class="transition hover:z-10 hover:scale-105" :class="['rotate-[-2deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]', 'rotate-[2deg]'][i]">
            <NuxtImg v-if="p.src" :src="p.src" :alt="p.t" width="400" height="533" class="w-full rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)]" loading="lazy" />
            <PhotoSlot v-else :alt="`English ebook page: ${p.t}`" aspect="aspect-[3/4]" class="rounded-lg" />
            <figcaption class="script mt-3 text-center text-2xl text-pz-verde">{{ p.t }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section v-if="testimonios.length" class="checker px-4 py-12 md:py-28" style="--a: var(--color-pz-lima); --b: var(--color-pz-verde); --s: 48px">
      <div class="mx-auto max-w-6xl">
        <div class="mx-auto max-w-2xl rounded-[2rem] bg-pz-crema px-6 py-8 text-center">
          <p class="script text-4xl text-pz-coral">“What a delicious cake!”</p>
          <h2 class="mt-2 text-[clamp(2rem,5vw,3.2rem)] text-pz-verde">What people who've made them are saying</h2>
          <p class="mt-3 text-xs text-ink/60">Reviews from readers of the Spanish edition, translated from Spanish.</p>
        </div>
        <div class="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          <figure v-for="(t, i) in testimonios" :key="t.nombre" class="mb-5 break-inside-avoid rounded-3xl bg-pz-crema p-6" :class="i % 2 ? 'rotate-1' : '-rotate-1'">
            <div v-if="t.foto" class="stamp mb-5 bg-pz-rosa">
              <NuxtImg :src="t.foto" :alt="`${t.receta} made by ${t.nombre}`" width="400" height="400" class="aspect-square w-full object-cover" loading="lazy" />
            </div>
            <blockquote class="font-pz-serif text-lg leading-snug italic">“{{ t.texto }}”</blockquote>
            <figcaption class="mt-4 flex items-start gap-3 text-sm">
              <span aria-hidden="true" class="grid size-11 shrink-0 place-items-center rounded-full font-pz-display text-lg text-pz-crema" :class="coloresInicial[i % coloresInicial.length]">{{ t.nombre[0] }}</span>
              <div>
                <span role="img" aria-label="5 out of 5 stars" class="block text-lg leading-none tracking-wider text-amber-400">★★★★★</span>
                <strong class="mt-1 block text-pz-verde">{{ t.nombre }}<template v-if="t.ciudad"> · {{ t.ciudad }}</template></strong>
                <span v-if="t.receta" class="script block text-xl leading-tight text-pz-coral">Made: {{ t.receta }}</span>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- OFERTA -->
    <section id="buy" class="checker px-4 py-12 md:py-28" style="--a: var(--color-pz-coral); --b: var(--color-pz-crema); --s: 48px">
      <div class="mx-auto max-w-2xl rounded-[2.5rem] bg-pz-crema p-6 text-center shadow-[0_14px_0_rgba(0,0,0,0.15)] md:p-12">
        <p class="script text-4xl text-pz-coral">With lots of love, from my kitchen</p>
        <h2 class="mt-2 text-[clamp(1.8rem,4.5vw,3rem)] text-pz-verde">30 healthy and delicious dessert recipes</h2>

        <ul class="mx-auto mt-8 max-w-md space-y-2 text-left">
          <li v-for="b in incluye" :key="b.t" class="flex gap-3"><span class="text-pz-verde">✓</span>{{ b.t }}</li>
          <li class="flex gap-3"><span class="text-pz-verde">✓</span>74 illustrated pages in PDF, to read or print</li>
          <li class="flex gap-3"><span class="text-pz-verde">✓</span>Instant, lifetime access</li>
        </ul>

        <div class="mt-10">
          <p v-if="enLanzamiento" class="text-xl text-ink/50 line-through">Was {{ precioRegular }}</p>
          <p class="font-pz-display text-[clamp(2.8rem,12vw,6.5rem)] leading-none whitespace-nowrap text-pz-coral">
            {{ precioActual.slice(0, -4) }}<span class="text-[0.4em]"> {{ precioActual.slice(-3) }}</span>
          </p>
          <p class="text-sm text-ink/60">One-time payment</p>
          <p class="mt-1 text-xs text-ink/50">Hotmart confirms the exact amount at checkout.</p>
        </div>

        <a :href="checkoutHref" class="btn-pz wiggle mt-8 w-full">Yes, I want my 30 recipes →</a>
        <p class="mt-4 text-sm text-ink/60">🔒 Secure payment with Hotmart · Access sent to your email</p>

        <div class="mt-10 flex flex-col items-center gap-5 rounded-3xl bg-pz-rosa-claro p-6 text-center sm:flex-row sm:text-left">
          <EbookStarburst class="w-28 shrink-0 bg-pz-verde text-pz-crema">
            <span class="font-pz-display text-[0.7rem] leading-tight uppercase">{{ oferta.garantiaDias }}-day<br>money-back<br>guarantee</span>
          </EbookStarburst>
          <p class="text-sm leading-relaxed">
            <strong>Try it risk-free.</strong> If within {{ oferta.garantiaDias }} days you feel the book isn't for you, request a refund through Hotmart and get 100% of your money back.
          </p>
        </div>

        <div v-if="enLanzamiento && restante !== null" class="mt-10">
          <p class="text-xs font-bold tracking-[0.3em] text-pz-coral uppercase">The launch price ends in</p>
          <div class="mt-3 flex justify-center gap-2 md:gap-3">
            <div v-for="r in reloj" :key="r.unidad" class="w-16 rounded-2xl bg-pz-verde py-3 text-pz-crema md:w-20">
              <span class="block font-pz-display text-2xl tabular-nums md:text-3xl">{{ r.valor }}</span>
              <span class="text-xs uppercase">{{ r.unidad }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CIERRE -->
    <section class="checker px-4 py-12 md:py-28" style="--s: 56px">
      <div class="mx-auto max-w-3xl rounded-[2.5rem] bg-pz-crema p-8 text-center md:p-14">
        <h2 class="text-[clamp(2rem,5vw,3.4rem)] text-pz-verde">Your next craving could be your best dessert</h2>
        <p class="mx-auto mt-6 max-w-xl font-pz-serif text-xl italic leading-snug">
          I hope these recipes are part of many beautiful moments, that your home smells delicious, and that you get to share what you make with the people you love.
        </p>
        <a :href="checkoutHref" class="btn-pz wiggle mt-10">I want to start today →</a>
        <p class="script mt-10 text-3xl text-pz-coral">With love,</p>
        <p class="script text-5xl text-pz-verde">María José Ramírez</p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="bg-pz-lavanda/40 px-4 py-12 md:py-28">
      <div class="mx-auto max-w-3xl">
        <p class="script text-center text-4xl text-pz-coral">Frequently asked questions</p>
        <h2 class="mt-2 text-center text-[clamp(2rem,5vw,3rem)] text-pz-azul-oscuro">Before you ask</h2>
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

    <!-- PIE -->
    <footer class="bg-pz-lavanda/40 px-4 pb-10 text-center text-xs text-ink/60">
      © {{ new Date().getFullYear() }} María José Ramírez · Payment processed by Hotmart
    </footer>

    <!-- Barra fija de compra en celular -->
    <Transition enter-from-class="translate-y-full" leave-to-class="translate-y-full">
      <div v-if="mostrarBarra" class="fixed inset-x-0 bottom-0 z-50 flex items-center justify-between gap-3 border-t-4 border-pz-coral bg-pz-crema px-4 py-3 transition-transform md:hidden">
        <div class="leading-tight">
          <p v-if="enLanzamiento" class="text-xs text-ink/50 line-through">{{ precioRegular }}</p>
          <p class="font-pz-display text-xl whitespace-nowrap text-pz-coral">
            {{ precioActual.slice(0, -4) }}<span class="text-[0.55em]"> {{ precioActual.slice(-3) }}</span>
          </p>
        </div>
        <a :href="checkoutHref" class="btn-pz px-5 py-3 text-sm whitespace-nowrap">Buy now</a>
      </div>
    </Transition>
  </div>
</template>
