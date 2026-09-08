"use strict";

/* =========================================================
   TRIP PRICE - TRIP DATA
   File: frontend/js/trip-data.js

   Purpose:
   - Provides transparent baseline travel assumptions
   - Stores transport-specific estimation ranges
   - Avoids claiming live or real-time prices
   - Supplies reusable data for calculator.html

   IMPORTANT:
   These are estimation assumptions for the first version
   of Trip Price. They are NOT live ticket prices, official
   fares, or guaranteed costs.

   No API keys or external services are used.
========================================================= */

(function () {
    /**
     * Version information for the local estimation model.
     *
     * Future versions can update this without changing the
     * calculator's public query parameter format.
     */
    const TRIP_PRICE_DATA_VERSION = "1.0.0";

    /**
     * Default estimation assumptions.
     */
    const DEFAULT_ASSUMPTIONS = Object.freeze({
        minimumDistanceKm: 1,

        /*
         * Used only when the user has not yet entered a
         * reliable distance through a future route source.
         */
        fallbackDistanceKm: 100,

        /*
         * Local buffer for small expenses and price variation.
         */
        variationPercent: 15
    });

    /**
     * Transport estimation profiles.
     *
     * Each profile contains an approximate per-kilometre range.
     * The calculator will use these values as transparent
     * estimation assumptions.
     *
     * "minimumRate" = lower-cost estimate
     * "mediumRate"  = typical planning estimate
     * "maximumRate" = higher-cost estimate
     *
     * Values are in Indian Rupees per kilometre.
     */
    const TRANSPORT_PROFILES = Object.freeze({
        train: Object.freeze({
            id: "train",
            name: "Train",
            icon: "🚆",

            minimumRate: 0.8,
            mediumRate: 1.8,
            maximumRate: 4.5,

            description:
                "Usually one of the more affordable options for longer journeys.",

            note:
                "Actual fares depend on train, class, route, availability and booking conditions."
        }),

        bus: Object.freeze({
            id: "bus",
            name: "Bus",
            icon: "🚌",

            minimumRate: 1.2,
            mediumRate: 2.5,
            maximumRate: 5,

            description:
                "A practical option for many intercity routes.",

            note:
                "Actual fares vary by operator, service type, route and booking time."
        }),

        car: Object.freeze({
            id: "car",
            name: "Car",
            icon: "🚗",

            minimumRate: 6,
            mediumRate: 9,
            maximumRate: 14,

            description:
                "Useful for estimating fuel and common road-trip costs.",

            note:
                "Actual costs depend on fuel efficiency, fuel prices, tolls, parking and vehicle type."
        })
    });

    /**
     * Trip-type multipliers.
     *
     * The first version supports the values expected from:
     * frontend/js/calculator.js
     *
     * The calculator will apply these values when estimating
     * one-way or round-trip travel.
     */
    const TRIP_TYPE_PROFILES = Object.freeze({
        "one-way": Object.freeze({
            id: "one-way",
            name: "One way",
            multiplier: 1
        }),

        round: Object.freeze({
            id: "round",
            name: "Round trip",
            multiplier: 2
        })
    });

    /**
     * Cost categories displayed by the future results page.
     */
    const COST_CATEGORIES = Object.freeze([
        Object.freeze({
            id: "transport",
            name: "Transport",
            description:
                "Estimated main travel cost based on the selected transport option."
        }),

        Object.freeze({
            id: "local",
            name: "Local travel",
            description:
                "Possible local transport such as auto, taxi, bus or metro."
        }),

        Object.freeze({
            id: "food",
            name: "Food",
            description:
                "Optional meal and refreshment planning allowance."
        }),

        Object.freeze({
            id: "stay",
            name: "Stay",
            description:
                "Accommodation planning allowance when an overnight stay is required."
        })
    ]);

    /**
     * Safely gets a transport profile.
     *
     * @param {string} transportId
     * @returns {object|null}
     */
    function getTransportProfile(transportId) {
        if (
            typeof transportId !== "string" ||
            !transportId
        ) {
            return null;
        }

        const normalizedId =
            transportId.trim().toLowerCase();

        return (
            TRANSPORT_PROFILES[normalizedId] ||
            null
        );
    }

    /**
     * Safely gets a trip-type profile.
     *
     * @param {string} tripTypeId
     * @returns {object|null}
     */
    function getTripTypeProfile(tripTypeId) {
        if (
            typeof tripTypeId !== "string" ||
            !tripTypeId
        ) {
            return null;
        }

        const normalizedId =
            tripTypeId.trim().toLowerCase();

        return (
            TRIP_TYPE_PROFILES[normalizedId] ||
            null
        );
    }

    /**
     * Returns all supported transport profiles.
     *
     * A new array is returned so consuming code cannot modify
     * the original object structure accidentally.
     *
     * @returns {object[]}
     */
    function getAllTransportProfiles() {
        return Object.values(
            TRANSPORT_PROFILES
        );
    }

    /**
     * Returns all supported trip types.
     *
     * @returns {object[]}
     */
    function getAllTripTypeProfiles() {
        return Object.values(
            TRIP_TYPE_PROFILES
        );
    }

    /**
     * Checks whether a transport option is supported.
     *
     * @param {string} transportId
     * @returns {boolean}
     */
    function isSupportedTransport(transportId) {
        return getTransportProfile(transportId) !== null;
    }

    /**
     * Checks whether a trip type is supported.
     *
     * @param {string} tripTypeId
     * @returns {boolean}
     */
    function isSupportedTripType(tripTypeId) {
        return getTripTypeProfile(tripTypeId) !== null;
    }

    /**
     * Expose the data through one read-only global namespace.
     *
     * This avoids adding many unrelated global variables and
     * keeps future non-module scripts compatible.
     */
    window.TripPriceData = Object.freeze({
        version: TRIP_PRICE_DATA_VERSION,

        assumptions: DEFAULT_ASSUMPTIONS,

        transportProfiles: TRANSPORT_PROFILES,

        tripTypeProfiles: TRIP_TYPE_PROFILES,

        costCategories: COST_CATEGORIES,

        getTransportProfile,

        getTripTypeProfile,

        getAllTransportProfiles,

        getAllTripTypeProfiles,

        isSupportedTransport,

        isSupportedTripType
    });
})();
