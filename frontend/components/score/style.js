import styled from 'styled-components'
import { Button } from '../button'
import Logo from './near.svg'

export const SubmitProofButtonWrapper = styled.div`
  width: initial;
  margin: 24px;
`

export const SubmitProofButton = styled(Button)`
  width: 100%;
  height: 45px;
  background-color: rgb(33, 114, 229);
  color: white;
  border: 1px solid transparent;

  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  padding-left: 40px;
`

export const NearIcon = styled.div`
  background-image: url(${Logo});
  background-repeat: no-repeat;
  width: 20px;
  height: 100%;
  margin-top: 14px;
`
