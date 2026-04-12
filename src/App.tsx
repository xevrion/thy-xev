
import { Route, Routes } from 'react-router-dom'
import { Hero } from './components/Hero'
import { NavBar } from './components/NavBar'
import './styles/app.css'
import { CursorifyProvider, DefaultCursor } from '@cursorify/react'
import { About } from './components/About'
import { Posts } from './components/Posts'
import { Contact } from './components/Contact'
import { Projects } from './components/Projects'
import { PageWrapper } from './components/PageWrapper'
import { PostPage } from './components/PostPage'
import { Resume } from './components/Resume'
import { Now } from './components/Now'
import { CommandPalette } from './components/CommandPalette'


function App() {
  return (
    <CursorifyProvider
      cursor={<DefaultCursor />}
      opacity={1}
      delay={1}
      defaultCursorVisible={false}
      breakpoint={997}
    >
      <>
        {/* Decorative diagonal stripe borders */}
        <div
          className="pointer-events-none fixed inset-y-0 z-[999] hidden w-[60px] overflow-hidden xl:block"
          style={{ left: 'calc(50% - 576px - 60px)' }}
        >
          <div
            className="absolute inset-0 h-full w-[60px] border border-[var(--color-battleship-gray)] opacity-[0.15]"
            style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, var(--color-battleship-gray) 2px, var(--color-battleship-gray) 3px, transparent 3px, transparent 6px)' }}
          />
        </div>
        <div
          className="pointer-events-none fixed inset-y-0 z-[999] hidden w-[60px] overflow-hidden xl:block"
          style={{ left: 'calc(50% + 576px)' }}
        >
          <div
            className="absolute inset-0 h-full w-[60px] border border-[var(--color-battleship-gray)] opacity-[0.15]"
            style={{ backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 2px, var(--color-battleship-gray) 2px, var(--color-battleship-gray) 3px, transparent 3px, transparent 6px)' }}
          />
        </div>
        <CommandPalette />
        <Routes>
          <Route path="/" element={<PageWrapper><NavBar /><Hero /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><NavBar /><About /></PageWrapper>} />
          <Route path="/posts" element={<PageWrapper><NavBar /><Posts /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><NavBar /><Contact /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><NavBar /><Projects /></PageWrapper>} />
          <Route path="/posts/:slug" element={<PageWrapper><NavBar /><PostPage /></PageWrapper>} />
          <Route path="/resume" element={<PageWrapper><NavBar /><Resume /></PageWrapper>} />
          <Route path="/now" element={<PageWrapper><NavBar /><Now /></PageWrapper>} />
        </Routes>
      </>
    </CursorifyProvider>
  )
}

export default App
