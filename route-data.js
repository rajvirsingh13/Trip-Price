"use strict";

/* =========================================================
   TRIP PRICE - ROUTE DATA
   File: frontend/js/route-data.js

   Purpose:
   - Provides estimated road distances for selected routes
   - Supplies route data to route-distance.js
   - Uses a local, curated dataset
   - Does NOT claim live navigation or live traffic data

   IMPORTANT:
   - Distances are approximate planning estimates.
   - Actual road distance can vary depending on the route taken.
   - This file does not use an external API.
   - This file does not provide live traffic information.

   Public namespace:
   window.TripPriceRouteData
========================================================= */

(function () {
    /**
     * Normalizes a city name for reliable route matching.
     *
     * @param {string} value
     * @returns {string}
     */
    function normalizeCityName(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    /**
     * Creates a consistent route key.
     *
     * Route keys are direction-independent.
     *
     * Example:
     * Ludhiana + Amritsar
     *
     * produces the same key as:
     * Amritsar + Ludhiana
     *
     * @param {string} origin
     * @param {string} destination
     * @returns {string}
     */
    function createRouteKey(origin, destination) {
        const cities = [
            normalizeCityName(origin),
            normalizeCityName(destination)
        ]
            .filter(Boolean)
            .sort();

        if (cities.length !== 2) {
            return "";
        }

        return cities.join("|");
    }

    /**
     * Curated approximate road-distance dataset.
     *
     * distanceKm:
     * Approximate road distance in kilometres.
     *
     * source:
     * Indicates that the value is locally curated and should
     * be treated as an estimate, not live route data.
     */
    const ROUTES = Object.freeze({
        [createRouteKey(
            "Ludhiana",
            "Amritsar"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Amritsar",
            distanceKm: 135,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Jalandhar"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Jalandhar",
            distanceKm: 62,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Chandigarh"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Chandigarh",
            distanceKm: 100,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Patiala"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Patiala",
            distanceKm: 92,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Delhi"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Delhi",
            distanceKm: 310,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Ambala"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Ambala",
            distanceKm: 150,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Shimla"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Shimla",
            distanceKm: 215,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ludhiana",
            "Manali"
        )]: Object.freeze({
            origin: "Ludhiana",
            destination: "Manali",
            distanceKm: 310,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Amritsar",
            "Jalandhar"
        )]: Object.freeze({
            origin: "Amritsar",
            destination: "Jalandhar",
            distanceKm: 82,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Amritsar",
            "Chandigarh"
        )]: Object.freeze({
            origin: "Amritsar",
            destination: "Chandigarh",
            distanceKm: 230,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Amritsar",
            "Delhi"
        )]: Object.freeze({
            origin: "Amritsar",
            destination: "Delhi",
            distanceKm: 450,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Chandigarh",
            "Delhi"
        )]: Object.freeze({
            origin: "Chandigarh",
            destination: "Delhi",
            distanceKm: 250,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Chandigarh",
            "Shimla"
        )]: Object.freeze({
            origin: "Chandigarh",
            destination: "Shimla",
            distanceKm: 115,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Chandigarh",
            "Manali"
        )]: Object.freeze({
            origin: "Chandigarh",
            destination: "Manali",
            distanceKm: 310,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Agra"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Agra",
            distanceKm: 235,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Jaipur"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Jaipur",
            distanceKm: 280,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Dehradun"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Dehradun",
            distanceKm: 250,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Haridwar"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Haridwar",
            distanceKm: 225,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Mumbai"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Mumbai",
            distanceKm: 1420,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Bengaluru"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Bengaluru",
            distanceKm: 2150,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Delhi",
            "Goa"
        )]: Object.freeze({
            origin: "Delhi",
            destination: "Goa",
            distanceKm: 1880,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Mumbai",
            "Pune"
        )]: Object.freeze({
            origin: "Mumbai",
            destination: "Pune",
            distanceKm: 150,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Mumbai",
            "Goa"
        )]: Object.freeze({
            origin: "Mumbai",
            destination: "Goa",
            distanceKm: 590,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Bengaluru",
            "Mysuru"
        )]: Object.freeze({
            origin: "Bengaluru",
            destination: "Mysuru",
            distanceKm: 145,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Chennai",
            "Bengaluru"
        )]: Object.freeze({
            origin: "Chennai",
            destination: "Bengaluru",
            distanceKm: 345,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Jaipur",
            "Udaipur"
        )]: Object.freeze({
            origin: "Jaipur",
            destination: "Udaipur",
            distanceKm: 395,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Jaipur",
            "Jodhpur"
        )]: Object.freeze({
            origin: "Jaipur",
            destination: "Jodhpur",
            distanceKm: 350,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Hyderabad",
            "Bengaluru"
        )]: Object.freeze({
            origin: "Hyderabad",
            destination: "Bengaluru",
            distanceKm: 570,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Kolkata",
            "Bhubaneswar"
        )]: Object.freeze({
            origin: "Kolkata",
            destination: "Bhubaneswar",
            distanceKm: 440,
            source: "curated-estimate"
        }),

        [createRouteKey(
            "Ahmedabad",
            "Mumbai"
        )]: Object.freeze({
            origin: "Ahmedabad",
            destination: "Mumbai",
            distanceKm: 530,
            source: "curated-estimate"
        })
    });

    /**
     * Returns route data for two cities.
     *
     * @param {string} origin
     * @param {string} destination
     * @returns {Object|null}
     */
    function getRoute(origin, destination) {
        const routeKey =
            createRouteKey(
                origin,
                destination
            );

        if (!routeKey) {
            return null;
        }

        return ROUTES[routeKey] || null;
    }

    /**
     * Returns an approximate route distance.
     *
     * @param {string} origin
     * @param {string} destination
     * @returns {number|null}
     */
    function getDistance(origin, destination) {
        const route =
            getRoute(
                origin,
                destination
            );

        if (
            !route ||
            typeof route.distanceKm !== "number"
        ) {
            return null;
        }

        return route.distanceKm;
    }

    /**
     * Checks whether route data exists locally.
     *
     * @param {string} origin
     * @param {string} destination
     * @returns {boolean}
     */
    function hasRoute(origin, destination) {
        return (
            getRoute(
                origin,
                destination
            ) !== null
        );
    }

    /**
     * Returns all routes as an array.
     *
     * A shallow copy is returned to avoid exposing
     * the internal object structure directly.
     *
     * @returns {Object[]}
     */
    function getAllRoutes() {
        return Object.values(ROUTES).slice();
    }

    /**
     * Expose a controlled public API.
     *
     * Future dependency:
     *
     * route-data.js
     *        ↓
     * route-distance.js
     *        ↓
     * calculator-breakdown.js
     */
    window.TripPriceRouteData = Object.freeze({
        normalizeCityName,
        createRouteKey,
        getRoute,
        getDistance,
        hasRoute,
        getAllRoutes
    });
})();
