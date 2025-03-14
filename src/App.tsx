import ScatterPlot from "./components/ScatterPlot";
import AreaChart from "./components/AreaChart";
import Card from "./components/Card";

function App() {
  return (
    <div>
      <div className="text-zinc-200 text-4xl mb-16">
        Sapp Bros Dashboard
      </div>
      <div className="grid grid-cols-12 gap-6">
        <Card>
          <ScatterPlot />
        </Card>
        <Card>
          <AreaChart />
        </Card>
        <Card>
          <AreaChart />
        </Card>
        <Card>
          <ScatterPlot />
        </Card>
      </div>
    </div>
  );
}

export default App;
