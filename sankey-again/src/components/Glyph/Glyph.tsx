import React, { useState, useEffect, RefObject } from 'react'
import * as d3 from  "d3" 
import { Types } from './types'



const Glyph = () /* or ( props : IBasicProps ) */ => {

  useEffect(() => {
    draw()
  })

//svg parameters
  const margin = {top: 10, right: 30, bottom: 10, left: 30}
  const width = 1400 - margin.left - margin.right
  const height = 600 - margin.top - margin.bottom

  
//circle parameters
  const R = 100


//functions help calculate angles for later use
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angle: number) => {
    var angleInRadians = angle-Math.PI/2-2*Math.PI/3;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  //function to draw round "icicle" path
  const  Arc = (d: Types.glyType) => {

    var start1 = polarToCartesian(d.cx, d.cy, +d.r1, +d.a1);
    var end1 = polarToCartesian(d.cx, d.cy, +d.r1, +d.a2);
    var start2 = polarToCartesian(d.cx, d.cy, +d.r2, +d.a1);
    var end2 = polarToCartesian(d.cx, d.cy, +d.r2, +d.a2);

    var largeArcFlag = (+d.a2) - (+d.a1) <= Math.PI ? "0" : "1";

    var arc = [
        "M", start2.x, start2.y, 
        "A", +d.r2, +d.r2, 0, largeArcFlag, 1, end2.x, end2.y,
        "L", end1.x, end1.y, 
        "A", +d.r1, +d.r1, 0, largeArcFlag, 0, start1.x, start1.y,
        "L", start2.x, start2.y
    ].join(" ");

    return arc;       
}

//functions to draw related images
const  Relate = (d: Types.glyRelateType) => {

  var center = polarToCartesian(d.cx, d.cy, R-5, ((+d.a1)+(+d.a2))/2);

  return {
    rx: center.x,
    ry: center.y
  };       
}

  const draw = () => {
    //draw svg
    const svg = d3
  .select(".Glyph")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", 
        "translate(" + margin.left + "," + margin.top + ")")

//1. large image circle
  d3.dsv(',' , "/data/glyph/image/glyph_image.csv", (d) => {      
    const res1 = (d as unknown) as Types.glyImageType //declare the data type
    return {
      name: res1.name,
      dir: res1.dir,
      cx: res1.cx,
      cy: res1.cy
    }
    
  }).then((data) => {

  const image = svg
  .selectAll('.image1')
  .data(data)
  .enter()

  image
  .append("pattern")
  .attr("id",d => d.name)
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
    .attr("xlink:href", d =>(console.log("dir:",d.dir) ,d.dir))

//half-transparent background 
svg
  .selectAll('.circle_back')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => +d.cx + margin.left)
  .attr('cy', d => +d.cy + margin.top)
  .attr('r', 100)
  .attr('fill', d =>
     ("url(#" + d.name + ")")
    )
  .attr("fill-opacity", 0.1)

// inner part-larger 
svg
  .selectAll('.circle_up1')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => +d.cx + margin.left)
  .attr('cy', d => +d.cy + margin.top)
  .attr('r', 100*7/16)
  .attr('fill', d =>
     ("url(#" + d.name + ")")
    )
  .attr("fill-opacity", 0.4)
//inner part-smaller(less transparent)
svg
  .selectAll('.circle_up2')
  .data(data)
  .enter()
  .append('circle')
  .attr('cx', d => +d.cx + margin.left)
  .attr('cy', d => +d.cy + margin.top)
  .attr('r', 100*7/16-4)
  .attr('fill', d =>
     ("url(#" + d.name + ")")
    )
  .attr("fill-opacity", 0.9)

  //text
  image
      .append('text')
      .attr('x', d => ((+d.cx+margin.left)+11/16*R*Math.sin(Math.PI/4)))
      .attr('y', d => ((+d.cy+margin.top)+11/16*R*Math.sin(Math.PI/4)))
      .attr("text-anchor", "middle")
      .attr("tranform", null)
      .attr('fill','black')
      .style("font-size", "20px")
      .text(function(d) { return d.name; })
  })
    

        
//2. Glyph 
    Promise.all([d3.dsv(',' , "/data/glyph/黍/glyph_黍.csv", (d) => {      //Promise.all() used to import multiple data sets
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 200+margin.left, //cx for the "黍"
        cy: 200+margin.top, //cy for the "黍", the following is the same
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
      
    }),
    d3.dsv(',' , "/data/glyph/桑/glyph_桑.csv", (d) => {      
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 400+margin.left,
        cy: 400+margin.top,
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
      
    }),
    d3.dsv(',' , "/data/glyph/燕/glyph_燕.csv", (d) => {     
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 600+margin.left,
        cy: 200+margin.top,
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
      
    }),
    d3.dsv(',' , "/data/glyph/马/glyph_马.csv", (d) => {    
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 800+margin.left,
        cy: 400+margin.top,
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
    }),
    d3.dsv(',' , "/data/glyph/螣/glyph_螣.csv", (d) => {     
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 1000+margin.left,
        cy: 200+margin.top,
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
    }),
    d3.dsv(',' , "/data/glyph/鲂/glyph_鲂.csv", (d) => {      
      const res1 = (d as unknown) as Types.glyType //declare the data type
      return {
        cx: 1200+margin.left,
        cy: 400+margin.top,
        r: res1.r,
        a1: res1.a1,
        a2: res1.a2,
        height: res1.height,
        r2: res1.r2,
        r1: res1.r1,
        fill: res1.fill,
        op: res1.op
      }
    })
   ]).then((data) => {
 
    data.forEach((data_glyph) => {
      svg
      .selectAll(".glyph")
      .data(data_glyph)
      .enter()
      .append("path")
      .attr("d", d => Arc(d))
      .attr('fill', d => d.fill)
      .attr("fill-opacity", d => d.op)
    })

    })
    
