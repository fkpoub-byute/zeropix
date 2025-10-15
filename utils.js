/**
 * Utility Functions for PixelKit
 * توابع کمکی برای PixelKit
 * @version 2.0.0
 * @author Ali Ashrafi
 */

'use strict';

class PixelKitUtils {
    constructor() {
        this.cache = new Map();
        this.debounceTimers = new Map();
        this.init();
    }

    /**
     * مقداردهی اولیه
     */
    init() {
        this.setupPerformanceMonitoring();
        console.log('🛠️ PixelKit Utils initialized');
    }

    // =========================================================================
    // SECTION: Performance Utilities
    // =========================================================================

    /**
     * راه‌اندازی مانیتورینگ عملکرد
     */
    setupPerformanceMonitoring() {
        this.performanceMetrics = {
            startTime: Date.now(),
            operations: new Map(),
            memorySnapshots: []
        };

        // گرفتن snapshot دوره‌ای از حافظه
        if (performance.memory) {
            setInterval(() => {
                this.takeMemorySnapshot();
            }, 30000); // هر 30 ثانیه
        }
    }

    /**
     * گرفتن snapshot از حافظه
     */
    takeMemorySnapshot() {
        if (!performance.memory) return;

        this.performanceMetrics.memorySnapshots.push({
            timestamp: Date.now(),
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
        });

        // حفظ فقط 50 snapshot آخر
        if (this.performanceMetrics.memorySnapshots.length > 50) {
            this.performanceMetrics.memorySnapshots.shift();
        }
    }

    /**
     * اندازه‌گیری زمان اجرای تابع
     */
    async measurePerformance(operationName, asyncFunction) {
        const startTime = performance.now();
        
        try {
            const result = await asyncFunction();
            const endTime = performance.now();
            const duration = endTime - startTime;

            this.performanceMetrics.operations.set(operationName, {
                duration,
                timestamp: Date.now(),
                success: true
            });

            return result;
        } catch (error) {
            const endTime = performance.now();
            const duration = endTime - startTime;

            this.performanceMetrics.operations.set(operationName, {
                duration,
                timestamp: Date.now(),
                success: false,
                error: error.message
            });

            throw error;
        }
    }

    /**
     * دریافت گزارش عملکرد
     */
    getPerformanceReport() {
        const operations = Array.from(this.performanceMetrics.operations.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 20); // 20 عملیات آخر

        return {
            uptime: Date.now() - this.performanceMetrics.startTime,
            operations,
            memorySnapshots: this.performanceMetrics.memorySnapshots.slice(-10),
            cacheSize: this.cache.size,
            debounceTimers: this.debounceTimers.size
        };
    }

    // =========================================================================
    // SECTION: File Utilities
    // =========================================================================

