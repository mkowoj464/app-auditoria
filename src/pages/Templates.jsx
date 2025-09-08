import { useAudits } from '../store/audits.js'

export default function Templates(){
  const { templates, addTemplate } = useAudits()

  function onSubmit(e){
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name')||'')
    const f1 = String(fd.get('f1')||'')
    addTemplate({ name, defaultFindings: f1 ? [{ title: f1 }] : [] })
    e.currentTarget.reset()
  }

  return (
    <section>
      <h1>Plantillas</h1>
      <form onSubmit={onSubmit}>
        <input name="name" placeholder="Nombre de la plantilla" required/>
        <input name="f1" placeholder="Hallazgo por defecto (opcional)"/>
        <button>Crear plantilla</button>
      </form>
      <ul>{templates.map(t => <li key={t.id}>{t.name}</li>)}</ul>
    </section>
  )
}
