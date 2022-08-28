import React from 'react'
import Lottie from 'lottie-react'

import { Card } from '../card'
import { LoadingContainer } from './style'
import animation from './lottie.json'
import approvedAnimation from './approved.json'
import rejectedAnimation from './rejected.json'

export function Confirming(props) {
  return (
    <Card
      title={props.status === null ? 'Verifying ZK-SNARK proof' : 'Verified ZK-SNARK proof'}
      subtitle={status === null ? 'Waiting for transaction confirmation' : 'Transaction confirmed'}
    >
      {props.status === null && (
        <LoadingContainer>
          <Lottie animationData={animation} loop={true} />;
        </LoadingContainer>
      )}

      {props.status === true && (
        <LoadingContainer>
          <Lottie animationData={approvedAnimation} loop={false} />;
        </LoadingContainer>
      )}

      {props.status === false && (
        <LoadingContainer>
          <Lottie animationData={rejectedAnimation} loop={false} />;
        </LoadingContainer>
      )}
    </Card>
  )
}
