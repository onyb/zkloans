import { signInWithNearWallet, signOutNearWallet } from '../../near-api'

import { Button } from '../button'
import { NavbarRow, NearLogo, ProfileRow, Profile } from './style'

export function Navbar() {
  return (
    <NavbarRow>
      <NearLogo />
      <ProfileRow>
        <Profile>{window.accountId}</Profile>
        {window.accountId ? (
          <Button width='94px' height='32px' onClick={signOutNearWallet}>
            Logout
          </Button>
        ) : (
          <Button width='94px' height='32px' onClick={signInWithNearWallet}>
            Connect
          </Button>
        )}
      </ProfileRow>
    </NavbarRow>
  )
}