//3. relate_image
    Promise.all([
      //黍
      d3.dsv(',' , '/data/glyph/image/黍/relate_sh.csv', (d) => {     
      const res5 = (d as unknown) as Types.glyRelateType //declare the data type
      return {
        Name: "黍",
        cx: 200+margin.left,
        cy: 200+margin.top,
        name: res5.name,
        n: res5.n,
        a1: res5.a1,
        a2: res5.a2,
        r: res5.r,
        ratio: res5.ratio
      }
      }),
      //桑
      d3.dsv(',' , '/data/glyph/image/桑/relate_s.csv', (d) => {     
        const res5 = (d as unknown) as Types.glyRelateType //declare the data type
        return {
          Name: "桑",
          cx: 400+margin.left,
          cy: 400+margin.top,
          name: res5.name,
          n: res5.n,
          a1: res5.a1,
          a2: res5.a2,
          r: res5.r,
          ratio: res5.ratio
        }
        }),
        //燕
        d3.dsv(',' , '/data/glyph/image/燕/relate_y.csv', (d) => {     
          const res5 = (d as unknown) as Types.glyRelateType //declare the data type
          return {
            Name: "燕",
            cx: 600+margin.left,
            cy: 200+margin.top,
            name: res5.name,
            n: res5.n,
            a1: res5.a1,
            a2: res5.a2,
            r: res5.r,
            ratio: res5.ratio
          }
          }),
          //马
          d3.dsv(',' , '/data/glyph/image/马/relate_m.csv', (d) => {     
            const res5 = (d as unknown) as Types.glyRelateType //declare the data type
            return {
              Name: "马",
              cx: 800+margin.left,
              cy: 400+margin.top,
              name: res5.name,
              n: res5.n,
              a1: res5.a1,
              a2: res5.a2,
              r: res5.r,
              ratio: res5.ratio
            }
            }),
            //螣
            d3.dsv(',' , '/data/glyph/image/螣/relate_t.csv', (d) => {     
              const res5 = (d as unknown) as Types.glyRelateType //declare the data type
              return {
                Name: "螣",
                cx: 1000+margin.left,
                cy: 200+margin.top,
                name: res5.name,
                n: res5.n,
                a1: res5.a1,
                a2: res5.a2,
                r: res5.r,
                ratio: res5.ratio
              }
              }),
              //鲂
              d3.dsv(',' , '/data/glyph/image/鲂/relate_f.csv', (d) => {     
                const res5 = (d as unknown) as Types.glyRelateType //declare the data type
                return {
                  Name: "鲂",
                  cx: 1200+margin.left,
                  cy: 400+margin.top,
                  name: res5.name,
                  n: res5.n,
                  a1: res5.a1,
                  a2: res5.a2,
                  r: res5.r,
                  ratio: res5.ratio
                }
                })
    
    
    ]).then((data) => {
      
      data.forEach((data_relate) => {

        svg
        .selectAll('.relate_shu')
        .data(data_relate)
        .enter()
        .append("pattern")
        .attr("id",d => (console.log("name:",d.name), d.name))
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
          .attr("xlink:href", d => ("/data/glyph/image/"+d.Name+"/"+d.name+".png"))

        //larger more transparent one
        svg
          .selectAll('.circle_down')
          .data(data_relate)
          .enter()
          .append('circle')
          .attr('cx', d => Relate(d).rx)
          .attr('cy', d => Relate(d).ry)
          .attr('r', d => +d.r)
          .attr('fill', d =>
             ("url(#" + d.name + ")")
            )
          .attr("fill-opacity", 0.4)
        
        //smaller less transparent one
        svg
          .selectAll('.circle_up')
          .data(data_relate)
          .enter()
          .append('circle')
          .attr('cx', d => Relate(d).rx)
          .attr('cy', d => Relate(d).ry)
          .attr('r', d => +d.r-2)
          .attr('fill', d =>
             ("url(#" + d.name + ")")
            )
          .attr("fill-opacity", 0.9)
      })

      }

      )
  }

  


  return (
    <div className="Glyph">
    </div>

  )
}


//interface IBasicProps {
  // TODO
//}


export default Glyph
