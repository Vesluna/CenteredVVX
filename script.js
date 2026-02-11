(() => {
  const DASHBOARD_HASH = '#dashboard';
  const ERROR_HASH = '#ERROR - 001';

  const dashboardView = document.getElementById('dashboard-view');
  const errorView = document.getElementById('error-view');

  const knownRoutes = new Set([
    '',
    '#',
    DASHBOARD_HASH,
    '#home',
    '#main'
  ]);

  function showDashboard() {
    dashboardView.classList.remove('hidden');
    errorView.classList.add('hidden');
  }

  function showError001() {
    dashboardView.classList.add('hidden');
    errorView.classList.remove('hidden');

    if (location.hash !== ERROR_HASH) {
      history.replaceState(null, '', `${location.pathname}${location.search}${ERROR_HASH}`);
    }
  }

  function route() {
    const routeHash = decodeURIComponent(location.hash || '').trim();

    if (knownRoutes.has(routeHash)) {
      showDashboard();
      return;
    }

    showError001();
  }

  window.addEventListener('hashchange', route);
  route();
})();
// Intentionally minimal for now.
