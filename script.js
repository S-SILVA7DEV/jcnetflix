const episodiosPadrao = [
  {
    id: 1,
    titulo: "Nosso primeiro encontro",
    data: "2024-01-10",
    descricao: "Uma memória especial guardada aqui.",
    imagem: null
  },
  {
    id: 2,
    titulo: "Aquela viagem",
    data: "2024-03-22",
    descricao: "Outra memória especial guardada aqui.",
    imagem: null
  },
  {
    id: 3,
    titulo: "Um dia qualquer, mas inesquecível",
    data: "2024-05-15",
    descricao: "Mais uma memória especial guardada aqui.",
    imagem: null
  }
];

const dadosSalvos = localStorage.getItem("episodios");
let episodios = dadosSalvos ? JSON.parse(dadosSalvos) : episodiosPadrao;

function salvarEpisodios() {
  localStorage.setItem("episodios", JSON.stringify(episodios));
}

if (!dadosSalvos) {
  salvarEpisodios();
}

// Telas
const telaLista = document.querySelector("#tela-lista");
const telaDetalhe = document.querySelector("#tela-detalhe");
const telaForm = document.querySelector("#tela-form");
const todasAsTelas = [telaLista, telaDetalhe, telaForm];

const container = document.querySelector("#lista-episodios");
const botaoNovo = document.querySelector("#botao-novo");
const botoesVoltar = document.querySelectorAll("[data-voltar]");

// Detalhe
const detalheImagem = document.querySelector("#detalhe-imagem");
const detalheTitulo = document.querySelector("#detalhe-titulo");
const detalheData = document.querySelector("#detalhe-data");
const detalheDescricao = document.querySelector("#detalhe-descricao");
const botaoExcluir = document.querySelector("#botao-excluir");

// Hero
const heroTitulo = document.querySelector("#hero-titulo");
const heroDescricao = document.querySelector("#hero-descricao");
const heroBotao = document.querySelector("#hero-botao");
const hero = document.querySelector("#hero");

// Formulário
const formEpisodio = document.querySelector("#form-episodio");
const campoTitulo = document.querySelector("#campo-titulo");
const campoData = document.querySelector("#campo-data");
const campoDescricao = document.querySelector("#campo-descricao");
const campoFoto = document.querySelector("#campo-foto");
const previewFoto = document.querySelector("#preview-foto");

// Controle de estado
let idEpisodioAberto = null;
let imagemAtual = null; // guarda a foto (em base64) escolhida no formulário

function mostrarTela(tela) {
  todasAsTelas.forEach((t) => t.classList.add("oculto"));
  tela.classList.remove("oculto");
}

function estiloFundo(episodio) {
  if (episodio.imagem) {
    return `background-image: url('${episodio.imagem}')`;
  }
  return "";
}

function renderizarLista() {
  container.innerHTML = "";
  episodios.forEach((episodio) => {
    container.innerHTML += `
      <article data-id="${episodio.id}" style="${estiloFundo(episodio)}; background-size: cover; background-position: center;">
        <h3>${episodio.titulo}</h3>
      </article>
    `;
  });
}

function renderizarHero() {
  if (episodios.length === 0) return;
  const destaque = episodios[0];
  heroTitulo.textContent = destaque.titulo;
  heroDescricao.textContent = destaque.descricao;
  heroBotao.onclick = () => mostrarDetalhe(destaque.id);

  if (destaque.imagem) {
    hero.style.backgroundImage = `linear-gradient(to top, rgba(13,13,13,1), rgba(13,13,13,0.3)), url('${destaque.imagem}')`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  } else {
    hero.style.backgroundImage = "";
  }
}

function mostrarDetalhe(id) {
  const episodio = episodios.find((ep) => ep.id === id);
  if (!episodio) return;

  idEpisodioAberto = id;

  detalheTitulo.textContent = episodio.titulo;
  detalheData.textContent = episodio.data;
  detalheDescricao.textContent = episodio.descricao;

  detalheImagem.style.backgroundImage = episodio.imagem
    ? `url('${episodio.imagem}')`
    : "";

  mostrarTela(telaDetalhe);
}

function abrirFormularioNovo() {
  imagemAtual = null;
  formEpisodio.reset();
  previewFoto.classList.add("oculto");
  mostrarTela(telaForm);
}

container.addEventListener("click", (evento) => {
  const card = evento.target.closest("article");
  if (!card) return;
  mostrarDetalhe(Number(card.dataset.id));
});

botaoNovo.addEventListener("click", abrirFormularioNovo);

botoesVoltar.forEach((botao) => {
  botao.addEventListener("click", () => mostrarTela(telaLista));
});

campoFoto.addEventListener("change", () => {
  const arquivo = campoFoto.files[0];
  if (!arquivo) return;

  const leitor = new FileReader();
  leitor.onload = () => {
    imagemAtual = leitor.result;
    previewFoto.src = imagemAtual;
    previewFoto.classList.remove("oculto");
  };
  leitor.readAsDataURL(arquivo);
});

formEpisodio.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const novoEpisodio = {
    id: Date.now(),
    titulo: campoTitulo.value,
    data: campoData.value,
    descricao: campoDescricao.value,
    imagem: imagemAtual
  };

  episodios.unshift(novoEpisodio);
  salvarEpisodios();

  renderizarLista();
  renderizarHero();
  mostrarTela(telaLista);
});

botaoExcluir.addEventListener("click", () => {
  const confirmou = confirm("Tem certeza que quer excluir este episódio?");
  if (!confirmou) return;

  episodios = episodios.filter((ep) => ep.id !== idEpisodioAberto);
  salvarEpisodios();

  renderizarLista();
  renderizarHero();
  mostrarTela(telaLista);
});

renderizarLista();
renderizarHero();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service worker registrado com sucesso!"))
    .catch((erro) => console.log("Erro ao registrar service worker:", erro));
}