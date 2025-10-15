/**
 * Secure Image Processor for PixelKit
 * پردازشگر ایمن تصویر برای PixelKit
 * @version 2.0.0
 * @author Ali Ashrafi
 */

'use strict';

class SecureImageProcessor {
    constructor(securityManager) {
        if (!securityManager || !(securityManager instanceof SecurityManager)) {
            throw new SecurityError('INVALID_SECURITY_MANAGER', 'Security Manager معتبر مورد نیاز است');
        }

        this.securityManager = securityManager;
        this.activeProcesses = new Map();
        this.canvasPool = [];
        this.maxCanvasPoolSize = 5;
        
        this.init();
    }

    /**
     * مقداردهی اولیه پردازشگر
     */
    init() {
        this.setupCanvasPool();
        console.log('🖼️ Secure Image Processor initialized');
    }

    // =========================================================================
    // SECTION: Configuration
    // =========================================================================

    static get PROCESSOR_CONFIG() {
        return {
            MAX_CANVAS_SIZE: 10000,
            MAX_IMAGE_DIMENSION: 10000,
            QUALITY_RANGE: { min: 0.1, max: 1.0 },
            TIMEOUT: 30000,
            MEMORY_CHECK_INTERVAL: 1000,
            SUPPORTED_FORMATS: {
                'image/jpeg': { quality: true, alpha: false },
                'image/png': { quality: false, alpha: true },
                'image/webp': { quality: true, alpha: true },
                'image/avif': { quality: true, alpha: true },
                'image/gif': { quality: false, alpha: true },
                'image/bmp': { quality: false, alpha: false }
            }
        };
    }

    // =========================================================================
    // SECTION: Canvas Management
    // =========================================================================

    /**
     * راه‌اندازی استخر کانواس
     */
    setupCanvasPool() {
        for (let i = 0; i < this.maxCanvasPoolSize; i++) {
            this.canvasPool.push(this.createSecureCanvas());
        }
    }

