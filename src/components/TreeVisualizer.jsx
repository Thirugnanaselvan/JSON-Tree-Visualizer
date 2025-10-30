import { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";

function TreeVis({ data }) {
  const [nds, setNds] = useState([]);
  const [egs, setEgs] = useState([]);
  const [rf, setRf] = useState(null);

  useEffect(() => {
    if (!data) return;

    const { nodes: builtNds, edges: builtEgs } = makeTree(data);
    setNds(builtNds);
    setEgs(builtEgs);

    setTimeout(() => rf?.fitView({ padding: 0.2 }), 100);
  }, [data, rf]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nds}
        edges={egs}
        onInit={setRf}
        fitView
        attributionPosition="bottom-left"
      >
        <Background gap={16} />
        <Controls />
        <DirectionPad rfInstance={rf} />
      </ReactFlow>
    </div>
  );
}

function makeTree(obj, pId = null, path = "$", lvl = 0, xOff = 0) {
  const nds = [];
  const egs = [];
  const id = path;
  const clr = pickClr(obj);
  const V_GAP = 200;
  const H_GAP = 370;

  nds.push({
    id,
    data: {
      label:
        typeof obj === "object" && obj !== null
          ? path
          : `${path}: ${JSON.stringify(obj)}`,
    },
    position: { x: xOff, y: lvl * V_GAP },
    style: {
      background: clr,
      color: "#fff",
      padding: 15,
      borderRadius: 7,
      fontSize: 15,
      border: "1px solid #ddd",
    },
  });

  if (pId) egs.push({ id: `${pId}-${id}`, source: pId, target: id });

  if (typeof obj === "object" && obj !== null) {
    const keys = Array.isArray(obj) ? obj.map((_, i) => i) : Object.keys(obj);
    const totalW = (keys.length - 1) * H_GAP;
    const startX = xOff - totalW / 2;

    keys.forEach((key, i) => {
      const cPath = Array.isArray(obj)
        ? `${path}[${key}]`
        : `${path}.${key}`;
      const cOff = startX + i * H_GAP;

      const { nodes: cNds, edges: cEgs } = makeTree(
        obj[key],
        id,
        cPath,
        lvl + 1,
        cOff
      );
      nds.push(...cNds);
      egs.push(...cEgs);
    });
  }

  return { nodes: nds, edges: egs };
}

function pickClr(val) {
  if (Array.isArray(val)) return "#16a34a";
  if (typeof val === "object" && val !== null) return "#3b82f6";
  return "#f97316";
}

function DirectionPad({ rfInstance }) {
  const PAN_STEP = 100;

  function pan(x, y) {
    if (!rfInstance) return;
    const current = rfInstance.getViewport();
    rfInstance.setViewport({
      x: current.x - x,
      y: current.y - y,
      zoom: current.zoom,
    });
  }

  return (
    <div
      className="absolute bottom-6 right-6 flex flex-col items-center"
      style={{
        zIndex: 10,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 12,
        padding: "6px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      }}
    >
      <button onClick={() => pan(0, PAN_STEP)} className={btnStyle}>⬆️</button>
      <div className="flex">
        <button onClick={() => pan(PAN_STEP, 0)} className={btnStyle}>⬅️</button>
        <button onClick={() => pan(-PAN_STEP, 0)} className={btnStyle}>➡️</button>
      </div>
      <button onClick={() => pan(0, -PAN_STEP)} className={btnStyle}>⬇️</button>
    </div>
  );
}

const btnStyle =
  "bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-full px-4 py-1 text-lg m-0.5 transition pad-2px";

export default TreeVis;
