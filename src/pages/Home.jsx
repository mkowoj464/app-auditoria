import { Link } from 'react-router-dom'
import { useAudits } from '../store/audits.js'

export default function Home(){
  const { audits, role, deleteAudit } = useAudits()
  
  const handleDelete = (id, nombre) => {
    if(window.confirm(`¿Eliminar "${nombre}"?`)) deleteAudit(id);
  }

  // Filtro de visualización: Auditor ve las suyas, Coordinador ve TODAS.
  // (Para este prototipo, asumiremos que el nombre del auditor logueado es "Juan Pérez" o similar, 
  // pero como no hay login real, el Coordinador ve todo el array y el Auditor también, diferenciamos solo los cards).
  
  // Lógica para el Gráfico Circular del Coordinador
  const metaAuditorias = 100;
  const realizadas = audits.length;
  const porcentajeAvance = Math.min(Math.round((realizadas / metaAuditorias) * 100), 100);
  
  // Cálculo del círculo SVG
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (porcentajeAvance / 100) * circumference;

  return (
    <div className="container">
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{margin: 0}}>Hola, {role} 👋</h1>
        <p className="text-muted">Panel de control - {role === 'AUDITOR' ? 'Vista Operativa' : 'Vista Gerencial'}</p>
      </div>

      {/* --- VISTA DE AUDITOR --- */}
      {role === 'AUDITOR' && (
        <div className="grid-2" style={{marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
            <div className="card" style={{background: '#0f172a', color: 'white', marginBottom: 0}}>
            <h2 style={{color: 'white', marginTop: 0}}>Iniciar Auditoría</h2>
            <Link to="/new"><button style={{background: 'white', color: '#0f172a', width: '100%', marginTop:'1rem'}}>+ Crear Nueva</button></Link>
            </div>
            <div className="card" style={{marginBottom: 0}}>
            <h2 style={{marginTop: 0}}>📂 Plantillas</h2>
            <Link to="/templates"><button className="secondary" style={{width: '100%'}}>Ver Catálogo</button></Link>
            </div>
            <div className="card" style={{marginBottom: 0, borderLeft: '4px solid #3b82f6'}}>
            <h2 style={{marginTop: 0, color: '#3b82f6'}}>{realizadas}</h2>
            <p style={{fontWeight: 'bold'}}>Mis Auditorías</p>
            </div>
        </div>
      )}

      {/* --- VISTA DE COORDINADOR (H-007) --- */}
      {(role === 'COORDINADOR' || role === 'ADMIN') && (
        <div className="grid-2" style={{marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
            
            {/* Card 1: Link a Indicadores */}
            <div className="card" style={{marginBottom: 0, cursor:'pointer'}}>
                <h2 style={{marginTop:0}}>📊 Indicadores</h2>
                <p className="text-muted">KPIs y Desempeño</p>
                <Link to="/indicators"><button style={{width:'100%'}}>Ver Dashboard BI</button></Link>
            </div>

            {/* Card 2: Crear Plantilla (Prototipo) */}
            <div className="card" style={{marginBottom: 0, background:'#f8fafc', border:'1px dashed #ccc'}}>
                <h2 style={{marginTop:0, color:'#64748b'}}>+ Crear Plantilla</h2>
                <p className="text-muted">Configurar nuevos estándares</p>
                <button className="secondary" disabled style={{width:'100%', opacity:0.6}}>Próximamente</button>
            </div>

            {/* Card 3: Avance Calendario (Gráfico Circular) */}
            <div className="card" style={{marginBottom: 0, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <div>
                    <h2 style={{marginTop:0, marginBottom:0}}>{porcentajeAvance}%</h2>
                    <p className="text-muted" style={{fontSize:'0.8rem'}}>Avance Anual<br/>({realizadas}/{metaAuditorias})</p>
                </div>
                <div style={{width:'80px', height:'80px', position:'relative'}}>
                    <svg width="80" height="80" style={{transform: 'rotate(-90deg)'}}>
                        <circle cx="40" cy="40" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                        <circle cx="40" cy="40" r={radius} stroke="#3b82f6" strokeWidth="8" fill="transparent" 
                                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{transition: 'stroke-dashoffset 1s ease'}} />
                    </svg>
                </div>
            </div>
        </div>
      )}

      {/* LISTADO DE AUDITORIAS (Común para ambos, pero Coordinador puede borrar) */}
      <h3>{role === 'COORDINADOR' ? '📋 Auditorías Recientes (Global)' : '📋 Mis Auditorías Recientes'}</h3>
      
      {audits.length === 0 ? <p className="text-muted">No hay registros.</p> : (
        <div style={{display:'grid', gap:'1rem'}}>
          {audits.map(a => (
            <div key={a.id} className="card" style={{padding:'1rem', marginBottom:0, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div>
                  <Link to={`/audit/${a.id}`} style={{fontWeight:'bold', fontSize:'1.1rem', color: a.status === 'enviado' ? '#64748b' : 'var(--primary)', textDecoration:'none'}}>
                    {a.nombreAuditoria || `Auditoría ${a.sucursal}`}
                  </Link>
                  {a.status === 'enviado' && <span style={{marginLeft:'10px', fontSize:'0.7rem', background:'#10b981', color:'white', padding:'2px 6px', borderRadius:'4px'}}>ENVIADO</span>}
                  <div className="text-muted" style={{fontSize:'0.85rem'}}>{a.auditor} • {new Date(a.creadoEl).toLocaleDateString()}</div>
               </div>
               <div style={{display:'flex', gap:'10px'}}>
                  <Link to={`/audit/${a.id}`}><button className="secondary">Abrir</button></Link>
                  {(role === 'COORDINADOR' || role === 'ADMIN') && (
                    <button onClick={() => handleDelete(a.id, a.sucursal)} style={{background:'#ef4444', border:'none'}}>🗑️</button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}