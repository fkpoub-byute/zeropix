/**
 * PixelKit - Responsive JavaScript
 * مدیریت رسپانسیو و تعاملات موبایل
 * @version 1.0.0
 * @author Ali Ashrafi
 */

class ResponsiveManager {
    constructor() {
        this.isMobile = false;
        this.isTablet = false;
        this.isDesktop = false;
        this.sidebarOpen = false;
        this.currentBreakpoint = 'mobile';
        
        this.init();
    }

    init() {
        this.setupBreakpoints();
        this.setupMobileMenu();
        this.setupTouchInteractions();
        this.setupOrientationChange();
        this.setupViewportHeight();
        
        console.log('🚀 ResponsiveManager initialized');
    }

    /**
     * مدیریت breakpoint ها
     */
    setupBreakpoints() {
        this.checkBreakpoint();
        
        // رصد تغییرات سایز صفحه
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.checkBreakpoint();
                this.handleResize();
            }, 250);
        });

        // رصد تغییرات در CSS media queries
        this.setupMediaQueries();
    }

    checkBreakpoint() {
        const width = window.innerWidth;
        
        // بروزرسانی وضعیت
        this.isMobile = width < 768;
        this.isTablet = width >= 768 && width < 1024;
        this.isDesktop = width >= 1024;
        
        // تعیین breakpoint فعلی
        if (this.isMobile) {
            this.currentBreakpoint = 'mobile';
        } else if (this.isTablet) {
            this.currentBreakpoint = 'tablet';
        } else {
            this.currentBreakpoint = 'desktop';
        }
        
        // اعمال کلاس‌های مربوطه به body
        document.body.classList.remove('breakpoint-mobile', 'breakpoint-tablet', 'breakpoint-desktop');
        document.body.classList.add(`breakpoint-${this.currentBreakpoint}`);
        
        // اطلاع‌رسانی به سایر بخش‌ها
        this.dispatchBreakpointChange();
    }

    setupMediaQueries() {
        // Media Query برای موبایل
        const mobileMQ = window.matchMedia('(max-width: 767px)');
        mobileMQ.addListener((e) => {
            if (e.matches) {
                this.onMobileEnter();
            }
        });

        // Media Query برای تبلت
        const tabletMQ = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
        tabletMQ.addListener((e) => {
            if (e.matches) {
                this.onTabletEnter();
            }
        });

        // Media Query برای دسکتاپ
        const desktopMQ = window.matchMedia('(min-width: 1024px)');
        desktopMQ.addListener((e) => {
            if (e.matches) {
                this.onDesktopEnter();
            }
        });
    }

    /**
     * منوی موبایل
     */
    setupMobileMenu() {
        // ایجاد دکمه منوی موبایل
        this.createMobileMenuToggle();
        
        // مدیریت کلیک‌ها
        this.setupMenuClickHandlers();
        
        // مدیریت اسکرول
        this.setupMenuScrollHandler();
        
        // مدیریت swipe برای بستن منو
        this.setupSwipeHandler();
    }

    createMobileMenuToggle() {
        // بررسی وجود دکمه منو
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = `
            <span class="menu-icon">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </span>
            <span class="sr-only">منو</span>
        `;
        mobileToggle.setAttribute('aria-label', 'بازکردن منو');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-controls', 'sidebar');
        
        // اضافه کردن به هدر
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.prepend(mobileToggle);
        }
        
        this.mobileToggle = mobileToggle;
    }

    setupMenuClickHandlers() {
        // کلیک روی دکمه منو
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-toggle')) {
                this.toggleMobileMenu();
                e.preventDefault();
                e.stopPropagation();
            }
            
            // کلیک روی لینک‌های منو در حالت موبایل
            if (this.isMobile && this.sidebarOpen) {
                const tabBtn = e.target.closest('.tab-btn');
                if (tabBtn) {
                    setTimeout(() => {
                        this.closeMobileMenu();
                    }, 300);
                }
            }
            
            // بستن منو با کلیک بیرون
            if (this.sidebarOpen && !e.target.closest('#sidebar') && !e.target.closest('.mobile-menu-toggle')) {
                this.closeMobileMenu();
            }
        });
        
        // مدیریت کلید ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebarOpen) {
                this.closeMobileMenu();
            }
        });
    }

    setupMenuScrollHandler() {
        let lastScrollTop = 0;
        const scrollThreshold = 100;
        
        window.addEventListener('scroll', () => {
            if (!this.isMobile) return;
            
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = Math.abs(scrollTop - lastScrollTop);
            
            if (scrollDelta > scrollThreshold && this.sidebarOpen) {
                this.closeMobileMenu();
            }
            
            lastScrollTop = scrollTop;
        });
    }

    setupSwipeHandler() {
        let touchStartX = 0;
        let touchStartY = 0;
        
        document.addEventListener('touchstart', (e) => {
            if (!this.sidebarOpen) return;
            
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!this.sidebarOpen) return;
            
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            // فقط اگر حرکت افقی بیشتر از عمودی بود
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 50) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.sidebarOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const toggle = this.mobileToggle;
        
        if (!sidebar || !toggle) return;
        
        sidebar.classList.add('mobile-open');
        document.body.classList.add('menu-open');
        toggle.setAttribute('aria-expanded', 'true');
        toggle.setAttribute('aria-label', 'بستن منو');
        
        this.sidebarOpen = true;
        
        // جلوگیری از اسکرول بدنه
        this.disableBodyScroll();
        
        // اطلاع‌رسانی
        this.dispatchEvent('mobileMenuOpen');
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const toggle = this.mobileToggle;
        
        if (!sidebar || !toggle) return;
        
        sidebar.classList.remove('mobile-open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'بازکردن منو');
        
        this.sidebarOpen = false;
        
        // فعال کردن اسکرول بدنه
        this.enableBodyScroll();
        
        // اطلاع‌رسانی
        this.dispatchEvent('mobileMenuClose');
    }

    /**
     * مدیریت تعاملات لمسی
     */
    setupTouchInteractions() {
        // بهبود اسلایدرها برای لمسی
        this.setupTouchSliders();
        
        // بهبود دکمه‌ها برای لمسی
        this.setupTouchButtons();
        
        // جلوگیری از زوم دوباره کلیک
        this.preventDoubleTapZoom();
    }

    setupTouchSliders() {
        document.querySelectorAll('.modern-slider').forEach(slider => {
            // افزایش حساسیت لمسی
            slider.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');
                this.style.setProperty('--thumb-scale', '1.3');
            });
            
            slider.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
                this.style.setProperty('--thumb-scale', '1');
            });
            
            // بهبود کشیدن برای موبایل
            slider.addEventListener('touchmove', function(e) {
                if (!this.classList.contains('touch-active')) return;
                
                const rect = this.getBoundingClientRect();
                const touch = e.touches[0];
                const percentage = (touch.clientX - rect.left) / rect.width;
                const value = percentage * (this.max - this.min) + this.min;
                
                this.value = Math.max(this.min, Math.min(this.max, value));
                
                // trigger input event
                this.dispatchEvent(new Event('input', { bubbles: true }));
            });
        });
        
        // اسلایدر مقایسه برای موبایل
        this.setupTouchCompareSlider();
    }

    setupTouchCompareSlider() {
        document.addEventListener('click', (e) => {
            const compareSlider = e.target.closest('.compare-slider');
            if (compareSlider && this.isMobile) {
                // برای موبایل، موقعیت کلیک رو مستقیماً تنظیم کن
                const rect = compareSlider.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const percentage = (clickX / rect.width) * 100;
                
                compareSlider.value = percentage;
                compareSlider.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }

    setupTouchButtons() {
        // اضافه کردن حالت فعال برای دکمه‌ها در موبایل
        document.addEventListener('touchstart', function(e) {
            if (e.target.closest('.btn-primary, .btn-secondary, .tab-btn, .preset-btn')) {
                e.target.closest('.btn-primary, .btn-secondary, .tab-btn, .preset-btn').classList.add('touch-active');
            }
        }, { passive: true });
        
        document.addEventListener('touchend', function(e) {
            document.querySelectorAll('.touch-active').forEach(el => {
                el.classList.remove('touch-active');
            });
        }, { passive: true });
    }

    preventDoubleTapZoom() {
        let lastTap = 0;
        document.addEventListener('touchend', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            
            lastTap = currentTime;
        }, { passive: false });
    }

    /**
     * مدیریت تغییر orientation
     */
    setupOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // تاخیر برای اطمینان از محاسبه صحیح dimensions
            setTimeout(() => {
                this.checkBreakpoint();
                this.handleOrientationChange();
            }, 300);
        });
    }

    handleOrientationChange() {
        const isPortrait = window.innerHeight > window.innerWidth;
        
        document.body.classList.toggle('orientation-portrait', isPortrait);
        document.body.classList.toggle('orientation-landscape', !isPortrait);
        
        // بستن منو در صورت تغییر orientation
        if (this.sidebarOpen) {
            this.closeMobileMenu();
        }
        
        this.dispatchEvent('orientationChange', { isPortrait });
    }

    /**
     * مدیریت ارتفاع viewport برای موبایل
     */
    setupViewportHeight() {
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }

    /**
     * مدیریت resize
     */
    handleResize() {
        // بستن منوی موبایل در صورت تغییر به دسکتاپ
        if (!this.isMobile && this.sidebarOpen) {
            this.closeMobileMenu();
        }
        
        this.dispatchEvent('resize', { 
            width: window.innerWidth, 
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint 
        });
    }

    /**
     * Event Handlers برای breakpoint های مختلف
     */
    onMobileEnter() {
        console.log('📱 Entering mobile view');
        this.dispatchEvent('breakpointChange', { from: this.currentBreakpoint, to: 'mobile' });
        
        // مخفی کردن زبان‌سویچر در موبایل
        const langSwitcher = document.querySelector('.lang-switcher-wrapper');
        if (langSwitcher) {
            langSwitcher.style.display = 'none';
        }
    }

    onTabletEnter() {
        console.log('📟 Entering tablet view');
        this.dispatchEvent('breakpointChange', { from: this.currentBreakpoint, to: 'tablet' });
        
        // نمایش زبان‌سویچر در تبلت
        const langSwitcher = document.querySelector('.lang-switcher-wrapper');
        if (langSwitcher) {
            langSwitcher.style.display = 'block';
        }
    }

    onDesktopEnter() {
        console.log('💻 Entering desktop view');
        this.dispatchEvent('breakpointChange', { from: this.currentBreakpoint, to: 'desktop' });
    }

    /**
     * Utility Functions
     */
    disableBodyScroll() {
        document.body.style.overflow = 'hidden';
        document.body.style.touchAction = 'none';
    }

    enableBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.touchAction = '';
    }

    dispatchBreakpointChange() {
        this.dispatchEvent('breakpointChange', {
            breakpoint: this.currentBreakpoint,
            isMobile: this.isMobile,
            isTablet: this.isTablet,
            isDesktop: this.isDesktop
        });
    }

    dispatchEvent(eventName, detail = {}) {
        const event = new CustomEvent(`responsive:${eventName}`, {
            detail: {
                ...detail,
                timestamp: Date.now(),
                breakpoint: this.currentBreakpoint
            }
        });
        
        document.dispatchEvent(event);
    }

    /**
     * Public Methods
     */
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }
    
    isMobileView() {
        return this.isMobile;
    }
    
    isTabletView() {
        return this.isTablet;
    }
    
    isDesktopView() {
        return this.isDesktop;
    }
    
    getViewportSize() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            ratio: window.innerWidth / window.innerHeight
        };
    }
}

