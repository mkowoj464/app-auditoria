import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import NewAudit from './pages/NewAudit.jsx'
import AuditDetail from './pages/AuditDetail.jsx'
import Templates from './pages/Templates.jsx'
import { useAudits } from './store/audits.js'

export default function App() {
  const { role, setRole } = useAudits()
  const nav = useNavigate()
  
  return (
    <>
      <header>
        <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
          <h3 style={{margin:0, color:'#0f172a'}}>Auditoren</h3>
          <nav>
            <Link to="/">Tablero</Link>
            <Link to="/new">Nueva Auditoría</Link>
            <Link to="/templates">Plantillas</Link>
          </nav>
        </div>
        
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
          <span style={{fontSize: '0.8rem', color: '#64748b'}}>Simular Rol:</span>
          <select 
            value={role} 
            onChange={e=>setRole(e.target.value)}
            style={{margin:0, padding:'0.4rem', width:'auto', fontSize:'0.9rem', cursor:'pointer'}}
          >
            <option value="AUDITOR">Auditor</option>
            <option value="COORDINADOR">Coordinador</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/new" element={<NewAudit/>}/>
          <Route path="/audit/:id" element={<AuditDetail/>}/>
          <Route path="/templates" element={<Templates/>}/>
        </Routes>
      </main>
    </>
  )
}