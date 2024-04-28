import { useAuth0 } from '@auth0/auth0-react';

const First = () => {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    return(
        <>
            INVOICE MANAGER
            <button className="sidebar-button logout-button" onClick={() => loginWithRedirect()}>
            Login
          </button>
        </>
    )
}

export default First;