import React, { useState } from 'react';
import { useAudits } from '../store/audits.js';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAudits();
  const nav = useNavigate();
  
  // Estados del formulario
  const [credentials, setCredentials] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');
  const [showRequest, setShowRequest] = useState(false); // Para mostrar el cuadro de solicitud

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(credentials.usuario, credentials.password);
    if (success) {
      nav('/'); // Redirigir al Home si es correcto
    } else {
      setError('❌ Usuario o contraseña incorrectos.');
    }
  };

  const handleRequestAccess = (e) => {
    e.preventDefault();
    alert("Solicitud enviada al Administrador. Te contactaremos pronto.");
    setShowRequest(false);
  };

  return (
    <div style={{
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }}>
      
      <div className="card" style={{width: '100%', maxWidth: '400px', padding: '2.5rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'}}>
        
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h1 style={{color: '#0f172a', margin: 0, fontSize: '2rem'}}>Auditoren</h1>
          <p className="text-muted">Sistema de Gestión de Calidad</p>
        </div>

        {!showRequest ? (
          // --- FORMULARIO DE LOGIN ---
          <form onSubmit={handleLogin}>
            <div style={{marginBottom: '1rem'}}>
              <label>Usuario</label>
              <input 
                type="text" 
                placeholder="Ej. juan"
                value={credentials.usuario}
                onChange={e => setCredentials({...credentials, usuario: e.target.value})}
                style={{padding: '12px'}}
              />
            </div>
            
            <div style={{marginBottom: '1.5rem'}}>
              <label>Contraseña</label>
              <input 
                type="password" 
                placeholder="••••••"
                value={credentials.password}
                onChange={e => setCredentials({...credentials, password: e.target.value})}
                style={{padding: '12px'}}
              />
            </div>

            {error && <div style={{color: 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center'}}>{error}</div>}

            <button type="submit" style={{width: '100%', padding: '12px', fontSize: '1rem'}}>Ingresar</button>
            
            <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem'}}>
              <span className="text-muted">¿No tienes cuenta? </span>
              <a href="#" onClick={(e) => {e.preventDefault(); setShowRequest(true)}} style={{color: '#3b82f6'}}>
                Solicitar acceso
              </a>
            </div>
          </form>
        ) : (
          // --- FORMULARIO DE SOLICITUD DE ACCESO ---
          <form onSubmit={handleRequestAccess}>
            <h3 style={{marginTop: 0}}>Solicitud de Acceso</h3>
            <p className="text-muted" style={{fontSize: '0.9rem'}}>Describe tu puesto y por qué necesitas acceso al sistema.</p>
            
            <textarea 
              rows="4" 
              placeholder="Ej. Soy Roberto Pérez, nuevo auditor de la zona norte..." 
              required
              style={{width: '100%', marginBottom: '1rem'}}
            />
            
            <div style={{display: 'flex', gap: '10px'}}>
              <button type="button" className="secondary" onClick={() => setShowRequest(false)} style={{flex: 1}}>Volver</button>
              <button type="submit" style={{flex: 1}}>Enviar</button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}