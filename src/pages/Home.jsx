import { Link } from 'react-router-dom'
import { useAudits } from '../store/audits.js'

export default function Home(){
  const { audits, role, deleteAudit } = useAudits()
  
  const handleDelete = (id, nombre) => {
    if(window.confirm(`¿Estás seguro de eliminar la auditoría "${nombre}"?`)) {
       deleteAudit(id);
    }
  }

  // Cálculos rápidos para el Dashboard
  const total = audits.length
  const pendientes = audits.filter(a => !a.fechaFin).length // Suponiendo que si no hay fecha fin, está activa

  return (
    <div className="container">
      
      {/* HEADER DEL DASHBOARD */}
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{margin: 0}}>Hola, {role === 'AUDITOR' ? 'Auditor' : 'Coordinador'} 👋</h1>
        <p className="text-muted">Bienvenido al panel de control de Auditoren.</p>
      </div>

      {/* SECCIÓN 1: ACCESOS RÁPIDOS (TARJETAS GRANDES) */}
      <div className="grid-2" style={{marginBottom: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'}}>
        
        {/* Tarjeta 1: Nueva Auditoría */}
        <div className="card" style={{background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', marginBottom: 0}}>
          <h2 style={{color: 'white', marginTop: 0}}>Iniciar Auditoría</h2>
          <p style={{opacity: 0.8}}>Comenzar un nuevo ciclo de revisión.</p>
          <Link to="/new">
            <button style={{background: 'white', color: '#0f172a', marginTop: '1rem', width: '100%'}}>
              + Crear Nueva
            </button>
          </Link>
        </div>

        {/* Tarjeta 2: Plantillas */}
        <div className="card" style={{marginBottom: 0}}>
          <h2 style={{marginTop: 0}}>📂 Plantillas</h2>
          <p className="text-muted">Gestionar estándares (ISO, LFPDPPP).</p>
          <Link to="/templates">
            <button className="secondary" style={{width: '100%'}}>Ver Catálogo</button>
          </Link>
        </div>

        {/* Tarjeta 3: Resumen (Visual) */}
        <div className="card" style={{marginBottom: 0, borderLeft: '4px solid #3b82f6'}}>
          <h2 style={{marginTop: 0, color: '#3b82f6'}}>{total}</h2>
          <p style={{fontWeight: 'bold', margin: 0}}>Auditorías Registradas</p>
          <p className="text-muted" style={{fontSize: '0.9rem'}}>Histórico total en el sistema.</p>
        </div>
      </div>

      {/* SECCIÓN 2: LISTADO RECIENTE */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
        <h3 style={{margin: 0}}>📋 Auditorías Recientes</h3>
        <span className="text-muted" style={{fontSize: '0.9rem'}}>Ordenado por fecha de creación</span>
      </div>

      {audits.length === 0 ? (
        <div className="card" style={{textAlign:'center', padding:'3rem', borderStyle: 'dashed'}}>
           <p className="text-muted">No hay registros. Comienza creando una auditoría arriba.</p>
        </div>
      ) : (
        <div style={{display:'grid', gap:'1rem'}}>
          {audits.map(a => (
            <div key={a.id} className="card" style={{padding:'1.2rem', marginBottom:0, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
               <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  {/* Icono visual según tipo */}
                  <div style={{background: '#eff6ff', color: '#3b82f6', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>
                    {a.sucursal.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <Link to={`/audit/${a.id}`} style={{fontSize:'1.1rem', color:'var(--primary)', fontWeight: 'bold', textDecoration: 'none'}}>
                      {a.nombreAuditoria || `Auditoría ${a.sucursal}`}
                    </Link>
                    <div className="text-muted" style={{fontSize: '0.85rem', marginTop:'0.2rem'}}>
                      {a.auditor} • {new Date(a.creadoEl).toLocaleDateString()}
                    </div>
                  </div>
               </div>
               
               <div style={{display:'flex', gap:'10px'}}>
                  <Link to={`/audit/${a.id}`}>
                    <button className="secondary" style={{padding: '0.5rem 1rem'}}>Abrir</button>
                  </Link>

                  {/* Botón Borrar (H-009) */}
                  {(role === 'COORDINADOR' || role === 'ADMIN') && (
                    <button 
                        onClick={() => handleDelete(a.id, a.sucursal)}
                        style={{backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem'}}
                        title="Eliminar"
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