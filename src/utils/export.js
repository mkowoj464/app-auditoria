export function exportCSV(audit){
  const rows = audit.findings.map(f => ({
    auditoria: audit.nombreAuditoria || `Auditoría ${audit.sucursal || ''}`,
    sucursal: audit.sucursal || '',
    tipo: audit.tipoAuditoria || '',
    titulo: f.title,
    notas: f.notes || '',
    creadoEn: f.createdAt,
    autor: f.author
  }))

  const header = 'auditoria,sucursal,tipo,titulo,notas,creadoEn,autor\n'
  const body = rows.map(r => [
    r.auditoria, r.sucursal, r.tipo, r.titulo, (r.notas||'').replace(/\n/g,' '), r.creadoEn, r.autor].map(s => `"${String(s ?? '').replace(/"/g,'""')}"`).join(',')).join('\n')

  download(`${slug(audit.nombreAuditoria || audit.sucursal || 'auditoria')}.csv`, header + body)
}

function slug(s){ return String(s).toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'') }
function download(filename, text){
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob); const a = document.createElement('a')
  a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url)
}
