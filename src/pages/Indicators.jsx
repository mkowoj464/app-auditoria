import React from 'react';

export default function Indicators() {
  // Datos simulados para el prototipo visual (Mock Data)
  const topSucursalesBajas = [
    { nombre: 'Sucursal Norte', score: 45 },
    { nombre: 'Centro Histórico', score: 52 },
    { nombre: 'Plaza del Sol', score: 58 },
    { nombre: 'Zona Industrial', score: 60 },
    { nombre: 'Valle Real', score: 65 },
  ];

  return (
    <div className="container">
      <h1 style={{marginBottom:'1rem'}}>📊 Tablero de Indicadores</h1>
      
      {/* BARRA DE FILTROS (Visual) */}
      <div className="card" style={{display:'flex', gap:'1rem', flexWrap:'wrap', padding:'1rem', background:'#f8fafc'}}>
         <select style={{margin:0, flex:1}}><option>Año 2025</option></select>
         <select style={{margin:0, flex:1}}><option>Todas las Zonas</option></select>
         <select style={{margin:0, flex:1}}><option>Todas las Sucursales</option></select>
         <select style={{margin:0, flex:1}}><option>Todos los Auditores</option></select>
         <button style={{flex:0, padding:'0 2rem'}}>Filtrar</button>
      </div>

      {/* TABLA DE RESUMEN */}
      <div className="grid-2" style={{gridTemplateColumns: '2fr 1fr', gap:'1.5rem'}}>
        <div className="card">
            <h3>Resumen de Cumplimiento</h3>
            <table style={{width:'100%', borderCollapse:'collapse', marginTop:'1rem'}}>
                <thead style={{background:'#f1f5f9'}}>
                    <tr>
                        <th style={{padding:'10px', textAlign:'left'}}>Sucursal</th>
                        <th style={{padding:'10px', textAlign:'center'}}>Auditorías</th>
                        <th style={{padding:'10px', textAlign:'center'}}>No Conformidades</th>
                        <th style={{padding:'10px', textAlign:'center'}}>Score Prom.</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'10px'}}>Guadalajara Américas</td>
                        <td style={{padding:'10px', textAlign:'center'}}>3</td>
                        <td style={{padding:'10px', textAlign:'center', color:'red', fontWeight:'bold'}}>12</td>
                        <td style={{padding:'10px', textAlign:'center'}}>85%</td>
                    </tr>
                    <tr style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'10px'}}>CDMX Sur</td>
                        <td style={{padding:'10px', textAlign:'center'}}>5</td>
                        <td style={{padding:'10px', textAlign:'center', color:'red', fontWeight:'bold'}}>8</td>
                        <td style={{padding:'10px', textAlign:'center'}}>92%</td>
                    </tr>
                    <tr>
                        <td style={{padding:'10px'}}>Monterrey Centro</td>
                        <td style={{padding:'10px', textAlign:'center'}}>2</td>
                        <td style={{padding:'10px', textAlign:'center', color:'red', fontWeight:'bold'}}>25</td>
                        <td style={{padding:'10px', textAlign:'center'}}>60%</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {/* GRÁFICA DE BARRAS (CSS PURO) - Top Sucursales Bajas */}
        <div className="card">
            <h3 style={{color:'#ef4444'}}>⚠️ Top Riesgo (Calif. Baja)</h3>
            <div style={{marginTop:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem'}}>
                {topSucursalesBajas.map((suc, index) => (
                    <div key={index}>
                        <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px'}}>
                            <span>{suc.nombre}</span>
                            <strong>{suc.score}%</strong>
                        </div>
                        <div style={{width:'100%', height:'10px', background:'#e2e8f0', borderRadius:'5px', overflow:'hidden'}}>
                            <div style={{
                                width: `${suc.score}%`, 
                                height:'100%', 
                                background: suc.score < 50 ? '#ef4444' : '#f59e0b',
                                borderRadius:'5px'
                            }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}