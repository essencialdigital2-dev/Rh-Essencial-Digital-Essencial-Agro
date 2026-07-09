#!/bin/bash
# Checklist de seguranca antes de "vercel --prod".
# Criado depois do incidente em que uma rota publica sem autenticacao
# expunha a service_role key em texto puro (nunca chegou a entrar no git,
# foi deployada direto via CLI). Este script bloqueia esse tipo de erro
# de acontecer de novo, silenciosamente.
set -uo pipefail
FALHOU=0

echo "== 1. Chaves service_role expostas em codigo =="
# So um problema real se a chave for service_role (bypassa RLS). Chave anon
# e publica por design (e assim que o Supabase client-side funciona) e nao
# deve ser tratada como vazamento.
FALLBACK_SERVICE=$(grep -rInE "SUPABASE_SERVICE_ROLE_KEY\s*\|\|\s*['\"]" --include="*.ts" --include="*.tsx" --include="*.js" . 2>/dev/null | grep -v node_modules | grep -v "\.next/")
if [ -n "$FALLBACK_SERVICE" ]; then
  echo "FALHOU: SUPABASE_SERVICE_ROLE_KEY com fallback de string literal hardcoded (se a env var faltar, cai numa chave fixa no codigo):"
  echo "$FALLBACK_SERVICE"
  FALHOU=1
fi

JWTS=$(grep -rIhoE 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}' --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" . 2>/dev/null | grep -v node_modules | sort -u)
if [ -n "$JWTS" ]; then
  while IFS= read -r jwt; do
    payload=$(echo "$jwt" | cut -d. -f2)
    padded=$(printf '%s' "$payload" | tr '_-' '/+' )
    mod=$(( ${#padded} % 4 ))
    if [ "$mod" -eq 2 ]; then padded="${padded}=="; elif [ "$mod" -eq 3 ]; then padded="${padded}="; fi
    decoded=$(printf '%s' "$padded" | base64 -d 2>/dev/null)
    if echo "$decoded" | grep -q '"role":"service_role"'; then
      echo "FALHOU: chave service_role hardcoded encontrada em texto puro no codigo:"
      grep -rIn "$jwt" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.html" . 2>/dev/null | grep -v node_modules
      FALHOU=1
    fi
  done <<< "$JWTS"
fi
if [ "$FALHOU" -eq 0 ]; then
  echo "OK: nenhuma chave service_role hardcoded encontrada (chaves anon publicas sao esperadas e seguras)."
fi

echo ""
echo "== 2. Rotas GET sem autenticacao que tocam dados sensiveis =="
ROTAS_SUSPEITAS=$(grep -rlE "export async function GET" --include="route.ts" . 2>/dev/null | grep -v node_modules | xargs -I{} sh -c 'grep -qE "auth\(\)|getUser\(\)|CRON_SECRET|Authorization|Bearer|ecoAutorizado|ADMIN_BYPASS_KEY|verificarAdmin|PertenceAoUsuario|usuarioAutorizado|ECO_INTERNAL_KEY|ehAdmin" "{}" || echo "{}"' 2>/dev/null)
if [ -n "$ROTAS_SUSPEITAS" ]; then
  echo "ATENCAO: rotas GET sem nenhuma checagem de auth visivel (revise manualmente, pode ser rota publica legitima):"
  echo "$ROTAS_SUSPEITAS"
else
  echo "OK: todas as rotas GET tem alguma checagem de auth/cron secret visivel."
fi

echo ""
echo "== 3. Mudancas nao commitadas indo pro deploy =="
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  SUJO=$(git status --porcelain)
  if [ -n "$SUJO" ]; then
    echo "ATENCAO: ha mudancas nao commitadas. Deploy via CLI publica isso sem revisao/historico:"
    echo "$SUJO"
  else
    echo "OK: working tree limpo, tudo commitado."
  fi
else
  echo "AVISO: nao e um repositorio git."
fi

echo ""
echo "== 4. Type-check =="
if npx tsc --noEmit > /tmp/tsc-out.txt 2>&1; then
  echo "OK: sem erros de tipo."
else
  echo "AVISO: erros de tipo encontrados (nao bloqueia se o projeto ja ignora TS no build):"
  head -20 /tmp/tsc-out.txt
fi

echo ""
if [ "$FALHOU" -eq 1 ]; then
  echo "RESULTADO: BLOQUEADO. Corrija os itens marcados como FALHOU antes de fazer deploy."
  exit 1
else
  echo "RESULTADO: liberado para deploy (revise os ATENCAO/AVISO manualmente antes de prosseguir)."
  exit 0
fi
