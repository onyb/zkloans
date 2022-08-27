import { Container } from './style'
import { CardContainer } from '../card'
import React from 'react'
import { Navbar } from '../navbar'

export function App() {
  return (
    <Container>
      <Navbar />
      <CardContainer />
    </Container>
  )
}
