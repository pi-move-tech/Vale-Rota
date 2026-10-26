//Funções de apoio usadas nas views (disponíveis como "h" no EJS)

//Retorna a cor e o texto de acordo com o atraso previsto (em minutos)
export function status(atraso) {
  if (atraso === 0) return { classe: "ok", texto: "No horário", cor: "#2e8b57" };
  if (atraso <= 15) return { classe: "alerta", texto: `+${atraso} min provável`, cor: "#e8a92b" };
  return { classe: "grave", texto: `+${atraso} min provável`, cor: "#d9534f" };
}

//Soma minutos a um horário "HH:MM"
export function somarMinutos(hora, minutos) {
  const [h, m] = hora.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

//Data de hoje no formato AAAA-MM-DD
export function hojeISO() {
  return new Date().toISOString().slice(0, 10);
}
