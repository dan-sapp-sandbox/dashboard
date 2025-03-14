import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

type DataPoint = {
  date: string;
  value: number;
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
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const createGraph = (data: DataPoint[]) => {
    if (data.length === 0) {
      console.error("No valid data to display");
      return;
    }
    const parseDate = d3.timeParse("%Y-%m-%d");
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, (d) => parseDate(d.date)) as [Date, Date])
      .range([0, w]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)!])
      .range([h, 0]);

    const area = d3.area<DataPoint>()
      .x((d) => xScale(parseDate(d.date)!)!)
      .y0(h)
      .y1((d) => yScale(d.value)!)
      .curve(d3.curveMonotoneX);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    svg.selectAll("*").remove();

    const chartGroup = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    chartGroup.append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("opacity", 0.7)
      .attr("d", area as any);

    chartGroup.append("g")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6));

    chartGroup.append("g")
      .call(d3.axisLeft(yScale));
  };

  useEffect(() => {
    const socket = new WebSocket(`${baseApiUrl}/area`);

    socket.onopen = function () {
      socket.send("Connected to area chart data source");
    };

    socket.onmessage = function (event) {
      createGraph(JSON.parse(event.data).data);
    };

    socket.onclose = function () {
      console.log("Disconnected from area chart data source");
    };
  }, []);

  return <svg viewBox="0 0 800 500" ref={svgRef} width="100%"></svg>;
};

export default ScatterPlot;
