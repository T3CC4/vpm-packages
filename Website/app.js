import { baseLayerLuminance, StandardLuminance } from 'https://unpkg.com/@fluentui/web-components';

const LISTING_URL = "{{ listingInfo.Url }}";

const PACKAGES = {
{{~ for package in packages ~}}
  "{{ package.Name }}": {
    name: "{{ package.Name }}",
    displayName: "{{ if package.DisplayName; package.DisplayName; end; }}",
    description: "{{ if package.Description; package.Description; end; }}",
    version: "{{ package.Version }}",
    author: {
      name: "{{ if package.Author.Name; package.Author.Name; end; }}",
      url: "{{ if package.Author.Url; package.Author.Url; end; }}",
    },
    dependencies: {
      {{~ for dependency in package.Dependencies ~}}
        "{{ dependency.Name }}": "{{ dependency.Version }}",
      {{~ end ~}}
    },
    keywords: [
      {{~ for keyword in package.Keywords ~}}
        "{{ keyword }}",
      {{~ end ~}}
    ],
    license: "{{ package.License }}",
    licensesUrl: "{{ package.LicensesUrl }}",
  },
{{~ end ~}}
};

// Enhanced theme management with smooth transitions
const setTheme = () => {
  const isDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  // Set base luminance for Fluent UI
  if (isDarkTheme()) {
    baseLayerLuminance.setValueFor(document.documentElement, StandardLuminance.DarkMode);
  } else {
    baseLayerLuminance.setValueFor(document.documentElement, StandardLuminance.LightMode);
  }
  
  // Add theme transition class
  document.documentElement.classList.add('theme-transition');
  setTimeout(() => {
    document.documentElement.classList.remove('theme-transition');
  }, 300);
}

// Intersection Observer for scroll animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all animatable elements
  document.querySelectorAll('.glass-card, fluent-data-grid-row').forEach(el => {
    observer.observe(el);
  });
};

// Enhanced search with debouncing and animations
const setupSearch = () => {
  const searchInput = document.getElementById('searchInput');
  const packageGrid = document.getElementById('packageGrid');
  let searchTimeout;

  const performSearch = (value) => {
    const items = packageGrid.querySelectorAll('fluent-data-grid-row[row-type="default"]');
    let visibleCount = 0;

    items.forEach((item, index) => {
      const isMatch = value === '' || 
        item.dataset?.packageName?.toLowerCase()?.includes(value.toLowerCase()) ||
        item.dataset?.packageId?.toLowerCase()?.includes(value.toLowerCase());

      if (isMatch) {
        item.style.display = 'grid';
        item.style.animationDelay = `${index * 0.05}s`;
        item.classList.add('search-result');
        visibleCount++;
      } else {
        item.style.display = 'none';
        item.classList.remove('search-result');
      }
    });

    // Update search result indicator
    updateSearchResults(visibleCount, value);
  };

  const updateSearchResults = (count, query) => {
    let indicator = document.getElementById('searchIndicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.id = 'searchIndicator';
      indicator.className = 'search-indicator';
      searchInput.parentNode.appendChild(indicator);
    }
    
    if (query && count === 0) {
      indicator.textContent = 'No packages found';
      indicator.className = 'search-indicator no-results';
    } else if (query) {
      indicator.textContent = `Found ${count} package${count !== 1 ? 's' : ''}`;
      indicator.className = 'search-indicator has-results';
    } else {
      indicator.textContent = '';
      indicator.className = 'search-indicator';
    }
  };

  searchInput.addEventListener('input', ({ target: { value = '' }}) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => performSearch(value), 150);
  });

  // Enhanced focus effects
  searchInput.addEventListener('focus', () => {
    searchInput.parentElement.classList.add('search-focused');
  });

  searchInput.addEventListener('blur', () => {
    searchInput.parentElement.classList.remove('search-focused');
  });
};

