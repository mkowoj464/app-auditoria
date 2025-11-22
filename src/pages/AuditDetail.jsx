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
  
  const [checklist, setChecklist] = useState([])
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (audit && audit.checklist) {
      setChecklist(audit.checklist)
    }
  }, [audit])

  if (!audit) return <div className="container"><p>Auditoría no encontrada.</p></div>

  const templateName = templatesData.find(t => t.id === audit.plantillaId)?.name || '(Sin plantilla)'

  const handleStatusChange = (itemId, newStatus) => {
    const updatedList = checklist.map(item => {
      if (item.id === itemId) {
        const shouldClearFinding = newStatus === 'cumple' || newStatus === 'na';
        return { ...item, estado: newStatus, hallazgo: shouldClearFinding ? '' : item.hallazgo }
      }
      return item
    })
    setChecklist(updatedList)
    updateAudit(audit.id, { checklist: updatedList })
  }

  const handleFindingChange = (itemId, text) => {
    const updatedList = checklist.map(item => 
      item.id === itemId ? { ...item, hallazgo: text } : item
    )
    setChecklist(updatedList)
    updateAudit(audit.id, { checklist: updatedList })
  }

  const handleManualSave = () => {
    updateAudit(audit.id, { checklist: checklist })
    setNotification('✅ Informe guardado exitosamente.')
    setTimeout(() => setNotification(null), 3000)
  }

  // --- NUEVA FUNCIÓN H-006: NOTIFICAR POR CORREO ---
  const handleEmailShare = () => {
    const subject = `Resultados Auditoría: ${audit.sucursal} - ${audit.fechaInicio}`;
    
    // Calculamos resumen rápido
    const total = checklist.length;
    const fallos = checklist.filter(i => i.estado === 'no_cumple').length;
    const score = total > 0 ? Math.round(((total - fallos) / total) * 100) : 0;

    const body = `
      Hola,
      
      Comparto los hallazgos preliminares de la auditoría realizada.
      
      SUCURSAL: ${audit.sucursal}
      AUDITOR: ${audit.auditor}
      CALIFICACIÓN PRELIMINAR: ${score}%
      
      Hallazgos detectados: ${fallos}
      
      Por favor revisar el sistema para el detalle completo.
    `;

    // Codificamos para URL (mailto no acepta espacios ni enters normales)
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Abrimos el cliente de correo
    window.location.href = mailtoLink;
  }

  const totalItems = checklist.length
  const completedItems = checklist.filter(i => i.estado !== 'pendiente').length
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100)

  return (
    <div className="container" style={{position: 'relative'}}>
      
      {notification && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white',
          padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          fontWeight: 'bold', zIndex: 1000, animation: 'slideIn 0.3s ease-out'
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
                  <button className={`btn-check btn-pass ${item.estado === 'cumple' ? 'active' : 'secondary'}`} onClick={() => handleStatusChange(item.id, 'cumple')}>✅ Cumple</button>
                  <button className={`btn-check btn-fail ${item.estado === 'no_cumple' ? 'active' : 'secondary'}`} onClick={() => handleStatusChange(item.id, 'no_cumple')}>❌ No Cumple</button>
                  <button className={`btn-check btn-na ${item.estado === 'na' ? 'active' : 'secondary'}`} onClick={() => handleStatusChange(item.id, 'na')}>⛔ N/A</button>
                </div>

                {item.estado === 'no_cumple' && (
                  <div style={{marginTop: '1rem'}}>
                    <label style={{fontSize:'0.9rem', color:'#ef4444'}}>Descripción del Hallazgo:</label>
                    <textarea rows="2" placeholder="Describa la desviación encontrada..." value={item.hallazgo} onChange={(e) => handleFindingChange(item.id, e.target.value)} style={{borderColor: '#fca5a5', background: '#fef2f2'}} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <h3 style={{margin:0}}>Acciones de Cierre</h3>
          <p className="text-muted" style={{margin:0}}>Compartir resultados o exportar.</p>
        </div>
        <div style={{display:'flex', gap:'1rem'}}>
          {/* BOTÓN H-006 NOTIFICAR */}
          <button className="secondary" onClick={handleEmailShare} style={{borderColor: '#3b82f6', color: '#3b82f6'}}>
            📧 Notificar por Correo
          </button>
          
          <button className="secondary" onClick={()=>exportCSV(audit)}>📥 Exportar CSV</button>
          
          {role !== 'AUDITOR' && (
             <button onClick={()=>nav('/')}>Finalizar Revisión</button>
          )}
        </div>
      </div>
    </div>
  )
}