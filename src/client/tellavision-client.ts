import Axios, {AxiosInstance} from "axios";
import {environment} from "../config";
import {SiteOptions} from "../@types/options";
import {AboutMenuContent} from "../@types/about-menu";
import {PrimaryMenu} from "../@types/primary-menu";
import {HomePageContent} from "../@types/home-page";
import {TabData} from "../@types/tab-data";
import {AboutSubPageData} from "../@types/about-sub-page-data";

class TellavisionAPI {
    private readonly client: AxiosInstance;

    constructor() {
        this.client = Axios.create({
            baseURL: environment.apiEndPoint
        });
    };

    public async fetchLogo() {
        return this.client.get('mytheme/v1/settings/');
    }

    public async fetchHomeContent() {
        return this.client.get<HomePageContent>('wp/v2/pages/23/');
    }

    public async fetchFeaturedImageUrl(id: number | string) {
        return this.client.get(`wp/v2/media/${id}`);
    }

    public async fetchPrimaryMenu() {
        return this.client.get<PrimaryMenu>('menus/v1/locations/primary-menu');
    }

    public async fetchAboutUsContent() {
        return this.client.get<AboutMenuContent>('menus/v1/locations/about-menu');
    }

    public async fetchMenuItemStyle() {
        return this.client.get<SiteOptions>('acf/v2/options/');
    }

    public async fetchMenuItemMainPageData(menuTitle: string) {
        return this.client.get<TabData[]>(`wp/v2/${menuTitle}/?per_page=50`);
    }

    public async fetchMenuItemSubPageData(menuTitle: string, subMenuId: string) {
        return this.client.get(`wp/v2/${menuTitle}/${subMenuId}`);
    }

    public async fetchPageContent(pageId: string) {
        return this.client.get<AboutSubPageData>(`wp/v2/pages/${pageId}`);
    }

}

export default new TellavisionAPI();
