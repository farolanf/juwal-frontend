import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Match, Link } from '@reach/router'

import { Container, Responsive, Menu } from 'semantic-ui-react'
import './header.module.scss'

import useGlobal from '~store'
// import { useRoute } from '~libs/hooks'
import { setToken } from '~libs/auth'

// FIXME: remove dev code
const JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYzY5MDk5MzhmODc5NzE5MzBlZTg4MCIsImlhdCI6OTU3MzU1NjU0OSwiZXhwIjoxNTc2MTQ4NTQ5fQ.qY8pSPfgNcINyejFaH6yUwzAB6IvGZOLu3KtcdfctTo'

const MenuItem = props => (
  <Match path={props.to || props.href || ''}>
    {({ match }) => <Menu.Item active={!!match} {...props} />}
  </Match>
)

const MenuItems = () => {
  const [user, actions] = useGlobal(state => state.user)
  // const { navigate } = useRoute()

  const handleClickLogout = () => {
    actions.auth.logout()
    navigate('/')
  }

  const handleClickLoginTest = () => {
    setToken(JWT_SECRET)
    navigate('/')
    actions.auth.getUser()
  }

  return (
    <>
      <MenuItem name='Home' as={Link} to='/' />
      <MenuItem name='Kategori' as={Link} to='/categories' />
      <MenuItem name='Tentang Kami' as={Link} to='/about' />
      <MenuItem name='Pasang Iklan' as={Link} to='/pasang-iklan' />
      {user && (
        <>
          <MenuItem name='Iklan Saya' as={Link} to='/iklan-saya' />
          <MenuItem name='Logout' onClick={handleClickLogout} />
        </>
      )}
      {!user && (
        <>
          <MenuItem name='Login' as='a' href='http://localhost:1337/connect/facebook' />
          <MenuItem name='Login Test' onClick={handleClickLoginTest} />
        </>
      )}
      <MenuItem name='Test' as={Link} to='/test' />
    </>
  )
}

const AppHeader = ({ siteTitle }) => {
  const [menuVisible, setMenuVisible] = useState(false)
  return (
    <Container fluid as='header' styleName='navbar-container' data-app-navbar>
      <Container>
        <Responsive as={Menu} pointing secondary maxWidth={Responsive.onlyMobile.maxWidth}>
          <Menu.Item header icon='bullhorn' content={siteTitle} />
          <Menu.Item icon='bars' position='right' onClick={() => setMenuVisible(!menuVisible)} />
        </Responsive>
        {menuVisible &&
          <Menu stackable pointing secondary onClick={() => setMenuVisible(false)}>
            <MenuItems />
          </Menu>
        }
        <Responsive as={Menu} pointing secondary minWidth={Responsive.onlyTablet.minWidth}>
          <Menu.Item header icon='bullhorn' content={siteTitle} />
          <MenuItems />
        </Responsive>
      </Container>
    </Container>
  )
}

AppHeader.propTypes = {
  siteTitle: PropTypes.string
}

AppHeader.defaultProps = {
  siteTitle: ''
}

export default AppHeader