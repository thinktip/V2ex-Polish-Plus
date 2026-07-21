// ==UserScript==
// @name         V2EX Polish Lite
// @namespace    https://v2ex.com/
// @version      0.7.2
// @description  Minimal one-file V2EX light/dark theme switcher.
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @run-at       document-start
// @icon         https://v2ex.com/static/apple-touch-icon-180.png
// @grant        none
// ==/UserScript==

(function () {
  "use strict";

  const STORAGE_KEY = "v2p_lite_theme_mode";
  const LEGACY_STORAGE_KEY = "user_preferred_theme_mode";
  const STYLE_ID = "v2p-lite-theme-style";
  const PREPAINT_STYLE_ID = "v2p-lite-prepaint-style";
  const THEME_META_ID = "v2p-lite-theme-color";
  const TOGGLE_ID = "v2p-lite-theme-toggle";
  const NAV_STORAGE_KEY = "v2p_nav_config";
  const LAST_TAB_STORAGE_KEY = "v2p_last_tab_id";
  const MODES = ["light", "dark", "auto"];
  const THEME_META_COLORS = {
    light: "#f2f3f5",
    dark: "#1c2128",
  };
  const LABELS = {
    light: "浅色",
    dark: "深色",
    auto: "自动",
  };
  const ICONS = {
    light:
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>',
    dark:
      '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>',
    auto: '<span aria-hidden="true" style="font-size:12px;font-weight:600;line-height:1;">A</span>',
  };
  const IMGUR_CLIENT_IDS = [
    "3107b9ef8b316f3",
    "442b04f26eefc8a",
    "59cfebe717c09e4",
    "60605aad4a62882",
    "6c65ab1d3f5452a",
    "83e123737849aa9",
    "9311f6be1c10160",
    "c4a4a563f698595",
    "81be04b9e4a08ce",
  ];
  const UPLOAD_TIP = "选择、粘贴、拖放上传图片。";
  const DEFAULT_NAV = [
    { name: "技术", href: "/?tab=tech", visible: true },
    { name: "创意", href: "/?tab=creative", visible: true },
    { name: "好玩", href: "/?tab=play", visible: true },
    { name: "Apple", href: "/?tab=apple", visible: true },
    { name: "酷工作", href: "/?tab=jobs", visible: true },
    { name: "交易", href: "/?tab=deals", visible: true },
    { name: "城市", href: "/?tab=city", visible: true },
    { name: "问与答", href: "/?tab=qna", visible: true },
    { name: "最热", href: "/?tab=hot", visible: true },
    { name: "全部", href: "/?tab=all", visible: true },
    { name: "R2", href: "/?tab=r2", visible: true },
    { name: "VXNA", href: "/xna", visible: true },
    { name: "节点", href: "/?tab=nodes", visible: true },
    { name: "Planet", href: "/planet", visible: true },
  ];
  const TAB_ICONS = {
    技术: '<polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />',
    创意: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" />',
    好玩: '<line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><line x1="15" x2="15.01" y1="13" y2="13" /><line x1="18" x2="18.01" y1="11" y2="11" /><rect width="20" height="12" x="2" y="6" rx="2" />',
    Apple:
      '<svg width="14" height="14" viewBox="-1.5 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden="true"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-102.000000, -7439.000000)" fill="currentColor"><g transform="translate(56.000000, 160.000000)"><path d="M57.5708873,7282.19296 C58.2999598,7281.34797 58.7914012,7280.17098 58.6569121,7279 C57.6062792,7279.04 56.3352055,7279.67099 55.5818643,7280.51498 C54.905374,7281.26397 54.3148354,7282.46095 54.4735932,7283.60894 C55.6455696,7283.69593 56.8418148,7283.03894 57.5708873,7282.19296 M60.1989864,7289.62485 C60.2283111,7292.65181 62.9696641,7293.65879 63,7293.67179 C62.9777537,7293.74279 62.562152,7295.10677 61.5560117,7296.51675 C60.6853718,7297.73474 59.7823735,7298.94772 58.3596204,7298.97372 C56.9621472,7298.99872 56.5121648,7298.17973 54.9134635,7298.17973 C53.3157735,7298.17973 52.8162425,7298.94772 51.4935978,7298.99872 C50.1203933,7299.04772 49.0738052,7297.68074 48.197098,7296.46676 C46.4032359,7293.98379 45.0330649,7289.44985 46.8734421,7286.3899 C47.7875635,7284.87092 49.4206455,7283.90793 51.1942837,7283.88393 C52.5422083,7283.85893 53.8153044,7284.75292 54.6394294,7284.75292 C55.4635543,7284.75292 57.0106846,7283.67793 58.6366882,7283.83593 C59.3172232,7283.86293 61.2283842,7284.09893 62.4549652,7285.8199 C62.355868,7285.8789 60.1747177,7287.09489 60.1989864,7289.62485"></path></g></g></g></svg>',
    酷工作: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />',
    交易: '<path d="m21 16-2 6H5l-2-6" /><path d="M3 6v10c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6" /><path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />',
    城市: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />',
    问与答: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />',
    最热: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.1.243-2.143.5-3.5a6 6 0 0 1 1.5-2.5c-.002 1.25.502 2.5 1.5 3.5.5.5 1 1.5 1 3a2 2 0 0 1-2 2z" />',
    全部: '<rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />',
    R2: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" x2="12" y1="22.08" y2="12" />',
    VXNA: '<path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="19" r="1" />',
    节点: '<line x1="4" x2="20" y1="9" y2="9" /><line x1="4" x2="20" y1="15" y2="15" /><line x1="10" x2="8" y1="3" y2="21" /><line x1="16" x2="14" y1="3" y2="21" />',
    关注: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />',
    Planet: '<circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><line x1="2" x2="22" y1="12" y2="12"/>',
  };
  const PREPAINT_STYLE = `
html.v2p-lite-prepaint,
html.v2p-lite-prepaint body {
  min-height: 100vh !important;
}
html.v2p-lite-prepaint.v2p-theme-light-default,
html.v2p-lite-prepaint.v2p-theme-light-default body,
html.v2p-lite-prepaint.v2p-theme-light-default #Top,
html.v2p-lite-prepaint.v2p-theme-light-default #Wrapper {
  background-color: #f2f3f5 !important;
  background-image: none !important;
  color-scheme: light !important;
}
html.v2p-lite-prepaint.v2p-theme-dark-default,
html.v2p-lite-prepaint.v2p-theme-dark-default body,
html.v2p-lite-prepaint.v2p-theme-dark-default #Top,
html.v2p-lite-prepaint.v2p-theme-dark-default #Wrapper {
  background-color: #1c2128 !important;
  background-image: none !important;
  color-scheme: dark !important;
}
html.v2p-lite-prepaint #Logo,
html.v2p-lite-prepaint #LogoMobile {
  transition: none !important;
}
`;
  const docEl = document.documentElement;
  let currentMode = readMode();
  let effectiveMode = resolveMode(currentMode);

  applyDocumentPrepaint(effectiveMode);
  injectStyle(PREPAINT_STYLE_ID, PREPAINT_STYLE);

  const THEME_STYLE = `
:root {
--zidx-serach: 100;
    --zidx-expand-btn: 20;
    --zidx-tabs: 10;
    --zidx-tools-card: 10;
    --zidx-reply-box: 99;
    --v2p-tp-nested-pd: 10px 5px 2px 10px;
    --v2p-underline-offset: 0.5ex;
    --v2p-layout-column-gap: 25px;
    --v2p-layout-row-gap: 20px;
    --v2p-nav-height: 55px;
    --v2p-box-radius: 10px;
}

html.v2p-theme-dark-default body #search-container {
background-color: #2d333b !important;
    border-color: #444c56 !important;
    transition: background-color 0.1s ease;
}

html.v2p-theme-dark-default body #search-container #search-result {
background-color: #22272e !important;
    border-color: #444c56 !important;
}

:root body {
--v2p-color-main-50: #f7f9fb;
    --v2p-color-main-100: #e6e6e6;
    --v2p-color-main-200: #ececec;
    --v2p-color-main-300: #cbd5e1;
    --v2p-color-main-350: #94a3b8cc;
    --v2p-color-main-400: #94a3b8;
    --v2p-color-main-500: #64748b;
    --v2p-color-main-600: #475569;
    --v2p-color-main-700: #334155;
    --v2p-color-main-800: #1e293b;
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: #d1fae5;
    --v2p-color-accent-200: #a7f3d0;
    --v2p-color-accent-300: #6ee7b7;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #10b981;
    --v2p-color-accent-600: #059669;
    --v2p-color-orange-50: #fff7ed;
    --v2p-color-orange-100: #ffedd5;
    --v2p-color-orange-400: #fb923c;
    --v2p-color-background: #f2f3f5;
    --v2p-color-foreground: var(--v2p-color-main-800);
    --v2p-color-selection-foreground: var(--v2p-color-main-100);
    --v2p-color-selection-background: var(--v2p-color-main-700);
    --v2p-color-selection-background-img: var(--v2p-color-main-500);
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-font-tertiary: var(--v2p-color-main-500);
    --v2p-color-font-quaternary: var(--v2p-color-main-400);
    --v2p-color-button-background: var(--v2p-color-main-100);
    --v2p-color-button-foreground: var(--v2p-color-main-500);
    --v2p-color-button-background-hover: var(--v2p-color-main-200);
    --v2p-color-button-foreground-hover: var(--v2p-color-main-600);
    --v2p-color-bg-content: #fff;
    --v2p-color-bg-content-rgb: 255, 255, 255;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);
    --v2p-color-bg-subtle: #f7f7f7;
    --v2p-color-bg-input: var(--v2p-color-main-50);
    --v2p-color-bg-search: var(--v2p-color-main-100);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: var(--v2p-color-main-100);
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: var(--v2p-color-main-100);
    --v2p-color-bg-block-darker: var(--v2p-color-main-300);
    --v2p-color-bg-link: var(--v2p-color-main-100);
    --v2p-color-bg-link-hover: var(--v2p-color-main-200);
    --v2p-color-tabs: var(--v2p-color-foreground);
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fee2e2;
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: var(--v2p-color-main-200);
    --v2p-color-border: var(--v2p-color-main-200);
    --v2p-color-input-border: var(--v2p-color-main-300);
    --v2p-color-border-darker: var(--v2p-color-main-300);
    --v2p-color-link-visited: var(--v2p-color-main-400);
    --v2p-color-error: #ef4444;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: var(--v2p-color-main-350);
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --color-fade: var(--v2p-color-font-secondary);
    --color-gray: var(--v2p-color-font-secondary);
    --link-color: var(--v2p-color-foreground);
    --link-darker-color: var(--v2p-color-main-600);
    --link-hover-color: var(--v2p-color-foreground);
    --link-caution-color: var(--v2p-color-orange-400);
    --box-border-color: var(--v2p-color-border);
    --box-foreground-color: var(--v2p-color-foreground);
    --box-background-color: var(--v2p-color-bg-content);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-200);
    --box-border-focus-color: var(--v2p-color-main-200);
    --box-border-radius: var(--v2p-box-radius);
    --button-background-color: var(--v2p-color-button-background);
    --button-foreground-color: var(--v2p-color-button-foreground);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-background-hover-color: var(--v2p-color-button-background-hover);
    --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);
    --button-border-color: var(--v2p-color-main-300);
    --button-border-hover-color: var(--v2p-color-main-400);

    font-family: system-ui, sans-serif;
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-background);
}

:root body.v2p-theme-light-default,
:root body .v2p-theme-light-default {
--v2p-color-main-50: #f7f9fb;
    --v2p-color-main-100: #f2f2f2;
    --v2p-color-main-200: #ececec;
    --v2p-color-main-300: #cbd5e1;
    --v2p-color-main-350: #94a3b8cc;
    --v2p-color-main-400: #94a3b8;
    --v2p-color-main-500: #64748b;
    --v2p-color-main-600: #475569;
    --v2p-color-main-700: #334155;
    --v2p-color-main-800: #1e293b;
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: #d1fae5;
    --v2p-color-accent-200: #a7f3d0;
    --v2p-color-accent-300: #6ee7b7;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #10b981;
    --v2p-color-accent-600: #059669;
    --v2p-color-orange-50: #fff7ed;
    --v2p-color-orange-100: #ffedd5;
    --v2p-color-orange-400: #fb923c;
    --v2p-color-background: #f2f3f5;
    --v2p-color-foreground: var(--v2p-color-main-700);
    --v2p-color-selection-foreground: var(--v2p-color-main-100);
    --v2p-color-selection-background: var(--v2p-color-main-700);
    --v2p-color-selection-background-img: var(--v2p-color-main-500);
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-font-tertiary: var(--v2p-color-main-500);
    --v2p-color-font-quaternary: var(--v2p-color-main-400);
    --v2p-color-button-background: var(--v2p-color-main-100);
    --v2p-color-button-foreground: var(--v2p-color-main-500);
    --v2p-color-button-background-hover: var(--v2p-color-main-200);
    --v2p-color-button-foreground-hover: var(--v2p-color-main-600);
    --v2p-color-bg-content: #fff;
    --v2p-color-bg-content-rgb: 255, 255, 255;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);
    --v2p-color-bg-subtle: #f7f7f7;
    --v2p-color-bg-input: var(--v2p-color-main-50);
    --v2p-color-bg-search: var(--v2p-color-main-50);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: var(--v2p-color-main-50);
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: var(--v2p-color-main-100);
    --v2p-color-bg-block-darker: var(--v2p-color-main-300);
    --v2p-color-bg-link: var(--v2p-color-main-100);
    --v2p-color-bg-link-hover: var(--v2p-color-main-200);
    --v2p-color-tabs: var(--v2p-color-foreground);
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fee2e2;
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: var(--v2p-color-main-200);
    --v2p-color-border: var(--v2p-color-main-200);
    --v2p-color-input-border: var(--v2p-color-main-300);
    --v2p-color-border-darker: var(--v2p-color-main-300);
    --v2p-color-link-visited: var(--v2p-color-main-400);
    --v2p-color-error: #ef4444;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: var(--v2p-color-main-350);
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --color-fade: var(--v2p-color-font-secondary);
    --color-gray: var(--v2p-color-font-secondary);
    --link-color: var(--v2p-color-foreground);
    --link-darker-color: var(--v2p-color-main-600);
    --link-visited-color:var(--v2p-color-foreground);
    --link-hover-color: var(--v2p-color-foreground);
    --link-caution-color: var(--v2p-color-orange-400);
    --box-border-color: var(--v2p-color-border);
    --box-foreground-color: var(--v2p-color-foreground);
    --box-background-color: var(--v2p-color-bg-content);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-200);
    --box-border-focus-color: var(--v2p-color-main-200);
    --box-border-radius: var(--v2p-box-radius);
    --button-background-color: var(--v2p-color-button-background);
    --button-foreground-color: var(--v2p-color-button-foreground);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-background-hover-color: var(--v2p-color-button-background-hover);
    --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);
    --button-border-color: var(--v2p-color-main-300);
    --button-border-hover-color: var(--v2p-color-main-400);
}

:root body #Logo {
background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idjJleF9sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQxNSAxMTciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxNDIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiAjM2UzYTM5OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBjbGFzcz0ic3QwIj4KICAgIDxnIGNsYXNzPSJzdDAiPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTc1LjIsMjkuOWMyLjItOC4xLDUuNS0xMS40LDExLjctMTEuNHMxMS4yLDQsMTEuMiwxMC4xLS43LDUuNy0xLjcsOWwtMTQuNiw0NS42Yy0zLjcsMTEuNi05LjYsMTYuNS0xOS45LDE2LjVzLTE2LjUtNC45LTIwLjEtMTYuNWwtMTQuNi00NS42Yy0xLjEtMy41LTEuOC02LjYtMS44LTguOCwwLTYuMSw0LjctMTAuMywxMS4zLTEwLjNzOS44LDMuNiwxMiwxMS40bDEyLjksNDUuMmgxLjFsMTIuNC00NS4yaC4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE1LjQsNzUuOGwxOC42LTE4YzYuMi01LjksOC44LTkuOCw4LjgtMTMuOHMtMy41LTcuOS04LjUtNy45LTYuNywxLjctOS43LDUuOWMtMy4zLDQuMy01LjcsNS45LTkuNiw1LjlzLTkuMS0zLjYtOS4xLTguNmMwLTExLjIsMTMuNC0yMS40LDI5LjYtMjEuNHMyOS4yLDEwLjEsMjkuMiwyMy44LTQuNCwxNi41LTEzLjgsMjUuMWwtMTQuNiwxMy42di45aDIxYzYuNCwwLDEwLjQsMy41LDEwLjQsOS4xcy0zLjksOC45LTEwLjQsOC45aC00MC43Yy02LjIsMC0xMC40LTMuOC0xMC40LTkuM3MyLjMtNy43LDkuMi0xNC4yWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjc3LDMxLjJjMC03LjYsNC41LTEyLjEsMTItMTIuMWgzNy4yYzUsMCw4LjYsMy44LDguNiw5cy0zLjYsOC45LTguNiw4LjloLTI2LjN2MTMuOWgyNS4yYzQuNiwwLDcuNywzLjMsNy43LDguMnMtMy4xLDguMS03LjcsOC4xaC0yNS4ydjEzLjloMjZjNS4zLDAsOC45LDMuNiw4LjksOXMtMy42LDktOSw5aC0zNi44Yy03LjUsMC0xMi00LjUtMTItMTIuMVYzMS4zaDBaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDMuMiw4MS45bDE3LjgtMjMuMS0xOC4xLTIyLjZjLTItMi40LTMtNC45LTMtNy40LDAtNS45LDQuNy0xMC4zLDEwLjgtMTAuM3M2LjQsMS41LDExLjUsOC40bDEzLjIsMThoMWwxMi0xOGM0LjMtNi40LDYuOS04LjQsMTEuNC04LjRzMTAuOCw0LjUsMTAuOCwxMC4zLTEsNC45LTMsNy40bC0xOC4zLDIzLDE4LjgsMjIuNmMxLjksMi4zLDMsNC45LDMsNy40LDAsNS44LTQuNywxMC4zLTEwLjgsMTAuM3MtNi0xLjMtMTEuNS04LjRsLTEzLjEtMTdoLTFsLTEyLjEsMTdjLTQuOSw2LjctNy4xLDguNC0xMS41LDguNHMtMTAuNy00LjUtMTAuNy0xMC4zLDEuMS00LjksMy03LjRoLS4yWiIvPgogICAgPC9nPgogIDwvZz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuOSwxOS4ySDMuM2MtMS45LDAtMy4zLDEuNS0zLjMsMy40djIzLjFoNDcuNGMxLDAsMS45LjQsMi42LDEuMWwxMSwxMS41Yy4yLjMuMi43LDAsLjlsLTExLDExLjZjLS43LjctMS40LDEuMy0yLjQsMS4zSDB2MjMuMWMwLDEuOCwxLjUsMy4zLDMuMywzLjNoNTAuNWMxLjEsMCwyLjItLjQsMy0xLjJsMzQuMS0zMy44YzIuNi0yLjYsMi42LTYuOCwwLTkuNXEtMS43LTEuOCwwLDBMNTYuOCwyMC40Yy0uOC0uOC0xLjgtMS4yLTIuOS0xLjJoMFoiLz4KPC9zdmc+") !important;
    width:130px !important;
    background-size: 130px 30px !important;
}

:root body::selection {
color: var(--v2p-color-selection-foreground);
    background-color: var(--v2p-color-selection-background);
}

:root body img::selection {
background-color: var(--v2p-color-selection-background-img);
}

:root {
color-scheme: light;
}

:root html,
:root body {
min-height: 100vh;
}

body {
scrollbar-gutter: stable;
    overflow: overlay;
}

body h1 {
font-weight: bold;
}

body a {
cursor: default;
    text-decoration: none;
}

body a[href] {
cursor: pointer;
}

body a:hover {
text-decoration: underline 1px;
    text-underline-offset: var(--v2p-underline-offset);
}

body pre {
max-width: calc(830px - 2 * var(--v2p-layout-column-gap) - 24px);
}

body #Top {
height: var(--v2p-nav-height);
    background-color: var(--v2p-color-bg-content);
    border: none;
}

body #Bottom {
color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-footer);
    border: none;
}

body #Bottom .content {
flex-direction: column;
}

body #Wrapper {
background-color: inherit;
    background-image: none;
}

body #Wrapper.Night {
background-color: inherit;
    background-image: none;
}

body #Wrapper .content {
gap: var(--v2p-layout-column-gap);
}

:root body #Logo,
#LogoMobile {
background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idjJleF9sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQxNSAxMTciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxNDIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiAjM2UzYTM5OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBjbGFzcz0ic3QwIj4KICAgIDxnIGNsYXNzPSJzdDAiPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTc1LjIsMjkuOWMyLjItOC4xLDUuNS0xMS40LDExLjctMTEuNHMxMS4yLDQsMTEuMiwxMC4xLS43LDUuNy0xLjcsOWwtMTQuNiw0NS42Yy0zLjcsMTEuNi05LjYsMTYuNS0xOS45LDE2LjVzLTE2LjUtNC45LTIwLjEtMTYuNWwtMTQuNi00NS42Yy0xLjEtMy41LTEuOC02LjYtMS44LTguOCwwLTYuMSw0LjctMTAuMywxMS4zLTEwLjNzOS44LDMuNiwxMiwxMS40bDEyLjksNDUuMmgxLjFsMTIuNC00NS4yaC4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE1LjQsNzUuOGwxOC42LTE4YzYuMi01LjksOC44LTkuOCw4LjgtMTMuOHMtMy41LTcuOS04LjUtNy45LTYuNywxLjctOS43LDUuOWMtMy4zLDQuMy01LjcsNS45LTkuNiw1LjlzLTkuMS0zLjYtOS4xLTguNmMwLTExLjIsMTMuNC0yMS40LDI5LjYtMjEuNHMyOS4yLDEwLjEsMjkuMiwyMy44LTQuNCwxNi41LTEzLjgsMjUuMWwtMTQuNiwxMy42di45aDIxYzYuNCwwLDEwLjQsMy41LDEwLjQsOS4xcy0zLjksOC45LTEwLjQsOC45aC00MC43Yy02LjIsMC0xMC40LTMuOC0xMC40LTkuM3MyLjMtNy43LDkuMi0xNC4yWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjc3LDMxLjJjMC03LjYsNC41LTEyLjEsMTItMTIuMWgzNy4yYzUsMCw4LjYsMy44LDguNiw5cy0zLjYsOC45LTguNiw4LjloLTI2LjN2MTMuOWgyNS4yYzQuNiwwLDcuNywzLjMsNy43LDguMnMtMy4xLDguMS03LjcsOC4xaC0yNS4ydjEzLjloMjZjNS4zLDAsOC45LDMuNiw4LjksOXMtMy42LDktOSw5aC0zNi44Yy03LjUsMC0xMi00LjUtMTItMTIuMVYzMS4zaDBaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDMuMiw4MS45bDE3LjgtMjMuMS0xOC4xLTIyLjZjLTItMi40LTMtNC45LTMtNy40LDAtNS45LDQuNy0xMC4zLDEwLjgtMTAuM3M2LjQsMS41LDExLjUsOC40bDEzLjIsMThoMWwxMi0xOGM0LjMtNi40LDYuOS04LjQsMTEuNC04LjRzMTAuOCw0LjUsMTAuOCwxMC4zLTEsNC45LTMsNy40bC0xOC4zLDIzLDE4LjgsMjIuNmMxLjksMi4zLDMsNC45LDMsNy40LDAsNS44LTQuNywxMC4zLTEwLjgsMTAuM3MtNi0xLjMtMTEuNS04LjRsLTEzLjEtMTdoLTFsLTEyLjEsMTdjLTQuOSw2LjctNy4xLDguNC0xMS41LDguNHMtMTAuNy00LjUtMTAuNy0xMC4zLDEuMS00LjksMy03LjRoLS4yWiIvPgogICAgPC9nPgogIDwvZz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuOSwxOS4ySDMuM2MtMS45LDAtMy4zLDEuNS0zLjMsMy40djIzLjFoNDcuNGMxLDAsMS45LjQsMi42LDEuMWwxMSwxMS41Yy4yLjMuMi43LDAsLjlsLTExLDExLjZjLS43LjctMS40LDEuMy0yLjQsMS4zSDB2MjMuMWMwLDEuOCwxLjUsMy4zLDMuMywzLjNoNTAuNWMxLjEsMCwyLjItLjQsMy0xLjJsMzQuMS0zMy44YzIuNi0yLjYsMi42LTYuOCwwLTkuNXEtMS43LTEuOCwwLDBMNTYuOCwyMC40Yy0uOC0uOC0xLjgtMS4yLTIuOS0xLjJoMFoiLz4KPC9zdmc+") !important;
width: 130px !important;
background-size: 130px 30px !important;
}

#LogoMobile {
background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idjJleF9sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQxNSAxMTciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxNDIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiAjM2UzYTM5OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBjbGFzcz0ic3QwIj4KICAgIDxnIGNsYXNzPSJzdDAiPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTc1LjIsMjkuOWMyLjItOC4xLDUuNS0xMS40LDExLjctMTEuNHMxMS4yLDQsMTEuMiwxMC4xLS43LDUuNy0xLjcsOWwtMTQuNiw0NS42Yy0zLjcsMTEuNi05LjYsMTYuNS0xOS45LDE2LjVzLTE2LjUtNC45LTIwLjEtMTYuNWwtMTQuNi00NS42Yy0xLjEtMy41LTEuOC02LjYtMS44LTguOCwwLTYuMSw0LjctMTAuMywxMS4zLTEwLjNzOS44LDMuNiwxMiwxMS40bDEyLjksNDUuMmgxLjFsMTIuNC00NS4yaC4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE1LjQsNzUuOGwxOC42LTE4YzYuMi01LjksOC44LTkuOCw4LjgtMTMuOHMtMy41LTcuOS04LjUtNy45LTYuNywxLjctOS43LDUuOWMtMy4zLDQuMy01LjcsNS45LTkuNiw1LjlzLTkuMS0zLjYtOS4xLTguNmMwLTExLjIsMTMuNC0yMS40LDI5LjYtMjEuNHMyOS4yLDEwLjEsMjkuMiwyMy44LTQuNCwxNi41LTEzLjgsMjUuMWwtMTQuNiwxMy42di45aDIxYzYuNCwwLDEwLjQsMy41LDEwLjQsOS4xcy0zLjksOC45LTEwLjQsOC45aC00MC43Yy02LjIsMC0xMC40LTMuOC0xMC40LTkuM3MyLjMtNy43LDkuMi0xNC4yWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjc3LDMxLjJjMC03LjYsNC41LTEyLjEsMTItMTIuMWgzNy4yYzUsMCw4LjYsMy44LDguNiw5cy0zLjYsOC45LTguNiw4LjloLTI2LjN2MTMuOWgyNS4yYzQuNiwwLDcuNywzLjMsNy43LDguMnMtMy4xLDguMS03LjcsOC4xaC0yNS4ydjEzLjloMjZjNS4zLDAsOC45LDMuNiw4LjksOXMtMy42LDktOSw5aC0zNi44Yy03LjUsMC0xMi00LjUtMTItMTIuMVYzMS4zaDBaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDMuMiw4MS45bDE3LjgtMjMuMS0xOC4xLTIyLjZjLTItMi40LTMtNC45LTMtNy40LDAtNS45LDQuNy0xMC4zLDEwLjgtMTAuM3M2LjQsMS41LDExLjUsOC40bDEzLjIsMThoMWwxMi0xOGM0LjMtNi40LDYuOS04LjQsMTEuNC04LjRzMTAuOCw0LjUsMTAuOCwxMC4zLTEsNC45LTMsNy40bC0xOC4zLDIzLDE4LjgsMjIuNmMxLjksMi4zLDMsNC45LDMsNy40LDAsNS44LTQuNywxMC4zLTEwLjgsMTAuM3MtNi0xLjMtMTEuNS04LjRsLTEzLjEtMTdoLTFsLTEyLjEsMTdjLTQuOSw2LjctNy4xLDguNC0xMS41LDguNHMtMTAuNy00LjUtMTAuNy0xMC4zLDEuMS00LjksMy03LjRoLS4yWiIvPgogICAgPC9nPgogIDwvZz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuOSwxOS4ySDMuM2MtMS45LDAtMy4zLDEuNS0zLjMsMy40djIzLjFoNDcuNGMxLDAsMS45LjQsMi42LDEuMWwxMSwxMS41Yy4yLjMuMi43LDAsLjlsLTExLDExLjZjLS43LjctMS40LDEuMy0yLjQsMS4zSDB2MjMuMWMwLDEuOCwxLjUsMy4zLDMuMywzLjNoNTAuNWMxLjEsMCwyLjItLjQsMy0xLjJsMzQuMS0zMy44YzIuNi0yLjYsMi42LTYuOCwwLTkuNXEtMS43LTEuOCwwLDBMNTYuOCwyMC40Yy0uOC0uOC0xLjgtMS4yLTIuOS0xLjJoMFoiLz4KPC9zdmc+");
}

html.Night #Logo {
filter: invert(1) brightness(0.9) contrast(0.9);
}

body #Top,
body #Bottom {
background-color: var(--v2p-color-background) !important;
margin-top: 15px !important;
}

#Main #SecondaryTabs {
padding: 5px 20px;
background-color: var(--v2p-color-bg-tabs);
border-radius: 99px;
box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

.sep20 {
height: 10px !important;
}

.message, .section {
margin-top: 10px;
}

.box {
padding: 10px;
border-radius: 18px !important;
}

#reply-box {
margin-top: 10px !important;
margin-bottom: 10px !important;
}

#no-comments-yet {
margin-bottom: 10px !important;
}

#reply_content {
padding: 10px;
}

.v2p-reply-wrap {
overflow: hidden;
background-color: var(--v2p-color-bg-input);
border: 1px solid var(--v2p-color-input-border);
border-radius: 8px;
}

.v2p-reply-wrap #reply_content {
display: block;
width: 100%;
box-sizing: border-box;
background-color: rgba(0, 0, 0, 0);
border: none !important;
box-shadow: none !important;
}

.v2p-reply-wrap #reply_content::placeholder {
font-size: 14px;
color: var(--v2p-color-font-tertiary);
}

.v2p-reply-wrap #reply_content:focus {
background-color: var(--v2p-color-bg-content);
outline: none;
}

.v2p-reply-upload-bar {
cursor: pointer;
padding: 6px 10px;
font-size: 12px;
color: var(--v2p-color-font-tertiary);
background-color: var(--v2p-color-bg-input);
border-top: 1px dashed var(--v2p-color-border-darker);
}

.v2p-reply-upload-bar:hover {
color: var(--v2p-color-foreground);
background-color: var(--v2p-color-bg-hover-btn);
}

.v2p-reply-upload-bar-disabled {
pointer-events: none;
opacity: 0.65;
}

.v2p-image-upload-previews:empty {
display: none;
}

.v2p-image-upload-previews {
background-color: var(--v2p-color-bg-input);
border-top: 1px solid var(--v2p-color-border);
}

.v2p-image-upload-preview {
display: grid;
grid-template-columns: 64px minmax(0, 1fr) auto;
gap: 10px;
align-items: center;
min-height: 64px;
padding: 10px;
}

.v2p-image-upload-preview + .v2p-image-upload-preview {
border-top: 1px solid var(--v2p-color-border);
}

.v2p-image-upload-thumb {
overflow: hidden;
width: 64px;
height: 64px;
background-color: var(--v2p-color-bg-content);
border: 1px solid var(--v2p-color-border);
border-radius: 4px;
}

.v2p-image-upload-thumb img {
display: block;
width: 100%;
height: 100%;
object-fit: cover;
}

.v2p-image-upload-info {
min-width: 0;
}

.v2p-image-upload-name {
overflow: hidden;
font-size: 13px;
font-weight: 600;
color: var(--v2p-color-foreground);
text-overflow: ellipsis;
white-space: nowrap;
}

.v2p-image-upload-meta,
.v2p-image-upload-status {
margin-top: 3px;
font-size: 12px;
color: var(--v2p-color-font-tertiary);
}

.v2p-image-upload-status {
color: var(--v2p-color-accent-600);
}

.v2p-image-upload-preview-error .v2p-image-upload-status {
color: var(--v2p-color-error);
}

.v2p-image-upload-actions {
display: inline-flex;
gap: 4px;
align-items: center;
}

.v2p-image-upload-action {
cursor: pointer;
display: inline-flex;
align-items: center;
justify-content: center;
width: 30px;
height: 30px;
padding: 0;
color: var(--v2p-color-font-tertiary);
background: transparent;
border: 0;
border-radius: 4px;
}

.v2p-image-upload-action:hover {
color: var(--v2p-color-foreground);
text-decoration: none;
background-color: var(--v2p-color-bg-hover-btn);
}

.v2p-image-upload-remove:hover {
color: var(--v2p-color-error);
}

.v2p-image-upload-action svg {
width: 15px;
height: 15px;
fill: none;
stroke: currentColor;
stroke-width: 2;
stroke-linecap: round;
stroke-linejoin: round;
}

@media (max-width: 520px) {
.v2p-image-upload-preview {
grid-template-columns: 54px minmax(0, 1fr) auto;
gap: 8px;
min-height: 54px;
padding: 8px;
}

.v2p-image-upload-thumb {
width: 54px;
height: 54px;
}
}

body form textarea#topic_title {
margin: 10px 0;
}

body,
.mll,
.mle,
#search,
.new-title-input,
#Wrapper,
h1,
.item_title,
.topic_content,
.reply_content {
font-family:ui-rounded, 'SF Pro Rounded', ui-system, -apple-system, sans-serif !important;
}

.topic_content a,
.reply_content a {
text-decoration: underline !important;
}

.item_title a {
font-weight: normal !important;
}

.item_title,
.item_hot_topic_title,
.payload {
line-height: 1.6;
}

img.avatar,
.avatar,
.cell[class*="hot_t_"] img[alt] {
border-radius: 50% !important;
width:40px !important;
max-height:40px !important;
}

.cell[class*="hot_t_"] img[alt] {
width: 24px !important;
max-height: 24px !important;
}

.item_node {
border-color: var(--v2p-color-main-300);
}

#Main .tab_current {
background: none;
border-bottom: 2px solid var(--box-foreground-color);
border-radius: 0;
color: var(--box-content-color);
}

#Main #SecondaryTabs {
border-radius: 0 0 10px 10px;
}

.content {
max-width: 1200px !important;
}

#Top>.content {
max-width: 1110px !important;
}

.member-activity-bar {
width: auto;
}

.ml {
font-family: ui-monospace, 'SF Mono' !important;
}

.mll {
border-radius: 10px;
}

body #search-container {
border-radius:18px !important;
}

#Navcol .nav_item:hover {
background-color: var(--box-background-hover-color);
}

#Navcol .nav_item:hover:active {
box-shadow: none;
}

#Navcol .nav_item_current:hover {
color: var(--box-foreground-color);
    background-color: var(--v2p-color-bg-content);
}

#Navcol .nav_item_current:active {
box-shadow: none;
}

#Rightcol #page-outline-title {
background-color: var(--v2p-color-button-background-hover);
}

#Rightcol .page-outline-item:hover {
background-color: var(--box-background-hover-color);
}

body #Wrapper:has(#Singleton) {
padding: 20px 0 0;
}

.subtle {
background-color: var(--bg-reply, var(--v2p-color-bg-reply)) !important;
    border-radius:10px;
    border: none !important;
    border-left: 2px solid var(--v2p-color-border-darker) !important;
    margin-top:10px;
    padding:10px;
}

#topic-tip-box {
box-shadow: none !important;
    display:none;
}

body #Wrapper:has(#Singleton) #Singleton {
overflow: hidden;
    box-shadow: var(--v2p-box-shadow);
}

body #Leftbar {
float: none;
    order: 1;
}

body #Main {
flex: 1;
    order: 2;
    max-width: 85vw;
    margin-right: 290px;
}

body #Rightbar {
order: 3;
    margin-right:0 !important;
    margin-left:20px;
}

body #search-container {
height: 30px;
    margin: 0 30px;
    background-color: var(--v2p-color-bg-search);
    border: none;
    border-radius: 6px;
    transition: background-color 0.2s ease;
}

body #search-container::before {
top: 0;
    left: 4px;
    opacity: 0.6;
    background-size: 14px 14px;
    filter: none;
}

body #search-container.active {
background-color: var(--v2p-color-bg-search-active);
}

body #search-container #search-result {
z-index: var(--zidx-serach);
    top: 42px;
    font-size: 14px;
    color: var(--v2p-color-font-secondary);
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    box-shadow: var(--v2p-widget-shadow);
}

body #search-container #search-result .fade {
color: var(--v2p-color-font-secondary);
}

body #search-container #search-result .search-item {
font-weight: bold;
    color: var(--v2p-color-foreground);
    border-radius: 5px;
}

body #search-container #search-result .search-item.active {
color: var(--v2p-color-foreground);
}

body #search-container #search-result .search-item.active.v2p-no-active {
background-color: rgba(0, 0, 0, 0);
}

body .box {
color: var(--box-foreground-color);
    background-color: var(--v2p-color-bg-content);
    border: none;
    border-radius: var(--box-border-radius);
    box-shadow: var(--v2p-box-shadow);
}

body .box .header > h1 {
font-size: 18px;
    font-weight: bold;
}

body .box .header .gray {
color: var(--color-gray);
}

body .button {
--button-hover-shadow: 0 1.8px 0 var(--button-border-color),
        0 1.8px 0 var(--button-background-color);
}

body .button.normal,
body .button.super {
cursor: pointer;
    user-select: none;
    position: relative;
    display: inline-flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    height: 28px;
    padding: 0 12px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 28px;
    color: var(--v2p-color-button-foreground);
    text-shadow: none;
    white-space: nowrap;
    background: var(--v2p-color-button-background);
    border: none;
    border-radius: 6px;
    outline: none;
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color),
        0 1.8px 0 var(--button-background-color);
    transition:
        color 0.25s,
        background-color 0.25s,
        box-shadow 0.25s;
    vertical-align: middle;
    margin-right: 10px;
}

body .button.normal:is(:hover:enabled, :active:enabled),
body .button.super:is(:hover:enabled, :active:enabled) {
font-weight: 500;
    color: var(--v2p-color-button-foreground-hover);
    text-shadow: none;
    background: var(--v2p-color-button-background-hover);
    border: none;
    box-shadow: var(--button-hover-shadow);
}

body .button.normal:is(.hover_now, .disable_now),
body .button.super:is(.hover_now, .disable_now) {
color: var(--v2p-color-button-foreground) !important;
    text-shadow: none !important;
    background: var(--button-background-color) !important;
    border: none !important;
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color) !important,
        0 1.8px 0 var(--button-background-color) !important;
}

body .button.normal.button {
background: var(--v2p-color-accent-500);
    color: #fff;
    height: 32px;
    padding: 0 14px;
    box-shadow: 0 1.8px 0 rgba(0, 0, 0, 0.08);
}

body .button.normal.button:is(:hover:enabled, :active:enabled) {
background: var(--v2p-color-accent-600);
    color: #fff;
}

body .button.normal:is(.disable_now, :disabled),
body .button.super:is(.disable_now, :disabled) {
pointer-events: none;
    cursor: default;
    font-weight: 500;
    color: var(--v2p-color-button-foreground);
    text-shadow: none;
    opacity: 0.8;
    background: var(--button-background-color);
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color),
        0 1.8px 0 var(--button-background-color);
}

body .button.normal kbd,
body .button.super kbd {
position: relative;
    right: -4px;
    padding: 0 3px;
    font-family: inherit;
    font-size: 90%;
    line-height: initial;
    border: 1px solid var(--button-border-color);
    border-radius: 4px;
}

.button.normal {
border-radius:90px !important;
    padding-left:20px !important;
    padding-right:20px !important;
}

.ps_container td.button {
border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
}

.ps_container td.normal_page_right {
border-top-right-radius: 90px !important;
    border-bottom-right-radius: 90px !important;
}

body .button.special {
--button-hover-shadow: 0 1.8px 0 var(--v2p-color-accent-200),
        0 1.8px 0 var(--v2p-color-accent-100);
    color: var(--v2p-color-accent-500);
    border-radius:99px;
    max-width:120px;
}

body .button.special:hover,
body .button.special:hover:enabled {
color: var(--v2p-color-accent-600);
    background: var(--v2p-color-accent-100);
    border: none;
    box-shadow: var(--button-hover-shadow);
}

body .button a {
color: inherit;
    text-decoration: none;
}

body .badge {
user-select: none;
    padding: 1px 3px;
    font-weight: bold;
    border: 1px solid var(--v2p-color-accent-400);
    border-radius:99px !important;
    line-height:13px;
    margin-right:5px;
}

body .badge:first-child {
border: 1px solid var(--v2p-color-accent-400);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

body .badge:last-child {
border: 1px solid var(--v2p-color-accent-400);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

body .badge.op {
color: var(--v2p-color-accent-400);
    background-color: var(--v2p-color-accent-50);
}

body .badge.mod {
color: var(--v2p-color-bg-content);
    background-color: var(--v2p-color-accent-400);
}

body .badge.you {
color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border: 1px solid var(--v2p-color-orange-400);
}

body .badge.mini {
height: 1.2em;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
}

body a.node:is(:active, :link, :visited) {
padding: 2px 6px;
    font-size: 9px;
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-block);
    border-radius: 99px;
}

body a.node:is(:active, :link, :visited):hover {
color: var(--v2p-color-font-tertiary);
    background-color: var(--v2p-color-button-background-hover);
}

body .outdated {
font-size: 12px;
    border-color: var(--v2p-color-border);
    border-bottom: none;
}

body :is(.page_normal, .page_current):is(:link, :visited) {
user-select: none;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    width: 25px;
    height: 25px;
    padding: 0 !important;
    font-size: 13px;
    line-height: 1;
    border: none;
    border-radius: 50% !important;
    margin: 0 2px;
    text-decoration: none !important;
}

body .page_normal:is(:link, :visited) {
font-weight: 500;
    color: var(--v2p-color-font-primary);
    background-color: var(--v2p-color-bg-content);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

body .page_normal:is(:link, :visited):hover {
background-color: var(--v2p-color-button-background-hover);
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

body .page_current:is(:link, :visited) {
pointer-events: none;
    font-weight: bold;
    color: #fff !important;
    background-color: var(--v2p-color-accent-500, #333) !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

body .super.button.normal_page_right:not(button) {
display: inline-block !important;
    vertical-align: middle;
    text-align: center;
    width: 25px;
    height: 25px;
    line-height: 25px !important;
    padding: 0 !important;
    font-size: 12px;
    border: none !important;
    border-radius: 50% !important;
    margin: 0 2px;
    background-color: var(--v2p-color-bg-content) !important;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    cursor: pointer;
}

body .super.button.normal_page_right:not(button):hover,
body .super.button.normal_page_right:not(button).hover_now {
background-color: var(--v2p-color-button-background-hover) !important;
}

body .super.button.disable_now {
opacity: 0.4;
    pointer-events: none;
    box-shadow: none;
}

body .page_input {
display: none;
}

body .dock_area {
margin: 12px 0;
    background: var(--v2p-color-bg-block);
    border-radius:10px;
}

body .member-activity-bar {
background-color: var(--v2p-color-divider);
}

body .member-activity-bar {
width:auto !important;
}

body .member-activity-bar .member-activity-start {
background-color: var(--v2p-color-accent-200);
}

body .member-activity-bar .member-activity-fourth {
background-color: var(--v2p-color-accent-400);
}

body .member-activity-bar .member-activity-half {
background-color: var(--v2p-color-accent-500);
}

body .member-activity-bar .member-activity-almost {
background-color: var(--v2p-color-accent-600);
}

body .member-activity-bar .member-activity-done {
background-color: var(--v2p-color-orange-400);
}

body .online {
user-select: none;
    padding: 6px 8px;
    font-size: 13px;
    color: var(--v2p-color-bg-content);
    background: var(--v2p-color-accent-400);
    border-radius: 5px;
}

body #topic_supplement {
resize: none;
    overflow: hidden;
    height: unset;
    min-height: 550px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
    overflow-y: auto;
}

body #topic_supplement::placeholder {
font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}

body #topic_supplement:is(:focus, :focus-within) {
background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}

body .item_hot_topic_title {
--offset: 2.4px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.4;
    position: relative;
    padding: var(--offset) 0;
    text-shadow: none;
}

body .item_hot_topic_title > a:hover {
text-underline-offset: var(--offset);
}

body form textarea#topic_title {
resize: none;
    overflow: hidden;
    height: unset;
    min-height: 75px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}

body form textarea#topic_title::placeholder {
font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}

body form textarea#topic_title:is(:focus, :focus-within) {
background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}

body form #topic_title {
resize: none;
    overflow: hidden;
    height: unset;
    min-height: 30px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}

body form #topic_title::placeholder {
font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}

body form #topic_title:is(:focus, :focus-within) {
background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}

body form #topic_content {
resize: none;
    overflow: hidden;
    height: unset;
    min-height: 120px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}

body form #topic_content::placeholder {
font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}

body form #topic_content:is(:focus, :focus-within) {
background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}

body form[action^="/notes"] .cell {
background-color: rgba(0, 0, 0, 0) !important;
}

body #syntax-selector .radio-group {
padding: 3px;
    border-radius:18px;
    background-color: var(--v2p-color-background);
}

body #syntax-selector .radio-group > input[type="radio"]:checked + label {
background-color: #fff;
    border-radius:18px;
}

body #syntax-selector .radio-group > input[type="radio"] + label {
cursor: pointer;
    font-size: 13px;
}

body #syntax-selector label {
color: var(--v2p-color-foreground);
}

body .snow {
color: var(--v2p-color-font-quaternary);
}

body .orange-dot {
background: var(--v2p-color-orange-400);
}

body .alt {
background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
}

body a.btn_hero {
border-color: var(--v2p-color-foreground);
}

body a.btn_hero:hover {
background-color: var(--v2p-color-foreground);
}

a.op {
border-radius:20px !important;
    padding:2px 6px !important;
    font-size:12px;
}

a.tab_current, a.tab {
border-radius:20px !important;
}

a.tab:active, a.tab:link, a.tab:visited {
color:var(--v2p-color-foreground);
}

#topic_thank {
line-height:1;
}

body .cell_ops {
background-color: rgba(0, 0, 0, 0);
}

a.dark:active, a.dark:link, a.dark:visited {
color: inherit !important;;
    text-decoration: none;
}

body .CodeMirror {
color: currentColor;
    background-color: var(--v2p-color-bg-input);
}

body .CodeMirror.CodeMirror-focused {
background-color: var(--v2p-color-bg-content);
}

body .CodeMirror .CodeMirror-gutters {
padding-right: 5px;
    background-color: var(--v2p-color-bg-input);
    border-right: 1px solid var(--v2p-color-border-darker);
}

body .CodeMirror .CodeMirror-linenumber {
color: var(--v2p-color-font-quaternary);
}

body .CodeMirror .CodeMirror-cursors {
background-color: var(--v2p-color-foreground);
}

body .cm-s-one-dark {
background-color: var(--v2p-color-bg-input);
}

body #workspace {
overflow: hidden;
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
}

body .select2-container {
width: 200px !important;
}

body .select2-container .select2-selection {
background-color: var(--v2p-color-background);
    border: 1px solid var(--v2p-color-border);
}

body .select2-container .select2-selection .select2-selection__rendered,
body .select2-container .select2-selection .select2-selection__placeholder {
color: var(--v2p-color-foreground);
}

body .select2-container .select2-dropdown {
font-size: 14px;
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
    transform: translateY(5px);
}

body .select2-container .select2-dropdown .select2-search {
padding: 5px;
}

body .select2-container
.select2-dropdown
.select2-search
.select2-search__field {
padding: 6px 4px;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid var(--v2p-color-border);
    border-radius: 4px;
}

body .select2-container
.select2-dropdown
.select2-search
.select2-search__field:focus-visible {
border-color: var(--v2p-color-font-quaternary);
    outline: none;
}

body
.select2-container
.select2-dropdown
.select2-results
> .select2-results__options {
padding: 5px;
}

body .select2-container
.select2-dropdown
.select2-container--default
.select2-results__option--selected {
color: currentColor;
    background-color: var(--v2p-color-accent-100);
}

body .select2-container .select2-results__option {
border-radius: 4px;
}

body
.select2-container
.select2-results__option--highlighted.select2-results__option--selectable {
color: currentColor;
    background-color: var(--v2p-color-main-200);
}

body .select2-container .select2-results__option--selected {
color: currentColor !important;
    background-color: var(--v2p-color-accent-100) !important;
}

body .problem {
color: currentColor;
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border-color: var(--v2p-color-orange-400);
    border-bottom: none;
}

body .markdown_body table {
border-top: 1px solid var(--v2p-color-border-darker);
    box-shadow: none;
}

body .markdown_body table tr th,
body .markdown_body table tr td {
border: 1px solid var(--v2p-color-border-darker);
}

body .markdown_body table tr:nth-child(2n) {
background-color: var(--box-background-alt-color);
}

body .markdown_body blockquote {
margin-inline: 0;
    padding: 0 1em;
    color: var(--v2p-color-font-tertiary);
    border-left: 3px solid var(--v2p-color-border);
}

body .markdown_body pre {
line-height: 1.5;
}

body .social_label:is(:link, :visited, :active) {
background-color: var(--v2p-color-button-background);
    border-radius: var(--box-border-radius);
    box-shadow: none;
}

body .social_label:is(:link, :visited, :active):hover {
background-color: var(--v2p-color-button-background-hover);
}

body .green {
color: var(--v2p-color-accent-500);
}

body .message {
margin: 6px 10px 8px;
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border: none;
    border-radius: 999px;
}

body .balance_area,
body a.balance_area:is(:link, :visited) {
display: inline-flex;
    gap: 3px;
    align-items: center;
    font-weight: 600;
    color: var(--v2p-color-foreground);
    text-shadow: none;
    background: var(--v2p-color-button-background);
}

body .balance_area:hover,
body a.balance_area:is(:link, :visited):hover {
background: var(--v2p-color-button-background-hover);
}

body:is(.subtle) {
background-color: var(--v2p-color-bg-subtle);
    border-left: 3px solid var(--v2p-color-accent-200);
}

body:is(.subtle) .topic_content {
font-size: 15px;
}

body .onoffswitch label .frame::before {
color: #fff;
    background-color: var(--v2p-color-accent-400);
}

body .onoffswitch label .frame::after {
color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-search);
}

body select {
color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-background);
    border: 1px solid var(--v2p-color-border);
    border-radius: 4px;
    padding: 4px 6px;
}

body .ml,
body .mle,
body .mll,
body .sl,
body .sll,
body .sls {
color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-bg-content);
    border-color: var(--v2p-color-input-border);
}

body .ml:focus,
body .mle:focus,
body .mll:focus,
body .sl:focus,
body .sll:focus,
body .sls:focus {
border-color: var(--v2p-color-input-border);
}

body input,
body select,
body textarea {
color: var(--v2p-color-foreground);
}

body .onoffswitch {
width: 90px;
    min-width: 90px;
    max-width: 90px;
}

.box .tag::before {
color: var(--v2p-color-font-secondary);
}

.box .tag:link,
.box .tag:visited {
font-size: 12px;
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-main-100);
    border-radius: 99px;
}

.box .tag > li {
opacity: 0.6;
}

.payload {
border-radius:10px;
}

#Top .content {
height: 100%;
}

#Top .site-nav {
height: 100%;
    padding: 0;
}

#Top .tools {
display: flex;
    gap: 8px 14px;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 400;
}

html.v2p-topnav-pending #Top .tools {
visibility: hidden;
}

#Top .tools .top {
height: 26px;
    padding: 0 6px;
    line-height: 26px;
    color: var(--v2p-color-button-foreground);
    white-space: nowrap;
    border-radius: 4px;
}

#Top .tools .top:hover {
color: var(--v2p-color-foreground);
}

#Top .tools * {
margin-left: 0;
}

#Main .box {
overflow: auto;
    padding: 5px 12px;
}

#Main .box.node-header > .cell {
margin: 0 -12px;
}

#Main .node-header {
padding-top:0 !important;
}

#Main .box .cell {
background-image: none !important;
}

#Main .box .cell_ops {
padding: 15px 5px;
}

#Main .box:has(form[action="/write"]) .cell:nth-child(1),
#Main .box:has(form[action="/write"]) .cell:nth-child(2) {
border: none;
}

#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) {
padding: 8px 0 !important;
}

#Main
.box:has(form[action="/write"])
.cell:has(#syntax-selector)
.tab-alt-container {
gap: 0 8px;
}

#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt {
padding: 4px 2px;
    border-bottom-width: 2px;
    transition: none;
}

#Main
.box:has(form[action="/write"])
.cell:has(#syntax-selector)
.tab-alt:not(.active):hover {
border-color: rgba(0, 0, 0, 0);
}

#Main .box:has(form[action="/write"]) .cell#preview {
padding: 2px 5px;
}

#Main .topic_buttons {
display: flex;
    flex-wrap: wrap;
    column-gap: 5px;
    align-items: center;
    padding: 8px 0;
    background: none;
}

#Main .topic_buttons .topic_stats {
float: none;
    flex: 1;
    order: 99;
    margin-left: 10px;
    padding: 0 !important;
    font-size: 12px;
    text-shadow: none;
    white-space: nowrap;
}

#Main .topic_buttons .topic_thanked {
font-size: 12px;
}

#Main .topic_buttons a.tb:link {
display: flex;
    flex-direction: row-reverse;
    column-gap: 5px;
    align-items: center;
    padding: 5px;
    text-shadow: none;
    white-space: nowrap;
    background: none;
    border-radius: 4px;
}

#Main .vote:link {
color: var(--v2p-color-font-tertiary);
    border-color: var(--v2p-color-border-darker);
    border-radius: 5px;
}

#Main .vote:link:hover {
box-shadow: 0 2px 2px var(--v2p-color-main-200);
}

#Main .cell .topic-link {
color: var(--v2p-color-main-600);
    text-decoration: none;
}

#Main .cell .topic-link:visited {
color: var(--v2p-color-main-600);
}

#Main .cell .topic_info {
pointer-events: none;
    user-select: none;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

#Main .cell .topic_info::after {
content: "";
    position: absolute;
    z-index: 1;
    inset: 0 0 -6px;
    background-color: var(--v2p-color-bg-content);
}

#Main .cell .topic_info .votes,
#Main .cell .topic_info .node,
#Main .cell .topic_info strong:first-of-type,
#Main .cell .topic_info span:first-of-type {
pointer-events: auto;
    position: relative;
    z-index: 2;
}

#Main .cell .topic_info a[href^="/member"] {
font-weight: 500;
    color: var(--v2p-color-font-tertiary);
    background-color: rgba(0, 0, 0, 0);
}

#Main .cell .count_livid {
user-select: none;
    display: inline-block;
    padding: 3px 6px;
    font-size: 11px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 99px;
    margin-right: 0;
    color: var(--v2p-color-button-foreground);
    background-color: var(--v2p-color-bg-block);
}

#Main .cell .count_orange {
user-select: none;
    display: inline-block;
    padding: 3px 6px;
    font-size: 11px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 99px;
    font-weight: bold;
    color: var(--v2p-color-bg-block);
    background-color: var(--v2p-color-orange-400);
}

#Main .cell .item_title .topic-link {
font-size: 15px;
    font-weight: 500;
}

#Main .cell.item tr > td:nth-child(2) {
width: 30px;
}

#Main .box > .cell[id^="r"]:not(:has(.cell[id^="r"])) .reply_content,
#Main
> .cell[id^="r"]:not(:has(.cell[id^="r"]))
.reply_content {
padding-bottom: 0;
}

#Main .cell[id^="r"] {
--bg-reply: var(--v2p-color-bg-content);
    background-color: var(--bg-reply);
}

#Main .cell[id^="r"]:not(:has(+ .cell[id^="r"])) {
border-bottom: none;
}

#Main .cell[id^="r"]:hover > table td:last-of-type .fr a {
opacity: 1;
}

#Main .cell[id^="r"] .ago {
font-size: 12px;
    color: var(--v2p-color-font-quaternary);
    white-space: nowrap;
}

#Main .cell[id^="r"] .reply_content {
padding-bottom: 10px;
    line-height: 1.5;
}

#Main .cell[id^="r"] > table:first-of-type td:first-of-type {
width: 40px;
}

#Main .cell[id^="r"] > table:first-of-type td:first-of-type .avatar {
display: inline-block;
    aspect-ratio: 1;
    width: 40px !important;
    height: 40px !important;
    background-color: var(--v2p-color-bg-avatar);
    margin-top:5px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] {
--bg-reply: var(--v2p-color-bg-reply);
    position: relative;
    z-index: var(--zidx-expand-btn);
    padding: var(--v2p-tp-nested-pd);
    border-left: 2px solid var(--v2p-color-border-darker);
    border-top: 1px solid var(--v2p-color-border-darker);
    border-radius: 10px;
    margin:10px 0 0 30px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"] {
padding: 0;
    box-shadow: none;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"].v2p-indent {
border-left: 2px solid var(--v2p-color-border-darker);
    padding:10px 10px 2px 10px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:first-of-type {
width: 25px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:first-of-type .avatar {
width: 25px !important;
    height: 25px !important;
    border-radius: 4px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:nth-child(3) strong a {
font-size: 13px;
}

#Main .cell[id^="r"] > table ~ .cell[id^="r"] .reply_content {
padding-right: 5px;
}

#Main .cell[id^="r"] > table td:nth-of-type(2) {
width: 15px;
}

#Main .cell[id^="r"] > table td:last-of-type a.dark {
color: var(--v2p-color-font-secondary);
    text-decoration: none;
}

#Main .cell[id^="r"] > table td:last-of-type a.dark:hover {
text-decoration: none;
}

#Main .cell[id^="r"] > table td:last-of-type .fr {
user-select: none;
    position: relative;
    top: -3px;
}

#Main .cell[id^="r"] > table td:last-of-type .fr a {
opacity: 0;
}

#Main .cell[id^="r"] > table td:last-of-type .fr + .sep3 {
height: 0;
}

#Main .cell[id^="r"]:last-of-type {
border: none;
}

#Main .cell[id^="r"] .no {
user-select: none;
    position: relative;
    top: -4px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--v2p-color-cell-num);
    background-color: rgba(0, 0, 0, 0);
    border-radius: 5px;
}

#Main #Tabs {
user-select: none;
    position: sticky;
    z-index: var(--zidx-tabs);
    top: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    align-items: center;
    background-color: var(--v2p-color-bg-content);
}

html.v2p-tabs-pending #Tabs {
visibility: hidden;
}

#Main #Tabs .tab_current,
#Tabs .tab_current {
background-color: var(--v2p-color-accent-500) !important;
    color: #fff !important;
    border: 1px solid transparent !important;
}

#Main #Tabs .tab,
#Main #Tabs .tab_current,
#Tabs .tab,
#Tabs .tab_current {
margin: 3px 4px;
    padding: 4px 8px;
    border-radius: 20px;
    box-sizing: border-box;
    border: 1px solid transparent;
    display: inline-flex;
    align-items: center;
    height: 28px;
    gap: 4px;
    line-height: 1;
    font-weight: 500;
    white-space: nowrap;
}

#Main #Tabs .tab svg,
#Tabs .tab svg {
width: 14px;
    height: 14px;
    flex: 0 0 14px;
}

.v2p-nav-settings-btn {
display: inline-flex;
align-items: center;
justify-content: center;
width: 28px;
height: 28px;
margin: 3px 4px 3px 8px;
border-radius: 20px;
color: var(--v2p-color-font-tertiary);
cursor: pointer;
}

.v2p-nav-settings-btn:hover {
color: var(--v2p-color-foreground);
background-color: var(--v2p-color-bg-hover-btn);
}

#v2p-nav-menu {
position: absolute;
z-index: 2000;
width: 220px;
box-sizing: border-box;
padding: 6px;
border: 1px solid var(--box-border-color);
border-radius: 14px;
background-color: rgba(var(--v2p-color-bg-content-rgb), 0.88);
box-shadow: var(--v2p-widget-shadow);
backdrop-filter: blur(12px) saturate(180%);
-webkit-backdrop-filter: blur(12px) saturate(180%);
}

.v2p-nav-menu-list {
max-height: 300px;
padding: 4px 0;
overflow-y: auto;
}

.v2p-nav-menu-row {
position: relative;
display: flex;
align-items: center;
justify-content: space-between;
gap: 8px;
margin: 2px 0;
padding: 6px 8px;
border-radius: 8px;
font-size: 13px;
color: var(--v2p-color-font-secondary);
}

.v2p-nav-menu-row:hover {
background-color: var(--v2p-color-bg-hover-btn);
}

.v2p-nav-menu-left {
display: flex;
align-items: center;
gap: 8px;
min-width: 0;
}

.v2p-nav-menu-name {
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
}

.v2p-nav-move-group {
display: inline-flex;
flex-direction: column;
gap: 0;
}

.v2p-nav-menu-btn {
display: inline-flex;
align-items: center;
justify-content: center;
padding: 1px 3px;
border: none;
color: inherit;
background: none;
line-height: 0;
cursor: pointer;
opacity: 0.45;
}

.v2p-nav-menu-btn:disabled {
cursor: default;
opacity: 0.12;
}

.v2p-nav-drag-handle {
display: inline-flex;
align-items: center;
cursor: grab;
opacity: 0.55;
}

.v2p-nav-dragging {
opacity: 0.35;
background-color: var(--v2p-color-bg-hover-btn);
outline: 1px dashed var(--v2p-color-accent-500);
outline-offset: -1px;
}

.v2p-nav-drop-before,
.v2p-nav-drop-after {
background-color: var(--v2p-color-bg-hover-btn);
}

.v2p-nav-drop-before::before,
.v2p-nav-drop-after::before {
content: "";
position: absolute;
z-index: 3;
left: 4px;
right: 4px;
height: 3px;
border-radius: 2px;
background-color: var(--v2p-color-accent-500);
box-shadow: 0 0 0 1px var(--v2p-color-bg-content), 0 1px 4px rgba(0, 0, 0, 0.2);
pointer-events: none;
}

.v2p-nav-drop-before::after,
.v2p-nav-drop-after::after {
content: "";
position: absolute;
z-index: 4;
left: 1px;
width: 7px;
height: 7px;
box-sizing: border-box;
border: 2px solid var(--v2p-color-bg-content);
border-radius: 50%;
background-color: var(--v2p-color-accent-500);
pointer-events: none;
}

.v2p-nav-drop-before::before {
top: -3px;
}

.v2p-nav-drop-before::after {
top: -5px;
}

.v2p-nav-drop-after::before {
bottom: -3px;
}

.v2p-nav-drop-after::after {
bottom: -5px;
}

#Main #SecondaryTabs {
padding: 5px 20px;
    background-color: var(--v2p-color-bg-tabs);
    border-radius: 99px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    margin-bottom:10px;
}

#Main #SecondaryTabs a {
color: var(--v2p-color-main-600);
}

#Main .topic_content,
#Main .reply_content {
font-size: 15px;
    line-height: 1.6;
    color: currentColor;
}

#Main .topic_content a[href^="/member"],
#Main .reply_content a[href^="/member"] {
position: relative;
    bottom: 1px;
    font-size: 13px;
    color: var(--v2p-color-font-tertiary);
    text-decoration: underline;
    text-underline-offset: 0.4ex;
    background-color: rgba(0, 0, 0, 0);
}

#Main .thank_area {
font-size: 12px;
}

#Main .v2p-lite-reply-actions .thank_area {
display: inline-flex;
    align-items: center;
    gap: 6px;
}

#Main .v2p-lite-reply-action {
position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 4px 0;
    margin: 0 3px;
    color: var(--v2p-color-font-tertiary) !important;
    font-size: 0;
    line-height: 1;
    text-decoration: none !important;
    vertical-align: middle;
}

#Main .v2p-lite-reply-action:hover {
color: var(--v2p-color-font-secondary) !important;
}

#Main .v2p-lite-reply-action svg {
display: block;
    width: 14px;
    height: 14px;
    opacity: 1;
}

#Main .v2p-lite-reply-action.v2p-thanked {
color: var(--v2p-color-heart) !important;
}

#Main .tab {
user-select: none;
    color: var(--v2p-color-foreground);
    background-color: rgba(0, 0, 0, 0);
}

#Main .tab_current {
user-select: none;
    color: var(--v2p-color-bg-content) !important;
    background-color: var(--v2p-color-foreground) !important;
    border-radius: 999px !important;
}

#Main #reply-box.reply-box-sticky {
z-index: var(--zidx-reply-box);
    bottom: 20px;
    overflow: visible;
    margin: 0 -10px;
    padding: 0 22px;
    border: none;
    border-radius: var(--box-border-radius);
    outline: 2px solid var(--v2p-color-border);
}

a.topic-link:active,a.topic-link:link {
line-height: 1.5;
}

#Main #reply-box .flex-one-row:last-of-type {
justify-content: flex-start;
}

#Main #reply-box .flex-one-row:last-of-type .gray {
margin-right: auto;
}

#Main #reply-box > .cell {
font-size: 12px;
}

#Main #reply-box > .cell.flex-one-row {
min-height: 45px;
    padding: 0 10px;
    border: none;
}

#Main #reply-box > .cell.flex-row-end {
padding: 12px 10px;
    border: none;
}

#Main #reply-box > .cell:has(form) {
padding-top: 0;
}

#Main #no-comments-yet {
color: var(--color-gray);
    border-color: var(--color-gray);
}

#Main #notifications .cell[id^="n"]:hover .node {
opacity: 1;
}

#Main #notifications .cell[id^="n"] .node {
opacity: 0;
}

#Main #notifications .cell[id^="n"] .payload {
color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-bg-block);
}

#Main #notifications .cell[id^="n"] .payload:has(.embedded_video_wrapper) {
min-width: 50%;
}

#Main #notifications .cell[id^="n"] .topic-link:visited {
color: var(--v2p-color-font-quaternary);
}

#Main #notifications .cell[id^="n"] > table > tbody > tr > td:first-child {
width: 50px !important;
}

#Main .cell_tabs .cell_tab_current {
font-weight: bold;
    border-color: var(--v2p-color-foreground);
}

#Main .cell_tabs .cell_tab {
color: var(--v2p-color-foreground);
}

#Main .cell_tabs .cell_tab:hover {
border-color: var(--v2p-color-border-darker);
}

#Rightbar .cell:has(.light-toggle) {
font-size: 13px;
}

#Rightbar .box .item_node {
font-size: 12px;
    color: var(--v2p-color-font-secondary);
    border-color: var(--v2p-color-border);
    border-radius: 5px;
}

#Rightbar .box .item_node:hover {
box-shadow: var(--v2p-box-shadow);
}

#Rightbar a.dark:is(:link, :active, :visited, :hover) {
color: var(--v2p-color-font-tertiary);
}

#Rightbar a.dark:is(:link, :active, :visited, :hover):hover {
color: var(--v2p-color-font-secondary);
}

#Bottom {
position: sticky;
    top: 100%;
}

#Bottom a.dark {
font-size: 13px;
    font-weight: 400;
}

#Bottom a.dark:is(:link, :active, :visited, :hover) {
color: var(--v2p-color-font-tertiary);
}

.inner table {
table-layout: fixed;
}

html.v2p-theme-dark-default,
html.v2p-theme-dark-default body,
:root body.v2p-theme-dark-default,
:root .v2p-theme-dark-default,
:root[data-darkreader-scheme="dark"] body,
:root body:where(:has(#Wrapper.Night)) {
color-scheme: dark;
    --v2p-color-main-50: unset;
    --v2p-color-main-100: #2d333b;
    --v2p-color-main-200: #374151;
    --v2p-color-main-300: #374151;
    --v2p-color-main-350: #6b7280cc;
    --v2p-color-main-400: #6b7280;
    --v2p-color-main-500: #9ca3af;
    --v2p-color-main-600: #9ca3af;
    --v2p-color-main-700: #d1d5db;
    --v2p-color-main-800: #e5e7eb;
    --v2p-color-main-900: #111827;
    --v2p-color-main-950: #030712;
    --v2p-color-border:#2d323c;
    --v2p-color-accent-50: #064e3b;
    --v2p-color-accent-100: #065f46;
    --v2p-color-accent-200: #047857;
    --v2p-color-accent-300: #059669;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #34d399;
    --v2p-color-accent-600: #6ee7b7;
    --v2p-color-orange-50: #593600;
    --v2p-color-orange-100: #9a3412;
    --v2p-color-orange-400: #fbe090;
    --v2p-color-background: #1c2128;
    --v2p-color-foreground: #adbac7;
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-button-background: #373e47;
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: #444c56;
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);
    --v2p-color-bg-content: #22272e;
    --v2p-color-bg-content-rgb: 34, 39, 46;
    --v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);
    --v2p-color-bg-subtle: #444c56;
    --v2p-color-bg-input: var(--v2p-color-background);
    --v2p-color-bg-search: var(--v2p-color-main-100);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: var(--v2p-color-bg-content);
    --v2p-color-bg-reply: var(--v2p-color-main-100);
    --v2p-color-bg-tooltip: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: #373e47;
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fca5a5;
    --v2p-color-mask: rgb(99 110 123 / 40%);
    --v2p-color-border: #444c56;
    --v2p-color-input-border: #444c56;
    --v2p-color-border-darker: #444c56;
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 10%);
    --link-color: var(--v2p-color-foreground);
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-300);
    --box-border-color: var(--v2p-color-main-100);
    --button-hover-color: var(--button-background-hover-color);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: #768390;

    visibility: visible;
}

html.v2p-theme-dark-default #Logo,
html.v2p-theme-dark-default body #Logo,
:root body.v2p-theme-dark-default #Logo,
:root .v2p-theme-dark-default #Logo,
:root[data-darkreader-scheme="dark"] body #Logo,
:root body:has(#Wrapper.Night) #Logo {
filter: invert(1) brightness(0.9) contrast(0.9);
}

html.v2p-theme-dark-default::selection,
html.v2p-theme-dark-default body::selection,
:root body.v2p-theme-dark-default::selection,
:root .v2p-theme-dark-default::selection,
:root[data-darkreader-scheme="dark"] body::selection,
:root body:has(#Wrapper.Night)::selection {
color: var(--v2p-color-background, #1c2128);
    background-color: var(--v2p-color-foreground, #adbac7);
}

html.v2p-theme-dark-default img::selection,
html.v2p-theme-dark-default body img::selection,
:root body.v2p-theme-dark-default img::selection,
:root .v2p-theme-dark-default img::selection,
:root[data-darkreader-scheme="dark"] body img::selection,
:root body:has(#Wrapper.Night) img::selection {
background-color: var(--v2p-color-foreground, #adbac7);
}

html.v2p-theme-dark-default #Top,
html.v2p-theme-dark-default body #Top,
:root body.v2p-theme-dark-default #Top,
:root .v2p-theme-dark-default #Top,
:root[data-darkreader-scheme="dark"] body #Top,
:root body:has(#Wrapper.Night) #Top {
background-color: rgba(0, 0, 0, 0);
}

html.v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root body.v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root .v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root[data-darkreader-scheme="dark"] body #Main .cell .item_title .topic-link,
:root body:has(#Wrapper.Night) #Main .cell .item_title .topic-link {
font-weight: normal;
}

html.v2p-theme-dark-default #search-container::before,
:root body.v2p-theme-dark-default #search-container::before,
:root .v2p-theme-dark-default #search-container::before,
:root[data-darkreader-scheme="dark"] body #search-container::before,
:root body:has(#Wrapper.Night) #search-container::before {
background-image: url("/static/img/search_icon_light.png");
}

html.v2p-theme-dark-default #Main #Tabs .tab,
html.v2p-theme-dark-default #Tabs .tab {
color: var(--v2p-color-foreground) !important;
        background-color: transparent;
}

html.v2p-theme-dark-default #Main #Tabs .tab:hover,
html.v2p-theme-dark-default #Tabs .tab:hover {
background-color: var(--v2p-color-bg-block);
}

html.v2p-theme-dark-default #Main #Tabs .tab_current,
html.v2p-theme-dark-default #Tabs .tab_current {
color: #fff !important;
        background-color: var(--v2p-color-accent-500) !important;
        border: none !important;
}

html.v2p-theme-dark-default .count_livid,
html.v2p-theme-dark-default #Main .cell .count_livid,
html.v2p-theme-dark-default a.count_livid {
color: var(--v2p-color-button-foreground) !important;
        background-color: var(--v2p-color-bg-block) !important;
        border: none !important;
}

html.v2p-theme-dark-default #menu-body {
background-color: var(--v2p-color-bg-content) !important;
        border: 1px solid var(--v2p-color-border) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
}

html.v2p-theme-dark-default #menu-body .cell a,
html.v2p-theme-dark-default #menu-body .cell a.top {
color: var(--v2p-color-foreground) !important;
        background-color: transparent !important;
}

html.v2p-theme-dark-default #menu-body img.tool-icon {
filter: brightness(0.8);
}

html.v2p-theme-dark-default .no {
background-color:var(--v2p-color-main-100);
         margin-top:-3px;
         border-radius:99px;
}

html.v2p-theme-dark-default .badge.pro,
:root body.v2p-theme-dark-default .badge.pro,
:root[data-darkreader-scheme="dark"] body .badge.pro,
:root body:has(#Wrapper.Night) .badge.pro {
color: #6ee7b7 !important;
         background-color: #064e3b !important;
         border-color: #34d399 !important;
}

.cell.item > table > tbody > tr > td:nth-child(2) {
width: 10px !important;
    max-width: 15px !important;
}

.v2p-indent .v2p-member-ref {
display: none;
}

.v2p-member-ref + br {
display: none;
}

.v2p-member-ref + br + b {
display: none;
}

.v2p-member-ref.v2p-member-ref-show {
display: inline;
}

@media (max-width: 768px) {
  #Main .cell[id^="r"] {
    padding-right: 5px !important;
    padding-left: 5px !important;
  }

  #Main .reply_content {
    overflow-wrap: break-word;
    font-size: 15px !important;
    line-height: 1.5 !important;
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] {
    margin: 10px 0 0 5px;
    padding: var(--v2p-tp-nested-pd);
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"].v2p-indent {
    margin: 8px 0 0 5px;
    padding: 8px 5px 2px 8px;
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:first-of-type {
    width: 28px !important;
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] .avatar {
    width: 20px !important;
    height: 20px !important;
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] .ago {
    font-size: 10px !important;
  }

  #Main .cell[id^="r"] > table ~ .cell[id^="r"] .no {
    display: none !important;
  }
}

.wwads-cn {
border: none !important;
    box-shadow: none !important;
}

#pro-campaign-container,
.box:has(.pro-unit-title),
.box:has(.pro-unit-img),
.box:has(.pro-unit-description),
.box:has(.pro-unit-cta-container),
.box:has(.pro-unit-from),
ins.adsbygoogle,
script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"] {
display: none !important;
}

.box:has(a[href^="/advertise"]) {
overflow: hidden;
    border: none !important;
    box-shadow: none !important;
}

.box:has(a[href^="/advertise"]) .sidebar_compliance {
background-color: var(--v2p-color-bg-block);
}

#v2p-lite-theme-toggle {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 25px !important;
  height: 25px !important;
  box-sizing: border-box !important;
  padding: 5px !important;
  border-radius: 50% !important;
  color: var(--v2p-color-font-secondary) !important;
  text-decoration: none !important;
}
#v2p-lite-theme-toggle:hover {
  opacity: 1 !important;
  background-color: var(--v2p-color-bg-hover-btn, rgba(0, 0, 0, 0.08)) !important;
}
#v2p-lite-theme-toggle.v2p-lite-floating {
  position: fixed !important;
  right: 12px !important;
  bottom: 12px !important;
  z-index: 2147483647 !important;
  background-color: rgba(var(--v2p-color-bg-content-rgb), 0.85) !important;
  border: 1px solid var(--box-border-color) !important;
  box-shadow: var(--v2p-widget-shadow) !important;
  backdrop-filter: blur(12px) saturate(180%) !important;
  -webkit-backdrop-filter: blur(12px) saturate(180%) !important;
}
`;

  let bootObserver = null;
  let applyScheduled = false;
  let nestedReplyApplied = false;

  docEl.classList.add("v2p-tabs-pending");
  applyThemeClasses(effectiveMode);
  injectStyle(STYLE_ID, THEME_STYLE);
  applyTheme();
  bindEvents();
  startBootObserver();
  onReady(() => {
    applyTheme();
    ensureToggle();
    initNodeNavigation();
    initReplyActionIcons();
    initImageUpload();
    initNestedReplies();
  });
  window.addEventListener("pageshow", () => {
    applyTheme();
    ensureToggle();
    initNodeNavigation();
    initReplyActionIcons();
    initImageUpload();
    initNestedReplies();
  });

  function normalizeMode(mode) {
    return MODES.includes(mode) ? mode : "auto";
  }

  function readMode() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (MODES.includes(saved)) return saved;

      const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (MODES.includes(legacy)) return legacy;
    } catch (error) {
      // Ignore storage failures in private or restricted browsing modes.
    }
    return "auto";
  }

  function writeMode(mode) {
    currentMode = normalizeMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, currentMode);
    } catch (error) {
      // Keep the in-memory mode for this page even when storage is unavailable.
    }
  }

  function isSystemDark() {
    try {
      return (
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch (error) {
      return false;
    }
  }

  function resolveMode(mode) {
    return normalizeMode(mode) === "auto" ? (isSystemDark() ? "dark" : "light") : mode;
  }

  function clearThemeClasses(el) {
    if (!el || !el.classList) return;
    Array.from(el.classList).forEach((className) => {
      if (className.startsWith("v2p-theme-")) {
        el.classList.remove(className);
      }
    });
    el.classList.remove("Night");
  }

  function applyDocumentPrepaint(mode) {
    const isDark = mode === "dark";
    clearThemeClasses(docEl);
    docEl.classList.add("v2p-lite-prepaint");
    docEl.classList.add(isDark ? "v2p-theme-dark-default" : "v2p-theme-light-default");
    docEl.classList.toggle("Night", isDark);
    docEl.dataset.v2pLiteMode = currentMode;
    docEl.dataset.v2pLiteTheme = mode;
    docEl.style.colorScheme = isDark ? "dark" : "light";
    docEl.style.backgroundColor = THEME_META_COLORS[mode];
  }

  function applyThemeClasses(mode) {
    const isDark = mode === "dark";
    const targets = [docEl, document.body, document.getElementById("Wrapper")];

    targets.forEach((target) => {
      if (!target || !target.classList) return;
      clearThemeClasses(target);
      target.classList.add(isDark ? "v2p-theme-dark-default" : "v2p-theme-light-default");
      target.classList.toggle("Night", isDark);
    });

    docEl.dataset.v2pLiteMode = currentMode;
    docEl.dataset.v2pLiteTheme = mode;
    docEl.style.colorScheme = isDark ? "dark" : "light";
    docEl.style.backgroundColor = THEME_META_COLORS[mode];
  }

  function applyTheme() {
    effectiveMode = resolveMode(currentMode);
    applyThemeClasses(effectiveMode);
    syncCodeHighlight(effectiveMode);
    updateThemeColor(effectiveMode);
    updateToggle();
    docEl.classList.remove("v2p-lite-prepaint");
    docEl.classList.add("v2p-loaded");
  }

  function scheduleApply() {
    if (applyScheduled) return;
    applyScheduled = true;
    const run = () => {
      applyScheduled = false;
      applyTheme();
      ensureToggle();
    };
    if (typeof requestAnimationFrame === "function") {
      requestAnimationFrame(run);
    } else {
      setTimeout(run, 16);
    }
  }

  function injectStyle(id, css) {
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.type = "text/css";
    style.textContent = css;
    (document.head || docEl).appendChild(style);
  }

  const removeBuiltInAds = (() => {
    const adSelector = [
      "#pro-campaign-container",
      ".pro-unit-title",
      ".pro-unit-img",
      ".pro-unit-description",
      ".pro-unit-cta-container",
      ".pro-unit-from",
      "ins.adsbygoogle",
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    ].join(",");

    const removeElement = (el) => {
      if (el && el.parentNode) el.remove();
    };

    const getRemovalTarget = (el) => {
      if (!el) return null;
      if (el.id === "pro-campaign-container") return el;
      if (el.matches && el.matches("ins.adsbygoogle")) return el.parentElement || el;
      if (el.tagName === "SCRIPT") {
        return el.parentElement && el.parentElement.querySelector("ins.adsbygoogle")
          ? el.parentElement
          : el;
      }
      return el.closest(".box") || el;
    };

    return (root) => {
      const scope = root && root.querySelectorAll ? root : document;
      if (root && root.nodeType === 1 && root.matches && root.matches(adSelector)) {
        removeElement(getRemovalTarget(root));
      }
      scope.querySelectorAll(adSelector).forEach((el) => {
        removeElement(getRemovalTarget(el));
      });
    };
  })();

  function observeBuiltInAds() {
    const target = document.body || docEl;
    if (!target || !window.MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) removeBuiltInAds(node);
        });
      });
    });
    observer.observe(target, { childList: true, subtree: true });

    if (!document.body) {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          if (document.body) observer.observe(document.body, { childList: true, subtree: true });
        },
        { once: true },
      );
    }
  }

  removeBuiltInAds(document);
  observeBuiltInAds();

  function initNodeNavigation() {
    try {
      const tabsContainer = document.querySelector("#Tabs");
      if (!tabsContainer) return false;

      const currentData = captureCurrentNavItems(tabsContainer);
      const config = readNavConfig(currentData);
      saveNavConfig(config);
      renderTabs(tabsContainer, config);
      return true;
    } catch (error) {
      console.error("V2EX Polish Lite navigation failed:", error);
      return false;
    } finally {
      docEl.classList.remove("v2p-tabs-pending");
    }
  }

  function captureCurrentNavItems(tabsContainer) {
    const items = Array.from(tabsContainer.querySelectorAll("a.tab, a.tab_current"))
      .map((link) => ({
        name: (link.textContent || link.getAttribute("aria-label") || link.title || "").trim(),
        href: link.getAttribute("href") || "",
        visible: true,
      }))
      .filter((item) => item.name && item.href && item.name !== "拼车");

    const planetLink = tabsContainer.querySelector('a[href="/planet"]');
    if (planetLink && !items.some((item) => item.href === "/planet")) {
      items.push({ name: "Planet", href: "/planet", visible: true });
    }

    return items;
  }

  function readNavConfig(currentData) {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(NAV_STORAGE_KEY) || "null");
    } catch (error) {
      saved = null;
    }

    const base = Array.isArray(saved) && saved.length > 0 ? saved : currentData.length > 0 ? currentData : DEFAULT_NAV;
    return normalizeNavConfig(base, currentData);
  }

  function normalizeNavConfig(base, currentData) {
    const result = [];
    const seen = new Set();
    const source = base.concat(currentData, DEFAULT_NAV);

    source.forEach((item) => {
      if (!item || typeof item.name !== "string" || typeof item.href !== "string") return;
      const name = item.name.trim();
      const href = item.href.trim();
      if (!name || !href || name === "拼车" || seen.has(href)) return;
      seen.add(href);
      result.push({
        name,
        href,
        visible: item.visible !== false,
      });
    });

    return result;
  }

  function saveNavConfig(config) {
    try {
      localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      // Navigation customization still works for this page when storage is unavailable.
    }
  }

  function renderTabs(container, config) {
    const activeHref = getActiveTabHref(container);
    const extras = Array.from(container.childNodes).filter((node) => {
      if (node.nodeType !== 1) return false;
      if (node.classList.contains("tab") || node.classList.contains("tab_current")) return false;
      if (node.classList.contains("v2p-nav-settings-btn")) return false;
      if (node.id === "v2p-nav-menu") return false;
      if (node.tagName === "A" && node.getAttribute("href") === "/planet") return false;
      return true;
    });

    const urlTab = new URLSearchParams(window.location.search).get("tab");
    if (urlTab) {
      try {
        localStorage.setItem(LAST_TAB_STORAGE_KEY, urlTab);
      } catch (error) {
        // Ignore storage failures.
      }
    }

    container.innerHTML = "";
    config.forEach((item) => {
      if (!item.visible) return;

      const link = document.createElement("a");
      link.href = item.href;
      link.className = isCurrentNavItem(item, activeHref, urlTab) ? "tab_current" : "tab v2p-hover-btn";

      if (item.name === "Planet") {
        link.innerHTML = buildSvgIcon(TAB_ICONS.Planet);
        link.title = "Planet";
        link.setAttribute("aria-label", "Planet");
      } else {
        link.innerHTML = buildTabIcon(item.name) + escapeHtml(item.name);
      }

      container.appendChild(link);
    });

    extras.forEach((node) => container.appendChild(node));
    container.appendChild(createNavSettingsButton(config));
  }

  function getActiveTabHref(container) {
    const active = container.querySelector("a.tab_current");
    return active ? active.getAttribute("href") || "" : "";
  }

  function isCurrentNavItem(item, activeHref, urlTab) {
    if (activeHref && normalizeHref(activeHref) === normalizeHref(item.href)) return true;

    const itemUrl = new URL(item.href, location.origin);
    const itemTab = itemUrl.searchParams.get("tab");
    if (itemTab) {
      let currentTab = urlTab;
      if (!currentTab) {
        try {
          currentTab = localStorage.getItem(LAST_TAB_STORAGE_KEY);
        } catch (error) {
          currentTab = null;
        }
      }
      return currentTab === itemTab;
    }

    return location.pathname === itemUrl.pathname && !itemUrl.search;
  }

  function normalizeHref(href) {
    try {
      const url = new URL(href, location.origin);
      return url.pathname + url.search;
    } catch (error) {
      return href || "";
    }
  }

  function buildTabIcon(name) {
    const icon = TAB_ICONS[name];
    if (!icon) return "";
    if (icon.trim().startsWith("<svg")) return icon;
    return buildSvgIcon(icon);
  }

  function buildSvgIcon(paths) {
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      paths +
      "</svg>"
    );
  }

  function createNavSettingsButton(config) {
    const button = document.createElement("span");
    button.className = "v2p-nav-settings-btn";
    button.title = "自定义导航";
    button.setAttribute("role", "button");
    button.setAttribute("aria-label", "自定义导航");
    button.innerHTML = buildSvgIcon(
      '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    );
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openNavSettings(config);
    });
    return button;
  }

  function openNavSettings(config) {
    const existingMenu = document.getElementById("v2p-nav-menu");
    if (existingMenu) {
      existingMenu.remove();
      return;
    }

    const settingsBtn = document.querySelector(".v2p-nav-settings-btn");
    if (!settingsBtn || !document.body) return;

    const menu = document.createElement("div");
    menu.id = "v2p-nav-menu";
    const rect = settingsBtn.getBoundingClientRect();
    menu.style.top = window.scrollY + rect.bottom + 5 + "px";
    menu.style.left = Math.max(8, window.scrollX + rect.right - 220) + "px";

    const list = document.createElement("div");
    list.className = "v2p-nav-menu-list";
    menu.appendChild(list);

    let dragSrcIndex = null;
    let dragDestinationIndex = null;

    const saveAndRefresh = () => {
      saveNavConfig(config);
      const tabsContainer = document.querySelector("#Tabs");
      if (tabsContainer) renderTabs(tabsContainer, config);
    };

    const moveItem = (fromIndex, direction) => {
      const toIndex = fromIndex + direction;
      if (toIndex < 0 || toIndex >= config.length) return;
      [config[fromIndex], config[toIndex]] = [config[toIndex], config[fromIndex]];
    };

    const reorderConfig = (fromIndex, destinationIndex) => {
      if (fromIndex == null || destinationIndex == null || fromIndex === destinationIndex) return;
      const next = config.slice();
      const moved = next.splice(fromIndex, 1)[0];
      const insertIndex = Math.max(0, Math.min(next.length, destinationIndex));
      next.splice(insertIndex, 0, moved);
      config.splice(0, config.length, ...next);
    };

    const clearDropStyles = () => {
      list.querySelectorAll(".v2p-nav-drop-before, .v2p-nav-drop-after").forEach((row) => {
        row.classList.remove("v2p-nav-drop-before", "v2p-nav-drop-after");
      });
      dragDestinationIndex = null;
    };

    const showDropPosition = (destinationIndex) => {
      clearDropStyles();
      if (dragSrcIndex == null || destinationIndex === dragSrcIndex) return;

      const rows = Array.from(list.querySelectorAll(".v2p-nav-menu-row"));
      const remainingRows = rows.filter((_, index) => index !== dragSrcIndex);
      const nextRow = remainingRows[destinationIndex];
      if (nextRow) {
        nextRow.classList.add("v2p-nav-drop-before");
      } else if (remainingRows.length > 0) {
        remainingRows[remainingRows.length - 1].classList.add("v2p-nav-drop-after");
      }
      dragDestinationIndex = destinationIndex;
    };

    const renderList = () => {
      list.innerHTML = "";
      config.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "v2p-nav-menu-row";

        const left = document.createElement("div");
        left.className = "v2p-nav-menu-left";

        const moveGroup = document.createElement("span");
        moveGroup.className = "v2p-nav-move-group";

        const up = createMenuMoveButton("up", index === 0);
        up.addEventListener("click", (event) => {
          event.stopPropagation();
          moveItem(index, -1);
          renderList();
          saveAndRefresh();
        });

        const down = createMenuMoveButton("down", index === config.length - 1);
        down.addEventListener("click", (event) => {
          event.stopPropagation();
          moveItem(index, 1);
          renderList();
          saveAndRefresh();
        });

        moveGroup.appendChild(up);
        moveGroup.appendChild(down);

        const dragHandle = document.createElement("span");
        dragHandle.className = "v2p-nav-drag-handle";
        dragHandle.title = "拖拽排序";
        dragHandle.innerHTML = buildSvgIcon(
          '<circle cx="9" cy="5" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="19" r="1"/>',
        );
        dragHandle.addEventListener("mousedown", () => {
          row.draggable = true;
          document.addEventListener(
            "mouseup",
            () => {
              if (dragSrcIndex !== index) row.draggable = false;
            },
            { once: true },
          );
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = item.visible;
        checkbox.addEventListener("click", (event) => event.stopPropagation());
        checkbox.addEventListener("change", () => {
          item.visible = checkbox.checked;
          saveAndRefresh();
        });

        const name = document.createElement("span");
        name.className = "v2p-nav-menu-name";
        name.textContent = item.name;

        left.appendChild(moveGroup);
        left.appendChild(dragHandle);
        left.appendChild(checkbox);
        left.appendChild(name);
        row.appendChild(left);
        list.appendChild(row);

        row.addEventListener("dragstart", (event) => {
          dragSrcIndex = index;
          row.classList.add("v2p-nav-dragging");
          row.setAttribute("aria-grabbed", "true");
          if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", item.name);
          }
        });

        row.addEventListener("dragover", (event) => {
          if (dragSrcIndex == null) return;
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
          const rowRect = row.getBoundingClientRect();
          const dropAfter = event.clientY >= rowRect.top + rowRect.height / 2;
          const sourceSlot = index + (dropAfter ? 1 : 0);
          const destinationIndex = sourceSlot > dragSrcIndex ? sourceSlot - 1 : sourceSlot;
          showDropPosition(destinationIndex);
        });

        row.addEventListener("drop", (event) => {
          if (dragSrcIndex == null) return;
          event.preventDefault();
          event.stopPropagation();
          if (dragDestinationIndex == null || dragDestinationIndex === dragSrcIndex) {
            clearDropStyles();
            return;
          }
          reorderConfig(dragSrcIndex, dragDestinationIndex);
          dragSrcIndex = null;
          clearDropStyles();
          renderList();
          saveAndRefresh();
        });

        row.addEventListener("dragend", () => {
          row.draggable = false;
          row.classList.remove("v2p-nav-dragging");
          row.removeAttribute("aria-grabbed");
          dragSrcIndex = null;
          clearDropStyles();
        });
      });
    };

    renderList();

    const closeHandler = (event) => {
      if (menu.contains(event.target) || settingsBtn.contains(event.target)) return;
      menu.remove();
      document.removeEventListener("click", closeHandler);
    };

    setTimeout(() => {
      document.addEventListener("click", closeHandler);
    }, 0);

    document.body.appendChild(menu);
  }

  function createMenuMoveButton(direction, disabled) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "v2p-nav-menu-btn";
    button.disabled = disabled;
    button.innerHTML = buildSvgIcon(direction === "up" ? '<path d="m18 15-6-6-6 6"/>' : '<path d="m6 9 6 6 6-6"/>');
    return button;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initReplyActionIcons() {
    if (!/^\/t\/\d+/.test(window.location.pathname)) return false;

    const iconPaths = {
      hide: '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3.11-11-8 1.21-3.08 3.62-5.39 6.69-6.56"/><path d="M1 1l22 22"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.11 11 8a10.94 10.94 0 0 1-4.29 5.3"/><path d="M14.12 14.12a3 3 0 0 1-4.24-4.24"/>',
      thank: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
      reply: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    };

    const setIcon = (control, type, label) => {
      if (!control || control.dataset.v2pLiteReplyActionIcon) return false;
      control.dataset.v2pLiteReplyActionIcon = type;
      control.classList.add("v2p-lite-reply-action", "v2p-lite-reply-action-" + type);
      control.title = label;
      control.setAttribute("aria-label", label);
      control.innerHTML = buildSvgIcon(iconPaths[type]);
      return true;
    };

    let changed = false;
    getCommentCells().forEach((cell) => {
      const table = getDirectTable(cell);
      const contentCell = table && getContentCell(table);
      const actions = contentCell
        ? Array.from(contentCell.children).find((child) => child.classList && child.classList.contains("fr"))
        : null;
      if (!actions) return;

      let rowChanged = false;
      const thankArea = Array.from(actions.children).find(
        (child) => child.classList && child.classList.contains("thank_area"),
      );

      if (thankArea) {
        const thankLinks = Array.from(thankArea.querySelectorAll("a"));
        const hideLink = thankLinks.find((link) => {
          const onclick = link.getAttribute("onclick") || "";
          return onclick.includes("hideReply") || (link.textContent || "").trim().includes("隐藏");
        });
        const thankLink = thankLinks.find((link) => {
          const onclick = link.getAttribute("onclick") || "";
          return onclick.includes("thankReply") || !!link.querySelector('img[src*="heart_neue.png"]');
        });

        rowChanged = setIcon(hideLink, "hide", "隐藏回复") || rowChanged;
        rowChanged = setIcon(thankLink, "thank", "感谢回复") || rowChanged;

        const existingThankedIcon = thankArea.querySelector(
          ".v2p-lite-reply-action-thank.v2p-thanked",
        );
        if (thankArea.classList.contains("thanked") && !thankLink && !existingThankedIcon) {
          const thankedIcon = document.createElement("span");
          thankedIcon.className = "v2p-thanked";
          thankArea.textContent = "";
          thankArea.appendChild(thankedIcon);
          rowChanged = setIcon(thankedIcon, "thank", "已感谢") || rowChanged;
        }
      }

      const replyImage = actions.querySelector('img[src*="reply_neue.png"]');
      const replyLink = replyImage
        ? replyImage.closest("a")
        : Array.from(actions.querySelectorAll("a")).find((link) =>
            (link.getAttribute("onclick") || "").includes("replyOne"),
          );
      rowChanged = setIcon(replyLink, "reply", "回复") || rowChanged;

      if (rowChanged) actions.classList.add("v2p-lite-reply-actions");
      changed = rowChanged || changed;
    });

    return changed;
  }

  function initImageUpload() {
    bindReplyImageUpload();
    bindEditorImageUpload();
  }

  function bindReplyImageUpload() {
    const textarea = document.querySelector("#reply_content");
    if (!textarea || textarea.dataset.v2pLiteImageUploadBound === "1") return false;
    if (!textarea.parentNode) return false;

    let wrapper = textarea.parentElement;
    if (!wrapper || !wrapper.classList.contains("v2p-reply-wrap")) {
      wrapper = document.createElement("div");
      wrapper.className = "v2p-reply-wrap";
      textarea.parentNode.insertBefore(wrapper, textarea);
      wrapper.appendChild(textarea);
    }

    bindImageUploadToWrapper({
      wrapper,
      pasteTarget: textarea,
      insertText: (text) => insertTextToTextarea(textarea, text),
      replaceText: (find, replace) => replaceTextInTextarea(textarea, find, replace),
      removeText: (imgLink) => replaceTextInTextarea(textarea, imgLink, ""),
    });
    textarea.dataset.v2pLiteImageUploadBound = "1";
    return true;
  }

  function bindEditorImageUpload() {
    const editor = getCodeMirrorEditor();
    const wrapper = document.querySelector("#workspace");
    if (!editor || !wrapper || wrapper.dataset.v2pLiteImageUploadBound === "1") return false;

    bindImageUploadToWrapper({
      wrapper,
      pasteTarget: wrapper,
      insertText: (text) => insertTextToEditor(editor, text),
      replaceText: (find, replace) => replaceTextInEditor(editor, find, replace),
      removeText: (imgLink) => {
        replaceTextInEditor(editor, "![](" + imgLink + ")", "");
        replaceTextInEditor(editor, imgLink, "");
      },
    });
    return true;
  }

  function bindImageUploadToWrapper({ wrapper, pasteTarget, insertText, replaceText, removeText }) {
    if (!wrapper || wrapper.dataset.v2pLiteImageUploadBound === "1") return;

    wrapper.dataset.v2pLiteImageUploadBound = "1";
    let uploading = false;
    let uploadBar = Array.from(wrapper.children).find((child) =>
      child.classList && child.classList.contains("v2p-reply-upload-bar"),
    );

    if (!uploadBar) {
      uploadBar = document.createElement("div");
      uploadBar.className = "v2p-reply-upload-bar";
      wrapper.appendChild(uploadBar);
    }
    uploadBar.textContent = UPLOAD_TIP;

    let previewList = Array.from(wrapper.children).find((child) =>
      child.classList && child.classList.contains("v2p-image-upload-previews"),
    );
    if (!previewList) {
      previewList = document.createElement("div");
      previewList.className = "v2p-image-upload-previews";
      previewList.setAttribute("aria-live", "polite");
      uploadBar.insertAdjacentElement("afterend", previewList);
    }

    const setUploading = (value) => {
      uploading = value;
      uploadBar.classList.toggle("v2p-reply-upload-bar-disabled", uploading);
      uploadBar.textContent = uploading ? "正在上传图片..." : UPLOAD_TIP;
    };

    const handleUpload = async (file) => {
      if (!isImageFile(file) || uploading) return;

      const placeholder = "[上传图片中...]";
      insertText(" " + placeholder + " ");
      setUploading(true);
      try {
        const imgLink = await uploadImage(file);
        replaceText(placeholder, imgLink);
        addImageUploadPreview(previewList, file, imgLink, removeText);
      } catch (error) {
        console.error("V2EX Polish Lite image upload failed:", error);
        replaceText(placeholder, "");
        window.alert("上传图片失败，请稍后重试。");
      } finally {
        setUploading(false);
      }
    };

    uploadBar.addEventListener("click", () => {
      if (uploading) return;
      const imgInput = document.createElement("input");
      imgInput.type = "file";
      imgInput.accept = "image/*";
      imgInput.style.display = "none";
      imgInput.addEventListener(
        "change",
        () => {
          const selectedFile = imgInput.files && imgInput.files[0];
          if (selectedFile) void handleUpload(selectedFile);
          imgInput.remove();
        },
        { once: true },
      );
      document.body.appendChild(imgInput);
      imgInput.click();
    });

    pasteTarget.addEventListener("paste", (event) => {
      const file = getImageFileFromClipboard(event);
      if (!file) return;
      event.preventDefault();
      void handleUpload(file);
    });

    wrapper.addEventListener("dragover", (event) => {
      const types = event.dataTransfer && event.dataTransfer.types;
      if (types && Array.from(types).includes("Files")) event.preventDefault();
    });

    wrapper.addEventListener("drop", (event) => {
      const file = getImageFileFromDataTransfer(event);
      if (!file) return;
      event.preventDefault();
      void handleUpload(file);
    });
  }

  function addImageUploadPreview(previewList, file, imgLink, removeText) {
    const item = document.createElement("div");
    item.className = "v2p-image-upload-preview";

    const thumbLink = document.createElement("a");
    thumbLink.className = "v2p-image-upload-thumb";
    thumbLink.href = imgLink;
    thumbLink.target = "_blank";
    thumbLink.rel = "noopener noreferrer";
    thumbLink.title = "查看原图";

    const image = document.createElement("img");
    image.alt = file.name || "已上传图片";
    image.decoding = "async";

    const info = document.createElement("div");
    info.className = "v2p-image-upload-info";

    const name = document.createElement("div");
    name.className = "v2p-image-upload-name";
    name.textContent = file.name || "粘贴的图片";
    name.title = name.textContent;

    const meta = document.createElement("div");
    meta.className = "v2p-image-upload-meta";
    meta.textContent = formatImageFileSize(file.size);

    const status = document.createElement("div");
    status.className = "v2p-image-upload-status";
    status.textContent = "已上传到 Imgur";

    image.addEventListener("load", () => {
      const dimensions = image.naturalWidth && image.naturalHeight
        ? image.naturalWidth + " x " + image.naturalHeight
        : "";
      meta.textContent = [dimensions, formatImageFileSize(file.size)].filter(Boolean).join(" · ");
    });
    image.addEventListener("error", () => {
      item.classList.add("v2p-image-upload-preview-error");
      status.textContent = "预览加载失败，请打开原图确认";
    });
    image.src = imgLink;
    thumbLink.appendChild(image);

    info.append(name, meta, status);

    const actions = document.createElement("div");
    actions.className = "v2p-image-upload-actions";

    const openLink = document.createElement("a");
    openLink.className = "v2p-image-upload-action";
    openLink.href = imgLink;
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.title = "查看原图";
    openLink.setAttribute("aria-label", "查看原图");
    openLink.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3h7v7"></path><path d="M10 14 21 3"></path><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path></svg>';

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "v2p-image-upload-action v2p-image-upload-remove";
    removeButton.title = "从正文移除";
    removeButton.setAttribute("aria-label", "从正文移除");
    removeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 15H6L5 6"></path><path d="M10 11v6M14 11v6"></path></svg>';
    removeButton.addEventListener("click", () => {
      removeText(imgLink);
      item.remove();
    });

    actions.append(openLink, removeButton);
    item.append(thumbLink, info, actions);
    previewList.appendChild(item);
  }

  function formatImageFileSize(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);
    const clientId = IMGUR_CLIENT_IDS[Math.floor(Math.random() * IMGUR_CLIENT_IDS.length)];
    const res = await fetch("https://api.imgur.com/3/upload", {
      method: "POST",
      headers: { Authorization: "Client-ID " + clientId },
      body: formData,
    });

    if (res.ok) {
      const resData = await res.json();
      if (resData && resData.success && resData.data && resData.data.link) {
        return resData.data.link;
      }
    }
    throw new Error("上传失败");
  }

  function isImageFile(file) {
    if (!file) return false;
    if (file.type && file.type.indexOf("image/") === 0) return true;
    return /\.(apng|avif|gif|jpe?g|png|webp)$/i.test(file.name || "");
  }

  function getImageFileFromClipboard(event) {
    const items = event.clipboardData && event.clipboardData.items;
    if (!items) return null;
    const imageItem = Array.from(items).find((item) => item.type && item.type.indexOf("image/") === 0);
    return imageItem ? imageItem.getAsFile() : null;
  }

  function getImageFileFromDataTransfer(event) {
    const files = event.dataTransfer && event.dataTransfer.files;
    if (!files || files.length === 0) return null;
    return Array.from(files).find(isImageFile) || null;
  }

  function insertTextToTextarea(textarea, text) {
    const value = textarea.value || "";
    const start = typeof textarea.selectionStart === "number" ? textarea.selectionStart : value.length;
    const end = typeof textarea.selectionEnd === "number" ? textarea.selectionEnd : start;
    textarea.value = value.slice(0, start) + text + value.slice(end);
    focusTextareaAt(textarea, start + text.length);
    dispatchInput(textarea);
  }

  function replaceTextInTextarea(textarea, find, replace) {
    const value = textarea.value || "";
    const index = value.indexOf(find);
    if (index < 0) return;
    textarea.value = value.slice(0, index) + replace + value.slice(index + find.length);
    focusTextareaAt(textarea, index + replace.length);
    dispatchInput(textarea);
  }

  function focusTextareaAt(textarea, cursor) {
    textarea.focus();
    if (typeof textarea.setSelectionRange !== "function") return;
    try {
      textarea.setSelectionRange(cursor, cursor);
    } catch (error) {
      // Some mobile browsers reject selection changes while the field is blurred.
    }
  }

  function dispatchInput(el) {
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function getCodeMirrorEditor() {
    const pageEditor = window.editor;
    if (pageEditor && typeof pageEditor.getDoc === "function") return pageEditor;

    const codeMirrorEl = document.querySelector(".CodeMirror");
    if (codeMirrorEl && codeMirrorEl.CodeMirror && typeof codeMirrorEl.CodeMirror.getDoc === "function") {
      return codeMirrorEl.CodeMirror;
    }
    return null;
  }

  function insertTextToEditor(editor, text) {
    const doc = editor.getDoc();
    doc.replaceRange(text, doc.getCursor());
    if (typeof editor.focus === "function") editor.focus();
  }

  function replaceTextInEditor(editor, find, replace) {
    const doc = editor.getDoc();
    const value = doc.getValue();
    const replacement = replace ? formatUploadedImageLink(replace) : "";
    doc.setValue(value.replace(find, replacement));
    if (typeof editor.focus === "function") editor.focus();
  }

  function formatUploadedImageLink(link) {
    const syntax = document.querySelector('input[name="syntax"]:checked');
    return syntax && syntax.value === "markdown" ? "![](" + link + ")" : link;
  }

  function initNestedReplies() {
    if (nestedReplyApplied || !/^\/t\/\d+/.test(window.location.pathname)) return;

    const cells = getCommentCells();
    if (cells.length === 0) return;

    const commentDataList = cells.map((cell, index) => getCommentData(cell, index));
    commentDataList.forEach((comment) => {
      if (comment && comment.refMemberNames && comment.refMemberNames.length === 1) {
        hideSingleMemberRef(comment.contentEl, comment.refMemberNames[0]);
      }
    });

    cells.forEach((cell, index) => {
      const currentComment = commentDataList[index];
      if (!currentComment || !currentComment.refMemberNames || currentComment.refMemberNames.length === 0) return;

      const moreThanOneRefMember = currentComment.refMemberNames.length > 1;
      const refNames = moreThanOneRefMember
        ? currentComment.refMemberNames.slice().reverse()
        : currentComment.refMemberNames;

      for (const refName of refNames) {
        for (let targetIndex = index - 1; targetIndex >= 0; targetIndex -= 1) {
          const targetComment = commentDataList[targetIndex];
          if (!targetComment || targetComment.memberName !== refName) continue;

          let refCommentIndex = targetIndex;
          const refFloors = currentComment.refFloors || [];
          const firstRefFloor = moreThanOneRefMember ? refFloors.slice().reverse()[0] : refFloors[0];
          if (firstRefFloor && firstRefFloor !== targetComment.floor) {
            const exactIndex = commentDataList
              .slice(0, targetIndex)
              .findIndex((comment) => comment && comment.floor === firstRefFloor && comment.memberName === refName);
            if (exactIndex >= 0) refCommentIndex = exactIndex;
          }

          cell.classList.add("v2p-indent");
          cells[refCommentIndex].appendChild(cell);
          return;
        }
      }
    });

    nestedReplyApplied = true;
  }

  function getCommentCells() {
    return Array.from(document.querySelectorAll('#Main .cell[id^="r"]')).filter((cell) => {
      const table = getDirectTable(cell);
      return table && getContentCell(table) && getReplyContentEl(table);
    });
  }

  function getCommentData(cell, index) {
    const table = getDirectTable(cell);
    const contentCell = table && getContentCell(table);
    if (!contentCell) return null;

    const member = contentCell.querySelector("strong > a");
    const contentEl = getReplyContentEl(table);
    if (!member || !contentEl) return null;

    const content = contentEl.textContent || "";
    const memberNameMatches = Array.from(content.matchAll(/@([a-zA-Z0-9]+)/g));
    const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g));

    return {
      id: cell.id,
      index,
      memberName: (member.textContent || "").trim(),
      contentEl,
      floor: ((contentCell.querySelector("span.no") || {}).textContent || "").trim(),
      refMemberNames: memberNameMatches.map((match) => match[1]),
      refFloors: floorNumberMatches.map((match) => match[1]),
    };
  }

  function getDirectTable(cell) {
    return Array.from(cell.children).find((child) => child.tagName === "TABLE") || null;
  }

  function getContentCell(table) {
    const row = (table.tBodies[0] && table.tBodies[0].rows[0]) || table.rows[0];
    return row && row.cells ? row.cells[2] : null;
  }

  function getReplyContentEl(table) {
    const contentCell = getContentCell(table);
    if (!contentCell) return null;
    return Array.from(contentCell.children).find((child) => child.classList && child.classList.contains("reply_content")) || null;
  }

  function hideSingleMemberRef(contentEl, memberName) {
    const link = Array.from(contentEl.querySelectorAll('a[href*="/member/"]')).find(
      (item) => (item.textContent || "").trim() === memberName,
    );
    if (!link || !link.previousSibling || link.previousSibling.nodeType !== Node.TEXT_NODE) return;

    const textNode = link.previousSibling;
    const text = textNode.textContent || "";
    if (!text.endsWith("@")) return;

    textNode.textContent = text.slice(0, -1);
    const span = document.createElement("span");
    span.className = "v2p-member-ref";
    span.appendChild(document.createTextNode("@"));
    span.appendChild(link.cloneNode(true));
    link.replaceWith(span);
  }

  function syncCodeHighlight(mode) {
    const link = document.querySelector('link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]');
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (mode === "dark" && href.includes("tomorrow.css") && !href.includes("tomorrow-night.css")) {
      link.setAttribute("href", href.replace("tomorrow.css", "tomorrow-night.css"));
    } else if (mode === "light" && href.includes("tomorrow-night.css")) {
      link.setAttribute("href", href.replace("tomorrow-night.css", "tomorrow.css"));
    }
  }

  function updateThemeColor(mode) {
    let meta = document.getElementById(THEME_META_ID);
    if (!meta) {
      meta = document.createElement("meta");
      meta.id = THEME_META_ID;
      meta.name = "theme-color";
      (document.head || docEl).appendChild(meta);
    }
    meta.content = THEME_META_COLORS[mode];
  }

  function ensureToggle() {
    const topTools = document.querySelector("#Top .tools");
    let toggle = document.getElementById(TOGGLE_ID);

    if (!toggle) {
      toggle = document.createElement("a");
      toggle.id = TOGGLE_ID;
      toggle.href = "javascript:void(0)";
      toggle.className = "top";
      toggle.setAttribute("role", "button");
      toggle.setAttribute("data-v2p-lite-toggle", "theme");
    }

    if (topTools) {
      toggle.className = "top";
      if (toggle.parentNode !== topTools) topTools.appendChild(toggle);
    } else if (document.body && !toggle.parentNode) {
      toggle.className = "v2p-lite-floating";
      document.body.appendChild(toggle);
    }

    updateToggle();
  }

  function updateToggle() {
    const toggle = document.getElementById(TOGGLE_ID);
    if (!toggle) return;

    const label = LABELS[currentMode] || LABELS.auto;
    const effectiveLabel = LABELS[effectiveMode] || LABELS.light;
    toggle.innerHTML = ICONS[currentMode] || ICONS.auto;
    toggle.title = currentMode === "auto" ? "自动：当前" + effectiveLabel : "当前" + label;
    toggle.setAttribute("aria-label", "主题：" + toggle.title);
    toggle.setAttribute("aria-pressed", effectiveMode === "dark" ? "true" : "false");
    toggle.dataset.mode = currentMode;
    toggle.dataset.effectiveMode = effectiveMode;
  }

  function cycleMode() {
    const index = MODES.indexOf(currentMode);
    const next = MODES[(index + 1 + MODES.length) % MODES.length];
    writeMode(next);
    applyTheme();
  }

  function bindEvents() {
    document.addEventListener(
      "click",
      (event) => {
        const target = event.target;
        if (!target || !target.closest) return;

        const toggle = target.closest("#" + TOGGLE_ID);
        if (!toggle) return;

        event.preventDefault();
        event.stopPropagation();
        cycleMode();
      },
      true,
    );

    try {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        if (currentMode === "auto") applyTheme();
      };
      if (typeof media.addEventListener === "function") {
        media.addEventListener("change", onChange);
      } else if (typeof media.addListener === "function") {
        media.addListener(onChange);
      }
    } catch (error) {
      // Ignore matchMedia listener failures.
    }
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function startBootObserver() {
    if (!window.MutationObserver || bootObserver) return;

    bootObserver = new MutationObserver(() => {
      scheduleApply();
      if (document.body && document.getElementById("Wrapper") && document.querySelector("#Top .tools")) {
        stopBootObserver();
      }
    });

    bootObserver.observe(docEl, {
      childList: true,
      subtree: true,
    });

    setTimeout(stopBootObserver, 3000);
  }

  function stopBootObserver() {
    if (!bootObserver) return;
    bootObserver.disconnect();
    bootObserver = null;
  }
})();
