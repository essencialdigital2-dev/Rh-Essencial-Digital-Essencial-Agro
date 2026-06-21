'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://uysmvziehlpugmgssibs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5c212emllaGxwdWdtZ3NzaWJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzU5MDUsImV4cCI6MjA5NTY1MTkwNX0.iuhDiTQCoIZSfSccURAITwnuejEmWABG8KW7RtGH9-8'
)

type Tipo = 'bug' | 'sugestao' | 'elogio'

export default function Monitor() {
  const [aberto, setAberto] = useState(false)
  const [tipo, setTipo] = useState<Tipo>('bug')
  const [msg, setMsg] = useState('')
  const [nome, setNome] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const errosEnviados = useRef(new Set<string>())

  useEffect(() => {
    function enviarErro(mensagem: string) {
      const chave = mensagem.slice(0, 60)
      if (errosEnviados.current.has(chave)) return
      errosEnviados.current.add(chave)
      sb.from('crm_contatos').insert([{
        nome: '[Sense AI] Erro automatico',
        origem: 'Feedback',
        produto: 'Sense AI',
        etapa: 'lead',
        notas: `Tipo: erro_auto\nPagina: ${window.location.href}\n\n${mensagem}`,
        tags: ['erro_auto'],
      }]).then(() => {})
    }

    const onError = (e: ErrorEvent) => enviarErro(e.message)
    const onUnhandled = (e: PromiseRejectionEvent) => enviarErro(String(e.reason))
    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandled)
    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandled)
    }
  }, [])

  async function enviar() {
    if (!msg.trim()) return
    setEnviando(true)
    await sb.from('crm_contatos').insert([{
      nome: nome || '[Sense AI] Feedback usuario',
      origem: 'Feedback',
      produto: 'Sense AI',
      etapa: 'lead',
      notas: `Tipo: ${tipo}\nPagina: ${window.location.href}\n\n${msg}`,
      tags: [tipo],
    }])
    setEnviando(false); setEnviado(true); setMsg(''); setNome('')
    setTimeout(() => { setEnviado(false); setAberto(false) }, 2500)
  }

  const TIPOS: { key: Tipo; label: string; emoji: string }[] = [
    { key: 'bug', label: 'Problema', emoji: '🐛' },
    { key: 'sugestao', label: 'Sugestao', emoji: '💡' },
    { key: 'elogio', label: 'Elogio', emoji: '⭐' },
  ]

  return (
    <>
      <button onClick={() => setAberto(true)} title="Feedback" className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-purple-500/15 border border-purple-500/35 text-purple-400 text-lg flex items-center justify-center backdrop-blur-md shadow-lg hover:bg-purple-500/25 transition-all">
        💬
      </button>

      {aberto && (
        <div className="fixed inset-0 bg-black/60 z-[600] flex items-end justify-end p-6">
          <div className="bg-[#0E0E1A] border border-white/10 rounded-2xl p-5 w-full max-w-sm">
            {enviado ? (
              <div className="text-center py-4">
                <div className="text-3xl mb-2">✅</div>
                <div className="text-sm font-bold text-emerald-400">Enviado! Obrigado.</div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm font-black text-white">Feedback / Problema</div>
                  <button onClick={() => setAberto(false)} className="text-white/40 text-lg bg-transparent border-none cursor-pointer">✕</button>
                </div>
                <div className="flex gap-2 mb-3">
                  {TIPOS.map(t => (
                    <button key={t.key} onClick={() => setTipo(t.key)} className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all border ${tipo === t.key ? 'border-purple-500 bg-purple-500/15 text-purple-400' : 'border-white/10 text-white/40 bg-transparent'}`}>
                      {t.emoji}<br />{t.label}
                    </button>
                  ))}
                </div>
                <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome (opcional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none mb-2" />
                <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder={tipo === 'bug' ? 'Descreva o problema...' : tipo === 'sugestao' ? 'Qual melhoria voce sugere?' : 'O que voce gostou?'} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none resize-none mb-3" />
                <button onClick={enviar} disabled={enviando || !msg.trim()} className="w-full bg-gradient-to-r from-violet-600 to-purple-500 text-white font-bold text-sm py-2.5 rounded-xl disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {enviando ? 'Enviando...' : 'Enviar'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
