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

  useEffect(() => { if (audit?.checklist) setChecklist(audit.checklist) }, [audit])

  if (!audit) return <div className="container"><p>No encontrada.</p></div>

  const isLocked = audit.status === 'enviado'; // LÓGICA DE BLOQUEO

  const handleStatusChange = (itemId, newStatus) => {
    if (isLocked) return; // Bloqueo
    const updatedList = checklist.map(item => {
      if (item.id === itemId) {
        const shouldClear = newStatus === 'cumple' || newStatus === 'na';
        return { ...item, estado: newStatus, hallazgo: shouldClear ? '' : item.hallazgo }
      }
      return item
    })
    setChecklist(updatedList)
    updateAudit(audit.id, { checklist: updatedList })
  }

  const handleFindingChange = (itemId, text) => {
    if (isLocked) return; // Bloqueo
    const updatedList = checklist.map(item => item.id === itemId ? { ...item, hallazgo: text } : item)
    setChecklist(updatedList)
    updateAudit(audit.id, { checklist: updatedList })
  }

  // Sprint 5: Adjuntar Evidencia (Simulación)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if(file) {
        updateAudit(audit.id, { evidence: file.name }); // Guardamos solo el nombre
        setNotification(`📎 Archivo adjuntado: ${file.name}`);
        setTimeout(() => setNotification(null), 3000);
    }
  }

  const handleManualSave = () => {
    updateAudit(audit.id, { checklist: checklist })
    setNotification('✅ Informe guardado.')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleEmailShare = () => {
    // Al enviar, cambiamos estatus a 'enviado' (BLOQUEO)
    updateAudit(audit.id, { status: 'enviado' });
    
    const subject = `Resultados: ${audit.sucursal}`;
    const body = `Reporte de auditoría para ${audit.sucursal}. Auditor: ${audit.auditor}.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setNotification('📧 Correo generado y Auditoría Bloqueada.');
  }

  const requestUnlock = () => {
      alert("Solicitud enviada al Coordinador para desbloquear este informe.");
  }

  return (
    <div className="container">
      {notification && <div style={{position:'fixed', top:20, right:20, background:'#10b981', color:'white', padding:'1rem', borderRadius:8, zIndex:999}}>{notification}</div>}

      {/* AVISO DE BLOQUEO */}
      {isLocked && (
          <div style={{background:'#fff7ed', border:'1px solid #f97316', color:'#c2410c', padding:'1rem', borderRadius:'8px', marginBottom:'1rem', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <span>🔒 <strong>Auditoría Cerrada.</strong> Este informe ya fue enviado y no se puede modificar.</span>
              <button onClick={requestUnlock} style={{background:'#f97316', fontSize:'0.9rem'}}>Solicitar Autorización Edición</button>
          </div>
      )}

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>
                <h1 style={{margin:0}}>{audit.sucursal} {isLocked && '🔒'}</h1>
                <p className="text-muted">{audit.auditor} | {audit.fechaInicio}</p>
            </div>
            {/* SPRINT 5: INPUT DE ARCHIVO */}
            {!isLocked && (
                <div style={{textAlign:'right'}}>
                    <label style={{cursor:'pointer', background:'#e2e8f0', padding:'0.5rem 1rem', borderRadius:'4px', display:'inline-block'}}>
                        📎 Adjuntar Evidencia
                        <input type="file" style={{display:'none'}} onChange={handleFileUpload} />
                    </label>
                    {audit.evidence && <div style={{fontSize:'0.8rem', marginTop:'5px'}}>📄 {audit.evidence}</div>}
                </div>
            )}
        </div>
      </div>

      <div className="card">
        <h2>Lista de Verificación</h2>
        {!isLocked && <button onClick={handleManualSave} style={{background:'#0f172a', marginBottom:'1rem'}}>💾 Guardar Avance</button>}
        
        <div className="checklist-container">
            {checklist.map((item) => (
              <div key={item.id} className="checklist-item" style={{opacity: isLocked ? 0.7 : 1}}>
                <p style={{fontWeight:'600'}}>{item.pregunta}</p>
                <div className="checklist-actions">
                  {['cumple', 'no_cumple', 'na'].map(status => (
                      <button key={status} 
                        disabled={isLocked} // Bloqueo de botones
                        className={`btn-check ${status === 'cumple' ? 'btn-pass' : status === 'no_cumple' ? 'btn-fail' : 'btn-na'} ${item.estado === status ? 'active' : 'secondary'}`}
                        onClick={() => handleStatusChange(item.id, status)}
                      >
                        {status === 'cumple' ? '✅' : status === 'no_cumple' ? '❌' : '⛔'} {status.toUpperCase()}
                      </button>
                  ))}
                </div>
                {item.estado === 'no_cumple' && (
                  <textarea disabled={isLocked} rows="2" value={item.hallazgo} onChange={(e) => handleFindingChange(item.id, e.target.value)} style={{marginTop:'1rem', background: isLocked ? '#f1f5f9' : '#fef2f2'}} />
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="card" style={{display:'flex', gap:'1rem', justifyContent:'flex-end'}}>
          <button className="secondary" onClick={()=>exportCSV(audit)}>📥 CSV</button>
          {!isLocked && (
            <button className="secondary" onClick={handleEmailShare} style={{borderColor:'#3b82f6', color:'#3b82f6'}}>📧 Notificar y Cerrar</button>
          )}
          <button onClick={()=>nav('/')}>Volver</button>
      </div>
    </div>
  )
}