import React, { useState } from 'react'
import sampleData from '../data/sample.json'

export default function JsonInput({ onVis }) {
  const [txt, setTxt] = useState('')
  const [errMsg, setErrMsg] = useState('')

  const doVis = () => {
    setErrMsg('')
    try {
      const parsed = JSON.parse(txt)
      onVis(parsed)
    } catch (e) {
      setErrMsg(e.message)
    }
  }

  const loadSmp = () => {
    setTxt(JSON.stringify(sampleData, null, 2))
  }

  const clrAll = () => {
    setTxt('')
    setErrMsg('')
    onVis(null)
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex gap-2">
        {/* <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={loadSmp}>Load sample</button> */}
        <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={doVis}>Visualize</button>
        {/* <button className="px-3 py-1 bg-gray-300 rounded" onClick={clrAll}>Clear</button> */}
      </div>

      <textarea
        className="w-full h-56 p-3 border rounded font-mono text-sm"
        value={txt}
        onChange={e => setTxt(e.target.value)}
        placeholder="Paste JSON here and click Visualize"
      />

      {errMsg && <div className="text-red-600">Invalid JSON: {errMsg}</div>}
    </div>
  )
}
