'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/dashboard')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSignIn = () => {
    router.push('/login')
  }

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleDemo = () => {
    alert('Demo coming soon! Click "Get started" to try the app.')
  }

  const handleGithub = () => {
    window.open('https://github.com/yourusername/taskflow', '_blank')
  }

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0A0F',
        color: '#E8E8F0'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(0,191,165,0.2)',
            borderTop: '3px solid #00BFA5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
        @keyframes ticker { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: #0A0A0F;
          color: #E8E8F0;
          overflow-x: hidden;
        }

        .landing-root {
          background: #0A0A0F;
          color: #E8E8F0;
          min-height: 100vh;
        }

        /* Navigation */
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 40px;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10,10,15,0.85);
          backdrop-filter: blur(16px);
          animation: fadeIn 0.5s ease both;
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }

        .nav-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00BFA5, #00A896);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 16px rgba(0,191,165,0.4);
        }

        .nav-brand {
          font-size: 14px;
          font-weight: 500;
          color: #E8E8F0;
          letter-spacing: -0.3px;
        }

        .nav-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .btn-ghost {
          padding: 7px 16px;
          font-size: 13px;
          border-radius: 8px;
          border: 0.5px solid rgba(255,255,255,0.12);
          background: transparent;
          color: #E8E8F0;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-ghost:hover {
          background: rgba(255,255,255,0.05);
        }

        .btn-primary {
          padding: 7px 18px;
          font-size: 13px;
          border-radius: 8px;
          background: linear-gradient(135deg, #00BFA5, #00A896);
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.2s, transform 0.1s;
          box-shadow: 0 4px 16px rgba(0,191,165,0.35);
        }

        .btn-primary:hover {
          opacity: 0.9;
        }

        .btn-primary:active {
          transform: scale(0.98);
        }

        /* Hero Section */
        .hero {
          padding: 64px 40px 52px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: #0A0A0F;
        }

        .hero-glow {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(0,191,165,0.15) 0%, transparent 65%);
          pointer-events: none;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 100px;
          background: rgba(0,191,165,0.12);
          border: 0.5px solid rgba(0,191,165,0.3);
          color: #80E8DC;
          font-size: 12px;
          font-weight: 500;
          margin-bottom: 24px;
          animation: fadeUp 0.6s 0.05s ease both;
        }

        .badge-dot {
          width: 5px;
          height: 5px;
          background: #00BFA5;
          border-radius: 50%;
          animation: pulse 2s infinite;
          box-shadow: 0 0 6px #00BFA5;
        }

        .hero h1 {
          font-size: 54px;
          font-weight: 500;
          line-height: 1.1;
          letter-spacing: -2px;
          margin-bottom: 20px;
          animation: fadeUp 0.7s 0.12s ease both;
          max-width: 580px;
          margin-left: auto;
          margin-right: auto;
          color: #F0F0FA;
        }

        .accent {
          background: linear-gradient(135deg, #00BFA5 0%, #00E5CC 45%, #26D0B8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-sub {
          font-size: 16px;
          color: rgba(232,232,240,0.55);
          line-height: 1.65;
          max-width: 440px;
          margin: 0 auto 36px;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        .hero-cta {
          display: flex;
          gap: 12px;
          justify-content: center;
          animation: fadeUp 0.7s 0.3s ease both;
          margin-bottom: 52px;
          flex-wrap: wrap;
        }

        .btn-large {
          padding: 13px 26px;
          font-size: 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #00BFA5, #00A896);
          color: #fff;
          border: none;
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 8px 32px rgba(0,191,165,0.4);
          transition: all 0.2s;
        }

        .btn-large:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(0,191,165,0.55);
        }

        .btn-outline-large {
          padding: 13px 26px;
          font-size: 14px;
          border-radius: 10px;
          background: rgba(255,255,255,0.04);
          color: #E8E8F0;
          border: 0.5px solid rgba(255,255,255,0.12);
          cursor: pointer;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .btn-outline-large:hover {
          background: rgba(255,255,255,0.08);
        }

        /* Features Section */
        .features-section {
          padding: 72px 40px;
          background: #0D0D14;
        }

        .section-label {
          font-size: 11px;
          font-weight: 500;
          color: #26D0B8;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          margin-bottom: 12px;
          text-align: center;
        }

        .section-title {
          font-size: 36px;
          font-weight: 500;
          text-align: center;
          letter-spacing: -1.2px;
          line-height: 1.15;
          margin-bottom: 12px;
          color: #F0F0FA;
        }

        .section-subtitle {
          font-size: 15px;
          color: rgba(232,232,240,0.45);
          text-align: center;
          max-width: 440px;
          margin: 0 auto 48px;
          line-height: 1.65;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          background: #111118;
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 28px;
          transition: all 0.25s;
        }

        .feature-card:hover {
          border-color: rgba(0,191,165,0.25);
          transform: translateY(-3px);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,191,165,0.12);
        }

        .feature-title {
          font-size: 16px;
          font-weight: 500;
          color: #E8E8F0;
          margin-bottom: 8px;
        }

        .feature-description {
          font-size: 13px;
          color: rgba(232,232,240,0.45);
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-sec {
          padding: 80px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          background: #0A0A0F;
        }

        .cta-sec h2 {
          font-size: 36px;
          font-weight: 500;
          letter-spacing: -1px;
          margin-bottom: 14px;
          color: #F0F0FA;
        }

        .cta-sec p {
          font-size: 15px;
          color: rgba(232,232,240,0.45);
          margin-bottom: 32px;
        }

        .cta-btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Footer */
        .footer {
          padding: 28px 40px;
          border-top: 0.5px solid rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #0A0A0F;
          flex-wrap: wrap;
          gap: 16px;
        }

        .footer-txt {
          font-size: 12px;
          color: rgba(232,232,240,0.3);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav {
            padding: 12px 20px;
          }

          .hero h1 {
            font-size: 36px;
          }

          .hero {
            padding: 48px 20px 40px;
          }

          .features-section {
            padding: 48px 20px;
          }

          .cta-sec {
            padding: 60px 20px;
          }

          .footer {
            justify-content: center;
            text-align: center;
          }
        }
      `}</style>

      <div className="landing-root">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <rect x="14" y="14" width="7" height="7" rx="1.5"/>
              </svg>
            </div>
            <span className="nav-brand">TaskFlow</span>
          </div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={handleSignIn}>Sign in</button>
            <button className="btn-primary" onClick={handleGetStarted}>Get started</button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-glow"></div>
          <div className="badge">
            <span className="badge-dot"></span>
            Next.js 15 + Supabase + Railway
          </div>
          <h1>
            Your team. Your tasks.<br />
            <span className="accent">Zero chaos.</span>
          </h1>
          <p className="hero-sub">
            Create projects, assign tasks, and ship faster — with role-based access enforced at the database level.
          </p>
          <div className="hero-cta">
            <button className="btn-large" onClick={handleGetStarted}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              Start for free
            </button>
            <button className="btn-outline-large" onClick={handleDemo}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10,8 16,12 10,16"/>
              </svg>
              Watch demo
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="section-label">Everything you need</div>
          <h2 className="section-title">Built for teams that ship</h2>
          <p className="section-subtitle">
            Every feature your team needs — clean interface, real-time sync, and permissions that actually hold.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#26D0B8" strokeWidth="2">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
                </svg>
              </div>
              <div className="feature-title">Task Management</div>
              <div className="feature-description">
                Create tasks with priority, assignee, and due date. Drag between Kanban columns seamlessly.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#26D0B8" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div className="feature-title">Real-time Sync</div>
              <div className="feature-description">
                Task changes propagate instantly to all team members via Supabase Realtime — no refresh needed.
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#26D0B8" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
              </div>
              <div className="feature-title">Team & Roles</div>
              <div className="feature-description">
                Invite by email. Assign Admin or Member roles enforced by Supabase Row Level Security.
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-sec">
          <h2>Ready to bring your<br />team into focus?</h2>
          <p>Deploy in minutes on Railway. No credit card. Production-ready from day one.</p>
          <div className="cta-btns">
            <button className="btn-large" onClick={handleGetStarted}>Get started free</button>
            <button className="btn-outline-large" onClick={handleGithub}>View on GitHub</button>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <span className="footer-txt">TaskFlow — Team Task Manager</span>
          <span className="footer-txt">Next.js 15 + Supabase + Railway</span>
        </footer>
      </div>
    </>
  )
}
