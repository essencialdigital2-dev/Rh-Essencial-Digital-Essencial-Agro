import Sidebar from '@/components/layout/Sidebar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="md:ml-56 ml-0 flex-1 p-4 md:p-6 pt-16 md:pt-6 max-w-7xl">{children}</main>
    </div>
  )
}
