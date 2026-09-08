"use strict";

/* =========================================================
   TRIP PRICE - MAIN JAVASCRIPT
   File: frontend/js/main.js

   Purpose:
   - Mobile navigation open/close
   - Accessible navigation behavior
   - Smooth scrolling for same-page anchor links
   - Dynamic current-year footer support

   This file uses progressive enhancement:
   the website remains usable if JavaScript is unavailable.
========================================================= */

(function () {
    /**
     * Safely runs the application after the DOM is available.
     */
    function initializeApp() {
        initializeMobileNavigation();
        initializeSmoothScrolling();
        initializeFooterYear();
    }

    /**
     * Initializes the accessible mobile navigation.
     *
     * Expected HTML elements:
     * - .mobile-menu-button
     * - .main-navigation
     * - .navigation-link
     *
     * State classes:
     * - .main-navigation.is-open
     * - body.menu-open
     */
    function initializeMobileNavigation() {
        const menuButton = document.querySelector(".mobile-menu-button");
        const navigation = document.querySelector(".main-navigation");

        if (!menuButton || !navigation) {
            return;
        }

        const navigationLinks = navigation.querySelectorAll(".navigation-link");

        /**
         * Checks whether the current viewport uses the desktop
         * navigation layout.
         */
        function isDesktopViewport() {
            return window.matchMedia("(min-width: 1024px)").matches;
        }

        /**
         * Opens the mobile navigation.
         */
        function openNavigation() {
            if (isDesktopViewport()) {
                return;
            }

            navigation.classList.add("is-open");
            document.body.classList.add("menu-open");

            menuButton.setAttribute("aria-expanded", "true");
        }

        /**
         * Closes the mobile navigation.
         */
        function closeNavigation() {
            navigation.classList.remove("is-open");
            document.body.classList.remove("menu-open");

            menuButton.setAttribute("aria-expanded", "false");
        }

        /**
         * Toggles the mobile navigation.
         */
        function toggleNavigation() {
            const isOpen = navigation.classList.contains("is-open");

            if (isOpen) {
                closeNavigation();
            } else {
                openNavigation();
            }
        }

        menuButton.addEventListener("click", toggleNavigation);

        /**
         * Close the mobile menu after selecting a navigation link.
         */
        navigationLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeNavigation();
            });
        });

        /**
         * Allows Escape to close an open mobile navigation.
         */
        document.addEventListener("keydown", function (event) {
            if (event.key !== "Escape") {
                return;
            }

            if (navigation.classList.contains("is-open")) {
                closeNavigation();
                menuButton.focus();
            }
        });

        /**
         * If the viewport changes from mobile to desktop,
         * remove mobile-only state classes.
         */
        const desktopMediaQuery = window.matchMedia("(min-width: 1024px)");

        function handleViewportChange(event) {
            if (event.matches) {
                closeNavigation();
            }
        }

        if (typeof desktopMediaQuery.addEventListener === "function") {
            desktopMediaQuery.addEventListener(
                "change",
                handleViewportChange
            );
        } else if (
            typeof desktopMediaQuery.addListener === "function"
        ) {
            /*
             * Fallback for older browser implementations.
             */
            desktopMediaQuery.addListener(handleViewportChange);
        }
    }

    /**
     * Adds smooth scrolling for internal hash links.
     *
     * Native browser behavior remains available if JavaScript
     * is disabled.
     */
    function initializeSmoothScrolling() {
        const anchorLinks = document.querySelectorAll(
            'a[href^="#"]:not([href="#"])'
        );

        anchorLinks.forEach(function (link) {
            link.addEventListener("click", function (event) {
                const href = link.getAttribute("href");

                if (!href) {
                    return;
                }

                let target;

                try {
                    target = document.querySelector(href);
                } catch (error) {
                    return;
                }

                if (!target) {
                    return;
                }

                /*
                 * Respect users who prefer reduced motion.
                 */
                const prefersReducedMotion =
                    window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: prefersReducedMotion
                        ? "auto"
                        : "smooth",
                    block: "start"
                });

                /*
                 * Update the URL hash without forcing another
                 * browser scroll.
                 */
                if (
                    window.history &&
                    typeof window.history.pushState === "function"
                ) {
                    window.history.pushState(
                        null,
                        "",
                        href
                    );
                }

                /*
                 * Move keyboard focus to the destination when
                 * possible for better accessibility.
                 */
                focusTarget(target);
            });
        });
    }

    /**
     * Moves focus to a section target without permanently
     * changing its tabindex when possible.
     *
     * @param {HTMLElement} target - Element to receive focus.
     */
    function focusTarget(target) {
        if (!target || typeof target.focus !== "function") {
            return;
        }

        const hadTabIndex = target.hasAttribute("tabindex");

        if (!hadTabIndex) {
            target.setAttribute("tabindex", "-1");
        }

        target.focus({
            preventScroll: true
        });

        /*
         * Keep the temporary tabindex only while focus is on
         * the element. Remove it afterward to avoid changing
         * the page's normal tab order.
         */
        if (!hadTabIndex) {
            target.addEventListener(
                "blur",
                function handleBlur() {
                    target.removeAttribute("tabindex");

                    target.removeEventListener(
                        "blur",
                        handleBlur
                    );
                },
                {
                    once: true
                }
            );
        }
    }

    /**
     * Updates any element using the data-current-year attribute.
     *
     * Example future HTML:
     * <span data-current-year></span>
     */
    function initializeFooterYear() {
        const yearElements = document.querySelectorAll(
            "[data-current-year]"
        );

        if (!yearElements.length) {
            return;
        }

        const currentYear = String(
            new Date().getFullYear()
        );

        yearElements.forEach(function (element) {
            element.textContent = currentYear;
        });
    }

    /**
     * Start safely whether this script is loaded with defer
     * or without it.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeApp,
            {
                once: true
            }
        );
    } else {
        initializeApp();
    }
})();
