"use strict";

/* =========================================================
   TRIP PRICE - CALCULATOR RESULTS
   File: frontend/js/calculator-results.js

   Purpose:
   - Reads trip data from URL query parameters
   - Validates trip information
   - Reads a user-entered route distance
   - Generates minimum, medium and maximum estimates
   - Displays transparent estimation assumptions
   - Updates the calculator results page accessibly

   Required script loading order:
   1. trip-data.js
   2. trip-estimator.js
   3. calculator-results.js

   IMPORTANT:
   This script does NOT claim to provide live fares,
   real-time ticket prices, or official route distances.
========================================================= */

(function () {
    const MAX_DISTANCE_KM = 5000;

    /**
     * Initializes the calculator results page.
     */
    function initializeCalculatorResults() {
        const estimator = window.TripPriceEstimator;

        if (!estimator) {
            return;
        }

        const elements = getPageElements();

        if (!elements.resultsPage) {
            return;
        }

        const tripData =
            estimator.getCalculatorParameters();

        const validationResult =
            estimator.validateTripData(
                tripData
            );

        if (!validationResult.isValid) {
            showInvalidTripState(
                elements,
                validationResult.errors
            );

            return;
        }

        populateTripSummary(
            elements,
            tripData
        );

        initializeDistanceForm(
            elements,
            tripData,
            estimator
        );

        showDistanceInputState(elements);
    }

    /**
     * Collects all calculator result page elements.
     *
     * The future calculator.html file will provide these IDs
     * and classes.
     *
     * @returns {Object}
     */
    function getPageElements() {
        return {
            resultsPage: document.querySelector(
                ".calculator-results-page"
            ),

            tripSummary: document.querySelector(
                ".trip-summary"
            ),

            tripOrigin: document.querySelector(
                "[data-trip-origin]"
            ),

            tripDestination: document.querySelector(
                "[data-trip-destination]"
            ),

            tripTransport: document.querySelector(
                "[data-trip-transport]"
            ),

            tripType: document.querySelector(
                "[data-trip-type]"
            ),

            distanceForm: document.querySelector(
                ".distance-form"
            ),

            distanceInput: document.querySelector(
                "#distance-km"
            ),

            distanceError: document.querySelector(
                ".distance-error"
            ),

            calculateEstimateButton:
                document.querySelector(
                    ".calculate-estimate-button"
                ),

            resultsSection: document.querySelector(
                ".estimation-results"
            ),

            resultsStatus: document.querySelector(
                ".results-status"
            ),

            minimumEstimate: document.querySelector(
                "[data-estimate-minimum]"
            ),

            mediumEstimate: document.querySelector(
                "[data-estimate-medium]"
            ),

            maximumEstimate: document.querySelector(
                "[data-estimate-maximum]"
            ),

            estimateDistance: document.querySelector(
                "[data-estimate-distance]"
            ),

            estimateTransport: document.querySelector(
                "[data-estimate-transport]"
            ),

            estimateTripType: document.querySelector(
                "[data-estimate-trip-type]"
            ),

            assumptionsList: document.querySelector(
                ".estimate-assumptions"
            ),

            generalError: document.querySelector(
                ".results-general-error"
            ),

            invalidTripSection:
                document.querySelector(
                    ".invalid-trip-state"
                ),

            distanceSection: document.querySelector(
                ".distance-input-section"
            )
        };
    }

    /**
     * Displays the trip information received from the homepage
     * calculator.
     *
     * @param {Object} elements
     * @param {Object} tripData
     */
    function populateTripSummary(
        elements,
        tripData
    ) {
        const tripDataSource =
            window.TripPriceData;

        if (elements.tripOrigin) {
            elements.tripOrigin.textContent =
                tripData.origin;
        }

        if (elements.tripDestination) {
            elements.tripDestination.textContent =
                tripData.destination;
        }

        if (
            elements.tripTransport &&
            tripDataSource
        ) {
            const transportProfile =
                tripDataSource.getTransportProfile(
                    tripData.transport
                );

            if (transportProfile) {
                elements.tripTransport.textContent =
                    transportProfile.name;
            }
        }

        if (
            elements.tripType &&
            tripDataSource
        ) {
            const tripTypeProfile =
                tripDataSource.getTripTypeProfile(
                    tripData.tripType
                );

            if (tripTypeProfile) {
                elements.tripType.textContent =
                    tripTypeProfile.name;
            }
        }
    }

    /**
     * Initializes the distance input form.
     *
     * @param {Object} elements
     * @param {Object} tripData
     * @param {Object} estimator
     */
    function initializeDistanceForm(
        elements,
        tripData,
        estimator
    ) {
        if (
            !elements.distanceForm ||
            !elements.distanceInput
        ) {
            return;
        }

        elements.distanceInput.addEventListener(
            "input",
            function () {
                clearDistanceError(elements);
                clearGeneralError(elements);
            }
        );

        elements.distanceForm.addEventListener(
            "submit",
            function (event) {
                event.preventDefault();

                clearDistanceError(elements);
                clearGeneralError(elements);

                const distanceKm =
                    getDistanceValue(
                        elements.distanceInput
                    );

                const validationResult =
                    validateDistance(distanceKm);

                if (!validationResult.isValid) {
                    showDistanceError(
                        elements,
                        validationResult.message
                    );

                    elements.distanceInput.focus();

                    return;
                }

                const estimationResult =
                    estimator.createTripEstimate({
                        origin: tripData.origin,

                        destination:
                            tripData.destination,

                        transport:
                            tripData.transport,

                        tripType:
                            tripData.tripType,

                        distanceKm
                    });

                if (!estimationResult.isValid) {
                    showGeneralError(
                        elements,
                        estimationResult.errors
                    );

                    return;
                }

                displayEstimationResult(
                    elements,
                    estimationResult.trip,
                    estimator
                );
            }
        );
    }

    /**
     * Converts the distance input value into a number.
     *
     * @param {HTMLInputElement} distanceInput
     * @returns {number}
     */
    function getDistanceValue(distanceInput) {
        return Number(
            distanceInput.value
        );
    }

    /**
     * Validates a manually entered distance.
     *
     * @param {number} distanceKm
     * @returns {{
     *   isValid: boolean,
     *   message: string
     * }}
     */
    function validateDistance(distanceKm) {
        if (
            !Number.isFinite(distanceKm) ||
            distanceKm <= 0
        ) {
            return {
                isValid: false,

                message:
                    "Please enter a valid distance in kilometres."
            };
        }

        if (distanceKm > MAX_DISTANCE_KM) {
            return {
                isValid: false,

                message:
                    "Please enter a distance of 5,000 km or less."
            };
        }

        return {
            isValid: true,
            message: ""
        };
    }

    /**
     * Displays the generated estimation result.
     *
     * @param {Object} elements
     * @param {Object} trip
     * @param {Object} estimator
     */
    function displayEstimationResult(
        elements,
        trip,
        estimator
    ) {
        if (elements.minimumEstimate) {
            elements.minimumEstimate.textContent =
                estimator.formatCurrency(
                    trip.minimum
                );
        }

        if (elements.mediumEstimate) {
            elements.mediumEstimate.textContent =
                estimator.formatCurrency(
                    trip.medium
                );
        }

        if (elements.maximumEstimate) {
            elements.maximumEstimate.textContent =
                estimator.formatCurrency(
                    trip.maximum
                );
        }

        if (elements.estimateDistance) {
            elements.estimateDistance.textContent =
                estimator.formatDistance(
                    trip.distanceKm
                );
        }

        if (elements.estimateTransport) {
            elements.estimateTransport.textContent =
                trip.transportName;
        }

        if (elements.estimateTripType) {
            elements.estimateTripType.textContent =
                trip.tripTypeName;
        }

        populateAssumptions(
            elements.assumptionsList,
            trip,
            estimator
        );

        if (elements.resultsSection) {
            elements.resultsSection.hidden = false;
        }

        if (elements.resultsStatus) {
            elements.resultsStatus.textContent =
                "Trip cost estimate updated.";
        }

        scrollToResults(elements);
    }

    /**
     * Creates the transparent assumptions list.
     *
     * No unsafe HTML from user input is inserted.
     *
     * @param {HTMLElement|null} assumptionsList
     * @param {Object} trip
     * @param {Object} estimator
     */
    function populateAssumptions(
        assumptionsList,
        trip,
        estimator
    ) {
        if (!assumptionsList) {
            return;
        }

        assumptionsList.textContent = "";

        const assumptions = [
            "Distance used: " +
                estimator.formatDistance(
                    trip.distanceKm
                ),

            "Transport: " +
                trip.transportName,

            "Trip type: " +
                trip.tripTypeName,

            "Estimated cost range is based on local planning assumptions.",

            trip.assumptions.transportNote
        ];

        assumptions.forEach(function (assumption) {
            const listItem =
                document.createElement("li");

            listItem.textContent = assumption;

            assumptionsList.appendChild(
                listItem
            );
        });
    }

    /**
     * Scrolls to the visible estimation results.
     *
     * Respects reduced-motion preferences.
     *
     * @param {Object} elements
     */
    function scrollToResults(elements) {
        if (!elements.resultsSection) {
            return;
        }

        const prefersReducedMotion =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        elements.resultsSection.scrollIntoView({
            behavior: prefersReducedMotion
                ? "auto"
                : "smooth",

            block: "start"
        });

        focusElement(elements.resultsSection);
    }

    /**
     * Focuses an element safely for keyboard users.
     *
     * @param {HTMLElement} element
     */
    function focusElement(element) {
        if (
            !element ||
            typeof element.focus !== "function"
        ) {
            return;
        }

        const hadTabIndex =
            element.hasAttribute("tabindex");

        if (!hadTabIndex) {
            element.setAttribute(
                "tabindex",
                "-1"
            );
        }

        element.focus({
            preventScroll: true
        });

        if (!hadTabIndex) {
            element.addEventListener(
                "blur",
                function handleBlur() {
                    element.removeAttribute(
                        "tabindex"
                    );

                    element.removeEventListener(
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
     * Shows the normal distance input state.
     *
     * @param {Object} elements
     */
    function showDistanceInputState(elements) {
        if (elements.invalidTripSection) {
            elements.invalidTripSection.hidden =
                true;
        }

        if (elements.distanceSection) {
            elements.distanceSection.hidden =
                false;
        }

        if (elements.tripSummary) {
            elements.tripSummary.hidden =
                false;
        }

        if (elements.resultsSection) {
            elements.resultsSection.hidden =
                true;
        }
    }

    /**
     * Shows the invalid trip state when required query
     * parameters are missing or invalid.
     *
     * @param {Object} elements
     * @param {string[]} errors
     */
    function showInvalidTripState(
        elements,
        errors
    ) {
        if (elements.tripSummary) {
            elements.tripSummary.hidden = true;
        }

        if (elements.distanceSection) {
            elements.distanceSection.hidden = true;
        }

        if (elements.resultsSection) {
            elements.resultsSection.hidden = true;
        }

        if (elements.invalidTripSection) {
            elements.invalidTripSection.hidden =
                false;

            const errorList =
                elements.invalidTripSection.querySelector(
                    ".invalid-trip-errors"
                );

            if (errorList) {
                errorList.textContent = "";

                errors.forEach(function (error) {
                    const listItem =
                        document.createElement("li");

                    listItem.textContent = error;

                    errorList.appendChild(
                        listItem
                    );
                });
            }

            focusElement(
                elements.invalidTripSection
            );
        }
    }

    /**
     * Shows a distance-specific error.
     *
     * @param {Object} elements
     * @param {string} message
     */
    function showDistanceError(
        elements,
        message
    ) {
        if (elements.distanceInput) {
            elements.distanceInput.setAttribute(
                "aria-invalid",
                "true"
            );
        }

        if (elements.distanceError) {
            elements.distanceError.textContent =
                message;
        }
    }

    /**
     * Clears the distance-specific error.
     *
     * @param {Object} elements
     */
    function clearDistanceError(elements) {
        if (elements.distanceInput) {
            elements.distanceInput.removeAttribute(
                "aria-invalid"
            );
        }

        if (elements.distanceError) {
            elements.distanceError.textContent = "";
        }
    }

    /**
     * Shows a general estimation error.
     *
     * @param {Object} elements
     * @param {string[]} errors
     */
    function showGeneralError(
        elements,
        errors
    ) {
        if (!elements.generalError) {
            return;
        }

        elements.generalError.textContent =
            errors.join(" ");
    }

    /**
     * Clears the general estimation error.
     *
     * @param {Object} elements
     */
    function clearGeneralError(elements) {
        if (elements.generalError) {
            elements.generalError.textContent = "";
        }
    }

    /**
     * Start safely after the DOM is ready.
     */
    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeCalculatorResults,
            {
                once: true
            }
        );
    } else {
        initializeCalculatorResults();
    }
})();
