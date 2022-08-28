import React from 'react'
import axios from 'axios'

import './index.css'
import { Container } from './style'
import { Navbar } from '../navbar'
import { Score } from '../score'
import { ScoreForm } from '../score-form'
import { ZK } from '../zk'

import { getCreditScore } from './mock'
import { Confirming } from '../confirming'

export function App() {
  const [showScoreForm, setShowScoreForm] = React.useState(true)
  const [showZK, setShowZK] = React.useState(false)
  const [isValidZKProof, setIsValidZKProof] = React.useState(undefined)
  const [isVerifyingZKProof, setIsVerifyingZKProof] = React.useState(false)
  const [showScore, setShowScore] = React.useState(false)
  const [publicSignals, setPublicSignals] = React.useState(undefined)
  const [proof, setProof] = React.useState(undefined)
  const [isConfirmingTransaction, setIsConfirmingTransaction] = React.useState(false)

  const creditReport = getCreditScore()

  const setIsConfirmingTransactionWrapper = () => {
    setIsConfirmingTransaction(true)
    setShowScore(false)
    setShowScore(false)
    setShowZK(false)
  }

  const submitScoreForm = () => {
    setShowScoreForm(false)
    setShowZK(true)

    setTimeout(() => {
      axios
        .post('http://localhost:8081/prove', {
          a: creditReport.score,
          b: creditReport.threshold
        })
        .then(response => response.data)
        .then(json => {
          // Set groth16 ZK-SNARK proof and public signals to React state
          setPublicSignals(json.publicSignals)
          setProof(json.proof)

          setIsVerifyingZKProof(true)
          axios
            .post('http://localhost:8081/verify', {
              proof: json.proof,
              publicSignals: json.publicSignals
            })
            .then(response => response.data)
            .then(json => {
              setIsValidZKProof(json.valid)
              setTimeout(() => {
                setIsVerifyingZKProof(false)

                // Navigate to rendering score
                setShowZK(false)
                setShowScore(true)
              }, 3 * 1000)
            })
        })
    }, 7 * 1000)
  }

  return (
    <Container>
      <Navbar />
      <div className='header'>
        <h1 className='header-title'>zkLoans</h1>
        <h2 className='sub-header'>Confidential credit scores using zkSNARKs</h2>
      </div>

      {isConfirmingTransaction && <Confirming />}
      {showScoreForm && <ScoreForm onSubmit={submitScoreForm} />}
      {showZK && <ZK isValidZKProof={isValidZKProof} isVerifyingZKProof={isVerifyingZKProof} />}
      {showScore && (
        <Score
          creditReport={creditReport}
          proof={proof}
          publicSignals={publicSignals}
          isValidZKProof={isValidZKProof}
          setIsConfirmingTransaction={setIsConfirmingTransactionWrapper}
        />
      )}
    </Container>
  )
}
