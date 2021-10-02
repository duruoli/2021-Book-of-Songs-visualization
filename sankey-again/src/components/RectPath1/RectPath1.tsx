import React, { useState, useEffect, RefObject } from 'react'
import * as d3 from  "d3" 
import { Types } from './types'




const RectPath = () /* or ( props : IBasicProps ) */ => {

  useEffect(() => {
    draw()
  })

  //svg para
  const margin = {top: 10, right: 30, bottom: 10, left: 30}
  const formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d:number) { return formatNumber(d) + " " + units; }
  const width = 700 - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom
  //rect para
  const units = "Pieces"
  const rectWidth = 30
  const rectPadding = 10
  

//path function to draw flows
  const path = (d:Types.linkType) => {
    return "M" + (+d.dx_k) + "," + (d.k1)
    + "L" + (width/8+(+d.dx_k)) + "," + (+d.k1)
    + "C" + ((width/8+(+d.dx_k))/2+ ((+d.dx_z)-width/8)/2) + "," + (+d.k1)
    + " " + ((width/8+(+d.dx_k))/2+ ((+d.dx_z)-width/8)/2) + "," + (+d.z1)
    + " " + ((+d.dx_z)-width/8) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z2)
    + "L" + ((+d.dx_z)-width/8) + "," + (+d.z2)
    + "C" + ((width/8+(+d.dx_k))/2+ ((+d.dx_z)-width/8)/2) + "," + (+d.z2)
    + " " + ((width/8+(+d.dx_k))/2+ ((+d.dx_z)-width/8)/2) + "," + (+d.k2)
    + " " + (width/8+(+d.dx_k)) + "," + (+d.k2)
    + "L"  + (+d.dx_k) + "," + (+d.k2)
    + "L" + (+d.dx_k) + "," + (+d.k1)
  }
 

  const draw = () => {

    //1. draw svg
    const svg = d3
  .select(".RectPath")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")

    // import multiple data sets 
    Promise.all([d3.dsv(',' , "/data/emo_rhe.csv", (d) => { //Promise.all() used to import multiple data sets
      const res = (d as unknown) as Types.rectType // declare data type
      return {
        node: res.node,
        sum: res.sum,
        dy: res.dy,
        height: res.height,
        EngName: res.EngName,
        dx: res.dx,
        color: res.color
      }
      
    }), d3.dsv(',' , "/data/links.csv", (d) => {
      const res1 = (d as unknown) as Types.linkType
      return {
        source: res1.source,
        target: res1.target,
        value: res1.value,
        z1: res1.z1,
        z2: res1.z2,
        k1: res1.k1,
        k2: res1.k2,
        dx_z: res1.dx_z,
        dx_k: res1.dx_k,
        color: res1.color
      }}) ]).then((data) => { //d3 v5's specific way to import data

      //2. draw flows
      svg
      .selectAll("path")
      .data(data[1])
      .enter()
      .append("path")
      .attr("d", path)
      .attr('fill', d => d.color)
      .attr("fill-opacity","0.15")

      //3. draw nodes (rect)
      const Rect = svg
      .selectAll('rect')
      .data(data[0])
      .enter()
      //3.1 rect
      Rect
      .append('rect')
      .attr('x', d => (+d.dx))
      .attr('y', d => (+d.dy))
      .attr('rx', d => Math.min(d.height, rectWidth)/2.15)
      .attr('ry', d => Math.min(d.height, rectWidth)/2.15)
      .attr("width", rectWidth)
      .attr("height", d => d.height)
      .attr('fill',d => d.color)
      .attr('filter', "url(#inset-shadow)") // use filter to create shining style
      
      //3.2 texts for rect (add titles)
      Rect
        .append("text")
        .attr("x", margin.left+rectWidth/2) 
        .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
        .attr("text-anchor", "middle")
        .attr("tranform", null)
        .attr('fill','white')
        .attr("style", "writing-mode:tb; letter-spacing:5px" )  //transfer texts into verticle type 
        .style("font-size", "14px")
        .text(function(d) { return d.node; })
      .filter(d => (+d.dx > margin.left+width/2))
        .attr('x', d => +d.dx + rectWidth/2)
        .attr("text-anchor", "middle")
      //English titles
      Rect
        .append("text")
        .attr("x", 26) 
        .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr('fill','black')
        .style("font-size", "16px")
        .text(function(d) { return d.EngName; })
        .filter(d => (+d.dx > margin.left+width/2))
        .attr('x', d => +d.dx-5)
        .attr("text-anchor", "end")


        
     
    })


    console.log('link:', link)
    
  }

  return (
    <div className="RectPath">
      <svg>
     <filter id="inset-shadow"> //filter to create inset shadow for rectangle style
    <feOffset dx="0" dy="1"/>
    <feGaussianBlur stdDeviation="6" result="offset-blur"/>
    <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
    <feFlood flood-color="white" flood-opacity=".65" result="color"/>
    <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
    <feComposite operator="over" in="shadow" in2="SourceGraphic"/> 
  </filter>
  </svg>
    </div>

  )
}


//interface IBasicProps {
  // TODO
//}


export default RectPath
