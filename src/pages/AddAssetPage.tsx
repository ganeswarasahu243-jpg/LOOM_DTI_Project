import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { createAsset } from '../assets/api'
import { useAuth } from '../auth/AuthContext'
import { Button } from '../components/ui/Button'

const assetTypes = ['Investment', 'Digital Asset', 'Real Estate', 'Document', 'Trust Document']

export default function AddAssetPage() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [form, setForm] = useState({ title: '', type: 'Investment', value: '', description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (user?.role === 'nominee') {
    return <Navigate to="/dashboard" replace />
  }

  const isValid = form.title.trim().length >= 3 && form.value.trim().length > 0 && form.description.trim().length >= 10

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isValid || !token) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await createAsset({
        title: form.title.trim(),
        type: form.type,
        details: form.description.trim(),
        financialData: form.value.trim(),
      }, token)

      setSuccess('Asset successfully added to your LOOM vault.')
      setForm({ title: '', type: 'Investment', value: '', description: '' })
      window.setTimeout(() => navigate(`/assets/${response.assetId}`), 500)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to publish the asset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800/80 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/10">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Add Asset</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Register a new inheritance asset.</h1>
        <p className="mt-3 max-w-2xl text-slate-400">Capture the asset details and store them in the secure LOOM vault.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 rounded-3xl border border-slate-800/80 bg-slate-950/90 p-7 shadow-xl shadow-slate-950/10">
        <label className="space-y-3 text-sm text-slate-300">
          <span className="block text-slate-400">Asset name</span>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Enter asset name"
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
          />
        </label>

        <label className="space-y-3 text-sm text-slate-300">
          <span className="block text-slate-400">Asset type</span>
          <select
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
          >
            {assetTypes.map((type) => (
              <option key={type} value={type} className="bg-slate-950 text-white">
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-3 text-sm text-slate-300">
          <span className="block text-slate-400">Financial data or estimated value</span>
          <input
            value={form.value}
            onChange={(event) => setForm((prev) => ({ ...prev, value: event.target.value }))}
            placeholder="$120,000"
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
          />
        </label>

        <label className="space-y-3 text-sm text-slate-300">
          <span className="block text-slate-400">Description</span>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={5}
            placeholder="Describe the asset and inheritance instructions."
            className="w-full rounded-3xl border border-slate-800/80 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15"
          />
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-400">{isValid ? 'Ready to publish.' : 'Complete all fields to continue.'}</div>
          <Button type="submit" disabled={!isValid || loading} className="w-full sm:w-auto">
            {loading ? 'Publishing...' : 'Publish asset'}
          </Button>
        </div>

        {error ? (
          <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}

        {success ? (
          <div className="rounded-3xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-200">
            {success}
          </div>
        ) : null}
      </form>
    </div>
  )
}
