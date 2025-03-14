import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type DataPoint = {
  x: number;
  y: number;
};
type Response = {
  data: DataPoint[];
};

const ScatterPlot: React.FC = () => {
  const apiUrl = "https://dashboard-api-livid.vercel.app/data";
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 500;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const xScale = d3.scaleLinear().domain([0, 100]).range([
    margin.left,
    width - margin.right,
  ]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([
    height - margin.bottom,
    margin.top,
  ]);

  useEffect(() => {
    fetch(apiUrl)
      .then(async (res) => {
        const { data }: Response = await res.json();
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg.append("g")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(d3.axisBottom(xScale));

        svg.append("g")
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(yScale));

        svg.append("g")
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
          .attr("cx", (d) => xScale(d.x))
          .attr("cy", (d) => yScale(d.y))
          .attr("r", 5)
          .attr("fill", "steelblue");
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default ScatterPlot;
