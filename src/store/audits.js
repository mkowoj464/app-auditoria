import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { v4 as uuid } from 'uuid'

export const useAudits = create(
  persist(
    (set, get) => ({
      // DATOS
      audits: [],
      // Usuarios iniciales (puedes agregar más desde el panel Admin)
      users: [
        { id: 'u1', nombre: 'Juan Pérez', puesto: 'Auditor Senior', usuario: 'juan', password: '123', rol: 'AUDITOR' },
        { id: 'u2', nombre: 'Maria Gomez', puesto: 'Coordinadora', usuario: 'maria', password: '123', rol: 'COORDINADOR' },
        { id: 'u3', nombre: 'Admin Sistema', puesto: 'IT', usuario: 'admin', password: '123', rol: 'ADMIN' }
      ],
      
      // ESTADO DE SESIÓN
      currentUser: null, // Aquí guardamos quién está logueado
      role: null,        // El rol activo (se fija al loguear)

      // --- ACCIONES DE AUTENTICACIÓN ---
      login: (usuario, password) => {
        const foundUser = get().users.find(u => u.usuario === usuario && u.password === password);
        if (foundUser) {
          set({ currentUser: foundUser, role: foundUser.rol });
          return true; // Login exitoso
        }
        return false; // Login fallido
      },

      logout: () => {
        set({ currentUser: null, role: null });
      },

      // --- GESTIÓN DE AUDITORÍAS (Igual que antes) ---
      createAudit: (auditData) => {
        const newAudit = {
          id: uuid(),
          creadoEl: new Date().toISOString(),
          findings: [],
          checklist: [],
          status: 'borrador',
          evidence: null,
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
        set((state) => ({ audits: state.audits.filter((a) => a.id !== id) }))
      },

      // --- GESTIÓN DE USUARIOS (Igual que antes) ---
      addUser: (userData) => {
        set((state) => ({ users: [...state.users, { id: uuid(), ...userData }] }))
      },

      deleteUser: (id) => {
        set((state) => ({ users: state.users.filter((u) => u.id !== id) }))
      }
    }),
    { name: 'audits-storage' }
  )
)