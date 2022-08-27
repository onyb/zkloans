import React from 'react'
import * as d3 from 'd3'

import './card.css'

class Gauge extends React.Component {
  componentDidMount() {
    this.drawGauge(this.props.score)
  }

  componentDidUpdate(prevProps) {
    d3.selectAll('svg > *').remove()
    this.drawGauge(this.props.score)
  }

  drawGauge(value) {
    const ScoreChart = {
      chart: function (options) {
        var tau = 2 * Math.PI // http://tauday.com/tau-manifesto

        var arc = d3
          .arc()
          .innerRadius(options.radius - 10)
          .outerRadius(options.radius)
          .startAngle(0)
        var ring1 = d3
          .arc()
          .innerRadius(options.radius + 18)
          .outerRadius(options.radius + 20)
          .startAngle(0)
        var ring2 = d3
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
        var scoreDiv = d3.select(options.score.selector),
          svg = d3.select(options.selector),
          width = 46 + options.radius * 2,
          height = 46 + options.radius * 2,
          g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')')

        svg.attr('width', width).attr('height', height)

        var circle = svg
          .append('circle')
          .style('fill', options.colour)
          .attr('cx', 0)
          .attr('cy', 0)
          .attr('r', 8)

        // Add the background arc, from 0 to 100% (tau).
        var background = g
          .append('path')
          .datum({
            endAngle: tau
          })
          .style('fill', options.background)
          .attr('d', arc)

        var rbackground = g
          .append('path')
          .datum({
            endAngle: tau
          })
          .style('stroke-opacity', 0.1)
          .style('opacity', 0.1)
          .style('fill', '#ffffff')
          .attr('d', ring2)
        var rbackground = g
          .append('path')
          .datum({
            endAngle: tau
          })
          .style('stroke-opacity', 0.3)
          .style('opacity', 0.3)
          .style('fill', '#ffffff')
          .attr('d', ring1)
        // Add the foreground arc in orange, currently showing 12.7%.
        var foreground = g
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
            var interpolate = d3.interpolate(d.endAngle, newAngle)
            return function (t) {
              d.endAngle = interpolate(t)
              var path = arc(d)
              var curScore = options.score.value(perc * t)
              var score = (curScore / 100) * 850
              scoreDiv.html(Number.parseInt('' + score))
              var tip = path.split('L')[1].split('A')[0]
              var tip = tip.split(',')

              var cx = options.radius + Math.sin(d.endAngle) * 0.97 * options.radius
              var cy = options.radius - Math.cos(d.endAngle) * 0.97 * options.radius
              circle.attr('cx', cx + 23).attr('cy', cy + 23)

              return path
            }
          }
        }
      }
    }
    var perc = parseInt(value) / this.props.max_score
    ScoreChart.chart({
      parent: '#test',
      selector: '#svg-chart-' + this.props.id,
      percentage: perc,
      background: '#09132A',
      foreground: '#26E79A',
      colour: this.getColour(parseInt(value)),
      radius: 100,
      label: 'SCORE',
      score: {
        value: function (p) {
          return p * 100
        },
        selector: '#gaugue-score-middle-' + this.props.id
      }
    })
  }

  getColour(value) {
    var colours = {
      20: '#57bb8a',
      19: '#63b682',
      18: '#73b87e',
      17: '#84bb7b',
      16: '#94bd77',
      15: '#a4c073',
      14: '#b0be6e',
      13: '#c4c56d',
      12: '#d4c86a',
      11: '#e2c965',
      10: '#f5ce62',
      9: '#f3c563',
      8: '#e9b861',
      7: '#e6ad61',
      6: '#ecac67',
      5: '#e9a268',
      4: '#e79a69',
      3: '#e5926b',
      2: '#e2886c',
      1: '#e0816d',
      0: '#dd776e'
    }
    var length = Object.keys(colours).length
    var min = 0
    var max = 850
    var colour

    if (colours[Math.floor(value / (max / length))] != undefined) {
      colour = colours[Math.floor(value / (max / length))]
      return colours[Math.floor(value / (max / length))]
    } else {
      colour = colours[20]
      return colours[20]
    }
  }

  render() {
    return (
      <div>
        <div class='score-chart flex-center' id='test'>
          <svg id={'svg-chart-' + this.props.id} />
          <div class='score-chart-legend'>
            <div
              id={'gaugue-score-middle-' + this.props.id}
              style={{ color: this.getColour(this.props.score) }}
            >
              0
            </div>
            <p class='gaugue-score-top'>out of 850</p>
          </div>
        </div>
      </div>
    )
  }
}

const ScoreInput = ({ selectScore }) => {
  return (
    <div className='input-container'>
      <input onChange={e => selectScore(e.target.value)}></input>
    </div>
  )
}

const GridBox = props => {
  return (
    <div className='gridBox'>
      <div className='flex column gridDetail'>
        <div className='mainInfo flex-center'>{props.value}</div>
        <div className='detailInfo'>{props.title}</div>
      </div>
    </div>
  )
}

class Card extends React.Component {
  render() {
    const data = [
      { name: 'Credit Card Utilization', value: Math.floor(Math.random() * 100) + 1 + '%' },
      { name: 'Deregetory Marks', value: Math.floor(Math.random() * 10) },
      { name: 'Payment History', value: Math.floor(Math.random() * 100) + 1 + '%' }
    ]
    const listItems = data.map(d => (
      <li>
        {d.value} {d.name}
      </li>
    ))

    return (
      <article className='card'>
        <div className='flex-center card-header'>
          <div className='card-title'>Welcome back, Ani!</div>
          <div className='card-subTitle'>Your credit score is</div>
        </div>
        <Gauge id={this.props.id} score={this.props.score} max_score={this.props.max_score} />
        <div className='grid'>
          {data.map((item, idx) => (
            <GridBox key={idx} value={item.value} title={item.name} />
          ))}
        </div>
      </article>
    )
  }
}

export class CardContainer extends React.Component {
  state = {
    score: '735',
    max_score: '850'
  }

  changeScore = inputScore => {
    this.setState({ score: inputScore })
  }

  render() {
    return (
      <div>
        <div class='header'>
          <h1 class='header-title'>zkLoans</h1>
          <h2 class='sub-header'>Confidential credit scores</h2>
        </div>
        <Card id='1' className='dark' score='725' max_score='850' />
      </div>
    )
  }
}
