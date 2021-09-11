import React, { useState, useEffect, RefObject } from 'react'
import './Basic.scss'
import * as d3 from  "d3" 
import { Type } from './types'
import { sankey } from 'd3-sankey'


const Basic = () /* or ( props : IBasicProps ) */ => {

  useEffect(() => {
    draw()
  })
  var units = "Pieces"
  var margin = {top: 10, right: 10, bottom: 10, left: 10}
  const width = 500 - margin.left - margin.right
  const height = 300 - margin.top - margin.bottom

  var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d: number) { return formatNumber(d) + " " + units; },
    color = d3.scaleOrdinal(d3.schemeCategory10);

  var sankey = d3.sankey()
  .nodeWidth(20)



  

  

  

  const draw = () => {
   
    const width = 500 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    d3.dsv(',',"/data/EmoRhe.csv", (d) => {
      const res = (d as unknown) as Type.Data
      return {
        source: res.source,
        target: res.target,
        value: res.value
      }
    }).then((data) => {

      const graph = {"nodes" : [], "links" : []} as Type.dataObject;
      data.forEach(function (d) {
      graph.nodes.push({ "name": d.source });
      graph.nodes.push({ "name": d.target });
      graph.links.push({ "source": d.source,
      "target": d.target,
      "value": +d.value });
      });
      // return only the distinct / unique nodes

      const whatever = 
      d3.group(graph.nodes, d=>d.name)
      const nodesName = Array.from(whatever.keys())
      
      graph.links.forEach(function (d, i) {
        graph.links[i].source = nodesName.indexOf(graph.links[i].source);
        graph.links[i].target = nodesName.indexOf(graph.links[i].target);
        });

      
      // loop through each link replacing the text with its index from node
      graph.nodes = []
      nodesName.forEach(function (d, i) {
        graph.nodes[i] = { "name": d };
        });

    
        sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

    

     console.log(graph)

     const svg = d3
    .select("#Basic")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    })
  }

  return (
    <div className="Basic" />

  )
}


interface IBasicProps {
  // TODO
}


export default Basic
