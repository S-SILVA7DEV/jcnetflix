// Nome do "cache" (uma espécie de gaveta de arquivos salvos localmente).
// Se no futuro você mudar os arquivos e quiser forçar atualização,
// basta mudar esse nome (ex: "julia-plus-v2").
const CACHE_NOME = "julia-plus-v1";

// Lista de arquivos que o app precisa para funcionar offline
const ARQUIVOS_PARA_CACHE = [
  "index.html",
  "style.css",
  "script.js",
  "manifest.json"
];

// Quando o service worker é instalado, ele guarda os arquivos no cache
self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_NOME).then((cache) => {
      return cache.addAll(ARQUIVOS_PARA_CACHE);
    })
  );
});

// Quando o app pede um arquivo (ex: ao abrir a página), o service worker
// tenta responder com a versão salva no cache primeiro; se não tiver,
// busca na internet normalmente
self.addEventListener("fetch", (evento) => {
  evento.respondWith(
    caches.match(evento.request).then((respostaCache) => {
      return respostaCache || fetch(evento.request);
    })
  );
});