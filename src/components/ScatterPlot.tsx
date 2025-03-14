import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type DataPoint = {
  x: number;
  y: number;
};

const ScatterPlot: React.FC = () => {
  const isProduction = window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1";
  const baseApiUrl = isProduction
    ? "wss://dashboard-api-livid.vercel.app/ws"
    : "ws://127.0.0.1:8000/ws";
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  const xScale = d3.scaleLinear().domain([0, 100]).range([
    margin.left,
    width - margin.right,
  ]);
  const yScale = d3.scaleLinear().domain([0, 100]).range([
    height - margin.bottom,
    margin.top,
  ]);

  const createGraph = (data: DataPoint[]) => {
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
  };

  useEffect(() => {
    const socket = new WebSocket(`${baseApiUrl}/scatter`);

    socket.onopen = function () {
      socket.send("Connected to scatter plot data source");
    };

    socket.onmessage = function (event) {
      createGraph(JSON.parse(event.data).data);
    };

    socket.onerror = function (event) {
      console.log("fail", event);
    };

    socket.onclose = function () {
      console.log("Disconnected from scatter plot data source");
    };
  }, []);

  return <svg viewBox="0 0 800 500" ref={svgRef} width="100%"></svg>;
};

export default ScatterPlot;
