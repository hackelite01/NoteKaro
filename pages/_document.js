import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta name="theme-color" content="#d90429" />
        <meta name="color-scheme" content="light dark" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://notekaro.vercel.app" />
        <meta name="twitter:title" content="NoteKaro" />
        <meta
          name="twitter:description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta
          name="twitter:image"
          content="https://notekaro.vercel.app/logo192.png"
        />
        <meta name="twitter:creator" content="@the.mayank.rajput" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="NoteKaro" />
        <meta
          property="og:description"
          content="Now Keep your all important notes, links and share with your friends"
        />
        <meta property="og:site_name" content="NoteKaro" />
        <meta property="og:url" content="https://notekaro.vercel.app" />
        <meta
          property="og:image"
          content="https://notekaro.vercel.app/logo512.png"
        />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
