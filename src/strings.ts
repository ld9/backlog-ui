import LocalizedStrings, { LocalizedStringsMethods } from "react-localization";

export interface IStrings extends LocalizedStringsMethods {
    home_appName: string;
    home_appTitle: string;
    home_login: string;
    home_signup: string;

    nav_movies: string;
    nav_shows: string;
    nav_music: string;
    nav_admin: string;
    nav_settings: string;
    nav_logout: string;
    nav_stage: string;
    nav_stage_create: string;

    dash_title: string;
    dash_listened: string;
    dash_watched: string;

    // movies_title: string;
    movies_cat_movies: string;
    movies_cat_genres: string;
    movies_cat_year: string;
    movies_cat_tags: string;

    movies_popup_watch: string;
    movies_popup_enqueue: string;
    movies_popup_edit: string;
    movies_popup_defaultDescription: string;

    // Shows

    // Music

    // Admin
    admin_title: string;

    // Settings/Preferences

    settings_title: string;

    settings_size_title: string;
    settings_size_desc: string;

    settings_font_title: string;
    settings_font_desc: string;

    settings_theme_title: string;
    settings_theme_desc: string;
    settings_theme_current: string;

    settings_catalog_title: string;
    settings_catalog_desc: string;
    settings_catalog_checkbox: string;
}

export const strings: IStrings = new LocalizedStrings({
    en: {
        home_appName: 'Backlog',
        home_appTitle: 'Personal Media Server',
        home_login: 'Log In',
        home_signup: 'Sign Up',

        nav_movies: 'Movies',
        nav_shows: 'Shows',
        nav_music: 'Music',
        nav_admin: 'Admin',
        nav_settings: 'Preferences',
        nav_logout: 'Change User',
        nav_stage: 'Current Stage',
        nav_stage_create: 'New Stage',

        dash_title: 'Dashboard',
        dash_listened: 'Listen Again',
        dash_watched: 'Continue Watching',

        // movies_title: 'Movies',
        movies_cat_movies: 'Movies',
        movies_cat_genres: 'Genres',
        movies_cat_year: 'Release Year',
        movies_cat_tags: 'Tags',

        movies_popup_watch: 'Watch',
        movies_popup_enqueue: 'Add to Queue',
        movies_popup_edit: 'Edit (Admin)',
        movies_popup_defaultDescription: 'This file does not have a description. Add one in the admin panel.',

        // Shows

        // Music

        // Admin

        admin_title: 'Admin Panel',

        settings_title: 'Settings',

        settings_size_title: 'Adjust Text Side',
        settings_size_desc: 'Change the size of text on the site',

        settings_font_title: 'Adjust Text Font',
        settings_font_desc: 'Change the font in which content on the site is displayed',

        settings_theme_title: 'Set Color Theme',
        settings_theme_desc: 'Preview and select a visual color theme to be used throughout the interface. Themes are open-source (Miodec)',
        settings_theme_current: 'Current Theme Name',

        settings_catalog_title: 'Show Catalog',
        settings_catalog_desc: 'When viewing Movie, TV, and Audio pages, index items which you do not have permission to view or listen to.',
        settings_catalog_checkbox: 'Show Full Catalog'
    }
})