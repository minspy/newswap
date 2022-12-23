import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { Menu as UikitMenu } from '@pancakeswap/uikit'
import { useTranslation, languageList } from '@pancakeswap/localization'
import { NetworkSwitcher } from 'components/NetworkSwitcher'
import useTheme from 'hooks/useTheme'
import { usePriceCakeBusd } from 'state/farms/hooks'
import UserMenu from './UserMenu'
import { useMenuItems } from './hooks/useMenuItems'
import GlobalSettings from './GlobalSettings'
import { getActiveMenuItem, getActiveSubMenuItem } from './utils'
import { footerLinks } from './config/footerConfig'
import { SettingsMode } from './GlobalSettings/types'

const Menu = (props) => {
  const { isDark, setTheme } = useTheme()
  const cakePriceUsd = usePriceCakeBusd()
  const { currentLanguage, setLanguage, t } = useTranslation()
  const { pathname } = useRouter()

  const menuItems = useMenuItems()

  const activeMenuItem = getActiveMenuItem({ menuConfig: menuItems, pathname })
  const activeSubMenuItem = getActiveSubMenuItem({ menuItem: activeMenuItem, pathname })

  const toggleTheme = useMemo(() => {
    return () => setTheme(isDark ? 'light' : 'dark')
  }, [setTheme, isDark])

  const getFooterLinks = useMemo(() => {
    return footerLinks(t)
  }, [t])
  // console.log('activeMenuItem=======', activeMenuItem)
  return (
    <UikitMenu
      linkComponent={(linkProps) => {
        // return <div><img src='images/img/logo.jpg' style={{width: '32px', height: '32px'}}/></div>
        return <NextLinkFromReactRouter to={linkProps.href} {...linkProps} prefetch={false} />
      }}
      rightSide={
        <>
          {/* <div><img src='images/img/logo.jpg' style={{width: '32px', height: '32px'}} alt=""/></div> */}
          <GlobalSettings mode={SettingsMode.GLOBAL} />
          <NetworkSwitcher />
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  background: '#F4F8FB',
                  marginRight: '10px',
                  paddingRight: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '0 15px 15px 0',
                }}
              >
                <img src="images/img/icon-1.jpg" style={{ width: '30px', height: '30px', marginRight: '5px' }} alt="" />
                <img src="images/img/bottom-icon.png" style={{ width: '15px', height: '15px' }} alt="" />
              </div>
              {/* <div style={{background: '#F4F8FB', marginRight: '5px', paddingRight: '10px', display: 'flex', alignItems: 'center',borderRadius: '0 15px 15px 0'}}>
                <img src='images/img/qianbao.jpg' style={{width: '30px', height: '30px', marginRight: '5px'}} alt=""/>
                <img src='images/img/bottom-icon.png' style={{width: '15px', height: '15px'}} alt=""/>
              </div> */}
            </div>
          </div>
          <UserMenu />
        </>
      }
      isDark={isDark}
      toggleTheme={toggleTheme}
      currentLang={currentLanguage.code}
      langs={languageList}
      setLang={setLanguage}
      cakePriceUsd={cakePriceUsd.toNumber()}
      links={menuItems}
      subLinks={activeMenuItem?.hideSubNav || activeSubMenuItem?.hideSubNav ? [] : activeMenuItem?.items}
      footerLinks={getFooterLinks}
      activeItem={activeMenuItem?.href}
      activeSubItem={activeSubMenuItem?.href}
      buyCakeLabel={t('Buy CAKE')}
      {...props}
    />
  )
}

export default Menu
