import { useNavigate } from 'react-router-dom'
import { useAudits } from '../store/audits.js'
import { templatesData } from '../data/templates.js' // Importamos la data centralizada

export default function NewAudit(){
  const { createAudit } = useAudits()
  const nav = useNavigate()

  const DEFAULT_OBJETIVO = "Evaluar nivel de cumplimiento normativo de la LFPDPPP."
  const DEFAULT_ALCANCE  = "Todas las áreas, procesos y servicios de sucursal."

  function onSubmit(e){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    
    const plantillaId = String(fd.get('plantilla') || '');
    
    // LÓGICA CLAVE: Buscar los items de la plantilla seleccionada
    const selectedTemplate = templatesData.find(t => t.id === plantillaId);
    
    // Crear el checklist inicial basado en la plantilla
    const checklistInicial = selectedTemplate 
      ? selectedTemplate.items.map(item => ({
          id: crypto.randomUUID(), // Generamos ID único para cada reactivo
          pregunta: item,
          estado: 'pendiente', // pendiente, cumple, no_cumple, na
          hallazgo: '' // Texto vacío
        }))
      : [];

    const id = createAudit({
      sucursal: String(fd.get('nombre_sucursal') || ''),
      auditor: String(fd.get('nombre_auditor') || ''),
      plantillaId: plantillaId,
      checklist: checklistInicial, // ¡Aquí guardamos los reactivos en la auditoría!
      fechaInicio: String(fd.get('fecha_inicio') || ''),
      fechaFin: String(fd.get('fecha_fin') || ''),
      responsableSucursal: String(fd.get('responsable_sucursal') || ''),
      correoResponsableSucursal: String(fd.get('correo_responsable_sucursal') || ''),
      objetivo: String(fd.get('objetivo') || DEFAULT_OBJETIVO),
      alcance: String(fd.get('alcance') || DEFAULT_ALCANCE),
      tipoAuditoria: String(fd.get('tipo_auditoria') || 'Integral'),
      creadoEl: new Date().toISOString()
    })
    nav(`/audit/${id}`)
  }

  return (
    <div className="container">
      <div className="card">
        <h1>Configuración de Auditoría</h1>
        <p className="text-muted">Complete los datos generales para iniciar el ciclo de revisión.</p>
        
        <form onSubmit={onSubmit}>
          <div className="grid-2">
            <label>
              Sucursal
              <input name="nombre_sucursal" required placeholder="Ej. Guadalajara Centro" />
            </label>
            <label>
              Auditor Líder
              <input name="nombre_auditor" required placeholder="Ej. Juan Pérez" />
            </label>
          </div>

          <div className="grid-2">
            <label>
              Tipo de auditoría
              <select name="tipo_auditoria" defaultValue="Integral">
                  <option value="integral">Integral</option>
                  <option value="agil">Ágil</option>
                  <option value="dirigida">Dirigida</option>
              </select> 
            </label>
            <label>
              Plantilla (Carga de Reactivos)
              <select name="plantilla" defaultValue="">
                <option value="">-- Seleccionar plantilla --</option>
                {templatesData.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </label>
          </div>

          <div className="grid-2">
            <label>Fecha inicio <input type="date" name="fecha_inicio" /></label>
            <label>Fecha fin <input type="date" name="fecha_fin" /></label>
          </div>

          <div className="grid-2">
            <label>Responsable <input name="responsable_sucursal" placeholder="Gerente o encargado" /></label>
            <label>Correo <input type="email" name="correo_responsable_sucursal" required /></label>
          </div>

          <label>
            Objetivo
            <textarea name="objetivo" rows="3" defaultValue={DEFAULT_OBJETIVO}></textarea>
          </label>

          <label>
            Alcance
            <textarea name="alcance" rows="3" defaultValue={DEFAULT_ALCANCE}></textarea>
          </label>

          <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
             <button type="button" className="secondary" onClick={() => nav('/')} style={{marginRight: '10px'}}>Cancelar</button>
             <button type="submit">Guardar y Continuar</button>
          </div>
        </form>
      </div>
    </div>
  )
}