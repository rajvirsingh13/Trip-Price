"use strict";

/* =========================================================
   TRIP PRICE - CITY DATA
   File: frontend/js/city-data.js

   Purpose:
   - Provides a curated list of commonly used Indian cities
   - Supports origin/destination suggestions
   - Keeps city data separate from UI logic
   - Enables future search/autocomplete functionality

   IMPORTANT:
   This file does NOT provide route distances, live traffic,
   live ticket prices, or geolocation data.
========================================================= */

(function () {
    /**
     * Curated city list for the first version of Trip Price.
     *
     * The list is intentionally limited and editable.
     * It can be expanded in a future version without changing
     * the calculator's public URL parameter format.
     *
     * Each city contains:
     * - name
     * - state
     * - country
     * - searchText
     */
    const CITIES = Object.freeze([
        Object.freeze({
            name: "Ludhiana",
            state: "Punjab",
            country: "India",
            searchText: "ludhiana punjab india"
        }),

        Object.freeze({
            name: "Amritsar",
            state: "Punjab",
            country: "India",
            searchText: "amritsar punjab india"
        }),

        Object.freeze({
            name: "Jalandhar",
            state: "Punjab",
            country: "India",
            searchText: "jalandhar punjab india"
        }),

        Object.freeze({
            name: "Patiala",
            state: "Punjab",
            country: "India",
            searchText: "patiala punjab india"
        }),

        Object.freeze({
            name: "Bathinda",
            state: "Punjab",
            country: "India",
            searchText: "bathinda punjab india"
        }),

        Object.freeze({
            name: "Mohali",
            state: "Punjab",
            country: "India",
            searchText: "mohali punjab india sas nagar"
        }),

        Object.freeze({
            name: "Chandigarh",
            state: "Chandigarh",
            country: "India",
            searchText: "chandigarh india"
        }),

        Object.freeze({
            name: "Delhi",
            state: "Delhi",
            country: "India",
            searchText: "delhi new delhi ncr india"
        }),

        Object.freeze({
            name: "Gurugram",
            state: "Haryana",
            country: "India",
            searchText: "gurugram gurgaon haryana india"
        }),

        Object.freeze({
            name: "Noida",
            state: "Uttar Pradesh",
            country: "India",
            searchText: "noida uttar pradesh india"
        }),

        Object.freeze({
            name: "Ambala",
            state: "Haryana",
            country: "India",
            searchText: "ambala haryana india"
        }),

        Object.freeze({
            name: "Karnal",
            state: "Haryana",
            country: "India",
            searchText: "karnal haryana india"
        }),

        Object.freeze({
            name: "Panipat",
            state: "Haryana",
            country: "India",
            searchText: "panipat haryana india"
        }),

        Object.freeze({
            name: "Shimla",
            state: "Himachal Pradesh",
            country: "India",
            searchText: "shimla himachal pradesh india"
        }),

        Object.freeze({
            name: "Manali",
            state: "Himachal Pradesh",
            country: "India",
            searchText: "manali himachal pradesh india"
        }),

        Object.freeze({
            name: "Dharamshala",
            state: "Himachal Pradesh",
            country: "India",
            searchText: "dharamshala himachal pradesh india"
        }),

        Object.freeze({
            name: "Jammu",
            state: "Jammu and Kashmir",
            country: "India",
            searchText: "jammu jammu kashmir india"
        }),

        Object.freeze({
            name: "Srinagar",
            state: "Jammu and Kashmir",
            country: "India",
            searchText: "srinagar jammu kashmir india"
        }),

        Object.freeze({
            name: "Jaipur",
            state: "Rajasthan",
            country: "India",
            searchText: "jaipur rajasthan india"
        }),

        Object.freeze({
            name: "Udaipur",
            state: "Rajasthan",
            country: "India",
            searchText: "udaipur rajasthan india"
        }),

        Object.freeze({
            name: "Jodhpur",
            state: "Rajasthan",
            country: "India",
            searchText: "jodhpur rajasthan india"
        }),

        Object.freeze({
            name: "Agra",
            state: "Uttar Pradesh",
            country: "India",
            searchText: "agra uttar pradesh india"
        }),

        Object.freeze({
            name: "Lucknow",
            state: "Uttar Pradesh",
            country: "India",
            searchText: "lucknow uttar pradesh india"
        }),

        Object.freeze({
            name: "Varanasi",
            state: "Uttar Pradesh",
            country: "India",
            searchText: "varanasi uttar pradesh india"
        }),

        Object.freeze({
            name: "Dehradun",
            state: "Uttarakhand",
            country: "India",
            searchText: "dehradun uttarakhand india"
        }),

        Object.freeze({
            name: "Haridwar",
            state: "Uttarakhand",
            country: "India",
            searchText: "haridwar uttarakhand india"
        }),

        Object.freeze({
            name: "Mumbai",
            state: "Maharashtra",
            country: "India",
            searchText: "mumbai bombay maharashtra india"
        }),

        Object.freeze({
            name: "Pune",
            state: "Maharashtra",
            country: "India",
            searchText: "pune maharashtra india"
        }),

        Object.freeze({
            name: "Nagpur",
            state: "Maharashtra",
            country: "India",
            searchText: "nagpur maharashtra india"
        }),

        Object.freeze({
            name: "Nashik",
            state: "Maharashtra",
            country: "India",
            searchText: "nashik maharashtra india"
        }),

        Object.freeze({
            name: "Bengaluru",
            state: "Karnataka",
            country: "India",
            searchText: "bengaluru bangalore karnataka india"
        }),

        Object.freeze({
            name: "Mysuru",
            state: "Karnataka",
            country: "India",
            searchText: "mysuru mysore karnataka india"
        }),

        Object.freeze({
            name: "Chennai",
            state: "Tamil Nadu",
            country: "India",
            searchText: "chennai madras tamil nadu india"
        }),

        Object.freeze({
            name: "Coimbatore",
            state: "Tamil Nadu",
            country: "India",
            searchText: "coimbatore tamil nadu india"
        }),

        Object.freeze({
            name: "Madurai",
            state: "Tamil Nadu",
            country: "India",
            searchText: "madurai tamil nadu india"
        }),

        Object.freeze({
            name: "Hyderabad",
            state: "Telangana",
            country: "India",
            searchText: "hyderabad telangana india"
        }),

        Object.freeze({
            name: "Kolkata",
            state: "West Bengal",
            country: "India",
            searchText: "kolkata calcutta west bengal india"
        }),

        Object.freeze({
            name: "Ahmedabad",
            state: "Gujarat",
            country: "India",
            searchText: "ahmedabad gujarat india"
        }),

        Object.freeze({
            name: "Surat",
            state: "Gujarat",
            country: "India",
            searchText: "surat gujarat india"
        }),

        Object.freeze({
            name: "Goa",
            state: "Goa",
            country: "India",
            searchText: "goa india"
        }),

        Object.freeze({
            name: "Kochi",
            state: "Kerala",
            country: "India",
            searchText: "kochi cochin kerala india"
        }),

        Object.freeze({
            name: "Thiruvananthapuram",
            state: "Kerala",
            country: "India",
            searchText:
                "thiruvananthapuram trivandrum kerala india"
        }),

        Object.freeze({
            name: "Bhopal",
            state: "Madhya Pradesh",
            country: "India",
            searchText: "bhopal madhya pradesh india"
        }),

        Object.freeze({
            name: "Indore",
            state: "Madhya Pradesh",
            country: "India",
            searchText: "indore madhya pradesh india"
        }),

        Object.freeze({
            name: "Bhubaneswar",
            state: "Odisha",
            country: "India",
            searchText: "bhubaneswar odisha india"
        }),

        Object.freeze({
            name: "Patna",
            state: "Bihar",
            country: "India",
            searchText: "patna bihar india"
        }),

        Object.freeze({
            name: "Guwahati",
            state: "Assam",
            country: "India",
            searchText: "guwahati assam india"
        })
    ]);

    /**
     * Normalizes search text.
     *
     * @param {string} value
     * @returns {string}
     */
    function normalizeSearchText(value) {
        if (typeof value !== "string") {
            return "";
        }

        return value
            .trim()
            .toLowerCase()
            .replace(/\s+/g, " ");
    }

    /**
     * Returns a display label for a city.
     *
     * @param {Object} city
     * @returns {string}
     */
    function getCityLabel(city) {
        if (!city || typeof city !== "object") {
            return "";
        }

        if (!city.name || !city.state) {
            return "";
        }

        return (
            city.name +
            ", " +
            city.state
        );
    }

    /**
     * Searches the local city list.
     *
     * Search priority:
     * 1. Exact city-name match
     * 2. City-name starts with query
     * 3. Search text contains query
     *
     * @param {string} query
     * @param {number} [limit]
     * @returns {Object[]}
     */
    function searchCities(query, limit) {
        const normalizedQuery =
            normalizeSearchText(query);

        const maximumResults =
            Number.isInteger(limit) &&
            limit > 0
                ? limit
                : 8;

        if (!normalizedQuery) {
            return CITIES
                .slice(0, maximumResults);
        }

        const exactMatches = [];
        const startsWithMatches = [];
        const containsMatches = [];

        CITIES.forEach(function (city) {
            const cityName =
                normalizeSearchText(city.name);

            const searchText =
                normalizeSearchText(
                    city.searchText
                );

            if (cityName === normalizedQuery) {
                exactMatches.push(city);
                return;
            }

            if (
                cityName.startsWith(
                    normalizedQuery
                )
            ) {
                startsWithMatches.push(city);
                return;
            }

            if (
                searchText.includes(
                    normalizedQuery
                )
            ) {
                containsMatches.push(city);
            }
        });

        return [
            ...exactMatches,
            ...startsWithMatches,
            ...containsMatches
        ].slice(0, maximumResults);
    }

    /**
     * Finds a city by its name.
     *
     * This is case-insensitive.
     *
     * @param {string} cityName
     * @returns {Object|null}
     */
    function findCityByName(cityName) {
        const normalizedName =
            normalizeSearchText(cityName);

        if (!normalizedName) {
            return null;
        }

        return (
            CITIES.find(function (city) {
                return (
                    normalizeSearchText(
                        city.name
                    ) === normalizedName
                );
            }) || null
        );
    }

    /**
     * Checks whether a city exists in the local dataset.
     *
     * @param {string} cityName
     * @returns {boolean}
     */
    function isSupportedCity(cityName) {
        return (
            findCityByName(cityName) !== null
        );
    }

    /**
     * Returns a shallow copy of the city list.
     *
     * @returns {Object[]}
     */
    function getAllCities() {
        return CITIES.slice();
    }

    /**
     * Expose one controlled global namespace.
     *
     * Future city autocomplete functionality will use:
     *
     * window.TripPriceCities
     */
    window.TripPriceCities = Object.freeze({
        getAllCities,

        searchCities,

        findCityByName,

        isSupportedCity,

        getCityLabel,

        normalizeSearchText
    });
})();
