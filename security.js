/**
 * Security Manager for PixelKit
 * مدیریت امنیت پیشرفته برای PixelKit
 * @version 2.0.0
 * @author Ali Ashrafi
 */

'use strict';

class SecurityManager {
    constructor() {
        this.sanitizedUrls = new Set();
        this.securityEvents = [];
        this.rateLimitCache = new Map();
        this.init();
    }

    /**
     * مقداردهی اولیه سیستم امنیتی
     */
    init() {
        this.setupSecurityHeaders();
        this.setupEventProtection();
        this.setupMemoryProtection();
        this.setupPerformanceProtection();
        this.setupErrorHandling();
        
        console.log('🔒 Security Manager initialized');
    }

    // =========================================================================
    // SECTION: Configuration
    // =========================================================================

    static get SECURITY_CONFIG() {
        return {
            MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
            MAX_FILES_COUNT: 20,
            MAX_CANVAS_SIZE: 10000,
            MAX_IMAGE_DIMENSION: 10000,
            TIMEOUT: 30000, // 30 seconds
            MEMORY_LIMIT: 500 * 1024 * 1024, // 500MB
            RATE_LIMIT_WINDOW: 60000, // 1 minute
            RATE_LIMIT_MAX_REQUESTS: 100,
            ALLOWED_FORMATS: [
                'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
                'image/gif', 'image/bmp', 'image/tiff'
            ],
            ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']
        };
    }

    // =========================================================================
    // SECTION: File Validation
    // =========================================================================

    /**
     * اعتبارسنجی کامل فایل
     */
    async validateFile(file) {
        try {
            // بررسی نوع فایل
            if (!this.isValidFileType(file)) {
                throw new SecurityError('INVALID_FILE_FORMAT', 'فرمت فایل پشتیبانی نمی‌شود');
            }

            // بررسی حجم فایل
            if (!this.isValidFileSize(file)) {
                throw new SecurityError('FILE_TOO_LARGE', 'حجم فایل بسیار بزرگ است');
            }

            // بررسی نام فایل
            if (!this.isSafeFileName(file.name)) {
                throw new SecurityError('INVALID_FILE_NAME', 'نام فایل نامعتبر است');
            }

            // بررسی محتوای فایل
            await this.validateFileContent(file);

            // لاگ کردن عملیات موفق
            this.logSecurityEvent('FILE_VALIDATION_SUCCESS', {
                fileName: this.hashFileName(file.name),
                fileSize: file.size,
                fileType: file.type
            });

            return true;

        } catch (error) {
            this.logSecurityEvent('FILE_VALIDATION_FAILED', {
                fileName: this.hashFileName(file.name),
                error: error.message
            });
            throw error;
        }
    }

    /**
     * اعتبارسنجی نوع فایل
     */
    isValidFileType(file) {
        return SecurityManager.SECURITY_CONFIG.ALLOWED_FORMATS.includes(file.type);
    }

    /**
     * اعتبارسنجی حجم فایل
     */
    isValidFileSize(file) {
        return file.size <= SecurityManager.SECURITY_CONFIG.MAX_FILE_SIZE;
    }

    /**
     * اعتبارسنجی محتوای فایل
     */
    async validateFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            let timeoutId = setTimeout(() => {
                reader.abort();
                reject(new SecurityError('FILE_READ_TIMEOUT', 'زمان خواندن فایل به پایان رسید'));
            }, SecurityManager.SECURITY_CONFIG.TIMEOUT);

