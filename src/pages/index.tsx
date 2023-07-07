import Image from 'next/image'
import { Inter } from 'next/font/google'
import Component from './auth'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
        <Component />
    </div>
  )
}
