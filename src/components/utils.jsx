let nextId = 1;

export const genId = () => `n${nextId++}`;

export function buildFlow(json) {
  nextId = 1;
  const nds = [];
  const egs = [];

  function walk(val, path = "$", lvl = 0) {
    const id = genId();
    const base = {
      id,
      position: { x: 0, y: lvl * 120 },
      data: { path, val },
    };

    if (Array.isArray(val)) {
      base.data.typ = "arr";
      base.data.title = `${path} [${val.length}]`;
      nds.push({ ...base, className: "nd-arr" });
      const kids = val.map((v, i) => walk(v, `${path}[${i}]`, lvl + 1));
      kids.forEach(k => egs.push({ id: `e${id}_${k.id}`, source: id, target: k.id }));
      return base;
    }

    if (val && typeof val === "object") {
      base.data.typ = "obj";
      base.data.title = `${path} (obj)`;
      nds.push({ ...base, className: "nd-obj" });
      const kids = Object.keys(val).map(k => walk(val[k], `${path}.${k}`, lvl + 1));
      kids.forEach(k => egs.push({ id: `e${id}_${k.id}`, source: id, target: k.id }));
      return base;
    }

    base.data.typ = "val";
    base.data.title = `${path}: ${JSON.stringify(val)}`;
    nds.push({ ...base, className: "nd-val" });
    return base;
  }

  walk(json);

  const lvlMap = {};
  nds.forEach(n => {
    const d = Math.round(n.position.y / 120);
    if (!lvlMap[d]) lvlMap[d] = [];
    lvlMap[d].push(n);
  });

  Object.values(lvlMap).forEach(list =>
    list.forEach((n, i) => (n.position.x = i * 220 + 50))
  );

  return { nodes: nds, edges: egs };
}

export const findNode = (nds, path) => {
  if (!path) return null;
  const norm = p =>
    p.startsWith("$") ? p : p.startsWith(".") ? `$${p}` : `$.${p}`;
  const target = norm(path.trim());
  return nds.find(n => n.data?.path === target);
};
