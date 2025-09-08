import { useNavigate } from 'react-router-dom'
import { useAudits } from '../store/audits.js'

export default function NewAudit(){
  const { createAudit, templates } = useAudits()
  const nav = useNavigate()

  const DEFAULT_OBJETIVO = "Evaluar nivel de cumplimiento normativo de la LFPDPPP."
  const DEFAULT_ALCANCE  = "Todas las áreas, procesos y servicios de sucursal."

  function onSubmit(e){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const id = createAudit({
      sucursal: String(fd.get('nombre_sucursal') || ''),
      auditor: String(fd.get('nombre_auditor') || ''),
      plantillaId: String(fd.get('plantilla') || ''),
      fechaInicio: String(fd.get('fecha_inicio') || ''),
      fechaFin: String(fd.get('fecha_fin') || ''),
      responsableSucursal: String(fd.get('responsable_sucursal') || ''),
      correoResponsableSucursal: String(fd.get('correo_responsable_sucursal') || ''),
      objetivo: String(fd.get('objetivo') || DEFAULT_OBJETIVO),
      alcance: String(fd.get('alcance') || DEFAULT_ALCANCE),
      tipoAuditoria: String(fd.get('tipo_auditoria') || 'Integral'),
    })
    nav(`/audit/${id}`)
  }

  return (
    <form onSubmit={onSubmit} >
      <h1>Configuración de auditoría</h1>

      <label>Sucursal: <input name="nombre_sucursal" required /></label><br/>
      <label>Auditor Líder: <input name="nombre_auditor" required /></label><br/>
      <label> Tipo de auditoria:{""}
        <select name="tipo_auditoria" defaultValue="Integral">
            <option value="integral">Integral</option>
            <option value="agil">Ágil</option>
            <option value="dirigida">Dirigida</option>
        </select> 
      </label><br></br>

      <label>Fecha inicio: <input type="date" name="fecha_inicio" /></label><br/>
      <label>Fecha fin: <input type="date" name="fecha_fin" /></label><br/>

      <label>Responsable: <input name="responsable_sucursal" placeholder="Gerente o subgerente" /></label><br/>
      <label>Correo responsable: <input type="email" name="correo_responsable_sucursal" required /></label><br/>

      <label>Objetivo:<br/>
        <textarea name="objetivo" rows="3" defaultValue={DEFAULT_OBJETIVO}></textarea>
      </label><br/>

      <label>Alcance:<br/>
        <textarea name="alcance" rows="3" defaultValue={DEFAULT_ALCANCE}></textarea>
      </label><br/>

      <label>Plantilla:
        <select name="plantilla" defaultValue="">
          <option value="">(ninguna)</option>
          {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </label><br/><br/>

      <button>Guardar y continuar</button>
    </form>
  )
}
