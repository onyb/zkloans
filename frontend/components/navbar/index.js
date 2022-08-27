import { NavbarRow, NavButton, NearLogo, ProfileRow, Profile } from './style'
import { signInWithNearWallet, signOutNearWallet } from '../../near-api'

export function Navbar() {
  return (
    <NavbarRow>
      <NearLogo />
      <ProfileRow>
        <Profile>{window.accountId}</Profile>
        {window.accountId ? (
          <NavButton onClick={signOutNearWallet}>Logout</NavButton>
        ) : (
          <NavButton onClick={signInWithNearWallet}>Connect</NavButton>
        )}
      </ProfileRow>
    </NavbarRow>
  )
}