/**
 * Initialization
 */
document.addEventListener('DOMContentLoaded', () => {
    // ایجاد instance از ResponsiveManager
    window.responsiveManager = new ResponsiveManager();
    
    // Event Listeners برای سایر بخش‌های برنامه
    document.addEventListener('responsive:breakpointChange', (e) => {
        const { breakpoint, isMobile, isTablet, isDesktop } = e.detail;
        console.log(`🔄 Breakpoint changed to: ${breakpoint}`);
        
        // به روزرسانی dynamic content بر اساس breakpoint
        updateContentForBreakpoint(breakpoint);
    });
    
    document.addEventListener('responsive:mobileMenuOpen', () => {
        console.log('📱 Mobile menu opened');
        // اضافه کردن backdrop برای موبایل
        addMobileBackdrop();
    });
    
    document.addEventListener('responsive:mobileMenuClose', () => {
        console.log('📱 Mobile menu closed');
        // حذف backdrop
        removeMobileBackdrop();
    });
});

/**
 * Helper Functions
 */
function updateContentForBreakpoint(breakpoint) {
    // به روزرسانی dynamic content بر اساس breakpoint
    // این تابع می‌تواند توسط سایر بخش‌های برنامه گسترش یابد
    
    const elementsToUpdate = document.querySelectorAll('[data-responsive]');
    elementsToUpdate.forEach(element => {
        const config = element.getAttribute('data-responsive');
        
        try {
            const rules = JSON.parse(config);
            const rule = rules[breakpoint];
            
            if (rule) {
                Object.keys(rule).forEach(property => {
                    element.style[property] = rule[property];
                });
            }
        } catch (e) {
            console.warn('Invalid responsive config:', config);
        }
    });
}

function addMobileBackdrop() {
    if (document.getElementById('mobile-backdrop')) return;
    
    const backdrop = document.createElement('div');
    backdrop.id = 'mobile-backdrop';
    backdrop.className = 'mobile-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    
    backdrop.addEventListener('click', () => {
        if (window.responsiveManager) {
            window.responsiveManager.closeMobileMenu();
        }
    });
    
    document.body.appendChild(backdrop);
    
    // انیمیشن fade in
    setTimeout(() => {
        backdrop.classList.add('visible');
    }, 10);
}

function removeMobileBackdrop() {
    const backdrop = document.getElementById('mobile-backdrop');
    if (backdrop) {
        backdrop.classList.remove('visible');
        setTimeout(() => {
            if (backdrop.parentNode) {
                backdrop.parentNode.removeChild(backdrop);
            }
        }, 300);
    }
}

/**
 * Export برای استفاده در ماژول‌های دیگر
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveManager;
}