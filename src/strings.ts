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

    admin_collections_title: string;
    admin_collections_desc: string;
    admin_collections_new: string;
    admin_collections_thumb_members: string;
    admin_collections_thumb_content: string;

    admin_collections_edit_title: string;
    admin_collections_edit_contents: string;
    admin_collections_edit_noContent: string;
    admin_collections_edit_members: string;
    admin_collections_edit_noMembers: string;
    admin_collections_edit_cancel: string;
    admin_collections_edit_commit: string;

    admin_collections_media_title: string;
    admin_collections_media_contents: string;
    admin_collections_media_catalog: string;
    admin_collections_media_done: string;

    admin_collections_user_title: string;
    admin_collections_user_approved: string;
    admin_collections_user_directory: string;
    admin_collections_user_done: string;

    admin_add_title: string;
    admin_add_desc: string;
    admin_add_dropzone: string;
    admin_add_fileRequired: string;

    admin_add_type_title: string;
    admin_add_type_movie: string;
    admin_add_type_series: string;
    admin_add_type_audio: string;
    
    admin_add_media_title: string;
    admin_add_media_release: string;
    admin_add_media_genre: string;
    admin_add_media_banner: string;
    admin_add_media_tags: string;
    admin_add_media_users: string;
    admin_add_media_group: string;

    admin_add_create: string;

    admin_add_single_title: string;
    admin_add_single_desc: string;

    admin_users_title: string;
    admin_users_desc: string;

    admin_users_edit_title: string;
    admin_users_edit_meta_title: string;
    admin_users_edit_meta_admin: string;
    admin_users_edit_meta_paid: string;
    admin_users_edit_meta_email: string;

    admin_users_edit_media_title: string;
    admin_users_edit_media_type: string;
    admin_users_edit_media_id: string;
    admin_users_edit_media_contentTitle: string;
    admin_users_edit_media_revoke: string;

    admin_users_edit_done: string;

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

    // stage 
    stage_global_title: string;
    stage_global_createRoom: string;
    stage_global_play: string;
    stage_global_pause: string;
    stage_global_jump: string;

    stage_audience_title: string;
    stage_queue_title: string;

    // signup
    signup_email: string;
    signup_fname: string;
    signup_lname: string;
    signup_pass: string;
    signup_passConfirm: string;
    signup_processing: string;
    signup_success: string;

    //pass reset
    reset_desired: string;
    reset_confirm: string;
    reset_complete: string;
    reset_return: string;

    requestReset_email: string;
    requestReset_confirm: string;

    // login
    login_email: string;
    login_pass: string;
    login_passWrong: string;
    login_reset: string;
    login_failed: string;
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

        admin_collections_title: 'Collection Management',
        admin_collections_desc: 'Create or update video collections',
        admin_collections_new: 'Create New Collection',
        admin_collections_thumb_members: 'Members',
        admin_collections_thumb_content: 'Content Items',

        admin_collections_edit_title: 'Editing',
        admin_collections_edit_contents: 'Contents',
        admin_collections_edit_noContent: 'None - Add something!',
        admin_collections_edit_members: 'Members',
        admin_collections_edit_noMembers: 'None - Add someone!',
        admin_collections_edit_cancel: 'Cancel',
        admin_collections_edit_commit: 'Commit Changes',

        admin_collections_media_title: 'Media Lookup',
        admin_collections_media_contents: 'Current Contents',
        admin_collections_media_catalog: 'Full Server Catalog',
        admin_collections_media_done: 'Done',

        admin_collections_user_title: 'User Lookup',
        admin_collections_user_approved: 'Approved Users',
        admin_collections_user_directory: 'User Directory',
        admin_collections_user_done: 'Done',

        admin_add_title: 'Add or Upload Content',
        admin_add_desc: 'Allow users to access new content by adding it here.',
        admin_add_dropzone: 'Drop a file or click here to upload',
        admin_add_fileRequired: 'Please add at least one file to begin.',
    
        admin_add_type_title: 'Media Type',
        admin_add_type_movie: 'Video (Movie)',
        admin_add_type_series: 'Video (Series)',
        admin_add_type_audio: 'Audio',
        
        admin_add_media_title: 'Media Title',
        admin_add_media_release: 'Release Year',
        admin_add_media_genre: 'Genre',
        admin_add_media_banner: 'Banner URL',
        admin_add_media_tags: 'Tags (split with ;)',
        admin_add_media_users: 'Grant user permission (split with ;)',
        admin_add_media_group: 'Grant group permission (split with ;)',
    
        admin_add_create: 'Create Media Entry',
    
        admin_add_single_title: 'Single File Addition',
        admin_add_single_desc: 'Add additional files to create a series.',

        admin_users_title: '',
        admin_users_desc: '',

        admin_users_edit_title: 'Edit User',

        admin_users_edit_meta_title: 'Meta Permissions',
        admin_users_edit_meta_admin: 'Admin',
        admin_users_edit_meta_paid: 'Paid User',
        admin_users_edit_meta_email: 'Email Verified',

        admin_users_edit_media_title: 'Media Permissions',
        admin_users_edit_media_type: 'Type',
        admin_users_edit_media_id: 'ID',
        admin_users_edit_media_contentTitle: 'Title',
        admin_users_edit_media_revoke: 'Revoke',

        admin_users_edit_done: 'Done Editing',

        // Preferences

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
        settings_catalog_checkbox: 'Show Full Catalog',

        // Stage stuff

        stage_global_title: 'Global Controls',
        stage_global_createRoom: 'Create Joinable Room',
        stage_global_play: 'Play All',
        stage_global_pause: 'Pause All',
        stage_global_jump: 'Jump to Me',

        stage_audience_title: 'Stage Audience',
        stage_queue_title: 'Playback Queue',

        //signup

        signup_email: 'E-Mail Address',
        signup_fname: 'First Name',
        signup_lname: 'Last Name',
        signup_pass: 'Password',
        signup_passConfirm: 'Confirm Password',
        signup_processing: 'Your account is currently being created. Please do not refresh the page.',
        signup_success: 'Success! Your account has been created. Please check your email for a confirmation message. You will now be logged in.',


        // reset

        reset_desired: 'Desired Password',
        reset_confirm: 'Confirm Desired Password',
        reset_complete: 'Your request has been processed. Please log in with your new password. If you used an invalid link, you will be directed to attempt to reset again.',
        reset_return: 'Return to Login',

        requestReset_email: 'E-Mail Address',
        requestReset_confirm: 'Your request has been processed by the server. if an account with this email address exists, a link will be sent to it with instructions to reset your password. Thank you!',

        // login

        login_email: 'E-Mail Address',
        login_pass: 'Password',
        login_passWrong: 'Incorrect Email or Password',
        login_reset: 'Request Password Reset',
        login_failed: 'Failures Logged',

    }
})