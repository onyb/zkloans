import React from 'react'
import Lottie from 'lottie-react'

import { Card } from '../card'
import { LoadingContainer } from './style'
import animation from './lottie.json'

export function ZK(props) {
  return (
    <Card
      title='Crunching ZK-SNARKs'
      subtitle={
        props.isVerifyingZKProof
          ? 'Verifying groth16 ZK-SNARK proof...'
          : 'Generating groth16 ZK-SNARK proof...'
      }
    >
      <LoadingContainer>
        <Lottie animationData={animation} loop={true} />;
      </LoadingContainer>
    </Card>
  )
}
