"use client"

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function SubmitInitialAbstractPage() {
  const { data: cfg } = useSWR('/api/abstracts/config', fetcher)
  const [title, setTitle] = useState('')
  const [track, setTrack] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const submit = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/abstracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, track, category, subcategory })
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message || 'Failed')
      if (file) {
        const fd = new FormData()
        fd.append('abstractId', data.data.abstractId)
        fd.append('stage', 'initial')
        fd.append('file', file)
        const up = await fetch('/api/abstracts/upload', { method: 'POST', body: fd })
        const upd = await up.json()
        if (!upd.success) throw new Error(upd.message || 'Upload failed')
      }
      setMessage('Submitted')
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="container mx-auto py-8 space-y-4">
        <h1 className="text-xl font-semibold">Submit Initial Abstract</h1>
        <input value={title} onChange={e => setTitle(e.target.value)} className="border p-2 w-full" placeholder="Title" />
        <select value={track} onChange={e => { setTrack(e.target.value); setCategory(''); setSubcategory('') }} className="border p-2">
          <option value="">Select Track</option>
          {(cfg?.data?.tracks || []).filter((t: any) => t.enabled).map((t: any) => (
            <option key={t.key} value={t.key}>{t.label}</option>
          ))}
        </select>
        {track && (
          <select value={category} onChange={e => { setCategory(e.target.value); setSubcategory('') }} className="border p-2">
            <option value="">Select Category (optional)</option>
            {(cfg?.data?.tracks?.find((t: any) => t.key === track)?.categories || []).filter((c: any) => c.enabled).map((c: any) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        )}
        {category && (
          <select value={subcategory} onChange={e => setSubcategory(e.target.value)} className="border p-2">
            <option value="">Select Subcategory (optional)</option>
            {(cfg?.data?.tracks?.find((t: any) => t.key === track)?.categories?.find((c: any) => c.key === category)?.subcategories || []).filter((s: any) => s.enabled).map((s: any) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        )}
        <input type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={e => setFile(e.target.files?.[0] || null)} />
        <button disabled={loading} onClick={submit} className="px-4 py-2 bg-orange-600 text-white rounded">
          {loading ? 'Submitting...' : 'Submit'}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>
    </ProtectedRoute>
  )
}


