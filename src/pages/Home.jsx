import { Link } from 'react-router-dom'
import { useAudits } from '../store/audits.js'

export default function Home(){
  // Traemos el 'role' y la función 'deleteAudit' del store
  const { audits, role, deleteAudit } = useAudits()
  
  const handleDelete = (id, nombre) => {
    if(window.confirm(`¿Estás seguro de eliminar la auditoría "${nombre}"? Esta acción es de Coordinador.`)) {
       deleteAudit(id);
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem'}}>
        <h1>Tablero de Auditorías</h1>
        {/* H-009: El Auditor puede crear, tal como dice la historia */}
        <Link to="/new">
           <button>+ Iniciar Nueva</button>
        </Link>
      </div>

      {/* Mensaje visual del rol actual para la evidencia */}
      <div style={{marginBottom: '1rem', padding: '0.5rem', background: '#fffbeb', borderLeft: '4px solid #f59e0b', color: '#92400e'}}>
         👀 Estás viendo esto con permisos de: <strong>{role}</strong>
      </div>

      {audits.length === 0 ? (
        <div className="card" style={{textAlign:'center', padding:'3rem'}}>
           <p className="text-muted">No hay auditorías en curso.</p>
           <Link to="/new" style={{color:'var(--accent)'}}>Comienza una ahora</Link>
        </div>
      ) : (
        <div style={{display:'grid', gap:'1rem'}}>
          {audits.map(a => (
            <div key={a.id} className="card" style={{padding:'1.5rem', marginBottom:0, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div>
                  <Link to={`/audit/${a.id}`} style={{fontSize:'1.2rem', color:'var(--primary)', marginRight:'0', textDecoration: 'none', fontWeight: 'bold'}}>
                    {a.nombreAuditoria || `Auditoría ${a.sucursal || ''}`}
                  </Link>
                  <div className="text-muted" style={{marginTop:'0.5rem'}}>
                    {a.auditor} • {new Date(a.creadoEl).toLocaleDateString()} • <span style={{fontSize:'0.8em', padding:'2px 6px', borderRadius:'4px', background:'#f1f5f9'}}>{a.tipoAuditoria}</span>
                  </div>
               </div>
               
               <div style={{display:'flex', gap:'10px'}}>
                  <Link to={`/audit/${a.id}`}>
                    <button className="secondary">Abrir</button>
                  </Link>

                  {/* H-009: VALIDACIÓN DE PERFIL 
                      Solo Coordinador o Admin pueden ver el botón de borrar.
                      El Auditor NO verá esto. */}
                  {(role === 'COORDINADOR' || role === 'ADMIN') && (
                    <button 
                        onClick={() => handleDelete(a.id, a.sucursal)}
                        style={{backgroundColor: '#ef4444', color: 'white', border: 'none'}}
                    >
                        🗑️
                    </button>
                  )}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}