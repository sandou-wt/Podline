import PodcastImageGenerator from '../components/PodcastImageGenerator'
import Hero from '../components/hero'
export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Podcast Image Generator</h1>
      <Hero />
      <PodcastImageGenerator />
    </main>
  )
}
