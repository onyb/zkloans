import React from 'react'

import { Container } from './style'
import './index.css'
import { Card } from '../card'
import { Navbar } from '../navbar'
import { Score } from '../score'

export function App() {
  return (
    <Container>
      <Navbar />
      <div className='header'>
        <h1 className='header-title'>zkLoans</h1>
        <h2 className='sub-header'>Confidential credit scores using zkSNARKs</h2>
      </div>

      <Score score='725' max_score='850' />
    </Container>
  )
}
