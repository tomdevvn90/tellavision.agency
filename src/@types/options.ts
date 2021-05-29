export interface SiteOptions {
    acf: Acf;
}

export interface Acf {
    add_typography: AddTypography;
    site_logo:      string;
    white_logo:     string;
}

export interface AddTypography {
    font_size:   string;
    font_family: string;
    font_weight: string;
    text_color:  string;
}
