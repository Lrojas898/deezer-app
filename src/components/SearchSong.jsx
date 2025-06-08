import React, { useState, useEffect } from 'react'
import { api } from '../lib/axios'

export default function SearchSong() {
  const [searchTerm, setSearchTerm] = useState('')
  const [songs, setSongs] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('')
  const [error, setError] = useState(null)

  // Obtener playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await api.get('/playlists')
        setPlaylists(response.data)
      } catch (error) {
        console.error('Error al cargar playlists', error)
      }
    }

    fetchPlaylists()
  }, [])

  // Buscar canciones
  const handleSearch = async () => {
    try {
      const response = await api.get(`/deezer/search?q=${searchTerm}`)
      const data = response.data
      setSongs(data.data)
      setError(null)
    } catch (error) {
      setError('Error al encontrar canciones')
      console.error('No se pudo encontrar la canción', error)
    }
  }

  // Agregar canción a playlist
  const handleAddToPlaylist = async (song) => {
    if (!selectedPlaylistId) {
      alert('Selecciona una playlist antes de agregar la canción')
      return
    }

    try {
      await api.post(`/playlists/${selectedPlaylistId}/tracks`, {
        title: song.title,
        duration: song.duration,
        rank: song.rank,
        preview: song.preview,
        artistName: song.artist.name,
        albumTitle: song.album.title,
        artistPicture: song.artist.picture,
        albumCover: song.album.cover
      })
      alert('Canción agregada con éxito')
    } catch (err) {
      console.error('Error al agregar canción a la playlist', err)
      alert('No se pudo agregar la canción')
    }
  }

  return (
    <div>
      <h2>Buscar Canciones en Deezer</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Busca una canción o artista"
      />
      <button onClick={handleSearch}>Buscar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <h3>Selecciona una Playlist:</h3>
        <select
          value={selectedPlaylistId}
          onChange={(e) => setSelectedPlaylistId(e.target.value)}
        >
          <option value="">-- Elige una Playlist --</option>
          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: '20px' }}>
        {songs.map((song) => (
          <div
            key={song.id}
            style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}
          >
            <h3>
              {song.title} - {song.artist.name}
            </h3>
            <p>Álbum: {song.album.title}</p>
            <audio controls src={song.preview}></audio>
            <div>
              <img src={song.artist.picture} alt="Artist" width={100} />
              <img src={song.album.cover} alt="Album" width={100} />
            </div>
            <button onClick={() => handleAddToPlaylist(song)}>
              Agregar a Playlist
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
