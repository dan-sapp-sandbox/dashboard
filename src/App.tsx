import "./App.css";
import Graph from "./components/Graph";

function App() {
  return (
    <div>
      <div className="text-zinc-200 text-4xl">
        Sapp Bros Dashboard
      </div>
      <div id="graph-wrapper" className="flex justify-center items-center">
        <Graph />
      </div>
    </div>
  );
}

export default App;
