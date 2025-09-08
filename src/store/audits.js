import { create } from 'zustand'
import { v4 as uuid } from 'uuid'

const persisted = localStorage.getItem('audits-state')
const initial = persisted ? JSON.parse(persisted) : {
  audits: [],
  templates: [
    { id: 'tpl-1', name: 'Auditoría básica', defaultFindings: [{ title:'Confidencialidad' }, { title:'Respaldos' }] }
  ],
  role: 'AUDITOR',
  user: 'manuel'
}

export const useAudits = create((set, get) => ({
  ...initial,

  setRole: (role) => { set({ role }); save() },

  createAudit: (p) => {
    const id = uuid()

    // Campos que vienen del formulario:
    const sucursal = p.sucursal ?? ''
    const auditor  = p.auditor  ?? ''
    const plantillaId = p.plantillaId ?? ''
    const fechaInicio = p.fechaInicio ?? ''
    const fechaFin    = p.fechaFin    ?? ''
    const responsableSucursal       = p.responsableSucursal ?? ''
    const correoResponsableSucursal = p.correoResponsableSucursal ?? ''
    const objetivo = p.objetivo ?? ''
    const alcance  = p.alcance  ?? ''
    const tipoAuditoria = p.tipoAuditoria ?? ''

    // Un "nombre" visible de la auditoría para encabezado
    const nombreAuditoria = p.nombreAuditoria ?? `Auditoría ${sucursal || ''}`.trim()

    // Quién crea / firma hallazgos por defecto
    const creadoPor = auditor || get().user

    // Precargar hallazgos si hay plantilla (usa las plantillas existentes)
    const tpl = get().templates.find(t => t.id === plantillaId)
    const findings = tpl
      ? tpl.defaultFindings.map(df => ({
          id: uuid(),
          title: df.title,
          notes: df.notes || '',
          createdAt: new Date().toISOString(),
          author: creadoPor,
        }))
      : []

    const audit = {
      id,
      nombreAuditoria,
      sucursal,
      auditor,
      plantillaId: plantillaId || null,
      fechaInicio,
      fechaFin,
      responsableSucursal,
      correoResponsableSucursal,
      objetivo,
      alcance,
      // metadatos
      creadoEl: new Date().toISOString(),
      creadoPor,
      findings,
      tipoAuditoria,
    }

    set({ audits: [audit, ...get().audits] })
    save()
    return id
  },

  updateAudit: (id, patch) => {
    set({ audits: get().audits.map(a => a.id===id ? { ...a, ...patch } : a) }); save()
  },

  // Firma hallazgos nuevos con el auditor de esa auditoría
  addFinding: (auditId, { title, notes }) => {
    const state = get()
    const audit = state.audits.find(a => a.id === auditId)
    const author = (audit?.auditor) || state.user
    set({
      audits: state.audits.map(a =>
        a.id===auditId
          ? { ...a, findings: [{ id: uuid(), title, notes: notes||'', createdAt: new Date().toISOString(), author }, ...a.findings] }
          : a
      )
    }); save()
  },

  addTemplate: ({ name, defaultFindings }) => {
    set({ templates: [{ id: uuid(), name, defaultFindings }, ...get().templates] }); save()
  },
}))

function save(){
  const { audits, templates, role, user } = useAudits.getState()
  localStorage.setItem('audits-state', JSON.stringify({ audits, templates, role, user }))
}
