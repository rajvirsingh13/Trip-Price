"use strict";

/* =========================================================
   TRIP PRICE - CITY AUTOCOMPLETE
   File: frontend/js/city-autocomplete.js

   Purpose:
   - Adds accessible city suggestions to origin/destination
     inputs when compatible elements exist
   - Uses the local TripPriceCities dataset
   - Supports keyboard navigation
   - Does not require an API or backend

   Direct dependency:
   - frontend/js/city-data.js

   Compatibility:
   - Works with existing calculator inputs when they have:
       #origin
       #destination

   - Also supports data-city-autocomplete inputs for future
     pages without changing the existing calculator values.

   IMPORTANT:
   - This file does not calculate route distances.
   - This file does not use geolocation.
   - This file does not claim live city data.
========================================================= */

(function () {
    const MAX_SUGGESTIONS = 8;

    const KEY = Object.freeze({
        ARROW_DOWN: "ArrowDown",
        ARROW_UP: "ArrowUp",
        ENTER: "Enter",
        ESCAPE: "Escape",
        TAB: "Tab"
    });

    /**
     * Starts autocomplete after the DOM is ready.
     */
    function initializeCityAutocomplete() {
        const cityData = window.TripPriceCities;

        if (!cityData) {
            return;
        }

        const inputs = getSupportedInputs();

        inputs.forEach(function (input) {
            createAutocomplete(input, cityData);
        });
    }

    /**
     * Finds compatible city input fields.
     *
     * Existing calculator compatibility:
     * - #origin
     * - #destination
     *
     * Future compatibility:
     * - [data-city-autocomplete]
     *
     * @returns {HTMLInputElement[]}
     */
    function getSupportedInputs() {
        const selector = [
            "#origin",
            "#destination",
            "[data-city-autocomplete]"
        ].join(",");

        const elements = Array.from(
            document.querySelectorAll(selector)
        );

        const uniqueElements = [];

        elements.forEach(function (element) {
            if (
                element instanceof HTMLInputElement &&
                !uniqueElements.includes(element)
            ) {
                uniqueElements.push(element);
            }
        });

        return uniqueElements;
    }

    /**
     * Creates autocomplete functionality for one input.
     *
     * @param {HTMLInputElement} input
     * @param {Object} cityData
     */
    function createAutocomplete(input, cityData) {
        if (
            input.dataset.cityAutocompleteReady ===
            "true"
        ) {
            return;
        }

        input.dataset.cityAutocompleteReady =
            "true";

        const autocompleteId =
            createAutocompleteId(input);

        const listbox =
            createSuggestionListbox(
                autocompleteId
            );

        const wrapper =
            getOrCreateInputWrapper(input);

        wrapper.appendChild(listbox);

        configureInputAccessibility(
            input,
            listbox.id
        );

        const state = {
            activeIndex: -1,
            suggestions: [],
            isOpen: false,
            listbox
        };

        input.addEventListener(
            "input",
            function () {
                handleInputChange(
                    input,
                    cityData,
                    state
                );
            }
        );

        input.addEventListener(
            "focus",
            function () {
                handleInputFocus(
                    input,
                    cityData,
                    state
                );
            }
        );

        input.addEventListener(
            "keydown",
            function (event) {
                handleKeyboardNavigation(
                    event,
                    input,
                    state
                );
            }
        );

        input.addEventListener(
            "blur",
            function () {
                /*
                 * A short delay allows a pointer click on a
                 * suggestion to complete before the list closes.
                 */
                window.setTimeout(function () {
                    closeSuggestions(
                        input,
                        state
                    );
                }, 150);
            }
        );

        listbox.addEventListener(
            "mousedown",
            function (event) {
                /*
                 * Prevent input blur before the click handler
                 * can select the suggestion.
                 */
                event.preventDefault();
            }
        );
    }

    /**
     * Creates a predictable, unique listbox ID.
     *
     * @param {HTMLInputElement} input
     * @returns {string}
     */
    function createAutocompleteId(input) {
        const baseId =
            input.id ||
            "city-input";

        const sanitizedBaseId =
            baseId
                .toLowerCase()
                .replace(
                    /[^a-z0-9_-]+/g,
                    "-"
                )
                .replace(/^-+|-+$/g, "");

        let autocompleteId =
            sanitizedBaseId +
            "-city-suggestions";

        let counter = 2;

        while (
            document.getElementById(
                autocompleteId
            )
        ) {
            autocompleteId =
                sanitizedBaseId +
                "-city-suggestions-" +
                counter;

            counter += 1;
        }

        return autocompleteId;
    }

    /**
     * Creates the listbox element.
     *
     * @param {string} id
     * @returns {HTMLUListElement}
     */
    function createSuggestionListbox(id) {
        const listbox =
            document.createElement("ul");

        listbox.id = id;

        listbox.className =
            "city-suggestions";

        listbox.setAttribute(
            "role",
            "listbox"
        );

        listbox.hidden = true;

        return listbox;
    }

    /**
     * Gets an existing wrapper or creates one.
     *
     * A wrapper is needed to position the suggestion list
     * without changing the existing input ID or value.
     *
     * @param {HTMLInputElement} input
     * @returns {HTMLElement}
     */
    function getOrCreateInputWrapper(input) {
        const parent = input.parentElement;

        if (
            parent &&
            parent.classList.contains(
                "city-autocomplete-wrapper"
            )
        ) {
            return parent;
        }

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "city-autocomplete-wrapper";

        if (parent) {
            parent.insertBefore(
                wrapper,
                input
            );
        }

        wrapper.appendChild(input);

        return wrapper;
    }

    /**
     * Adds ARIA autocomplete attributes.
     *
     * @param {HTMLInputElement} input
     * @param {string} listboxId
     */
    function configureInputAccessibility(
        input,
        listboxId
    ) {
        input.setAttribute(
            "autocomplete",
            "off"
        );

        input.setAttribute(
            "role",
            "combobox"
        );

        input.setAttribute(
            "aria-autocomplete",
            "list"
        );

        input.setAttribute(
            "aria-expanded",
            "false"
        );

        input.setAttribute(
            "aria-controls",
            listboxId
        );
    }

    /**
     * Handles input changes.
     *
     * @param {HTMLInputElement} input
     * @param {Object} cityData
     * @param {Object} state
     */
    function handleInputChange(
        input,
        cityData,
        state
    ) {
        const query =
            input.value.trim();

        if (!query) {
            closeSuggestions(
                input,
                state
            );

            return;
        }

        const suggestions =
            cityData.searchCities(
                query,
                MAX_SUGGESTIONS
            );

        updateSuggestions(
            input,
            cityData,
            state,
            suggestions
        );
    }

    /**
     * Shows suggestions when an input receives focus.
     *
     * @param {HTMLInputElement} input
     * @param {Object} cityData
     * @param {Object} state
     */
    function handleInputFocus(
        input,
        cityData,
        state
    ) {
        const query =
            input.value.trim();

        if (!query) {
            return;
        }

        const suggestions =
            cityData.searchCities(
                query,
                MAX_SUGGESTIONS
            );

        updateSuggestions(
            input,
            cityData,
            state,
            suggestions
        );
    }

    /**
     * Updates the suggestion list.
     *
     * @param {HTMLInputElement} input
     * @param {Object} cityData
     * @param {Object} state
     * @param {Object[]} suggestions
     */
    function updateSuggestions(
        input,
        cityData,
        state,
        suggestions
    ) {
        state.suggestions = suggestions;
        state.activeIndex = -1;

        state.listbox.textContent = "";

        if (!suggestions.length) {
            closeSuggestions(
                input,
                state
            );

            return;
        }

        suggestions.forEach(function (
            city,
            index
        ) {
            const option =
                createSuggestionOption(
                    input,
                    cityData,
                    state,
                    city,
                    index
                );

            state.listbox.appendChild(
                option
            );
        });

        state.listbox.hidden = false;
        state.isOpen = true;

        input.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    /**
     * Creates one city suggestion.
     *
     * @param {HTMLInputElement} input
     * @param {Object} cityData
     * @param {Object} state
     * @param {Object} city
     * @param {number} index
     * @returns {HTMLLIElement}
     */
    function createSuggestionOption(
        input,
        cityData,
        state,
        city,
        index
    ) {
        const option =
            document.createElement("li");

        const optionId =
            state.listbox.id +
            "-option-" +
            index;

        option.id = optionId;

        option.className =
            "city-suggestion";

        option.setAttribute(
            "role",
            "option"
        );

        option.setAttribute(
            "aria-selected",
            "false"
        );

        const cityName =
            document.createElement("span");

        cityName.className =
            "city-suggestion-name";

        cityName.textContent =
            city.name;

        const cityState =
            document.createElement("span");

        cityState.className =
            "city-suggestion-state";

        cityState.textContent =
            cityData.getCityLabel(city);

        option.appendChild(cityName);
        option.appendChild(cityState);

        option.addEventListener(
            "click",
            function () {
                selectSuggestion(
                    input,
                    state,
                    index
                );
            }
        );

        option.addEventListener(
            "mousemove",
            function () {
                setActiveSuggestion(
                    input,
                    state,
                    index
                );
            }
        );

        return option;
    }

    /**
     * Handles keyboard interaction.
     *
     * @param {KeyboardEvent} event
     * @param {HTMLInputElement} input
     * @param {Object} state
     */
    function handleKeyboardNavigation(
        event,
        input,
        state
    ) {
        if (event.key === KEY.ARROW_DOWN) {
            if (!state.isOpen) {
                return;
            }

            event.preventDefault();

            moveActiveSuggestion(
                input,
                state,
                1
            );

            return;
        }

        if (event.key === KEY.ARROW_UP) {
            if (!state.isOpen) {
                return;
            }

            event.preventDefault();

            moveActiveSuggestion(
                input,
                state,
                -1
            );

            return;
        }

        if (event.key === KEY.ENTER) {
            if (
                !state.isOpen ||
                state.activeIndex < 0
            ) {
                return;
            }

            event.preventDefault();

            selectSuggestion(
                input,
                state,
                state.activeIndex
            );

            return;
        }

        if (event.key === KEY.ESCAPE) {
            if (!state.isOpen) {
                return;
            }

            event.preventDefault();

            closeSuggestions(
                input,
                state
            );

            return;
        }

        if (event.key === KEY.TAB) {
            closeSuggestions(
                input,
                state
            );
        }
    }

    /**
     * Moves the active keyboard selection.
     *
     * @param {HTMLInputElement} input
     * @param {Object} state
     * @param {number} direction
     */
    function moveActiveSuggestion(
        input,
        state,
        direction
    ) {
        const total =
            state.suggestions.length;

        if (!total) {
            return;
        }

        let nextIndex =
            state.activeIndex + direction;

        if (nextIndex >= total) {
            nextIndex = 0;
        }

        if (nextIndex < 0) {
            nextIndex = total - 1;
        }

        setActiveSuggestion(
            input,
            state,
            nextIndex
        );
    }

    /**
     * Updates active option styles and ARIA state.
     *
     * @param {HTMLInputElement} input
     * @param {Object} state
     * @param {number} index
     */
    function setActiveSuggestion(
        input,
        state,
        index
    ) {
        const options =
            Array.from(
                state.listbox.querySelectorAll(
                    ".city-suggestion"
                )
            );

        options.forEach(function (
            option,
            optionIndex
        ) {
            const isActive =
                optionIndex === index;

            option.classList.toggle(
                "is-active",
                isActive
            );

            option.setAttribute(
                "aria-selected",
                isActive
                    ? "true"
                    : "false"
            );
        });

        state.activeIndex = index;

        const activeOption =
            options[index];

        if (activeOption) {
            input.setAttribute(
                "aria-activedescendant",
                activeOption.id
            );

            activeOption.scrollIntoView({
                block: "nearest"
            });
        }
    }

    /**
     * Selects a city suggestion.
     *
     * Only the city name is inserted into the existing input.
     * This preserves compatibility with calculator.js and its
     * origin/destination URL parameters.
     *
     * @param {HTMLInputElement} input
     * @param {Object} state
     * @param {number} index
     */
    function selectSuggestion(
        input,
        state,
        index
    ) {
        const city =
            state.suggestions[index];

        if (!city) {
            return;
        }

        input.value = city.name;

        input.dispatchEvent(
            new Event(
                "input",
                {
                    bubbles: true
                }
            )
        );

        closeSuggestions(
            input,
            state
        );
    }

    /**
     * Closes and clears the suggestion list.
     *
     * @param {HTMLInputElement} input
     * @param {Object} state
     */
    function closeSuggestions(
        input,
        state
    ) {
        state.listbox.hidden = true;
        state.isOpen = false;
        state.activeIndex = -1;

        input.setAttribute(
            "aria-expanded",
            "false"
        );

        input.removeAttribute(
            "aria-activedescendant"
        );

        const options =
            state.listbox.querySelectorAll(
                ".city-suggestion"
            );

        options.forEach(function (option) {
            option.classList.remove(
                "is-active"
            );

            option.setAttribute(
                "aria-selected",
                "false"
            );
        });
    }

    /**
     * Initialize after the document is ready.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCityAutocomplete,
            {
                once: true
            }
        );
    } else {
        initializeCityAutocomplete();
    }
})();
