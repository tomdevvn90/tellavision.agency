import React, {useEffect, useState} from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'

import {RootReducer} from "../../store/reducers";

interface ContainerProps {
    viewportWidth: number;
    viewportHeight: number;
    isPageLoaded: boolean;
}

const Container = styled('div')<ContainerProps>`
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
`;

const Content = styled.div`
  display: flex;
  overflow: hidden;
`;

interface SquareProps {
    loadingIndex: number;
    index: number;
    isPageLoaded: boolean;
}

const Square = styled('div')<SquareProps>`
  width: 20px;
  height: 20px;
  background-color: ${props => props.color};
  transition: transform .4s ease, opacity .3s ease;
  transform: translateY(${props => props.loadingIndex <= props.index ? '40px' : '0'});
  opacity: ${props => props.isPageLoaded ? '0' : '1'};
`;

const Loader: React.FC = () => {
    const [loadingIndex, setLoadingIndex] = useState<number>(0);
    const [viewportWidth, setViewportWidth] = useState(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
    const [viewportHeight, setViewportHeight] = useState(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
    const [colors, setColors] = useState<string[]>([]);

    const loadingLandingData = useSelector((state: RootReducer) => state.landData.loading);
    const loadingMenuData = useSelector((state: RootReducer) => state.menusData.loading);
    const loadingAboutData = useSelector((state: RootReducer) => state.aboutTabData.loading);
    const menus = useSelector((state: RootReducer) => state.landData.menus?.data);

    useEffect(() => {
        const primaryMenus = menus?.items;
        if (primaryMenus) {
            const cols = [];
            for (let menu of primaryMenus) {
                cols.push(menu.background_color);
            }
            setColors([...colors, ...cols]);
        }

    }, [menus]);

    useEffect(() => {
        let up = true;
        let value = 0;
        let increment = 1;
        const ceiling = colors.length;
        const PerformCalc = () => {
            if (up && value <= ceiling) {
                value += increment;
                setLoadingIndex((prevState: number) => ( prevState + 1));

                if (value === ceiling) {
                    up = false;
                }
            } else {
                up = false;
                value -= increment;
                setLoadingIndex((prevState: number) => ( prevState - 1));

                if (value === 0) {
                    up = true;
                }
            }
        };
        const interval = setInterval(PerformCalc, 300);

        window.addEventListener("resize", () => {
            setViewportHeight(Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0));
            setViewportWidth(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));
        });

        return () => clearInterval(interval);
    }, [colors, menus]);

    return (<Container
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
            isPageLoaded={!loadingLandingData && !loadingMenuData && !loadingAboutData}
        >
            <Content >
                {
                    colors.map((color, index) => (
                        <Square
                            key={index}
                            color={color}
                            index={index}
                            loadingIndex={loadingIndex}
                            isPageLoaded={!loadingLandingData && !loadingMenuData && !loadingAboutData}
                        >
                        </Square>
                    ))
                }
            </Content>
        </Container>
    )
};

export default Loader;
