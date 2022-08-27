import React from 'react'
import * as d3 from 'd3'

import './index.css'
import { getColour } from './colorlib'

export const Gauge = props => {
  const { score, max_score } = props

  React.useEffect(() => {
    d3.selectAll('svg > *').remove()
    drawGauge(score)
  })

  const drawGauge = value => {
    const ScoreChart = {
      chart: function (options) {
        const tau = 2 * Math.PI // http://tauday.com/tau-manifesto

        const arc = d3
          .arc()
          .innerRadius(options.radius - 10)
          .outerRadius(options.radius)
          .startAngle(0)
        const ring1 = d3
          .arc()
          .innerRadius(options.radius + 18)
          .outerRadius(options.radius + 20)
          .startAngle(0)
        const ring2 = d3
          .arc()
          .innerRadius(options.radius - 1)
          .outerRadius(options.radius + 11)
          .startAngle(0)

        d3.select(options.parent).attr(
          'style',
          'width:' + (options.radius * 2 + 46) + 'px; height:' + (options.radius * 2 + 46) + 'px'
        )

        // Get the SVG container, and apply a transform such that the origin is the
        // center of the canvas. This way, we don’t need to position arcs individually.
        const scoreDiv = d3.select(options.score.selector),
          svg = d3.select(options.selector),
          width = 46 + options.radius * 2,
          height = 46 + options.radius * 2,
          g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

        svg.attr('width', width).attr('height', height)

        const circle = svg
          .append('circle')
          .style('fill', options.colour)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 8)

        // Add the background arc, from 0 to 100% (tau).
        g.append('path')
          .datum({
            endAngle: tau
          })
          .style('fill', options.background)
          .attr('d', arc)

        g.append('path')
          .datum({
            endAngle: tau
          })
          .style('stroke-opacity', 0.1)
          .style('opacity', 0.1)
          .style('fill', '#ffffff')
          .attr('d', ring2)

        g.append('path')
          .datum({
            endAngle: tau
          })
          .style('stroke-opacity', 0.3)
          .style('opacity', 0.3)
          .style('fill', '#ffffff')
          .attr('d', ring1)

        // Add the foreground arc in orange, currently showing 12.7%.
        const foreground = g
          .append('path')
          .datum({
            endAngle: 0.1 * tau
          })
          .style('fill', options.colour)
          .attr('d', arc)

        foreground
          .transition()
          .duration(2000)
          .attrTween('d', arcTween(options.percentage * tau))

        function arcTween(newAngle) {
          return function (d) {
            const interpolate = d3.interpolate(d.endAngle, newAngle)
            return function (t) {
              d.endAngle = interpolate(t)
              const path = arc(d)
              const curScore = options.score.value(perc * t)
              const score = (curScore / 100) * 850
              scoreDiv.html(Number.parseInt('' + score))

              // tip
              path.split('L')[1].split('A')[0].split(',')

              const cx = options.radius + Math.sin(d.endAngle) * 0.97 * options.radius
              const cy = options.radius - Math.cos(d.endAngle) * 0.97 * options.radius
              circle.attr('cx', cx + 23).attr('cy', cy + 23)

              return path
            }
          }
        }
      }
    }
    const perc = parseInt(value) / max_score
    ScoreChart.chart({
      parent: '#test',
      selector: '#svg-chart',
      percentage: perc,
      background: '#09132A',
      foreground: '#26E79A',
      colour: getColour(parseInt(value)),
      radius: 100,
      label: 'SCORE',
      score: {
        value: function (p) {
          return p * 100
        },
        selector: '#gaugue-score-middle'
      }
    })
  }

  return (
    <div className='score-chart flex-center' id='test'>
      <svg id='svg-chart' />
      <div className='score-chart-legend'>
        <div id='gaugue-score-middle' style={{ color: getColour(score) }}>
          0
        </div>
        <p className='gaugue-score-top'>out of {max_score}</p>
      </div>
    </div>
  )
}