// Enhanced button interactions with ripple effects
const setupButtonEffects = () => {
  document.querySelectorAll('fluent-button').forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      `;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
};

// Copy functionality with enhanced feedback
const setupCopyFunctionality = () => {
  const copyButtons = [
    { button: 'vccUrlFieldCopy', field: 'vccUrlField' },
    { button: 'vccListingInfoUrlFieldCopy', field: 'vccListingInfoUrlField' },
    { button: 'packageInfoVccUrlFieldCopy', field: 'packageInfoVccUrlField' }
  ];

  copyButtons.forEach(({ button: buttonId, field: fieldId }) => {
    const button = document.getElementById(buttonId);
    const field = document.getElementById(fieldId);
    
    if (button && field) {
      button.addEventListener('click', async () => {
        try {
          field.select();
          await navigator.clipboard.writeText(field.value);
          
          // Enhanced visual feedback
          button.appearance = 'accent';
          button.innerHTML = `
            <svg slot="start" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.5 14.5L16 7L14.5 5.5L8.5 11.5L5.5 8.5L4 10L8.5 14.5Z"/>
            </svg>
            Copied!
          `;
          
          button.classList.add('copy-success');
          
          setTimeout(() => {
            button.appearance = 'neutral';
            button.innerHTML = `
              <svg slot="start" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2C6.89543 2 6 2.89543 6 4V14C6 15.1046 6.89543 16 8 16H14C15.1046 16 16 15.1046 16 14V4C16 2.89543 15.1046 2 14 2H8ZM7 4C7 3.44772 7.44772 3 8 3H14C14.5523 3 15 3.44772 15 4V14C15 14.5523 14.5523 15 14 15H8C7.44772 15 7 14.5523 7 14V4ZM4 6.00001C4 5.25973 4.4022 4.61339 5 4.26758V14.5C5 15.8807 6.11929 17 7.5 17H13.7324C13.3866 17.5978 12.7403 18 12 18H7.5C5.567 18 4 16.433 4 14.5V6.00001Z"/>
              </svg>
              Copy
            `;
            button.classList.remove('copy-success');
          }, 1500);
        } catch (err) {
          console.error('Failed to copy: ', err);
          // Fallback for older browsers
          field.select();
          document.execCommand('copy');
        }
      });
    }
  });
};

// Enhanced VCC integration
const setupVCCIntegration = () => {
  const vccButtons = document.querySelectorAll('#vccAddRepoButton, .rowAddToVccButton');
  
  vccButtons.forEach(button => {
    button.addEventListener('click', () => {
      const url = `vcc://vpm/addRepo?url=${encodeURIComponent(LISTING_URL)}`;
      
      // Add loading state
      button.classList.add('loading');
      button.disabled = true;
      
      try {
        window.location.assign(url);
      } catch (error) {
        console.error('Failed to open VCC:', error);
        // Show fallback message
        showNotification('Please ensure VCC is installed and try again.', 'warning');
      }
      
      // Remove loading state after a delay
      setTimeout(() => {
        button.classList.remove('loading');
        button.disabled = false;
      }, 2000);
    });
  });
};

// Notification system
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  setTimeout(() => notification.classList.add('show'), 10);
  
  // Auto remove
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

// Enhanced modal functionality
const setupModals = () => {
  // Help modal
  const urlBarHelpButton = document.getElementById('urlBarHelp');
  const addListingToVccHelp = document.getElementById('addListingToVccHelp');
  const addListingToVccHelpClose = document.getElementById('addListingToVccHelpClose');

  if (urlBarHelpButton && addListingToVccHelp) {
    urlBarHelpButton.addEventListener('click', () => {
      addListingToVccHelp.hidden = false;
      document.body.classList.add('modal-open');
    });
  }

  if (addListingToVccHelpClose && addListingToVccHelp) {
    addListingToVccHelpClose.addEventListener('click', () => {
      addListingToVccHelp.hidden = true;
      document.body.classList.remove('modal-open');
    });
  }

  // Package info modal
  const packageInfoModal = document.getElementById('packageInfoModal');
  const packageInfoModalClose = document.getElementById('packageInfoModalClose');

  if (packageInfoModalClose && packageInfoModal) {
    packageInfoModalClose.addEventListener('click', () => {
      packageInfoModal.hidden = true;
      document.body.classList.remove('modal-open');
    });
  }

  // Enhanced modal styling
  if (packageInfoModal) {
    const modalControl = packageInfoModal.shadowRoot?.querySelector('.control');
    if (modalControl) {
      modalControl.style.maxHeight = "90%";
      modalControl.style.transition = 'height 0.3s ease-in-out';
      modalControl.style.overflowY = 'hidden';
      modalControl.style.borderRadius = '16px';
    }
  }
};

