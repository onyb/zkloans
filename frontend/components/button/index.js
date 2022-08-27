import styled from 'styled-components'

export const Button = styled.button`
  width: ${p => p.width};
  height: ${p => p.height};
  border: 1px solid white;
  border-radius: 50px;
  font-size: 14px;
  margin-right: 14px;
  color: white;

  :hover {
    background-color: white;
    color: #1e2029;
  }
`
