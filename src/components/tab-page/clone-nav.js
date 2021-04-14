import React, { useState, useEffect, createRef } from 'react'
import Styled from 'styled-components'
import { useTransitionHistory } from 'react-route-transition'
import './clone-nav.scss'

const MenuContainer = Styled.div`
  opacity: ${ props => props.show };
  transition: .5s ease;
  -webkit-transition: .5s ease;
  `

/**
 * 
 * @param {*} props 
 * @returns 
 */
const NavCloneforTab = ( props ) => {
  const { menu, currentMenu, onUpdateTab } = props
  const [ show, setShow ] = useState( (( [ 16, 19 ].includes( currentMenu?.ID ) ) ? 0 : 1) )

  useEffect( () => {
    if( ! currentMenu ) return;

    window.menuItemHeightCache = window.menuItemHeight ? window.menuItemHeight : null
    // console.log( window.menuItemHeightCache )
    const showNav = () => {
      /**
       * 16 => About Us page
       * 19 => Contact page
       */
      ( [ 16, 19 ].includes( currentMenu.ID ) ) 
        ? setShow( 0 ) 
        : setShow( 1 )
    }

    setTimeout( () => { 
      showNav()
    }, 10 ) 
  } )

  if( ! currentMenu ) return false;

  setTimeout( () => {
    /**
     * 16 => About Us page
     * 19 => Contact page
     */
    ( [ 16, 19 ].includes( currentMenu.ID ) ) 
      ? setShow( 0 ) 
      : setShow( 1 )
  }, 10 )

  return (
    <div className="nav-clone">
      <MenuContainer show={ show }>
        <MenuClone 
          menu={ menu } 
          activeid={ currentMenu.ID } 
          onGoMenu={ ( menu ) => { 
            if( onUpdateTab ) {
              onUpdateTab( menu )
            }
          } }/>
      </MenuContainer>
    </div>
  )
}

/**
 * 
 * @param {*} props 
 * @returns 
 */
