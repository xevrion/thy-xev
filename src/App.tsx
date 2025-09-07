
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
        {/* <NavBar /> */}
        <Routes>
          <Route path="/" element={<PageWrapper><NavBar /><Hero /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><NavBar /><About /></PageWrapper>} />
          <Route path="/posts" element={<PageWrapper><NavBar /><Posts /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><NavBar /><Contact /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><NavBar /><Projects /></PageWrapper>} />
          <Route path="/posts" element={<PageWrapper><NavBar /><Posts /></PageWrapper>} />
          <Route path="/posts/:slug" element={<PageWrapper><NavBar /><PostPage /></PageWrapper>} />
        </Routes>



      </>
    </CursorifyProvider>
  )
}

export default App
