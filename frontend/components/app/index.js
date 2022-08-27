import React from 'react'

import './index.css'
import { Container } from './style'
import { Navbar } from '../navbar'
import { Score } from '../score'
import { ScoreForm } from '../score-form'
import { ZK } from '../zk'

export function App() {
  const [showScoreForm, setShowScoreForm] = React.useState(true)
  const [showZK, setShowZK] = React.useState(false)
  const [isValidZKProof, setIsValidZKProof] = React.useState(undefined)
  const [isVerifyingZKProof, setIsVerifyingZKProof] = React.useState(false)
  const [showScore, setShowScore] = React.useState(false)
  const [publicSignals, setPublicSignals] = React.useState(undefined)
  const [proof, setProof] = React.useState(undefined)

  const submitScoreForm = () => {
    setShowScoreForm(false)
    setShowZK(true)

    fetch
      .post('http://localhost:8081/prove', {
        a: 850,
        b: 800
      })
      .then(response => response.json())
      .then(json => {
        // Set groth16 ZK-SNARK proof and public signals to React state
        setPublicSignals(json.publicSignals)
        setProof(json.proof)

        setIsVerifyingZKProof(true)
        fetch
          .post('http://localhost:8081/verify', {
            proof,
            publicSignals
          })
          .then(response => response.json())
          .then(json => {
            setIsValidZKProof(json.valid)
            setIsVerifyingZKProof(false)
          })
      })

    // Navigate to rendering score
    setShowZK(false)
    setShowScore(true)
  }

  return (
    <Container>
      <Navbar />
      <div className='header'>
        <h1 className='header-title'>zkLoans</h1>
        <h2 className='sub-header'>Confidential credit scores using zkSNARKs</h2>
      </div>

      {showScoreForm && <ScoreForm onSubmit={submitScoreForm} />}
      {showZK && <ZK isValidZKProof={isValidZKProof} isVerifyingZKProof={isVerifyingZKProof} />}
      {showScore && (
        <Score score='725' max_score='850' proof={proof} publicSignals={publicSignals} />
      )}
    </Container>
  )
}