const MenuClone = ( props ) => {
  let { menu, activeid, onGoMenu } = props
  const history = useTransitionHistory()
  const ulRef = createRef()

  useEffect( () => {
    const updateMenuHeight = () => {
      let liChild = ulRef.current.querySelectorAll( 'li' )
      let width = window.menuItemHeight ? window.menuItemHeight : liChild[0]?.clientWidth

      liChild.forEach( ( li, index ) => {
        li.style.setProperty( '--height-value', `${ width }px` )
        li.style.setProperty( '--total-nav-item', liChild.length )
      } )
    }

    updateMenuHeight()
  } )

  const goLink = ( e, menu ) => {
    e.preventDefault()
    animate( menu )

    onGoMenu.call( e, menu )
    history.push( `/${ menu.post_name == 'home' ? 'visuals' : menu.post_name }` )
  }

  const animate = ( menu ) => { 
    let menu_nav_item =  document.querySelector( `.menu-id-${ menu.ID }` )
    let menu_text = menu_nav_item.querySelector( '.menu-text' )
    let pos = menu_nav_item.getBoundingClientRect()
    let menu_text_pos = menu_text.getBoundingClientRect()

    /**
     * Logo
     */
    let logo = document.querySelector( '.header_logo_img' )
    let logo_pos = logo.getBoundingClientRect()
    let logo_clone = logo.cloneNode( true )
    
    logo_clone.classList.add( '__clone-logo' )
    logo_clone.style.setProperty( 'position', 'absolute' )
    logo_clone.style.setProperty( 'left', `${ logo_pos.x }px` )
    logo_clone.style.setProperty( 'top', `${ logo_pos.y }px` )
    logo_clone.style.setProperty( 'width', `${ logo_pos.width }px` )
    logo_clone.style.setProperty( 'z-index', 10 )

    document.body.appendChild( logo_clone )

    /**
     * Hidden menu text
     */
    menu_text.style.setProperty( 'opacity', 0 )

    /**
     * Hidden content
     */
    try {
      document.querySelector( '#tab-page .menu-item-main-content' ).style.setProperty( 'opacity', '0', 'important' )
    } catch( e ) {

    }

    /**
     * Hidden tab title 
     */
    let tabTitle = document.querySelector( '#tab-page .tab-title' )
    let titlePos = tabTitle.getBoundingClientRect()
    tabTitle.style.setProperty( 'opacity', 0, 'important' )

    /**
     * Text animate 
     */
    // let menu_title_shadow = document.createElement( 'span' )
    // menu_title_shadow.style.setProperty( 'transition', '1.1s cubic-bezier(.48,.05,.73,1.03)' )
    // menu_title_shadow.style.setProperty( 'z-index', 10 )
    // menu_title_shadow.style.setProperty( 'position', 'fixed' )
    // menu_title_shadow.style.setProperty( 'left', `${ menu_text_pos.x }px` )
    // menu_title_shadow.style.setProperty( 'top', `${ menu_text_pos.y }px` )
    // menu_title_shadow.style.setProperty( 'color', menu.select_logo_color )
    // menu_title_shadow.style.setProperty( 'font-size', `30px` )
    // menu_title_shadow.style.setProperty( 'font-family', 'Playfair Display SC' )
    // menu_title_shadow.innerHTML = menu_text.innerHTML// menu.post_title

    // document.body.appendChild( menu_title_shadow )
    // setTimeout( () => {
    //   menu_title_shadow.style.top = titlePos.y + 'px'
    //   menu_title_shadow.style.left = titlePos.x + 'px'
    // }, 10 )

    let main = document.querySelector( '#main' )
    let root = document.querySelector( '#root' )
    let elem = menu_nav_item.querySelector( `.menu-color-background` )
    let menuItem = menu_nav_item
    let menuTitle = menuItem.querySelector( `.menu-text` )
    let menuItemLiPos = menuItem.getBoundingClientRect()
    let backgroundWrap = document.createElement( 'DIV' )
    let backgroundAnim = document.createElement( 'DIV' )
    let menuClone = document.querySelector( '.menu-clone' )
    let menuClonePos = menuClone.getBoundingClientRect()
    let _menuTitle = document.createElement( 'DIV' )

    {
      /**
       * Background animate
       */

      backgroundWrap.classList.add( 'background-shadow-wrap' )
      backgroundWrap.style.setProperty( 'z-index', '3' )
      backgroundWrap.style.setProperty( 'left', (menuItem.offsetLeft + (menuItemLiPos.width / 2)) + 'px' )
      backgroundWrap.style.setProperty( 'top', (menuClonePos.y + menuItemLiPos.height) + 'px' )

      // Title 
      _menuTitle.style.setProperty( 'color', menuTitle.style.color )
      _menuTitle.style.setProperty( 'position', 'absolute' )
      _menuTitle.style.setProperty( 'z-index', 1 )
      _menuTitle.style.setProperty( 'top', `${ menuTitle.offsetTop }px` )
      _menuTitle.style.setProperty( 'left', `${ menuTitle.offsetLeft }px` )
      _menuTitle.style.setProperty( 'font-size', '30px' )
      _menuTitle.style.setProperty( 'font-family', 'Playfair Display SC' )
      _menuTitle.style.setProperty( 'transition', '1.2s' )
      _menuTitle.style.setProperty( '-webkit-transition', '1.2s' )
      _menuTitle.innerHTML = menu.title

      backgroundAnim.classList.add( 'background-shadow-anim' )
      backgroundAnim.appendChild( _menuTitle )

      backgroundWrap.appendChild( backgroundAnim ) 
      document.querySelector( '#tab-page' ).appendChild( backgroundWrap )

      setTimeout( () => {
        backgroundAnim.style.setProperty( 'left', `${ ((menuItemLiPos.x + (menuItemLiPos.width / 2)) - 15) * -1 }px` )
        backgroundAnim.style.setProperty( 'width', `${ root.clientWidth }px` )
        backgroundAnim.style.setProperty( 'height', `${ root.clientHeight }px` )
        backgroundAnim.style.setProperty( 'background-color', menu.background_color ) 

        _menuTitle.style.setProperty( 'top', '52pt', 'important' )
        _menuTitle.style.setProperty( 'left', `${ (main.offsetLeft - 15) + 376 }px`, 'important' )
      } )
    }

    // document.querySelector( '#tab-page' ).style.setProperty( 'opacity', .8 )

    setTimeout( () => {
      document.querySelector( '#tab-page' ).style.setProperty( 'opacity', 1 )
      elem.classList.remove( '__animate-menu-background' )

      tabTitle.style.setProperty( 'opacity', 1, 'important' )
      menu_text.style.setProperty( 'opacity', '' )
      
      try {
        console.log( document.querySelector( '#tab-page .menu-item-main-content' ) )
        document.querySelector( '#tab-page .menu-item-main-content' ).style.setProperty( 'opacity', '' )
      } catch( e ) {

      }

      // menu_title_shadow.remove()
      logo_clone.remove()
      backgroundWrap.remove()
    }, 1300 )
  }

  return (
    <div className="menu-clone">
      <ul ref={ ulRef }>
        { menu.map( item => {

          let menu_bg_style = {
            backgroundColor: item.background_color
          }

          return (
            <li 
              className={ [ 'menu-item', `menu-id-${ item.ID }`, ( activeid == item.ID ? '__is-current' : '' ) ].join( ' ' ) } 
              onClick={ event => { goLink( event, item ) } } key={ item.ID }>
              <div className="menu-color-background" style={ menu_bg_style }></div>
              <span className="menu-text" style={ { color: item.select_logo_color.toLowerCase() } }>{ item.title }</span>
            </li>
          )
        } ) }
      </ul>
    </div>
  )
}

export default NavCloneforTab