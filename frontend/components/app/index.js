import React from 'react'

import './index.css'
import { Container } from './style'
import { Card } from '../card'
import { Navbar } from '../navbar'
import { Score } from '../score'
import { ScoreForm } from '../score-form'

export function App() {
  const [showScoreForm, setShowScoreForm] = React.useState(true)
  const [showGeneratingProof, setShowGeneratingProof] = React.useState(false)
  const [showScore, setShowScore] = React.useState(false)

  const submitScoreForm = () => {
    setShowScoreForm(false)
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
      {showScore && <Score score='725' max_score='850' />}
    </Container>
  )
}