    /**
     * ایجاد کانواس ایمن
     */
    createSecureCanvas() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', {
            willReadFrequently: false,
            alpha: true,
            colorSpace: 'srgb',
            desynchronized: false
        });

        // تنظیم ویژگی‌های امنیتی
        canvas.width = 0;
        canvas.height = 0;

        return { canvas, ctx, inUse: false, lastUsed: Date.now() };
    }

    /**
     * دریافت کانواس از استخر
     */
    getCanvasFromPool() {
        // پیدا کردن کانواس آزاد
        let canvasObj = this.canvasPool.find(obj => !obj.inUse);
        
        if (!canvasObj) {
            // اگر کانواس آزاد وجود ندارد، قدیمی‌ترین را بازنشانی کنید
            canvasObj = this.canvasPool.reduce((oldest, current) => {
                return current.lastUsed < oldest.lastUsed ? current : oldest;
            });
            this.resetCanvas(canvasObj);
        }

        canvasObj.inUse = true;
        canvasObj.lastUsed = Date.now();
        return canvasObj;
    }

    /**
     * بازگرداندن کانواس به استخر
     */
    returnCanvasToPool(canvasObj) {
        this.resetCanvas(canvasObj);
        canvasObj.inUse = false;
    }

    /**
     * بازنشانی کانواس
     */
    resetCanvas(canvasObj) {
        const { canvas, ctx } = canvasObj;
        
        // پاک‌سازی کانواس
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // تنظیم اندازه حداقل برای آزاد کردن حافظه
        canvas.width = 1;
        canvas.height = 1;
    }

    // =========================================================================
    // SECTION: Image Processing
    // =========================================================================

    /**
     * پردازش ایمن تصویر
     */
    async processImage(file, options = {}) {
        const processId = this.generateProcessId();
        
        try {
            // اعتبارسنجی فایل
            await this.securityManager.validateFile(file);
            
            // بررسی محدودیت نرخ
            this.securityManager.checkRateLimit('image_processing');
            
            // شروع پردازش
            this.activeProcesses.set(processId, {
                startTime: Date.now(),
                file: this.securityManager.hashFileName(file.name),
                options
            });

            const result = await this.processWithTimeout(
                this._processImage(file, options),
                SecureImageProcessor.PROCESSOR_CONFIG.TIMEOUT,
                processId
            );

            // لاگ موفقیت
            this.securityManager.logSecurityEvent('IMAGE_PROCESSING_SUCCESS', {
                processId,
                fileName: this.securityManager.hashFileName(file.name),
                processingTime: Date.now() - this.activeProcesses.get(processId).startTime
            });

            return result;

        } catch (error) {
            this.securityManager.logSecurityEvent('IMAGE_PROCESSING_FAILED', {
                processId,
                fileName: this.securityManager.hashFileName(file.name),
                error: error.message
            });
            throw error;
        } finally {
            this.activeProcesses.delete(processId);
        }
    }

    /**
     * پردازش اصلی تصویر
     */
    async _processImage(file, options) {
        const canvasObj = this.getCanvasFromPool();
        
        try {
            // بارگذاری تصویر
            const img = await this.loadImage(file);
            
            // تنظیم ابعاد
            const dimensions = this.calculateDimensions(img, options);
            this.validateDimensions(dimensions);
            
            // تنظیم کانواس
            this.setupCanvas(canvasObj, dimensions);
            
            // رسم تصویر
            this.drawImage(canvasObj, img, dimensions, options);
            
            // تبدیل به blob
            const blob = await this.canvasToBlob(canvasObj, file.type, options);
            
            return blob;

        } finally {
            this.returnCanvasToPool(canvasObj);
        }
    }

    /**
     * بارگذاری ایمن تصویر
     */
    loadImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            let timeoutId = setTimeout(() => {
                reader.abort();
                reject(new SecurityError('IMAGE_LOAD_TIMEOUT', 'زمان بارگذاری تصویر به پایان رسید'));
            }, SecureImageProcessor.PROCESSOR_CONFIG.TIMEOUT);

            reader.onload = (event) => {
                clearTimeout(timeoutId);
                
                const img = new Image();
                img.onload = () => {
                    // اعتبارسنجی نهایی تصویر
                    this.validateImage(img);
                    resolve(img);
                };
                
                img.onerror = () => {
                    reject(new SecurityError('IMAGE_LOAD_FAILED', 'بارگذاری تصویر با خطا مواجه شد'));
                };
                
                // استفاده از URL سانیتایز شده
                img.src = this.securityManager.sanitizeUrl(event.target.result);
            };

            reader.onerror = () => {
                clearTimeout(timeoutId);
                reject(new SecurityError('FILE_READ_ERROR', 'خطا در خواندن فایل'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * محاسبه ابعاد جدید
     */
    calculateDimensions(img, options) {
        let width = options.width || img.width;
        let height = options.height || img.height;

        // حفظ نسبت ابعاد اگر درخواست شده باشد
        if (options.maintainAspectRatio && options.width && !options.height) {
            height = Math.round((img.height / img.width) * width);
        } else if (options.maintainAspectRatio && options.height && !options.width) {
            width = Math.round((img.width / img.height) * height);
        }

        // محدود کردن ابعاد
        width = Math.max(1, Math.min(width, SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION));
        height = Math.max(1, Math.min(height, SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION));

        return { width, height, originalWidth: img.width, originalHeight: img.height };
    }

    /**
     * اعتبارسنجی ابعاد
     */
    validateDimensions(dimensions) {
        const { width, height } = dimensions;
        
        if (width <= 0 || height <= 0) {
            throw new SecurityError('INVALID_DIMENSIONS', 'ابعاد تصویر نامعتبر است');
        }
        
        if (width > SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION || 
            height > SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION) {
            throw new SecurityError('DIMENSIONS_TOO_LARGE', 'ابعاد تصویر بسیار بزرگ است');
        }

        const aspectRatio = width / height;
        if (aspectRatio > 100 || aspectRatio < 0.01) {
            throw new SecurityError('INVALID_ASPECT_RATIO', 'نسبت ابعاد نامعتبر است');
        }
    }

    /**
     * اعتبارسنجی تصویر
     */
    validateImage(img) {
        if (img.width <= 0 || img.height <= 0) {
            throw new SecurityError('INVALID_IMAGE_DIMENSIONS', 'ابعاد تصویر نامعتبر است');
        }
        
        if (img.width > SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION || 
            img.height > SecureImageProcessor.PROCESSOR_CONFIG.MAX_IMAGE_DIMENSION) {
            throw new SecurityError('IMAGE_TOO_LARGE', 'ابعاد تصویر بسیار بزرگ است');
        }
    }

    /**
     * تنظیم کانواس
     */
    setupCanvas(canvasObj, dimensions) {
        const { canvas, ctx } = canvasObj;
        const { width, height } = dimensions;

        // تنظیم ابعاد
        canvas.width = width;
        canvas.height = height;

        // تنظیم کیفیت رندر
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.globalCompositeOperation = 'source-over';
    }

    /**
     * رسم تصویر روی کانواس
     */
    drawImage(canvasObj, img, dimensions, options) {
        const { ctx } = canvasObj;
        const { width, height } = dimensions;

        // پاک‌سازی کانواس
        ctx.clearRect(0, 0, width, height);

        // رسم تصویر
        ctx.drawImage(img, 0, 0, width, height);

        // اعمال فیلترهای اضافی اگر وجود داشته باشد
        if (options.filters) {
            this.applyFilters(ctx, options.filters, width, height);
        }
    }

    /**
     * اعمال فیلترها
     */
    applyFilters(ctx, filters, width, height) {
        // اینجا می‌توانید فیلترهای مختلف اعمال کنید
        // برای ایمنی، فقط فیلترهای ساده مجاز هستند
        const allowedFilters = ['grayscale', 'sepia', 'brightness', 'contrast'];
        
        filters.forEach(filter => {
            if (allowedFilters.includes(filter.type)) {
                this.applySingleFilter(ctx, filter, width, height);
            }
        });
    }

    /**
     * اعمال یک فیلتر
     */
    applySingleFilter(ctx, filter, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        switch (filter.type) {
            case 'grayscale':
                for (let i = 0; i < data.length; i += 4) {
                    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                    data[i] = data[i + 1] = data[i + 2] = gray;
                }
                break;
                
            case 'sepia':
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
                }
                break;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * تبدیل کانواس به blob
     */
    async canvasToBlob(canvasObj, originalType, options) {
        const { canvas } = canvasObj;
        const format = options.format || originalType;
        const quality = this.validateQuality(options.quality);

        const formatConfig = SecureImageProcessor.PROCESSOR_CONFIG.SUPPORTED_FORMATS[format];
        if (!formatConfig) {
            throw new SecurityError('UNSUPPORTED_FORMAT', 'فرمت خروجی پشتیبانی نمی‌شود');
        }

        const finalQuality = formatConfig.quality ? quality : undefined;

        return new Promise((resolve, reject) => {
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new SecurityError('BLOB_CONVERSION_FAILED', 'تبدیل به blob با خطا مواجه شد'));
                    }
                },
                format,
                finalQuality
            );
        });
    }

    /**
     * اعتبارسنجی کیفیت
     */
    validateQuality(quality) {
        if (quality === undefined || quality === null) {
            return 0.8; // کیفیت پیش‌فرض
        }

        const numQuality = Number(quality);
        if (isNaN(numQuality)) {
            throw new SecurityError('INVALID_QUALITY', 'مقدار کیفیت نامعتبر است');
        }

        return Math.max(
            SecureImageProcessor.PROCESSOR_CONFIG.QUALITY_RANGE.min,
            Math.min(numQuality, SecureImageProcessor.PROCESSOR_CONFIG.QUALITY_RANGE.max)
        );
    }

    // =========================================================================
    // SECTION: Utility Methods
    // =========================================================================

    /**
     * پردازش با تایم‌اوت
     */
    async processWithTimeout(promise, timeout, processId) {
        let timeoutId;
        
        const timeoutPromise = new Promise((_, reject) => {
            timeoutId = setTimeout(() => {
                reject(new SecurityError('PROCESS_TIMEOUT', 'زمان پردازش به پایان رسید'));
            }, timeout);
        });

        try {
            const result = await Promise.race([promise, timeoutPromise]);
            clearTimeout(timeoutId);
            return result;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * تولید شناسه پردازش
     */
    generateProcessId() {
        return `img_process_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * بررسی وضعیت پردازش
     */
    getProcessingStatus() {
        return {
            activeProcesses: this.activeProcesses.size,
            canvasPool: {
                total: this.canvasPool.length,
                inUse: this.canvasPool.filter(obj => obj.inUse).length
            },
            memoryUsage: performance.memory ? performance.memory.usedJSHeapSize : 'N/A'
        };
    }

    /**
     * توقف تمام پردازش‌ها
     */
    abortAllProcesses() {
        this.activeProcesses.clear();
        this.securityManager.logSecurityEvent('ALL_PROCESSES_ABORTED', {
            timestamp: new Date().toISOString()
        });
    }

    /**
     * پاک‌سازی منابع
     */
    destroy() {
        this.abortAllProcesses();
        
        // پاک‌سازی استخر کانواس
        this.canvasPool.forEach(canvasObj => {
            this.resetCanvas(canvasObj);
        });
        this.canvasPool = [];
        
        console.log('🖼️ Secure Image Processor destroyed');
    }
}

// =========================================================================
// SECTION: Export
// =========================================================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SecureImageProcessor };
} else if (typeof window !== 'undefined') {
    window.SecureImageProcessor = SecureImageProcessor;
}