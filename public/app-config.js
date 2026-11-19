// Runtime API base URL.
// - Local dev (localhost): leave empty so frontend uses http://localhost:5000 (backend dev).
// - Deployed frontend: point to the PUBLIC backend API base URL that serves /api/*.
(function () {
  var isLocal = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(location.hostname);
  window.__API_BASE_URL__ = isLocal
    ? ""
    : "https://web-dulich20travel-backend.havanhungcongviec2124.workers.dev";
})();
