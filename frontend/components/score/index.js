import React from 'react'

import './index.css'
import { Card } from '../card'
import { Gauge } from '../guage'

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

export function Score(props) {
  const data = [
    { name: 'Credit Card Utilization', value: Math.floor(Math.random() * 100) + 1 + '%' },
    { name: 'Deregetory Marks', value: Math.floor(Math.random() * 10) },
    { name: 'Payment History', value: Math.floor(Math.random() * 100) + 1 + '%' }
  ]

  return (
    <Card title='Credit score' subtitle='The exact score is blinded'>
      <Gauge score={props.score} max_score={props.max_score} />
      <div className='grid'>
        {data.map((item, idx) => (
          <GridBox key={idx} value={item.value} title={item.name} />
        ))}
      </div>
    </Card>
  )
}
