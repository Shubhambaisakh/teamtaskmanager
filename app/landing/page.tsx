'use client'

import { useEffect } from 'react';

const styles = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
  @keyframes ticker { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
  @keyframes glow { 0%,100%{opacity:0.5;} 50%{opacity:1;} }
  @keyframes borderGlow { 0%,100%{box-shadow:0 0 0 0 rgba(0,191,165,0);} 50%{box-shadow:0 0 24px 4px rgba(0,191,165,0.25);} }
  @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-6px);} }

  *{box-sizing:border-box;margin:0;padding:0;}

  .root{
    font-family:var(--font-sans);
    background:#0A0A0F;
    color:#E8E8F0;
    overflow:hidden;
  }

  .s1{background:#0A0A0F;}
  .s2{background:#111118;}
  .s3{background:#16161F;}
  .border{border:0.5px solid rgba(255,255,255,0.07);}
  .border-m{border:0.5px solid rgba(255,255,255,0.12);}

  .nav{
    display:flex;align-items:center;justify-content:space-between;
    padding:16px 40px;
    border-bottom:0.5px solid rgba(255,255,255,0.06);
    position:sticky;top:0;z-index:100;
    background:rgba(10,10,15,0.85);
    backdrop-filter:blur(16px);
    animation:fadeIn 0.5s ease both;
  }
  .nav-logo{display:flex;align-items:center;gap:10px;}
  .nav-icon{
    width:30px;height:30px;border-radius:8px;
    background:linear-gradient(135deg,#00BFA5,#00A896);
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 0 16px rgba(0,191,165,0.4);
  }
  .nav-brand{font-size:14px;font-weight:500;color:#E8E8F0;letter-spacing:-0.3px;}
  .nav-links{display:flex;gap:28px;}
  .nav-links a{font-size:13px;color:rgba(232,232,240,0.5);text-decoration:none;transition:color 0.2s;}
  .nav-links a:hover{color:#E8E8F0;}
  .nav-actions{display:flex;gap:10px;align-items:center;}
  .btn-ghost{
    padding:7px 16px;font-size:13px;border-radius:8px;
    border:0.5px solid rgba(255,255,255,0.12);
    background:transparent;color:#E8E8F0;cursor:pointer;
    transition:background 0.2s;
  }
  .btn-ghost:hover{background:rgba(255,255,255,0.05);}
  .btn-primary{
    padding:7px 18px;font-size:13px;border-radius:8px;
    background:linear-gradient(135deg,#00BFA5,#00A896);
    color:#fff;border:none;cursor:pointer;font-weight:500;
    transition:opacity 0.2s,transform 0.1s;
    box-shadow:0 4px 16px rgba(0,191,165,0.35);
  }
  .btn-primary:hover{opacity:0.9;}
  .btn-primary:active{transform:scale(0.98);}

  .hero{
    padding:64px 40px 52px;
    text-align:center;position:relative;overflow:hidden;
  }
  .hero-glow{
    position:absolute;top:-80px;left:50%;transform:translateX(-50%);
    width:600px;height:400px;
    background:radial-gradient(ellipse,rgba(0,191,165,0.15) 0%,transparent 65%);
    pointer-events:none;
  }
  .hero-glow2{
    position:absolute;bottom:-40px;left:20%;
    width:300px;height:300px;
    background:radial-gradient(ellipse,rgba(0,168,150,0.08) 0%,transparent 70%);
    pointer-events:none;
  }
  .badge{
    display:inline-flex;align-items:center;gap:6px;
    padding:5px 14px;border-radius:100px;
    background:rgba(0,191,165,0.12);
    border:0.5px solid rgba(0,191,165,0.3);
    color:#80E8DC;font-size:12px;font-weight:500;
    margin-bottom:24px;
    animation:fadeUp 0.6s 0.05s ease both;
  }
  .badge-dot{width:5px;height:5px;background:#00BFA5;border-radius:50%;animation:pulse 2s infinite;box-shadow:0 0 6px #00BFA5;}
  .hero h1{
    font-size:54px;font-weight:500;line-height:1.1;
    letter-spacing:-2px;margin-bottom:20px;
    animation:fadeUp 0.7s 0.12s ease both;
    max-width:580px;margin-left:auto;margin-right:auto;
    color:#F0F0FA;
  }
  .accent{
    background:linear-gradient(135deg,#00BFA5 0%,#00E5CC 45%,#26D0B8 100%);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .hero-sub{
    font-size:16px;color:rgba(232,232,240,0.55);line-height:1.65;
    max-width:440px;margin:0 auto 36px;
    animation:fadeUp 0.7s 0.2s ease both;
  }
  .hero-cta{
    display:flex;gap:12px;justify-content:center;
    animation:fadeUp 0.7s 0.3s ease both;margin-bottom:52px;
  }
  .btn-large{
    padding:13px 26px;font-size:14px;border-radius:10px;
    background:linear-gradient(135deg,#00BFA5,#00A896);
    color:#fff;border:none;cursor:pointer;font-weight:500;
    display:flex;align-items:center;gap:8px;
    box-shadow:0 8px 32px rgba(0,191,165,0.4);
    transition:all 0.2s;
  }
  .btn-large:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(0,191,165,0.55);}
  .btn-outline-large{
    padding:13px 26px;font-size:14px;border-radius:10px;
    background:rgba(255,255,255,0.04);
    color:#E8E8F0;border:0.5px solid rgba(255,255,255,0.12);
    cursor:pointer;font-weight:500;display:flex;align-items:center;gap:8px;
    transition:all 0.2s;
  }
  .btn-outline-large:hover{background:rgba(255,255,255,0.08);}

  .hero-mockup{
    animation:scaleIn 0.9s 0.4s ease both;
    border-radius:16px;border:0.5px solid rgba(255,255,255,0.08);
    overflow:hidden;max-width:640px;margin:0 auto;
    background:#111118;
    box-shadow:0 40px 100px rgba(0,0,0,0.7),0 0 0 0.5px rgba(255,255,255,0.05);
  }
  .mockup-bar{
    background:#0E0E16;border-bottom:0.5px solid rgba(255,255,255,0.06);
    padding:10px 16px;display:flex;align-items:center;gap:8px;
  }
  .dot{width:10px;height:10px;border-radius:50%;}
  .dot-r{background:#FF5F56;} .dot-y{background:#FFBD2E;} .dot-g{background:#27C93F;}
  .mockup-url{
    flex:1;background:rgba(255,255,255,0.05);border-radius:6px;
    padding:4px 12px;font-size:11px;color:rgba(232,232,240,0.35);
    border:0.5px solid rgba(255,255,255,0.06);text-align:center;
  }
  .mockup-body{display:flex;min-height:300px;}
  .mockup-sidebar{
    width:136px;background:#0E0E16;
    border-right:0.5px solid rgba(255,255,255,0.06);padding:14px 10px;
  }
  .sb-logo{display:flex;align-items:center;gap:8px;margin-bottom:18px;}
  .sb-logo-icon{width:20px;height:20px;border-radius:5px;background:linear-gradient(135deg,#00BFA5,#00A896);}
  .sb-logo-text{font-size:11px;font-weight:500;color:#E8E8F0;}
  .sb-item{
    padding:6px 8px;border-radius:6px;font-size:10px;
    color:rgba(232,232,240,0.4);margin-bottom:2px;
    display:flex;align-items:center;gap:6px;
  }
  .sb-item.active{background:rgba(0,191,165,0.15);color:#26D0B8;font-weight:500;}
  .si-d{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;}
  .mockup-main{flex:1;padding:14px;overflow:hidden;}
  .m-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .m-title{font-size:12px;font-weight:500;color:#E8E8F0;}
  .m-badge{font-size:9px;padding:2px 8px;border-radius:100px;background:rgba(0,191,165,0.15);color:#26D0B8;}
  .stats-row{display:flex;gap:6px;margin-bottom:12px;}
  .sc{
    flex:1;background:rgba(255,255,255,0.03);
    border:0.5px solid rgba(255,255,255,0.07);border-radius:8px;padding:8px;
  }
  .sc-l{font-size:8px;color:rgba(232,232,240,0.4);margin-bottom:2px;}
  .sc-v{font-size:17px;font-weight:500;line-height:1;}
  .cv-blue{color:#26D0B8;} .cv-green{color:#34D399;} .cv-amber{color:#FBB13C;} .cv-red{color:#F87171;}
  .k-cols{display:flex;gap:6px;}
  .k-col{flex:1;}
  .k-col-h{font-size:8px;font-weight:500;color:rgba(232,232,240,0.35);margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;}
  .kc{
    background:rgba(255,255,255,0.03);border:0.5px solid rgba(255,255,255,0.07);
    border-radius:7px;padding:7px;margin-bottom:5px;transition:transform 0.2s;
  }
  .kc:hover{transform:translateY(-2px);background:rgba(255,255,255,0.05);}
  .kc-t{font-size:9px;font-weight:500;color:#E8E8F0;margin-bottom:4px;line-height:1.3;}
  .kc-m{display:flex;align-items:center;justify-content:space-between;}
  .kp{font-size:7px;padding:1px 5px;border-radius:3px;font-weight:500;}
  .kp-h{background:rgba(248,113,113,0.15);color:#F87171;}
  .kp-m{background:rgba(251,177,60,0.15);color:#FBB13C;}
  .kp-l{background:rgba(52,211,153,0.15);color:#34D399;}
  .kp-c{background:rgba(0,229,204,0.15);color:#00E5CC;}
  .kav{width:15px;height:15px;border-radius:50%;font-size:6px;font-weight:500;display:flex;align-items:center;justify-content:center;color:#fff;}
  .k-due{font-size:7px;color:rgba(232,232,240,0.35);}
  .k-od{font-size:7px;color:#F87171;font-weight:500;}

  .ticker-wrap{
    overflow:hidden;
    border-top:0.5px solid rgba(255,255,255,0.06);
    border-bottom:0.5px solid rgba(255,255,255,0.06);
    padding:11px 0;background:#0D0D14;
  }
  .ticker-inner{display:flex;width:max-content;animation:ticker 24s linear infinite;}
  .ticker-item{
    display:flex;align-items:center;gap:8px;padding:0 28px;
    font-size:11px;color:rgba(232,232,240,0.35);white-space:nowrap;
  }
  .tsep{color:rgba(255,255,255,0.12);}

  .section{padding:72px 40px;}
  .s-label{font-size:11px;font-weight:500;color:#26D0B8;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:12px;text-align:center;}
  .s-title{font-size:36px;font-weight:500;text-align:center;letter-spacing:-1.2px;line-height:1.15;margin-bottom:12px;color:#F0F0FA;}
  .s-sub{font-size:15px;color:rgba(232,232,240,0.45);text-align:center;max-width:440px;margin:0 auto 48px;line-height:1.65;}

  .feats{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
  .fc{
    background:#111118;border:0.5px solid rgba(255,255,255,0.07);
    border-radius:14px;padding:24px;transition:all 0.25s;position:relative;overflow:hidden;
  }
  .fc::before{
    content:'';position:absolute;inset:0;border-radius:14px;opacity:0;
    background:linear-gradient(135deg,rgba(0,191,165,0.06),rgba(0,168,150,0.04));
    transition:opacity 0.3s;
  }
  .fc:hover::before{opacity:1;}
  .fc:hover{border-color:rgba(0,191,165,0.25);transform:translateY(-3px);}
  .fi{width:40px;height:40px;border-radius:10px;margin-bottom:16px;display:flex;align-items:center;justify-content:center;}
  .fi svg{width:20px;height:20px;}
  .fi-v{background:rgba(0,191,165,0.12);}
  .fi-g{background:rgba(52,211,153,0.1);}
  .fi-a{background:rgba(251,177,60,0.1);}
  .fi-p{background:rgba(244,114,182,0.1);}
  .fi-t{background:rgba(34,211,238,0.1);}
  .fi-u{background:rgba(0,229,204,0.1);}
  .ft{font-size:14px;font-weight:500;color:#E8E8F0;margin-bottom:8px;}
  .fd{font-size:13px;color:rgba(232,232,240,0.45);line-height:1.6;}

  .rt-demo{
    max-width:540px;margin:0 auto;
    background:#111118;border:0.5px solid rgba(255,255,255,0.08);
    border-radius:16px;overflow:hidden;
    box-shadow:0 24px 60px rgba(0,0,0,0.5);
  }
  .rt-h{
    padding:12px 20px;border-bottom:0.5px solid rgba(255,255,255,0.07);
    display:flex;align-items:center;justify-content:space-between;
  }
  .rt-ht{font-size:12px;font-weight:500;color:#E8E8F0;}
  .rt-live{display:flex;align-items:center;gap:5px;font-size:10px;color:#34D399;font-weight:500;}
  .live-dot{width:5px;height:5px;background:#34D399;border-radius:50%;animation:pulse 1.5s infinite;box-shadow:0 0 6px #34D399;}
  .rt-body{padding:14px;}
  .rt-task{
    display:flex;align-items:center;gap:10px;
    padding:9px 12px;border-radius:8px;
    background:rgba(255,255,255,0.03);border:0.5px solid rgba(255,255,255,0.07);
    margin-bottom:7px;transition:all 0.4s;
  }
  .rt-task.hl{border-color:rgba(0,191,165,0.4);background:rgba(0,191,165,0.08);}
  .rt-tn{flex:1;font-size:11px;font-weight:500;color:#E8E8F0;}
  .rt-st{font-size:9px;padding:3px 8px;border-radius:100px;font-weight:500;transition:all 0.4s;}
  .rs-todo{background:rgba(255,255,255,0.05);color:rgba(232,232,240,0.45);border:0.5px solid rgba(255,255,255,0.1);}
  .rs-prog{background:rgba(251,177,60,0.12);color:#FBB13C;}
  .rs-review{background:rgba(0,191,165,0.15);color:#26D0B8;}
  .rs-done{background:rgba(52,211,153,0.12);color:#34D399;}
  .rt-usr{width:22px;height:22px;border-radius:50%;font-size:8px;font-weight:500;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .rt-foot{padding:10px 16px;border-top:0.5px solid rgba(255,255,255,0.06);font-size:10px;color:rgba(232,232,240,0.3);}

  .roles-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:580px;margin:0 auto;}
  .role-card{
    background:#111118;border:0.5px solid rgba(255,255,255,0.08);
    border-radius:14px;padding:28px;
  }
  .rb{display:inline-flex;padding:4px 12px;border-radius:100px;font-size:11px;font-weight:500;margin-bottom:16px;}
  .rb-a{background:rgba(0,191,165,0.15);color:#26D0B8;}
  .rb-m{background:rgba(52,211,153,0.12);color:#34D399;}
  .role-t{font-size:15px;font-weight:500;color:#E8E8F0;margin-bottom:12px;}
  .role-list{list-style:none;}
  .role-list li{font-size:12px;color:rgba(232,232,240,0.5);padding:5px 0;display:flex;align-items:flex-start;gap:8px;line-height:1.5;}
  .chk{color:#00BFA5;flex-shrink:0;font-size:12px;margin-top:1px;}
  .chk.g{color:#34D399;}

  .tech-grid{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:40px;}
  .tech-pill{
    padding:9px 18px;border-radius:100px;
    border:0.5px solid rgba(255,255,255,0.08);
    background:#111118;
    font-size:13px;font-weight:500;color:#C4C4D4;
    display:flex;align-items:center;gap:8px;transition:all 0.2s;
  }
  .tech-pill:hover{border-color:rgba(0,191,165,0.3);color:#E8E8F0;transform:translateY(-2px);}
  .td{width:7px;height:7px;border-radius:50%;}

  .big-stats{display:flex;justify-content:center;gap:48px;flex-wrap:wrap;margin-bottom:52px;}
  .big-stat{text-align:center;}
  .big-num{
    font-size:48px;font-weight:500;letter-spacing:-2px;
    background:linear-gradient(135deg,#00BFA5,#00E5CC);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  }
  .big-lbl{font-size:13px;color:rgba(232,232,240,0.4);margin-top:4px;}
  .prog-wrap{max-width:500px;margin:0 auto;}
  .prog-row{margin-bottom:16px;}
  .prog-meta{display:flex;justify-content:space-between;margin-bottom:6px;}
  .prog-name{font-size:12px;color:rgba(232,232,240,0.45);}
  .prog-val{font-size:12px;font-weight:500;color:#E8E8F0;}
  .prog-bar{height:3px;border-radius:2px;background:rgba(255,255,255,0.07);overflow:hidden;}
  .prog-fill{height:100%;border-radius:2px;transition:width 2s ease;}

  .cta-sec{
    padding:80px 40px;text-align:center;position:relative;overflow:hidden;
    background:#0D0D14;
  }
  .cta-glow{
    position:absolute;top:0;left:50%;transform:translateX(-50%);
    width:500px;height:300px;
    background:radial-gradient(ellipse,rgba(0,191,165,0.12) 0%,transparent 70%);
    pointer-events:none;
  }
  .cta-sec h2{font-size:36px;font-weight:500;letter-spacing:-1px;margin-bottom:14px;color:#F0F0FA;}
  .cta-sec p{font-size:15px;color:rgba(232,232,240,0.45);margin-bottom:32px;}
  .cta-btns{display:flex;gap:12px;justify-content:center;}

  .footer{
    padding:28px 40px;border-top:0.5px solid rgba(255,255,255,0.06);
    display:flex;align-items:center;justify-content:space-between;
    background:#0A0A0F;
  }
  .footer-brand{display:flex;align-items:center;gap:8px;}
  .footer-txt{font-size:12px;color:rgba(232,232,240,0.3);}
  .footer-links{display:flex;gap:20px;}
  .footer-links a{font-size:12px;color:rgba(232,232,240,0.3);text-decoration:none;transition:color 0.2s;}
  .footer-links a:hover{color:#E8E8F0;}

  .anim-fu{animation:fadeUp 0.6s ease both;opacity:0;}
  .d1{animation-delay:0.1s;} .d2{animation-delay:0.2s;} .d3{animation-delay:0.3s;}
  .d4{animation-delay:0.4s;} .d5{animation-delay:0.5s;}
`;

interface RealtimeUpdate {
  id: string;
  sid: string;
  cls: string;
  txt: string;
  log: string;
}

export default function TeamTaskManager() {
  useEffect(() => {
    // Scroll-triggered fade-up animations
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationPlayState = 'running';
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll('.anim-fu').forEach((el) => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      obs.observe(el);
    });

    // Realtime task-update simulation
    const updates: RealtimeUpdate[] = [
      { id: 'rt1', sid: 's1', cls: 'rs-prog',   txt: 'In progress', log: 'AK moved "CI/CD pipeline" → In progress' },
      { id: 'rt3', sid: 's3', cls: 'rs-done',   txt: 'Done',        log: 'NP moved "DB schema design" → Done' },
      { id: 'rt2', sid: 's2', cls: 'rs-review', txt: 'In review',   log: 'SR moved "Auth integration" → In review' },
      { id: 'rt1', sid: 's1', cls: 'rs-review', txt: 'In review',   log: 'AK moved "CI/CD pipeline" → In review' },
      { id: 'rt2', sid: 's2', cls: 'rs-done',   txt: 'Done',        log: 'SR moved "Auth integration" → Done' },
    ];
    let ui = 0;

    const tick = () => {
      if (ui >= updates.length) ui = 0;
      const u = updates[ui++];
      const card = document.getElementById(u.id);
      const st   = document.getElementById(u.sid);
      const log  = document.getElementById('rtLog');
      if (!card || !st || !log) return;
      card.classList.add('hl');
      st.className   = 'rt-st ' + u.cls;
      st.textContent = u.txt;
      log.textContent = u.log;
      setTimeout(() => card?.classList.remove('hl'), 1400);
    };
    const realtimeInterval = setInterval(tick, 2800);

    // Animated counters
    const count = (id: string, target: number) => {
      const el = document.getElementById(id);
      if (!el) return;
      let c = 0;
      const step = Math.ceil(target / 38);
      const t = setInterval(() => {
        c = Math.min(c + step, target);
        el.textContent = String(c);
        if (c >= target) clearInterval(t);
      }, 30);
    };

    // Animated progress bars
    const prog = (pbId: string, pId: string, target: number) => {
      const pb = document.getElementById(pbId);
      const pt = document.getElementById(pId);
      if (!pb || !pt) return;
      pb.style.width = target + '%';
      let c = 0;
      const t = setInterval(() => {
        c = Math.min(c + 2, target);
        pt.textContent = c + '%';
        if (c >= target) clearInterval(t);
      }, 28);
    };

    let counted = false;
    const statsEl = document.querySelector('.big-stats');
    let statsObs: IntersectionObserver | null = null;
    if (statsEl) {
      statsObs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !counted) {
            counted = true;
            count('c1', 18); count('c2', 7); count('c3', 14); count('c4', 12);
            setTimeout(() => {
              prog('pb1', 'p1', 88);
              prog('pb2', 'p2', 92);
              prog('pb3', 'p3', 100);
            }, 400);
          }
        },
        { threshold: 0.3 }
      );
      statsObs.observe(statsEl);
    }

    return () => {
      obs.disconnect();
      clearInterval(realtimeInterval);
      statsObs?.disconnect();
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="root">

        {/* ── NAV ── */}
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3"  y="3"  width="7" height="7" rx="1.5" />
                <rect x="14" y="3"  width="7" height="7" rx="1.5" />
                <rect x="3"  y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="nav-brand">QuickTask</span>
          </div>
          <div className="nav-links">
            <a href="#">Features</a>
            <a href="#">How it works</a>
            <a href="#">Roles</a>
            <a href="#">Stack</a>
          </div>
          <div className="nav-actions">
            <button className="btn-ghost">Sign in</button>
            <button className="btn-primary">Get started</button>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="hero" style={{ background: '#0A0A0F' }}>
          <div className="hero-glow" />
          <div className="hero-glow2" />
          <div className="badge">
            <span className="badge-dot" />
            Next.js 15 + Supabase + Railway
          </div>
          <h1 style={{ marginBottom: '20px' }}>
            Your team. Your tasks.<br />
            <span className="accent">Zero chaos.</span>
          </h1>
          <p className="hero-sub">
            Create projects, assign tasks, and ship faster — with role-based access enforced at the database level.
          </p>
          <div className="hero-cta">
            <button className="btn-large">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Start for free
            </button>
            <button className="btn-outline-large">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polygon points="10,8 16,12 10,16" />
              </svg>
              Watch demo
            </button>
          </div>

          {/* Mockup */}
          <div className="hero-mockup">
            <div className="mockup-bar">
              <div className="dot dot-r" />
              <div className="dot dot-y" />
              <div className="dot dot-g" />
              <div className="mockup-url">app.QuickTask.io/dashboard/projects/alpha/board</div>
            </div>
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="sb-logo">
                  <div className="sb-logo-icon" />
                  <span className="sb-logo-text">QuickTask</span>
                </div>
                <div className="sb-item active"><span className="si-d" />Dashboard</div>
                <div className="sb-item"><span className="si-d" />Projects</div>
                <div className="sb-item"><span className="si-d" />My Tasks</div>
                <div className="sb-item"><span className="si-d" />Team</div>
                <div className="sb-item"><span className="si-d" />Settings</div>
              </div>
              <div className="mockup-main">
                <div className="m-header">
                  <span className="m-title">Alpha Launch</span>
                  <span className="m-badge">Board view</span>
                </div>
                <div className="stats-row">
                  <div className="sc"><div className="sc-l">Total</div><div className="sc-v cv-blue">24</div></div>
                  <div className="sc"><div className="sc-l">Done</div><div className="sc-v cv-green">9</div></div>
                  <div className="sc"><div className="sc-l">Today</div><div className="sc-v cv-amber">4</div></div>
                  <div className="sc"><div className="sc-l">Late</div><div className="sc-v cv-red">2</div></div>
                </div>
                <div className="k-cols">
                  <div className="k-col">
                    <div className="k-col-h">To Do (5)</div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 0.8s both' }}>
                      <div className="kc-t">Set up CI/CD pipeline</div>
                      <div className="kc-m"><span className="kp kp-h">High</span><div className="kav" style={{ background: '#00BFA5' }}>AK</div></div>
                    </div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 0.9s both' }}>
                      <div className="kc-t">Write API docs</div>
                      <div className="kc-m"><span className="kp kp-l">Low</span><span className="k-due">May 10</span></div>
                    </div>
                  </div>
                  <div className="k-col">
                    <div className="k-col-h">In Progress (4)</div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 1.0s both', borderLeft: '1.5px solid #FBB13C' }}>
                      <div className="kc-t">Auth integration</div>
                      <div className="kc-m"><span className="kp kp-c">Critical</span><div className="kav" style={{ background: '#00A896' }}>SR</div></div>
                    </div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 1.1s both' }}>
                      <div className="kc-t">Dashboard UI</div>
                      <div className="kc-m"><span className="kp kp-m">Medium</span><span className="k-od">Overdue</span></div>
                    </div>
                  </div>
                  <div className="k-col">
                    <div className="k-col-h">In Review (3)</div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 1.2s both', borderLeft: '1.5px solid #00BFA5' }}>
                      <div className="kc-t">DB schema design</div>
                      <div className="kc-m"><span className="kp kp-h">High</span><div className="kav" style={{ background: '#EC4899' }}>NP</div></div>
                    </div>
                  </div>
                  <div className="k-col">
                    <div className="k-col-h">Done (9)</div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 1.3s both', opacity: 0.45 }}>
                      <div className="kc-t">Project setup</div>
                      <div className="kc-m"><span className="kp kp-l">Low</span><div className="kav" style={{ background: '#34D399' }}>JS</div></div>
                    </div>
                    <div className="kc" style={{ animation: 'slideIn 0.5s 1.4s both', opacity: 0.45 }}>
                      <div className="kc-t">Supabase config</div>
                      <div className="kc-m"><span className="kp kp-m">Med</span><div className="kav" style={{ background: '#F97316' }}>KR</div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TICKER ── */}
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[
              'Kanban board', 'Real-time updates', 'Role-based access control',
              'Admin & Member roles', 'Supabase Realtime', 'In-app notifications',
              'Global search', 'Overdue tracking', 'Next.js 15 App Router', 'Railway deployment',
              'Kanban board', 'Real-time updates', 'Role-based access control',
              'Admin & Member roles', 'Supabase Realtime', 'In-app notifications',
              'Global search', 'Overdue tracking', 'Next.js 15 App Router', 'Railway deployment',
            ].map((item, i) => (
              <div className="ticker-item" key={i}>
                {item}<span className="tsep">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES ── */}
        <section className="section" style={{ background: '#0A0A0F' }}>
          <div className="s-label">Everything you need</div>
          <h2 className="s-title">Built for teams that ship</h2>
          <p className="s-sub">Every feature your team needs — clean interface, real-time sync, and permissions that actually hold.</p>
          <div className="feats">
            <div className="fc anim-fu d1">
              <div className="fi fi-v">
                <svg viewBox="0 0 24 24" fill="none" stroke="#26D0B8" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className="ft">Task management</div>
              <div className="fd">Create tasks with priority, assignee, and due date. Drag between Kanban columns seamlessly.</div>
            </div>
            <div className="fc anim-fu d2">
              <div className="fi fi-g">
                <svg viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div className="ft">Real-time sync</div>
              <div className="fd">Task changes propagate instantly to all team members via Supabase Realtime — no refresh needed.</div>
            </div>
            <div className="fc anim-fu d3">
              <div className="fi fi-a">
                <svg viewBox="0 0 24 24" fill="none" stroke="#FBB13C" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <div className="ft">Team &amp; roles</div>
              <div className="fd">Invite by email. Assign Admin or Member roles enforced by Supabase Row Level Security.</div>
            </div>
            <div className="fc anim-fu d3">
              <div className="fi fi-p">
                <svg viewBox="0 0 24 24" fill="none" stroke="#F472B6" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" />
                  <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
                </svg>
              </div>
              <div className="ft">Notifications</div>
              <div className="fd">Instant alerts when you're assigned a task, a comment is added, or a status changes.</div>
            </div>
            <div className="fc anim-fu d4">
              <div className="fi fi-t">
                <svg viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <div className="ft">Global search</div>
              <div className="fd">Find any task or project instantly via PostgreSQL full-text search — results in under 300 ms.</div>
            </div>
            <div className="fc anim-fu d5">
              <div className="fi fi-u">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00E5CC" strokeWidth="2">
                  <rect x="3"  y="3"  width="7" height="7" rx="1" />
                  <rect x="14" y="3"  width="7" height="7" rx="1" />
                  <rect x="3"  y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="ft">Dashboard analytics</div>
              <div className="fd">Overdue tasks, today's deadlines, project progress — all on one glanceable dashboard.</div>
            </div>
          </div>
        </section>

        {/* ── REALTIME DEMO ── */}
        <section className="section" style={{ background: '#0D0D14', paddingTop: '60px', paddingBottom: '60px' }}>
          <div className="s-label">Live collaboration</div>
          <h2 className="s-title">Changes land in real time</h2>
          <p className="s-sub">Every move, every status update, synced across all open sessions — powered by Supabase Realtime.</p>
          <div className="rt-demo">
            <div className="rt-h">
              <span className="rt-ht">Alpha Launch — Board</span>
              <span className="rt-live"><span className="live-dot" />3 members online</span>
            </div>
            <div className="rt-body">
              <div className="rt-task" id="rt1">
                <div className="rt-usr" style={{ background: '#00BFA5' }}>AK</div>
                <span className="rt-tn">Set up CI/CD pipeline</span>
                <span className="rt-st rs-todo" id="s1">To do</span>
              </div>
              <div className="rt-task" id="rt2">
                <div className="rt-usr" style={{ background: '#00A896' }}>SR</div>
                <span className="rt-tn">Auth integration</span>
                <span className="rt-st rs-prog" id="s2">In progress</span>
              </div>
              <div className="rt-task" id="rt3">
                <div className="rt-usr" style={{ background: '#EC4899' }}>NP</div>
                <span className="rt-tn">DB schema design</span>
                <span className="rt-st rs-review" id="s3">In review</span>
              </div>
              <div className="rt-task" id="rt4">
                <div className="rt-usr" style={{ background: '#34D399' }}>JS</div>
                <span className="rt-tn">Project setup</span>
                <span className="rt-st rs-done" id="s4">Done</span>
              </div>
            </div>
            <div className="rt-foot" id="rtLog">Watching for updates...</div>
          </div>
        </section>

        {/* ── ROLES ── */}
        <section className="section" style={{ background: '#0A0A0F' }}>
          <div className="s-label">Role-based access</div>
          <h2 className="s-title">Right access for every person</h2>
          <p className="s-sub">Two roles, clear permissions — locked at the database level with Supabase RLS policies.</p>
          <div className="roles-grid">
            <div className="role-card" style={{ borderColor: 'rgba(0,191,165,0.15)' }}>
              <div className="rb rb-a">Admin</div>
              <div className="role-t">Full control</div>
              <ul className="role-list">
                <li><span className="chk">✓</span>Create &amp; delete projects</li>
                <li><span className="chk">✓</span>Create, edit &amp; delete tasks</li>
                <li><span className="chk">✓</span>Invite &amp; remove members</li>
                <li><span className="chk">✓</span>Assign roles to members</li>
                <li><span className="chk">✓</span>Update any task status</li>
                <li><span className="chk">✓</span>Moderate comments</li>
              </ul>
            </div>
            <div className="role-card" style={{ borderColor: 'rgba(52,211,153,0.12)' }}>
              <div className="rb rb-m">Member</div>
              <div className="role-t">Focused access</div>
              <ul className="role-list">
                <li><span className="chk g">✓</span>View all project tasks</li>
                <li><span className="chk g">✓</span>Update own task status</li>
                <li><span className="chk g">✓</span>Comment on any task</li>
                <li><span className="chk g">✓</span>Edit own comments</li>
                <li><span className="chk g">✓</span>Search projects &amp; tasks</li>
                <li><span className="chk g">✓</span>View team members</li>
              </ul>
            </div>
          </div>
        </section>

        {/* ── TECH STACK ── */}
        <section className="section" style={{ background: '#0D0D14', paddingTop: '60px', paddingBottom: '60px' }}>
          <div className="s-label">Tech stack</div>
          <h2 className="s-title">Modern. Fast. Production-ready.</h2>
          <p className="s-sub">Every choice deliberate — optimised for performance, DX, and scale from day one.</p>
          <div className="tech-grid">
            {[
              { label: 'Next.js 15',    color: '#E8E8F0' },
              { label: 'Supabase',      color: '#34D399' },
              { label: 'TypeScript 5',  color: '#60A5FA' },
              { label: 'Tailwind CSS',  color: '#22D3EE' },
              { label: 'shadcn/ui',     color: '#26D0B8' },
              { label: 'React Query',   color: '#F97316' },
              { label: 'Zod',           color: '#F472B6' },
              { label: 'Railway',       color: '#EF4444' },
            ].map(({ label, color }) => (
              <div className="tech-pill" key={label}>
                <span className="td" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="section" style={{ background: '#0A0A0F' }}>
          <h2 className="s-title" style={{ marginBottom: '48px' }}>Numbers that matter</h2>
          <div className="big-stats">
            <div className="big-stat"><div className="big-num" id="c1">0</div><div className="big-lbl">API endpoints</div></div>
            <div className="big-stat"><div className="big-num" id="c2">0</div><div className="big-lbl">DB tables &amp; views</div></div>
            <div className="big-stat"><div className="big-num" id="c3">0</div><div className="big-lbl">RLS policies</div></div>
            <div className="big-stat"><div className="big-num" id="c4">0</div><div className="big-lbl">Hours to ship</div></div>
          </div>
          <div className="prog-wrap">
            <div className="prog-row">
              <div className="prog-meta">
                <span className="prog-name">Lighthouse performance</span>
                <span className="prog-val" id="p1">0%</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" id="pb1" style={{ width: '0%', background: 'linear-gradient(90deg,#00BFA5,#26D0B8)' }} />
              </div>
            </div>
            <div className="prog-row">
              <div className="prog-meta">
                <span className="prog-name">Lighthouse accessibility</span>
                <span className="prog-val" id="p2">0%</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" id="pb2" style={{ width: '0%', background: 'linear-gradient(90deg,#34D399,#6EE7B7)' }} />
              </div>
            </div>
            <div className="prog-row">
              <div className="prog-meta">
                <span className="prog-name">TypeScript coverage</span>
                <span className="prog-val" id="p3">0%</span>
              </div>
              <div className="prog-bar">
                <div className="prog-fill" id="pb3" style={{ width: '0%', background: 'linear-gradient(90deg,#00E5CC,#4DD0C4)' }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-sec">
          <div className="cta-glow" />
          <h2>Ready to bring your<br />team into focus?</h2>
          <p>Deploy in minutes on Railway. No credit card. Production-ready from day one.</p>
          <div className="cta-btns">
            <button className="btn-large">Get started free</button>
            <button className="btn-outline-large">View on GitHub</button>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-brand">
            <div className="nav-icon" style={{ width: '22px', height: '22px', borderRadius: '6px' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                <rect x="3"  y="3"  width="7" height="7" rx="1.5" />
                <rect x="14" y="3"  width="7" height="7" rx="1.5" />
                <rect x="3"  y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
              </svg>
            </div>
            <span className="footer-txt">QuickTask — Team Task Manager</span>
          </div>
          <div className="footer-links">
            <a href="#">GitHub</a>
            <a href="#">Live demo</a>
            <a href="#">Docs</a>
          </div>
          <span className="footer-txt">Next.js 15 + Supabase + Railway</span>
        </footer>

      </div>
    </>
  );
}