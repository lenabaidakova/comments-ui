import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
const ROOT_DIV_ID = 'ghost-comments-root';

function addRootDiv() {
    const scriptTag = document.querySelector('script[data-ghost-comments]');

    if (process.env.NODE_ENV === 'development') {
        const elem = document.createElement('div');
        elem.id = ROOT_DIV_ID;
        document.body.appendChild(elem);
    } else {
        // We need to inject the comment box at the same place as the script tag
        if (scriptTag) {
            const elem = document.createElement('div');
            elem.id = ROOT_DIV_ID;
            scriptTag.parentElement.insertBefore(elem, scriptTag);
        } else {
            // eslint-disable-next-line no-console
            console.warn('Comment box location was not found: could not load comments box.');
        }
    }
}

function getSiteData() {
    /**
     * @type {HTMLElement}
     */
    const scriptTag = document.querySelector('script[data-ghost-comments]');
    if (scriptTag) {
        const siteUrl = scriptTag.dataset.ghost;
        const apiKey = scriptTag.dataset.key;
        const apiUrl = scriptTag.dataset.api;
        const sentryDsn = scriptTag.dataset.sentryDsn;
        return {siteUrl, apiKey, apiUrl, sentryDsn};
    }
    return {};
}

function handleTokenUrl() {
    const url = new URL(window.location.href);
    if (url.searchParams.get('token')) {
        url.searchParams.delete('token');
        window.history.replaceState({}, document.title, url.href);
    }
}

function setup({siteUrl}) {
    addRootDiv();
    handleTokenUrl();
}

function init() {
    // const customSiteUrl = getSiteUrl();
    const {siteUrl: customSiteUrl, sentryDsn} = getSiteData();
    const siteUrl = customSiteUrl || window.location.origin;
    setup({siteUrl});
    ReactDOM.render(
        <React.StrictMode>
            {<App siteUrl={siteUrl} customSiteUrl={customSiteUrl} sentryDsn={sentryDsn}/>}
        </React.StrictMode>,
        document.getElementById(ROOT_DIV_ID)
    );
}

init();