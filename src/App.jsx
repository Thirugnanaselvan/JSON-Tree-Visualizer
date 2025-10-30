import { useState } from "react";
import { ReactFlowProvider } from "reactflow";
import TreeVis from "./components/TreeVisualizer";

export default function App() {
  const [jsonTxt, setJsonTxt] = useState("");
  const [parsed, setParsed] = useState(null);
const exampleJson = `{
  "user": {
    "id": 1,
    "name": "Thiru",
    "address": { "city": "Chennai", "zip": "600001" },
    "phones": ["+91-98xxxxxxx", "+91-99xxxxxxx"]
  },
  "items": [
    { "id": "a1", "name": "Item A", "price": 9.99 },
    { "id": "b2", "name": "Item B", "price": 19.5 }
  ],
  "active": true
}`;
  const doVis = () => {
    try {
      const jsn = JSON.parse(jsonTxt);
      setParsed(jsn);
    } catch {
      alert("⚠️ Invalid JSON format.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-700 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-white">JSON Tree Visualizer</h1>
      <div className="flex flex-row gap-3 ">
        <h4 className="text-lg font-italic mb-6 text-white ">Assignment/Project done by</h4>
        <h2 className="text-3xl font-bold mb-6  text-gray-900">Thirugnanaselvan G P</h2>
      </div>
      <div className="flex flex-row gap-6">
        <div className="w-1/3 bg-white p-4 rounded shadow">
          <textarea
            value={jsonTxt}
            onChange={(e) => setJsonTxt(e.target.value)}
            placeholder="Paste JSON here..."
            className="w-full h-72 p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={doVis}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
          >
            Visualize
          </button>
        </div>
        <div className="flex-1 border rounded bg-white overflow-hidden h-[600px]">
          {parsed ? (
            <ReactFlowProvider>
              <TreeVis data={parsed} />
            </ReactFlowProvider>
          ) : (
            <div className="p-8 text-gray-500 text-center">
              Paste JSON 👈 and click “Visualize” to see the structure
            </div>
          )}
        </div>
      </div>
      <div className=" p-10 rounded">
        <h3 className="text-white text-3xl ">Description:</h3>
        <ul className="pl-4 pt-4 text-gray-300 list-disc">
          <li><p>The web app was built in motive of visualizing the JSON Web Tree -- showing how keys, arrays, and values relate to each other in a visual way. </p></li>
          <li><p>Just create a basic JSON tree in textarea and visualize it in right panel.</p></li>
<li>
  <p>I have also attached the basic example for JSON tree to test the code:</p>
  <pre><code>{exampleJson}</code></pre>
</li>
        </ul>
      </div>
    </div>
  );
}
