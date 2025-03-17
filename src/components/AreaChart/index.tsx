import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataPoint } from "./initData";
import { gql, useQuery } from "@apollo/client";

const GET_AREACHART_DATA = gql`
  query GetAreachartData {
    areachartData {
      date
      value
    }
  }
`;

const AreaChart: React.FC = () => {
  const { data, loading, error } = useQuery(GET_AREACHART_DATA);
  const svgRef = useRef<SVGSVGElement>(null);
  const graphElementsRef = useRef<any>(null);
  const width = 800;
  const height = 500;
  const margin = { top: 60, right: 20, bottom: 60, left: 60 };
  const w = width - margin.left - margin.right;
  const h = height - margin.top - margin.bottom;

  const createGraph = (data: DataPoint[]) => {
    if (!data?.length) return;
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

    const areaPath = chartGroup.append("path")
      .datum(data)
      .attr("fill", "steelblue")
      .attr("opacity", 0.8)
      .attr("d", area as any);

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top / 2)
      .attr("color", "white")
      .attr("text-anchor", "middle")
      .attr("font-size", "20px")
      .attr("font-weight", "bold")
      .text("Ice Cream Sales in 2024");

    // Add x-axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("Date");

    // Add y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", margin.left / 4)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("Sales $");

    chartGroup.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${h})`)
      .call(d3.axisBottom(xScale).ticks(6));

    chartGroup.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));

    graphElementsRef.current = { area, areaPath, xScale, yScale };
  };

  useEffect(() => {
    if (!graphElementsRef.current?.area && !loading) {
      createGraph(data?.areachartData);
      return;
    } else if (graphElementsRef.current?.area && data?.areachartData) {
      const { area, areaPath, xScale, yScale } = graphElementsRef.current;

      const updateGraph = (data: DataPoint[]) => {
        const parseDate = d3.timeParse("%Y-%m-%d");

        xScale.domain(
          d3.extent(data, (d) => parseDate(d.date)) as [Date, Date],
        );
        yScale.domain([0, d3.max(data, (d) => d.value)!]);

        const svg = d3.select(svgRef.current).select("g");

        svg.select(".x-axis")
          .transition()
          .duration(1000)
          .call(d3.axisBottom(xScale).ticks(6) as any);

        svg.select(".y-axis")
          .transition()
          .duration(1000)
          .call(d3.axisLeft(yScale) as any);

        areaPath.datum(data)
          .transition()
          .duration(1000)
          .attr("d", area)
          .ease(d3.easeCubicOut);
      };

      if (data?.areachartData) {
        updateGraph(data.areachartData);
      }
    }
  }, [data]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <svg viewBox="0 0 800 500" ref={svgRef}></svg>;
};

export default AreaChart;
