import React from 'react'

import './card.css'
import { Gauge } from '../guage'

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

    return (
      <article className='card'>
        <div className='flex-center card-header'>
          <div className='card-title'>Welcome back, Ani!</div>
          <div className='card-subTitle'>Your credit score is</div>
        </div>
        <Gauge score={this.props.score} max_score={this.props.max_score} />
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
        <div className='header'>
          <h1 className='header-title'>zkLoans</h1>
          <h2 className='sub-header'>Confidential credit scores</h2>
        </div>
        <Card className='dark' score='725' max_score='850' />
      </div>
    )
  }
}
