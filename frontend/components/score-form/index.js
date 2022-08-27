import React from 'react'

import { Card } from '../card'
import { CTA, CTAWrapper, Input, InputLabel, InputWrapper } from './style'

export function ScoreForm(props) {
  const [name, setName] = React.useState('')
  const [dob, setDob] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [pan, setPan] = React.useState('')

  const isFormDataValid =
    name &&
    dob &&
    /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(dob) &&
    phone &&
    phone.length === 10 &&
    pan &&
    pan.length === 10
  return (
    <Card title='Fetch Credit Score' subtitle='Enter your details below'>
      <InputWrapper>
        <InputLabel>Name</InputLabel>
        <Input
          placeholder='Satoshi Nakamoto'
          value={name}
          onChange={e => setName(e.target.value)}
          spellcheck={false}
        />
      </InputWrapper>

      <InputWrapper>
        <InputLabel>Date of birth</InputLabel>
        <Input
          placeholder='YYYY-MM-DD'
          value={dob}
          onChange={e => setDob(e.target.value)}
          spellcheck={false}
        />
      </InputWrapper>

      <InputWrapper>
        <InputLabel>Phone</InputLabel>
        <Input
          type='number'
          placeholder='8122244434'
          value={phone}
          onChange={e => setPhone(e.target.value)}
          spellcheck={false}
        />
      </InputWrapper>

      <InputWrapper>
        <InputLabel>PAN</InputLabel>
        <Input
          placeholder='BJHPBXXXXX'
          value={pan}
          onChange={e => setPan(e.target.value)}
          spellcheck={false}
        />
      </InputWrapper>

      <CTAWrapper>
        <CTA disabled={!isFormDataValid} onClick={props.onSubmit}>
          Submit
        </CTA>
      </CTAWrapper>
    </Card>
  )
}
