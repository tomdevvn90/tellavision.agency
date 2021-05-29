export interface TabData {
    id:             number;
    date:           Date;
    date_gmt:       Date;
    guid:           GUID;
    modified:       Date;
    modified_gmt:   Date;
    slug:           string;
    status:         string;
    type:           string;
    link:           string;
    title:          GUID;
    content:        Content;
    excerpt:        Content;
    author:         number;
    featured_media: number;
    comment_status: string;
    ping_status:    string;
    template:       string;
    acf:            Acf;
    _links:         Links;
}

export interface Links {
    self:            About[];
    collection:      About[];
    about:           About[];
    author:          Author[];
    replies:         Author[];
    "wp:attachment": About[];
    curies:          Cury[];
}

export interface About {
    href: string;
}

export interface Author {
    embeddable: boolean;
    href:       string;
}

export interface Cury {
    name:      string;
    href:      string;
    templated: boolean;
}

export interface Acf {
    typography:                        PostAttributeListingTypography;
    background_color:                  string;
    add_slider_data:                   AddSliderDatum[];
    title_css_settings:                PostAttributeListingTypography;
    post_attribute_listing_typography: PostAttributeListingTypography;
    navigation_arrow_color:            NavigationArrowColor;
    featured_image_gallery:            boolean;
}

export interface AddSliderDatum {
    add_attribute_name:        string;
    add_content_for_attribute: AddContentForAttribute[];
}

export interface AddContentForAttribute {
    select_content_type: SelectContentType;
    add_attribute_data:  AddAttributeData;
}

export interface AddAttributeData {
    add_attribute_image:   boolean;
    add_attribute_content: string;
    add_attribute_link:    string;
}

export enum SelectContentType {
    Content = "Content",
}

export interface NavigationArrowColor {
    text_color: TextColor;
}

export enum TextColor {
    Ffffff = "#ffffff",
    The000 = "#000",
}

export interface PostAttributeListingTypography {
    font_size:       string;
    font_family:     FontFamily;
    text_color:      TextColor;
    text_transform?: TextTransform;
}

export enum FontFamily {
    PlayfairDisplaySC = "Playfair Display SC",
}

export enum TextTransform {
    Uppercase = "uppercase",
}

export interface Content {
    rendered:  string;
    protected: boolean;
}

export interface GUID {
    rendered: string;
}
