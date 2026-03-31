import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchAsset, type AssetSummary } from '../assets/api'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'

export default function AssetDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [asset, setAsset] = useState<AssetSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadAsset() {
      if (!id || !token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetchAsset(id, token)
        if (!cancelled) {
          setAsset(response)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load the asset.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadAsset()

    return () => {
      cancelled = true
    }
  }, [id, token])

  if (loading) {
    return <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-8 text-slate-300">Loading asset...</div>
  }

  if (!asset) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-8 text-center text-slate-400">
          <p className="text-xl font-semibold text-white">{error || 'Asset not found'}</p>
          <p className="mt-3">Double-check the asset selection or add a new asset from the dashboard.</p>
          <Link to="/dashboard">
            <Button variant="secondary" className="mt-6">Return to dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Asset detail</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{asset.title}</h1>
          <p className="mt-2 text-slate-400">{asset.details}</p>
        </div>
        <Link to="/dashboard">
          <Button variant="secondary" className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.65fr_0.35fr]">
        <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/10">
          <div className="grid gap-6">
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-6">
              <p className="text-sm text-slate-400">Stored financial data</p>
              <p className="mt-2 text-2xl font-semibold text-white">{asset.financialData || 'Not provided'}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Category</p>
                <p className="mt-2 text-lg font-semibold text-white">{asset.type}</p>
              </div>
              <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
                <p className="text-sm text-slate-400">Last updated</p>
                <p className="mt-2 text-lg font-semibold text-white">{new Date(asset.updatedAt).toLocaleString()}</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Full details</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{asset.details}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Attachment</p>
            <p className="mt-2 text-lg font-semibold text-white">{asset.hasFile ? 'Available' : 'No file uploaded'}</p>
          </div>
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">File type</p>
            <p className="mt-2 text-lg font-semibold text-white">{asset.fileMimeType || 'N/A'}</p>
          </div>
          <div className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">Created</p>
            <p className="mt-2 text-lg font-semibold text-white">{new Date(asset.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
