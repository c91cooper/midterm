import React from 'react'
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'
import Header from '../components/Header'
import DemoPageLinks from '../components/DemoPageLinks'

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

const Demo = () => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <Header email={AuthUser.email} signOut={AuthUser.signOut} />
      <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          <div>
          <a href="/todo" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a todo!</a>
          </div>
          <div>
          <a href="/contacts" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a contact!</a>
          </div>
          <div>
          <a href="/event" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add an event!</a>
          </div>
        </div>
        <DemoPageLinks />
      </div>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Demo)
