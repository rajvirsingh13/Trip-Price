"use strict";

/* =========================================================
   TRIP PRICE - THEME JAVASCRIPT
   File: frontend/js/theme.js

   Purpose:
   - Light and dark theme support
   - Saves user preference locally
   - Respects system preference by default
   - Updates the theme toggle accessibly

   CSS dependency:
   - frontend/css/style.css

   Expected HTML:
   - .theme-toggle
   - <html data-theme="light"> or data-theme="dark"
========================================================= */

(function () {
    const THEME_STORAGE_KEY = "trip-price-theme";
    const DARK_THEME = "dark";
    const LIGHT_THEME = "light";

    /**
     * Returns true if the user's device/browser currently
     * prefers a dark color scheme.
     *
     * @returns {boolean}
     */
    function prefersDarkTheme() {
        return window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
    }

    /**
     * Gets the previously saved theme.
     *
     * Invalid values are ignored.
     *
     * @returns {string|null}
     */
    function getSavedTheme() {
        try {
            const savedTheme = localStorage.getItem(
                THEME_STORAGE_KEY
            );

            if (
                savedTheme === DARK_THEME ||
                savedTheme === LIGHT_THEME
            ) {
                return savedTheme;
            }
        } catch (error) {
            /*
             * localStorage may be unavailable in some
             * privacy modes. The website still works.
             */
        }

        return null;
    }

    /**
     * Determines the initial theme.
     *
     * Priority:
     * 1. Previously saved user preference
     * 2. System/browser preference
     *
     * @returns {string}
     */
    function getInitialTheme() {
        const savedTheme = getSavedTheme();

        if (savedTheme) {
            return savedTheme;
        }

        return prefersDarkTheme()
            ? DARK_THEME
            : LIGHT_THEME;
    }

    /**
     * Saves the user's theme preference.
     *
     * @param {string} theme
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(
                THEME_STORAGE_KEY,
                theme
            );
        } catch (error) {
            /*
             * Storage is optional. If unavailable, the
             * selected theme still works for this session.
             */
        }
    }

    /**
     * Returns the visible icon for a theme.
     *
     * @param {string} theme
     * @returns {string}
     */
    function getThemeIcon(theme) {
        return theme === DARK_THEME
            ? "☀️"
            : "🌙";
    }

    /**
     * Returns an accessible label for the theme toggle.
     *
     * The label describes the action that will happen when
     * the button is activated.
     *
     * @param {string} theme
     * @returns {string}
     */
    function getThemeToggleLabel(theme) {
        return theme === DARK_THEME
            ? "Switch to light mode"
            : "Switch to dark mode";
    }

    /**
     * Applies the selected theme to the root HTML element.
     *
     * @param {string} theme
     * @param {HTMLButtonElement|null} themeToggle
     */
    function applyTheme(theme, themeToggle) {
        const root = document.documentElement;

        root.setAttribute("data-theme", theme);

        /*
         * The CSS stylesheet contains:
         * :root[data-theme="dark"]
         */
        if (themeToggle) {
            themeToggle.textContent = getThemeIcon(theme);

            themeToggle.setAttribute(
                "aria-label",
                getThemeToggleLabel(theme)
            );

            themeToggle.setAttribute(
                "title",
                getThemeToggleLabel(theme)
            );

            themeToggle.setAttribute(
                "aria-pressed",
                theme === DARK_THEME
                    ? "true"
                    : "false"
            );
        }
    }

    /**
     * Initializes theme functionality.
     */
    function initializeTheme() {
        const themeToggle = document.querySelector(
            ".theme-toggle"
        );

        const initialTheme = getInitialTheme();

        applyTheme(
            initialTheme,
            themeToggle
        );

        if (!themeToggle) {
            return;
        }

        themeToggle.addEventListener(
            "click",
            function () {
                const currentTheme =
                    document.documentElement.getAttribute(
                        "data-theme"
                    );

                const newTheme =
                    currentTheme === DARK_THEME
                        ? LIGHT_THEME
                        : DARK_THEME;

                applyTheme(
                    newTheme,
                    themeToggle
                );

                saveTheme(newTheme);
            }
        );
    }

    /**
     * Run safely whether the script uses defer or not.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTheme,
            {
                once: true
            }
        );
    } else {
        initializeTheme();
    }
})();