// Enhanced package info display
const setupPackageInfo = () => {
  const packageInfoElements = {
    name: document.getElementById('packageInfoName'),
    id: document.getElementById('packageInfoId'),
    version: document.getElementById('packageInfoVersion'),
    description: document.getElementById('packageInfoDescription'),
    author: document.getElementById('packageInfoAuthor'),
    dependencies: document.getElementById('packageInfoDependencies'),
    keywords: document.getElementById('packageInfoKeywords'),
    license: document.getElementById('packageInfoLicense')
  };

  const rowPackageInfoButtons = document.querySelectorAll('.rowPackageInfoButton');
  
  rowPackageInfoButtons.forEach((button) => {
    button.addEventListener('click', e => {
      const packageId = e.target.dataset?.packageId;
      const packageInfo = PACKAGES?.[packageId];
      
      if (!packageInfo) {
        console.error(`Package ${packageId} not found. Available packages:`, PACKAGES);
        showNotification('Package information not available', 'error');
        return;
      }

      // Populate modal with enhanced animations
      if (packageInfoElements.name) {
        packageInfoElements.name.textContent = packageInfo.displayName;
        packageInfoElements.name.style.animation = 'fadeInUp 0.3s ease-out';
      }
      
      if (packageInfoElements.id) {
        packageInfoElements.id.textContent = packageId;
      }
      
      if (packageInfoElements.version) {
        packageInfoElements.version.textContent = `v${packageInfo.version}`;
        packageInfoElements.version.style.animation = 'fadeInUp 0.3s ease-out 0.1s both';
      }
      
      if (packageInfoElements.description) {
        packageInfoElements.description.textContent = packageInfo.description;
        packageInfoElements.description.style.animation = 'fadeInUp 0.3s ease-out 0.2s both';
      }
      
      if (packageInfoElements.author) {
        packageInfoElements.author.textContent = packageInfo.author.name;
        packageInfoElements.author.href = packageInfo.author.url;
      }

      // Enhanced keywords display
      if (packageInfoElements.keywords) {
        const keywordsContainer = packageInfoElements.keywords.parentElement;
        if ((packageInfo.keywords?.length ?? 0) === 0) {
          keywordsContainer.classList.add('hidden');
        } else {
          keywordsContainer.classList.remove('hidden');
          packageInfoElements.keywords.innerHTML = '';
          
          packageInfo.keywords.forEach((keyword, index) => {
            const keywordDiv = document.createElement('div');
            keywordDiv.classList.add('me-2', 'mb-2', 'badge');
            keywordDiv.textContent = keyword;
            keywordDiv.style.animation = `fadeInUp 0.3s ease-out ${0.3 + index * 0.1}s both`;
            packageInfoElements.keywords.appendChild(keywordDiv);
          });
        }
      }

      // License information
      if (packageInfoElements.license) {
        const licenseContainer = packageInfoElements.license.parentElement;
        if (!packageInfo.license?.length && !packageInfo.licensesUrl?.length) {
          licenseContainer.classList.add('hidden');
        } else {
          licenseContainer.classList.remove('hidden');
          packageInfoElements.license.textContent = packageInfo.license ?? 'See License';
          packageInfoElements.license.href = packageInfo.licensesUrl ?? '#';
        }
      }

      // Enhanced dependencies display
      if (packageInfoElements.dependencies) {
        packageInfoElements.dependencies.innerHTML = '';
        Object.entries(packageInfo.dependencies).forEach(([name, version], index) => {
          const depRow = document.createElement('li');
          depRow.classList.add('mb-2');
          depRow.textContent = `${name} @ v${version}`;
          depRow.style.animation = `fadeInUp 0.3s ease-out ${0.4 + index * 0.1}s both`;
          packageInfoElements.dependencies.appendChild(depRow);
        });
      }

      // Show modal with animation
      const packageInfoModal = document.getElementById('packageInfoModal');
      if (packageInfoModal) {
        packageInfoModal.hidden = false;
        document.body.classList.add('modal-open');
        
        setTimeout(() => {
          const modalContent = packageInfoModal.querySelector('.col');
          if (modalContent) {
            const height = modalContent.clientHeight;
            const modalControl = packageInfoModal.shadowRoot?.querySelector('.control');
            if (modalControl) {
              modalControl.style.setProperty('--dialog-height', `${height + 14}px`);
            }
          }
        }, 10);
      }
    });
  });
};

