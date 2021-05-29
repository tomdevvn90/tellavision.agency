import styled from "styled-components";
import {SubPageContentType} from "../../@types/sub-page-content-type";

interface SubMenuContentPropType {
    currentTabSubPageData: SubPageContentType
}

const SubMenuContent = styled.div<SubMenuContentPropType>`
  display: inline-block;
  & > p {
    font-family: ${(props) =>
    props.currentTabSubPageData
        ? props.currentTabSubPageData.acf.typography.font_family
        : ""};
    font-size: ${(props) =>
    props.currentTabSubPageData
        ? props.currentTabSubPageData.acf.typography.font_size + "px"
        : ""};
    color: ${(props) =>
    props.currentTabSubPageData
        ? props.currentTabSubPageData.acf.typography.text_color
        : ""};
  }
`;

export default SubMenuContent;
