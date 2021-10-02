import React, { useState, useEffect, RefObject } from 'react'
import * as d3 from  "d3" 
import { Types } from './types'



const RectPath = () /* or ( props : IBasicProps ) */ => {

  useEffect(() => {
    draw()
  })

//svg parameters
  const margin = {top: 10, right: 30, bottom: 10, left: 30}
  
  const width = 1400 - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom

  const formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d:number) { return formatNumber(d) + " " + units; }
  const units = "Pieces"
  const rectWidth2 = 30 //Functions rect
  const rectWidth3 = 60//Themes rect
  const rectPadding = 10 //width between rect
  
  //sunburnst para
  const r = 75
  const r1 = 70
  const r2 = 80
  const r3 = 80.5
  const r4 = 90.5

//path function for the flow
  const path1 = (d:Types.linkType) => {
    return "M" + (+d.dx_k) + "," + (d.k1)
    + "L" + (width/18+(+d.dx_k)) + "," + (+d.k1)
    + "C" + ((width/18+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.k1)
    + " " + ((width/18+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.z1)
    + " " + ((+d.dx_z)-width/20) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z2)
    + "L" + ((+d.dx_z)-width/20) + "," + (+d.z2)
    + "C" + ((width/18+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.z2)
    + " " + ((width/18+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.k2)
    + " " + (width/18+(+d.dx_k)) + "," + (+d.k2)
    + "L"  + (+d.dx_k) + "," + (+d.k2)
    + "L" + (+d.dx_k) + "," + (+d.k1)
  }

  //especially for flow start from '风', longer straight lines than others
  const path2 = (d:Types.linkType) => {
    return "M" + (+d.dx_k) + "," + (d.k1)
    + "L" + (width/12+(+d.dx_k)) + "," + (+d.k1)
    + "C" + ((width/12+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.k1)
    + " " + ((width/12+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.z1)
    + " " + ((+d.dx_z)-width/20) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z1)
    + "L" + (+d.dx_z) + "," + (+d.z2)
    + "L" + ((+d.dx_z)-width/20) + "," + (+d.z2)
    + "C" + ((width/12+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.z2)
    + " " + ((width/12+(+d.dx_k))/2+ ((+d.dx_z)-width/20)/2) + "," + (+d.k2)
    + " " + (width/12+(+d.dx_k)) + "," + (+d.k2)
    + "L"  + (+d.dx_k) + "," + (+d.k2)
    + "L" + (+d.dx_k) + "," + (+d.k1)
  }
  
  //functions to draw ring(arc)--Generation node
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angle: number) => {
    var angleInRadians = angle-Math.PI/2;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
 //half ring path function
  const remedy = (d: Types.circleType) => {

    var start = polarToCartesian(((+d.dx)-(+d.dr)), ((+d.dy)+(+d.height)/2), r, 0);
    var end = polarToCartesian(((+d.dx)-(+d.dr)), ((+d.dy)+(+d.height)/2), r, Math.PI);

    var arc = [
      "M", start.x, start.y, 
      "A", r, r, 0, 0, 0, end.x, end.y
  ].join(" ");

  return arc;       
  }

  //sunburnst outer ring path function
  const  Arc = (d: Types.sectionType|Types.subsectionType, radius1: number, radius2: number) => {

    var start1 = polarToCartesian(+d.cx, +d.cy, radius1, +d.a1);
    var end1 = polarToCartesian(+d.cx, +d.cy, radius1, +d.a2);
    var start2 = polarToCartesian(+d.cx, +d.cy, radius2, +d.a1);
    var end2 = polarToCartesian(+d.cx, +d.cy, radius2, +d.a2);

    var largeArcFlag = (+d.a2) - (+d.a1) <= Math.PI ? "0" : "1";

    var arc = [
        "M", start2.x, start2.y, 
        "A", radius2, radius2, 0, largeArcFlag, 1, end2.x, end2.y,
        "L", end1.x, end1.y, 
        "A", radius1, radius1, 0, largeArcFlag, 0, start1.x, start1.y,
        "L", start2.x, start2.y
    ].join(" ");

    return arc;       
}

  const draw = () => {
    const svg = d3
  .select(".RectPath")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")

//import csv data 
    Promise.all([d3.dsv(',' , "/data/node_gen.csv", (d) => {      //Promise.all() used to import multiple data sets
      const res1 = (d as unknown) as Types.circleType //declare the data type
      return {
        node: res1.node,
        sum: res1.sum,
        dy: res1.dy,
        height: res1.height,
        EngName: res1.EngName,
        dx: res1.dx,
        color: res1.color,
        rectWidth: res1.rectWidth,
        dr: res1.dr,
        image: res1.image
      }
      
    }), d3.dsv(',' , "/data/node_fun.csv", (d) => {
      const res2 = (d as unknown) as Types.rectType
      return {
        node: res2.node,
        sum: res2.sum,
        dy: res2.dy,
        height: res2.height,
        EngName: res2.EngName,
        dx: res2.dx,
        color: res2.color,
        rectWidth: res2.rectWidth
      }
      
    }), d3.dsv(',' , "/data/node_the.csv", (d) => {
      const res3 = (d as unknown) as Types.rectType
      return {
        node: res3.node,
        sum: res3.sum,
        dy: res3.dy,
        height: res3.height,
        EngName: res3.EngName,
        dx: res3.dx,
        color: res3.color,
        rectWidth: res3.rectWidth
      }
      
    }), d3.dsv(',' , "/data/links_gen_fun.csv", (d) => {
      const res4 = (d as unknown) as Types.linkType
      return {
        source: res4.source,
        target: res4.target,
        value: res4.value,
        z1: res4.z1,
        z2: res4.z2,
        k1: res4.k1,
        k2: res4.k2,
        dx_z: res4.dx_z,
        dx_k: res4.dx_k,
        color: res4.color,
        
      }}), d3.dsv(',' , "/data/links_fun_the.csv", (d) => {
        const res5 = (d as unknown) as Types.linkType
        return {
          source: res5.source,
          target: res5.target,
          value: res5.value,
          z1: res5.z1,
          z2: res5.z2,
          k1: res5.k1,
          k2: res5.k2,
          dx_z: res5.dx_z,
          dx_k: res5.dx_k,
          color: res5.color,
          
        }}), d3.dsv(',' , "/data/f_sec.csv", (d) => {
          const res = (d as unknown) as Types.sectionType
          return {
            section: res.section,
            n: res.n,
            a1: res.a1,
            a2: res.a2,
            opacity: res.opacity,
            cx: res.cx,
            cy:res.cy
            
          }}), d3.dsv(',' , "/data/y_sec.csv", (d) => {
            const res = (d as unknown) as Types.sectionType
            return {
              section: res.section,
              n: res.n,
              a1: res.a1,
              a2: res.a2,
              opacity: res.opacity,
              cx: res.cx,
              cy:res.cy
              
            }}), d3.dsv(',' , "/data/y_sub.csv", (d) => {
              const res = (d as unknown) as Types.subsectionType
              return {
                subsection: res.subsection,
                n: res.n,
                a1: res.a1,
                a2: res.a2,
                opacity: res.opacity,
                cx: res.cx,
                cy:res.cy
                
              }}), d3.dsv(',' , "/data/s_sec.csv", (d) => {
                const res = (d as unknown) as Types.sectionType
                return {
                  section: res.section,
                  n: res.n,
                  a1: res.a1,
                  a2: res.a2,
                  opacity: res.opacity,
                  cx: res.cx,
                  cy:res.cy
                  
                }}), d3.dsv(',' , "/data/s_sub.csv", (d) => {
                  const res = (d as unknown) as Types.subsectionType
                  return {
                    subsection: res.subsection,
                    n: res.n,
                    a1: res.a1,
                    a2: res.a2,
                    opacity: res.opacity,
                    cx: res.cx,
                    cy:res.cy
                    
                  }})]).then((data) => {
      
    
      //1. draw svg
      svg
      .selectAll(".class1")
      .data(data[3])
      .enter()
      .append("path")
      .attr("d", path1)
      .attr('fill', d => d.color)
      .attr("fill-opacity","0.15")
      .filter(d => (d.source == '風'))
      .attr("d", path2)
      .attr('fill', d => d.color)
      .attr("fill-opacity","0.15")


      svg
      .selectAll(".class2")
      .data(data[4])
      .enter()
      .append("path")
      .attr("d", path1)
      .attr('fill', d => d.color)
      .attr("fill-opacity","0.20")
      
    //2. draw Generation node(Circle)

    //2.1 set the image imput pattern (relative position & size)
      const image = svg
      .selectAll('.image1')
      .data(data[0])
      .enter()
      .append("pattern")
      .attr("id",d => d.node)
      .attr("x", "0")
      .attr("y", "0")
      .attr("height",1)
      .attr('width',1)
      .attr('viewBox', '0 0 1 1') // control the relative size of image to outer frame
      .append("image")
        .attr("x", "0")
        .attr("y", "0")
        .attr("height", 1)
        .attr("width", 1)
        .attr("xlink:href", d => d.image)

      
      //the contour("frame") for image
      const Circle1 = svg
      .selectAll('.circle1')
      .data(data[0])
      .enter()

      Circle1
      .append('circle')
      .attr('cx', d =>((+d.dx)-(+d.dr)))
      .attr('cy', d => ((+d.dy)+(+d.height)/2))
      .attr('r', r4)
      .attr('fill','white')
      .attr('stroke', 'transparent')
      .filter(d => (d.node == '風')) // larger white circle "canvas" seem more delicate
      .attr('r', r2)
      .attr('fill','white')
      .attr('stroke', 'transparent')
  
      
    // put image into the "frame"
      svg
      .selectAll('.circle2')
      .data(data[0])
      .enter()
      .append('circle')
      .attr('cx', d =>((+d.dx)-(+d.dr)))
      .attr('cy', d => ((+d.dy)+(+d.height)/2))
      .attr('r', 60)
      .attr('fill', d =>
         ("url(#" + d.node + ")")
        )
 
        
       //2.2 half ring
       Circle1
       .append('path')
       .attr('d', remedy)
       .attr('fill', 'transparent')
       .attr('stroke', "black")
       .attr('stroke-width', 2)
      
      //2.3 left circle with word
      const Circle3 = svg
      .selectAll('.circle3')
      .data(data[0])
      .enter()

      Circle3
      .append('circle')
      .attr('cx', d =>((+d.dx)-(+d.dr)-Math.sqrt(319/400)*r))
      .attr('cy', d => ((+d.dy)+(+d.height)/2))
      .attr('r', 9/20*r)
      .attr('fill','rgb(248,241,223)')
      
      Circle3
      .append('text')
      .attr('x', d => ((+d.dx)-(+d.dr)-Math.sqrt(319/400)*r))
      .attr('y', d => ((+d.dy)+(+d.height)/2))
      .attr('dy', '.35em')
      .attr("text-anchor", "middle")
      .attr("tranform", null)
      .attr('fill','black')
      .style("font-size", "40px")
      .text(function(d) { return d.node; })


     //2.4 right rings

     //2.4.1 "风" section ring 
      const ring_f = svg
      .selectAll('.path_f')
      .data(data[5])
      .enter()

      ring_f
      .append('path')
      .attr('d', d => Arc(d, r1, r2) )
      .attr('fill', '#73747E')
      .attr("fill-opacity",d => +d.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
    
      //2.4.2 "雅" section ring & subsection ring
      const ring_y1 = svg
      .selectAll('.path_y1')
      .data(data[6])
      .enter()

      ring_y1
      .append('path')
      .attr('d', d => Arc(d, r1, r2) )
      .attr('fill', '#C69480')
      .attr("fill-opacity",d => +d.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)

      const ring_y2 = svg
      .selectAll('.path_y2')
      .data(data[7])
      .enter()

      ring_y2
      .append('path')
      .attr('d', d => Arc(d, r3, r4) )
      .attr('fill', '#C69480')
      .attr("fill-opacity",d => +d.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      
      //2.4.3 "颂" section ring & subsection ring
      const ring_s1 = svg
      .selectAll('.path_s1')
      .data(data[8])
      .enter()

      ring_s1
      .append('path')
      .attr('d', d => Arc(d, r1, r2) )
      .attr('fill', '#48685B')
      .attr("fill-opacity",d => +d.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)

      const ring_s2 = svg
      .selectAll('.path_s2')
      .data(data[9])
      .enter()

      ring_s2
      .append('path')
      .attr('d', d => Arc(d, r3, r4) )
      .attr('fill', '#48685B')
      .attr("fill-opacity",d => +d.opacity)
      .attr('stroke', 'white')
      .attr('stroke-width', 1)


      
      //Function node(rect)
        const Rect2 = svg
        .selectAll('.rect2')
        .data(data[1])
        .enter()
  
        Rect2
        .append('rect')
        .attr('x', d => (+d.dx))
        .attr('y', d => (+d.dy))
        .attr('rx', d => Math.min(d.height, d.rectWidth)/2.15) //create rounded corners
        .attr('ry', d => Math.min(d.height, d.rectWidth)/2.15)
        .attr("width", d => d.rectWidth)
        .attr("height", d => d.height)
        .attr('fill',d => d.color)
        .attr('filter', "url(#inset-shadow)")
  
      //Chinese title
        Rect2
          .append("text")
          .attr("x", d => +d.dx+(+d.rectWidth)/2) 
          .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
          .attr("text-anchor", "middle")
          .attr("tranform", null)
          .attr('fill','white')
          .attr("style", "writing-mode:tb; letter-spacing:0px" ) //transfer words into verticle type 
          .style("font-size", "14px")
          .text(function(d) { return d.node; })

      //English title
        Rect2
          .append("text")
          .attr("x", d => +d.dx+(+d.rectWidth)+5) 
          .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
          .attr("dy", ".35em")
          .attr("text-anchor", "start")
          .attr('fill','black')
          .style("font-size", "16px")
          .text(function(d) { return d.EngName; })
          .filter(d => (+d.dx > margin.left+width/2))
          .attr('x', d => +d.dx-5)
          .attr("text-anchor", "end")

      // Themes node(rect)    
          const Rect3 = svg
          .selectAll('.rect3')
          .data(data[2])
          .enter()
    
          Rect3
          .append('rect')
          .attr('x', d => (+d.dx))
          .attr('y', d => (+d.dy))
          .attr('rx', d => Math.min(d.height, d.rectWidth)/2.15)
          .attr('ry', d => Math.min(d.height, d.rectWidth)/2.15)
          .attr("width", d => d.rectWidth)
          .attr("height", d => d.height)
          .attr('fill',d => d.color)
          .attr('filter', "url(#inset-shadow)")
          
          Rect3
            .append("text")
            .attr("x", d => +d.dx+(+d.rectWidth)/2) 
            .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
            .attr("text-anchor", "middle")
            .attr("tranform", null)
            .attr('fill','white')
            .attr("style", "writing-mode:tb; letter-spacing:0px" )
            .style("font-size", "14px")
            .text(function(d) { return d.node; })

    
          Rect3
            .append("text")
            .attr("x", d => +d.dx+(+d.rectWidth)+5) 
            .attr("y", function(d) { return  (+d.height)/2+(+d.dy); })
            .attr("dy", ".35em")
            .attr("text-anchor", "start")
            .attr('fill','black')
            .style("font-size", "16px")
            .text(function(d) { return d.EngName; })
            .filter(d => (+d.dx > margin.left+width/2))
            .attr('x', d => +d.dx-5)
            .attr("text-anchor", "end")
    
        
     
    })
    
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
