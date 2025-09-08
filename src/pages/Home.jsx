import { Link } from 'react-router-dom'
import { useAudits } from '../store/audits.js'

export default function Home(){
  const { audits } = useAudits()
  return (
    <section>
      <h1>Mis auditorías</h1>
      {audits.length === 0 ? <p>No hay auditorías.</p> : (
        <ul>
          {audits.map(a => (
            <li key={a.id}>
              <Link to={`/audit/${a.id}`}>
                {a.nombreAuditoria || `Auditoría ${a.sucursal || ''}`}
              </Link> — {a.creadoEl ? new Date(a.creadoEl).toLocaleDateString() : '—'}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
