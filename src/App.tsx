// import ScatterPlot from "./components/ScatterPlot";
import AreaChart from "./components/AreaChart";
import Card from "./components/Card";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // uri: "http://127.0.0.1:8000/graphql",
  uri: "https://dashboard-api-xi.vercel.app/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <div className="">
          {/* <Card>
            <ScatterPlot />
          </Card> */}
          <Card>
            <AreaChart />
          </Card>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
