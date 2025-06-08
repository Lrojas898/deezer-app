import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PlayListCard from './components/PlayListCard'
import Tracks from './components/Tracks'
import SearchSong from './components/SearchSong'

function App() {
  return (
    <Router>
      <main>
        <h1>Deezer App</h1>
        <Routes>
          <Route path="/" element={<PlayListCard />} />
          <Route path="/playlist/:id" element={<Tracks />} />
          <Route path="/search" element={<SearchSong />} /> {/* NUEVA RUTA */}
        </Routes>
      </main>
    </Router>
  )
}

export default App
