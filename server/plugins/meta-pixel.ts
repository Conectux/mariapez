// Código base del pixel de Meta en el HTML que entrega el servidor, con el pixel de cada página.
// Así lo detectan las herramientas de Meta (Configurar eventos), que leen el HTML sin ejecutar JavaScript.
// El primer PageView sale de aquí; las navegaciones siguientes las maneja app/plugins/meta-pixel.client.ts
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const id = pixelDeRuta(getRequestURL(event).pathname, useRuntimeConfig(event).public)
    if (!id || !/^\d+$/.test(id)) return

    html.head.push(`<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->`)
  })
})
