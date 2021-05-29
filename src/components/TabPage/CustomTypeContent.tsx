import {TabData} from "../../@types/tab-data";
import React from "react";
import TabListingItem from "./TabListingItem";

interface CustomTypeContentPropType {
    pageContent: TabData[][];
    OpenSubmenuItem: any;
    tabListingStyle: any;
}

const CustomTypeContent: React.FC<CustomTypeContentPropType> = ({ pageContent, OpenSubmenuItem, tabListingStyle }) => {
    return (
        <div
            className="menu-item-main-content"
            style={{
                display: pageContent ? "flex" : "none"
            }}
        >
            {
                pageContent.length > 0 && pageContent.map((formatedData, index) => (
                    <table key={index} style={{ display: "inline-block", textAlign: "left", verticalAlign: "top", padding: "0 10px" }}>
                        <tbody>
                        {formatedData.length > 0 && formatedData.map((data, index) => (
                            <tr key={index}>
                                <td style={{ padding: "0 20px" }} key={index}>
                                    <TabListingItem
                                        tabListingStyle={tabListingStyle}
                                        href="#"
                                        id={"listing_" + data.id}
                                        onClick={(event) => OpenSubmenuItem(event, data.id)}
                                    >
                                        {data.title.rendered}
                                    </TabListingItem>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ))
            }
        </div>)
};

export default CustomTypeContent;
