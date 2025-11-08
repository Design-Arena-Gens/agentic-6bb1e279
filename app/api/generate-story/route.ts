import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-mode',
})

const monkeyNames = ['Marcel', 'Coco', 'Chippy', 'Bobo', 'Mango', 'Kiki', 'Pépito']
const discoveries = [
  'un smartphone qui traîne dans la jungle',
  'une glacière remplie de bananes gelées',
  'un miroir et croit voir un autre singe',
  'des touristes qui font du yoga',
  'une machine à café abandonnée',
  'un drone coincé dans un arbre',
  'des écouteurs sans fil et les met dans ses oreilles',
  'un chapeau de cowboy et se prend pour un shérif',
  'une trottinette électrique',
  'un robot aspirateur',
]

export async function POST() {
  try {
    const monkeyName = monkeyNames[Math.floor(Math.random() * monkeyNames.length)]
    const discovery = discoveries[Math.floor(Math.random() * discoveries.length)]

    let story = ''
    let title = ''
    let videoPrompt = ''

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-mode') {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Tu es un créateur de contenu humoristique spécialisé dans les histoires de singes vloggers. Génère des histoires drôles, courtes et engageantes.',
          },
          {
            role: 'user',
            content: `Crée une courte histoire drôle (5-7 phrases) sur un singe vlogger nommé ${monkeyName} qui découvre ${discovery}. L'histoire doit être amusante et imaginer les réactions du singe.

Réponds au format JSON suivant:
{
  "title": "Un titre accrocheur pour le vlog",
  "story": "L'histoire complète",
  "videoPrompt": "Un prompt détaillé pour générer une vidéo animée de 30 secondes montrant cette scène avec des détails visuels précis"
}`,
          },
        ],
        temperature: 0.9,
      })

      const response = completion.choices[0].message.content
      if (response) {
        const parsed = JSON.parse(response)
        title = parsed.title
        story = parsed.story
        videoPrompt = parsed.videoPrompt
      }
    } else {
      // Mode démo sans API
      title = `${monkeyName} découvre ${discovery}`
      story = `Aujourd'hui, ${monkeyName} le singe vlogger se promenait dans la jungle quand il est tombé sur ${discovery}.

Au début, ${monkeyName} était méfiant et tournait autour avec curiosité. Puis, pris d'une soudaine audace, il a décidé d'essayer de l'utiliser à sa manière unique de singe.

Les résultats ont été hilarants ! ${monkeyName} a passé toute la journée à jouer avec sa nouvelle découverte, créant des situations de plus en plus comiques. Ses grimaces et ses tentatives maladroites ont été un vrai spectacle.

À la fin de la journée, ${monkeyName} a fièrement montré sa trouvaille aux autres singes de la troupe, qui ont tous voulu essayer à leur tour !

Cette aventure restera dans les annales des meilleurs moments du vlog de ${monkeyName} ! 🐵✨`

      videoPrompt = `Animation 3D cartoon: Un singe marron expressif nommé ${monkeyName} porte une GoPro sur la tête et découvre ${discovery} dans une jungle tropicale colorée. Le singe fait des grimaces comiques, touche l'objet avec curiosité, et réagit de manière exagérée et drôle. Style cartoon moderne, éclairage naturel, ambiance joyeuse et humoristique. 30 secondes.`
    }

    return NextResponse.json({
      title,
      story,
      videoPrompt,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
