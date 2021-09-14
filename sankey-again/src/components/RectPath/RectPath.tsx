import React, { useState, useEffect, RefObject } from 'react'
import * as d3 from  "d3" 
import { Types } from './types'




const RectPath = () /* or ( props : IBasicProps ) */ => {

  useEffect(() => {
    draw()
  })

  const margin = {top: 10, right: 10, bottom: 10, left: 10}
  const formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d:number) { return formatNumber(d) + " " + units; }
  const units = "Pieces"
  const rectWidth = 20
  const rectPadding = 2


  const draw = () => {
   
    const width = 500 - margin.left - margin.right
    const height = 300 - margin.top - margin.bottom

    const rectTitle = (d: Types.rectType) => {
       return (d.dy+d.height/2)
    }

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

      emoRect
      .append('rect')
      .attr('x', margin.left)
      .attr('y', d => d.dy)
      .attr("width", 20)
      .attr("height", d => d.height)
      .attr('fill','grey')

      
      emoRect
        .append("text")
        .attr("x", 5+20+margin.left)
        .attr("y", function(d) { console.log('d.dy =', d.dy)
        console.log('d.height =', d.height); return  d.dy+d.height/2; })
        //.attr("dy", ".35em")
        .attr("text-anchor", "start")
        .attr('fill','black')
        .text(function(d) { return d.node; })

     
    })
   
  }

  return (
    <div className="RectPath">
  
    </div>

  )
}


//interface IBasicProps {
  // TODO
//}


export default RectPath
