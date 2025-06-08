import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../lib/axios'
import { Link } from 'react-router-dom'

export default function Tracks () {
  const { id: playListId } = useParams()
  const [currentTrack, setCurrentTrack] = useState([])
  const [playlistName, setPlaylistName] = useState('')
  const [error, setError] = useState(null)
 

  const handleDeleteTrack = async (trackId) => {
  try {
    await api.delete(`/playlists/${playListId}/tracks/${trackId}`)
    fetchTracks() 
  } catch (err) {
    console.error('Error al eliminar el track', err)
    alert('No se pudo eliminar el track')
  }
}


  const fetchTracks = async () => {
    try {
      const response = await api.get(`/playlists/${playListId}/tracks`)
      setCurrentTrack(response.data)
      setError(null)
    } catch (error) {
      setError('Error al cargar los tracks de la playlist')
      console.error('Error al fetch de tracks', error)
    }
  }

  const fetchPlaylistInfo = async () => {
    try {
      const response = await api.get('/playlists')
      const playlist = response.data.find(p => p.id === parseInt(playListId))
      if (playlist) {
        setPlaylistName(playlist.name)
      } else {
        setPlaylistName('No encontrada')
      }
    } catch (err) {
      console.error('Error al obtener la info de la playlist', err)
      setPlaylistName('Error al cargar nombre')
    }
  }


  useEffect(() => {
    fetchTracks()
    fetchPlaylistInfo()
  }, [playListId])

  return (
    <div>
      <h2>
        Tracks de la Playlist: <strong>{playlistName}</strong>
      </h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {currentTrack.length === 0 ? (
          <p>No hay tracks disponibles.</p>
        ) : (
          currentTrack.map(track => (
            <div
              key={track.id}
              style={{
                border: '1px solid #ccc',
                margin: '10px',
                padding: '10px'
              }}
            >
              <h2>{track.title}</h2>
              <p>Duración: {track.duration} seg</p>
              <p>Rank: {track.rank}</p>
              <p>Artista: {track.artistName}</p>
              <p>Álbum: {track.albumTitle}</p>
              <img src={track.artistPicture} alt='Artist' width={100} />
              <img src={track.albumCover} alt='Album' width={100} />
               <button
      style={{ marginTop: '10px', backgroundColor: '#f87171', color: 'white', padding: '5px 10px', border: 'none', cursor: 'pointer' }}
      onClick={() => handleDeleteTrack(track.id)}
    >
      Eliminar Canción
    </button>
              
              
            </div>
            
          ))
        )}
      </div>

      <div>
        <Link to={`/search?playlistId=${playListId}`}>
          <button>Agregar Nueva Canción</button>
        </Link>
      </div>
    </div>
  )
}