    /**
     * فرمت کردن حجم فایل
     */
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * استخراج پسوند فایل
     */
    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }

    /**
     * بررسی پشتیبانی از فرمت
     */
    isSupportedFormat(fileType) {
        const supported = [
            'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
            'image/gif', 'image/bmp', 'image/tiff'
        ];
        return supported.includes(fileType);
    }

    /**
     * تولید نام فایل خروجی
     */
    generateOutputFilename(originalName, operation, format) {
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        const extension = format.split('/')[1] || 'jpg';
        const baseName = originalName.replace(/\.[^/.]+$/, '');
        
        return `${operation}-${baseName}-${timestamp}.${extension}`;
    }

    // =========================================================================
    // SECTION: DOM Utilities
    // =========================================================================

    /**
     * ایجاد element ایمن
     */
    createSecureElement(tagName, attributes = {}, styles = {}) {
        const element = document.createElement(tagName);
        
        // تنظیم attributeها
        Object.keys(attributes).forEach(key => {
            if (this.isSafeAttribute(key, attributes[key])) {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        // تنظیم استایل‌ها
        Object.keys(styles).forEach(property => {
            if (this.isSafeStyleProperty(property)) {
                element.style[property] = styles[property];
            }
        });
        
        return element;
    }

    /**
     * بررسی attribute ایمن
     */
    isSafeAttribute(name, value) {
        const dangerousAttributes = [
            'onload', 'onerror', 'onclick', 'onmouseover', 'onscroll',
            'onfocus', 'onblur', 'onkeydown', 'onkeypress', 'onkeyup'
        ];
        
        if (dangerousAttributes.includes(name.toLowerCase())) {
            return false;
        }
        
        // بررسی مقادیر خطرناک
        if (typeof value === 'string' && (
            value.includes('javascript:') ||
            value.includes('data:text/html') ||
            value.includes('onerror=')
        )) {
            return false;
        }
        
        return true;
    }

    /**
     * بررسی property استایل ایمن
     */
    isSafeStyleProperty(property) {
        const dangerousProperties = [
            'behavior', 'expression', 'javascript', 'mocha',
            'livescript', 'vbscript'
        ];
        
        return !dangerousProperties.some(danger => 
            property.toLowerCase().includes(danger)
        );
    }

    /**
     * حذف ایمن element
     */
    safeRemoveElement(element) {
        if (element && element.parentNode) {
            try {
                element.parentNode.removeChild(element);
            } catch (error) {
                console.warn('Error removing element:', error);
            }
        }
    }

    // =========================================================================
    // SECTION: Event Utilities
    // =========================================================================

    /**
     * ثبت event listener ایمن
     */
    addSafeEventListener(element, event, handler, options = {}) {
        const safeHandler = (e) => {
            try {
                // بررسی event معتبر
                if (!e || !e.target) return;
                
                // اجرای handler اصلی
                handler(e);
            } catch (error) {
                console.error('Safe event handler error:', error);
            }
        };
        
        element.addEventListener(event, safeHandler, options);
        
        // برگرداندن تابع برای حذف event listener
        return () => {
            element.removeEventListener(event, safeHandler, options);
        };
    }

    /**
     * تابع debounce
     */
    debounce(func, wait, immediate = false) {
        const key = func.toString() + wait;
        
        return (...args) => {
            const later = () => {
                this.debounceTimers.delete(key);
                if (!immediate) func.apply(this, args);
            };
            
            const callNow = immediate && !this.debounceTimers.has(key);
            
            clearTimeout(this.debounceTimers.get(key));
            this.debounceTimers.set(key, setTimeout(later, wait));
            
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * تابع throttle
     */
    throttle(func, limit) {
        let inThrottle;
        
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // =========================================================================
    // SECTION: Cache Utilities
    // =========================================================================

    /**
     * ذخیره در کش
     */
    setCache(key, value, ttl = 300000) { // 5 minutes default
        const item = {
            value,
            expiry: Date.now() + ttl,
            timestamp: Date.now()
        };
        
        this.cache.set(key, item);
        
        // پاک‌سازی دوره‌ی کش
        this.cleanupCache();
    }

    /**
     * بازیابی از کش
     */
    getCache(key) {
        const item = this.cache.get(key);
        
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.value;
    }

    /**
     * پاک‌سازی کش
     */
    cleanupCache() {
        const now = Date.now();
        
        this.cache.forEach((item, key) => {
            if (now > item.expiry) {
                this.cache.delete(key);
            }
        });
    }

    /**
     * پاک‌سازی کامل کش
     */
    clearCache() {
        this.cache.clear();
    }

    // =========================================================================
    // SECTION: URL & Blob Utilities
    // =========================================================================

    /**
     * ایجاد URL ایمن
     */
    createSafeObjectURL(blob) {
        try {
            const url = URL.createObjectURL(blob);
            
            // ردیابی URLهای ایجاد شده
            this.trackObjectURL(url);
            
            return url;
        } catch (error) {
            throw new Error('Failed to create object URL: ' + error.message);
        }
    }

    /**
     * ردیابی URLهای object
     */
    trackObjectURL(url) {
        if (!this.objectURLs) {
            this.objectURLs = new Set();
        }
        this.objectURLs.add(url);
    }

    /**
     * آزاد کردن URLهای object
     */
    revokeObjectURL(url) {
        try {
            URL.revokeObjectURL(url);
            if (this.objectURLs) {
                this.objectURLs.delete(url);
            }
        } catch (error) {
            console.warn('Error revoking object URL:', error);
        }
    }

    /**
     * آزاد کردن تمام URLهای object
     */
    revokeAllObjectURLs() {
        if (this.objectURLs) {
            this.objectURLs.forEach(url => {
                this.revokeObjectURL(url);
            });
            this.objectURLs.clear();
        }
    }

    // =========================================================================
    // SECTION: Validation Utilities
    // =========================================================================

    /**
     * اعتبارسنجی عدد
     */
    isValidNumber(value, min = -Infinity, max = Infinity) {
        const num = Number(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * اعتبارسنجی رشته
     */
    isValidString(value, maxLength = 1000) {
        return typeof value === 'string' && 
               value.length > 0 && 
               value.length <= maxLength;
    }

    /**
     * اعتبارسنجی آرایه
     */
    isValidArray(array, maxLength = 100) {
        return Array.isArray(array) && 
               array.length <= maxLength &&
               array.every(item => item !== null && item !== undefined);
    }

    // =========================================================================
    // SECTION: Crypto Utilities
    // =========================================================================

    /**
     * تولید nonce برای CSP
     */
    generateNonce() {
        const array = new Uint8Array(32);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(array);
        } else {
            // Fallback برای مرورگرهای قدیمی
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
        }
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }

    /**
     * هش کردن ساده رشته
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36);
    }

    // =========================================================================
    // SECTION: Error Handling
    // =========================================================================

    /**
     * ایجاد خطای ساختاریافته
     */
    createError(code, message, details = {}) {
        const error = new Error(message);
        error.code = code;
        error.details = details;
        error.timestamp = new Date().toISOString();
        return error;
    }

    /**
     * مدیریت خطا به صورت یکپارچه
     */
    handleError(error, context = '') {
        const errorInfo = {
            message: error.message,
            code: error.code,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.error('PixelKit Error:', errorInfo);

        // اینجا می‌توانید خطا را به سرور گزارش دهید
        // this.reportErrorToServer(errorInfo);

        return errorInfo;
    }

    // =========================================================================
    // SECTION: Internationalization Utilities
    // =========================================================================

    /**
     * تشخیص زبان مرورگر
     */
    detectBrowserLanguage() {
        const language = navigator.language || navigator.userLanguage || 'fa';
        return language.startsWith('fa') ? 'fa' : 'en';
    }

    /**
     * تشخیص جهت نوشتار
     */
    getTextDirection(language) {
        return language === 'fa' ? 'rtl' : 'ltr';
    }

    // =========================================================================
    // SECTION: Cleanup & Destruction
    // =========================================================================

    /**
     * پاک‌سازی منابع
     */
    destroy() {
        // پاک‌سازی کش
        this.clearCache();
        
        // پاک‌سازی تایمرهای debounce
        this.debounceTimers.forEach(timerId => {
            clearTimeout(timerId);
        });
        this.debounceTimers.clear();
        
        // آزاد کردن URLهای object
        this.revokeAllObjectURLs();
        
        console.log('🛠️ PixelKit Utils destroyed');
    }
}

// =========================================================================
// SECTION: Export
// =========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PixelKitUtils };
} else if (typeof window !== 'undefined') {
    window.PixelKitUtils = PixelKitUtils;
}

// =========================================================================
// SECTION: Global Utility Functions
// =========================================================================

/**
 * تابع کمکی برای فرمت کردن زمان
 */
function formatTime(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * تابع کمکی برای ایجاد تاخیر
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * تابع کمکی برای بررسی پشتیبانی از فرمت
 */
function isWebPSupported() {
    return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
}

/**
 * تابع کمکی برای بررسی پشتیبانی از AVIF
 */
function isAVIFSupported() {
    return new Promise((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = function() {
            resolve(avif.height === 2);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
}