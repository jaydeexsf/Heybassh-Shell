'use client'

export default function Service(){
  return (
    <div className="max-w-[800px] mx-auto p-6">
      <div className="card">
        <h1 className="text-xl font-bold mb-2">Book a Service</h1>
        <p className="text-blue-200 text-sm mb-3">Submit a service request; we'll follow up by email.</p>
        <form className="grid gap-2" onSubmit={(e)=>{e.preventDefault(); alert('Submitted (demo)')}}>
          <input className="input" placeholder="Subject" />
          <select className="input">
            <option>Website Support</option>
            <option>HubSpot</option>
            <option>Integrations</option>
            <option>AI/Automation</option>
            <option>Custom</option>
          </select>
          <textarea className="input" rows={5} placeholder="Details"></textarea>
          <button className="btn btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}
