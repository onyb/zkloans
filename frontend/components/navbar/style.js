import styled from 'styled-components'
import Logo from './logo.svg'

export const NavbarRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 45px;
  background: #1e2029;
`

export const NearLogo = styled.div`
  background-image: url(${Logo});
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
`

export const ProfileRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;
  align-items: center;
`

export const Profile = styled.div`
  color: rgb(180, 178, 178);
  font-weight: 600;
`
