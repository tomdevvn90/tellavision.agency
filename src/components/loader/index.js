import React, { Component } from 'react'
import styled from 'styled-components'

import MyContext from "../../MyContext";
import APIService from "../../services";

const Container = styled.div` 
  width: ${props => props.viewportWidth}px;
  height: ${props => props.viewportHeight}px;
  background-color: #fff;
  position: fixed;
  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity .6s ease .8s;
  z-index: 222222;
  opacity: ${props => props.isPageLoaded ? '0' : '1'};
  width:100%;
`

const Content = styled.div`
  display: flex;
  overflow: hidden;
`

const Square = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  transition: transform .4s ease, opacity .3s ease;
  transform: translateY(${props => props.loadingIndex <= props.index ? '40px' : '0'});
  opacity: ${props => props.isPageLoaded ? '0' : '1'};
`

class Loader extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loadingIndex: 0,
            viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
            viewportHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
            colors: []
        }
    }

    componentDidMount() {
        var up = true
        var value = 0
        var increment = 1
        APIService.fetchPrimaryMenu()
            .then(res => {
                let primaryMenu = res.data.items;
                primaryMenu.forEach((menu) => {
                    this.state.colors.push(menu.background_color);
                });

                var ceiling = this.state.colors.length

                const PerformCalc = () => {
                    if (up === true && value <= ceiling) {
                        value += increment
                        this.setState(prevstate => ({ loadingIndex: prevstate.loadingIndex + 1 }))

                        if (value === ceiling) {
                            up = false;
                        }
                    } else {
                        up = false
                        value -= increment;
                        this.setState(prevstate => ({ loadingIndex: prevstate.loadingIndex - 1 }))

                        if (value === 0) {
                            up = true;
                        }
                    }
                }
                setInterval(PerformCalc, 300)

                window.addEventListener("resize", () => {
                    this.setState({
                        viewportHeight: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0),
                        viewportWidth: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
                    })
                })
            })
    }

    render() {
        return (
            <MyContext.Consumer>
                {(context) => {
                    const {
                        colors,
                        viewportWidth,
                        viewportHeight,
                        loadingIndex
                    } = this.state

                    return (
                        <Container
                            viewportWidth={viewportWidth}
                            viewportHeight={viewportHeight}
                            isPageLoaded={context.isPageLoaded}
                        >
                            <Content >
                                {
                                    colors.map((color, index) => (
                                        <Square
                                            key={index}
                                            color={color}
                                            index={index}
                                            loadingIndex={loadingIndex}
                                            isPageLoaded={context.isPageLoaded}
                                        >
                                        </Square>
                                    ))
                                }
                            </Content>
                        </Container>
                    )
                }}
            </MyContext.Consumer>
        )
    }
}

export default Loader