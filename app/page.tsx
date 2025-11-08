'use client'

import { useState } from 'react'

interface Story {
  title: string
  story: string
  videoPrompt: string
  timestamp: string
}

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [story, setStory] = useState<Story | null>(null)
  const [videoGeneration, setVideoGeneration] = useState<string>('')
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const generateStory = async () => {
    setLoading(true)
    setError('')
    setStory(null)
    setVideoGeneration('')
    setUploadStatus('')

    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération de l\'histoire')
      }

      const data = await response.json()
      setStory(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const generateAndUploadVideo = async () => {
    if (!story) return

    setVideoGeneration('Génération des 3 vidéos en cours...')
    setUploadStatus('')

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: story.videoPrompt,
          title: story.title,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération des vidéos')
      }

      const data = await response.json()
      setVideoGeneration(data.message)
      setUploadStatus(data.uploadStatus)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
            🐵 Agent AI Vlog Singe
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Génère automatiquement des histoires drôles de singe vlogger et publie sur YouTube
          </p>

          <button
            onClick={generateStory}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? '⏳ Génération en cours...' : '🎬 Générer un nouveau vlog'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg">
            <p className="font-bold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {story && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">📖 {story.title}</h2>
            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 whitespace-pre-line">{story.story}</p>
            </div>

            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6 rounded">
              <p className="font-semibold text-indigo-800 mb-2">🎥 Prompt vidéo :</p>
              <p className="text-indigo-700 text-sm">{story.videoPrompt}</p>
            </div>

            <button
              onClick={generateAndUploadVideo}
              disabled={!!videoGeneration}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {videoGeneration ? '⏳ Génération en cours...' : '🎬 Générer 3 vidéos et publier sur YouTube'}
            </button>
          </div>
        )}

        {videoGeneration && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">🎬 Statut de génération vidéo</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
              <p className="text-blue-700">{videoGeneration}</p>
            </div>

            {uploadStatus && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <p className="font-semibold text-green-800 mb-2">✅ Publication YouTube :</p>
                <p className="text-green-700">{uploadStatus}</p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white/90 rounded-xl p-6 backdrop-blur">
          <h3 className="text-lg font-bold mb-3 text-gray-800">ℹ️ Comment ça marche ?</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Cliquez sur "Générer un nouveau vlog" pour créer une histoire drôle</li>
            <li>L'IA génère une histoire originale d'un singe vlogger découvrant quelque chose d'amusant</li>
            <li>Cliquez sur "Générer 3 vidéos" pour créer les vidéos avec l'IA</li>
            <li>Les 3 vidéos sont automatiquement publiées sur YouTube</li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Pour que la publication YouTube fonctionne, vous devez configurer vos clés API dans les variables d'environnement (OPENAI_API_KEY pour l'IA et les credentials Google OAuth pour YouTube).
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
