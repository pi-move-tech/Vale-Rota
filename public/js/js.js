// JavaScript do front-end (cada bloco só roda se o elemento existir na página)

// 1) Envia o formulário automaticamente ao trocar o filtro (tela de horários)
document.querySelectorAll("[data-autosubmit]").forEach((campo) => {
  campo.addEventListener("change", () => campo.form.submit());
});

// 2) Tela de alertas: carrega as viagens conforme origem e destino escolhidos
const alOrigem = document.querySelector("#alOrigem");
const alDestino = document.querySelector("#alDestino");
const alViagem = document.querySelector("#alViagem");

if (alOrigem && alDestino && alViagem) {
  const selecionada = alViagem.dataset.selecionada;

  async function carregarViagens() {
    alViagem.innerHTML = "";
    if (alOrigem.value === alDestino.value) {
      alViagem.innerHTML = '<option value="">Origem e destino devem ser diferentes</option>';
      return;
    }
    try {
      const resp = await fetch(`/api/viagens?origem=${alOrigem.value}&destino=${alDestino.value}`);
      const viagens = await resp.json();
      alViagem.innerHTML = viagens
        .map((v) => `<option value="${v.id}" ${String(v.id) === selecionada ? "selected" : ""}>Linha ${v.linha} - ${v.empresa} · ${v.horario}</option>`)
        .join("");
    } catch (erro) {
      alViagem.innerHTML = '<option value="">Erro ao carregar viagens</option>';
    }
  }

  alOrigem.addEventListener("change", carregarViagens);
  alDestino.addEventListener("change", carregarViagens);
  carregarViagens();
}

// 3) Mensagens de sucesso/erro somem sozinhas depois de alguns segundos
document.querySelectorAll(".alert").forEach((aviso) => {
  setTimeout(() => aviso.remove(), 5000);
});
