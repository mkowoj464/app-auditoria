export function exportCSV(audit) {
  // 1. Definimos los encabezados de las columnas
  const headers = [
    "ID_Auditoria", 
    "Sucursal", 
    "Auditor_Lider", 
    "Fecha_Inicio", 
    "Tipo_Auditoria", 
    "Objetivo",
    "Reactivo_Pregunta", 
    "Estado_Cumplimiento", 
    "Descripcion_Hallazgo"
  ];

  // 2. Validamos que exista el checklist
  const listaVerificacion = audit.checklist || [];

  // 3. Mapeamos los datos: Una fila por cada reactivo
  // Repetimos los datos generales de la auditoría en cada fila para facilitar el análisis de datos
  const rows = listaVerificacion.map(item => {
    return [
      audit.id,
      audit.sucursal,
      audit.auditor,
      audit.fechaInicio,
      audit.tipoAuditoria,
      audit.objetivo,
      item.pregunta,         // El reactivo de la plantilla
      item.estado,           // 'cumple', 'no_cumple', 'na', 'pendiente'
      item.hallazgo          // Lo que escribió el auditor
    ];
  });

  // 4. Función auxiliar para "escapar" los textos (manejo de comas y comillas en CSV)
  const escapeCSV = (text) => {
    if (text === null || text === undefined) return "";
    const stringText = String(text);
    // Si el texto tiene comas, comillas o saltos de línea, hay que envolverlo en comillas
    if (stringText.includes(",") || stringText.includes("\n") || stringText.includes('"')) {
      return `"${stringText.replace(/"/g, '""')}"`;
    }
    return stringText;
  };

  // 5. Construimos el contenido del CSV uniendo todo con comas
  const csvContent = [
    headers.join(","), // Fila de encabezados
    ...rows.map(row => row.map(escapeCSV).join(",")) // Filas de datos
  ].join("\n");

  // 6. Disparamos la descarga
  // \uFEFF es el "BOM" para que Excel reconozca los acentos y la ñ automáticamente
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  // Nombre del archivo: Auditoria_Sucursal_Fecha.csv
  const cleanSucursal = (audit.sucursal || 'Auditoria').replace(/[^a-z0-9]/gi, '_');
  link.setAttribute("download", `Auditoria_${cleanSucursal}_${audit.fechaInicio}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}