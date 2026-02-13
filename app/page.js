'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Bookmark,
  Plus,
  Trash2,
  LogOut,
  ExternalLink,
  Loader2,
  Globe,
  Zap,
  Search,
  LinkIcon
} from 'lucide-react'

const supabase = createClient()

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

function LoginPage({ onSignIn, loading }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Bookmark className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Smart Bookmarks
          </h1>
          <p className="mt-2 text-muted-foreground">
            Save, organize, and sync your bookmarks in real-time
          </p>
        </div>

        <Card className="shadow-lg border-0 shadow-blue-100/50">
          <CardContent className="pt-6 pb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Globe className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Save any URL with one click</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Real-time sync across all your tabs</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <LinkIcon className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">Private & secure - only you can see your bookmarks</span>
              </div>

              <Button
                onClick={onSignIn}
                disabled={loading}
                className="w-full h-12 text-base font-medium gap-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm"
                variant="outline"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Sign in with Google
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your bookmarks are private and only visible to you.
        </p>
      </div>
    </div>
  )
}

function BookmarkCard({ bookmark, onDelete, deleting }) {
  const faviconUrl = (() => {
    try {
      const url = new URL(bookmark.url)
      return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`
    } catch {
      return null
    }
  })()

  const displayUrl = (() => {
    try {
      const url = new URL(bookmark.url)
      return url.hostname.replace('www.', '')
    } catch {
      return bookmark.url
    }
  })()

  const timeAgo = (() => {
    const now = new Date()
    const created = new Date(bookmark.created_at)
    const diffMs = now - created
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return created.toLocaleDateString()
  })()

  return (
    <Card className="group animate-fade-in hover:shadow-md transition-all duration-200 border border-border/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center mt-0.5">
            {faviconUrl ? (
              <img
                src={faviconUrl}
                alt=""
                className="w-5 h-5"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <Globe
              className="w-5 h-5 text-muted-foreground"
              style={{ display: faviconUrl ? 'none' : 'block' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate text-foreground">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1 truncate"
            >
              <span className="truncate">{displayUrl}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
            <span className="text-xs text-muted-foreground/60 mt-1 block">
              {timeAgo}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(bookmark.id)}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Dashboard({ user, bookmarks, onSignOut, onAddBookmark, onDeleteBookmark, adding, deletingId }) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim() || !title.trim()) {
      toast.error('Please fill in both URL and title')
      return
    }

    let finalUrl = url.trim()
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl
    }

    const success = await onAddBookmark(finalUrl, title.trim())
    if (success) {
      setUrl('')
      setTitle('')
    }
  }

  const filteredBookmarks = bookmarks.filter((b) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      b.title.toLowerCase().includes(q) ||
      b.url.toLowerCase().includes(q)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm">Smart Bookmarks</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
              Live
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user.user_metadata?.avatar_url ? (
                <img
                  src={user.user_metadata.avatar_url}
                  alt=""
                  className="w-7 h-7 rounded-full"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {(user.email || '?')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={onSignOut}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Add Bookmark Form */}
        <Card className="mb-6 border-0 shadow-md shadow-blue-100/30">
          <CardContent className="pt-5 pb-5">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Bookmark title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="flex-1 h-10"
                  disabled={adding}
                />
                <Input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 h-10"
                  disabled={adding}
                />
                <Button type="submit" disabled={adding} className="h-10 px-4 gap-1.5">
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search */}
        {bookmarks.length > 3 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        )}

        {/* Bookmarks List */}
        <div className="space-y-2">
          {filteredBookmarks.length === 0 && bookmarks.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
                <Bookmark className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No bookmarks yet</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add your first bookmark above to get started
              </p>
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">No bookmarks match your search</p>
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onDelete={onDeleteBookmark}
                deleting={deletingId === bookmark.id}
              />
            ))
          )}
        </div>

        {bookmarks.length > 0 && (
          <p className="text-center text-xs text-muted-foreground mt-6">
            {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        )}
      </main>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)

  // Check for auth errors in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === 'auth') {
      toast.error('Authentication failed. Please make sure Google OAuth is configured in Supabase.')
      window.history.replaceState({}, '', '/')
    }
  }, [])

  // Initialize auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        if (user) {
          await fetchBookmarks(user.id)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await fetchBookmarks(currentUser.id)
        } else {
          setBookmarks([])
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('bookmarks-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchBookmarks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Fetch error:', error)
        if (error.code === '42P01') {
          setError('table_missing')
        }
        return
      }
      setBookmarks(data || [])
      setError(null)
    } catch (err) {
      console.error('Fetch bookmarks error:', err)
    }
  }

  const signIn = async () => {
    setSigningIn(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error('Sign in failed: ' + error.message)
        setSigningIn(false)
      }
    } catch (err) {
      toast.error('Sign in failed')
      setSigningIn(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setBookmarks([])
    toast.success('Signed out successfully')
  }

  const addBookmark = async (url, title) => {
    setAdding(true)
    try {
      const { error } = await supabase.from('bookmarks').insert({
        user_id: user.id,
        url,
        title,
      })

      if (error) {
        toast.error('Failed to add bookmark: ' + error.message)
        setAdding(false)
        return false
      }

      toast.success('Bookmark added!')
      setAdding(false)
      return true
    } catch (err) {
      toast.error('Failed to add bookmark')
      setAdding(false)
      return false
    }
  }

  const deleteBookmark = async (id) => {
    setDeletingId(id)
    try {
      const { error } = await supabase.from('bookmarks').delete().eq('id', id)

      if (error) {
        toast.error('Failed to delete bookmark')
      } else {
        setBookmarks((prev) => prev.filter((b) => b.id !== id))
        toast.success('Bookmark deleted')
      }
    } catch (err) {
      toast.error('Failed to delete bookmark')
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    )
  }

  if (error === 'table_missing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <Card className="max-w-lg w-full">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-2">Database Setup Required</h2>
            <p className="text-sm text-muted-foreground mb-4">
              The bookmarks table hasn't been created yet. Please run the following SQL in your Supabase SQL Editor:
            </p>
            <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto whitespace-pre">
{`CREATE TABLE public.bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE public.bookmarks
  REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime
  ADD TABLE public.bookmarks;`}
            </pre>
            <Button onClick={() => window.location.reload()} className="mt-4 w-full">
              I've run the SQL - Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} loading={signingIn} />
  }

  return (
    <Dashboard
      user={user}
      bookmarks={bookmarks}
      onSignOut={signOut}
      onAddBookmark={addBookmark}
      onDeleteBookmark={deleteBookmark}
      adding={adding}
      deletingId={deletingId}
    />
  )
}

export default App
