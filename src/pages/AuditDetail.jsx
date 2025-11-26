import { useParams, useNavigate } from 'react-router-dom'
import { useAudits } from '../store/audits.js'
import { exportCSV } from '../utils/export.js'
import { useState, useEffect, useRef } from 'react'
import { templatesData } from '../data/templates.js'

export default function AuditDetail(){
  const { id } = useParams()
  const nav = useNavigate()
  const { audits, updateAudit, role } = useAudits()
  const audit = audits.find(a => a.id === id)
  
  // Estados
  const [checklist, setChecklist] = useState([])
  const [notification, setNotification] = useState(null)
  
  // Nuevo: Estados para Auto-guardado
  const [autoSave, setAutoSave] = useState(true) // Habilitado por default
  const [isSaving, setIsSaving] = useState(false)
  
  // Referencia para evitar el guardado inicial al cargar
  const isFirstRun = useRef(true);

  useEffect(() => { 
    if (audit?.checklist) {
        setChecklist(audit.checklist) 
    }
  }, [audit])

  // --- EFECTO DE AUTO-GUARDADO (Tipo Google Drive) ---
  useEffect(() => {
    if (isFirstRun.current) {
        isFirstRun.current = false;
        return;
    }

    if (autoSave && !audit.status?.includes('enviado')) {
        setIsSaving(true);
        // Simulamos un pequeño delay para que se vea el "Guardando..."
        const timer = setTimeout(() => {
            updateAudit(audit.id, { checklist: checklist });
            setIsSaving(false);
        }, 800);
        return () => clearTimeout(timer);
    }
  }, [checklist, autoSave]); // Se dispara cada vez que cambia el checklist

  if (!audit) return <div className="container"><p>No encontrada.</p></div>

  const isLocked = audit.status === 'enviado';
  const templateName = templatesData.find(t => t.id === audit.plantillaId)?.name || '(Sin plantilla)'

  const updateChecklist = (newList) => {
      setChecklist(newList);
      // Si el autoguardado está APAGADO, actualizamos el store manualmente solo al dar clic en guardar
      // Si está ENCENDIDO, el useEffect de arriba se encarga.
      if (!autoSave) {
          // No actualizamos el store aquí si autoSave es false, esperamos al botón manual.
      }
  }

  const handleStatusChange = (itemId, newStatus) => {
    if (isLocked) return;
    const updatedList = checklist.map(item => {
      if (item.id === itemId) {
        const shouldClear = newStatus === 'cumple' || newStatus === 'na';
        return { ...item, estado: newStatus, hallazgo: shouldClear ? '' : item.hallazgo }
      }
      return item
    })
    setChecklist(updatedList) // Esto dispara el useEffect
  }

  const handleFindingChange = (itemId, text) => {
    if (isLocked) return;
    const updatedList = checklist.map(item => item.id === itemId ? { ...item, hallazgo: text } : item)
    setChecklist(updatedList) // Esto dispara el useEffect
  }

  const handleItemEvidence = (itemId, e) => {
      if (isLocked) return;
      const file = e.target.files[0];
      if (file) {
          const updatedList = checklist.map(item => 
              item.id === itemId ? { ...item, evidenceFile: file.name } : item
          )
          setChecklist(updatedList);
          setNotification(`📎 Evidencia cargada.`);
          setTimeout(() => setNotification(null), 2000);
      }
  }

  // BOTÓN MANUAL (Siempre actualiza y notifica)
  const handleManualSave = () => {
    updateAudit(audit.id, { checklist: checklist })
    setNotification('💾 Avance guardado correctamente.')
    setTimeout(() => setNotification(null), 3000)
  }

  const handleEmailShare = () => {
    updateAudit(audit.id, { status: 'enviado' });
    window.location.href = `mailto:?subject=Auditoria ${audit.sucursal}&body=Reporte finalizado.`;
    setNotification('📧 Auditoría Enviada y Bloqueada.');
  }

  return (
    <div className="container">
      {notification && <div style={{position:'fixed', top:20, right:20, background:'#10b981', color:'white', padding:'1rem', borderRadius:8, zIndex:999}}>{notification}</div>}

      {/* BARRA SUPERIOR DE ESTADO (AUTO-GUARDADO) */}
      <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center', marginBottom:'10px', height:'24px'}}>
          {isSaving && <span style={{color:'#64748b', fontSize:'0.9rem', marginRight:'15px'}}>☁️ Guardando...</span>}
          {!isSaving && autoSave && <span style={{color:'#10b981', fontSize:'0.9rem', marginRight:'15px'}}>☁️ Guardado</span>}
          
          <label style={{display:'flex', alignItems:'center', fontSize:'0.85rem', cursor:'pointer', userSelect:'none'}}>
              <input 
                type="checkbox" 
                checked={autoSave} 
                onChange={(e) => setAutoSave(e.target.checked)} 
                style={{width:'auto', margin:'0 8px 0 0'}}
              />
              Autoguardado
          </label>
      </div>

      {isLocked && (
          <div style={{background:'#fff7ed', border:'1px solid #f97316', color:'#c2410c', padding:'1rem', borderRadius:'8px', marginBottom:'1rem'}}>
              🔒 <strong>Auditoría Cerrada.</strong> <button onClick={()=>alert('Solicitud enviada')} style={{background:'#f97316', marginLeft:'1rem', fontSize:'0.8rem'}}>Solicitar Edición</button>
          </div>
      )}

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between'}}>
            <div>
                <span className="text-muted">{audit.tipoAuditoria} • {templateName}</span>
                <h1 style={{margin:0}}>{audit.sucursal}</h1>
                <p className="text-muted">{audit.auditor} | {audit.fechaInicio}</p>
            </div>
        </div>
      </div>

      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem'}}>
            <h2>Lista de Verificación</h2>
            {/* BOTÓN MANUAL RESTAURADO */}
            {!isLocked && (
                <button onClick={handleManualSave} style={{background:'#0f172a', padding:'0.5rem 1rem'}}>
                    💾 Guardar Avance
                </button>
            )}
        </div>
        
        <div className="checklist-container">
            {checklist.map((item) => (
              <div key={item.id} className="checklist-item" style={{opacity: isLocked ? 0.8 : 1, borderBottom:'1px solid #eee', padding:'1.5rem 0'}}>
                
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', marginBottom:'0.5rem'}}>
                    <p style={{fontWeight:'600', margin:0, width:'70%'}}>{item.pregunta}</p>
                    
                    {/* BOTÓN EVIDENCIA CONDICIONAL Y ESTILIZADO */}
                    {item.estado === 'no_cumple' && (
                        <div style={{textAlign:'right'}}>
                            <label style={{
                                cursor: isLocked ? 'not-allowed' : 'pointer', 
                                backgroundColor: '#e0f2fe', // Azul Celeste (Tailwind sky-100)
                                color: 'black',             // Texto Negro
                                padding:'0.4rem 0.8rem', 
                                borderRadius:'6px', 
                                fontSize:'0.85rem', 
                                display:'flex', 
                                alignItems:'center', 
                                gap:'5px',
                                fontWeight: '500',
                                border: '1px solid #bae6fd'
                            }}>
                                📎 {item.evidenceFile ? 'Archivo cargado' : 'Adjuntar evidencia'}
                                <input disabled={isLocked} type="file" style={{display:'none'}} onChange={(e) => handleItemEvidence(item.id, e)} />
                            </label>
                            {item.evidenceFile && <div style={{fontSize:'0.8rem', color:'#0284c7', marginTop:'4px'}}>{item.evidenceFile}</div>}
                        </div>
                    )}
                </div>

                <div className="checklist-actions">
                  {['cumple', 'no_cumple', 'na'].map(status => (
                      <button key={status} disabled={isLocked} 
                        className={`btn-check ${status === 'cumple' ? 'btn-pass' : status === 'no_cumple' ? 'btn-fail' : 'btn-na'} ${item.estado === status ? 'active' : 'secondary'}`}
                        onClick={() => handleStatusChange(item.id, status)}
                      >
                        {status === 'cumple' ? '✅' : status === 'no_cumple' ? '❌' : '⛔'} {status.toUpperCase()}
                      </button>
                  ))}
                </div>
                
                {item.estado === 'no_cumple' && (
                  <textarea disabled={isLocked} rows="2" value={item.hallazgo} onChange={(e) => handleFindingChange(item.id, e.target.value)} style={{marginTop:'1rem', background: isLocked ? '#f1f5f9' : '#fef2f2'}} placeholder="Describa el hallazgo..." />
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="card" style={{display:'flex', gap:'1rem', justifyContent:'flex-end'}}>
          <button className="secondary" onClick={()=>exportCSV(audit)}>📥 CSV</button>
          {!isLocked && <button className="secondary" onClick={handleEmailShare} style={{borderColor:'#3b82f6', color:'#3b82f6'}}>📧 Notificar y Cerrar</button>}
          <button onClick={()=>nav('/')}>Volver</button>
      </div>
    </div>
  )
}