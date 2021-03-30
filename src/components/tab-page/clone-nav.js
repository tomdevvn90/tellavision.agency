import React, { useState, useEffect } from 'react'
import Styled from 'styled-components'
import { useTransitionHistory } from 'react-route-transition'
import './clone-nav.scss'

const MenuContainer = Styled.div`
  opacity: ${ props => props.show };
  transform: ${ props => ( props.show ? `translateY(0%);` : `translateY(80%);` ) }
  -webkit-transform: ${ props => ( props.show ? `translateY(0%);` : `translateY(80%);` ) }
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
  const [ show, setShow ] = useState( 0 )

  useEffect( () => {
    if( ! currentMenu ) return;

    const showNav = () => {
      ( [ 16, 19 ].includes( currentMenu.ID ) ) 
        ? setShow( 0 ) 
        : setShow( 1 )
    }

    setTimeout( () => {
      showNav()
    }, 1200 ) 
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
  }, 500 )

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
  const history = useTransitionHistory();

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

    /**
     * Logo
     */
    let logo = document.querySelector( '.header_logo_img' )
    let logo_pos = logo.getBoundingClientRect()
    let logo_clone = logo.cloneNode( true )
    console.log( logo_pos )
    
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
     * Hidden tab title 
     */
    let tabTitle = document.querySelector( '#tab-page .tab-title' )
    let titlePos = tabTitle.getBoundingClientRect()
    tabTitle.style.setProperty( 'opacity', 0, 'important' )

    /**
     * Text animate 
     */
    let menu_title_shadow = document.createElement( 'span' )
    menu_title_shadow.style.setProperty( 'transition', '1.2s' )
    menu_title_shadow.style.setProperty( 'z-index', 10 )
    menu_title_shadow.style.setProperty( 'position', 'fixed' )
    menu_title_shadow.style.setProperty( 'left', `${ pos.x }px` )
    menu_title_shadow.style.setProperty( 'top', `${ pos.y }px` )
    menu_title_shadow.style.setProperty( 'color', menu.select_logo_color )
    menu_title_shadow.style.setProperty( 'font-size', `30px` )
    menu_title_shadow.style.setProperty( 'font-family', 'Playfair Display SC' )
    menu_title_shadow.innerHTML = menu_text.innerHTML// menu.post_title

    document.body.appendChild( menu_title_shadow )
    setTimeout( () => {
      menu_title_shadow.style.top = titlePos.y + 'px'
      menu_title_shadow.style.left = titlePos.x + 'px'
    }, 10 )

    /**
     * Background animate
     */
    let elem = menu_nav_item.querySelector( `.menu-color-background` )
    elem.classList.add( '__animate-menu-background' )

    document.querySelector( '#tab-page' ).style.setProperty( 'opacity', .8 )

    setTimeout( () => {
      document.querySelector( '#tab-page' ).style.setProperty( 'opacity', 1 )
      elem.classList.remove( '__animate-menu-background' )

      tabTitle.style.setProperty( 'opacity', 1, 'important' )
      menu_text.style.setProperty( 'opacity', '' )
      menu_title_shadow.remove()
      logo_clone.remove()
    }, 1300 )
  }

  return (
    <div className="menu-clone">
      <ul>
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