import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

export const useAudits = create(
  persist(
    (set, get) => ({
      audits: [],
      role: 'AUDITOR', // Rol por defecto

      setRole: (role) => set({ role }),

      createAudit: (auditData) => {
        const newAudit = {
          id: uuid(),
          creadoEl: new Date().toISOString(),
          findings: [],
          checklist: [],
          status: 'borrador', // Nuevo estado: 'borrador' o 'enviado'
          evidence: null,     // Para guardar el nombre del archivo
          ...auditData
        }
        set((state) => ({ audits: [newAudit, ...state.audits] }))
        return newAudit.id
      },

      updateAudit: (id, changes) => {
        set((state) => ({
          audits: state.audits.map((audit) => 
            audit.id === id ? { ...audit, ...changes } : audit
          )
        }))
      },

      deleteAudit: (id) => {
        set((state) => ({
          audits: state.audits.filter((a) => a.id !== id)
        }))
      }
    }),
    { name: 'audits-storage' }
  )
)