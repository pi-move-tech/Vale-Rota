//Middlewares de sessão e controle de acesso

//Disponibiliza usuário logado e mensagens para todas as views
export function injetarSessao(req, res, next) {
  res.locals.usuario = req.session.usuario || null;
  res.locals.msg = req.query.msg || null;
  res.locals.erro = req.query.erro || null;
  next();
}

//Exige estar logado (conta ou visitante)
export function exigirLogin(req, res, next) {
  if (!req.session.usuario) return res.redirect("/");
  next();
}

//Exige conta cadastrada (visitante não pode)
export function exigirConta(req, res, next) {
  const u = req.session.usuario;
  if (!u) return res.redirect("/");
  if (u.visitante) {
    return res.redirect("/buscar?erro=" + encodeURIComponent("Crie uma conta para usar este recurso."));
  }
  next();
}
