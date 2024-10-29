class Router {
  constructor(routes) {
      this.routes = routes;

      // Wait for DOM to be fully loaded before initializing
      document.addEventListener('DOMContentLoaded', () => {
          this.mainContent = document.getElementById('main-content');
          if (!this.mainContent) {
              console.error('Main content element not found. Make sure there is an element with id="main-content"');
              return;
          }

          // Handle initial load
          this.handleRoute();

          // Handle browser back/forward buttons
          window.addEventListener('popstate', () => this.handleRoute());

          // Handle link clicks
          document.addEventListener('click', (e) => {
              const link = e.target.closest('[data-link]');
              if (link) {
                  e.preventDefault();
                  this.navigateTo(link.href);
              }
          });
      });
  }

  async handleRoute() {
      if (!this.mainContent) {
          console.error('Main content element not found');
          return;
      }

      const path = window.location.pathname;
      const route = this.routes[path] || this.routes['/404'];

      try {
          // Show loading state
          this.mainContent.innerHTML = '<div class="text-center py-5"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';

          const response = await fetch(route);
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const html = await response.text();
          this.mainContent.innerHTML = html;
          document.title = `FuriousWarrior - ${this.getPageTitle(path)}`;

          // Scroll to top after page load
          window.scrollTo(0, 0);
      } catch (error) {
          console.error('Error loading page:', error);
          this.mainContent.innerHTML = `
              <div class="container py-5 text-center">
                  <h1>Error Loading Page</h1>
                  <p class="text-muted">Please try again later or contact support if the problem persists.</p>
                  <button onclick="window.location.reload()" class="btn btn-primary">Reload Page</button>
              </div>
          `;
      }
  }

  navigateTo(url) {
      if (window.location.href === url) return; // Prevent unnecessary navigation to same URL
      window.history.pushState(null, null, url);
      this.handleRoute();
  }

  getPageTitle(path) {
      const titles = {
          '/': 'Home',
          '/about': 'About Us',
          '/products': 'Products',
          '/counseling': 'Counseling',
          '/speaking': 'Speaking',
          '/growth-lab': 'Growth Lab',
          '/blog': 'Blog',
          '/contact': 'Contact Us',
          '/login': 'Login'
      };
      return titles[path] || 'Page Not Found';
  }
}

// Initialize router with routes
const router = new Router({
  '/': '/pages/home.html',
  '/about': '/pages/about.html',
  '/products': '/pages/products.html',
  '/counseling': '/pages/counseling.html',
  '/speaking': '/pages/speaking.html',
  '/growth-lab': '/pages/growth-lab.html',
  '/blog': '/pages/blog.html',
  '/contact': '/pages/contact.html',
  '/login': '/pages/login.html',
  '/404': '/pages/404.html'
});