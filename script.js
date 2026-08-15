const episodiosPadrao = [
  {
    id: 1,
    titulo: "Nosso primeiro encontro",
    data: "2024-01-10",
    descricao: "Uma memória especial guardada aqui."
  },
  {
    id: 2,
    titulo: "Aquela viagem",
    data: "2024-03-22",
    descricao: "Outra memória especial guardada aqui."
  },
  {
    id: 3,
    titulo: "Um dia qualquer, mas inesquecível",
    data: "2024-05-15",
    descricao: "Mais uma memória especial guardada aqui."
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

const telaLista = document.querySelector("#tela-lista");
const telaDetalhe = document.querySelector("#tela-detalhe");
const container = document.querySelector("#lista-episodios");
const botaoVoltar = document.querySelector("#botao-voltar");

const detalheTitulo = document.querySelector("#detalhe-titulo");
const detalheData = document.querySelector("#detalhe-data");
const detalheDescricao = document.querySelector("#detalhe-descricao");

const heroTitulo = document.querySelector("#hero-titulo");
const heroDescricao = document.querySelector("#hero-descricao");
const heroBotao = document.querySelector("#hero-botao");

episodios.forEach((episodio) => {
  container.innerHTML += `
    <article data-id="${episodio.id}">
      <h3>${episodio.titulo}</h3>
    </article>
  `;
});

function mostrarDetalhe(id) {
  const episodio = episodios.find((ep) => ep.id === id);
  if (!episodio) return;

  detalheTitulo.textContent = episodio.titulo;
  detalheData.textContent = episodio.data;
  detalheDescricao.textContent = episodio.descricao;

  telaLista.classList.add("oculto");
  telaDetalhe.classList.remove("oculto");
}

container.addEventListener("click", (evento) => {
  const card = evento.target.closest("article");
  if (!card) return;
  mostrarDetalhe(Number(card.dataset.id));
});

botaoVoltar.addEventListener("click", () => {
  telaDetalhe.classList.add("oculto");
  telaLista.classList.remove("oculto");
});

if (episodios.length > 0) {
  const destaque = episodios[0];
  heroTitulo.textContent = destaque.titulo;
  heroDescricao.textContent = destaque.descricao;

  heroBotao.addEventListener("click", () => {
    mostrarDetalhe(destaque.id);
  });
}