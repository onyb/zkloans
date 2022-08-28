import React from 'react'

import './index.css'
import { Card } from '../card'
import { Gauge } from '../guage'
import { NearIcon, SubmitProofButton, SubmitProofButtonWrapper } from './style'
import { verifyGroth16Proof } from '../../near-api'

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

  const submitProof = () => {
    verifyGroth16Proof(props.proof, props.publicSignals)
    props.setIsConfirmingTransaction()
  }

  return (
    <Card title='Your Credit Score is' subtitle='The exact score is blinded'>
      <Gauge score={props.creditReport.score} maxScore={props.creditReport.maxScore} />
      <div className='grid'>
        {data.map((item, idx) => (
          <GridBox key={idx} value={item.value} title={item.name} />
        ))}
      </div>

      <SubmitProofButtonWrapper>
        <SubmitProofButton onClick={submitProof}>
          Verify zkSNARK proof on-chain
          <NearIcon />
        </SubmitProofButton>
      </SubmitProofButtonWrapper>
    </Card>
  )
}
