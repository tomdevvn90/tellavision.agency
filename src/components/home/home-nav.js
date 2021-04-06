import React, { useState, useEffect, createRef } from 'react'
import Styled from 'styled-components'
import { useTransitionHistory } from 'react-route-transition'
import './nav.scss'

const MenuContainer = Styled.div`
  opacity: ${ props => props.show };
  transform: ${ props => ( props.show ? `translateY(0%);` : `translateY(100%);` ) }
  -webkit-transform: ${ props => ( props.show ? `translateY(0%);` : `translateY(100%);` ) }
  transition: .5s ease;
  -webkit-transition: .5s ease;
  `

/**
 * 
 * @param {*} props 
 * @returns 
 */
const HomeNav = ( props ) => {
  const { appContext, menu, currentMenu, onUpdateTab } = props
  const [ show, setShow ] = useState( true )

  return (
    <div className="home-nav">
      <MenuContainer show={ show }>
        <MainMenu 
          appContext={ appContext }
          menu={ menu } 
          activeid={ currentMenu?.ID } 
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
const MainMenu = ( props ) => {
  let { appContext, menu, activeid, onGoMenu } = props
  const history = useTransitionHistory()
  const ulRef = createRef()

  useEffect( () => {
    
    const animateToggleMenu = () => {
      if( appContext.selectedTabBasicDetails === null ) {
        // go home
        
      } else {
        // go page
        
      }
    }

    const updateMenuHeight = () => {
      let liChild = ulRef.current.querySelectorAll( 'li' )
      let width = liChild[0]?.clientWidth
      
      window.menuItemHeight = width

      liChild.forEach( ( li, index ) => {
        li.style.setProperty( '--height-value', `${ width }px` )
        li.style.setProperty( '--total-nav-item', liChild.length )
      } )
    }

    updateMenuHeight()
    animateToggleMenu()
  } )

  const goLink = ( evt, menu ) => {
    
    if( onGoMenu ) {
      onGoMenu.call( evt, menu )
    }
  }

  return (
    <div className="main-menu">
      <ul ref={ ulRef }>
        { menu.map( item => {
          let menu_bg_style = {
            '--menu-color': item.background_color,
            backgroundColor: item.background_color
          }

          return ( 
            <li 
              className={ [ 'menu-item', `menu-id-${ item.ID }`, ( (activeid && activeid == item.ID) ? '__is-current' : '' ) ].join( ' ' ) } 
              onClick={ event => { goLink( event, item ) } } key={ item.ID }>
              <div className={ [ 'menu-color-background', (appContext?.selectedTabBasicDetails?.ID == item.ID ? '__is-full-color--test' : '') ].join( ' ' ) } style={ menu_bg_style }></div>
              <span className={ [ 'menu-text' ].join( ' ' ) } style={ { color: item.select_logo_color.toLowerCase() } }>{ item.title }</span> 
            </li>
          )
        } ) }
      </ul>
    </div>
  )
}

export default HomeNav