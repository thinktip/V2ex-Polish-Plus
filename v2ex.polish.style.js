// ==UserScript==
// @name         V2EX Plus - style
// @namespace    https://v2ex.com/
// @version      3.5
// @description  V2EX Plus userscript port of style.js
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @run-at       document-start
// @icon         https://v2ex.com/static/apple-touch-icon-180.png
// @grant        none
// ==/UserScript==

// GM_addStyle Polyfill for Chrome Extension
if (typeof GM_addStyle === "undefined") {
    window.GM_addStyle = function (css) {
        const style = document.createElement("style");
        style.type = "text/css";
        style.textContent = css;
        document.head
            ? document.head.appendChild(style)
            : document.documentElement.appendChild(style);
        return style;
    };
}

// 尽早执行：防闪烁 + 自动同步原生主题
(function () {
    const docEl = document.documentElement;
    const STORAGE_KEY = "user_preferred_theme_mode";

    // [Note] 初始全屏隐藏已由 critical.css 处理

    // 1. 移动端检测（保持原样）
    const isMobile =
        /Mobi|Android|iPhone|iPad|iPod|Mobile|Phone/i.test(navigator.userAgent) ||
        window.innerWidth <= 768;
    if (isMobile) {
        docEl.classList.add("v2p-mobile");
    }

    // 2. 读取用户上次的设置
    let currentMode = localStorage.getItem(STORAGE_KEY);

    // [Fast Path] 1. 立即注入主题类 & 关键 CSS (背景色 + 隐藏 body)
    // 统一各主题背景色
    const THEME_BG_MAP = {
        light: "#f2f3f5",
        dark: "#1c2128",
        dawn: "#faf4ed",
        aqua: "#f2f7fa",
    };

    let effectiveMode = currentMode;
    if (currentMode === "auto" || !currentMode) {
        effectiveMode =
            window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
    }

    const initBg = THEME_BG_MAP[effectiveMode] || THEME_BG_MAP.light;

    // 立即应用类名，防止 Logo 等元素闪烁
    if (effectiveMode === "dark") {
        docEl.classList.add("v2p-theme-dark-default");
    } else if (effectiveMode === "dawn") {
        docEl.classList.add("v2p-theme-dawn");
    } else if (effectiveMode === "aqua") {
        docEl.classList.add("v2p-theme-aqua");
    } else {
        docEl.classList.add("v2p-theme-light-default");
    }

    // 设置初始背景色 & 隐藏 html
    docEl.style.backgroundColor = initBg;
    // docEl.style.visibility = "hidden"; // 已由 v2p-anti-flash 处理

    /**
     * 即时同步 theme-color
     */
    const getModeFromClass = () => {
        if (docEl.classList.contains("v2p-theme-dark-default")) return "dark";
        if (docEl.classList.contains("v2p-theme-dawn")) return "dawn";
        if (docEl.classList.contains("v2p-theme-aqua")) return "aqua";
        if (docEl.classList.contains("v2p-theme-light-default")) return "light";
        return effectiveMode || "light";
    };

    const getResolvedMode = () => {
        let mode = localStorage.getItem(STORAGE_KEY) || "auto";
        if (mode === "auto") {
            mode =
                window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light";
        }
        return mode;
    };

    const getThemeColor = () => {
        const mode = getModeFromClass() || getResolvedMode();
        return THEME_BG_MAP[mode] || THEME_BG_MAP.light;
    };

    const THEME_META_ID = "v2p-theme-color";
    let syncingThemeMeta = false;
    const ensureThemeMeta = () => {
        // 只移除非本插件的 theme-color，避免触发反复重建
        document.querySelectorAll('meta[name="theme-color"]').forEach((m) => {
            if (m.id !== THEME_META_ID) m.remove();
        });
        let meta = document.getElementById(THEME_META_ID);
        if (!meta) {
            meta = document.createElement("meta");
            meta.id = THEME_META_ID;
            meta.name = "theme-color";
            document.head ? document.head.appendChild(meta) : docEl.appendChild(meta);
        }
        return meta;
    };

    const syncThemeColor = (color) => {
        if (syncingThemeMeta) return;
        syncingThemeMeta = true;
        const meta = ensureThemeMeta();
        meta.content = color;
        syncingThemeMeta = false;
    };

    // 初始同步
    syncThemeColor(initBg);

    // 持续监听：拦截原生 V2EX 对 theme-color 的可能修改
    const metaObserver = new MutationObserver(() => {
        if (syncingThemeMeta) return;
        const color = getThemeColor();
        const meta = ensureThemeMeta();
        if (meta.content !== color) meta.content = color;
    });
    const forceThemeColor = () => {
        syncThemeColor(getThemeColor());
    };

    // 当主题类发生变化时，主动同步一次
    const classObserver = new MutationObserver(() => {
        syncThemeColor(getThemeColor());
    });
    classObserver.observe(docEl, {
        attributes: true,
        attributeFilter: ["class"],
    });

    // 监听系统主题变化（auto 模式）
    if (window.matchMedia) {
        const mq = window.matchMedia("(prefers-color-scheme: dark)");
        const onMqChange = () => syncThemeColor(getThemeColor());
        if (mq.addEventListener) {
            mq.addEventListener("change", onMqChange);
        } else if (mq.addListener) {
            mq.addListener(onMqChange);
        }
    }

    // 等待 head 出现后开始监听
    let currentHead = null;
    const waitForHead = () => {
        if (document.head) {
            if (currentHead !== document.head) {
                currentHead = document.head;
            }
            metaObserver.observe(document.head, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["content"],
            });
        } else {
            requestAnimationFrame(waitForHead);
        }
    };
    waitForHead();

    // 监听 head 变更（某些导航会重建 head）
    const headSwapObserver = new MutationObserver(() => {
        if (document.head && document.head !== currentHead) {
            currentHead = document.head;
            metaObserver.observe(document.head, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ["content"],
            });
            forceThemeColor();
        }
    });
    headSwapObserver.observe(docEl, { childList: true, subtree: true });

    // 加载后短时间强制同步，避免地址栏随机回退
    const burstSync = () => {
        let count = 0;
        const id = setInterval(() => {
            forceThemeColor();
            count += 1;
            if (count >= 15) clearInterval(id);
        }, 200);
    };
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", burstSync);
    } else {
        burstSync();
    }
    window.addEventListener("pageshow", burstSync);
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") burstSync();
    });

    // 2. 注入 Loading 遮罩的样式（虽然 html hidden，但 loader 我们可以设为 visible）
    const loaderStyle = document.createElement("style");
    loaderStyle.innerHTML = `
        #v2p-loading-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: ${initBg};
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
            visibility: visible !important; /* 强制覆盖父级的 hidden */
            opacity: 1;
            transition: opacity 0.3s ease;
        }
        .v2p-spinner {
            width: 32px; height: 32px;
            border: 3px solid ${effectiveMode === "dark" ? "#374151" : "#e5e7eb"};
            border-top-color: ${effectiveMode === "dark" ? "#adbac7" : "#64748b"};
            border-radius: 50%;
            animation: v2p-spin 0.8s linear infinite;
        }
        @keyframes v2p-spin { to { transform: rotate(360deg); } }
    `;
    docEl.appendChild(loaderStyle);

    // [Fast Path] 2. 注入 Loading 元素
    const loader = document.createElement("div");
    loader.id = "v2p-loading-overlay";
    loader.innerHTML = '<div class="v2p-spinner"></div>';
    document.documentElement.appendChild(loader);

    // Remove loader when the page is stable
    const removeLoader = () => {
        if (loader) loader.remove();
        if (loaderStyle) loaderStyle.remove();

        // 恢复页面显示：移除所有防闪烁样式并添加加载完成类
        const antiFlashStyles = document.querySelectorAll("#v2p-anti-flash");
        antiFlashStyles.forEach((s) => s.remove());

        docEl.classList.add("v2p-loaded");
        docEl.style.visibility = "visible";
    };

    // Safety timeout: remove after 2s max just in case
    setTimeout(removeLoader, 2000);

    // Save for later removal in main execution
    window.__V2P_REMOVE_LOADER__ = removeLoader;

    // 4. 【插件完全控制主题】建立观察者，阻止 V2EX 原生主题干扰插件设置
    // 不再自动同步原生主题到插件，而是让插件完全控制主题
    const observer = new MutationObserver((mutations, obs) => {
        const wrapper = document.getElementById("Wrapper");
        if (wrapper) {
            // 记录原生状态供参考，但不再自动修改用户设置
            const isNativeDark = wrapper.classList.contains("Night");
            window.__V2P_NATIVE_NIGHT__ = isNativeDark ? 1 : 0;

            // 插件完全控制主题：根据用户设置来决定是否添加/移除 Night 类
            // 而不是让原生覆盖插件设置
            if (currentMode === "dark") {
                wrapper.classList.add("Night");
                docEl.classList.add("Night");
            } else {
                wrapper.classList.remove("Night");
                docEl.classList.remove("Night");
            }

            // 检测完成，断开观察，节省性能
            obs.disconnect();
        }
    });

    // 开始监听文档变化，等待 #Wrapper 出现
    observer.observe(document, { childList: true, subtree: true });

    // 5. 【拦截原生主题注入】阻止 V2EX 动态注入 SITE_NIGHT script 和 tomorrow-night.css
    const themeInterceptor = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType !== Node.ELEMENT_NODE) continue;

                // 拦截包含 SITE_NIGHT 的 script
                if (node.tagName === "SCRIPT" && node.textContent) {
                    if (node.textContent.includes("SITE_NIGHT")) {
                        // 根据插件设置决定是否需要修改
                        const wantDark = currentMode === "dark";
                        if (wantDark && node.textContent.includes("SITE_NIGHT = 0")) {
                            // 用户想要深色但原生注入浅色，移除这个 script
                            node.remove();
                        } else if (
                            !wantDark &&
                            node.textContent.includes("SITE_NIGHT = 1")
                        ) {
                            // 用户想要浅色但原生注入深色，移除这个 script
                            node.remove();
                        }
                    }
                }

                // 拦截 tomorrow-night.css 或 tomorrow.css 的 link
                if (node.tagName === "LINK" && node.rel === "stylesheet") {
                    const href = node.href || "";
                    const wantDark = currentMode === "dark";

                    if (!wantDark && href.includes("tomorrow-night.css")) {
                        // 用户想要浅色但注入了深色高亮 CSS，替换为浅色版本
                        node.href = href.replace("tomorrow-night.css", "tomorrow.css");
                    } else if (
                        wantDark &&
                        href.includes("tomorrow.css") &&
                        !href.includes("tomorrow-night.css")
                    ) {
                        // 用户想要深色但注入了浅色高亮 CSS，替换为深色版本
                        node.href = href.replace("tomorrow.css", "tomorrow-night.css");
                    }
                }
            }
        }
    });

    // 监听 head 和 body 的变化
    const startThemeInterceptor = () => {
        if (document.head) {
            themeInterceptor.observe(document.head, {
                childList: true,
                subtree: true,
            });
        }
        if (document.body) {
            themeInterceptor.observe(document.body, {
                childList: true,
                subtree: true,
            });
        } else {
            // body 还没出现，等待后再监听
            const bodyWatcher = new MutationObserver(() => {
                if (document.body) {
                    themeInterceptor.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                    bodyWatcher.disconnect();
                }
            });
            bodyWatcher.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
        }
    };

    if (document.head) {
        startThemeInterceptor();
    } else {
        requestAnimationFrame(startThemeInterceptor);
    }
})();
(function () {
    "use strict";
    var style = `
:root {
    --zidx-serach: 100;
    --zidx-tabs: 10;
    --zidx-tools-card: 10;
    --zidx-reply-box: 99;
    --zidx-modal-header: 50;
    --zidx-modal-mask: 888;
    --zidx-toast: 999;
    --zidx-tip: 99;
    --zidx-popup: 99;
    --zidx-expand-mask: 10;
    --zidx-expand-btn: 20;
    --v2p-underline-offset: 0.5ex;
    --v2p-layout-column-gap: 25px;
    --v2p-layout-row-gap: 20px;
    --v2p-nav-height: 55px;
    --v2p-tp-item-x: 18px;
    --v2p-tp-item-y: 18px;
    --v2p-tp-tabs-pd: 10px;
    --v2p-tp-nested-pd: 10px 5px 2px 10px;
    --v2p-tp-preview-pd: 20px;
    --v2p-emoji-size: 21px;
    --v2p-box-radius: 10px;
}
/* === 搜索框防闪烁核心样式 === */
/* 只有当 html 标签确切拥有 v2p-theme-dark-default 类时，搜索框才变黑 */
html.v2p-theme-dark-default body #search-container {
    background-color: #2d333b !important;
    border-color: #444c56 !important;
    transition: background-color 0.1s ease; /* 极短的过渡，掩盖微小渲染延迟 */
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
    --v2p-color-bg-tpr: var(--v2p-color-main-100);
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
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
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
    --v2p-color-bg-tpr: var(--v2p-color-main-100);
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
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
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
    /* visibility: hidden; */ /* 由即时执行块控制 */
}
body.v2p-theme-light-default,
body.v2p-theme-dark-default,
body.v2p-theme-dawn,
body.v2p-theme-aqua {
    /* visibility: visible; */ /* 统一由脚本控制 */
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
/* Logo样式 */
:root body #Logo,
#LogoMobile {
background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idjJleF9sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQxNSAxMTciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxNDIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiAjM2UzYTM5OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBjbGFzcz0ic3QwIj4KICAgIDxnIGNsYXNzPSJzdDAiPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTc1LjIsMjkuOWMyLjItOC4xLDUuNS0xMS40LDExLjctMTEuNHMxMS4yLDQsMTEuMiwxMC4xLS43LDUuNy0xLjcsOWwtMTQuNiw0NS42Yy0zLjcsMTEuNi05LjYsMTYuNS0xOS45LDE2LjVzLTE2LjUtNC45LTIwLjEtMTYuNWwtMTQuNi00NS42Yy0xLjEtMy41LTEuOC02LjYtMS44LTguOCwwLTYuMSw0LjctMTAuMywxMS4zLTEwLjNzOS44LDMuNiwxMiwxMS40bDEyLjksNDUuMmgxLjFsMTIuNC00NS4yaC4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE1LjQsNzUuOGwxOC42LTE4YzYuMi01LjksOC44LTkuOCw4LjgtMTMuOHMtMy41LTcuOS04LjUtNy45LTYuNywxLjctOS43LDUuOWMtMy4zLDQuMy01LjcsNS45LTkuNiw1LjlzLTkuMS0zLjYtOS4xLTguNmMwLTExLjIsMTMuNC0yMS40LDI5LjYtMjEuNHMyOS4yLDEwLjEsMjkuMiwyMy44LTQuNCwxNi41LTEzLjgsMjUuMWwtMTQuNiwxMy42di45aDIxYzYuNCwwLDEwLjQsMy41LDEwLjQsOS4xcy0zLjksOC45LTEwLjQsOC45aC00MC43Yy02LjIsMC0xMC40LTMuOC0xMC40LTkuM3MyLjMtNy43LDkuMi0xNC4yWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjc3LDMxLjJjMC03LjYsNC41LTEyLjEsMTItMTIuMWgzNy4yYzUsMCw4LjYsMy44LDguNiw5cy0zLjYsOC45LTguNiw4LjloLTI2LjN2MTMuOWgyNS4yYzQuNiwwLDcuNywzLjMsNy43LDguMnMtMy4xLDguMS03LjcsOC4xaC0yNS4ydjEzLjloMjZjNS4zLDAsOC45LDMuNiw4LjksOXMtMy42LDktOSw5aC0zNi44Yy03LjUsMC0xMi00LjUtMTItMTIuMVYzMS4zaDBaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDMuMiw4MS45bDE3LjgtMjMuMS0xOC4xLTIyLjZjLTItMi40LTMtNC45LTMtNy40LDAtNS45LDQuNy0xMC4zLDEwLjgtMTAuM3M2LjQsMS41LDExLjUsOC40bDEzLjIsMThoMWwxMi0xOGM0LjMtNi40LDYuOS04LjQsMTEuNC04LjRzMTAuOCw0LjUsMTAuOCwxMC4zLTEsNC45LTMsNy40bC0xOC4zLDIzLDE4LjgsMjIuNmMxLjksMi4zLDMsNC45LDMsNy40LDAsNS44LTQuNywxMC4zLTEwLjgsMTAuM3MtNi0xLjMtMTEuNS04LjRsLTEzLjEtMTdoLTFsLTEyLjEsMTdjLTQuOSw2LjctNy4xLDguNC0xMS41LDguNHMtMTAuNy00LjUtMTAuNy0xMC4zLDEuMS00LjksMy03LjRoLS4yWiIvPgogICAgPC9nPgogIDwvZz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuOSwxOS4ySDMuM2MtMS45LDAtMy4zLDEuNS0zLjMsMy40djIzLjFoNDcuNGMxLDAsMS45LjQsMi42LDEuMWwxMSwxMS41Yy4yLjMuMi43LDAsLjlsLTExLDExLjZjLS43LjctMS40LDEuMy0yLjQsMS4zSDB2MjMuMWMwLDEuOCwxLjUsMy4zLDMuMywzLjNoNTAuNWMxLjEsMCwyLjItLjQsMy0xLjJsMzQuMS0zMy44YzIuNi0yLjYsMi42LTYuOCwwLTkuNXEtMS43LTEuOCwwLDBMNTYuOCwyMC40Yy0uOC0uOC0xLjgtMS4yLTIuOS0xLjJoMFoiLz4KPC9zdmc+") !important;
width: 130px !important;
background-size: 130px 30px !important;
}

#LogoMobile {
background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0idjJleF9sb2dvIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQxNSAxMTciPgogIDwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAyOS4xLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiAyLjEuMCBCdWlsZCAxNDIpICAtLT4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLnN0MCB7CiAgICAgICAgaXNvbGF0aW9uOiBpc29sYXRlOwogICAgICB9CgogICAgICAuc3QxIHsKICAgICAgICBmaWxsOiAjM2UzYTM5OwogICAgICB9CiAgICA8L3N0eWxlPgogIDwvZGVmcz4KICA8ZyBjbGFzcz0ic3QwIj4KICAgIDxnIGNsYXNzPSJzdDAiPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMTc1LjIsMjkuOWMyLjItOC4xLDUuNS0xMS40LDExLjctMTEuNHMxMS4yLDQsMTEuMiwxMC4xLS43LDUuNy0xLjcsOWwtMTQuNiw0NS42Yy0zLjcsMTEuNi05LjYsMTYuNS0xOS45LDE2LjVzLTE2LjUtNC45LTIwLjEtMTYuNWwtMTQuNi00NS42Yy0xLjEtMy41LTEuOC02LjYtMS44LTguOCwwLTYuMSw0LjctMTAuMywxMS4zLTEwLjNzOS44LDMuNiwxMiwxMS40bDEyLjksNDUuMmgxLjFsMTIuNC00NS4yaC4xWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjE1LjQsNzUuOGwxOC42LTE4YzYuMi01LjksOC44LTkuOCw4LjgtMTMuOHMtMy41LTcuOS04LjUtNy45LTYuNywxLjctOS43LDUuOWMtMy4zLDQuMy01LjcsNS45LTkuNiw1LjlzLTkuMS0zLjYtOS4xLTguNmMwLTExLjIsMTMuNC0yMS40LDI5LjYtMjEuNHMyOS4yLDEwLjEsMjkuMiwyMy44LTQuNCwxNi41LTEzLjgsMjUuMWwtMTQuNiwxMy42di45aDIxYzYuNCwwLDEwLjQsMy41LDEwLjQsOS4xcy0zLjksOC45LTEwLjQsOC45aC00MC43Yy02LjIsMC0xMC40LTMuOC0xMC40LTkuM3MyLjMtNy43LDkuMi0xNC4yWiIvPgogICAgICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjc3LDMxLjJjMC03LjYsNC41LTEyLjEsMTItMTIuMWgzNy4yYzUsMCw4LjYsMy44LDguNiw5cy0zLjYsOC45LTguNiw4LjloLTI2LjN2MTMuOWgyNS4yYzQuNiwwLDcuNywzLjMsNy43LDguMnMtMy4xLDguMS03LjcsOC4xaC0yNS4ydjEzLjloMjZjNS4zLDAsOC45LDMuNiw4LjksOXMtMy42LDktOSw5aC0zNi44Yy03LjUsMC0xMi00LjUtMTItMTIuMVYzMS4zaDBaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNDMuMiw4MS45bDE3LjgtMjMuMS0xOC4xLTIyLjZjLTItMi40LTMtNC45LTMtNy40LDAtNS45LDQuNy0xMC4zLDEwLjgtMTAuM3M2LjQsMS41LDExLjUsOC40bDEzLjIsMThoMWwxMi0xOGM0LjMtNi40LDYuOS04LjQsMTEuNC04LjRzMTAuOCw0LjUsMTAuOCwxMC4zLTEsNC45LTMsNy40bC0xOC4zLDIzLDE4LjgsMjIuNmMxLjksMi4zLDMsNC45LDMsNy40LDAsNS44LTQuNywxMC4zLTEwLjgsMTAuM3MtNi0xLjMtMTEuNS04LjRsLTEzLjEtMTdoLTFsLTEyLjEsMTdjLTQuOSw2LjctNy4xLDguNC0xMS41LDguNHMtMTAuNy00LjUtMTAuNy0xMC4zLDEuMS00LjksMy03LjRoLS4yWiIvPgogICAgPC9nPgogIDwvZz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNTMuOSwxOS4ySDMuM2MtMS45LDAtMy4zLDEuNS0zLjMsMy40djIzLjFoNDcuNGMxLDAsMS45LjQsMi42LDEuMWwxMSwxMS41Yy4yLjMuMi43LDAsLjlsLTExLDExLjZjLS43LjctMS40LDEuMy0yLjQsMS4zSDB2MjMuMWMwLDEuOCwxLjUsMy4zLDMuMywzLjNoNTAuNWMxLjEsMCwyLjItLjQsMy0xLjJsMzQuMS0zMy44YzIuNi0yLjYsMi42LTYuOCwwLTkuNXEtMS43LTEuOCwwLDBMNTYuOCwyMC40Yy0uOC0uOC0xLjgtMS4yLTIuOS0xLjJoMFoiLz4KPC9zdmc+");
}
/* 深色模式下反转 Logo 颜色 */
html.Night #Logo {
filter: invert(1) brightness(0.9) contrast(0.9);
}

/* 布局和间距 */
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

body form textarea#topic_title {
margin: 10px 0;
}

/* 字体设置 - 全局 */
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
/* 标题和内容样式 */
.item_title a {
font-weight: normal !important;
}

.item_title,
.item_hot_topic_title,
.payload {
line-height: 1.6;
}

/* 头像圆角 */
img.avatar,
.avatar,
.cell[class*="hot_t_"] img[alt] {
border-radius: 50% !important;
width:40px !important;
max-height:40px !important;
}
/* 热门主题小头像单独设置尺寸 */
.cell[class*="hot_t_"] img[alt] {
width: 24px !important;
max-height: 24px !important;
}

/* 节点和标签样式 */
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

/* 内容宽度限制 */
.content {
max-width: 1200px !important;
}
#Top>.content {
max-width: 1110px !important;
}

/* 隐藏将被替换的旧图标，防止闪烁 */
img[src*="compose.png"],
img[src*="reply_neue.png"],
img[src*="unheart.png"],
img[src*="heart.png"] {
    display: none !important;
}

/* 成员活动条 */
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
    transition: background-color 0.2s ease; /* 新增这行：让颜色变化更柔和 */
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
/* 标准提交按钮：使用主题强调色 */
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
/* Previous/Next buttons customized */
/* 仅针对 .normal_page_right (通常是分页的小箭头按钮)，去掉 generic .normal 以免误伤“现在注册”等普通按钮 */
body .super.button.normal_page_right:not(button) {
    display: inline-block !important; /* Fix table-cell layout issue */
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
/* 主题页操作按钮图标化（收藏/分享/忽略/感谢） */
#Main .header .fr {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
}
#Main .header .fr a.op.v2p-op-icon {
    width: 28px;
    height: 28px;
    padding: 0 !important;
    border-radius: 50% !important;
    line-height: 1 !important;
    font-size: 0 !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
#Main .header .fr a.op.v2p-op-icon svg {
    width: 14px;
    height: 14px;
    display: block;
}
body .cell_ops {
    background-color: rgba(0, 0, 0, 0);
}
a.dark:active, a.dark:link, a.dark:visited {
    color: inherit !important;;
    text-decoration: none;
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"][href^="http"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/"] {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
    color: var(--v2p-color-accent-500);
    background-color: var(--v2p-color-accent-50);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"][href^="http"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/"]:hover {
    color: var(--v2p-color-accent-500);
    background-color: var(--v2p-color-accent-50);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"] {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
    color: currentColor;
    background-color: var(--v2p-color-bg-link);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"]:hover {
    color: currentColor;
    background-color: var(--v2p-color-bg-link-hover);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"]:has(> .embedded_image),
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"]:has(> .embedded_image),
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"]:has(> .embedded_image) {
    background-color: rgba(0, 0, 0, 0);
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
    margin: 6px 10px 8px;   /* 上右下左：这里重点是 margin-bottom: 8px; */
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
#Top .tools .top:not(.v2p-hover-btn):hover {
    background-color: var(--v2p-color-button-background-hover);
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
    padding: var(--v2p-tp-item-x) var(--v2p-tp-item-y);
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
#Main .topic_buttons a.tb:link:not(.v2p-hover-btn) {
    color: var(--v2p-color-font-secondary);
}
#Main .topic_buttons a.tb:link:hover:not(.v2p-hover-btn) {
    color: currentColor;
    background: var(--v2p-color-bg-block);
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
#Main .cell .topic_info span:first-of-type,
#Main .cell .topic_info .v2p-topic-actions {
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
    .v2p-modal-content
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
    padding: var(--v2p-tp-tabs-pd);
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
#Main #Tabs .tab.v2p-hover-btn::before {
    inset: 0;
    border: 1px solid transparent;
    box-sizing: border-box;
    transform: none;
    opacity: 0;
    display: none !important;
}
#Main #Tabs .tab.v2p-hover-btn:hover::before {
    transform: none;
    opacity: 1;
    display: none !important;
}
#Main #Tabs .tab.v2p-hover-btn,
#Tabs .tab.v2p-hover-btn {
    overflow: hidden;
}
/* Tabs hover 直接用背景色，禁用伪元素动画 */
#Main #Tabs .tab.v2p-hover-btn:hover,
#Tabs .tab.v2p-hover-btn:hover {
    background-color: var(--v2p-color-bg-hover-btn);
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
#Main .tab {
    user-select: none;
    color: var(--v2p-color-foreground);
    background-color: rgba(0, 0, 0, 0);
}
#Main .tab:not(.v2p-hover-btn):hover {
    background-color: var(--v2p-color-bg-block);
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
.wwads-cn {
    border: none !important;
    box-shadow: none !important;
}
.box:has(a[href^="/advertise"]) {
    overflow: hidden;
    border: none !important;
    box-shadow: none !important;
}
.box:has(a[href^="/advertise"]) .sidebar_compliance {
    background-color: var(--v2p-color-bg-block);
}
.inner table {
table-layout: fixed;
}
/* --- 这里替换原文件中的深色模式 CSS --- */
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
    --v2p-toast-shadow: none;
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
    background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex-alt%402x.svg");
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
/* --- SAFARI FIX 强制补丁 (整合版) --- */

    /* 1. Tabs 标签栏修复 */
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
    html.v2p-theme-dark-default #Tabs .tab_current,
    html.v2p-theme-dark-default .v2p-mobile #Tabs a.tab_current {
        color: #fff !important;
        background-color: var(--v2p-color-accent-500) !important;
        border: none !important;
    }

    /* 2. Livid/Count 计数背景色修复 */
    html.v2p-theme-dark-default .count_livid,
    html.v2p-theme-dark-default #Main .cell .count_livid,
    html.v2p-theme-dawn #Main .cell .count_livid,
    html.v2p-theme-aqua #Main .cell .count_livid,

    html.v2p-theme-dark-default a.count_livid,
    html.v2p-theme-dark-default .v2p-mobile a.count_livid {
        color: var(--v2p-color-button-foreground) !important;
        background-color: var(--v2p-color-bg-block) !important;
        border: none !important;
    }

    /* 3. [新增] 移动端菜单 (Menu Body) 修复 */
    /* 强制菜单容器背景变黑 */
    html.v2p-theme-dark-default #menu-body,
    html.v2p-theme-dark-default .v2p-mobile #menu-body {
        background-color: var(--v2p-color-bg-content) !important;
        border: 1px solid var(--v2p-color-border) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
    }

    /* 强制菜单内文字颜色变亮 */
    html.v2p-theme-dark-default #menu-body .cell a,
    html.v2p-theme-dark-default #menu-body .cell a.top,
    html.v2p-theme-dark-default .v2p-mobile #menu-body .cell a {
        color: var(--v2p-color-foreground) !important;
        background-color: transparent !important;
    }

    /* 修复菜单内图标可能的白底问题 */
    html.v2p-theme-dark-default #menu-body img.tool-icon {
         filter: brightness(0.8); /*稍微压暗一点图标以免太刺眼*/
    }
    html.v2p-theme-dark-default .no {
         background-color:var(--v2p-color-main-100);
         margin-top:-3px;
         border-radius:99px;
    }
    /* PRO 标识深色模式适配 */
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
/* ==========================================================================
   移动端楼中楼 (Nested Replies) 专属优化
   ========================================================================== */

/* 1. 针对移动端，大幅减小嵌套回复的左缩进，改用“左侧边框”来体现层级 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] {
    margin: 6px 0 6px 8px !important; /* 左缩进仅保留 8px */
    padding: 8px 6px !important;      /* 减小内边距 */
    border: none !important;
    border-left: 2px solid var(--v2p-color-divider) !important; /* 使用实线边框表示层级 */
    border-radius: 0 4px 4px 0 !important; /* 仅右侧圆角 */
    background-color: var(--v2p-color-bg-subtle) !important; /* 稍微深一点的背景 */
}

/* 2. 处理多层嵌套时的背景叠加问题，避免太深 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"] {
    background-color: var(--v2p-color-bg-content) !important; /* 第三层变回亮色/暗色背景，形成交替感 */
    margin-left: 6px !important;
    border-left: 2px solid var(--v2p-color-accent-400) !important; /* 第三层换个边框色（可选） */
}

/* 3. 移动端嵌套回复中，头像和用户名的布局微调 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] table tr td:nth-child(1) {
    width: 28px !important; /* 稍微限制头像列宽 */
}

.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .avatar {
    width: 20px !important; /* 嵌套回复头像缩小，节省空间 */
    height: 20px !important;
}

/* 4. 隐藏嵌套回复中一些不必要的元素以节省空间 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .ago {
    font-size: 10px !important; /* 时间字体变小 */
}
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .no {
    display: none !important; /* 移动端嵌套内隐藏楼层号，避免干扰 */
}

/* 5. 修复移动端回复内容的行高和字体 */
.v2p-mobile .reply_content {
    font-size: 15px !important;
    line-height: 1.5 !important;
    overflow-wrap: break-word; /* 强行换行，防止长链接撑破布局 */
}

/* 6. 确保父级 Cell 在移动端不会因为 Padding 导致宽度不够 */
.v2p-mobile #Main .cell[id^="r"] {
    padding-right: 5px !important;
    padding-left: 5px !important;
}

@supports not selector(:has(*)) {
    :root #Wrapper.Night {
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
        --v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);
        --v2p-color-bg-subtle: #f7f7f7;
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
        --v2p-box-shadow: 0 0 0 1px var(--v2p-color-border);
        --v2p-toast-shadow: none;
        --link-color: var(--v2p-color-foreground);
        --box-background-alt-color: var(--v2p-color-main-100);
        --box-background-hover-color: var(--v2p-color-main-300);
        --button-hover-color: var(--button-background-hover-color);
        --button-border-color: var(--v2p-color-border);
        --button-border-hover-color: #768390;
        visibility: visible;
    }
    :root #Wrapper.Night #Logo {
        background-image: url("https://www.v2ex.com/static/img/v2ex-alt@2x.png");
    }
    :root #Wrapper.Night::selection {
        color: var(--v2p-color-background, #1c2128);
        background-color: var(--v2p-color-foreground, #adbac7);
    }
    :root #Wrapper.Night img::selection {
        background-color: var(--v2p-color-foreground, #adbac7);
    }
}
body.v2p-theme-dawn,
.v2p-theme-dawn {
    --v2p-color-base: 32deg 57% 95%;
    --v2p-color-surface: 35deg 100% 98%;
    --v2p-color-overlay: 33deg 43% 91%;
    --v2p-color-muted: 257deg 9% 61%;
    --v2p-color-subtle: 248deg 12% 52%;
    --v2p-color-text: 248deg 19% 40%;
    --v2p-color-love: 343deg 35% 55%;
    --v2p-color-gold: 35deg 81% 56%;
    --v2p-color-rose: 3deg 53% 67%;
    --v2p-color-pine: 197deg 53% 34%;
    --v2p-color-foam: 189deg 30% 48%;
    --v2p-color-iris: 268deg 21% 57%;
    --v2p-color-main-600: hsl(47, 48.15%, 21.26%)
    --v2p-color-accent-50: hsl(var(--v2p-color-foam) / 10%);
    --v2p-color-accent-100: hsl(var(--v2p-color-foam) / 20%);
    --v2p-color-accent-200: hsl(var(--v2p-color-foam) / 30%);
    --v2p-color-accent-300: hsl(var(--v2p-color-foam) / 40%);
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: hsl(var(--v2p-color-foam) / 65%);
    --v2p-color-accent-600: hsl(var(--v2p-color-foam) / 80%);
    --v2p-color-orange-50: hsl(var(--v2p-color-gold) / 10%);
    --v2p-color-orange-100: hsl(var(--v2p-color-gold) / 20%);
    --v2p-color-orange-400: hsl(var(--v2p-color-gold));
    --v2p-color-background: hsl(var(--v2p-color-base));
    --v2p-color-foreground: hsl(38.09deg 19% 40%);
    --v2p-color-selection-foreground: var(--v2p-color-foreground);
    --v2p-color-selection-background: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-selection-background-img: hsl(var(--v2p-color-muted) / 60%);
    --v2p-color-font-secondary: hsl(37.89deg 18.63% 40%);
    --v2p-color-font-tertiary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-quaternary: hsl(var(--v2p-color-subtle));
    --v2p-color-button-background: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: hsl(var(--v2p-color-text) / 15%);
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);
    --v2p-color-bg-content: hsl(var(--v2p-color-surface));
    --v2p-color-bg-content-rgb: 250, 244, 237;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);
    --v2p-color-bg-subtle: hsl(var(--v2p-color-pine) / 10%);
    --v2p-color-bg-input: hsl(var(--v2p-color-overlay) / 40%);
    --v2p-color-bg-search: hsl(var(--v2p-color-overlay) / 60%);
    --v2p-color-bg-search-active: hsl(var(--v2p-color-overlay) / 90%);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: #faf4ed;
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: hsl(34deg 53% 34% / 10%);
    --v2p-color-bg-tpr: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-avatar: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-block: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-block-darker: hsl(var(--v2p-color-text) / 25%);
    --v2p-color-bg-link: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-link-hover: hsl(var(--v2p-color-text) / 15%);
    --v2p-color-tabs: hsl(46.92deg 53% 34%);
    --v2p-color-heart: #eb6f92;
    --v2p-color-heart-fill: rgb(235 111 146 / 50%);
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-border: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-input-border: rgb(152 147 165 / 20%);
    --v2p-color-border-darker: hsl(var(--v2p-color-muted) / 40%);
    --v2p-color-link-visited: hsl(37.89, 18.63%, 60%);
    --v2p-color-error: #eb6f92;
    --v2p-color-bg-error: #fee2e2;

    --v2p-color-cell-num: hsl(var(--v2p-color-subtle));
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --link-color: var(--v2p-color-foreground);
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-bg-block);
    --box-background-hover-color: var(--v2p-color-bg-link-hover);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: var(--v2p-color-border-darker);
    visibility: visible;
}
body.v2p-theme-dawn .button.special:hover,
body.v2p-theme-dawn .button.special:hover:enabled,
.v2p-theme-dawn .button.special:hover,
.v2p-theme-dawn .button.special:hover:enabled {
    text-shadow: none;
}

body.v2p-theme-aqua,
.v2p-theme-aqua {
    /* --- 核心颜色调整：从暖色 (32deg) 切换到冷色 (210-230deg) --- */

    /* 基础和表面色：非常浅、高饱和度的冷白/浅灰蓝 */
    --v2p-color-base: 220deg 18% 97%;   /* 整体背景: 略带蓝色的浅灰色 */
    --v2p-color-surface: 240deg 100% 100%; /* 内容卡片背景: 纯白或极浅蓝白 */
    --v2p-color-overlay: 210deg 12% 90%;  /* 遮罩/输入框背景: 干净的浅灰色 */

    /* 文本颜色：使用深蓝色或深灰色以提供高对比度 */
    --v2p-color-muted: 215deg 10% 55%;  /* 次要文本: 中等冷灰 */
    --v2p-color-subtle: 220deg 15% 45%; /* 次级文本: 较深的冷灰 */
    --v2p-color-text: 220deg 25% 25%;  /* 主文本: 接近黑色的深蓝灰 */

    /* 强调色：Aqua/Cyan/Blue，用于链接和高光 */
    --v2p-color-love: 345deg 60% 55%;  /* 红色/点赞: 保持一个略冷的洋红/玫瑰色 */
    --v2p-color-gold: 35deg 81% 56%;   /* 警告/金: 保持不变，或略调冷*/
    --v2p-color-rose: 3deg 53% 67%;    /* 错误/玫瑰: 保持不变 */
    --v2p-color-pine: 180deg 53% 34%;  /* 蓝绿色/主要强调色 (Pine -> Cyan) */
    --v2p-color-foam: 195deg 70% 45%;  /* 强调色 (Aqua/Foam) */
    --v2p-color-iris: 240deg 50% 60%;  /* 紫色/次要强调色 (Iris -> Blue) */

    /* --- 衍生色（强调色使用 --v2p-color-iris，以提供蓝色高光） --- */
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: hsl(var(--v2p-color-iris) / 20%);
    --v2p-color-accent-200: hsl(var(--v2p-color-iris) / 30%);
    --v2p-color-accent-300: hsl(var(--v2p-color-iris) / 40%);
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: hsl(var(--v2p-color-iris) / 65%);
    --v2p-color-accent-600: hsl(var(--v2p-color-iris) / 80%);
    --v2p-color-orange-50: hsl(var(--v2p-color-gold) / 10%);
    --v2p-color-orange-100: hsl(var(--v2p-color-gold) / 20%);
    --v2p-color-orange-400: hsl(var(--v2p-color-gold));

    /* --- 背景 & 字体 --- */
    --v2p-color-background: #f2f7fa;
    --v2p-color-foreground: hsl(var(--v2p-color-text));

    --v2p-color-selection-foreground: var(--v2p-color-surface); /* 选中字体为白色 */
    --v2p-color-selection-background: hsl(var(--v2p-color-iris) / 60%); /* 选中背景为蓝色 */
    --v2p-color-selection-background-img: hsl(var(--v2p-color-iris) / 80%);

    --v2p-color-font-secondary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-tertiary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-quaternary: hsl(var(--v2p-color-subtle));

    /* --- 交互元素 --- */
    --v2p-color-button-background: hsl(var(--v2p-color-iris) / 10%); /* 按钮背景使用冷色调 */
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: hsl(var(--v2p-color-iris) / 15%);
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);

    /* --- 界面元素 --- */
    --v2p-color-bg-content: hsl(var(--v2p-color-surface)); /* 内容卡片使用纯白 */
    --v2p-color-bg-content-rgb: 255, 255, 255;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: hsl(var(--v2p-color-iris) / 10%); /* 按钮悬停使用冷色高光 */
    --v2p-color-bg-subtle: hsl(var(--v2p-color-iris) / 10%);
    --v2p-color-bg-input: hsl(var(--v2p-color-overlay) / 50%);
    --v2p-color-bg-search: hsl(var(--v2p-color-overlay) / 70%);
    --v2p-color-bg-search-active: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-widget: rgb(255 255 255 / 85%); /* 略带透明的白色 */
    --v2p-color-bg-reply: #f3f6fa; /* 浅浅的冷蓝色背景 */
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: hsl(var(--v2p-color-iris) / 5%);
    --v2p-color-bg-tpr: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-avatar: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-block: hsl(var(--v2p-color-iris) / 5%); /* 内容块极浅蓝色背景 */
    --v2p-color-bg-block-darker: hsl(var(--v2p-color-iris) / 15%);
    --v2p-color-bg-link: hsl(var(--v2p-color-iris) / 10%);
    --v2p-color-bg-link-hover: hsl(var(--v2p-color-iris) / 15%);

    --v2p-color-tabs: #394d65; /* Tabs 使用蓝色强调 */

    /* --- 边框 & 阴影 --- */
    --v2p-color-divider: hsl(var(--v2p-color-muted) / 15%); /* 更浅的边框 */
    --v2p-color-border: hsl(var(--v2p-color-muted) / 15%);
    --v2p-color-input-border: hsl(220deg 15% 75%); /* 浅灰色冷调输入框边框 */
    --v2p-color-border-darker: hsl(var(--v2p-color-muted) / 30%);

    /* --- 其他 --- */
    --v2p-color-link-visited: hsl(var(--v2p-color-subtle));
    --v2p-color-error: #eb6f92;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: hsl(var(--v2p-color-subtle));
    --v2p-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 6%), 0 1px 3px 0 rgb(0 0 0 / 4%); /* 调整为更轻的阴影 */
    --v2p-widget-shadow: 0 6px 16px -3px rgb(0 0 0 / 4%),
        0 2px 4px -1px rgb(0 0 0 /8%); /* 调整为更轻的阴影 */
    --v2p-toast-shadow: var(--v2p-widget-shadow);

    /* --- 别名 (使用 Accent Color Blue) --- */
    --link-color: #394d65; /* 链接使用蓝色 */
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-bg-block);
    --box-background-hover-color: var(--v2p-color-bg-link-hover);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: var(--v2p-color-border-darker);

    visibility: visible;
}

body {
    position: relative;
}
body.v2p-modal-open {
    overflow: hidden;
}
body .button.v2p-prev-btn,
body .button.v2p-next-btn {
    padding: 0 15px;
}
body #Top a:has(#Logo.v2p-logo) {
    display: inline-flex;
    align-items: center;
}
body #Logo.v2p-logo {
    width: unset;
    height: 25px;
    padding: 0 8px;
    background-image: none !important;
}
.v2p-hover-btn {
    cursor: pointer;
    user-select: none;
    position: relative;
    z-index: 1;
    margin: 0;
    text-decoration: none;
    white-space: nowrap;
    background: none;
    background-color: rgba(0, 0, 0, 0);
    transition: color 0.2s;
}
.v2p-hover-btn::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0;
    transform: scale(0.65);
    opacity: 0;
    background-color: var(--v2p-color-bg-hover-btn);
    border-radius: 99px;
    transition:
        background-color 0.15s,
        color 0.15s,
        transform 0.15s,
        opacity 0.15s;
}
.v2p-hover-btn:hover {
    text-decoration: none;
}
.v2p-hover-btn:hover::before {
    transform: scale(1);
    opacity: 1;
}
.v2p-hover-btn-disabled {
    pointer-events: none;
    opacity: 0.8;
}
.v2p-icon-heart {
    display: inline-flex;
    width: 14px;
    height: 14px;
    color: var(--v2p-color-heart);
}
.v2p-icon-heart svg {
    fill: var(--v2p-color-heart-fill);
}

.node {
    border-radius:99px !important;
}
#Main .cell[id^="r"] .v2p-auto-hide {
    overflow: hidden;
    display: inline-flex;
    width: 0;
}
#Main #reply-box .v2p-reply-preview {
    font-size: 15px;
    line-height: 1.6;
}
#Main .cell:hover .v2p-topic-preview-btn,
#Main .cell:hover .v2p-topic-ignore-btn,
#Rightbar .cell:hover .v2p-topic-preview-btn,
#Rightbar .cell:hover .v2p-topic-ignore-btn {
    visibility: visible;
}
#Rightbar .v2p-info-row {
    display: block;
    font-size: 12px;
    color: var(--v2p-color-accent-500);
    text-align: center;
}
#Rightbar .v2p-info-row:hover {
    text-decoration: none;
    background-color: var(--v2p-color-accent-50);
}
#Rightbar .v2p-topic-preview-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    height: 20px;
    font-size: 12px;
    backdrop-filter: blur(8px);
    box-shadow: 0 0 0 3px var(--v2p-color-bg-content);
}

.v2p-tool-box {
    position: sticky;
    z-index: var(--zidx-tools-card);
    top: var(--v2p-layout-row-gap);
}
.v2p-tool-box .v2p-tools {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 15px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--v2p-color-font-secondary);
}
.v2p-tool {
    display: inline-flex;
    gap: 0 5px;
    align-items: center;
    padding: 3px 0;
}
.v2p-tool:hover {
    color: var(--v2p-color-button-foreground-hover);
}
.v2p-tool .v2p-tool-icon {
    width: 16px;
    height: 16px;
}
.v2p-topic-actions {
    display: inline-flex;
    gap: 2px 10px;
}
.v2p-topic-preview-btn {
    cursor: pointer;
    font-size: 13px;
    color: var(--v2p-color-button-foreground);
    visibility: hidden;
    background-color: var(--v2p-color-button-background-hover);
    border: none;
    border-radius: 3px;
    outline: none;
}
.v2p-topic-ignore-btn {
    cursor: pointer;
    margin-left: 8px;
    visibility: hidden;
}
.v2p-topic-preview {
    font-size: 15px;
    line-height: 1.6;
    padding: var(--v2p-tp-preview-pd);
}
.v2p-tpr-loading {
    --tpr-h: 30px;
    --tpr-h-p: 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 25px;
}
.v2p-tpr-loading .v2p-tpr {
    background-color: var(--v2p-color-bg-tpr);
    border-radius: 5px;
}
.v2p-tpr-loading .v2p-tpr-info {
    display: flex;
    gap: 15px;
    align-items: center;
}
.v2p-tpr-info-avatar {
    width: var(--tpr-h);
    height: var(--tpr-h);
}
.v2p-tpr-info-text {
    width: 50%;
    height: var(--tpr-h);
}
.v2p-tpr-loading .v2p-tpr-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 15px 0 20px;
}
.v2p-tpr-loading .v2p-tpr-content .v2p-tpr-content-p {
    height: var(--tpr-h-p);
}
.v2p-tpr-loading .v2p-tpr-cmt {
    display: flex;
    gap: 15px;
    padding-top: 15px;
    border-top: 1px solid var(--v2p-color-border);
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-avatar {
    width: 50px;
    height: 50px;
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-header {
    width: 50%;
    height: var(--tpr-h);
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-p {
    height: var(--tpr-h-p);
}
.v2p-tp-info-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}
.v2p-tp-info,
.v2p-tp-read {
    overflow: hidden;
    display: inline-flex;
    gap: 20px;
    align-items: center;
    padding: 5px 10px;
    font-size: 13px;
    background-color: var(--v2p-color-button-background);
    border-radius: 5px;
}
.v2p-tp-read {
    cursor: pointer;
    user-select: none;
    gap: 4px;
}
.v2p-tp-read:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-tp-read-icon {
    width: 16px;
    height: 16px;
}
.v2p-tp-member {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    font-weight: bold;
}
.v2p-tp-avatar {
    width: 20px;
    height: 20px;
    background-color: var(--v2p-color-bg-avatar);
    border-radius: 3px;
}
.v2p-topic-preview-addons {
    margin-top: 30px;
}
#Main.v2p-topic-preview > .box {
    border: 1px solid var(--v2p-color-border);
}
a.v2p-topic-preview-title-link:hover {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
}
.v2p-dot {
    margin: 0 8px;
    font-size: 15px;
    font-weight: 800;
}
.v2p-paging {
    background: none !important;
}
.v2p-paging.cell {
    border-bottom: none;
}
.v2p-modal-mask {
    position: fixed;
    z-index: var(--zidx-modal-mask);
    inset: 0;
    overflow: hidden;
    overflow-y: auto;
    padding: min(2vh, 60px);
    background-color: var(--v2p-color-mask);
}
.v2p-popup {
    font-size: 14px;
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
    position: absolute;
    z-index: 2000; /* Ensure it's above other elements */
    top: 0;
    left: 0;
}
.v2p-popup-content {
    overflow-y: auto;
    width: max-content;
}
.v2p-toast {
    position: fixed;
    z-index: var(--zidx-toast);
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 15px;
    font-size: 14px;
    color: var(--v2p-color-background);
    background: var(--v2p-color-foreground);
    border-radius: 8px;
    box-shadow: var(--v2p-toast-shadow);
}
.v2p-modal-main {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 800px;
    height: 100%;
    margin: 0 auto;
    background-color: var(--v2p-color-bg-content);
    border-radius: var(--box-border-radius);
}
.v2p-modal-header {
    display: flex;
    gap: 0 20px;
    align-items: center;
    padding: 15px 20px 20px;
    background-color: var(--v2p-color-bg-content);
    border-bottom: 1px solid var(--box-border-color);
}
.v2p-modal-title {
    overflow: hidden;
    padding: 2px 0;
    font-size: 16px;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.v2p-modal-actions {
    display: flex;
    gap: 0 10px;
    align-items: center;
    margin-left: auto;
}
.v2p-modal-content {
    position: relative;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    flex: 1;
    outline: none;
}
.v2p-modal-content #Main.v2p-topic-preview > .box {
    border: none;
    box-shadow: none;
}
.v2p-modal-comments {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: 0 20px;
    visibility: hidden;
}
.v2p-modal-comments.v2p-tab-content-active {
    z-index: 20;
    visibility: visible;
}
.v2p-modal-comment-tabs {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 5px;
    font-size: 14px;
    font-weight: normal;
    background-color: var(--button-background-color);
    border-radius: 4px;
}
.v2p-modal-comment-tabs > [data-tab-key] {
    cursor: pointer;
    padding: 4px 5px;
    border-radius: 4px;
}
.v2p-modal-comment-tabs > [data-tab-key]:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-modal-comment-tabs > [data-tab-key].v2p-tab-active {
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-accent-100);
}
.v2p-no-pat {
    padding: 30px 20px;
    font-size: 15px;
    text-align: center;
}
.v2p-no-pat .v2p-no-pat-title {
    font-size: 16px;
    font-weight: bold;
}
.v2p-no-pat .v2p-no-pat-desc {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
}
.v2p-no-pat .v2p-no-pat-block {
    display: inline-flex;
    align-items: center;
    margin: 0 5px;
    padding: 2px 10px;
    background-color: var(--v2p-color-bg-block);
    border-radius: 2px;
}
.v2p-no-pat .v2p-no-pat-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 800px;
    margin-top: 20px;
    padding: 20px;
    background-color: var(--v2p-color-bg-block);
    border-radius: 10px;
}
.v2p-no-pat .v2p-no-pat-step {
    flex: 1;
}
.v2p-no-pat .v2p-no-pat-img {
    width: 100%;
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
}
.v2p-no-pat .v2p-icon-logo {
    width: 15px;
    height: 15px;
}
.v2p-likes-box {
    user-select: none;
    position: relative;
    top: 3px;
    display: inline-flex;
    column-gap: 5px;
    align-items: center;
}
.v2p-likes-box.v2p-thanked {
    font-weight: bold;
    color: var(--v2p-color-heart);
    opacity: 0.8;
}
.v2p-likes-box.v2p-thanked .v2p-icon-heart svg {
    fill: var(--v2p-color-heart);
}
@supports not selector(:has(*)) {
    #Main .cell[id^="r"] > table:hover .v2p-controls {
        opacity: 1;
    }
}
@supports selector(:has(*)) {
    #Main .cell[id^="r"]:not(:has(.cell:hover)) > table:hover .v2p-auto-hide {
        width: auto;
    }
    #Main .cell[id^="r"]:not(:has(.cell:hover)) > table:hover .v2p-controls {
        opacity: 1;
    }
}
.v2p-controls {
    display: inline-flex;
    column-gap: 15px;
    margin-right: 15px;
    font-size: 12px;
    opacity: 0;
}
.v2p-controls svg {

    opacity: 1 !important;    /* 保证颜色一致 */
}
.v2p-controls > a {
    text-decoration: none;
}
.v2p-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 4px 0;
    color: var(--v2p-color-font-tertiary);
}
.v2p-control::after {
    pointer-events: none;
    z-index: var(--zidx-tip);
    overflow: hidden;
    width: max-content;
    min-width: 30px;
    padding: 2px 5px;
    font-size: 12px;
    color: var(--v2p-color-foreground);
    text-align: center;
    white-space: nowrap;
    background-color: var(--v2p-color-bg-tooltip);
    border-radius: 4px;
    box-shadow: var(--v2p-widget-shadow);
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    opacity: 0;
}
.v2p-control:hover {
    color: var(--v2p-color-font-secondary);
}
.v2p-control.v2p-thanked {
    cursor: default;
    color: var(--v2p-color-heart);
}
.v2p-control:hover::after {
    opacity: 1;
}
.v2p-control.v2p-control-hide::after {
    content: "\u9690\u85CF\u56DE\u590D";
}
.v2p-control.v2p-control-thank::after {
    content: "\u611F\u8C22\u56DE\u590D";
}
.v2p-control.v2p-control-thank.v2p-thanked::after {
    content: "\u5DF2\u611F\u8C22";
}
.v2p-control.v2p-control-reply::after {
    content: "\u56DE\u590D";
}
.topic_buttons .v2p-tb.v2p-hover-btn {
    color: var(--v2p-color-font-secondary);
}
.topic_buttons .v2p-tb.v2p-hover-btn::after {
    display: none;
}
.topic_buttons .v2p-tb.v2p-hover-btn:hover {
    color: currentColor;
}
.v2p-tb-icon {
    width: 15px;
    height: 15px;
}
.v2p-emoji-container {
    overflow-y: auto;
    max-height: 285px;
    padding: 15px 18px;
    color: var(--v2p-color-font-secondary);
}
.v2p-member-card {
    max-width: 300px;
    max-height: 285px;
    padding: 12px;
    font-size: 13px;
    text-align: left;
}
.v2p-member-card .v2p-info {
    display: flex;
    gap: 15px;
}
.v2p-member-card .v2p-info-right {
    padding: 2px 0;
}
.member-activity-mobile-wrapper {
    margin:0 10px !important;
}
.v2p-member-card .v2p-avatar-box {
    overflow: hidden;
    display: inline-block;
    width: 73px;
    height: 73px;
    background-color: var(--button-background-hover-color);
    border-radius: 5px;
}
.v2p-member-card .v2p-avatar {
    width: 100%;
    height: 100%;
}
.v2p-member-card .v2p-username {
    font-size: 16px;
    font-weight: bold;
}
.v2p-member-card .v2p-no {
    margin: 5px 0;
}
.v2p-member-card .v2p-no,
.v2p-member-card .v2p-created-date {
    width: 160px;
    height: 16px;
}
.v2p-member-card .v2p-loading {
    background-color: var(--button-background-hover-color);
    border-radius: 4px;
}
.v2p-member-card .v2p-bio {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-height: 1.4;
    margin-top: 10px;
}
.v2p-member-card-actions {
    padding: 10px 0 0;
}
.v2p-reply-tags {
    cursor: pointer;
    display: inline-flex;
    margin: 0 0 2px;
    padding: 0 3px;
    font-size: 12px;
    background-color: var(--button-background-hover-color);
    border-radius: 3px;
}
.v2p-reply-tags-inline {
    overflow: hidden;
    max-width: 300px;
    margin: 0 5px 0 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.v2p-emoticons-box {
    font-size: 15px;
}
.v2p-emoji-group ~ .v2p-emoji-group {
    margin-top: 10px;
}
.v2p-emoji-title {
    margin: 0 0 10px;
    font-size: 14px;
    text-align: left;
}
.v2p-emoji-list {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
    font-size: 20px;
}
.v2p-emoji {
    cursor: pointer;
    height: 20px;
    padding: 3px;
    line-height: 20px;
    border-radius: 4px;
}
.v2p-emoji:hover {
    background-color: var(--box-background-hover-color);
}
.v2p-emoji > img {
    height: 100%;
}
.v2p-decode {
    cursor: copy;
    position: relative;
    padding: 2px 4px;
    font-size: 13px;
    color: var(--v2p-color-orange-400);
    text-decoration: none;
    background-color: var(--v2p-color-orange-50);
}
.v2p-decode::after {
    pointer-events: none;
    z-index: var(--zidx-tip);
    overflow: hidden;
    width: max-content;
    min-width: 30px;
    padding: 2px 5px;
    font-size: 12px;
    color: var(--v2p-color-foreground);
    text-align: center;
    white-space: nowrap;
    background-color: var(--v2p-color-bg-tooltip);
    border-radius: 4px;
    box-shadow: var(--v2p-widget-shadow);
    content: attr(data-title);
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
}
.v2p-decode:hover {
    color: var(--v2p-color-orange-400);
}
.v2p-decode:hover::after {
    opacity: 1;
}
.v2p-reply-content {
    position: relative;
}
.v2p-reply-content .v2p-expand-btn.normal.button {
    position: absolute;
    z-index: var(--zidx-expand-btn);
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 400;
}
.v2p-reply-content.v2p-collapsed::before {
    pointer-events: none;
    content: "";
    position: absolute;
    z-index: var(--zidx-expand-mask);
    right: 0;
    bottom: 0;
    left: 0;
    height: 130px;
    background: linear-gradient(to top, var(--bg-reply) 10px, transparent);
}
.v2p-reply-content.v2p-collapsed .reply_content a,
.v2p-reply-content.v2p-collapsed .reply_content .embedded_video {
    pointer-events: none;
}
.v2p-reply-content.v2p-collapsed .v2p-expand-btn.normal.button {
    bottom: 10px;
    transform: translateX(-50%);
}
.cell[id^="r"] .cell[id^="r"] .v2p-reply-content .v2p-expand-btn.normal.button {
    color: var(--v2p-color-button-foreground);
    background: var(--v2p-color-button-background-hover);
    box-shadow: var(--button-hover-shadow);
}
.v2p-em#Top>.content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 5px;
}
/* 屏蔽原生主题切换按钮 */
/* 屏蔽原生主题切换按钮 (精确匹配) */
a.light-toggle[href^="/settings/night/toggle"],
a[href*="/settings/night/toggle"] {
    display: none !important;
}
.v2p-empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    font-size: 14px;
    color: var(--v2p-color-font-secondary);
}
.v2p-empty-content .v2p-text-emoji {
    font-size: 20px;
}
.v2p-topic-reply-ref {
    margin: 0 -10px 15px;
    padding: 5px 10px;
    font-size: 13px;
    color: var(--v2p-color-font-tertiary);
    background-color: var(--v2p-color-bg-block);
    border-radius: 5px;
}
.v2p-topic-reply-box {
    margin-top: 50px;
    padding: 30px 0;
    font-size: 14px;
    line-height: 1.55;
    color: var(--v2p-color-font-secondary);
    border-top: 1px solid var(--v2p-color-divider);
}
.v2p-topic-reply ~ .v2p-topic-reply {
    margin-top: 15px;
}
.v2p-topic-reply-member {
    display: inline;
    font-weight: bold;
    color: var(--v2p-color-main-700);
}
.v2p-topic-reply-avatar {
    position: relative;
    top: 2px;
    overflow: hidden;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    object-fit: cover;
    background-color: var(--v2p-color-bg-avatar);
    border-radius: 2px;
}
.v2p-topic-reply-content {
    display: inline;
}
.v2p-topic-reply-tip {
    margin-top: 20px;
    font-size: 13px;
    color: var(--v2p-color-font-quaternary);
    text-align: center;
}
.v2p-reply-wrap {
    resize: none;
    overflow: hidden;
    height: unset;
    margin-bottom:10px;
    min-height: 140px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}
.v2p-reply-wrap::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
.v2p-reply-wrap:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
.v2p-reply-wrap #reply_content {
    background-color: rgba(0, 0, 0, 0);
    border: none;
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
.v2p-reply-upload-bar-disabled {
    pointer-events: none;
}
.v2p-footer {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 35px 10px 20px;
    font-size: 12px;
    color: var(--v2p-color-font-tertiary);
    border-top: 1px solid var(--v2p-color-divider);
}
.v2p-footer a:hover {
    text-decoration: none;
}
.v2p-footer-logo {
    --logo-size: 16px;
    position: absolute;
    top: calc(-1 * (var(--logo-size) + 5px) / 2);
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    box-sizing: border-box;
    padding: 3px 25px;
    background-color: var(--v2p-color-bg-footer);
}
.v2p-footer-logo svg {
    width: var(--logo-size);
}
.v2p-footer-text {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 240px;
    color: var(--v2p-color-font-secondary);
}
.v2p-footer-links {
    display: inline-flex;
    gap: 0 8px;
    align-items: center;
}
.v2p-footer-link {
    padding: 4px 5px;
    color: currentColor;
}
.v2p-footer-brand {
    display: inline-flex;
    gap: 0 15px;
    align-items: center;
    justify-content: flex-end;
    width: 240px;
}
.v2p-footer-brand .v2p-github-ref {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 2px 0;
}
.v2p-color-mode-toggle {
    width: 25px !important;
    height: 25px !important;
    padding: 5px !important;
    border-radius: 50% !important;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
}
.v2p-color-mode-toggle:hover {
    opacity: 1;
    background-color: var(--v2p-color-bg-hover, rgba(0, 0, 0, 0.08));
}
.v2p-reply-tabs {
    display: flex;
    gap: 0 6px;
    align-items: center;
    font-size: 14px;
}
.v2p-reply-tabs .v2p-reply-tab {
    cursor: pointer;
    padding: 2px 3px;
}
.v2p-reply-tabs .v2p-reply-tab.active {
    text-decoration: underline;
    text-decoration-color: var(--v2p-color-font-tertiary);
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}
.v2p-select-dropdown {
    padding: 5px;
    font-size: 12px;
    border-radius: 5px;
}
.v2p-select-item {
    cursor: pointer;
    padding: 5px 10px;
    white-space: nowrap;
    border-radius: 4px;
}
.v2p-select-item:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-select-item.v2p-select-item-active {
    background-color: var(--v2p-color-accent-50);
}
.v2p-preview-retry,
.v2p-topic-preview-retry,
a.v2p-preview-retry,
a.v2p-topic-preview-retry,
a:link.v2p-preview-retry,
a:link.v2p-topic-preview-retry {
    text-decoration: underline 1px;
    text-underline-offset: var(--v2p-underline-offset);
    cursor: pointer;
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
.v2p-layout-toggle {
    display: inline-block;
    width: 18px;
    height: 18px;
    padding: 4px 2px;
    color: var(--v2p-color-font-tertiary);
}
.v2p-content-layout.v2p-content-layout {
    max-width: 2000px;
}
.v2p-content-layout.v2p-content-layout .v2p-horizontal-layout {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v2p-layout-column-gap);
}
.v2p-left-side {
    flex: 1;
}
.v2p-left-side > .box {
    position: sticky;
    top: var(--v2p-layout-row-gap);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 2 * var(--v2p-layout-row-gap));
}
.v2p-left-side > .box > .header {
    flex-shrink: 0;
}
.v2p-left-side .v2p-left-side-content {
    overflow: auto;
    flex: 1;
    border-bottom: 1px solid var(--box-border-color);
}
.v2p-right-side {
    flex: 1;
}
.v2p-register-days {
    display: inline-flex;
    align-items: center;
    margin-left: 2px;
    padding: 0 2px;
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-100);
    border-radius: 2px;
}
.v2p-register-days.v2p-register-days-large {
    display: inline-flex;
    margin-left: 10px;
    padding: 2px 5px;
    font-size: 16px;
    line-height: 1.4;
    border-radius: 4px;
}
.v2p-topics-hot-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    color: currentColor;
}
.v2p-topics-hot-loading .v2p-icon-loading {
    width: 40px;
}
.v2p-topics-hot-header {
    display: flex;
    align-items: center;
}
.v2p-topics-hot-picker {
    cursor: pointer;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    margin-left: auto;
    padding: 1px 6px;
    font-size: 13px;
    background-color: var(--v2p-color-button-background);
    border-radius: 4px;
}
.v2p-topics-hot-picker:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-topics-hot-icon {
    position: relative;
    top: -2px;
    width: 1em;
    height: 1em;
}
.v2p-tag-block {
    margin-bottom: 10px;
}
@supports (filter: blur(6px)) {
    .v2p-hide-account {
        opacity: 0.5;
        filter: blur(6px);
    }
}
@supports not (filter: blur(6px)) {
    .v2p-hide-account {
        opacity: 0;
    }
}
@supports (filter: blur(6px)) {
    .v2p-hide-balance {
        opacity: 0.5;
        filter: blur(6px);
    }
    .v2p-hide-balance:hover {
        opacity: 1;
        filter: none;
    }
}
@supports not (filter: blur(6px)) {
    .v2p-hide-balance {
        opacity: 0;
    }
    .v2p-hide-balance:hover {
        opacity: 1;
    }
}
.v2p-member-name {
    display: flex;
    align-items: center;
}
.v2p-settings-header.page-content-header {
    gap: 10px;
}
.v2p-settings-header.page-content-header .v2p-settings-icon {
    width: 40px;
    height: 40px;
    margin: 0;
}
.v2p-settings-header.page-content-header .v2p-settings-title {
    padding: 0;
    white-space: nowrap;
}
.v2p-settings-header.page-content-header .v2p-settings-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
}
.v2p-link-preview-btn {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    height: 100%;
    margin-left: 5px;
    padding: 0 5px;
    font-size: 12px;
    color: var(--v2p-color-bg-content);
    background-color: var(--v2p-color-accent-500);
    border-radius: 3px;
}
.v2p-link-preview-btn:hover {
    background-color: var(--v2p-color-accent-600);
}
#site-header #site-header-menu #menu-entry {
    border-radius:999px;
    }

#node_sidebar.v2p-node-sidebar-flamewar {
    background-color: var(--v2p-color-orange-50);
    border: var(--v2p-color-orange-50);
    border-radius: var(--v2p-box-radius);
}
/* 隐藏节点侧栏提示块（含内联样式警示） */
#node_sidebar {
    display: none !important;
}
/* 隐藏包含 #node_sidebar 的父容器，避免留下空白块 */
.box:has(#node_sidebar) {
    display: none !important;
}
html.v2p-theme-dark-default #node_sidebar,
:root body.v2p-theme-dark-default #node_sidebar,
:root .v2p-theme-dark-default #node_sidebar,
:root[data-darkreader-scheme="dark"] body #node_sidebar,
:root body:has(#Wrapper.Night) #node_sidebar {
    background-color: var(--v2p-color-bg-block) !important;
    color: var(--v2p-color-foreground) !important;
    border: 1px solid var(--v2p-color-border) !important;
    border-radius: var(--v2p-box-radius) !important;
}
html.v2p-theme-dark-default #node_sidebar a,
:root body.v2p-theme-dark-default #node_sidebar a,
:root .v2p-theme-dark-default #node_sidebar a,
:root[data-darkreader-scheme="dark"] body #node_sidebar a,
:root body:has(#Wrapper.Night) #node_sidebar a {
    color: var(--v2p-color-foreground) !important;
}
.v2p-mobile .content {
    padding: 0 !important;
    }
.v2p-mobile #site-header #site-header-menu #menu-body {
    border-radius: 14px !important;
    box-shadow: var(--v2p-widget-shadow);
    border: 1px solid var(--box-border-color);
    background-color: rgba(var(--v2p-color-bg-content-rgb), 0.75) !important;
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    padding: 6px !important;
    overflow: hidden;
}
.v2p-mobile #site-header #site-header-menu #menu-body .cell {
    border: none !important;
    background: transparent !important;
    padding: 0 !important;
}
.v2p-mobile #site-header #site-header-menu #menu-body .cell a {
    display: flex !important;
    align-items: center;
    padding: 6px 12px !important;
    margin: 2px 0;
    border-radius: 10px;
    font-size: 14px !important;
    color: var(--v2p-color-font-secondary);
    transition: background-color 0.15s;
}
.v2p-mobile #site-header #site-header-menu #menu-body .cell a:hover {
    background-color: rgba(var(--v2p-color-bg-content-rgb), 0.5);
    color: var(--v2p-color-font-primary);
}
.v2p-mobile .v2p-likes-box {
    vertical-align: middle !important;
    top:0;
}
.v2p-mobile a.dark {
    font-weight:bold;
    font-size:12px;
    }
.v2p-mobile #site-header #site-header-menu #menu-body a {
    font-size:14px !important;
}
.v2p-mobile #Tabs a {
    font-size:14px !important;
    border-radius:999px;
    margin:2px;
    }
.v2p-mobile #search-container {
    border-radius:18px !important;
    }
.v2p-mobile .box .header > h1 {
    font-size: 16px !important;
    }
.v2p-mobile .box .header {
    font-size: 12px !important;
    }
.v2p-mobile a.op, .v2p-mobile a.tag .v2p-mobile .no {
    border-radius:999px !important;
    padding:2px 6px;
    font-size:11px;
    }
.v2p-mobile .mll {
    font-size: 16px;
}

.v2p-mobile .mll::placeholder {
    font-size: 16px !important;
}

.v2p-mobile form table td:first-child {
    width: 100px !important;

}


/* 只把“内容那一格”变成 flex，不影响右边计数 */
.v2p-mobile .cell.item td:nth-child(3) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

/* 去掉两块空白行 */
.v2p-mobile .cell.item td:nth-child(3) > .sep5 {
    display: none;
}

/* 主题标题：排第一行，占满整行 */
.v2p-mobile .cell.item td:nth-child(3) > .item_title {
    order: 1;
    width: 100%;
    display: block;
    padding:3px 0;
}

/* 第一行 small fade（节点 + 作者）→ 合并行左侧 */
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:first-of-type {
    order: 2;
    display: inline;
    margin-top:8px;
}
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:last-of-type {
    display: none !important;
}
/* 第二个 small fade（时间 + 最后回复）→ 合并行右侧 */
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:last-of-type {
    order: 3;
    display: inline;
    margin-left: .5em;
}



.v2p-mobile #site-header {
    background-color:transparent !important;
    border-bottom:none !important;
    height: 50px;
    padding:10px;
    margin:auto;
    max-width:1000px;
    }
.v2p-mobile .box {
    border-radius: 0 !important;
    padding:5px 15px !important;
    margin: 0 0 10px 0;

}

.v2p-mobile .cell.item table tr > td:last-child {

    min-width: 30px !important;
    vertical-align: top !important;
}

.v2p-mobile .cell.item table tr > td[width="70"] {
    width:35px !important;
}
.v2p-mobile .item_title {
font-size:15px;
}
.v2p-mobile .topic_content {
    font-size:15px;
    line-height:1.5;
}
.v2p-mobile #topic-tip-box {
display:none;
}
#reply-box .cell {
border:none;
}
.v2p-mobile #no-comments-yet {
background-color:var(--v2p-color-bg-content);
margin: 0 auto 10px auto;
box-shadow: var(--v2p-box-shadow);
border:none;
color: var(--box-foreground-color);
width:50%;
align:center;
}
.v2p-mobile .avatar {
    width: 30px !important;
    max-height: 30px !important;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
    margin:0;
}
.v2p-mobile .cell .avatar {
    margin-top:5px;
}
.v2p-mobile a.node {
    font-size:11px !important;
    }
.v2p-mobile .small a {
    font-weight:500;
}
.v2p-mobile .small {
    font-size:11px;
}
.v2p-mobile small.gray a {
    font-weight:bold;
}

.v2p-mobile .v2p-reply-wrap #reply_content {
    height:110px !important;
    }
.v2p-mobile a.count_livid:active, .v2p-mobile a.count_livid:link, a.count_livid:visited {
    padding: 3px !important;
    font-size: 10px;
    font-weight: normal;
    border-radius: 999px !important;
    display: inline-flex;          /* 支持自动居中 + 自适应 */
    align-items: center;           /* 垂直居中 */
    justify-content: center;       /* 水平居中 */
    min-width: 10px;               /* 最小宽度，确保初始为圆形 */
    height: 10px;                  /* 高度固定，这很关键 */
    padding: 0px;
    background-color: var(--button-background-color) !important;
    color: var(--button-foreground-color) !important;
    }

    /* ==== 移动端 Tabs 横向滚动设置 ==== */
.v2p-mobile #Main #Tabs,
.v2p-mobile #Tabs {
    display: flex;
    flex-wrap: nowrap;          /* 不换行，所有 tab 在一行 */
    overflow-x: auto;           /* 横向可滚动 */
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;  /* 惯性滚动 */
    scrollbar-width: none;      /* Firefox 隐藏滚动条 */
}

/* WebKit 浏览器隐藏滚动条 */
.v2p-mobile #Main #Tabs::-webkit-scrollbar,
.v2p-mobile #Tabs::-webkit-scrollbar {
    display: none;
}

/* 每个 Tab 固定为内容宽度，避免被压缩 */
.v2p-mobile #Tabs .tab,
.v2p-mobile #Tabs .tab_current {
    flex: 0 0 auto;
}
.v2p-mobile .fr {
  display: inline-flex;
  align-items: center;
  gap: 2px; /* 按钮之间的横向间距，可按需调整 */
}

/*处理详情页header内容排版 */
/* 1. 设置父容器为相对定位，作为定位基准 */
.v2p-mobile .header {
    position: relative;
    display: block; /* 确保是块级显示 */
}

/* 2. 处理头像 (.fr)
   将其从右上角移除，改为绝对定位到左侧“第二行”的位置 */
.v2p-mobile .header > .fr {
    float: none;        /* 取消原有的向右浮动 */
    position: absolute; /* 绝对定位 */
    top: 36px;
    left: 8px;        /* 靠左对齐，数值取决于 header 的 padding */
    margin: 0;          /* 清除可能存在的 margin */
}

/* 3. 处理导航链接 (无需特殊 CSS，它们会自动回到第一行左侧)
   因为头像变成了 absolute，导航链接自然占据了文档流的最开始位置 */

/* 4. 处理标题 (h1)
   给左侧增加内边距，防止文字叠在头像上，形成“左图右文”效果 */
.v2p-mobile .header > h1 {
    margin: 15px 0 0 0;   /* 在导航和标题之间增加间距 */
    padding-left: 40px; /* 【核心】左侧留白 = 头像宽度(36px) + 间距 */
    display: block;
}

/* 5. 处理底部元数据 (small)
   同样左侧留白，并强制换行显示在标题下方 */
.v2p-mobile .header > small {
    display: block;     /* 确保独占一行 */
    padding-left: 40px; /* 对齐标题 */
    margin-top: 5px;    /* 微调间距 */
}

/* 6. 隐藏原有的分割线 (可选，为了布局更紧凑) */
.v2p-mobile .header > .sep {
    display: none;
}
.v2p-mobile .cell > table > tbody > tr > td:first-child {
width:30px !important;
}
.v2p-mobile #notifications .cell > table > tbody > tr > td:nth-child(2) {
    padding-left:10px !important;
}
.v2p-mobile .v2p-indent {
    background-color: var(--bg-reply);
    border-left: 2px solid var(--v2p-color-border-darker);
    border-top: 1px solid var(--v2p-color-border-darker);
    --bg-reply: var(--v2p-color-bg-reply);
    position: relative;
    z-index: var(--zidx-expand-btn);
    padding: var(--v2p-tp-nested-pd);
    border-radius: 10px;
    margin: 10px 0 0 5px;
}
/* 让 svg 图标统一垂直对齐 */
.v2p-mobile .fr svg {
  vertical-align: middle !important;
}

/* 深色模式下反转 Logo 颜色 */
html.Night #site-header-logo #LogoMobile {
    filter: invert(1) brightness(1.2) contrast(1.1);
}
@media (min-width: 600px) {
    .v2p-mobile .box {
        border-radius: 18px !important;
    }
}

/* === 主题选择菜单 === */
.v2p-theme-menu {
    position: absolute;
    background-color: rgba(var(--v2p-color-bg-content-rgb), 0.75);
    border: 1px solid var(--box-border-color);
    box-shadow: var(--v2p-widget-shadow);
    border-radius: 14px;
    padding: 6px;
    display: none; /* Initially hidden */
    flex-direction: column;
    width: 160px;
    z-index: 2000;
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
}
.v2p-theme-menu.show {
    display: flex;
    animation: v2p-fade-in 0.15s ease-out;
}
.v2p-theme-menu-item {
    padding: 10px 12px;
    margin: 2px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px; /* Gap between icon and label */
    border-radius: 10px;
    font-size: 14px;
    color: var(--v2p-color-font-secondary);
    transition: background-color 0.15s;
}
.v2p-theme-menu-item:hover {
    background-color: rgba(var(--v2p-color-bg-content-rgb), 0.5);
    color: var(--v2p-color-font-primary);
}
.v2p-theme-menu-item.active {
    color: var(--v2p-color-font-primary);
    font-weight: 500;
}
.v2p-theme-menu-item .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v2p-color-accent);
}
@keyframes v2p-fade-in {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}
@keyframes v2p-fade-in-up {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
}
/* 移动端主题菜单向上弹出动画 */
.v2p-mobile .v2p-theme-menu.show {
    animation: v2p-fade-in-up 0.15s ease-out;
}
`;

    // 尽早注入 CSS
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(style);
    } else {
        // 理论上油猴一定有 GM_addStyle，这里只是兜底
        const el = document.createElement("style");
        el.type = "text/css";
        el.textContent = style;
        (document.head || document.documentElement).appendChild(el);
    }

    // ========= 2. 主题模式 & 类名处理 =========
    // 依次：亮色 → 晨光 → 水色 → 暗色 → 跟随系统
    const THEME_MODES = ["light", "dawn", "aqua", "dark", "auto"];

    const STORAGE_KEY = "user_preferred_theme_mode";
    const TOGGLE_SELECTOR = ".v2p-color-mode-toggle";

    // 记录站点原生的 SITE_NIGHT（0: 浅色, 1: 深色）
    let nativeNight = null;

    // 检测当前页原生的深色 / 浅色状态：
    // 1) 优先用第一个 IIFE 写入的 window.__V2P_NATIVE_NIGHT__
    // 2) 其次看 <link> 里是 tomorrow.css 还是 tomorrow-night.css
    // 3) 再不行就扫一遍 <script> 里的 SITE_NIGHT
    function detectNativeNight() {
        if (nativeNight !== null) return nativeNight;

        // 0. 如果前面的 MutationObserver 已经写好了，就直接用
        if (
            typeof window !== "undefined" &&
            typeof window.__V2P_NATIVE_NIGHT__ === "number"
        ) {
            nativeNight = window.__V2P_NATIVE_NIGHT__;
            return nativeNight;
        }

        try {
            // 1. 看 Wrapper / body / html 有没有 Night 类（有些页面 / 移动端会这么标）
            const wrapper = document.getElementById("Wrapper");
            const body = document.body;
            const docEl = document.documentElement;

            if (wrapper && wrapper.classList.contains("Night")) {
                nativeNight = 1;
                return nativeNight;
            }
            if (body && body.classList.contains("Night")) {
                nativeNight = 1;
                return nativeNight;
            }
            if (docEl && docEl.classList.contains("Night")) {
                nativeNight = 1;
                return nativeNight;
            }

            // 2. 看代码高亮的 CSS，是 tomorrow 还是 tomorrow-night
            const head = document.head || document.documentElement;
            if (head) {
                const link = head.querySelector(
                    'link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]',
                );
                if (link) {
                    const href = link.getAttribute("href") || "";
                    if (href.includes("tomorrow-night.css")) {
                        nativeNight = 1;
                        return nativeNight;
                    }
                    if (href.includes("tomorrow.css")) {
                        nativeNight = 0;
                        return nativeNight;
                    }
                }
            }

            // 3. 扫一遍 <script> 里的 SITE_NIGHT = 0/1
            const scripts = document.querySelectorAll("script");
            for (const s of scripts) {
                const txt = s.textContent || "";
                const m = txt.match(/SITE_NIGHT\s*=\s*(\d)/);
                if (m) {
                    nativeNight = Number(m[1]) === 1 ? 1 : 0;
                    return nativeNight;
                }
            }

            // 4. 移动端顶栏的图标：<img class="site-theme-toggle mobile">
            // 一般规则是：当前是暗色 → 图标是“Light”；当前是亮色 → 图标是“Dark”
            const mobileToggleImg =
                document.querySelector("#menu-body img.site-theme-toggle.mobile") ||
                document.querySelector("img.site-theme-toggle");
            if (mobileToggleImg) {
                const src = mobileToggleImg.getAttribute("src") || "";
                const alt = (mobileToggleImg.getAttribute("alt") || "").toLowerCase();

                if (src.includes("toggle-light") || alt.includes("light")) {
                    // 图标提示“切到 Light”，说明当前是 Dark
                    nativeNight = 1;
                    return nativeNight;
                }
                if (src.includes("toggle-dark") || alt.includes("dark")) {
                    // 图标提示“切到 Dark”，说明当前是 Light
                    nativeNight = 0;
                    return nativeNight;
                }
            }
        } catch (err) {
            // ignore
        }

        // 实在判断不出来，就当成浅色
        nativeNight = 0;
        return nativeNight;
    }

    // 根据 isDark 同步：
    // 1) 请求原始的 night toggle URL，修改服务端 SITE_NIGHT
    // 2) 尽量把当前页面的 tomorrow*.css 也切到对应版本，避免代码高亮闪屏
    // 3) 同步移动端菜单里的图标
    function syncNativeNight(isDark) {
        const target = isDark ? 1 : 0;
        const current = detectNativeNight();
        if (current === target) return;

        nativeNight = target;

        // ① 通知服务端切换 SITE_NIGHT
        try {
            // 先按桌面端的选择器找
            let legacy = document.querySelector(
                "#Rightbar .light-toggle, #Top .light-toggle, .top .light-toggle",
            );

            // 如果是移动端，可能没有 light-toggle class，用 href 来兜底
            if (!legacy) {
                legacy = document.querySelector('a[href*="/settings/night/toggle"]');
            }

            const href = legacy && legacy.getAttribute("href");
            if (href) {
                fetch(href, { method: "GET", credentials: "include" }).catch(() => { });
            }
        } catch (err) {
            // ignore
        }

        // ② 同步当前页面的 tomorrow / tomorrow-night CSS（代码高亮）
        try {
            const head = document.head || document.documentElement;
            if (head) {
                const link = head.querySelector(
                    'link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]',
                );
                if (link) {
                    const href = link.getAttribute("href") || "";
                    if (target === 1) {
                        // 切到 tomorrow-night.css
                        if (
                            href.includes("tomorrow.css") &&
                            !href.includes("tomorrow-night.css")
                        ) {
                            link.href = href.replace("tomorrow.css", "tomorrow-night.css");
                        }
                    } else {
                        // 切回 tomorrow.css
                        if (href.includes("tomorrow-night.css")) {
                            link.href = href.replace("tomorrow-night.css", "tomorrow.css");
                        }
                    }
                }
            }
        } catch (err) {
            // ignore
        }

        // ③ 同步移动端菜单里的图标显示
        try {
            const mobileToggleImg =
                document.querySelector("#menu-body img.site-theme-toggle.mobile") ||
                document.querySelector("img.site-theme-toggle");

            if (mobileToggleImg) {
                if (target === 1) {
                    // 当前暗色 → 图标应该显示 Light
                    mobileToggleImg.src = "/static/img/toggle-light.png";
                    mobileToggleImg.alt = "Light";
                } else {
                    // 当前亮色 → 图标应该显示 Dark
                    mobileToggleImg.src = "/static/img/toggle-dark.png";
                    mobileToggleImg.alt = "Dark";
                }
            }
        } catch (err) {
            // ignore
        }
    }

    // 缓存当前主题模式，减少对 localStorage 的访问
    let currentMode = null;

    function getSavedMode() {
        if (currentMode && THEME_MODES.includes(currentMode)) return currentMode;

        const raw = localStorage.getItem(STORAGE_KEY);
        if (THEME_MODES.includes(raw)) {
            currentMode = raw;
            return raw;
        }

        // 本地没有记录时，根据站点原生 SITE_NIGHT 决定初始模式：
        // SITE_NIGHT = 1 → 我们默认用 v2p-theme-dark-default
        // SITE_NIGHT = 0 → 默认用 v2p-theme-light-default
        const native = detectNativeNight();
        currentMode = native === 1 ? "dark" : "light";
        try {
            localStorage.setItem(STORAGE_KEY, currentMode);
        } catch (e) { }
        return currentMode;
    }

    function isSystemDark() {
        try {
            return (
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches
            );
        } catch {
            return false;
        }
    }

    /**
     * 给元素应用主题类（返回当前是否为深色）
     */
    function applyThemeToElement(element, effectiveMode) {
        if (!element) return false;

        const cls = element.classList;
        const toRemove = [];

        cls.forEach((c) => {
            if (c.startsWith("v2p-theme-") || c === "Night") {
                toRemove.push(c);
            }
        });
        toRemove.forEach((c) => cls.remove(c));

        let isDark = false;
        switch (effectiveMode) {
            case "dark":
                cls.add("v2p-theme-dark-default", "Night");
                isDark = true;
                break;
            case "light":
                cls.add("v2p-theme-light-default");
                break;
            case "dawn":
                cls.add("v2p-theme-dawn");
                break;
            case "aqua":
                cls.add("v2p-theme-aqua");
                break;
            default:
                break;
        }
        return isDark;
    }

    /**
     * 同时确保 html 和 body 都应用主题
     */
    function ensureThemeOnBothElements(mode) {
        const html = document.documentElement;
        const body = document.body;
        const wrapper = document.getElementById("Wrapper"); // ★ 新增

        // 仅在 auto 模式下检测一次系统主题，避免重复调用 matchMedia
        let effectiveMode = mode;
        if (mode === "auto") {
            effectiveMode = isSystemDark() ? "dark" : "light";
        }

        // The `isDark` value should be determined by the application to the main element (html)
        // and then used for the return value.
        // Apply to wrapper first if it exists.
        if (wrapper) applyThemeToElement(wrapper, effectiveMode); // ★ 新增

        // Apply to html and capture the isDark result
        const isDark = applyThemeToElement(html, effectiveMode);

        // Apply to body
        if (body) {
            applyThemeToElement(body, effectiveMode);
        }

        // [Loading Screen] Remove loader now specifically because theme is ready
        if (typeof window.__V2P_REMOVE_LOADER__ === "function") {
            window.__V2P_REMOVE_LOADER__();
            window.__V2P_REMOVE_LOADER__ = null;
        }

        updateThemeColor(effectiveMode);

        return isDark;
    }

    /**
     * 更新浏览器的主题色（适配地址栏/顶栏颜色）
     */
    function updateThemeColor(mode) {
        const colorMap = {
            light: "#f2f3f5",
            dawn: "#faf4ed", // 晨光主题背景色
            aqua: "#f2f7fa", // 水色主题背景色
            dark: "#1c2128",
        };

        const color = colorMap[mode] || colorMap.light;

        let metas = document.querySelectorAll('meta[name="theme-color"]');
        if (!metas || metas.length === 0) {
            const meta = document.createElement("meta");
            meta.name = "theme-color";
            if (document.head) {
                document.head.appendChild(meta);
            } else {
                document.documentElement.appendChild(meta);
            }
            metas = [meta];
        }
        metas.forEach((m) => {
            m.content = color;
        });
    }

    /**
     * 更新右侧切换按钮的文案/状态（可以按需求再优化文案）
     */
    function updateToggleButtons(mode, isDark) {
        const toggles = document.querySelectorAll(TOGGLE_SELECTOR);
        const nameMap = {
            light: "亮色",
            dark: "暗色",
            dawn: "晨光",
            aqua: "水蓝",
            auto: "跟随系统",
        };

        toggles.forEach((btn) => {
            btn.setAttribute("data-theme-mode", mode);
            btn.setAttribute("aria-pressed", isDark ? "true" : "false");

            const label = nameMap[mode] || "";
            if (label) {
                btn.setAttribute("aria-label", label);
                btn.title = label;
            }

            // ★ 移动端菜单里的图片按钮
            const mobileImg = btn.querySelector("img.site-theme-toggle.mobile");
            if (mobileImg) {
                if (isDark) {
                    mobileImg.src = "/static/img/toggle-light.png";
                    mobileImg.alt = "Light";
                } else {
                    mobileImg.src = "/static/img/toggle-dark.png";
                    mobileImg.alt = "Dark";
                }
                return;
            }

            // ① PC 端 / 顶部 .light-toggle：用 SVG 图标
            if (btn.classList.contains("light-toggle")) {
                btn.innerHTML = isDark
                    ? '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>'
                    : '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom;"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';

                return;
            }

            // ② 其它纯文字按钮，用文字显示当前模式
            if (!btn.children.length) {
                if (!btn.dataset.originalLabel) {
                    btn.dataset.originalLabel = btn.textContent || "";
                }
                btn.textContent = label || btn.dataset.originalLabel;
            }
        });
    }

    /**
     * 点击切换主题：按数组顺序循环
     */
    /**
     * 确保页面上存在主题切换按钮：
     * - 优先使用已经带有 .v2p-color-mode-toggle 的元素
     * - 否则复用 V2EX 右侧 / 顶部原生的 .light-toggle 按钮并加上 class
     */
    function ensureToggleButtons() {
        let toggles = document.querySelectorAll(TOGGLE_SELECTOR);
        // 检查是否有「可见的」toggle 按钮（原生按钮可能被 CSS display:none 隐藏）
        const visible = Array.from(toggles).filter(el => el.offsetHeight > 0);
        if (visible.length) return toggles;

        // 手动创建一个新的切换按钮，替代被屏蔽的原生按钮
        // 1. 尝试在 #Top .tools 里插入
        const topTools = document.querySelector("#Top .tools");
        if (topTools) {
            const newLink = document.createElement("a");
            newLink.href = "javascript:;";
            // 添加 light-toggle 类，以便 updateToggleButtons 能自动为它注入 SVG 图标
            newLink.className =
                "top v2p-hover-btn v2p-color-mode-toggle light-toggle";
            newLink.title = "切换主题";
            // newLink.innerHTML = "主题"; // 不需要文字了，会被 SVG 替换
            topTools.appendChild(newLink);
        }

        // 2. 尝试在右侧边栏插入 (如果有 .light-toggle 的位置)
        // const rightToggle = document.querySelector("#Rightbar .light-toggle");
        // 也可以直接 append 到 #Rightbar 某个 box 里，视情况而定

        // ② 移动端菜单里的图片按钮
        // 在新版 V2EX 中，这个菜单可能是一个 #menu-body
        const menuBody = document.getElementById("menu-body");
        if (menuBody) {
            // 找到原生的切换按钮链接 (注意：不仅是 .light-toggle，很多时候它只是一个普通的 a 标签，href 指向 /settings/night/toggle)
            const nativeToggleLink = menuBody.querySelector(
                'a[href*="/settings/night/toggle"]',
            );

            if (nativeToggleLink) {
                // 1. 移除 href，防止 CSS (a[href*="/settings/night/toggle"] { display: none }) 把它隐藏
                // 同时这也防止了点击触发原生的跳转
                nativeToggleLink.removeAttribute("href");
                nativeToggleLink.setAttribute("href", "javascript:;");

                // 2. 加上我们的 trigger class，以及 V2EX 标准菜单项 class 'top'
                nativeToggleLink.classList.add("v2p-color-mode-toggle");
                nativeToggleLink.classList.add("top");

                // 2.1 强制重置样式 (Nuclear Option)
                // 使用 setProperty('...','important') 确保覆盖原生可能存在的 narrow width 规则
                nativeToggleLink.style.setProperty(
                    "align-items",
                    "center",
                    "important",
                );
                nativeToggleLink.style.setProperty("width", "100%", "important");
                nativeToggleLink.style.setProperty("height", "auto", "important");
                nativeToggleLink.style.setProperty(
                    "white-space",
                    "nowrap",
                    "important",
                );

                nativeToggleLink.style.textAlign = "left";
                nativeToggleLink.style.backgroundColor = "transparent";
                nativeToggleLink.style.padding = "10px 15px"; // 恢复 padding 确保对齐
                nativeToggleLink.style.boxSizing = "border-box";

                // 3. 替换内容
                nativeToggleLink.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block; margin-right: 10px; opacity: 0.7; color: var(--v2p-color-font-secondary);"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                    <span>主题设置</span>
                `;
            }
        }

        toggles = document.querySelectorAll(TOGGLE_SELECTOR);
        return toggles;
    }

    function bindToggleEvents() {
        console.log("V2P: bindToggleEvents start");
        // 尝试初始化一下，但不依赖返回值
        ensureToggleButtons();

        const current = currentMode || getSavedMode();
        const isDark = ensureThemeOnBothElements(current);
        updateToggleButtons(current, isDark);
        // syncNativeNight(isDark); // 彻底封印：防止初始化时触发原生主题切换

        // 定义主题选项
        const themeOptions = [
            { key: "light", name: "Classic Light", label: "浅色" },
            { key: "dawn", name: "Dawn", label: "晨光" },
            { key: "aqua", name: "Aqua", label: "水色" },
            { key: "dark", name: "Dark", label: "深色" },
            { key: "auto", name: "System", label: "跟随系统" },
        ];

        // 创建菜单 DOM
        const menuEl = document.createElement("div");
        menuEl.className = "v2p-theme-menu";

        // 渲染菜单项
        const renderMenu = () => {
            const curMode = currentMode || getSavedMode();
            menuEl.innerHTML = themeOptions
                .map((opt) => {
                    const isActive = curMode === opt.key;
                    // 使用简单的 SVG 图标表示选中状态
                    const checkIcon = isActive
                        ? `<div class="icon" style="font-size: 16px; line-height: 1;">✓</div>`
                        : `<div class="icon"></div>`;

                    return `
            <div class="v2p-theme-menu-item ${isActive ? "active" : ""}" data-key="${opt.key}">
              ${checkIcon}
              <span>${opt.label}</span>
            </div>
          `;
                })
                .join("");

            // 绑定点击事件
            menuEl.querySelectorAll(".v2p-theme-menu-item").forEach((item) => {
                item.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const next = item.dataset.key;

                    currentMode = next;
                    localStorage.setItem(STORAGE_KEY, next);
                    syncNativeNight(next);

                    let dark = false;
                    // 如果是 auto，需要实时计算
                    if (next === "auto") {
                        if (
                            window.matchMedia &&
                            window.matchMedia("(prefers-color-scheme: dark)").matches
                        ) {
                            dark = true;
                        }
                    } else {
                        dark = ensureThemeOnBothElements(next);
                    }

                    // 为 auto 模式特殊处理 ensureThemeOnBothElements 中可能没有 auto 的逻辑，需要复用 ensureThemeOnBothElements(next)
                    // 但原函数对于 'auto' 可能会回退到 'light' 或 'dark'？
                    // 让我们看一下 ensureThemeOnBothElements 的实现：
                    // 它里面 switch(mode) ... case 'auto': ...
                    // 所以直接调用是安全的
                    dark = ensureThemeOnBothElements(next);

                    updateToggleButtons(next, dark);
                    // syncNativeNight(dark); // 暂时屏蔽：用户反馈可能导致页面抖动/冲突

                    // 关闭菜单
                    menuEl.classList.remove("show");
                    // 重新渲染以更新 active 状态
                    renderMenu();
                });
            });
        };

        // 插入菜单到 DOM
        document.body.appendChild(menuEl);
        renderMenu();

        // 使用事件委托处理点击
        document.addEventListener(
            "click",
            (e) => {
                // 1. 点击了主题切换按钮
                // 兼容 v2p-color-mode-toggle 和 light-toggle 以及 toggle 内部的 img/svg
                const toggleBtn =
                    e.target.closest(TOGGLE_SELECTOR) ||
                    e.target.closest(".light-toggle");

                if (toggleBtn) {
                    console.log("V2P: Toggle button clicked", toggleBtn);
                    // 阻止默认跳转行为（因为 toggle 按钮通常是个 <a> 标签）
                    e.preventDefault();
                    // 阻止冒泡，避免触发 document 上的其他点击关闭逻辑
                    // 但注意，我们自己在 document 上监听，所以这里的 stopPropagation 只能阻止它可以阻止的父级
                    // 对于同级 document listener，需要靠执行顺序或逻辑判断
                    e.stopPropagation();

                    // 如果菜单已经打开，且点击的是同一个按钮（或者只是想关闭）
                    if (menuEl.classList.contains("show")) {
                        menuEl.classList.remove("show");
                        return;
                    }

                    // 计算位置
                    const rect = toggleBtn.getBoundingClientRect();
                    const scrollTop =
                        window.pageYOffset || document.documentElement.scrollTop;
                    const isMobile = document.body.classList.contains("v2p-mobile");
                    const menuHeight = 200; // 菜单大概高度
                    const menuWidth = 160; // 菜单宽度

                    let top, left;

                    if (isMobile) {
                        // 移动端：向上弹出
                        top = rect.top - menuHeight - 5 + scrollTop;
                        left = rect.left;

                        // 如果上方空间不足，则向下弹出
                        if (top < scrollTop + 10) {
                            top = rect.bottom + 5 + scrollTop;
                        }
                    } else {
                        // 桌面端：向下弹出，右对齐
                        top = rect.bottom + 5 + scrollTop;
                        left = rect.right - menuWidth;
                    }

                    // 边界检查
                    if (left < 10) left = 10;
                    if (left + menuWidth > document.documentElement.clientWidth) {
                        left = document.documentElement.clientWidth - menuWidth - 10;
                    }

                    menuEl.style.top = `${top}px`;
                    menuEl.style.left = `${left}px`;

                    renderMenu();
                    menuEl.classList.add("show");
                    return;
                }

                // 2. 点击了菜单内的元素 -> 既然是 menuEl 的子元素，不应该关闭菜单
                if (menuEl.contains(e.target)) {
                    return;
                }

                // 3. 点击了页面其他区域 -> 关闭菜单
                if (menuEl.classList.contains("show")) {
                    menuEl.classList.remove("show");
                }
            },
            true,
        ); // 使用捕获阶段 (capture: true) 尝试优先拦截点击

        // 系统主题变化时，如果是 auto，就跟着变
        if (window.matchMedia) {
            const mq = window.matchMedia("(prefers-color-scheme: dark)");
            mq.addEventListener("change", () => {
                if ((currentMode || getSavedMode()) === "auto") {
                    const dark = ensureThemeOnBothElements("auto");
                    updateToggleButtons("auto", dark);
                    // syncNativeNight(dark); // 屏蔽原生同步，防止页面乱跳
                }
            });
        }
    }

    // ========= 3. 尽可能早地应用主题，减少“先默认再变色”的闪一下 =========

    // 初始化当前主题模式并尽可能早地应用，减少"先默认再变色"的闪烁
    // 同步原生夜间模式状态（仅本地处理，不再发送服务端请求）
    function syncNativeNight(mode) {
        // 判断用户期望状态
        let wantDark = mode === "dark";
        if (mode === "auto") {
            wantDark =
                window.matchMedia &&
                window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        // 1. 处理代码高亮 CSS
        const nativeLink = document.querySelector(
            'link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]',
        );
        if (nativeLink) {
            const href = nativeLink.href || "";
            if (!wantDark && href.includes("tomorrow-night.css")) {
                // 用户想要浅色，替换为浅色高亮
                nativeLink.href = href.replace("tomorrow-night.css", "tomorrow.css");
            } else if (
                wantDark &&
                href.includes("tomorrow.css") &&
                !href.includes("tomorrow-night.css")
            ) {
                // 用户想要深色，替换为深色高亮
                nativeLink.href = href.replace("tomorrow.css", "tomorrow-night.css");
            }
        }

        // 2. 同步 Wrapper 和 html 的 Night 类
        const wrapper = document.getElementById("Wrapper");
        if (wrapper) {
            if (wantDark) {
                wrapper.classList.add("Night");
                document.documentElement.classList.add("Night");
            } else {
                wrapper.classList.remove("Night");
                document.documentElement.classList.remove("Night");
            }
        }

        // 注意：不再向服务端发送 fetch 请求，避免与原生主题系统冲突导致页面抖动
    }

    currentMode = getSavedMode();
    syncNativeNight(currentMode);
    // 先对 html / body 打类（即使 body 还没挂上来也问题不大）
    ensureThemeOnBothElements(currentMode);

    // body 还没出现时，用 MutationObserver 再补一刀
    if (!document.body) {
        const mo = new MutationObserver(() => {
            if (document.body) {
                ensureThemeOnBothElements(currentMode);
                mo.disconnect();
            }
        });
        mo.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    // 再次强制确保 document loading 完成后主题颜色正确 (防止被原生 JS 覆盖)
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            ensureThemeOnBothElements(currentMode);
        });
    } else {
        ensureThemeOnBothElements(currentMode);
    }

    // ========= 4. 移动端 Tabs 横向滚动 & 位置记忆 =========
    function initMobileTabsScroll() {
        const body = document.body;
        if (!body || !body.classList.contains("v2p-mobile")) return;

        // Tabs 容器：兼容首页 / 其他页面
        const tabs = document.querySelector("#Main #Tabs, #Tabs");
        if (!tabs) return;

        const STORAGE_KEY = "v2p-mobile-tabs-scroll";

        // 针对不同页面生成一个 key，避免互相干扰
        const pageKey = (() => {
            const path = location.pathname || "/";
            const search = location.search || "";
            try {
                const params = new URLSearchParams(search);
                const tab = params.get("tab") || "";
                // 首页 tab 列表，用 tab 名区分；其他页面用路径
                return tab ? `home?tab=${tab}` : path;
            } catch {
                return path + search;
            }
        })();

        const fullKey = `${STORAGE_KEY}:${pageKey}`;

        // 恢复滚动位置或居中当前 tab
        const restoreOrCenter = () => {
            const saved = localStorage.getItem(fullKey);

            if (saved != null) {
                const val = Number(saved);
                if (!Number.isNaN(val)) {
                    tabs.scrollLeft = val;
                    return;
                }
            }

            // 没有保存记录时，让当前 tab 居中显示
            const current = tabs.querySelector(".tab_current");
            if (!current) return;

            const parentRect = tabs.getBoundingClientRect();
            const itemRect = current.getBoundingClientRect();
            const offset =
                itemRect.left -
                parentRect.left -
                (parentRect.width - itemRect.width) / 2;

            tabs.scrollLeft += offset;
        };

        // 等布局完成后再滚动，避免计算不准
        (window.requestAnimationFrame || setTimeout)(restoreOrCenter, 0);

        // 监听滚动，保存位置（用 rAF 做个简单节流）
        let ticking = false;
        tabs.addEventListener(
            "scroll",
            () => {
                if (ticking) return;
                ticking = true;

                (window.requestAnimationFrame || setTimeout)(() => {
                    ticking = false;
                    localStorage.setItem(fullKey, String(tabs.scrollLeft));
                }, 16);
            },
            { passive: true },
        );
    }

    // DOMReady 后再绑定按钮事件 + 监听 Wrapper 动态变化
    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn, { once: true });
        } else {
            fn();
        }
    }

    onReady(() => {
        bindToggleEvents();
        initMobileTabsScroll(); // ★ 新增：初始化移动端 Tabs 横向滚动 & 记忆
        // 监听主容器的 DOM 变化，防止部分页面局部刷新后主题类丢失
        const wrapper = document.getElementById("Wrapper");
        if (wrapper) {
            let reapplyScheduled = false;
            const mo = new MutationObserver(() => {
                // 使用 requestAnimationFrame 做简单节流，避免频繁重复执行
                if (reapplyScheduled) return;
                reapplyScheduled = true;
                (window.requestAnimationFrame || setTimeout)(() => {
                    reapplyScheduled = false;
                    ensureThemeOnBothElements(currentMode || getSavedMode());
                });
            });
            mo.observe(wrapper, {
                childList: true,
                subtree: true,
            });
        }
    });
})();
