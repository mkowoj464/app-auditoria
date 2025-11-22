import React from 'react';
import { templatesData } from '../data/templates.js';

function Templates() {
  const handleSelect = (nombre) => {
    alert(`Esta plantilla contiene ${templatesData.find(t => t.name === nombre).items.length} reactivos de verificación.`);
  };

  return (
    <div className="container">
       <div style={{marginBottom: '2rem'}}>
          <h1>Plantillas de Auditoría</h1>
          <p className="text-muted">Estándares predefinidos para agilizar el proceso de revisión.</p>
       </div>

      <div className="grid-2">
        {templatesData.map((t) => (
          <div key={t.id} className="card" style={{marginBottom:0, transition: 'transform 0.2s'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start'}}>
               <h3 style={{color: '#0f172a', marginTop:0}}>{t.name}</h3>
               <span style={{background:'#eff6ff', color:'#3b82f6', padding:'2px 8px', borderRadius:'4px', fontSize:'0.8rem'}}>
                 {t.items.length} Reactivos
               </span>
            </div>
            <p className="text-muted">{t.description}</p>
            <div style={{marginTop:'1rem', paddingTop:'1rem', borderTop:'1px solid #f1f5f9'}}>
                <button 
                  className="secondary"
                  onClick={() => handleSelect(t.name)}
                  style={{width: '100%'}}>
                  Ver detalles
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Templates;