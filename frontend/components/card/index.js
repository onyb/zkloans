import React from 'react'

import './index.css'

const ScoreInput = ({ selectScore }) => {
  return (
    <div className='input-container'>
      <input onChange={e => selectScore(e.target.value)}></input>
    </div>
  )
}

export function Card(props) {
  return (
    <article className='card'>
      <div className='flex-center card-header'>
        <div className='card-title'>{props.title}</div>
        <div className='card-subTitle'>{props.subtitle}</div>
      </div>
      {props.children}
    </article>
  )
}
