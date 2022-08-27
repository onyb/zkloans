import styled from 'styled-components'
import { Button } from '../button'

export const InputWrapper = styled.div`
  border-radius: 14px;
  background-color: rgb(33, 36, 41);
  width: initial;
  padding: 0.5rem;
  margin: 24px;
`

export const InputLabel = styled.div`
  color: rgb(255, 255, 255);
  padding-left: 12px;
  padding-top: 5px;
`

export const Input = styled.input`
  background-color: rgb(33, 36, 41);
  color: rgb(255, 255, 255);
  appearance: textfield;
  border: none;
  width: -webkit-fill-available;
  :focus {
    outline: none;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

export const CTAWrapper = styled.div`
  width: initial;
  margin: 24px;
`

export const CTA = styled(Button)`
  width: 100%;
  height: 45px;
  background-color: rgb(33, 114, 229);
  color: white;
  border: 1px solid transparent;

  :disabled {
    background-color: rgb(33, 36, 41);
    color: rgb(195, 197, 203);
    cursor: auto;
    text-decoration: none;
    opacity: 0.6;
    pointer-events: none;
  }
`
