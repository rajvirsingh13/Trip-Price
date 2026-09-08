"use strict";

/* =========================================================
   TRIP PRICE - TRIP ESTIMATOR
   File: frontend/js/trip-estimator.js

   Purpose:
   - Reads calculator query parameters
   - Validates calculator data
   - Uses TripPriceData assumptions
   - Creates minimum, medium and maximum estimates
   - Provides reusable estimation functions

   Dependency:
   - frontend/js/trip-data.js

   IMPORTANT:
   This estimator provides planning estimates only.
   It does NOT provide live ticket prices, official fares,
   guaranteed prices, or real-time route distances.
========================================================= */

(function () {
    const DATA_NAMESPACE = "TripPriceData";

    /**
     * Returns the TripPriceData namespace safely.
     *
     * @returns {object|null}
     */
    function getTripPriceData() {
        if (
            typeof window[DATA_NAMESPACE] === "undefined"
        ) {
            return null;
        }

        return window[DATA_NAMESPACE];
    }

    /**
     * Normalizes a location name.
     *
     * @param {string} value
     * @returns {string}
     */
    function normalizeLocation(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value
            .trim()
            .replace(/\s+/g, " ");
    }

    /**
     * Checks whether two location names are the same.
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
            normalizeLocation(firstLocation)
                .toLowerCase() ===
            normalizeLocation(secondLocation)
                .toLowerCase()
        );
    }

    /**
     * Converts a value into a safe positive number.
     *
     * @param {*} value
     * @returns {number|null}
     */
    function parsePositiveNumber(value) {
        const numberValue = Number(value);

        if (
            !Number.isFinite(numberValue) ||
            numberValue <= 0
        ) {
            return null;
        }

        return numberValue;
    }

    /**
     * Rounds a number to two decimal places.
     *
     * @param {number} value
     * @returns {number}
     */
    function roundToTwoDecimals(value) {
        return Math.round(
            (value + Number.EPSILON) * 100
        ) / 100;
    }

    /**
     * Rounds a currency estimate to a practical whole number.
     *
     * @param {number} value
     * @returns {number}
     */
    function roundCurrency(value) {
        return Math.round(value);
    }

    /**
     * Reads Trip Price calculator parameters from a URL.
     *
     * Expected parameters:
     * - origin
     * - destination
     * - tripType
     * - transport
     *
     * @param {string} [search]
     * @returns {{
     *   origin: string,
     *   destination: string,
     *   tripType: string,
     *   transport: string
     * }}
     */
    function getCalculatorParameters(search) {
        const queryString =
            typeof search === "string"
                ? search
                : window.location.search;

        const parameters =
            new URLSearchParams(queryString);

        return {
            origin: normalizeLocation(
                parameters.get("origin") || ""
            ),

            destination: normalizeLocation(
                parameters.get("destination") || ""
            ),

            tripType: (
                parameters.get("tripType") || ""
            )
                .trim()
                .toLowerCase(),

            transport: (
                parameters.get("transport") || ""
            )
                .trim()
                .toLowerCase()
        };
    }

    /**
     * Validates calculator parameters using the central
     * TripPriceData definitions.
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
     *   errors: string[]
     * }}
     */
    function validateTripData(data) {
        const tripData = getTripPriceData();
        const errors = [];

        if (!tripData) {
            errors.push(
                "Trip estimation data is unavailable."
            );

            return {
                isValid: false,
                errors
            };
        }

        if (!data || typeof data !== "object") {
            errors.push(
                "Trip information is unavailable."
            );

            return {
                isValid: false,
                errors
            };
        }

        if (!data.origin) {
            errors.push(
                "Please provide a starting city."
            );
        }

        if (!data.destination) {
            errors.push(
                "Please provide a destination city."
            );
        }

        if (
            data.origin &&
            data.destination &&
            areSameLocation(
                data.origin,
                data.destination
            )
        ) {
            errors.push(
                "Starting city and destination cannot be the same."
            );
        }

        if (
            !data.tripType ||
            !tripData.isSupportedTripType(
                data.tripType
            )
        ) {
            errors.push(
                "Please select a supported trip type."
            );
        }

        if (
            !data.transport ||
            !tripData.isSupportedTransport(
                data.transport
            )
        ) {
            errors.push(
                "Please select a supported transport option."
            );
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Calculates an estimate from a known distance.
     *
     * Formula:
     *
     * distance
     * × transport rate
     * × trip type multiplier
     *
     * @param {{
     *   distanceKm: number,
     *   transport: string,
     *   tripType: string
     * }}
     *
     * @returns {{
     *   isValid: boolean,
     *   errors: string[],
     *   estimate: object|null
     * }}
     */
    function estimateTripCost(options) {
        const tripData = getTripPriceData();
        const errors = [];

        if (!tripData) {
            return {
                isValid: false,
                errors: [
                    "Trip estimation data is unavailable."
                ],
                estimate: null
            };
        }

        if (!options || typeof options !== "object") {
            return {
                isValid: false,
                errors: [
                    "Trip estimation options are unavailable."
                ],
                estimate: null
            };
        }

        const distanceKm =
            parsePositiveNumber(
                options.distanceKm
            );

        const transport =
            typeof options.transport === "string"
                ? options.transport
                    .trim()
                    .toLowerCase()
                : "";

        const tripType =
            typeof options.tripType === "string"
                ? options.tripType
                    .trim()
                    .toLowerCase()
                : "";

        if (
            distanceKm === null ||
            distanceKm <
                tripData.assumptions.minimumDistanceKm
        ) {
            errors.push(
                "Please provide a valid trip distance."
            );
        }

        const transportProfile =
            tripData.getTransportProfile(
                transport
            );

        if (!transportProfile) {
            errors.push(
                "Unsupported transport option."
            );
        }

        const tripTypeProfile =
            tripData.getTripTypeProfile(
                tripType
            );

        if (!tripTypeProfile) {
            errors.push(
                "Unsupported trip type."
            );
        }

        if (errors.length > 0) {
            return {
                isValid: false,
                errors,
                estimate: null
            };
        }

        const tripMultiplier =
            tripTypeProfile.multiplier;

        const minimumCost =
            distanceKm *
            transportProfile.minimumRate *
            tripMultiplier;

        const mediumCost =
            distanceKm *
            transportProfile.mediumRate *
            tripMultiplier;

        const maximumCost =
            distanceKm *
            transportProfile.maximumRate *
            tripMultiplier;

        return {
            isValid: true,
            errors: [],
            estimate: {
                distanceKm:
                    roundToTwoDecimals(
                        distanceKm
                    ),

                transport: transportProfile.id,

                transportName:
                    transportProfile.name,

                transportIcon:
                    transportProfile.icon,

                tripType: tripTypeProfile.id,

                tripTypeName:
                    tripTypeProfile.name,

                tripMultiplier,

                minimum:
                    roundCurrency(
                        minimumCost
                    ),

                medium:
                    roundCurrency(
                        mediumCost
                    ),

                maximum:
                    roundCurrency(
                        maximumCost
                    ),

                currency: "INR",

                assumptions: {
                    minimumRate:
                        transportProfile.minimumRate,

                    mediumRate:
                        transportProfile.mediumRate,

                    maximumRate:
                        transportProfile.maximumRate,

                    transportNote:
                        transportProfile.note,

                    dataVersion:
                        tripData.version
                }
            }
        };
    }

    /**
     * Calculates an estimate using the local fallback distance.
     *
     * This is useful only when no reliable route distance has
     * been supplied yet.
     *
     * The caller must clearly label this as a generic estimate.
     *
     * @param {{
     *   transport: string,
     *   tripType: string
     * }}
     *
     * @returns {{
     *   isValid: boolean,
     *   errors: string[],
     *   estimate: object|null,
     *   usesFallbackDistance: boolean
     * }}
     */
    function estimateWithFallbackDistance(options) {
        const tripData = getTripPriceData();

        if (!tripData) {
            return {
                isValid: false,
                errors: [
                    "Trip estimation data is unavailable."
                ],
                estimate: null,
                usesFallbackDistance: true
            };
        }

        const result = estimateTripCost({
            distanceKm:
                tripData.assumptions
                    .fallbackDistanceKm,

            transport: options
                ? options.transport
                : "",

            tripType: options
                ? options.tripType
                : ""
        });

        return {
            ...result,
            usesFallbackDistance: true
        };
    }

    /**
     * Formats an INR amount for display.
     *
     * Example:
     * ₹1,250
     *
     * @param {number} amount
     * @returns {string}
     */
    function formatCurrency(amount) {
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount)) {
            return "₹0";
        }

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(numericAmount);
    }

    /**
     * Formats a distance for display.
     *
     * @param {number} distanceKm
     * @returns {string}
     */
    function formatDistance(distanceKm) {
        const numericDistance =
            Number(distanceKm);

        if (
            !Number.isFinite(numericDistance) ||
            numericDistance <= 0
        ) {
            return "0 km";
        }

        return (
            new Intl.NumberFormat(
                "en-IN",
                {
                    maximumFractionDigits: 1
                }
            ).format(numericDistance) +
            " km"
        );
    }

    /**
     * Creates a complete trip estimation object from
     * calculator data and a known route distance.
     *
     * @param {{
     *   origin: string,
     *   destination: string,
     *   tripType: string,
     *   transport: string,
     *   distanceKm: number
     * }}
     *
     * @returns {{
     *   isValid: boolean,
     *   errors: string[],
     *   trip: object|null
     * }}
     */
    function createTripEstimate(data) {
        const validationResult =
            validateTripData(data);

        if (!validationResult.isValid) {
            return {
                isValid: false,
                errors: validationResult.errors,
                trip: null
            };
        }

        const estimationResult =
            estimateTripCost({
                distanceKm: data.distanceKm,
                transport: data.transport,
                tripType: data.tripType
            });

        if (!estimationResult.isValid) {
            return {
                isValid: false,
                errors:
                    estimationResult.errors,
                trip: null
            };
        }

        return {
            isValid: true,
            errors: [],
            trip: {
                origin:
                    normalizeLocation(
                        data.origin
                    ),

                destination:
                    normalizeLocation(
                        data.destination
                    ),

                ...estimationResult.estimate
            }
        };
    }

    /**
     * Expose reusable estimation functionality through one
     * global namespace.
     *
     * Dependency order:
     *
     * trip-data.js
     *        ↓
     * trip-estimator.js
     *        ↓
     * calculator-results.js (future)
     */
    window.TripPriceEstimator = Object.freeze({
        getCalculatorParameters,

        validateTripData,

        estimateTripCost,

        estimateWithFallbackDistance,

        createTripEstimate,

        formatCurrency,

        formatDistance,

        normalizeLocation,

        areSameLocation
    });
})();
