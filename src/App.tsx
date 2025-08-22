
import { Hero } from './components/Hero'
import { NavBar } from './components/NavBar'
import './styles/app.css'
import { CursorifyProvider, DefaultCursor } from '@cursorify/react'

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
        <NavBar />

        <Hero />



      </>
    </CursorifyProvider>
  )
}

export default App
