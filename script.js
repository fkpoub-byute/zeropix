document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------------------
    // SECTION: Notification System
    // -----------------------------------------------------------------------------
    class NotificationSystem {
        constructor() {
            this.container = null;
            this.init();
        }

        init() {
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }

        show(type, title, message, duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            
            const icons = {
                success: 'fas fa-check',
                error: 'fas fa-exclamation-triangle',
                warning: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle'
            };

            notification.innerHTML = `
                <div class="notification-icon">
                    <i class="${icons[type]}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${title}</div>
                    <div class="notification-message">${message}</div>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.hide(notification));

            this.container.appendChild(notification);

            setTimeout(() => notification.classList.add('show'), 100);

            if (duration > 0) {
                setTimeout(() => this.hide(notification), duration);
            }

            return notification;
        }

        hide(notification) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }

        success(title, message, duration) {
            return this.show('success', title, message, duration);
        }

        error(title, message, duration) {
            return this.show('error', title, message, duration);
        }

        warning(title, message, duration) {
            return this.show('warning', title, message, duration);
        }

        info(title, message, duration) {
            return this.show('info', title, message, duration);
        }
    }

    // -----------------------------------------------------------------------------
    // SECTION: Privacy Modal
    // -----------------------------------------------------------------------------
    class PrivacyModal {
        constructor() {
            this.modal = null;
            this.init();
        }

        init() {
            this.modal = document.createElement('div');
            this.modal.className = 'modal-overlay';
            this.updateModalContent('fa');
            document.body.appendChild(this.modal);
        }

        updateModalContent(lang) {
            const content = lang === 'fa' ? this.getFarsiContent() : this.getEnglishContent();
            this.modal.innerHTML = content;

            const closeBtn = this.modal.querySelector('.modal-close');
            const overlay = this.modal;

            closeBtn.addEventListener('click', () => this.hide());
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) this.hide();
            });
        }

        getFarsiContent() {
            return `
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">حریم خصوصی و امنیت</h2>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <h3>🔒 امنیت کامل اطلاعات شما</h3>
                            <p>ما به حریم خصوصی شما احترام می‌گذاریم و این قول رو بهتون می‌دیم:</p>
                            <ul>
                                <li><strong>هیچ عکسی به سرور ارسال نمی‌شه:</strong> تمام پردازش‌ها داخل مرورگر خودتون انجام می‌شه</li>
                                <li><strong>داده‌ها ذخیره نمی‌شن:</strong> بعد از بستن صفحه، همه چیز پاک می‌شه</li>
                                <li><strong>نیاز به ثبت‌نام نیست:</strong> می‌تونید مستقیماً از ابزار استفاده کنید</li>
                                <li><strong>بدون ردیابی:</strong> از شما داده‌ای جمع‌آوری نمی‌کنیم</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>🛡️ چطور اطلاعات شما محافظت می‌شه؟</h3>
                            <p>این سایت با تکنولوژی‌های مدرن وب ساخته شده که اجازه نمی‌ده اطلاعات شما جایی به غیر از کامپیوتر خودتون ذخیره بشه. وقتی عکس آپلود می‌کنید:</p>
                            <ul>
                                <li>عکس فقط در حافظه موقت مرورگر شما قرار می‌گیره</li>
                                <li>پردازش‌ها با JavaScript انجام می‌شه</li>
                                <li>بعد از دانلود، عکس از حافظه پاک می‌شه</li>
                                <li>حتی ما هم به عکس‌های شما دسترسی نداریم!</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>💡 چرا می‌تونید به ما اعتماد کنید؟</h3>
                            <p>ما خودمون هم از این ابزار استفاده می‌کنیم و می‌دونیم که حریم خصوصی چقدر مهمه. این قول‌ها رو به شما می‌دیم:</p>
                            <ul>
                                <li>همیشه رایگان می‌مونه</li>
                                <li>هیچ تبلیغاتی نداره</li>
                                <li>کدهای سایت باز هست (Open Source)</li>
                                <li>بدون محدودیت استفاده</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>📞 اگر سوالی دارید...</h3>
                            <p>می‌تونید مستقیم با سازنده در تماس باشید:</p>
                            <p style="text-align: center; margin-top: 1rem;">
                                <a href="mailto:ali.1600.ashrafi@gmail.com" style="color: var(--accent1); text-decoration: none;">
                                    <i class="fas fa-envelope"></i>
                                    ali.1600.ashrafi@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        getEnglishContent() {
            return `
                <div class="modal">
                    <div class="modal-header">
                        <h2 class="modal-title">Privacy & Security</h2>
                        <button class="modal-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-section">
                            <h3>🔒 Complete Security of Your Information</h3>
                            <p>We respect your privacy and promise you:</p>
                            <ul>
                                <li><strong>No images are sent to servers:</strong> All processing happens in your browser</li>
                                <li><strong>Data is not stored:</strong> Everything is deleted when you close the page</li>
                                <li><strong>No registration required:</strong> You can use the tool directly</li>
                                <li><strong>No tracking:</strong> We don't collect any data from you</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>🛡️ How Your Information is Protected</h3>
                            <p>This site is built with modern web technologies that prevent your information from being stored anywhere other than your own computer. When you upload photos:</p>
                            <ul>
                                <li>Images are only stored in your browser's temporary memory</li>
                                <li>Processing is done with JavaScript</li>
                                <li>After download, images are deleted from memory</li>
                                <li>Even we don't have access to your photos!</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>💡 Why You Can Trust Us</h3>
                            <p>We use this tool ourselves and know how important privacy is. We promise you:</p>
                            <ul>
                                <li>Always free</li>
                                <li>No advertisements</li>
                                <li>Open source code</li>
                                <li>No usage limits</li>
                            </ul>
                        </div>
                        
                        <div class="modal-section">
                            <h3>📞 If You Have Questions...</h3>
                            <p>You can contact the creator directly:</p>
                            <p style="text-align: center; margin-top: 1rem;">
                                <a href="mailto:ali.1600.ashrafi@gmail.com" style="color: var(--accent1); text-decoration: none;">
                                    <i class="fas fa-envelope"></i>
                                    ali.1600.ashrafi@gmail.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        show(lang = 'fa') {
            this.updateModalContent(lang);
            this.modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        hide() {
            this.modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // -----------------------------------------------------------------------------
    // SECTION: State Management & Global Variables
    // -----------------------------------------------------------------------------
    const state = {
        compress: { 
            file: null, 
            originalUrl: null, 
            processedUrl: null,
            originalSize: 0,
            processedSize: 0
        },
        resize: { 
            file: null, 
            originalWidth: 0, 
            originalHeight: 0, 
            aspectRatio: 1,
            originalSize: 0
        },
        convert: { 
            file: null,
            originalFormat: '',
            originalSize: 0
        },
        batch: { 
            files: [], 
            mode: 'compress',
            totalSize: 0
        },
        currentLanguage: 'fa',
        isProcessing: false
    };

    // Initialize systems
    const notifications = new NotificationSystem();
    const privacyModal = new PrivacyModal();

    // -----------------------------------------------------------------------------
    // SECTION: Internationalization (i18n) - Complete Language System
    // -----------------------------------------------------------------------------
    const translations = {
        fa: {
            // Navigation & Simple Keys
            'nav.compress': 'کاهش حجم', 
            'nav.resize': 'تغییر اندازه', 
            'nav.convert': 'تغییر فرمت',
            'nav.batch': 'پردازش گروهی', 
            'nav.help': 'راهنما', 
            'nav.about': 'درباره ما',
        'title': 'ZeroPix — ابزار حرفه‌ای پردازش تصویر',
            'compress.title': 'کاهش هوشمند حجم عکس',
            'compress.description': 'حجم عکس‌های خود را بدون افت کیفیت محسوس کاهش دهید - مناسب برای وب‌سایت‌ها و شبکه‌های اجتماعی',
            'resize.title': 'تغییر اندازه و رزولوشن عکس',
            'resize.description': 'ابعاد عکس خود را به اندازه‌های استاندارد تغییر دهید یا اندازه دلخواه تنظیم کنید',
            'convert.title': 'تبدیل هوشمند فرمت عکس',
            'convert.description': 'عکس‌های خود را به فرمت‌های مدرن و بهینه تبدیل کنید تا حجم کمتر و کیفیت بهتری داشته باشند',
            'batch.title': 'پردازش گروهی عکس‌ها',
            'batch.description': 'عملیات کاهش حجم یا تغییر فرمت را به صورت همزمان روی چندین عکس انجام دهید',
            
            'uploaderHint': 'عکس را اینجا بکشید یا کلیک کنید',
            'batch.uploaderHint': 'چند عکس را بکشید یا کلیک کنید',
            'batch.maxFiles': 'حداکثر ۲۰ فایل مجاز است',
            
            'compress.qualityLabel': 'میزان فشرده‌سازی',
            'compress.lowQuality': 'حجم کمتر',
            'compress.highQuality': 'کیفیت بیشتر',
            'compress.originalSize': 'حجم اصلی',
            'compress.compressedSize': 'حجم جدید',
            'compress.savings': 'صرفه‌جویی',
            'compress.compareTitle': 'مقایسه قبل و بعد',
            'compress.compareHint': 'اسلایدر را حرکت دهید برای مقایسه',
            'compress.supportedFormats': 'فرمت‌های پشتیبانی: JPG, PNG, WebP, GIF, BMP',
            'compress.button': 'شروع کاهش حجم',
            
            'resize.width': 'عرض (پیکسل)',
            'resize.height': 'ارتفاع (پیکسل)',
            'resize.aspectLock': 'حفظ نسبت ابعاد',
            'resize.highQuality': 'کیفیت بالا',
            'resize.presetTitle': 'اندازه‌های پیشنهادی:',
            'resize.presetInstagram': 'اینستاگرام مربعی',
            'resize.presetStory': 'استوری اینستاگرام',
            'resize.presetFacebook': 'پست فیسبوک',
            'resize.presetHD': 'HD (720p)',
            'resize.presetFullHD': 'Full HD (1080p)',
            'resize.originalSize': 'سایز اصلی',
            'resize.newSize': 'سایز جدید',
            'resize.button': 'تغییر اندازه',
            
            'convert.formatLabel': 'انتخاب فرمت خروجی',
            'convert.recommendation': 'پیشنهاد فرمت مناسب:',
            'convert.webpDesc': 'بهترین برای وب - حجم کم و کیفیت بالا',
            'convert.avifDesc': 'جدیدترین فناوری - عالی برای عکس‌ها',
            'convert.currentFormat': 'فرمت فعلی:',
            'convert.suggestion': 'پیشنهاد ما:',
            'convert.button': 'تبدیل فرمت',
            
            'batch.selectMode': 'عملیات مورد نظر را انتخاب کنید:',
            'batch.compressMode': 'کاهش حجم گروهی',
            'batch.convertMode': 'تبدیل فرمت گروهی',
            'batch.compressDesc': 'کاهش حجم تمام عکس‌ها',
            'batch.convertDesc': 'تبدیل فرمت تمام عکس‌ها',
            'batch.selectedFiles': 'تعداد عکس‌های انتخاب شده:',
            'batch.totalSize': 'حجم کل:',
            'batch.filesList': 'لیست عکس‌ها:',
            'batch.estimatedTime': 'زمان تخمینی:',
            'batch.estimatedSavings': 'صرفه‌جویی تخمینی:',
            'batch.button': 'شروع پردازش گروهی',
            
            'common.resetButton': 'عکس جدید',
            'common.download': 'دانلود عکس',
            'common.downloadZip': 'دانلود فایل ZIP',
            
            'info.original': 'اصلی',
            'info.processed': 'فشرده شده',

            // Notification Titles
            'notification.success': 'موفقیت',
            'notification.error': 'خطا',
            'notification.warning': 'هشدار',
            'notification.info': 'اطلاعات',
            
            'footer.credit': 'ساخته شده با ❤️ توسط علی اشرفی',
            'footer.version': 'نسخه ۲.۰',
            'footer.contact': 'تماس با ما',
            'footer.privacy': 'حریم خصوصی',

            // Status Messages
            'status.ready': 'آماده برای آپلود عکس',
            'status.imageUploaded': (name) => `فایل "${name}" با موفقیت بارگذاری شد`,
            'status.filesUploaded': (count) => `${count} فایل با موفقیت بارگذاری شد`,
            'status.processing': 'در حال پردازش... لطفاً منتظر بمانید',
            'status.processComplete': 'پردازش با موفقیت انجام شد',
            'status.downloadReady': 'فایل آماده دانلود است',
            'status.compressionComplete': (savings) => `فشرده‌سازی کامل شد! ${savings}% صرفه‌جویی`,
            'status.resizeComplete': 'تغییر اندازه با موفقیت انجام شد',
            'status.convertComplete': 'تبدیل فرمت با موفقیت انجام شد',
            'status.batchComplete': (count) => `پردازش ${count} فایل کامل شد`,
            
            // Error Messages
            'error.noFile': 'لطفاً یک فایل انتخاب کنید',
            'error.invalidFile': 'فایل انتخاب شده معتبر نیست',
            'error.unsupportedFormat': 'فرمت فایل پشتیبانی نمی‌شود',
            'error.fileTooLarge': (maxSize) => `حجم فایل بسیار بزرگ است (حداکثر ${maxSize})`,
            'error.tooManyFiles': (maxFiles) => `تعداد فایل‌ها بسیار زیاد است (حداکثر ${maxFiles})`,
            'error.processingFailed': 'خطا در پردازش فایل',
            'error.invalidDimensions': 'ابعاد وارد شده معتبر نیست',
            'error.aspectRatio': 'نسبت ابعاد نامعتبر است',
            'error.browserSupport': 'مرورگر شما از این قابلیت پشتیبانی نمی‌کند',
            'error.memory': 'خطای حافظه - لطفاً فایل‌های کوچک‌تری انتخاب کنید',
            'error.unknown': 'خطای ناشناخته - لطفاً صفحه را رفرش کنید',

            // Section Content (HTML)
        'help.title': 'راهنمای استفاده از ZeroPix',
            'help.content': `
                <div class="help-section">
                    <h3>🎯 شروع سریع</h3>
                    <p>PixelKit یک ابزار کامل برای کار با تصاویر است که تمام پردازش‌ها در مرورگر شما انجام می‌شود و هیچ فایلی به سرور ارسال نمی‌شود.</p>
                    
                    <h4>۱. کاهش حجم عکس</h4>
                    <div class="feature-steps">
                        <div class="step">
                            <strong>مرحله ۱:</strong> عکس خود را آپلود کنید (کشیدن و رها کردن یا کلیک)
                        </div>
                        <div class="step">
                            <strong>مرحله ۲:</strong> میزان فشرده‌سازی را با اسلایدر تنظیم کنید
                        </div>
                        <div class="step">
                            <strong>مرحله ۳:</strong> روی "شروع کاهش حجم" کلیک کنید
                        </div>
                        <div class="step">
                            <strong>مرحله ۴:</strong> نتیجه را مقایسه و دانلود کنید
                        </div>
                    </div>
                    
                    <h4>۲. تغییر اندازه عکس</h4>
                    <div class="feature-steps">
                        <div class="step">
                            <strong>مرحله ۱:</strong> عکس را آپلود کنید
                        </div>
                        <div class="step">
                            <strong>مرحله ۲:</strong> از اندازه‌های پیشنهادی استفاده کنید یا اندازه دلخواه وارد کنید
                        </div>
                        <div class="step">
                            <strong>مرحله ۳:</strong> گزینه "حفظ نسبت ابعاد" برای جلوگیری از کشیدگی
                        </div>
                        <div class="step">
                            <strong>مرحله ۴:</strong> تغییر اندازه و دانلود
                        </div>
                    </div>
                    
                    <h4>۳. تبدیل فرمت</h4>
                    <ul>
                        <li><strong>WebP:</strong> بهترین انتخاب برای وب - حجم بسیار کم با کیفیت بالا</li>
                        <li><strong>AVIF:</strong> جدیدترین تکنولوژی - عالی برای عکس‌های با کیفیت</li>
                        <li><strong>JPEG:</strong> مناسب برای عکس‌های رنگی و عکاسی</li>
                        <li><strong>PNG:</strong> مناسب برای تصاویر با transparency و لوگو</li>
                    </ul>
                    
                    <h4>۴. پردازش گروهی</h4>
                    <p>برای صرفه‌جویی در زمان، می‌توانید چندین عکس را همزمان پردازش کنید:</p>
                    <ul>
                        <li>حداکثر ۲۰ فایل به صورت همزمان</li>
                        <li>انتخاب بین کاهش حجم یا تغییر فرمت</li>
                        <li>خروجی در قالب فایل ZIP</li>
                    </ul>
                    
                    <div class="tips">
                        <h4>💡 نکات مهم</h4>
                        <ul>
                            <li>تمام پردازش‌ها در دستگاه شما انجام می‌شود - حریم خصوصی کاملاً حفظ می‌شود</li>
                            <li>برای بهترین نتیجه، از عکس‌های با کیفیت اصلی استفاده کنید</li>
                            <li>فرمت WebP در همه مرورگرهای مدرن پشتیبانی می‌شود</li>
                            <li>حداکثر حجم فایل: ۲۰ مگابایت برای هر عکس</li>
                        </ul>
                    </div>
                </div>
            `,
        'about.title': 'درباره ZeroPix',
            'about.content': `
                <div class="about-section">
                    <div class="mission-card">
                        <h3>🚀 مأموریت ما</h3>
                        <p>PixelKit با هدف ساده‌سازی کار با تصاویر و در دسترس قرار دادن ابزارهای حرفه‌ای برای همه کاربران ایجاد شده است. ما معتقدیم که هر کسی باید بتواند به راحتی عکس‌های خود را بهینه‌سازی کند.</p>
                    </div>
                    
                    <div class="privacy-card">
                        <h3>🛡️ حریم خصوصی شما</h3>
                        <p><strong>مهم:</strong> هیچ یک از عکس‌های شما به سرورهای ما ارسال نمی‌شود. تمام مراحل پردازش در مرورگر شما و روی دستگاه خودتان انجام می‌شود. وقتی صفحه را می‌بندید، همه داده‌ها پاک می‌شوند.</p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-item">
                            <i class="fas fa-bolt"></i>
                            <h4>سریع و کارآمد</h4>
                            <p>پردازش آنی بدون نیاز به آپلود</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <h4>امنیت کامل</h4>
                            <p>فایل‌های شما هرگز سرور را ترک نمی‌کنند</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-magic"></i>
                            <h4>کیفیت بالا</h4>
                            <p>الگوریتم‌های پیشرفته پردازش تصویر</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-heart"></i>
                            <h4>رایگان و همیشه</h4>
                            <p>هیچ هزینه‌ای ندارد و همیشه رایگان خواهد ماند</p>
                        </div>
                    </div>
                    
                    <div class="creator-info">
                        <h3>👨‍💻 سازنده</h3>
                        <p>PixelKit با passion و توسط <strong>علی اشرفی</strong> توسعه داده شده است. اگر پیشنهاد یا انتقادی دارید، خوشحال می‌شوم بشنوم.</p>
                        <div class="contact-links">
                            <a href="mailto:ali.1600.ashrafi@gmail.com" class="contact-link">
                                <i class="fas fa-envelope"></i>
                                ایمیل به علی
                            </a>
                        </div>
                    </div>
                </div>
            `
        },
        en: {
            // Navigation & Simple Keys
            'nav.compress': 'Compress', 
            'nav.resize': 'Resize', 
            'nav.convert': 'Convert',
            'nav.batch': 'Batch Process', 
            'nav.help': 'Help', 
            'nav.about': 'About',
        'title': 'ZeroPix — Professional Image Toolkit',
            'compress.title': 'Smart Image Compression',
            'compress.description': 'Reduce image file size without noticeable quality loss - Perfect for websites and social media',
            'resize.title': 'Image Resize & Resolution',
            'resize.description': 'Change your image dimensions to standard sizes or set custom measurements',
            'convert.title': 'Smart Format Converter',
            'convert.description': 'Convert your images to modern, optimized formats for smaller size and better quality',
            'batch.title': 'Batch Image Processing',
            'batch.description': 'Perform compression or format conversion on multiple images simultaneously',
            
            'uploaderHint': 'Drag & drop an image here, or click to select',
            'batch.uploaderHint': 'Drag & drop multiple images, or click to select',
            'batch.maxFiles': 'Maximum 20 files allowed',
            
            'compress.qualityLabel': 'Compression Level',
            'compress.lowQuality': 'Smaller Size',
            'compress.highQuality': 'Better Quality',
            'compress.originalSize': 'Original Size',
            'compress.compressedSize': 'New Size',
            'compress.savings': 'Savings',
            'compress.compareTitle': 'Before & After Comparison',
            'compress.compareHint': 'Drag the slider to compare',
            'compress.supportedFormats': 'Supported formats: JPG, PNG, WebP, GIF, BMP',
            'compress.button': 'Start Compression',
            
            'resize.width': 'Width (pixels)',
            'resize.height': 'Height (pixels)',
            'resize.aspectLock': 'Lock aspect ratio',
            'resize.highQuality': 'High Quality',
            'resize.presetTitle': 'Recommended Sizes:',
            'resize.presetInstagram': 'Instagram Square',
            'resize.presetStory': 'Instagram Story',
            'resize.presetFacebook': 'Facebook Post',
            'resize.presetHD': 'HD (720p)',
            'resize.presetFullHD': 'Full HD (1080p)',
            'resize.originalSize': 'Original Size',
            'resize.newSize': 'New Size',
            'resize.button': 'Resize Image',
            
            'convert.formatLabel': 'Select Output Format',
            'convert.recommendation': 'Format Recommendations:',
            'convert.webpDesc': 'Best for web - Small size with high quality',
            'convert.avifDesc': 'Latest technology - Excellent for photos',
            'convert.currentFormat': 'Current Format:',
            'convert.suggestion': 'Our Suggestion:',
            'convert.button': 'Convert Format',
            
            'batch.selectMode': 'Select desired operation:',
            'batch.compressMode': 'Batch Compress',
            'batch.convertMode': 'Batch Convert',
            'batch.compressDesc': 'Compress all images',
            'batch.convertDesc': 'Convert all images format',
            'batch.selectedFiles': 'Selected files:',
            'batch.totalSize': 'Total size:',
            'batch.filesList': 'Files list:',
            'batch.estimatedTime': 'Estimated time:',
            'batch.estimatedSavings': 'Estimated savings:',
            'batch.button': 'Start Batch Processing',
            
            'common.resetButton': 'New Image',
            'common.download': 'Download Image',
            'common.downloadZip': 'Download ZIP File',
            
            'info.original': 'Original',
            'info.processed': 'Compressed',

            // Notification Titles
            'notification.success': 'Success',
            'notification.error': 'Error',
            'notification.warning': 'Warning',
            'notification.info': 'Information',
            
            'footer.credit': 'Made with ❤️ by Ali Ashrafi',
            'footer.version': 'Version 2.0',
            'footer.contact': 'Contact Us',
            'footer.privacy': 'Privacy',

            // Status Messages
            'status.ready': 'Ready to upload image',
            'status.imageUploaded': (name) => `File "${name}" uploaded successfully`,
            'status.filesUploaded': (count) => `${count} files uploaded successfully`,
            'status.processing': 'Processing... Please wait',
            'status.processComplete': 'Processing completed successfully',
            'status.downloadReady': 'File ready for download',
            'status.compressionComplete': (savings) => `Compression complete! ${savings}% savings`,
            'status.resizeComplete': 'Resize completed successfully',
            'status.convertComplete': 'Format conversion completed successfully',
            'status.batchComplete': (count) => `Processed ${count} files successfully`,
            
            // Error Messages
            'error.noFile': 'Please select a file',
            'error.invalidFile': 'Selected file is not valid',
            'error.unsupportedFormat': 'File format is not supported',
            'error.fileTooLarge': (maxSize) => `File size is too large (maximum ${maxSize})`,
            'error.tooManyFiles': (maxFiles) => `Too many files selected (maximum ${maxFiles})`,
            'error.processingFailed': 'Error processing file',
            'error.invalidDimensions': 'Invalid dimensions entered',
            'error.aspectRatio': 'Invalid aspect ratio',
            'error.browserSupport': 'Your browser does not support this feature',
            'error.memory': 'Memory error - Please select smaller files',
            'error.unknown': 'Unknown error - Please refresh the page',

            // Section Content (HTML)
        'help.title': 'ZeroPix User Guide', 
            'help.content': `
                <div class="help-section">
                    <h3>🎯 Quick Start</h3>
                    <p>PixelKit is a complete image processing tool that performs all operations in your browser - no files are sent to any server.</p>
                    
                    <h4>1. Image Compression</h4>
                    <div class="feature-steps">
                        <div class="step">
                            <strong>Step 1:</strong> Upload your image (drag & drop or click)
                        </div>
                        <div class="step">
                            <strong>Step 2:</strong> Adjust compression level with the slider
                        </div>
                        <div class="step">
                            <strong>Step 3:</strong> Click "Start Compression"
                        </div>
                        <div class="step">
                            <strong>Step 4:</strong> Compare results and download
                        </div>
                    </div>
                    
                    <h4>2. Image Resize</h4>
                    <div class="feature-steps">
                        <div class="step">
                            <strong>Step 1:</strong> Upload your image
                        </div>
                        <div class="step">
                            <strong>Step 2:</strong> Use recommended sizes or enter custom dimensions
                        </div>
                        <div class="step">
                            <strong>Step 3:</strong> Enable "Lock aspect ratio" to prevent distortion
                        </div>
                        <div class="step">
                            <strong>Step 4:</strong> Resize and download
                        </div>
                    </div>
                    
                    <h4>3. Format Conversion</h4>
                    <ul>
                        <li><strong>WebP:</strong> Best choice for web - Very small size with high quality</li>
                        <li><strong>AVIF:</strong> Latest technology - Excellent for quality photos</li>
                        <li><strong>JPEG:</strong> Suitable for colorful images and photography</li>
                        <li><strong>PNG:</strong> Suitable for images with transparency and logos</li>
                    </ul>
                    
                    <h4>4. Batch Processing</h4>
                    <p>Save time by processing multiple images at once:</p>
                    <ul>
                        <li>Maximum 20 files simultaneously</li>
                        <li>Choose between compression or format conversion</li>
                        <li>Output as ZIP file</li>
                    </ul>
                    
                    <div class="tips">
                        <h4>💡 Important Tips</h4>
                        <ul>
                            <li>All processing happens on your device - Complete privacy protection</li>
                            <li>For best results, use original quality images</li>
                            <li>WebP format is supported in all modern browsers</li>
                            <li>Maximum file size: 20MB per image</li>
                        </ul>
                    </div>
                </div>
            `,
        'about.title': 'About ZeroPix',
            'about.content': `
                <div class="about-section">
                    <div class="mission-card">
                        <h3>🚀 Our Mission</h3>
                        <p>PixelKit was created to simplify image processing and make professional tools accessible to everyone. We believe anyone should be able to easily optimize their images.</p>
                    </div>
                    
                    <div class="privacy-card">
                        <h3>🛡️ Your Privacy</h3>
                        <p><strong>Important:</strong> None of your images are sent to our servers. All processing happens in your browser on your own device. When you close the page, all data is erased.</p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-item">
                            <i class="fas fa-bolt"></i>
                            <h4>Fast & Efficient</h4>
                            <p>Instant processing without uploads</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-shield-alt"></i>
                            <h4>Complete Security</h4>
                            <p>Your files never leave your computer</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-magic"></i>
                            <h4>High Quality</h4>
                            <p>Advanced image processing algorithms</p>
                        </div>
                        <div class="feature-item">
                            <i class="fas fa-heart"></i>
                            <h4>Free & Always</h4>
                            <p>No cost and will always remain free</p>
                        </div>
                    </div>
                    
                    <div class="creator-info">
                        <h3>👨‍💻 Creator</h3>
                        <p>PixelKit is developed with passion by <strong>Ali Ashrafi</strong>. If you have suggestions or feedback, I'd be happy to hear them.</p>
                        <div class="contact-links">
                            <a href="mailto:ali.1600.ashrafi@gmail.com" class="contact-link">
                                <i class="fas fa-envelope"></i>
                                Email Ali
                            </a>
                        </div>
                    </div>
                </div>
            `
        }
    };

    /**
     * @function setLanguage
     * @description Updates the entire page content based on the selected language
     */
    function setLanguage(lang) {
        state.currentLanguage = lang;
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';

        const langData = translations[lang];

        // Update all elements with data-i18n-key
        document.querySelectorAll('[data-i18n-key]').forEach(el => {
            const key = el.getAttribute('data-i18n-key');
            if (langData[key] && typeof langData[key] === 'string') {
                el.innerHTML = langData[key];
            }
        });

        // Update section content
        document.querySelectorAll('[data-i18n-section]').forEach(el => {
            const section = el.getAttribute('data-i18n-section');
            const contentKey = `${section}.content`;
            const titleKey = `${section}.title`;
            
            if (langData[contentKey]) {
                el.innerHTML = langData[contentKey];
            }
            
            const titleEl = document.querySelector(`#panel-${section} h2`);
            if (titleEl && langData[titleKey]) {
                titleEl.innerHTML = langData[titleKey];
            }
        });

        // Update document title
        if (langData['title']) {
            document.title = langData['title'];
        }

        // Update privacy modal language
        privacyModal.updateModalContent(lang);

        // Update dynamic content
        updateDynamicContent();
    }

    /**
     * @function updateDynamicContent
     * @description Updates dynamic content that depends on current state
     */
    function updateDynamicContent() {
        // Update file info if files are loaded
        if (state.compress.file) {
            setInfo('compress', 'info.fileName', state.compress.file.name, formatBytes(state.compress.file.size));
        }
        if (state.resize.file) {
            setInfo('resize', 'info.fileName', state.resize.file.name, formatBytes(state.resize.file.size));
        }
        if (state.convert.file) {
            setInfo('convert', 'info.fileName', state.convert.file.name, formatBytes(state.convert.file.size));
        }
    }

    // -----------------------------------------------------------------------------
    // SECTION: UI Management (Theme, Navigation, DOM Elements)
    // -----------------------------------------------------------------------------
    
    // Theme Toggle
    document.getElementById('theme-toggle').addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        
        const message = state.currentLanguage === 'fa' ? 
            'تم تاریک تغییر کرد' : 
            'Theme changed';
        notifications.success(
            translations[state.currentLanguage]['notification.success'],
            message,
            3000
        );
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        document.body.classList.remove('dark-theme');
    }

    // Tab Navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll('.panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            const targetPanelId = 'panel-' + targetTab;

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show target panel
            panels.forEach(panel => {
                const isActive = panel.id === targetPanelId;
                panel.style.display = isActive ? 'block' : 'none';
                panel.classList.toggle('active', isActive);
            });

            // Reset status for the new panel
            setStatus(targetTab, 'status.ready');
        });
    });

    // Language Switcher
    document.getElementById('lang-switcher').addEventListener('change', (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        localStorage.setItem('language', newLang);
        
        const message = newLang === 'fa' ? 
            'زبان به فارسی تغییر کرد' : 
            'Language changed to English';
        notifications.success(
            translations[newLang]['notification.success'],
            message,
            3000
        );
    });

    // Privacy Modal
    document.querySelector('a[data-i18n-key="footer.privacy"]').addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.show(state.currentLanguage);
    });

    // Load saved language
    const savedLanguage = localStorage.getItem('language') || 'fa';
    document.getElementById('lang-switcher').value = savedLanguage;
    setLanguage(savedLanguage);

    // -----------------------------------------------------------------------------
    // SECTION: Generic Helper Functions
    // -----------------------------------------------------------------------------
    
    /**
     * @function formatBytes
     * @description Formats bytes to human readable string
     */
    function formatBytes(bytes, decimals = 1) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * @function setStatus
     * @description Sets status message for a panel
     */
    function setStatus(panelId, messageKey, ...args) {
        const statusEl = document.getElementById(`${panelId}-status`);
        if (!statusEl) return;
        
        let message = translations[state.currentLanguage][messageKey];
        if (typeof message === 'function') {
            message = message(...args);
        }
        
        statusEl.innerHTML = message || messageKey;
        statusEl.className = 'statusbar';
        
        if (messageKey.includes('error')) {
            statusEl.classList.add('error');
        } else if (messageKey.includes('success') || messageKey.includes('complete') || messageKey.includes('ready')) {
            statusEl.classList.add('success');
        } else {
            statusEl.classList.add('info');
        }
    }

    /**
     * @function setInfo
     * @description Sets file information display
     */
    function setInfo(panelId, messageKey, ...args) {
        const infoEl = document.getElementById(`${panelId}-file-info`);
        if (!infoEl) return;
        
        infoEl.style.display = 'block';
        let message = translations[state.currentLanguage][messageKey];
        if (typeof message === 'function') {
            message = message(...args);
        }
        
        infoEl.innerHTML = message || messageKey;
    }

    /**
     * @function showError
     * @description Shows error message
     */
    function showError(errorKey, ...args) {
        const activePanel = document.querySelector('.panel.active');
        if (!activePanel) return;
        
        const panelId = activePanel.id.replace('panel-', '');
        setStatus(panelId, errorKey, ...args);
        
        // Show notification
        let message = translations[state.currentLanguage][errorKey];
        if (typeof message === 'function') {
            message = message(...args);
        }
        
        notifications.error(
            translations[state.currentLanguage]['notification.error'],
            message,
            5000
        );
    }

    /**
     * @function showSuccess
     * @description Shows success message
     */
    function showSuccess(successKey, ...args) {
        let message = translations[state.currentLanguage][successKey];
        if (typeof message === 'function') {
            message = message(...args);
        }
        
        notifications.success(
            translations[state.currentLanguage]['notification.success'],
            message,
            3000
        );
    }

    /**
     * @function setupUploader
     * @description Sets up drag & drop and file input for uploaders
     */
    function setupUploader(uploaderId, inputId, onFileSelected, isMultiple = false, maxFiles = 20) {
        const uploaderEl = document.getElementById(uploaderId);
        const inputEl = document.getElementById(inputId);
        if (!uploaderEl || !inputEl) return;

        const handleFileSelection = (files) => {
            if (files.length === 0) return;
            
            // Validate files
            const validFiles = Array.from(files).filter(file => {
                if (!file.type.startsWith('image/')) {
                    showError('error.invalidFile');
                    return false;
                }
                if (file.size > 20 * 1024 * 1024) {
                    showError('error.fileTooLarge', '20MB');
                    return false;
                }
                return true;
            });

            if (validFiles.length === 0) return;

            if (isMultiple && validFiles.length > maxFiles) {
                showError('error.tooManyFiles', maxFiles);
                validFiles.splice(maxFiles);
            }

            onFileSelected(isMultiple ? validFiles : validFiles[0]);
        };

        // Click to upload
        uploaderEl.addEventListener('click', () => inputEl.click());
        
        // Drag and drop events
        ['dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploaderEl.addEventListener(eventName, e => e.preventDefault());
        });
        
        uploaderEl.addEventListener('dragover', () => {
            uploaderEl.classList.add('dragover');
        });
        
        uploaderEl.addEventListener('dragleave', () => {
            uploaderEl.classList.remove('dragover');
        });
        
        uploaderEl.addEventListener('drop', e => {
            uploaderEl.classList.remove('dragover');
            handleFileSelection(e.dataTransfer.files);
        });
        
        // File input change
        inputEl.addEventListener('change', () => {
            handleFileSelection(inputEl.files);
        });
    }

    /**
     * @function resetUI
     * @description Resets UI for a specific panel
     */
    function resetUI(panelId) {
        if (!['compress', 'resize', 'convert', 'batch'].includes(panelId)) return;

        const controls = document.getElementById(`${panelId}-controls`);
        const uploader = document.getElementById(`${panelId}-uploader`);
        const input = document.getElementById(`input-${panelId}`);

        if (controls) controls.style.display = 'none';
        if (uploader) uploader.style.display = 'block';
        if (input) input.value = '';

        setStatus(panelId, 'status.ready');

        // Clean up URLs to free memory
        if (state.compress.originalUrl) URL.revokeObjectURL(state.compress.originalUrl);
        if (state.compress.processedUrl) URL.revokeObjectURL(state.compress.processedUrl);

        // Panel-specific resets
        switch (panelId) {
            case 'compress':
                document.getElementById('compare-container').style.display = 'none';
                document.getElementById('compress-preview-area').innerHTML = '';
                document.getElementById('download-compress').style.display = 'none';
                document.getElementById('compress-file-info').style.display = 'none';
                state.compress = { file: null, originalUrl: null, processedUrl: null, originalSize: 0, processedSize: 0 };
                break;
                
            case 'resize':
                document.getElementById('resize-preview-img').style.display = 'none';
                document.getElementById('download-resize').style.display = 'none';
                document.getElementById('resize-file-info').style.display = 'none';
                state.resize = { file: null, originalWidth: 0, originalHeight: 0, aspectRatio: 1, originalSize: 0 };
                break;
                
            case 'convert':
                document.getElementById('convert-preview-img').style.display = 'none';
                document.getElementById('download-convert').style.display = 'none';
                document.getElementById('convert-file-info').style.display = 'none';
                state.convert = { file: null, originalFormat: '', originalSize: 0 };
                break;
                
            case 'batch':
                document.getElementById('batch-mode-selection').style.display = 'block';
                document.getElementById('batch-options-container').style.display = 'none';
                document.getElementById('batch-file-list').innerHTML = '';
                document.getElementById('download-batch-zip').style.display = 'none';
                state.batch = { files: [], mode: 'compress', totalSize: 0 };
                break;
        }
    }

    /**
     * @function processImage
     * @description Core image processing function with EXACT quality control
     */
    function processImage(file, options = {}) {
        return new Promise((resolve, reject) => {
            // Check browser support for AVIF
            if (options.format === 'image/avif') {
                const canvas = document.createElement('canvas');
                if (!canvas.toDataURL('image/avif').includes('image/avif')) {
                    reject(new Error('AVIF_NOT_SUPPORTED'));
                    return;
                }
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Set canvas dimensions
                    canvas.width = options.width || img.width;
                    canvas.height = options.height || img.height;
                    
                    // Enable high quality scaling if requested
                    if (options.highQuality !== false) {
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                    }
                    
                    // Draw image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    const format = options.format || file.type;
                    const quality = options.quality !== undefined ? options.quality : 0.8;

                    // Convert to blob with EXACT quality parameter
                    canvas.toBlob(blob => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('CANVAS_TO_BLOB_FAILED'));
                        }
                    }, format, quality); // کیفیت دقیقاً همینجا اعمال می‌شود
                };
                img.onerror = () => reject(new Error('IMAGE_LOAD_FAILED'));
                img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error('FILE_READ_FAILED'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * @function handleProcessingError
     * @description Handles processing errors with appropriate messages
     */
    function handleProcessingError(error, panelId) {
        console.error(`Error in ${panelId}:`, error);
        
        switch (error.message) {
            case 'AVIF_NOT_SUPPORTED':
                showError('error.browserSupport');
                break;
            case 'IMAGE_LOAD_FAILED':
                showError('error.invalidFile');
                break;
            case 'FILE_READ_FAILED':
                showError('error.processingFailed');
                break;
            case 'CANVAS_TO_BLOB_FAILED':
                showError('error.processingFailed');
                break;
            default:
                if (error.message.includes('Memory')) {
                    showError('error.memory');
                } else {
                    showError('error.unknown');
                }
        }
    }

    // -----------------------------------------------------------------------------
    // SECTION: COMPRESS PANEL LOGIC - IMPROVED QUALITY CONTROL
    // -----------------------------------------------------------------------------
    setupUploader('compress-uploader', 'input-compress', (file) => {
        state.compress.file = file;
        state.compress.originalSize = file.size;
        state.compress.originalUrl = URL.createObjectURL(file);
        
        // Update UI
        document.getElementById('compress-uploader').style.display = 'none';
        document.getElementById('compress-controls').style.display = 'flex';
        
        // Show preview
        const previewArea = document.getElementById('compress-preview-area');
        previewArea.innerHTML = `<img src="${state.compress.originalUrl}" alt="Original image">`;
        previewArea.style.display = 'block';
        
        // Update file info
        setInfo('compress', 'info.fileName', file.name, formatBytes(file.size));
        setStatus('compress', 'status.imageUploaded', file.name);
        
        // Update size display
        document.getElementById('original-size').textContent = formatBytes(file.size);
        document.getElementById('compressed-size').textContent = '-';
        document.getElementById('savings-percent').textContent = '0%';
        
        showSuccess('status.imageUploaded', file.name);
    });

    // Quality slider - فقط برای نمایش پیش‌نمایش استفاده می‌شود
    const qualitySlider = document.getElementById('quality-slider');
    const qualityValue = document.getElementById('quality-val');
    
    qualitySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        qualityValue.textContent = value + '%';
        
        // Estimate new size (فقط برای نمایش - تاثیری در پردازش نهایی ندارد)
        if (state.compress.file) {
            const qualityFactor = value / 100;
            const estimatedSize = Math.max(state.compress.file.size * qualityFactor * 0.7, state.compress.file.size * 0.1);
            document.getElementById('compressed-size').textContent = formatBytes(estimatedSize);
            
            const savings = 100 - (estimatedSize / state.compress.file.size * 100);
            document.getElementById('savings-percent').textContent = savings.toFixed(1) + '%';
        }
    });

    // Compress button - با کنترل دقیق کیفیت
    document.getElementById('compress-btn').addEventListener('click', async () => {
        if (!state.compress.file || state.isProcessing) return;
        
        state.isProcessing = true;
        setStatus('compress', 'status.processing');
        
        // استفاده دقیق از مقدار اسلایدر برای کیفیت
        const quality = parseInt(qualitySlider.value) / 100;
        const compressBtn = document.getElementById('compress-btn');
        const originalText = compressBtn.innerHTML;
        compressBtn.innerHTML = '<div class="loading"></div> ' + (state.currentLanguage === 'fa' ? 'در حال پردازش...' : 'Processing...');
        compressBtn.disabled = true;

        try {
            // پردازش تصویر با کیفیت دقیقاً مطابق اسلایدر
            const processedBlob = await processImage(state.compress.file, { 
                quality: quality, // کیفیت دقیقاً از اسلایدر گرفته می‌شود
                format: 'image/jpeg'
            });
            
            state.compress.processedUrl = URL.createObjectURL(processedBlob);
            state.compress.processedSize = processedBlob.size;
            
            // Hide preview, show comparison
            document.getElementById('compress-preview-area').style.display = 'none';
            const compareContainer = document.getElementById('compare-container');
            compareContainer.style.display = 'block';
            
            // Setup comparison with improved slider
            compareContainer.innerHTML = `
                <div class="compare-header">
                    <h3>${state.currentLanguage === 'fa' ? 'مقایسه قبل و بعد' : 'Before & After Comparison'}</h3>
                    <p>${state.currentLanguage === 'fa' ? 'اسلایدر را حرکت دهید برای مقایسه' : 'Drag the slider to compare'}</p>
                </div>
                <div class="compare-box">
                    <div class="img-container before">
                        <img src="${state.compress.originalUrl}" alt="Before compression">
                        <div class="img-label before-label">${state.currentLanguage === 'fa' ? 'اصلی' : 'Original'}</div>
                    </div>
                    <div class="img-container after">
                        <img src="${state.compress.processedUrl}" alt="After compression">
                        <div class="img-label after-label">${state.currentLanguage === 'fa' ? 'فشرده شده' : 'Compressed'}</div>
                    </div>
                    <div class="compare-line"></div>
                    <div class="compare-handle">
                        <i class="fas fa-arrows-alt-h"></i>
                    </div>
                    <input type="range" min="0" max="100" value="50" class="compare-slider">
                </div>
            `;
            
            // Improved slider functionality with RTL support
            const slider = compareContainer.querySelector('.compare-slider');
            const afterImg = compareContainer.querySelector('.after');
            const handle = compareContainer.querySelector('.compare-handle');
            const line = compareContainer.querySelector('.compare-line');
            
            const updateSlider = (value) => {
                const percent = value + '%';
                
                if (state.currentLanguage === 'fa') {
                    // For RTL languages (Farsi)
                    afterImg.style.clipPath = `polygon(${percent} 0, 100% 0, 100% 100%, ${percent} 100%)`;
                    handle.style.right = percent;
                    line.style.right = percent;
                } else {
                    // For LTR languages (English)
                    afterImg.style.clipPath = `polygon(0 0, ${percent} 0, ${percent} 100%, 0 100%)`;
                    handle.style.left = percent;
                    line.style.left = percent;
                }
            };
            
            slider.addEventListener('input', (e) => {
                updateSlider(e.target.value);
            });
            
            // Add mouse/touch drag support with RTL awareness
            let isDragging = false;
            
            handle.addEventListener('mousedown', () => isDragging = true);
            compareContainer.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const rect = compareContainer.getBoundingClientRect();
                const x = e.clientX - rect.left;
                let percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                // Adjust for RTL
                if (state.currentLanguage === 'fa') {
                    percent = 100 - percent;
                }
                
                slider.value = percent;
                updateSlider(percent);
            });
            
            document.addEventListener('mouseup', () => isDragging = false);
            
            // Touch support for mobile
            handle.addEventListener('touchstart', (e) => {
                e.preventDefault();
                isDragging = true;
            });
            
            compareContainer.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const rect = compareContainer.getBoundingClientRect();
                const x = e.touches[0].clientX - rect.left;
                let percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
                
                // Adjust for RTL
                if (state.currentLanguage === 'fa') {
                    percent = 100 - percent;
                }
                
                slider.value = percent;
                updateSlider(percent);
            });
            
            document.addEventListener('touchend', () => isDragging = false);
            
            // Initialize slider
            updateSlider(50);
            
            // Update download link
            const downloadLink = document.getElementById('download-compress');
            downloadLink.href = state.compress.processedUrl;
            const originalName = state.compress.file.name.substring(0, state.compress.file.name.lastIndexOf('.'));
            downloadLink.download = `compressed-${originalName}.jpg`;
            downloadLink.style.display = 'inline-block';
            
            // Calculate and show savings
            const savings = 100 - (state.compress.processedSize / state.compress.originalSize * 100);
            document.getElementById('compressed-size').textContent = formatBytes(state.compress.processedSize);
            document.getElementById('savings-percent').textContent = savings.toFixed(1) + '%';
            
            setStatus('compress', 'status.compressionComplete', savings.toFixed(1));
            showSuccess('status.compressionComplete', savings.toFixed(1));
            
        } catch (error) {
            console.error('Compression error:', error);
            handleProcessingError(error, 'compress');
        } finally {
            state.isProcessing = false;
            compressBtn.innerHTML = originalText;
            compressBtn.disabled = false;
        }
    });

    // -----------------------------------------------------------------------------
    // SECTION: RESIZE PANEL LOGIC
    // -----------------------------------------------------------------------------
    setupUploader('resize-uploader', 'input-resize', (file) => {
        state.resize.file = file;
        state.resize.originalSize = file.size;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                state.resize.originalWidth = img.width;
                state.resize.originalHeight = img.height;
                state.resize.aspectRatio = img.width / img.height;
                
                // Update inputs
                document.getElementById('resize-width').value = img.width;
                document.getElementById('resize-height').value = img.height;
                
                // Update preview
                const previewImg = document.getElementById('resize-preview-img');
                previewImg.src = e.target.result;
                previewImg.style.display = 'block';
                
                // Update UI
                document.getElementById('resize-uploader').style.display = 'none';
                document.getElementById('resize-controls').style.display = 'flex';
                
                // Update info
                setInfo('resize', 'info.fileName', file.name, formatBytes(file.size));
                setInfo('resize', 'info.dimensions', img.width, img.height);
                setStatus('resize', 'status.imageUploaded', file.name);
                
                // Update dimension displays
                document.getElementById('original-dimensions').textContent = `${img.width} × ${img.height}`;
                document.getElementById('new-dimensions').textContent = `${img.width} × ${img.height}`;
                
                showSuccess('status.imageUploaded', file.name);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // Dimension inputs with aspect ratio lock
    const widthInput = document.getElementById('resize-width');
    const heightInput = document.getElementById('resize-height');
    const aspectLock = document.getElementById('aspect-ratio-lock');
    
    widthInput.addEventListener('input', () => {
        if (aspectLock.checked && state.resize.aspectRatio) {
            const newWidth = parseInt(widthInput.value, 10);
            if (!isNaN(newWidth)) {
                heightInput.value = Math.round(newWidth / state.resize.aspectRatio);
                updateNewDimensions();
            }
        }
    });
    
    heightInput.addEventListener('input', () => {
        if (aspectLock.checked && state.resize.aspectRatio) {
            const newHeight = parseInt(heightInput.value, 10);
            if (!isNaN(newHeight)) {
                widthInput.value = Math.round(newHeight * state.resize.aspectRatio);
                updateNewDimensions();
            }
        }
    });
    
    function updateNewDimensions() {
        const newWidth = parseInt(widthInput.value, 10) || state.resize.originalWidth;
        const newHeight = parseInt(heightInput.value, 10) || state.resize.originalHeight;
        document.getElementById('new-dimensions').textContent = `${newWidth} × ${newHeight}`;
    }

    // Preset size buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const width = parseInt(btn.getAttribute('data-width'), 10);
            const height = parseInt(btn.getAttribute('data-height'), 10);
            
            widthInput.value = width;
            heightInput.value = height;
            updateNewDimensions();
            
            const message = state.currentLanguage === 'fa' ? 
                `اندازه به ${width} × ${height} تغییر کرد` : 
                `Size changed to ${width} × ${height}`;
            notifications.info(
                translations[state.currentLanguage]['notification.info'],
                message,
                2000
            );
        });
    });

    // Resize button
    document.getElementById('resize-btn').addEventListener('click', async () => {
        if (!state.resize.file || state.isProcessing) return;
        
        const width = parseInt(widthInput.value, 10);
        const height = parseInt(heightInput.value, 10);
        
        if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
            showError('error.invalidDimensions');
            return;
        }
        
        if (width > 10000 || height > 10000) {
            showError('error.invalidDimensions');
            return;
        }
        
        state.isProcessing = true;
        setStatus('resize', 'status.processing');
        
        const resizeBtn = document.getElementById('resize-btn');
        const originalText = resizeBtn.innerHTML;
        resizeBtn.innerHTML = '<div class="loading"></div> ' + (state.currentLanguage === 'fa' ? 'در حال پردازش...' : 'Processing...');
        resizeBtn.disabled = true;

        try {
            const highQuality = document.getElementById('high-quality-resize').checked;
            const processedBlob = await processImage(state.resize.file, { 
                width: width,
                height: height,
                format: state.resize.file.type,
                highQuality: highQuality
            });
            
            const processedUrl = URL.createObjectURL(processedBlob);
            
            // Update preview
            document.getElementById('resize-preview-img').src = processedUrl;
            
            // Update download link
            const downloadLink = document.getElementById('download-resize');
            downloadLink.href = processedUrl;
            downloadLink.download = `resized-${state.resize.file.name}`;
            downloadLink.style.display = 'inline-block';
            
            setStatus('resize', 'status.resizeComplete');
            showSuccess('status.resizeComplete');
            
        } catch (error) {
            console.error('Resize error:', error);
            handleProcessingError(error, 'resize');
        } finally {
            state.isProcessing = false;
            resizeBtn.innerHTML = originalText;
            resizeBtn.disabled = false;
        }
    });

    // -----------------------------------------------------------------------------
    // SECTION: CONVERT PANEL LOGIC
    // -----------------------------------------------------------------------------
    setupUploader('convert-uploader', 'input-convert', (file) => {
        state.convert.file = file;
        state.convert.originalSize = file.size;
        state.convert.originalFormat = file.type;
        
        const objectUrl = URL.createObjectURL(file);
        
        // Update preview
        const previewImg = document.getElementById('convert-preview-img');
        previewImg.src = objectUrl;
        previewImg.style.display = 'block';
        
        // Update UI
        document.getElementById('convert-uploader').style.display = 'none';
        document.getElementById('convert-controls').style.display = 'flex';
        
        // Update info
        setInfo('convert', 'info.fileName', file.name, formatBytes(file.size));
        setInfo('convert', 'info.format', getFormatName(file.type));
        setStatus('convert', 'status.imageUploaded', file.name);
        
        // Update format info
        document.getElementById('current-format').textContent = getFormatName(file.type);
        document.getElementById('format-suggestion').textContent = getFormatSuggestion(file.type);
        
        showSuccess('status.imageUploaded', file.name);
    });

    // Helper functions for format conversion
    function getFormatName(format) {
        const formatNames = {
            'image/jpeg': 'JPEG',
            'image/png': 'PNG',
            'image/webp': 'WebP',
            'image/avif': 'AVIF',
            'image/gif': 'GIF',
            'image/bmp': 'BMP',
            'image/tiff': 'TIFF'
        };
        return formatNames[format] || format;
    }

    function getFormatSuggestion(currentFormat) {
        if (currentFormat === 'image/jpeg' || currentFormat === 'image/png') {
            return state.currentLanguage === 'fa' ? 'WebP برای حجم کمتر' : 'WebP for smaller size';
        }
        return state.currentLanguage === 'fa' ? 'فرمت فعلی مناسب است' : 'Current format is suitable';
    }

    // Format recommendation cards
    document.querySelectorAll('.format-card').forEach(card => {
        card.addEventListener('click', () => {
            const format = card.getAttribute('data-format');
            document.getElementById('convert-type').value = format;
            
            const message = state.currentLanguage === 'fa' ? 
                `فرمت خروجی به ${getFormatName(format)} تغییر کرد` : 
                `Output format changed to ${getFormatName(format)}`;
            notifications.info(
                translations[state.currentLanguage]['notification.info'],
                message,
                2000
            );
        });
    });

    // Convert button
    document.getElementById('convert-btn').addEventListener('click', async () => {
        if (!state.convert.file || state.isProcessing) return;
        
        state.isProcessing = true;
        setStatus('convert', 'status.processing');
        
        const convertBtn = document.getElementById('convert-btn');
        const originalText = convertBtn.innerHTML;
        convertBtn.innerHTML = '<div class="loading"></div> ' + (state.currentLanguage === 'fa' ? 'در حال پردازش...' : 'Processing...');
        convertBtn.disabled = true;

        try {
            const targetFormat = document.getElementById('convert-type').value;
            const processedBlob = await processImage(state.convert.file, { 
                format: targetFormat
            });
            
            const processedUrl = URL.createObjectURL(processedBlob);
            
            // Update preview
            document.getElementById('convert-preview-img').src = processedUrl;
            
            // Update download link
            const downloadLink = document.getElementById('download-convert');
            downloadLink.href = processedUrl;
            const originalName = state.convert.file.name.substring(0, state.convert.file.name.lastIndexOf('.'));
            const extension = targetFormat.split('/')[1];
            downloadLink.download = `converted-${originalName}.${extension}`;
            downloadLink.style.display = 'inline-block';
            
            setStatus('convert', 'status.convertComplete');
            showSuccess('status.convertComplete');
            
        } catch (error) {
            console.error('Conversion error:', error);
            handleProcessingError(error, 'convert');
        } finally {
            state.isProcessing = false;
            convertBtn.innerHTML = originalText;
            convertBtn.disabled = false;
        }
    });

    // -----------------------------------------------------------------------------
    // SECTION: BATCH PANEL LOGIC - IMPROVED QUALITY CONTROL
    // -----------------------------------------------------------------------------
    setupUploader('batch-uploader', 'input-batch', (files) => {
        state.batch.files = files;
        state.batch.totalSize = files.reduce((total, file) => total + file.size, 0);
        
        // Update UI
        document.getElementById('batch-uploader').style.display = 'none';
        document.getElementById('batch-controls').style.display = 'flex';
        document.getElementById('batch-mode-selection').style.display = 'block';
        
        // Update file list and info
        updateBatchFileList();
        
        setStatus('batch', 'status.filesUploaded', files.length);
        showSuccess('status.filesUploaded', files.length);
    }, true);

    function updateBatchFileList() {
        const fileList = document.getElementById('batch-file-list');
        const filesCount = document.getElementById('batch-files-count');
        const totalSize = document.getElementById('batch-total-size');
        
        filesCount.textContent = state.batch.files.length;
        totalSize.textContent = formatBytes(state.batch.totalSize);
        
        fileList.innerHTML = state.batch.files.map((file, index) => `
            <div class="file-list-item">
                <span class="file-index">${index + 1}.</span>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatBytes(file.size)})</span>
            </div>
        `).join('');
        
        // Update estimates
        updateBatchEstimates();
    }

    function updateBatchEstimates() {
        const estimatedTime = document.getElementById('estimated-time');
        const estimatedSavings = document.getElementById('estimated-savings');
        
        const timePerFile = 2000; // 2 seconds per file
        const totalTime = (state.batch.files.length * timePerFile) / 1000;
        
        if (state.currentLanguage === 'fa') {
            estimatedTime.textContent = `~${Math.ceil(totalTime)} ثانیه`;
            estimatedSavings.textContent = '~60%';
        } else {
            estimatedTime.textContent = `~${Math.ceil(totalTime)} seconds`;
            estimatedSavings.textContent = '~60%';
        }
    }

    // Batch mode selection
    document.getElementById('batch-select-compress').addEventListener('click', () => {
        setBatchMode('compress');
    });

    document.getElementById('batch-select-convert').addEventListener('click', () => {
        setBatchMode('convert');
    });

    function setBatchMode(mode) {
        state.batch.mode = mode;
        
        // Update UI
        document.getElementById('batch-mode-selection').style.display = 'none';
        document.getElementById('batch-options-container').style.display = 'block';
        
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Setup dynamic controls
        setupBatchDynamicControls(mode);
        
        const message = state.currentLanguage === 'fa' ? 
            `حالت ${mode === 'compress' ? 'کاهش حجم گروهی' : 'تبدیل فرمت گروهی'} انتخاب شد` : 
            `${mode === 'compress' ? 'Batch compress' : 'Batch convert'} mode selected`;
        notifications.info(
            translations[state.currentLanguage]['notification.info'],
            message,
            2000
        );
    }

    function setupBatchDynamicControls(mode) {
        const dynamicControls = document.getElementById('batch-dynamic-controls');
        
        if (mode === 'compress') {
            dynamicControls.innerHTML = `
                <div class="control-group">
                    <div class="control-header">
                        <label>${state.currentLanguage === 'fa' ? 'میزان فشرده‌سازی' : 'Compression Level'}</label>
                        <span class="quality-value" id="batch-quality-val">80%</span>
                    </div>
                    <div class="slider-container">
                        <input type="range" min="40" max="100" step="5" value="80" id="batch-quality-slider" class="modern-slider">
                        <div class="slider-labels">
                            <span>${state.currentLanguage === 'fa' ? 'حجم کمتر' : 'Smaller Size'}</span>
                            <span>${state.currentLanguage === 'fa' ? 'کیفیت بیشتر' : 'Better Quality'}</span>
                        </div>
                    </div>
                </div>
            `;
            
            const batchQualitySlider = document.getElementById('batch-quality-slider');
            const batchQualityValue = document.getElementById('batch-quality-val');
            
            batchQualitySlider.addEventListener('input', (e) => {
                batchQualityValue.textContent = e.target.value + '%';
            });
            
        } else if (mode === 'convert') {
            dynamicControls.innerHTML = `
                <div class="control-group">
                    <div class="control-item full-width">
                        <label>${state.currentLanguage === 'fa' ? 'فرمت خروجی' : 'Output Format'}</label>
                        <select id="batch-convert-type" class="modern-select">
                            <option value="image/jpeg">JPEG</option>
                            <option value="image/png">PNG</option>
                            <option value="image/webp">WebP</option>
                            <option value="image/avif">AVIF</option>
                        </select>
                    </div>
                </div>
            `;
        }
    }

    // Batch process button - با کنترل دقیق کیفیت
    document.getElementById('batch-process-btn').addEventListener('click', async () => {
        if (state.batch.files.length === 0 || !state.batch.mode || state.isProcessing) return;
        
        state.isProcessing = true;
        setStatus('batch', 'status.processing');
        
        const processBtn = document.getElementById('batch-process-btn');
        const originalText = processBtn.innerHTML;
        processBtn.innerHTML = '<div class="loading"></div> ' + (state.currentLanguage === 'fa' ? 'در حال پردازش...' : 'Processing...');
        processBtn.disabled = true;

        try {
            const zip = new JSZip();
            const options = {};
            
            if (state.batch.mode === 'compress') {
                // استفاده دقیق از مقدار اسلایدر برای کیفیت در پردازش گروهی
                options.quality = parseInt(document.getElementById('batch-quality-slider').value) / 100;
                options.format = 'image/jpeg';
            } else {
                options.format = document.getElementById('batch-convert-type').value;
            }

            let processedCount = 0;
            const totalFiles = state.batch.files.length;

            // Process files with progress
            for (const file of state.batch.files) {
                try {
                    const processedBlob = await processImage(file, options);
                    let newName = file.name;
                    
                    if (state.batch.mode === 'convert') {
                        const extension = options.format.split('/')[1];
                        const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                        newName = `${originalName}.${extension}`;
                    } else {
                        const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
                        newName = `compressed-${originalName}.jpg`;
                    }
                    
                    zip.file(newName, processedBlob);
                    processedCount++;
                    
                    // Update progress
                    const progressText = state.currentLanguage === 'fa' ? 
                        `در حال پردازش... (${processedCount} از ${totalFiles})` : 
                        `Processing... (${processedCount} of ${totalFiles})`;
                    setStatus('batch', progressText);
                    
                } catch (error) {
                    console.error(`Error processing ${file.name}:`, error);
                    // Continue with other files
                }
            }

            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const downloadLink = document.getElementById('download-batch-zip');
            downloadLink.href = URL.createObjectURL(zipBlob);
            downloadLink.download = `PixelKit_Batch_${state.batch.mode}_${new Date().getTime()}.zip`;
            downloadLink.style.display = 'inline-block';
            
            setStatus('batch', 'status.batchComplete', processedCount);
            showSuccess('status.batchComplete', processedCount);
            
        } catch (error) {
            console.error('Batch processing error:', error);
            handleProcessingError(error, 'batch');
        } finally {
            state.isProcessing = false;
            processBtn.innerHTML = originalText;
            processBtn.disabled = false;
        }
    });

    // -----------------------------------------------------------------------------
    // SECTION: Initialize Application
    // -----------------------------------------------------------------------------
    function initialize() {
        // Wire up reset buttons
        document.querySelectorAll('[id^=reset-]').forEach(btn => {
            const panelId = btn.id.replace('reset-', '').replace('-btn','');
            btn.addEventListener('click', () => resetUI(panelId));
        });

        // Set initial language
        const savedLanguage = localStorage.getItem('language') || 'fa';
        document.getElementById('lang-switcher').value = savedLanguage;
        setLanguage(savedLanguage);
        
        // Activate first panel
        document.querySelector('.tab-btn.active').click();
        
        // Set initial status
        setStatus('compress', 'status.ready');
        
        console.log('🚀 PixelKit initialized successfully');
        console.log('📧 Contact: ali.1600.ashrafi@gmail.com');
    }

    // Start the application
    initialize();
});