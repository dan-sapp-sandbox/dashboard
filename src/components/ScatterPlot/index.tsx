import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataPoint } from "./initData";
import { gql, useQuery } from "@apollo/client";

const GET_SCATTERPLOT_DATA = gql`
  query GetScatterplotData {
    scatterplotData {
      x
      y
    }
  }
`;

const ScatterPlot: React.FC = () => {
  const { data, loading } = useQuery(GET_SCATTERPLOT_DATA);
  const svgRef = useRef<SVGSVGElement>(null);
  const width = 800;
  const height = 500;
  const margin = { top: 50, right: 20, bottom: 60, left: 60 };
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

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("color", "white")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("Scatter Plot");

    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("X Value");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("Y Value");

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
    if (!loading) {
      createGraph(data?.scatterplotData);
    }
  }, [data]);

  return <svg viewBox="0 0 800 500" ref={svgRef}></svg>;
};

export default ScatterPlot;
