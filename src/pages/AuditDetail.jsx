import { useParams, useNavigate } from 'react-router-dom'
import { useAudits } from '../store/audits.js'
import { exportCSV } from '../utils/export.js'
import { useState, useEffect } from 'react'
import { templatesData } from '../data/templates.js'

export default function AuditDetail(){
  const { id } = useParams()
  const nav = useNavigate()
  const { audits, updateAudit, role } = useAudits()
  
  const audit = audits.find(a => a.id === id)
  
  // Estado local para el checklist
  const [checklist, setChecklist] = useState([])
  // Estado para la notificación (H-002)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (audit && audit.checklist) {
      setChecklist(audit.checklist)
    }
  }, [audit])

  if (!audit) return <div className="container"><p>Auditoría no encontrada.</p></div>

  const templateName = templatesData.find(t => t.id === audit.plantillaId)?.name || '(Sin plantilla)'

  // Manejo de cambios (Sigue guardando en automático por seguridad, pero no avisa)
  const handleStatusChange = (itemId, newStatus) => {
    const updatedList = checklist.map(item => {
      if (item.id === itemId) {
        const shouldClearFinding = newStatus === 'cumple' || newStatus === 'na';
        return { ...item, estado: newStatus, hallazgo: shouldClearFinding ? '' : item.hallazgo }
      }
      return item
    })
    setChecklist(updatedList)
    // Actualizamos el store silenciosamente para no perder datos
    updateAudit(audit.id, { checklist: updatedList })
  }

  const handleFindingChange = (itemId, text) => {
    const updatedList = checklist.map(item => 
      item.id === itemId ? { ...item, hallazgo: text } : item
    )
    setChecklist(updatedList)
    updateAudit(audit.id, { checklist: updatedList })
  }

  // --- LÓGICA H-002: BOTÓN GUARDAR ---
  const handleManualSave = () => {
    // Forzamos el guardado (aunque ya esté actualizado) para dar feedback al usuario
    updateAudit(audit.id, { checklist: checklist })
    
    // Mostramos notificación
    setNotification('✅ Informe guardado exitosamente.')
    
    // Ocultamos notificación después de 3 segundos
    setTimeout(() => setNotification(null), 3000)
  }

  const totalItems = checklist.length
  const completedItems = checklist.filter(i => i.estado !== 'pendiente').length
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)

  return (
    <div className="container" style={{position: 'relative'}}>
      
      {/* NOTIFICACIÓN FLOTANTE (H-002) */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontWeight: 'bold',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          {notification}
        </div>
      )}

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <span className="text-muted" style={{fontSize:'0.85em', textTransform:'uppercase', letterSpacing:'1px'}}>
              {audit.tipoAuditoria} • {templateName}
            </span>
            <h1 style={{marginTop:'0.5rem', marginBottom:'0.5rem'}}>
              {audit.sucursal}
            </h1>
            <p className="text-muted">
              <strong>Auditor:</strong> {audit.auditor} | <strong>Fecha:</strong> {audit.fechaInicio}
            </p>
          </div>
          <div style={{textAlign:'right'}}>
             <div style={{background: '#e2e8f0', padding: '5px 10px', borderRadius: '20px', fontSize:'0.9rem', fontWeight:'bold'}}>
               Progreso: {progress}%
             </div>
          </div>
        </div>
        <div style={{background: '#f8fafc', padding:'1rem', borderRadius:'8px', marginTop:'1.5rem'}}>
          <p style={{margin:0}}><strong>Objetivo:</strong> {audit.objetivo}</p>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
          <h2>Lista de Verificación</h2>
          {/* BOTÓN H-002 */}
          <button onClick={handleManualSave} style={{background: '#0f172a'}}>
            💾 Guardar Avance
          </button>
        </div>

        {checklist.length === 0 ? (
          <p className="text-muted">No hay reactivos cargados.</p>
        ) : (
          <div className="checklist-container">
            {checklist.map((item) => (
              <div key={item.id} className="checklist-item">
                <p style={{fontWeight:'600', fontSize:'1.1rem', margin:'0 0 0.5rem 0'}}>
                  {item.pregunta}
                </p>
                
                <div className="checklist-actions">
                  <button 
                    className={`btn-check btn-pass ${item.estado === 'cumple' ? 'active' : 'secondary'}`}
                    onClick={() => handleStatusChange(item.id, 'cumple')}
                  >
                    ✅ Cumple
                  </button>
                  <button 
                    className={`btn-check btn-fail ${item.estado === 'no_cumple' ? 'active' : 'secondary'}`}
                    onClick={() => handleStatusChange(item.id, 'no_cumple')}
                  >
                    ❌ No Cumple
                  </button>
                  <button 
                    className={`btn-check btn-na ${item.estado === 'na' ? 'active' : 'secondary'}`}
                    onClick={() => handleStatusChange(item.id, 'na')}
                  >
                    ⛔ N/A
                  </button>
                </div>

                {item.estado === 'no_cumple' && (
                  <div style={{marginTop: '1rem'}}>
                    <label style={{fontSize:'0.9rem', color:'#ef4444'}}>Descripción del Hallazgo:</label>
                    <textarea 
                      rows="2" 
                      placeholder="Describa la desviación encontrada..."
                      value={item.hallazgo}
                      onChange={(e) => handleFindingChange(item.id, e.target.value)}
                      style={{borderColor: '#fca5a5', background: '#fef2f2'}}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* BOTÓN EXTRA AL FINAL DE LA LISTA POR COMODIDAD */}
        {checklist.length > 0 && (
           <div style={{marginTop: '2rem', textAlign: 'right', borderTop: '1px solid #e2e8f0', paddingTop: '1rem'}}>
              <button onClick={handleManualSave} style={{width: '100%'}}>
                💾 Guardar Informe
              </button>
           </div>
        )}
      </div>

      <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h3 style={{margin:0}}>Acciones de Cierre</h3>
          <p className="text-muted" style={{margin:0}}>Exportar o finalizar el proceso.</p>
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          <button className="secondary" onClick={()=>exportCSV(audit)}>📥 Exportar CSV</button>
          {role !== 'AUDITOR' && (
             <button onClick={()=>nav('/')}>Finalizar Revisión</button>
          )}
        </div>
      </div>
    </div>
  )
}