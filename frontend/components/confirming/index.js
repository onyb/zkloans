import React from 'react'
import Lottie from 'lottie-react'

import { Card } from '../card'
import { LoadingContainer } from './style'
import animation from './lottie.json'

export function Confirming(props) {
  return (
    <Card title='Verifying ZK-SNARK proof' subtitle='Waiting for transaction confirmation'>
      <LoadingContainer>
        <Lottie animationData={animation} loop={true} />;
      </LoadingContainer>
    </Card>
  )
}
