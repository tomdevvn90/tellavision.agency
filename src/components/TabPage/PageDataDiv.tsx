import {TabData} from "../../@types/tab-data";
import styled from "styled-components";

interface PageDataDivPropType {
    pageData: TabData
}

const PageDataDiv = styled('div')<PageDataDivPropType>`
  display: inline-block;
  width:77%;
  
    font-family: ${(props) =>
    props.pageData && props.pageData.acf
        ? props.pageData.acf.typography.font_family
        : ""};
    font-size: ${(props) =>
    props.pageData && props.pageData.acf
        ? props.pageData.acf.typography.font_size + "px"
        : ""};
    color: ${(props) =>
    props.pageData && props.pageData.acf
        ? props.pageData.acf.typography.text_color
        : ""};
 `;

export default PageDataDiv;
