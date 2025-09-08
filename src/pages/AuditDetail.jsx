import { useParams } from 'react-router-dom'
import { useAudits } from '../store/audits.js'
import { exportCSV } from '../utils/export.js'
import { useState } from 'react'

export default function AuditDetail(){
  const { id } = useParams()
  const { audits, templates, addFinding, updateAudit, role } = useAudits()
  const audit = audits.find(a => a.id === id)
  if (!audit) return <p>Auditoría no encontrada.</p>

  const tpl = templates.find(t => t.id === audit.plantillaId)
  const [msg, setMsg] = useState('')

  function onAdd(e){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    addFinding(audit.id, { title: String(fd.get('title')||''), notes: String(fd.get('notes')||'') })
    e.currentTarget.reset()
    setMsg('👌 Hallazgo guardado'); setTimeout(()=>setMsg(''), 1500)
  }

  return (
    <section>
      <h1>{audit.nombreAuditoria || `Auditoría ${audit.sucursal || ''}`}</h1>

      <p>
        <b>Tipo de auditoría:</b> {audit.tipoAuditoria || '—'} |
        <b> Auditor Líder:</b> {audit.auditor || '—'} |
        <b> Plantilla:</b> {tpl?.name || '—'}
      </p>

      <ul style={{marginTop:8}}>
        <li><b>Periodo:</b> {(audit.fechaInicio || '—')} – {(audit.fechaFin || '—')}</li>
        <li><b>Responsable:</b> {audit.responsableSucursal || '—'} {audit.correoResponsableSucursal && `(${audit.correoResponsableSucursal})`}</li>
      </ul>

      {audit.objetivo && <p style={{marginTop:8}}><b>Objetivo:</b> {audit.objetivo}</p>}
      {audit.alcance  && <p><b>Alcance:</b> {audit.alcance}</p>}

      <h2 style={{marginTop:16}}>Nuevo hallazgo</h2>
      <form onSubmit={onAdd}>
        <input name="title" placeholder="Reactivo" required />
        <input name="notes" placeholder="Hallazgo" />
        <button>Guardar hallazgo</button>
      </form>
      {msg && <p style={{color:'green'}}>{msg}</p>}

      <h3>Hallazgos</h3>
      <ul>
        {audit.findings.map(f => (
          <li key={f.id}>
            <b>{f.title}</b> — {f.notes} <i>({new Date(f.createdAt).toLocaleString()})</i> • {f.author}
          </li>
        ))}
      </ul>

      <hr/>
      <h2>Exportar</h2>
      <button onClick={()=>exportCSV(audit)}>Exportar CSV</button>

      {role!=='ADMIN' && role!=='SUPER_ADMIN'
        ? <p style={{marginTop:8}}><i>Acciones administrativas ocultas por rol.</i></p>
        : <div style={{marginTop:8}}>
            <button onClick={()=>updateAudit(audit.id, { nombreAuditoria: (audit.nombreAuditoria || `Auditoría ${audit.sucursal || ''}`) + ' (rev)' })}>
              Marcar revisión
            </button>
          </div>}
    </section>
  )
}
