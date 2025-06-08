import React, { useEffect } from 'react'
import { api } from '../lib/axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'



export default function PlayListCard () {
  const [currentPlayList, setCurrentPlayList] = useState([])
  const [error, setError] = useState(null)

  const fetchPlayLists = async () => {
    try {
      const response = await api.get('playlists')
      setCurrentPlayList(response.data)
      setError(null)
    } catch (error) {
      setError('Error al cargar las playlists')
      console.error('Error al fecth de playlists', error)
    }
  }

  useEffect(() => {
    fetchPlayLists()
  }, [])

  return (
    <div>
      <h1>PLaylistsRecuperadas</h1>

      <div>
        {currentPlayList.length === 0 ? (
          <p>No hay playlists disponibles.</p>
        ) : (
          currentPlayList.map(playlist => (
            <div
              key={playlist.id}
              style={{
                border: '1px solid #ccc',
                margin: '10px',
                padding: '10px'
              }}
            >
              <h2>{playlist.name}</h2>
              <p>
                <strong>Mood:</strong> {playlist.mood}
                <span>   </span>
                <Link to={`/playlist/${playlist.id}`}>Ver Tracks</Link>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
