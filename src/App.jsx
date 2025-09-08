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
    <div style={{maxWidth:'900px',margin:'0 auto',padding:16}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:16}}>
        <nav style={{display:'flex',gap:12}}>
          <Link to="/">Mi tablero</Link>
          <Link to="/new">Iniciar auditoría</Link>
          <Link to="/templates">Plantillas</Link>
        </nav>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <label>Rol:</label>
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="AUDITOR">AUDITOR</option>
            <option value="COORDINADOR">COORDINADOR</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
          <button onClick={()=>nav(0)}>Aplicar</button>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/new" element={<NewAudit/>}/>
        <Route path="/audit/:id" element={<AuditDetail/>}/>
        <Route path="/templates" element={<Templates/>}/>
      </Routes>
    </div>
  )
}
