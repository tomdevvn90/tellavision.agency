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
  const { context, menu, updateTab, currentMenu } = props
  const [ show, setShow ] = useState( 0 )

  useEffect( () => {
    if( ! currentMenu ) return;

    ( [ 16, 19 ].includes( currentMenu.ID ) ) 
      ? setShow( 0 ) 
      : setShow( 1 )
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
            console.log( menu );
            context.setSelectedTabBasicDetails( menu )
            updateTab( menu )
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
    let elem = document.querySelector( `.menu-id-${ menu.ID } .menu-color-background` )
    elem.classList.add( '__animate-menu-background' )

    document.querySelector( '#tab-page' ).style.setProperty( 'opacity', .5 )

    setTimeout( () => {
      document.querySelector( '#tab-page' ).style.setProperty( 'opacity', 1 )
      elem.classList.remove( '__animate-menu-background' )
    }, 1200 )
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