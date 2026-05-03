import { createClient } from '@/lib/supabase/server'

export default async function TestDashboardPage() {
  try {
    const supabase = await createClient()
    
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Auth Error</h1>
          <pre className="mt-4 p-4 bg-red-50 rounded">
            {JSON.stringify(userError, null, 2)}
          </pre>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold">No User</h1>
          <p className="mt-2">You are not logged in.</p>
          <a href="/login" className="text-blue-600 underline">Go to Login</a>
        </div>
      )
    }

    // Test database connection
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .limit(5)

    return (
      <div className="p-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-green-600">✅ Dashboard Working!</h1>
          <p className="mt-2 text-slate-600">All systems operational</p>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded">
            <h2 className="font-bold">User Info:</h2>
            <pre className="mt-2 text-sm">{JSON.stringify(user, null, 2)}</pre>
          </div>

          <div className="p-4 bg-green-50 rounded">
            <h2 className="font-bold">Database Connection:</h2>
            {projectsError ? (
              <pre className="mt-2 text-sm text-red-600">
                {JSON.stringify(projectsError, null, 2)}
              </pre>
            ) : (
              <p className="mt-2 text-green-600">✅ Connected - Found {projects?.length || 0} projects</p>
            )}
          </div>

          <div className="p-4 bg-purple-50 rounded">
            <h2 className="font-bold">Environment:</h2>
            <ul className="mt-2 space-y-1 text-sm">
              <li>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
              <li>Supabase Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
              <li>App URL: {process.env.NEXT_PUBLIC_APP_URL || 'Not set'}</li>
            </ul>
          </div>
        </div>

        <div className="space-x-4">
          <a href="/dashboard" className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Go to Dashboard
          </a>
          <a href="/projects" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Go to Projects
          </a>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Critical Error</h1>
        <pre className="mt-4 p-4 bg-red-50 rounded overflow-auto">
          {error instanceof Error ? error.message : JSON.stringify(error, null, 2)}
        </pre>
      </div>
    )
  }
}
