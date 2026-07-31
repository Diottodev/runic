import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { ArchifyShowcase } from '@/components/sections/ArchifyShowcase'
import { Skills } from '@/components/sections/Skills'
import { Install } from '@/components/sections/Install'
import { Features } from '@/components/sections/Features'
import { CursorGlow } from '@/components/CursorGlow'
import { ScrollToTop } from '@/components/ScrollToTop'

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CursorGlow />
      <ScrollToTop />
      <Navbar />
      <main>
        <Hero />
        <ArchifyShowcase />
        <Features />
        <Skills />
        <Install />
      </main>
      <Footer />
    </div>
  )
}