            reader.onload = (event) => {
                clearTimeout(timeoutId);
                
                try {
                    const img = new Image();
                    img.onload = () => {
                        // بررسی ابعاد تصویر
                        if (img.width > SecurityManager.SECURITY_CONFIG.MAX_IMAGE_DIMENSION || 
                            img.height > SecurityManager.SECURITY_CONFIG.MAX_IMAGE_DIMENSION) {
                            reject(new SecurityError('IMAGE_TOO_LARGE', 'ابعاد تصویر بسیار بزرگ است'));
                            return;
                        }

                        // بررسی نسبت ابعاد
                        const aspectRatio = img.width / img.height;
                        if (aspectRatio > 100 || aspectRatio < 0.01) {
                            reject(new SecurityError('INVALID_ASPECT_RATIO', 'نسبت ابعاد تصویر نامعتبر است'));
                            return;
                        }

                        resolve(true);
                    };

                    img.onerror = () => {
                        reject(new SecurityError('INVALID_IMAGE_CONTENT', 'محتوای تصویر نامعتبر است'));
                    };

                    img.src = this.sanitizeUrl(event.target.result);

                } catch (error) {
                    reject(new SecurityError('IMAGE_VALIDATION_FAILED', 'اعتبارسنجی تصویر با خطا مواجه شد'));
                }
            };

            reader.onerror = () => {
                clearTimeout(timeoutId);
                reject(new SecurityError('FILE_READ_ERROR', 'خطا در خواندن فایل'));
            };

