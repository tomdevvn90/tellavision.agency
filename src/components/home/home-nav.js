import React, { useState, useEffect, createRef } from 'react'
import Styled from 'styled-components'
import { useTransitionHistory } from 'react-route-transition'
import './nav.scss'

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
const HomeNav = ( props ) => {
  const { appContext, menu, currentMenu, onUpdateTab } = props
  const [ show, setShow ] = useState( 1 )

  return (
    <div className="home-nav">
      <MenuContainer show={ 1 }>
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
      
      window.menuItemHeight = window.menuItemHeightCache ? window.menuItemHeightCache : width

      liChild.forEach( ( li, index ) => {
        li.style.setProperty( '--height-value', `${ window.menuItemHeight }px` )
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