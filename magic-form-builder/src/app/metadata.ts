import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Magic Form Builder',
  description: 'Create professional-grade forms with ease using this intuitive Magic Form Builder.',
  keywords: ['form builder', 'custom forms', 'survey creator', 'questionnaire maker'],
  authors: [{ name: 'Form Builder Developer' }],
  openGraph: {
    title: 'Magic Form Builder',
    description: 'Create professional-grade forms with ease using this intuitive Magic Form Builder.',
    siteName: 'Magic Form Builder',
    images: [
      {
        url: 'https://via.placeholder.com/1200x630.png?text=Magic+Form+Builder',
        width: 1200,
        height: 630,
        alt: 'Magic Form Builder Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Magic Form Builder',
    description: 'Create professional-grade forms with ease using this intuitive Magic Form Builder.',
    images: ['https://via.placeholder.com/1200x600.png?text=Magic+Form+Builder'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}
