"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "_rsc_lib_supabase-server_js";
exports.ids = ["_rsc_lib_supabase-server_js"];
exports.modules = {

/***/ "(rsc)/./lib/supabase-server.js":
/*!********************************!*\
  !*** ./lib/supabase-server.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/index.mjs\");\n\nconst supabaseUrl = \"https://izsiftvkofvqmqmwvfol.supabase.co\";\nconst supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;\nif (!supabaseUrl || !supabaseServiceRoleKey) {\n    throw new Error('Missing Supabase server environment variables');\n}\nif (supabaseServiceRoleKey === 'your-service-role-key-here') {\n    console.warn('WARNING: SUPABASE_SERVICE_ROLE_KEY is not set correctly. Please update .env.local with the actual service role key from Supabase Dashboard.');\n}\nconst supabaseAdmin = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceRoleKey, {\n    auth: {\n        autoRefreshToken: false,\n        persistSession: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvc3VwYWJhc2Utc2VydmVyLmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQXFEO0FBRXJELE1BQU1DLGNBQWNDLDBDQUFvQztBQUN4RCxNQUFNRyx5QkFBeUJILFFBQVFDLEdBQUcsQ0FBQ0cseUJBQXlCO0FBRXBFLElBQUksQ0FBQ0wsZUFBZSxDQUFDSSx3QkFBd0I7SUFDM0MsTUFBTSxJQUFJRSxNQUFNO0FBQ2xCO0FBRUEsSUFBSUYsMkJBQTJCLDhCQUE4QjtJQUMzREcsUUFBUUMsSUFBSSxDQUNWO0FBRUo7QUFFTyxNQUFNQyxnQkFBZ0JWLG1FQUFZQSxDQUFDQyxhQUFhSSx3QkFBd0I7SUFDN0VNLE1BQU07UUFDSkMsa0JBQWtCO1FBQ2xCQyxnQkFBZ0I7SUFDbEI7QUFDRixHQUFHIiwic291cmNlcyI6WyIvVXNlcnMvYWRtaW4vRGVza3RvcC9vcmVzdC9saWIvc3VwYWJhc2Utc2VydmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNyZWF0ZUNsaWVudCB9IGZyb20gJ0BzdXBhYmFzZS9zdXBhYmFzZS1qcyc7XG5cbmNvbnN0IHN1cGFiYXNlVXJsID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMO1xuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlUm9sZUtleSA9IHByb2Nlc3MuZW52LlNVUEFCQVNFX1NFUlZJQ0VfUk9MRV9LRVk7XG5cbmlmICghc3VwYWJhc2VVcmwgfHwgIXN1cGFiYXNlU2VydmljZVJvbGVLZXkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIFN1cGFiYXNlIHNlcnZlciBlbnZpcm9ubWVudCB2YXJpYWJsZXMnKTtcbn1cblxuaWYgKHN1cGFiYXNlU2VydmljZVJvbGVLZXkgPT09ICd5b3VyLXNlcnZpY2Utcm9sZS1rZXktaGVyZScpIHtcbiAgY29uc29sZS53YXJuKFxuICAgICdXQVJOSU5HOiBTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIGlzIG5vdCBzZXQgY29ycmVjdGx5LiBQbGVhc2UgdXBkYXRlIC5lbnYubG9jYWwgd2l0aCB0aGUgYWN0dWFsIHNlcnZpY2Ugcm9sZSBrZXkgZnJvbSBTdXBhYmFzZSBEYXNoYm9hcmQuJyxcbiAgKTtcbn1cblxuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlU2VydmljZVJvbGVLZXksIHtcbiAgYXV0aDoge1xuICAgIGF1dG9SZWZyZXNoVG9rZW46IGZhbHNlLFxuICAgIHBlcnNpc3RTZXNzaW9uOiBmYWxzZSxcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsInN1cGFiYXNlU2VydmljZVJvbGVLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiRXJyb3IiLCJjb25zb2xlIiwid2FybiIsInN1cGFiYXNlQWRtaW4iLCJhdXRoIiwiYXV0b1JlZnJlc2hUb2tlbiIsInBlcnNpc3RTZXNzaW9uIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/supabase-server.js\n");

/***/ })

};
;