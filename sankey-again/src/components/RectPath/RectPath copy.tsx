import React, { useState, useEffect, RefObject } from 'react'
import * as d3 from  "d3" 
import { Types } from './types'
import { getEffectiveTypeParameterDeclarations } from 'typescript'




const RectPath = () /* or ( props : IBasicProps ) */ => {

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



  

  

  

  const draw = () => {
   
    const width = 500 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    d3.dsv(',',"/data/emo_sum.csv", (d) => {
      const res = (d as unknown) as Types.rectType
      return {
        node: res.node,
        sum: res.sum,
        dy: res.dy,
        height: res.height
      }
    }).then((data) => {
      
      const svg = d3
      .select(".RectPath")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")")
      .attr('fill','tomato')
      
      const emoRect = svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', margin.left)
      .attr('y', d => d.dy)
      .attr("width", 20)
      .attr("height", d => d.height)
      .attr('fill','blue')

      emoRect
      .append("text")
      .attr("x", 5+20+margin.left)
      .attr("y", function(d) { return d.dy; })
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .text(function(d) { return d.node; })

      
      






     
      
      
    

     

    
    })
  }

  return (
    <div className="RectPath" />

  )
}


//interface IBasicProps {
  // TODO
//}


export default RectPath
