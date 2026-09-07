import fs from 'fs'
import path from 'path'
import React from 'react'

export default function TermsPage() {
  const mdPath = path.join(process.cwd(), 'public', 'terms.md')
  let content = 'Terms and Conditions not provided. Please add your policy to public/terms.md.'
  try {
    content = fs.readFileSync(mdPath, 'utf8')
  } catch (e) {
    // keep default message
  }

  const paragraphs = content.split(/\n{2,}/).map(p => p.replace(/\n/g, '<br/>'))

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold mb-6">Terms &amp; Conditions</h1>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-4 text-base leading-7" dangerouslySetInnerHTML={{ __html: p }} />
      ))}
    </main>
  )
}