            reader.readAsDataURL(file);
        });
    }

    // =========================================================================
    // SECTION: Input Sanitization
    // =========================================================================

    /**
     * سانیتایز کردن URL
     */
    sanitizeUrl(url) {
        if (typeof url !== 'string') return '';
        
        const dangerousPatterns = [
            /javascript:/gi,
            /vbscript:/gi,
            /data:text\/html/gi,
            /data:application\/javascript/gi,
            /on\w+\s*=/gi, // حذف event handlers
            /<\s*script/gi,
            /<\s*iframe/gi,
            /<\s*object/gi,
            /<\s*embed/gi
        ];

        let sanitized = url;
        dangerousPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, '');
        });

        // محدود کردن طول URL
        if (sanitized.length > 1000000) {
            throw new SecurityError('URL_TOO_LONG', 'URL بسیار طولانی است');
        }

        this.sanitizedUrls.add(sanitized);
        return sanitized;
    }

    /**
     * بررسی نام فایل ایمن
     */
    isSafeFileName(fileName) {
        if (typeof fileName !== 'string') return false;

        const dangerousPatterns = [
            /\.\.\//g,    // Path traversal
            /\/\//g,      // Double slash
            /\\/g,        // Backslash
            /^\s|\s$/g,   // Leading/trailing spaces
            /[<>:"|?*]/g, // Illegal characters
            /\.(exe|bat|cmd|sh|php|asp|aspx|jsp|jar|war)$/gi // Dangerous extensions
        ];

        const isValidExtension = SecurityManager.SECURITY_CONFIG.ALLOWED_EXTENSIONS.some(ext => 
            fileName.toLowerCase().endsWith(ext)
        );

        return !dangerousPatterns.some(pattern => pattern.test(fileName)) && 
               fileName.length <= 255 &&
               isValidExtension;
    }

    /**
     * سانیتایز کردن HTML
     */
    sanitizeHTML(html) {
        if (typeof html !== 'string') return '';
        
        const temp = document.createElement('div');
        temp.textContent = html;
        return temp.innerHTML;
    }

    // =========================================================================
    // SECTION: Rate Limiting
    // =========================================================================

    /**
     * بررسی محدودیت نرخ درخواست
     */
    checkRateLimit(identifier, maxRequests = SecurityManager.SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
        const now = Date.now();
        const windowStart = now - SecurityManager.SECURITY_CONFIG.RATE_LIMIT_WINDOW;
        
        // پاک کردن درخواست‌های قدیمی
        const requests = (this.rateLimitCache.get(identifier) || [])
            .filter(timestamp => timestamp > windowStart);
        
        // بررسی تعداد درخواست‌ها
        if (requests.length >= maxRequests) {
            this.logSecurityEvent('RATE_LIMIT_EXCEEDED', { identifier });
            throw new SecurityError('RATE_LIMIT_EXCEEDED', 'تعداد درخواست‌ها بیش از حد مجاز است');
        }
        
        // افزودن درخواست جدید
        requests.push(now);
        this.rateLimitCache.set(identifier, requests);
        
        return true;
    }

    // =========================================================================
    // SECTION: Memory Protection
    // =========================================================================

    /**
     * محافظت از حافظه
     */
    setupMemoryProtection() {
        let lastMemoryCheck = 0;
        const MEMORY_CHECK_INTERVAL = 5000; // 5 seconds

        const checkMemory = () => {
            const now = Date.now();
            if (now - lastMemoryCheck < MEMORY_CHECK_INTERVAL) return;
            
            lastMemoryCheck = now;

            if (performance.memory) {
                const used = performance.memory.usedJSHeapSize;
                if (used > SecurityManager.SECURITY_CONFIG.MEMORY_LIMIT) {
                    this.cleanupMemory();
                    this.logSecurityEvent('MEMORY_LIMIT_EXCEEDED', { usedMemory: used });
                    throw new SecurityError('MEMORY_LIMIT_EXCEEDED', 'محدودیت حافظه exceeded');
                }
            }
        };

        // بررسی دوره‌ای حافظه
        setInterval(checkMemory, MEMORY_CHECK_INTERVAL);
    }

    /**
     * پاک‌سازی حافظه
     */
    cleanupMemory() {
        // پاک‌سازی URLهای سانیتایز شده
        this.sanitizedUrls.forEach(url => {
            if (url.startsWith('blob:') || url.startsWith('data:')) {
                try {
                    URL.revokeObjectURL(url);
                } catch (error) {
                    // ignore errors
                }
            }
        });
        this.sanitizedUrls.clear();

        // پاک‌سازی کش محدودیت نرخ
        const now = Date.now();
        const windowStart = now - SecurityManager.SECURITY_CONFIG.RATE_LIMIT_WINDOW;
        
        this.rateLimitCache.forEach((requests, key) => {
            const filtered = requests.filter(timestamp => timestamp > windowStart);
            if (filtered.length === 0) {
                this.rateLimitCache.delete(key);
            } else {
                this.rateLimitCache.set(key, filtered);
            }
        });

        // فراخوانی garbage collector اگر در دسترس باشد
        if (window.gc) {
            try {
                window.gc();
            } catch (error) {
                // ignore errors
            }
        }

        this.logSecurityEvent('MEMORY_CLEANUP', { timestamp: new Date().toISOString() });
    }

    // =========================================================================
    // SECTION: Performance Protection
    // =========================================================================

    /**
     * محافظت از عملکرد
     */
    setupPerformanceProtection() {
        // جلوگیری از حملات timing
        if (window.performance && window.performance.now) {
            const originalNow = performance.now;
            performance.now = function() {
                return Math.floor(originalNow.call(performance));
            };
        }

        // محافظت از timing APIs
        this.protectTimingAPIs();
    }

    /**
     * محافظت از Timing APIs
     */
    protectTimingAPIs() {
        // Override timing APIs to prevent information leakage
        const originalGetEntries = performance.getEntriesByType;
        if (originalGetEntries) {
            performance.getEntriesByType = function(type) {
                const entries = originalGetEntries.call(performance, type);
                if (type === 'navigation' || type === 'resource') {
                    return entries.map(entry => ({
                        ...entry,
                        name: '', // Hide sensitive URLs
                        serverTiming: [] // Hide server timing information
                    }));
                }
                return entries;
            };
        }
    }

    // =========================================================================
    // SECTION: Event Protection
    // =========================================================================

    /**
     * محافظت از Event Listeners
     */
    setupEventProtection() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

        EventTarget.prototype.addEventListener = function(type, listener, options) {
            // اعتبارسنجی پارامترها
            if (typeof listener !== 'function') {
                throw new SecurityError('INVALID_EVENT_LISTENER', 'Event listener باید تابع باشد');
            }

            // محدود کردن انواع eventهای خطرناک
            const dangerousEvents = ['beforeunload', 'unload', 'error'];
            if (dangerousEvents.includes(type)) {
                this.logSecurityEvent('DANGEROUS_EVENT_ATTEMPT', { eventType: type });
            }

            return originalAddEventListener.call(this, type, listener, options);
        };

        EventTarget.prototype.removeEventListener = function(type, listener, options) {
            return originalRemoveEventListener.call(this, type, listener, options);
        };
    }

    // =========================================================================
    // SECTION: Error Handling
    // =========================================================================

    /**
     * تنظیم مدیریت خطا
     */
    setupErrorHandling() {
        // مدیریت خطاهای全局
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error);
        });

        // مدیریت rejectionهای promise
        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection(event.reason);
        });
    }

    /**
     * مدیریت خطاهای全局
     */
    handleGlobalError(error) {
        this.logSecurityEvent('GLOBAL_ERROR', {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * مدیریت rejectionهای promise
     */
    handlePromiseRejection(reason) {
        this.logSecurityEvent('PROMISE_REJECTION', {
            reason: String(reason),
            timestamp: new Date().toISOString()
        });
    }

    // =========================================================================
    // SECTION: Security Headers & CSP
    // =========================================================================

    /**
     * تنظیم هدرهای امنیتی
     */
    setupSecurityHeaders() {
        // این معمولاً در سمت سرور تنظیم می‌شود، اما اینجا برای مستندات قرار داده شده
        const securityHeaders = {
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval' https://cdnjs.cloudflare.com/; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com/; font-src 'self' https://cdnjs.cloudflare.com/; img-src 'self' data: blob:; connect-src 'self';",
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'camera=(), microphone=(), location=(), payment=()'
        };

        this.logSecurityEvent('SECURITY_HEADERS_SET', { headers: securityHeaders });
    }

    // =========================================================================
    // SECTION: Logging & Monitoring
    // =========================================================================

    /**
     * لاگ کردن رویدادهای امنیتی
     */
    logSecurityEvent(type, data = {}) {
        const event = {
            type,
            data,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            sessionId: this.getSessionId()
        };

        this.securityEvents.push(event);

        // حفظ فقط 100 رویداد آخر
        if (this.securityEvents.length > 100) {
            this.securityEvents = this.securityEvents.slice(-100);
        }

        // console.log برای توسعه
        if (console && console.log) {
            console.log(`🔒 Security Event: ${type}`, data);
        }
    }

    /**
     * دریافت شناسه session
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('pixelkit_session_id');
        if (!sessionId) {
            sessionId = this.generateSessionId();
            sessionStorage.setItem('pixelkit_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * تولید شناسه session
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * هش کردن نام فایل برای حفظ حریم خصوصی
     */
    hashFileName(fileName) {
        // استفاده از یک الگوریتم ساده هشینگ برای لاگ‌ها
        let hash = 0;
        for (let i = 0; i < fileName.length; i++) {
            const char = fileName.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(36);
    }

    // =========================================================================
    // SECTION: Utility Methods
    // =========================================================================

    /**
     * بررسی پشتیبانی مرورگر از ویژگی‌های امنیتی
     */
    checkBrowserSecuritySupport() {
        const supports = {
            crypto: !!window.crypto && !!window.crypto.subtle,
            secureContext: window.isSecureContext,
            referrerPolicy: !!document.referrerPolicy,
            csp: !!document.securityPolicy
        };

        this.logSecurityEvent('BROWSER_SECURITY_CHECK', { supports });

        return supports;
    }

    /**
     * دریافت گزارش امنیتی
     */
    getSecurityReport() {
        return {
            events: this.securityEvents,
            sanitizedUrlsCount: this.sanitizedUrls.size,
            rateLimitCacheSize: this.rateLimitCache.size,
            sessionId: this.getSessionId(),
            browserSupport: this.checkBrowserSecuritySupport()
        };
    }

    /**
     * پاک‌سازی کامل
     */
    destroy() {
        this.cleanupMemory();
        this.securityEvents = [];
        this.rateLimitCache.clear();
        console.log('🔒 Security Manager destroyed');
    }
}

// =========================================================================
// SECTION: Security Error Class
// =========================================================================

class SecurityError extends Error {
    constructor(code, message) {
        super(message);
        this.name = 'SecurityError';
        this.code = code;
        this.timestamp = new Date().toISOString();
    }
}

// =========================================================================
// SECTION: Export
// =========================================================================

// Export برای استفاده در محیط‌های مختلف
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecurityManager, SecurityError };
} else if (typeof window !== 'undefined') {
    window.SecurityManager = SecurityManager;
    window.SecurityError = SecurityError;
}