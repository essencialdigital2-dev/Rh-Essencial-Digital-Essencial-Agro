import GateAdmin from '@/components/layout/GateAdmin'
import EcoNav from './EcoNav'

export default function EcossistemaLayout({ children }: { children: React.ReactNode }) {
  return (
    <GateAdmin>
      <div style={{ background: '#07070F', minHeight: '100vh' }}>
        <EcoNav />
        {children}
      </div>
    </GateAdmin>
  )
}
