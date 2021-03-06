import React, { useState } from 'react'
import { Match, Link, navigate } from '@reach/router'

import { Container, Responsive, Menu } from 'semantic-ui-react'
import './header.module.scss'

import env from '~src/env'
import config from '~config'
import useGlobal from '~store'
import { setToken } from '~libs/auth'

const MenuItem = props => (
  <Match path={props.to || props.href || ''}>
    {({ match }) => <Menu.Item active={!!match} {...props} />}
  </Match>
)

const MenuItems = () => {
  const [user, actions] = useGlobal(state => state.user)

  const handleClickLogout = () => {
    actions.auth.logout()
    navigate('/')
  }

  const handleClickLoginTest = () => {
    setToken(env.JWT_TOKEN)
    navigate('/')
    actions.auth.getUser()
  }

  return (
    <>
      <MenuItem name='Home' as={Link} to='/' />
      <MenuItem name='Cari' as={Link} to='/cari' />
      <MenuItem name='Tentang Kami' as={Link} to='/tentang-kami' />
      <MenuItem name='Pasang Iklan' as={Link} to='/pasang-iklan' />
      {user && (
        <>
          <MenuItem name='Iklan Saya' as={Link} to='/iklan-saya' />
          <MenuItem name='Keluar' onClick={handleClickLogout} />
        </>
      )}
      {!user && (
        <>
          <MenuItem name='Masuk' as='a' href={`${config.apiUrl}/connect/facebook`} />
          <MenuItem name='Masuk (Test)' onClick={handleClickLoginTest} />
        </>
      )}
      <MenuItem name='Test' as={Link} to='/test' />
    </>
  )
}

const AppHeader = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  return (
    <Container fluid as='header' styleName='navbar-container' data-app-navbar>
      <Container>
        <Responsive as={Menu} pointing secondary maxWidth={Responsive.onlyMobile.maxWidth}>
          <Menu.Item header icon='bullhorn' content='Juwal' />
          <Menu.Item icon='bars' position='right' onClick={() => setMenuVisible(!menuVisible)} />
        </Responsive>
        {menuVisible && (
          <Menu stackable pointing secondary onClick={() => setMenuVisible(false)}>
            <MenuItems />
          </Menu>
        )}
        <Responsive as={Menu} pointing secondary minWidth={Responsive.onlyTablet.minWidth}>
          <Menu.Item header icon='bullhorn' content='Juwal' />
          <MenuItems />
        </Responsive>
      </Container>
    </Container>
  )
}

export default AppHeader