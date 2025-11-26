import React, { useState } from 'react';
import { useAudits } from '../store/audits.js';

export default function AdminUsers() {
  const { users, addUser, deleteUser } = useAudits();
  
  // Estado local para el formulario
  const [formData, setFormData] = useState({
    nombre: '', puesto: '', fechaIngreso: '', numEmpleado: '', 
    usuario: '', password: '', rol: 'AUDITOR'
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addUser(formData);
    alert('Usuario creado exitosamente');
    setFormData({ nombre: '', puesto: '', fechaIngreso: '', numEmpleado: '', usuario: '', password: '', rol: 'AUDITOR' }); // Reset
  };

  return (
    <div className="container">
      <h1 style={{color:'#0f172a'}}>🛡️ Panel de Gestión de Usuarios</h1>
      <p className="text-muted">Administración de accesos y roles del sistema.</p>

      <div className="grid-2" style={{gridTemplateColumns: '1fr 2fr', gap:'2rem', alignItems:'start'}}>
        
        {/* FORMULARIO DE ALTA */}
        <div className="card">
            <h3>Nuevo Empleado</h3>
            <form onSubmit={handleSubmit}>
                <label>Nombre Completo <input name="nombre" required value={formData.nombre} onChange={handleChange} /></label>
                <label>Puesto <input name="puesto" required value={formData.puesto} onChange={handleChange} /></label>
                <div className="grid-2" style={{gap:'10px'}}>
                    <label>No. Empleado <input name="numEmpleado" type="number" required value={formData.numEmpleado} onChange={handleChange} /></label>
                    <label>Fecha Ingreso <input name="fechaIngreso" type="date" required value={formData.fechaIngreso} onChange={handleChange} /></label>
                </div>
                <hr style={{margin:'1rem 0', border:'0', borderTop:'1px solid #eee'}}/>
                <div className="grid-2" style={{gap:'10px'}}>
                    <label>Usuario <input name="usuario" required value={formData.usuario} onChange={handleChange} /></label>
                    <label>Contraseña <input name="password" type="password" required value={formData.password} onChange={handleChange} /></label>
                </div>
                <label>Rol de Sistema
                    <select name="rol" value={formData.rol} onChange={handleChange}>
                        <option value="AUDITOR">Auditor</option>
                        <option value="COORDINADOR">Coordinador</option>
                    </select>
                </label>
                <button type="submit" style={{width:'100%', marginTop:'1rem'}}>Crear Usuario</button>
            </form>
        </div>

        {/* TABLA DE USUARIOS EXISTENTES */}
        <div className="card">
            <h3>Directorio de Usuarios</h3>
            <table style={{width:'100%', borderCollapse:'collapse', marginTop:'1rem'}}>
                <thead style={{background:'#f8fafc', textAlign:'left'}}>
                    <tr>
                        <th style={{padding:'10px'}}>Nombre / Puesto</th>
                        <th style={{padding:'10px'}}>Usuario</th>
                        <th style={{padding:'10px'}}>Rol</th>
                        <th style={{padding:'10px'}}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} style={{borderBottom:'1px solid #eee'}}>
                            <td style={{padding:'10px'}}>
                                <strong>{u.nombre}</strong><br/>
                                <span style={{fontSize:'0.8rem', color:'#64748b'}}>{u.puesto}</span>
                            </td>
                            <td style={{padding:'10px'}}>{u.usuario}</td>
                            <td style={{padding:'10px'}}>
                                <span style={{
                                    background: u.rol === 'COORDINADOR' ? '#e0f2fe' : '#f1f5f9',
                                    color: u.rol === 'COORDINADOR' ? '#0284c7' : '#475569',
                                    padding:'2px 8px', borderRadius:'10px', fontSize:'0.8rem', fontWeight:'bold'
                                }}>{u.rol}</span>
                            </td>
                            <td style={{padding:'10px'}}>
                                <button onClick={() => deleteUser(u.id)} style={{background:'#ef4444', padding:'5px 10px', fontSize:'0.8rem'}}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}