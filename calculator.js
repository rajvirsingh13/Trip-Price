"use strict";

/* =========================================================
   TRIP PRICE - TRIP CALCULATOR JAVASCRIPT
   File: frontend/js/calculator.js

   Purpose:
   - Validate the homepage trip calculator
   - Swap origin and destination
   - Read trip type and transport selection
   - Store calculator data safely for the results page
   - Redirect to calculator.html with query parameters

   This file does NOT calculate fake live prices.
   The actual estimation logic will be handled by the
   calculator page and future estimator/data modules.

   Expected existing HTML naming:
   - .trip-calculator-form
   - #origin
   - #destination
   - #trip-type
   - input[name="transport"]
   - .swap-button
   - .form-error
   - .calculator-general-error
   - .calculate-button
   - .calculator-loading
========================================================= */

(function () {
    const MAX_LOCATION_LENGTH = 100;

    /**
     * Initializes the homepage trip calculator.
     */
    function initializeTripCalculator() {
        const form = document.querySelector(
            ".trip-calculator-form"
        );

        if (!form) {
            return;
        }

        const originInput = document.querySelector("#origin");
        const destinationInput = document.querySelector(
            "#destination"
        );
        const tripTypeSelect = document.querySelector(
            "#trip-type"
        );
        const swapButton = document.querySelector(
            ".swap-button"
        );
        const calculateButton = document.querySelector(
            ".calculate-button"
        );
        const loadingIndicator = document.querySelector(
            ".calculator-loading"
        );
        const generalError = document.querySelector(
            ".calculator-general-error"
        );

        if (
            !originInput ||
            !destinationInput ||
            !tripTypeSelect ||
            !calculateButton
        ) {
            return;
        }

        /**
         * Initializes the origin/destination swap button.
         */
        if (swapButton) {
            swapButton.addEventListener(
                "click",
                function () {
                    swapLocations(
                        originInput,
                        destinationInput
                    );

                    clearFieldError(originInput);
                    clearFieldError(destinationInput);

                    originInput.focus();
                }
            );
        }

        /**
         * Clear an error as the user starts correcting input.
         */
        originInput.addEventListener(
            "input",
            function () {
                clearFieldError(originInput);
                clearGeneralError(generalError);
            }
        );

        destinationInput.addEventListener(
            "input",
            function () {
                clearFieldError(destinationInput);
                clearGeneralError(generalError);
            }
        );

        tripTypeSelect.addEventListener(
            "change",
            function () {
                clearFieldError(tripTypeSelect);
                clearGeneralError(generalError);
            }
        );

        /**
         * Validate and process the calculator form.
         */
        form.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                clearAllErrors(
                    form,
                    generalError
                );

                const formData = getCalculatorData(
                    originInput,
                    destinationInput,
                    tripTypeSelect,
                    form
                );

                const validationResult =
                    validateCalculatorData(
                        formData
                    );

                if (!validationResult.isValid) {
                    showValidationErrors(
                        validationResult.errors,
                        {
                            originInput,
                            destinationInput,
                            tripTypeSelect,
                            form,
                            generalError
                        }
                    );

                    focusFirstInvalidField(
                        validationResult.errors,
                        {
                            originInput,
                            destinationInput,
                            tripTypeSelect
                        }
                    );

                    return;
                }

                setLoadingState(
                    calculateButton,
                    loadingIndicator,
                    true
                );

                const queryString =
                    createCalculatorQuery(
                        formData
                    );

                /*
                 * Use a short timeout so the loading state is
                 * perceptible without creating unnecessary delay.
                 */
                window.setTimeout(function () {
                    window.location.href =
                        "calculator.html?" +
                        queryString;
                }, 150);
            }
        );
    }

    /**
     * Swaps origin and destination values.
     *
     * @param {HTMLInputElement} originInput
     * @param {HTMLInputElement} destinationInput
     */
    function swapLocations(
        originInput,
        destinationInput
    ) {
        const originValue = originInput.value;
        const destinationValue =
            destinationInput.value;

        originInput.value = destinationValue;
        destinationInput.value = originValue;
    }

    /**
     * Reads and normalizes all calculator values.
     *
     * @param {HTMLInputElement} originInput
     * @param {HTMLInputElement} destinationInput
     * @param {HTMLSelectElement} tripTypeSelect
     * @param {HTMLFormElement} form
     *
     * @returns {{
     *   origin: string,
     *   destination: string,
     *   tripType: string,
     *   transport: string
     * }}
     */
    function getCalculatorData(
        originInput,
        destinationInput,
        tripTypeSelect,
        form
    ) {
        const selectedTransport =
            form.querySelector(
                'input[name="transport"]:checked'
            );

        return {
            origin: normalizeLocation(
                originInput.value
            ),
            destination: normalizeLocation(
                destinationInput.value
            ),
            tripType: tripTypeSelect.value.trim(),
            transport: selectedTransport
                ? selectedTransport.value.trim()
                : ""
        };
    }

    /**
     * Normalizes location input while preserving the user's
     * intended place name.
     *
     * @param {string} value
     * @returns {string}
     */
    function normalizeLocation(value) {
        return value
            .trim()
            .replace(/\s+/g, " ");
    }

    /**
     * Validates calculator input.
     *
     * @param {{
     *   origin: string,
     *   destination: string,
     *   tripType: string,
     *   transport: string
     * }} data
     *
     * @returns {{
     *   isValid: boolean,
     *   errors: {
     *     origin?: string,
     *     destination?: string,
     *     tripType?: string,
     *     transport?: string
     *   }
     * }}
     */
    function validateCalculatorData(data) {
        const errors = {};

        if (!data.origin) {
            errors.origin =
                "Please enter your starting city.";
        } else if (
            data.origin.length >
            MAX_LOCATION_LENGTH
        ) {
            errors.origin =
                "Starting city is too long.";
        }

        if (!data.destination) {
            errors.destination =
                "Please enter your destination city.";
        } else if (
            data.destination.length >
            MAX_LOCATION_LENGTH
        ) {
            errors.destination =
                "Destination city is too long.";
        }

        if (
            data.origin &&
            data.destination &&
            areSameLocation(
                data.origin,
                data.destination
            )
        ) {
            errors.destination =
                "Starting city and destination cannot be the same.";
        }

        if (!data.tripType) {
            errors.tripType =
                "Please select a trip type.";
        }

        if (!data.transport) {
            errors.transport =
                "Please select a transport option.";
        }

        return {
            isValid:
                Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Compares two normalized locations.
     *
     * @param {string} firstLocation
     * @param {string} secondLocation
     * @returns {boolean}
     */
    function areSameLocation(
        firstLocation,
        secondLocation
    ) {
        return (
            firstLocation
                .trim()
                .toLowerCase() ===
            secondLocation
                .trim()
                .toLowerCase()
        );
    }

    /**
     * Shows validation messages using the existing
     * .form-error elements where possible.
     *
     * @param {Object} errors
     * @param {Object} elements
     */
    function showValidationErrors(
        errors,
        elements
    ) {
        if (errors.origin) {
            showFieldError(
                elements.originInput,
                errors.origin
            );
        }

        if (errors.destination) {
            showFieldError(
                elements.destinationInput,
                errors.destination
            );
        }

        if (errors.tripType) {
            showFieldError(
                elements.tripTypeSelect,
                errors.tripType
            );
        }

        if (errors.transport) {
            showTransportError(
                elements.form,
                errors.transport,
                elements.generalError
            );
        }
    }

    /**
     * Finds the .form-error associated with an input.
     *
     * The existing HTML structure is expected to keep
     * the error element in the same .form-group.
     *
     * @param {HTMLElement} input
     * @returns {HTMLElement|null}
     */
    function getFieldErrorElement(input) {
        const formGroup =
            input.closest(".form-group");

        if (!formGroup) {
            return null;
        }

        return formGroup.querySelector(
            ".form-error"
        );
    }

    /**
     * Displays a field-specific validation error.
     *
     * @param {HTMLElement} input
     * @param {string} message
     */
    function showFieldError(
        input,
        message
    ) {
        const errorElement =
            getFieldErrorElement(input);

        input.setAttribute(
            "aria-invalid",
            "true"
        );

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    /**
     * Clears a field-specific validation error.
     *
     * @param {HTMLElement} input
     */
    function clearFieldError(input) {
        const errorElement =
            getFieldErrorElement(input);

        input.removeAttribute(
            "aria-invalid"
        );

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    /**
     * Shows an error related to the transport fieldset.
     *
     * @param {HTMLFormElement} form
     * @param {string} message
     * @param {HTMLElement|null} generalError
     */
    function showTransportError(
        form,
        message,
        generalError
    ) {
        const transportFieldset =
            form.querySelector(
                ".transport-fieldset"
            );

        if (transportFieldset) {
            const transportError =
                transportFieldset.querySelector(
                    ".form-error"
                );

            if (transportError) {
                transportError.textContent =
                    message;
                return;
            }
        }

        if (generalError) {
            generalError.textContent = message;
        }
    }

    /**
     * Clears all existing form validation errors.
     *
     * @param {HTMLFormElement} form
     * @param {HTMLElement|null} generalError
     */
    function clearAllErrors(
        form,
        generalError
    ) {
        const invalidElements =
            form.querySelectorAll(
                '[aria-invalid="true"]'
            );

        invalidElements.forEach(function (
            element
        ) {
            element.removeAttribute(
                "aria-invalid"
            );
        });

        const errorElements =
            form.querySelectorAll(
                ".form-error"
            );

        errorElements.forEach(function (
            errorElement
        ) {
            errorElement.textContent = "";
        });

        clearGeneralError(generalError);
    }

    /**
     * Clears the general calculator error.
     *
     * @param {HTMLElement|null} generalError
     */
    function clearGeneralError(generalError) {
        if (generalError) {
            generalError.textContent = "";
        }
    }

    /**
     * Focuses the first invalid field.
     *
     * @param {Object} errors
     * @param {Object} inputs
     */
    function focusFirstInvalidField(
        errors,
        inputs
    ) {
        if (errors.origin) {
            inputs.originInput.focus();
            return;
        }

        if (errors.destination) {
            inputs.destinationInput.focus();
            return;
        }

        if (errors.tripType) {
            inputs.tripTypeSelect.focus();
        }
    }

    /**
     * Sets or removes the loading state.
     *
     * @param {HTMLButtonElement} button
     * @param {HTMLElement|null} loadingIndicator
     * @param {boolean} isLoading
     */
    function setLoadingState(
        button,
        loadingIndicator,
        isLoading
    ) {
        button.disabled = isLoading;

        button.setAttribute(
            "aria-busy",
            isLoading ? "true" : "false"
        );

        if (loadingIndicator) {
            loadingIndicator.hidden = !isLoading;
        }
    }

    /**
     * Converts calculator data into safe URL query parameters.
     *
     * URLSearchParams automatically encodes special characters.
     *
     * @param {{
     *   origin: string,
     *   destination: string,
     *   tripType: string,
     *   transport: string
     * }} data
     *
     * @returns {string}
     */
    function createCalculatorQuery(data) {
        const parameters =
            new URLSearchParams();

        parameters.set(
            "origin",
            data.origin
        );

        parameters.set(
            "destination",
            data.destination
        );

        parameters.set(
            "tripType",
            data.tripType
        );

        parameters.set(
            "transport",
            data.transport
        );

        return parameters.toString();
    }

    /**
     * Initialize safely after the DOM is ready.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeTripCalculator,
            {
                once: true
            }
        );
    } else {
        initializeTripCalculator();
    }
})();
