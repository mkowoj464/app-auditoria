import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

export const useAudits = create(
  persist(
    (set, get) => ({
      // --- ESTADO INICIAL ---
      audits: [],
      role: 'AUDITOR', // Rol por defecto

      // --- ACCIONES ---
      
      setRole: (role) => set({ role }),

      // Crear Auditoría: Recibe todos los datos del formulario (incluyendo el checklist generado)
      createAudit: (auditData) => {
        const newAudit = {
          id: uuid(), // Usamos tu librería uuid
          creadoEl: new Date().toISOString(),
          findings: [], // Mantenemos esto por compatibilidad
          checklist: [], // Aquí se guardarán los reactivos
          ...auditData // Sobrescribe con lo que venga del formulario (NewAudit.jsx)
        }

        // Agregamos la nueva auditoría al principio del array
        set((state) => ({
          audits: [newAudit, ...state.audits]
        }))

        return newAudit.id
      },

      // Actualizar Auditoría: Sirve para marcar checks, editar textos, etc.
      updateAudit: (id, changes) => {
        set((state) => ({
          audits: state.audits.map((audit) => 
            audit.id === id ? { ...audit, ...changes } : audit
          )
        }))
      },

      // (Opcional) Eliminar auditoría
      deleteAudit: (id) => {
        set((state) => ({
          audits: state.audits.filter((a) => a.id !== id)
        }))
      }
    }),
    {
      name: 'audits-storage', // Nombre con el que se guarda en localStorage
    }
  )
)