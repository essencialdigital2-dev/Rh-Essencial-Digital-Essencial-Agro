// Protege as rotas internas do /ecossistema (que usam service_role e nao tem
// RLS por tras). O frontend do /ecossistema ja fica atras do gate de senha
// (GateAdmin), mas a API em si precisa da sua propria checagem — senao
// qualquer um que descobrir a URL le os dados direto, sem nunca passar pelo gate.
export function ecoAutorizado(req: Request): boolean {
  const key = req.headers.get('x-eco-key')
  // Usa a mesma senha do gate do /ecossistema (NEXT_PUBLIC_CENTRAL_PASSWORD).
  // Nao usar ADMIN_BYPASS_KEY aqui: aquele segredo faz login real em outros
  // apps, nao deve ficar visivel no bundle do cliente.
  return !!key && key === process.env.NEXT_PUBLIC_CENTRAL_PASSWORD
}
