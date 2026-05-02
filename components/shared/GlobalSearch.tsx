'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Loader2, FileText, CheckSquare } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface SearchResult {
  projects: Array<{
    id: string
    name: string
    description: string | null
  }>
  tasks: Array<{
    id: string
    title: string
    description: string | null
    status: string
    project_id: string
    projects: {
      name: string
    }
  }>
}

export function GlobalSearch() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.length < 3) {
      setResults(null)
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
          setIsOpen(true)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}/board`)
    setIsOpen(false)
    setQuery('')
  }

  const handleTaskClick = (projectId: string) => {
    router.push(`/projects/${projectId}/board`)
    setIsOpen(false)
    setQuery('')
  }

  const totalResults = (results?.projects.length || 0) + (results?.tasks.length || 0)

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search projects and tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 3 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
        )}
      </div>

      {isOpen && results && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 max-h-96 overflow-y-auto z-50">
          {totalResults === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="p-2">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="mb-2">
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">
                    Projects ({results.projects.length})
                  </div>
                  {results.projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectClick(project.id)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                            {project.name}
                          </p>
                          {project.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {project.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Tasks */}
              {results.tasks.length > 0 && (
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase">
                    Tasks ({results.tasks.length})
                  </div>
                  {results.tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task.project_id)}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <CheckSquare className="h-4 w-4 text-slate-400 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-slate-900 dark:text-white truncate">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {task.status.replace('_', ' ')}
                            </Badge>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {task.projects.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
