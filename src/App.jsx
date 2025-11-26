import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NewAudit from './pages/NewAudit.jsx'
import AuditDetail from './pages/AuditDetail.jsx'
import Templates from './pages/Templates.jsx'
import Indicators from './pages/Indicators.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import Login from './pages/Login.jsx' // <--- IMPORTANTE
import { useAudits } from './store/audits.js'

export default function App() {
  const { currentUser, logout } = useAudits()
  const nav = useNavigate()

  // --- GUARDIA DE SEGURIDAD ---
  // Si no hay usuario logueado, mostramos SOLO la pantalla de Login
  if (!currentUser) {
    return <Login />;
  }

  // Si hay usuario, mostramos la App completa
  const role = currentUser.rol; // Usamos el rol REAL del usuario

  return (
    <>
      <header>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <h3 style={{margin:0, color:'#0f172a'}}>Auditoren</h3>
          <nav>
            <Link to="/">Tablero</Link>
            {/* Lógica de Menú según el Rol REAL */}
            {role === 'AUDITOR' && <Link to="/new">Nueva Auditoría</Link>}
            {(role === 'COORDINADOR' || role === 'ADMIN') && <Link to="/indicators">Indicadores</Link>}
            <Link to="/templates">Plantillas</Link>
            {role === 'ADMIN' && <Link to="/admin" style={{color:'#ef4444'}}>👥 Usuarios</Link>}
          </nav>
        </div>
        
        <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
          <div style={{textAlign: 'right', lineHeight: '1.2'}}>
            <div style={{fontWeight: 'bold', fontSize: '0.9rem'}}>{currentUser.nombre}</div>
            <div style={{fontSize: '0.75rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', display: 'inline-block'}}>
              {currentUser.rol}
            </div>
          </div>
          <button 
            onClick={() => { logout(); nav('/'); }} 
            style={{padding: '5px 10px', fontSize: '0.8rem', background: 'transparent', border: '1px solid #cbd5e1', color: '#64748b'}}
          >
            Salir
          </button>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/new" element={<NewAudit/>}/>
          <Route path="/audit/:id" element={<AuditDetail/>}/>
          <Route path="/templates" element={<Templates/>}/>
          <Route path="/indicators" element={<Indicators/>}/>
          <Route path="/admin" element={<AdminUsers/>}/>
        </Routes>
      </main>
    </>
  )
}