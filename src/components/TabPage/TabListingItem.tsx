import styled from "styled-components";

interface TabListingItemPropTypes {
    tabListingStyle: {
        font_family: string;
        font_size: number | string;
        text_color: string;
        font_weight: string | number;
    }
}

const TabListingItem = styled('a')<TabListingItemPropTypes>`
  font-family: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_family : ""};
  font-size: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_size + "px" : ""};
  color: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.text_color : ""};
  font-weight: ${(props) =>
    props.tabListingStyle ? props.tabListingStyle.font_weight : ""};
  text-decoration: none;
  text-transform: uppercase;
 
  &:hover {
    color: ${(props) =>
    props.tabListingStyle && (props.tabListingStyle.text_color == "#000000" || props.tabListingStyle.text_color == "#000")
        ? "#fff"
        : "#000"};
  }
`;

export default TabListingItem;