// Advanced scroll effects
const setupScrollEffects = () => {
  let ticking = false;
  
  const updateScrollEffects = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.2;
    
    // Parallax background effect
    const backgroundElement = document.body;
    backgroundElement.style.transform = `translateY(${rate}px)`;
    
    // Header scale effect
    const header = document.getElementById('listingInfo');
    if (header) {
      const scale = Math.max(0.9, 1 - scrolled * 0.0002);
      header.style.transform = `scale(${scale})`;
    }
    
    ticking = false;
  };

  const requestScrollUpdate = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  };

  // Only add scroll effects if user hasn't requested reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
  }
};

// Enhanced menu functionality
const setupMenus = () => {
  const rowMoreMenu = document.getElementById('rowMoreMenu');
  
  if (!rowMoreMenu) return;

  const hideRowMoreMenu = (e) => {
    if (rowMoreMenu.contains(e.target)) return;
    document.removeEventListener('click', hideRowMoreMenu);
    rowMoreMenu.hidden = true;
    rowMoreMenu.classList.remove('menu-show');
  };

  const rowMenuButtons = document.querySelectorAll('.rowMenuButton');
  rowMenuButtons.forEach(button => {
    button.addEventListener('click', e => {
      e.stopPropagation();
      
      if (rowMoreMenu.hidden) {
        // Position menu
        const rect = button.getBoundingClientRect();
        rowMoreMenu.style.top = `${rect.bottom + 5}px`;
        rowMoreMenu.style.left = `${rect.left - 120}px`;
        
        // Show with animation
        rowMoreMenu.hidden = false;
        setTimeout(() => rowMoreMenu.classList.add('menu-show'), 10);

        // Setup download functionality
        const downloadLink = rowMoreMenu.querySelector('#rowMoreMenuDownload');
        if (downloadLink) {
          const downloadListener = () => {
            const url = button.dataset?.packageUrl;
            if (url) {
              window.open(url, '_blank');
              showNotification('Download started', 'success');
            }
          };
          
          downloadLink.removeEventListener('change', downloadListener);
          downloadLink.addEventListener('change', downloadListener);
        }

        setTimeout(() => {
          document.addEventListener('click', hideRowMoreMenu);
        }, 10);
      }
    });
  });
};

// Performance monitoring
const setupPerformanceMonitoring = () => {
  if ('performance' in window && 'PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'measure') {
          console.debug(`Performance: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['measure'] });
  }
};

// Main initialization
(() => {
  performance.mark('app-start');
  
  // Set initial theme
  setTheme();

  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setTheme);

  // Initialize all features
  setupSearch();
  setupButtonEffects();
  setupCopyFunctionality();
  setupVCCIntegration();
  setupModals();
  setupPackageInfo();
  setupScrollEffects();
  setupMenus();
  setupPerformanceMonitoring();

  // Setup intersection observer for animations
  observeElements();

  // Additional help modal functionality
  const packageInfoListingHelp = document.getElementById('packageInfoListingHelp');
  const addListingToVccHelp = document.getElementById('addListingToVccHelp');
  
  if (packageInfoListingHelp && addListingToVccHelp) {
    packageInfoListingHelp.addEventListener('click', () => {
      addListingToVccHelp.hidden = false;
      document.body.classList.add('modal-open');
    });
  }

  performance.mark('app-end');
  performance.measure('app-init', 'app-start', 'app-end');
  
  // Add loaded class for CSS transitions
  document.documentElement.classList.add('loaded');
  
  console.log('🚀 VPM Package Listing initialized with modern enhancements');
})();
