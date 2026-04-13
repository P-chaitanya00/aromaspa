document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Early declarations for admin system (defined fully later)
    var isAdminAuth = sessionStorage.getItem('aromaAdmin') === 'true';
    var openAdminPinModal; // assigned in ADMIN PIN SYSTEM section

    // ═══ TREATMENT PRICING DATA ═══
    const treatmentPricing = {
        'Balinese Massage': [
            { duration: '60 MIN', price: '₹3,500' },
            { duration: '90 MIN', price: '₹4,500' },
            { duration: '120 MIN', price: '₹5,500' }
        ],
        'Aroma Therapy (Hot Oil)': [
            { duration: '60 MIN', price: '₹3,500' },
            { duration: '90 MIN', price: '₹4,500' },
            { duration: '120 MIN', price: '₹5,500' }
        ],
        'Body Scrub + Oil Therapy': [
            { duration: '60 MIN', price: '₹4,000' },
            { duration: '90 MIN', price: '₹5,000' },
            { duration: '120 MIN', price: '₹6,000' }
        ],
        'Wine': [
            { duration: '90 MIN', price: '₹12,000' },
            { duration: '120 MIN', price: '₹15,000' }
        ],
        'VIP Rooms': [
            { duration: '60 MIN', price: '₹5,500' },
            { duration: '90 MIN', price: '₹7,500' },
            { duration: '120 MIN', price: '₹9,000' }
        ],
        'VVIP Rooms': [
            { duration: '60 MIN', price: '₹8,000' },
            { duration: '90 MIN', price: '₹11,000' },
            { duration: '120 MIN', price: '₹15,000' }
        ],
        'Turkish Hammam': [
            { duration: '60 MIN', price: '₹6,000' },
            { duration: '90 MIN', price: '₹9,000' },
            { duration: '120 MIN', price: '₹12,000' }
        ],
        'Basic Package': [
            { duration: 'Full Session', price: '₹35,000' }
        ],
        'Couple Package': [
            { duration: 'Full Session', price: '₹50,000' }
        ],
        'Friends Package': [
            { duration: 'Full Session', price: '₹1,00,000' }
        ]
    };

    // Helper: populate duration dropdown from treatment selection
    function populateDuration(treatmentVal, durationSelect, priceInput) {
        durationSelect.innerHTML = '<option value="" disabled selected hidden></option>';
        priceInput.value = '';
        const options = treatmentPricing[treatmentVal];
        if (!options || !options.length) {
            durationSelect.disabled = true;
            return;
        }
        options.forEach(opt => {
            const o = document.createElement('option');
            o.value = opt.duration;
            o.textContent = opt.duration;
            o.dataset.price = opt.price;
            durationSelect.appendChild(o);
        });
        durationSelect.disabled = false;
        // Auto-select if only one option
        if (options.length === 1) {
            durationSelect.selectedIndex = 1;
            priceInput.value = options[0].price;
        }
    }

    // Helper: set price from selected duration
    function setPrice(durationSelect, priceInput) {
        const selected = durationSelect.options[durationSelect.selectedIndex];
        if (selected && selected.dataset.price) {
            priceInput.value = selected.dataset.price;
        }
    }

    // Wire up MAIN booking form
    const bTreat = document.getElementById('b-treat');
    const bDuration = document.getElementById('b-duration');
    const bPrice = document.getElementById('b-price');
    if (bTreat && bDuration && bPrice) {
        bTreat.addEventListener('change', () => populateDuration(bTreat.value, bDuration, bPrice));
        bDuration.addEventListener('change', () => setPrice(bDuration, bPrice));
    }

    // Wire up BRANCH booking form
    const bpTreat = document.getElementById('bp-b-treat');
    const bpDuration = document.getElementById('bp-b-duration');
    const bpPrice = document.getElementById('bp-b-price');
    if (bpTreat && bpDuration && bpPrice) {
        bpTreat.addEventListener('change', () => populateDuration(bpTreat.value, bpDuration, bpPrice));
        bpDuration.addEventListener('change', () => setPrice(bpDuration, bpPrice));
    }

    // ═══ PRELOADER ═══
    window.addEventListener('load', () => {
        gsap.to('#preloader', {
            opacity: 0,
            duration: 0.8,
            delay: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                document.getElementById('preloader').classList.add('done');
                heroReveal();
            }
        });
    });

    // Fallback: remove preloader after 3s
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader && !preloader.classList.contains('done')) {
            preloader.classList.add('done');
            heroReveal();
        }
    }, 3000);

    // ═══ NAVBAR ═══
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;
    let navbarTicking = false;
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!navbarTicking) {
            requestAnimationFrame(() => {
                navbar.classList.toggle('scrolled', lastScrollY > 80);
                navbarTicking = false;
            });
            navbarTicking = true;
        }
    }, { passive: true });

    // ═══ MOBILE MENU ═══
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            const spans = menuToggle.querySelectorAll('span');
            if (mobileMenu.classList.contains('active')) {
                gsap.to(spans[0], { rotate: 45, y: 3.5, duration: 0.3 });
                gsap.to(spans[1], { rotate: -45, y: -3.5, duration: 0.3 });
            } else {
                gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3 });
            }
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                gsap.to(menuToggle.querySelectorAll('span'), { rotate: 0, y: 0, duration: 0.3 });
            });
        });
    }

    // ═══ HERO REVEAL ═══
    function heroReveal() {
        const tl = gsap.timeline();
        tl.from('.hero-bg img', { duration: 2, scale: 1.05, ease: 'power2.out' })
            .from('.hero-badge', { opacity: 0, y: 30, duration: 1, ease: 'power4.out' }, '-=2')
            .from('h1 .line', {
                y: '110%', opacity: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out'
            }, '-=1.5')
            .from('.hero-content p', { opacity: 0, y: 40, duration: 1, ease: 'power3.out' }, '-=0.6')
            .from('.hero-actions', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
            .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=0.5');
    }

    // ═══ SCROLL ANIMATIONS ═══
    // About Section
    gsap.from('.img-1', {
        x: -80, opacity: 0, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 70%' }
    });
    gsap.from('.img-2', {
        x: 80, opacity: 0, duration: 1.5, delay: 0.3, ease: 'power3.out',
        scrollTrigger: { trigger: '#about', start: 'top 70%' }
    });
    gsap.from('.about-content', {
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-content', start: 'top 80%' }
    });
    gsap.from('.feat', {
        x: 40, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-features', start: 'top 85%' }
    });



    // CTA Banner
    gsap.from('.cta-inner', {
        y: 60, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: '.cta-banner', start: 'top 70%' }
    });

    // Stats Ticker
    gsap.from('.stats-ticker', {
        opacity: 0, duration: 1,
        scrollTrigger: { trigger: '.stats-ticker', start: 'top 95%' }
    });

    // ═══ RITUAL CIRCLES — CLICK TO OPEN DETAIL ═══
    const ritualData = [
        { num: '01', title: 'Holistic Stone Massage', desc: 'Warm volcanic stones melt away tension as aromatic oils realign your energy. Our master therapists bring ancient healing wisdom from Bali for complete rejuvenation of body and soul.', price: '$210', duration: '90 Min', img: 'assets/massage.png' },
        { num: '02', title: 'Radiance Gold Facial', desc: '24K gold-infused serums combined with advanced lifting techniques for luminous, youthful skin. Includes deep cleansing, exfoliation, and a luxurious gold mask treatment.', price: '$185', duration: '60 Min', img: 'assets/facial.png' },
        { num: '03', title: 'Infrared Detox Chamber', desc: 'Cedar-lined infrared therapy room with eucalyptus steam and himalayan salt walls. Deeply purifies the body, boosts circulation, and promotes natural healing and recovery.', price: '$320', duration: '120 Min', img: 'assets/sauna.png' },
        { num: '04', title: 'Aromatherapy Ritual', desc: 'A bespoke blend of rare essential oils paired with gentle pressure-point healing. Each session is custom-designed based on your body\'s unique needs and emotional state.', price: '$175', duration: '75 Min', img: 'assets/aromatherapy.png' },
        { num: '05', title: 'Gold Body Polish', desc: 'Full-body exfoliation with 24K gold particles and organic sugar crystals, followed by a hydrating body wrap. Leaves skin silky smooth with a radiant golden glow.', price: '$240', duration: '60 Min', img: 'assets/bodyscrub.png' }
    ];

    const circles = document.querySelectorAll('.ritual-circle');
    const detailPanel = document.getElementById('ritual-detail');
    const rdClose = document.querySelector('.rd-close');

    function openRitual(idx) {
        const data = ritualData[idx];
        document.querySelector('.rd-number').textContent = data.num;
        document.getElementById('rd-title').textContent = data.title;
        document.getElementById('rd-desc').textContent = data.desc;
        document.getElementById('rd-price').textContent = data.price;
        document.getElementById('rd-duration').textContent = data.duration;
        document.getElementById('rd-img').src = data.img;

        circles.forEach(c => c.classList.remove('active'));
        circles[idx].classList.add('active');

        detailPanel.classList.add('open');
        gsap.fromTo(detailPanel,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        );
    }

    circles.forEach(circle => {
        circle.addEventListener('click', () => {
            const idx = parseInt(circle.dataset.idx);
            openRitual(idx);
        });
    });

    if (rdClose) {
        rdClose.addEventListener('click', () => {
            gsap.to(detailPanel, {
                opacity: 0, y: 20, duration: 0.3, ease: 'power2.in',
                onComplete: () => detailPanel.classList.remove('open')
            });
        });
    }

    // ═══ PARALLAX (ScrollTrigger-based for smooth performance) ═══
    gsap.to('.hero-bg img', {
        y: () => window.innerHeight * 0.3,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    // ═══ MODAL ═══
    const modal = document.getElementById('booking-modal');
    const openBtns = document.querySelectorAll('.open-booking');
    const closeBtn = modal ? modal.querySelector('.close-modal') : null;
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;

    function openModal() {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        gsap.from('#booking-modal .modal-content', { y: 60, opacity: 0, duration: 0.7, ease: 'power4.out' });
    }
    function closeModal() {
        if (!modal) return;
        gsap.to('#booking-modal .modal-content', {
            y: 40, opacity: 0, duration: 0.4, ease: 'power2.in',
            onComplete: () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                gsap.set('#booking-modal .modal-content', { clearProps: 'all' });
            }
        });
    }

    openBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);



    // ═══ PARTNERSHIP MODAL ═══
    const pModal = document.getElementById('partnership-modal');
    const pOpenBtns = document.querySelectorAll('.open-partnership');
    const pCloseBtn = document.querySelector('.p-close');
    const pOverlay = document.querySelector('.p-overlay');
    const pPrevSelect = document.getElementById('p-prev');
    const pWhichWrap = document.getElementById('p-which-wrap');

    function openPModal() {
        pModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        gsap.from('#partnership-modal .modal-content', { y: 60, opacity: 0, duration: 0.7, ease: 'power4.out' });
    }
    function closePModal() {
        gsap.to('#partnership-modal .modal-content', {
            y: 40, opacity: 0, duration: 0.4, ease: 'power2.in',
            onComplete: () => {
                pModal.classList.remove('active');
                document.body.style.overflow = '';
                gsap.set('#partnership-modal .modal-content', { clearProps: 'all' });
            }
        });
    }

    pOpenBtns.forEach(btn => btn.addEventListener('click', openPModal));
    if (pCloseBtn) pCloseBtn.addEventListener('click', closePModal);
    if (pOverlay) pOverlay.addEventListener('click', closePModal);

    if (pPrevSelect) {
        pPrevSelect.addEventListener('change', (e) => {
            pWhichWrap.style.display = e.target.value === 'yes' ? 'block' : 'none';
        });
    }

    const pForm = document.getElementById('partnership-form');
    if (pForm) {
        pForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const email = document.getElementById('p-email').value;
            const phone = document.getElementById('p-phone').value;
            const loc = document.getElementById('p-loc').value;
            const pType = document.getElementById('p-type').value;
            const biz = document.getElementById('p-biz').value;
            const exp = document.getElementById('p-exp').value;
            const city = document.getElementById('p-city').value;
            const prop = document.getElementById('p-prop').value;
            const space = document.getElementById('p-space').value;
            const budget = document.getElementById('p-budget').value;
            const timeline = document.getElementById('p-timeline').value;
            const funding = document.getElementById('p-funding').value;
            const prev = document.getElementById('p-prev').value;
            const which = document.getElementById('p-which').value;
            const source = document.getElementById('p-source').value;
            const contact = document.getElementById('p-contact').value;
            const msg = document.getElementById('p-msg').value;

            const message = `*AROMA INTERNATIONAL SPA*\n` +
                `*Partnership Inquiry*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n\n` +
                `*PERSONAL DETAILS*\n` +
                `Name : ${name}\n` +
                `Email : ${email}\n` +
                `Phone : ${phone}\n` +
                `Location : ${loc}\n\n` +
                `*PARTNERSHIP DETAILS*\n` +
                `Type : ${pType}\n` +
                `Existing Business : ${biz || 'None'}\n` +
                `Experience : ${exp}\n` +
                `Proposed City : ${city}\n` +
                `Property Status : ${prop}\n` +
                `Available Space : ${space}\n\n` +
                `*INVESTMENT DETAILS*\n` +
                `Budget Range : ${budget}\n` +
                `Timeline : ${timeline}\n` +
                `Funding Source : ${funding}\n\n` +
                `*ADDITIONAL INFO*\n` +
                `Previous Partnership : ${prev}${prev === 'yes' ? ' - ' + which : ''}\n` +
                `Referred By : ${source || 'Not specified'}\n` +
                `Best Time to Reach : ${contact || 'Not specified'}\n` +
                `Message : ${msg || 'Not specified'}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `I am interested in partnering with Aroma International Spa. Kindly share the details. Thank you.`;

            const encoded = encodeURIComponent(message);
            const waUrl = `https://wa.me/917378122122?text=${encoded}&lang=en`;
            window.open(waUrl, '_blank');

            pForm.innerHTML = `
                <div style="text-align:center;padding:4rem 0;">
                    <div style="width:60px;height:60px;border:2px solid var(--gold);border-radius:50%;margin:0 auto 2rem;display:flex;align-items:center;justify-content:center;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <h2 style="font-family:var(--serif);font-size:2rem;font-weight:300;margin-bottom:1rem;">Inquiry <em style="color:var(--gold)">Sent</em></h2>
                    <p style="color:var(--text);font-weight:300;">Our partnership team will contact you shortly.</p>
                </div>`;
            setTimeout(closePModal, 3500);
        });
    }

    // ═══ PROMO GALLERY SYSTEM (Cloud) ═══
    const PROMO_CLOUD_URL = 'https://api.npoint.io/2325129d3c35bc41baad';
    const MAX_PROMO_IMAGES = 20;
    let promoImages = [];

    async function fetchPromoImages() {
        try {
            const res = await fetch(PROMO_CLOUD_URL);
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.images)) {
                    promoImages = data.images;
                    return;
                }
            }
        } catch (e) { /* fallback */ }
        promoImages = [];
    }

    async function savePromoImages() {
        try {
            await fetch(PROMO_CLOUD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ images: promoImages })
            });
        } catch (e) { console.warn('Promo gallery cloud sync failed', e); }
    }

    const promoGrid = document.getElementById('promo-gallery-grid');
    const promoAddBtn = document.getElementById('promo-add-btn');
    const promoImgUpload = document.getElementById('promo-img-upload');

    function renderPromoGallery() {
        if (!promoGrid) return;
        promoGrid.innerHTML = '';
        if (!promoImages.length) {
            promoGrid.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.3); grid-column:1/-1; padding:2rem 0; font-size:0.9rem;">No photos yet. Add some!</p>';
            return;
        }
        promoImages.forEach((imgData, idx) => {
            const div = document.createElement('div');
            div.className = 'promo-gallery-item';
            div.innerHTML = `
                <img src="${imgData}" alt="Promo ${idx + 1}" loading="lazy">
                <button class="promo-gallery-del" data-idx="${idx}" title="Delete">&times;</button>
            `;
            promoGrid.appendChild(div);
        });

        // Delete handlers - PIN gated
        promoGrid.querySelectorAll('.promo-gallery-del').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.idx);
                pendingPromoDeleteIdx = idx;
                if (isAdminAuth) {
                    executePromoDelete();
                } else {
                    openAdminPinModal(executePromoDelete);
                }
            });
        });
    }

    let pendingPromoDeleteIdx = null;

    function executePromoDelete() {
        if (pendingPromoDeleteIdx !== null && pendingPromoDeleteIdx < promoImages.length) {
            promoImages.splice(pendingPromoDeleteIdx, 1);
            savePromoImages();
            renderPromoGallery();
        }
        pendingPromoDeleteIdx = null;
    }

    function compressPromoImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const max = 800;
                    let w = img.width, h = img.height;
                    if (w > h && w > max) { h = h * max / w; w = max; }
                    else if (h > max) { w = w * max / h; h = max; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.82));
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    // Add button - PIN gated
    if (promoAddBtn && promoImgUpload) {
        promoAddBtn.addEventListener('click', () => {
            if (isAdminAuth) {
                promoImgUpload.click();
            } else {
                openAdminPinModal(() => promoImgUpload.click());
            }
        });

        promoImgUpload.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            const remaining = MAX_PROMO_IMAGES - promoImages.length;
            if (remaining <= 0) {
                alert(`Maximum ${MAX_PROMO_IMAGES} photos allowed.`);
                promoImgUpload.value = '';
                return;
            }
            const toAdd = files.slice(0, remaining);
            for (const file of toAdd) {
                const compressed = await compressPromoImage(file);
                promoImages.push(compressed);
            }
            await savePromoImages();
            renderPromoGallery();
            promoImgUpload.value = '';
        });
    }

    // Init promo gallery
    fetchPromoImages().then(() => renderPromoGallery());

    // ═══ FRANCHISE QUICK FORM ═══
    const fqForm = document.getElementById('franchise-quick-form');
    if (fqForm) {
        fqForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fq-name').value.trim();
            const phone = document.getElementById('fq-phone').value.trim();
            const address = document.getElementById('fq-address').value.trim();
            const type = document.getElementById('fq-type').value;
            const budget = document.getElementById('fq-budget').value;

            const msg =
`*AROMA INTERNATIONAL SPA*
*Franchise Enquiry*
━━━━━━━━━━━━━━━━━━━━

Name    : ${name}
Phone   : ${phone}
Address : ${address}
Type    : ${type}
Budget  : ${budget}

━━━━━━━━━━━━━━━━━━━━
I am interested in the franchise opportunity. Please contact me. Thank you!`;

            window.open(`https://wa.me/917378122122?text=${encodeURIComponent(msg)}`, '_blank');

            fqForm.innerHTML = `
                <div style="text-align:center;padding:2rem 0;">
                    <div style="width:50px;height:50px;border:2px solid var(--gold);border-radius:50%;margin:0 auto 1.2rem;display:flex;align-items:center;justify-content:center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <h3 style="font-family:var(--serif);font-size:1.5rem;font-weight:300;margin-bottom:0.5rem;">Enquiry <em style="color:var(--gold)">Sent</em></h3>
                    <p style="color:rgba(255,255,255,0.5);font-size:0.9rem;font-weight:300;">Our franchise team will contact you shortly.</p>
                </div>`;
        });
    }
    // Form submit — route to correct WhatsApp number based on branch
    const form = document.getElementById('appointment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('b-name').value;
            const phone = document.getElementById('b-phone').value;
            const date = document.getElementById('b-date').value;
            const time = document.getElementById('b-time').value;
            const loc = document.getElementById('b-loc').value;
            const treatment = document.getElementById('b-treat').value;

            // Determine WhatsApp number based on selected branch
            let waNumber = '917375001008'; // default Guntur
            if (loc && loc.toLowerCase().includes('hyderabad')) {
                waNumber = '919122218885';
            }

            const duration = document.getElementById('b-duration').value;
            const price = document.getElementById('b-price').value;

            const message = `*AROMA INTERNATIONAL SPA*\n` +
                `*Appointment Request*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Branch : ${loc}\n` +
                `Name : ${name}\n` +
                `Phone : ${phone}\n` +
                `Date : ${date}\n` +
                `Time : ${time}\n` +
                `Treatment : ${treatment || 'Not specified'}\n` +
                `Duration : ${duration || 'Not specified'}\n` +
                `Price : ${price || 'Not specified'}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `I would like to book an appointment. Kindly confirm the availability. Thank you.`;

            const encoded = encodeURIComponent(message);
            const waUrl = `https://wa.me/${waNumber}?text=${encoded}&lang=en`;
            window.open(waUrl, '_blank');

            form.innerHTML = `
                <div style="text-align:center;padding:4rem 0;">
                    <div style="width:60px;height:60px;border:2px solid var(--gold);border-radius:50%;margin:0 auto 2rem;display:flex;align-items:center;justify-content:center;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </div>
                    <h2 style="font-family:var(--serif);font-size:2rem;font-weight:300;margin-bottom:1rem;">Reservation <em style="color:var(--gold)">Confirmed</em></h2>
                    <p style="color:var(--text);font-weight:300;">Our concierge will reach out shortly to curate your experience.</p>
                </div>`;
            setTimeout(closeModal, 3500);
        });
    }

    // ═══ BRANCH POPUP ═══
    const branchData = [
        {
            num: '01',
            name: 'Guntur',
            tagline: 'Main Branch',
            address: 'SP Plaza, Above Max, 4th Floor, Vidya Nagar, Guntur',
            hours: 'Mon – Sun: 10:30 AM – 9:30 PM',
            phone: '7375001008',
            whatsapp: '917375001008',
            mapLink: 'https://maps.app.goo.gl/8SSfJAcMnbuKnVAy7',
            img: 'assets/branch_downtown.png',
            services: [
                'Balinese Massage',
                'Aroma Therapy (Hot Oil)',
                'Body Scrub + Oil Therapy',
                'Wine',
                'VIP Rooms',
                'VVIP Rooms',
                'Turkish Hammam',
                'Basic Package',
                'Couple Package',
                'Friends Package'
            ]
        },
        {
            num: '02',
            name: 'Hyderabad',
            tagline: 'Kondapur | 2nd Branch',
            address: 'M-Square, 2nd Floor, Gold\'s Gym Below, Raghavendra Colony, HT Line Rd, Kondapur',
            hours: 'Mon – Sun: 10:30 AM – 9:30 PM',
            phone: '9122218885',
            whatsapp: '919122218885',
            mapLink: 'https://maps.app.goo.gl/Xneetf4K2DiRv6Vy8',
            img: 'assets/branch_harbor.png',
            services: [
                'Balinese Massage',
                'Aroma Therapy (Hot Oil)',
                'Body Scrub + Oil Therapy',
                'Wine',
                'VIP Rooms',
                'VVIP Rooms',
                'Turkish Hammam',
                'Basic Package',
                'Couple Package',
                'Friends Package'
            ]
        }
    ];

    const branchPopup = document.getElementById('branch-popup');
    const branchCards = document.querySelectorAll('.branch-card');
    let currentBranchIdx = 0;

    function openBranchPopup(idx) {
        currentBranchIdx = idx;
        const data = branchData[idx];

        // Populate popup content
        document.querySelector('.bp-num').textContent = data.num;
        document.getElementById('bp-name').textContent = data.name;
        document.getElementById('bp-tagline').textContent = data.tagline;
        document.getElementById('bp-img').src = data.img;
        const addressEl = document.getElementById('bp-address');
        addressEl.textContent = data.address;
        addressEl.href = data.mapLink;
        addressEl.target = '_blank';
        document.getElementById('bp-hours').textContent = data.hours;
        document.getElementById('bp-phone').textContent = data.phone;


        // Populate treatment dropdown
        const treatSelect = document.getElementById('bp-b-treat');
        treatSelect.innerHTML = '<option value="" disabled selected hidden></option>';
        data.services.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s;
            opt.textContent = s;
            treatSelect.appendChild(opt);
        });

        // Show popup
        branchPopup.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate in (fast, no blur)
        gsap.fromTo('.branch-popup-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo('.branch-popup-panel',
            { opacity: 0, scale: 0.95, xPercent: -50, yPercent: -48 },
            { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 0.25, ease: 'power2.out' }
        );

        // Render gallery images for this branch
        renderGalleryStack();
        updateAddBtnState();
    }

    function closeBranchPopup() {
        gsap.to('.branch-popup-panel', {
            opacity: 0, scale: 0.95, xPercent: -50, yPercent: -48, duration: 0.2, ease: 'power2.in'
        });
        gsap.to('.branch-popup-backdrop', {
            opacity: 0, duration: 0.2,
            onComplete: () => {
                branchPopup.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Branch card click handlers
    branchCards.forEach(card => {
        card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.branch);
            openBranchPopup(idx);
        });
    });

    // Close popup handlers
    const bpClose = document.querySelector('.branch-popup-close');
    const bpBackdrop = document.querySelector('.branch-popup-backdrop');
    if (bpClose) bpClose.addEventListener('click', closeBranchPopup);
    if (bpBackdrop) bpBackdrop.addEventListener('click', closeBranchPopup);

    // Branch booking form — WhatsApp redirect
    const branchForm = document.getElementById('branch-booking-form');
    if (branchForm) {
        branchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = branchData[currentBranchIdx];
            const name = document.getElementById('bp-b-name').value;
            const phone = document.getElementById('bp-b-phone').value;
            const date = document.getElementById('bp-b-date').value;
            const time = document.getElementById('bp-b-time').value;
            const treatment = document.getElementById('bp-b-treat').value;

            const duration = document.getElementById('bp-b-duration').value;
            const price = document.getElementById('bp-b-price').value;

            const message = `*AROMA INTERNATIONAL SPA*\n` +
                `*Appointment Request*\n` +
                `━━━━━━━━━━━━━━━━━━━━\n\n` +
                `Branch : ${data.name} - ${data.tagline}\n` +
                `Name : ${name}\n` +
                `Phone : ${phone}\n` +
                `Date : ${date}\n` +
                `Time : ${time}\n` +
                `Treatment : ${treatment}\n` +
                `Duration : ${duration || 'Not specified'}\n` +
                `Price : ${price || 'Not specified'}\n\n` +
                `━━━━━━━━━━━━━━━━━━━━\n` +
                `I would like to book an appointment. Kindly confirm the availability. Thank you.`;

            const encoded = encodeURIComponent(message);
            const waUrl = `https://wa.me/${data.whatsapp}?text=${encoded}&lang=en`;
            window.open(waUrl, '_blank');
        });
    }

    // ═══ BRANCH GALLERY SYSTEM ═══
    const addImgBtn = document.getElementById('bp-add-img-btn');
    const imgUpload = document.getElementById('bp-img-upload');
    const galleryPreview = document.getElementById('bp-gallery-preview');
    const galleryStack = document.getElementById('bp-gallery-stack');
    const galleryLightbox = document.getElementById('gallery-lightbox');
    const galleryLbImg = document.getElementById('gallery-lb-img');
    const galleryLbIdx = document.getElementById('gallery-lb-idx');
    const galleryLbTotal = document.getElementById('gallery-lb-total');
    const galleryLbClose = document.querySelector('.gallery-lb-close');
    const galleryLbBackdrop = document.querySelector('.gallery-lb-backdrop');
    const galleryLbPrev = document.querySelector('.gallery-lb-prev');
    const galleryLbNext = document.querySelector('.gallery-lb-next');
    let currentGalleryImages = [];
    let currentLbIdx = 0;

    // Cloud storage endpoints for gallery images (npoint.io)
    const GALLERY_BINS = {
        0: 'https://api.npoint.io/f740f07f1434ba3f80fe',  // Guntur
        1: 'https://api.npoint.io/db936c8b627b6ccc351e'   // Hyderabad
    };

    // Local cache for instant display
    let galleryCache = { 0: null, 1: null };

    function getBranchImages(branchIdx) {
        // Return from cache if loaded
        if (galleryCache[branchIdx] !== null) return galleryCache[branchIdx];
        // Fallback to localStorage while cloud loads
        const stored = localStorage.getItem(`aromaBranchImages_${branchIdx}`);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { /* ignore */ }
        }
        return [];
    }

    function saveBranchImages(branchIdx, images) {
        // Save to localStorage (instant cache)
        localStorage.setItem(`aromaBranchImages_${branchIdx}`, JSON.stringify(images));
        galleryCache[branchIdx] = images;
        // Save to cloud (persistent for all devices)
        const url = GALLERY_BINS[branchIdx];
        if (url) {
            const payload = JSON.stringify({ images: images });
            console.log('Cloud save payload size:', (payload.length / 1024).toFixed(1), 'KB for branch', branchIdx);
            fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: payload
            }).then(resp => {
                if (!resp.ok) {
                    return resp.text().then(txt => {
                        console.error('Cloud save failed:', resp.status, txt);
                        showImageToast('⚠️ Cloud sync error ' + resp.status + '. Saved locally.');
                    });
                } else {
                    console.log('Cloud save OK for branch', branchIdx);
                }
            }).catch(err => {
                console.warn('Cloud save network error:', err);
                showImageToast('⚠️ Network error. Images saved locally.');
            });
        }
    }

    // Load gallery from cloud on page load
    function loadCloudGallery(branchIdx) {
        const url = GALLERY_BINS[branchIdx];
        if (!url) return;
        fetch(url)
            .then(r => {
                if (!r.ok) {
                    console.error('Cloud load HTTP error for branch', branchIdx, ':', r.status);
                    return null;
                }
                return r.json();
            })
            .then(data => {
                if (!data) return;
                if (data && Array.isArray(data.images)) {
                    const localImages = getBranchImages(branchIdx);
                    console.log('Cloud load branch', branchIdx, ':', data.images.length, 'cloud images,', localImages.length, 'local images');
                    // Only update if cloud has data (don't overwrite local with empty cloud)
                    if (data.images.length > 0 || localImages.length === 0) {
                        galleryCache[branchIdx] = data.images;
                        localStorage.setItem(`aromaBranchImages_${branchIdx}`, JSON.stringify(data.images));
                    } else if (localImages.length > 0 && data.images.length === 0) {
                        // Local has images but cloud is empty — push local to cloud
                        console.log('Local has images but cloud empty for branch', branchIdx, '— syncing to cloud...');
                        saveBranchImages(branchIdx, localImages);
                    }
                    // Re-render if this branch popup is currently open
                    if (branchPopup.classList.contains('active') && currentBranchIdx === branchIdx) {
                        renderGalleryStack();
                        updateAddBtnState();
                    }
                }
            })
            .catch(err => console.warn('Cloud load failed for branch', branchIdx, ':', err));
    }
    // Pre-load both branches from cloud
    loadCloudGallery(0);
    loadCloudGallery(1);

    function renderGalleryStack() {
        const images = getBranchImages(currentBranchIdx);
        if (!galleryStack || !galleryPreview) return;
        galleryStack.innerHTML = '';

        if (images.length === 0) {
            galleryPreview.classList.remove('has-images');
            return;
        }

        galleryPreview.classList.add('has-images');

        // Show up to 3 stacked items
        const showCount = Math.min(images.length, 3);
        for (let i = 0; i < showCount; i++) {
            const div = document.createElement('div');
            div.className = 'bp-gallery-stack-item';
            const img = document.createElement('img');
            img.src = images[i];
            img.alt = `Branch photo ${i + 1}`;
            div.appendChild(img);
            galleryStack.appendChild(div);
        }

        // Badge showing count
        if (images.length > 1) {
            const badge = document.createElement('div');
            badge.className = 'bp-gallery-stack-badge';
            badge.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><span>${images.length} Photos</span>`;
            galleryStack.appendChild(badge);
        }

        // Click stack → open lightbox (use event delegation, not re-binding)
        galleryStack.onclick = (e) => {
            if (e.target.closest('.bp-gallery-stack-delete')) return;
            openGalleryLightbox(0);
        };
    }

    // ═══ MAX 25 IMAGES PER BRANCH ═══
    const MAX_BRANCH_IMAGES = 25;

    // Toast notification for image limit
    function showImageToast(msg) {
        let toast = document.getElementById('img-limit-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'img-limit-toast';
            toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#1a1a1a,#2a2a2a);color:#fff;padding:14px 28px;border-radius:12px;font-family:var(--sans);font-size:0.9rem;z-index:99999;opacity:0;transition:opacity 0.4s;border:1px solid rgba(200,169,81,0.3);box-shadow:0 8px 32px rgba(0,0,0,0.5);text-align:center;max-width:90vw;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
    }

    // Update add-button visibility based on image count
    function updateAddBtnState() {
        if (!addImgBtn) return;
        const images = getBranchImages(currentBranchIdx);
        if (images.length >= MAX_BRANCH_IMAGES) {
            addImgBtn.style.opacity = '0.4';
            addImgBtn.style.pointerEvents = 'none';
            addImgBtn.title = `Maximum ${MAX_BRANCH_IMAGES} photos reached`;
        } else {
            addImgBtn.style.opacity = '';
            addImgBtn.style.pointerEvents = '';
            addImgBtn.title = `Add Photos (${images.length}/${MAX_BRANCH_IMAGES})`;
        }
    }

    // Upload button click — PIN protected
    if (addImgBtn && imgUpload) {
        addImgBtn.addEventListener('click', () => {
            const images = getBranchImages(currentBranchIdx);
            if (images.length >= MAX_BRANCH_IMAGES) {
                showImageToast(`⚠️ Maximum ${MAX_BRANCH_IMAGES} photos allowed per branch. Delete some to add new ones.`);
                return;
            }
            // Require PIN before allowing image upload
            if (!isAdminAuth) {
                openAdminPinModal(() => {
                    imgUpload.click();
                });
                return;
            }
            imgUpload.click();
        });

        imgUpload.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const images = getBranchImages(currentBranchIdx);
            const remaining = MAX_BRANCH_IMAGES - images.length;

            if (remaining <= 0) {
                showImageToast(`⚠️ Maximum ${MAX_BRANCH_IMAGES} photos allowed. Delete some to add new ones.`);
                imgUpload.value = '';
                return;
            }

            // Only take as many files as slots remaining
            const filesToProcess = files.slice(0, remaining);
            if (files.length > remaining) {
                showImageToast(`📸 Only ${remaining} more photo${remaining > 1 ? 's' : ''} allowed. Uploading first ${remaining}.`);
            }

            let loaded = 0;

            filesToProcess.forEach(file => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    // Compress before saving
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const maxSize = 800;
                        let w = img.width, h = img.height;
                        if (w > h && w > maxSize) { h = h * maxSize / w; w = maxSize; }
                        else if (h > maxSize) { w = w * maxSize / h; h = maxSize; }
                        canvas.width = w;
                        canvas.height = h;
                        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                        const compressed = canvas.toDataURL('image/jpeg', 0.82);
                        images.push(compressed);
                        loaded++;
                        if (loaded === filesToProcess.length) {
                            saveBranchImages(currentBranchIdx, images);
                            renderGalleryStack();
                            updateAddBtnState();
                            showImageToast(`✅ ${loaded} photo${loaded > 1 ? 's' : ''} added! (${images.length}/${MAX_BRANCH_IMAGES})`);
                        }
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            });

            imgUpload.value = '';
        });
    }

    // Gallery Lightbox
    function openGalleryLightbox(idx) {
        currentGalleryImages = getBranchImages(currentBranchIdx);
        if (!currentGalleryImages.length) return;
        currentLbIdx = idx;
        updateLightboxImage();
        galleryLightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeGalleryLightbox() {
        galleryLightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        if (!galleryLbImg) return;
        galleryLbImg.src = currentGalleryImages[currentLbIdx];
        if (galleryLbIdx) galleryLbIdx.textContent = currentLbIdx + 1;
        if (galleryLbTotal) galleryLbTotal.textContent = currentGalleryImages.length;
    }

    if (galleryLbClose) galleryLbClose.addEventListener('click', closeGalleryLightbox);
    if (galleryLbBackdrop) galleryLbBackdrop.addEventListener('click', closeGalleryLightbox);

    if (galleryLbPrev) {
        galleryLbPrev.addEventListener('click', () => {
            currentLbIdx = (currentLbIdx - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            updateLightboxImage();
        });
    }
    if (galleryLbNext) {
        galleryLbNext.addEventListener('click', () => {
            currentLbIdx = (currentLbIdx + 1) % currentGalleryImages.length;
            updateLightboxImage();
        });
    }

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!galleryLightbox || !galleryLightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft' && galleryLbPrev) galleryLbPrev.click();
        if (e.key === 'ArrowRight' && galleryLbNext) galleryLbNext.click();
    });

    // Delete image from lightbox — PIN protected
    const galleryLbDelete = document.getElementById('gallery-lb-delete');
    function doDeleteImage() {
        const images = getBranchImages(currentBranchIdx);
        if (!images.length) return;
        images.splice(currentLbIdx, 1);
        saveBranchImages(currentBranchIdx, images);
        currentGalleryImages = images;
        updateAddBtnState();
        showImageToast(`🗑️ Photo deleted. (${images.length}/${MAX_BRANCH_IMAGES})`);
        if (images.length === 0) {
            closeGalleryLightbox();
            renderGalleryStack();
            return;
        }
        if (currentLbIdx >= images.length) currentLbIdx = images.length - 1;
        updateLightboxImage();
        renderGalleryStack();
    }
    if (galleryLbDelete) {
        galleryLbDelete.addEventListener('click', () => {
            // Require PIN before allowing image delete
            if (!isAdminAuth) {
                openAdminPinModal(() => {
                    doDeleteImage();
                });
                return;
            }
            doDeleteImage();
        });
    }

    // Branch cards reveal on scroll (IntersectionObserver for reliability)
    const branchSection = document.getElementById('branches');
    if (branchSection) {
        const branchObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    branchSection.classList.add('revealed');
                    branchObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        branchObserver.observe(branchSection);
    }

    // ═══ OFFERS SYSTEM (Cloud + Image + Timer) ═══
    const OFFERS_CLOUD_URL = 'https://api.npoint.io/6caca674995104e53428';
    let offersData = []; // each: { text, image, expiresAt }
    let offerPendingImage = null;

    // --- Cloud sync ---
    async function fetchOffersCloud() {
        try {
            const res = await fetch(OFFERS_CLOUD_URL + '?t=' + Date.now());
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.offers)) {
                    const now = Date.now();
                    offersData = data.offers.filter(o => !o.expiresAt || o.expiresAt > now);
                    return;
                }
            }
        } catch (e) { console.warn('Offers cloud fetch failed', e); }
        offersData = [];
    }

    async function saveOffersCloud() {
        try {
            await fetch(OFFERS_CLOUD_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ offers: offersData })
            });
        } catch (e) { console.warn('Offers cloud sync failed', e); }
    }

    // --- Timer helpers ---
    function formatCountdown(ms) {
        if (ms <= 0) return 'Expired';
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        if (h > 24) return Math.floor(h / 24) + 'd ' + (h % 24) + 'h left';
        if (h > 0) return h + 'h ' + m + 'm left';
        return m + 'm ' + s + 's left';
    }

    // --- Floating Banner ---
    const offersBanner = document.getElementById('offers-banner');
    const offersTextEl = document.getElementById('offers-text');
    const offersBannerClose = document.getElementById('offers-banner-close');
    const offersBannerImg = document.getElementById('offers-banner-img');
    const offersTimerEl = document.getElementById('offers-timer');
    let offerIdx = 0;
    let offerInterval = null;
    let offerTimerInterval = null;
    let bannerDismissed = false;

    function showOfferBanner() {
        // Filter expired
        const now = Date.now();
        const active = offersData.filter(o => !o.expiresAt || o.expiresAt > now);
        if (!active.length || bannerDismissed) {
            if (offersBanner) offersBanner.classList.add('hidden');
            if (offerTimerInterval) { clearInterval(offerTimerInterval); offerTimerInterval = null; }
            return;
        }
        offerIdx = offerIdx % active.length;
        const offer = active[offerIdx];
        if (offersTextEl) {
            offersTextEl.style.animation = 'none';
            void offersTextEl.offsetWidth;
            offersTextEl.textContent = offer.text;
            offersTextEl.style.animation = 'offerFadeText 0.5s ease forwards';
        }
        // Image
        if (offersBannerImg) {
            if (offer.image) {
                offersBannerImg.src = offer.image;
                offersBannerImg.style.display = 'block';
            } else {
                offersBannerImg.style.display = 'none';
            }
        }
        // Timer
        if (offersTimerEl) {
            if (offerTimerInterval) { clearInterval(offerTimerInterval); offerTimerInterval = null; }
            if (offer.expiresAt) {
                offersTimerEl.style.display = 'inline-block';
                const updateTimer = () => {
                    const remaining = offer.expiresAt - Date.now();
                    if (remaining <= 0) {
                        offersTimerEl.textContent = 'Expired';
                        clearInterval(offerTimerInterval);
                    } else {
                        offersTimerEl.textContent = '⏱ ' + formatCountdown(remaining);
                    }
                };
                updateTimer();
                offerTimerInterval = setInterval(updateTimer, 1000);
            } else {
                offersTimerEl.style.display = 'none';
            }
        }
        if (offersBanner) offersBanner.classList.remove('hidden');
        offerIdx++;
    }

    function startOfferRotation() {
        if (offerInterval) clearInterval(offerInterval);
        showOfferBanner();
        offerInterval = setInterval(showOfferBanner, 5000);
    }

    if (offersBannerClose) {
        offersBannerClose.addEventListener('click', () => {
            bannerDismissed = true;
            offersBanner.classList.add('hidden');
            if (offerInterval) clearInterval(offerInterval);
            if (offerTimerInterval) clearInterval(offerTimerInterval);
            setTimeout(() => {
                bannerDismissed = false;
                startOfferRotation();
            }, 30000);
        });
    }

    // --- Admin Modal ---
    const offersAdminModal = document.getElementById('offers-admin-modal');
    const offersAdminClose = document.querySelector('.offers-admin-close');
    const offersAdminOverlay = document.querySelector('.offers-admin-overlay');
    const offerInput = document.getElementById('offer-input');
    const addOfferBtn = document.getElementById('add-offer-btn');
    const offersListEl = document.getElementById('offers-list');
    const offersEmpty = document.getElementById('offers-empty');
    const openOffersAdmin = document.getElementById('open-offers-admin');
    const mobileOffersBtn = document.getElementById('mobile-offers-btn');
    const offerTimerSelect = document.getElementById('offer-timer-select');
    const offerImgUpload = document.getElementById('offer-img-upload');
    const offerImgLabel = document.getElementById('offer-img-label');
    const offerImgName = document.getElementById('offer-img-name');

    // Image upload handler
    if (offerImgUpload) {
        offerImgUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const max = 300;
                    let w = img.width, h = img.height;
                    if (w > h && w > max) { h = h * max / w; w = max; }
                    else if (h > max) { w = w * max / h; h = max; }
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    offerPendingImage = canvas.toDataURL('image/jpeg', 0.7);
                    if (offerImgName) offerImgName.textContent = '✓ Image';
                    if (offerImgLabel) offerImgLabel.classList.add('has-image');
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function openOffersModal() {
        if (offersAdminModal) {
            offersAdminModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderOffersList();
        }
    }

    function closeOffersModal() {
        if (offersAdminModal) {
            offersAdminModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Offers admin buttons — handled by admin PIN system below
    if (offersAdminClose) offersAdminClose.addEventListener('click', closeOffersModal);
    if (offersAdminOverlay) offersAdminOverlay.addEventListener('click', closeOffersModal);

    function renderOffersList() {
        if (!offersListEl) return;
        offersListEl.innerHTML = '';
        const now = Date.now();
        // Filter expired
        offersData = offersData.filter(o => !o.expiresAt || o.expiresAt > now);
        if (offersEmpty) offersEmpty.classList.toggle('hide', offersData.length > 0);
        offersData.forEach((offer, i) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.gap = '0.6rem';
            let thumbHtml = offer.image ? `<img class="offer-list-thumb" src="${offer.image}" alt="">` : '';
            let timerHtml = '';
            if (offer.expiresAt) {
                const rem = offer.expiresAt - now;
                timerHtml = `<span class="offer-list-timer-badge">${formatCountdown(rem)}</span>`;
            }
            li.innerHTML = `
                ${thumbHtml}
                <span class="offer-text" style="flex:1;">${offer.text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}${timerHtml}</span>
                <div class="offer-actions">
                    <button class="offer-btn delete-btn" data-idx="${i}" title="Delete">🗑️</button>
                </div>
            `;
            offersListEl.appendChild(li);
        });

        // Delete handler — PIN gated
        offersListEl.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.idx);
                pendingOfferDeleteIdx = idx;
                if (isAdminAuth) {
                    executeOfferDelete();
                } else {
                    openAdminPinModal(executeOfferDelete);
                }
            });
        });
    }

    let pendingOfferDeleteIdx = null;

    function executeOfferDelete() {
        if (pendingOfferDeleteIdx !== null && pendingOfferDeleteIdx < offersData.length) {
            offersData.splice(pendingOfferDeleteIdx, 1);
            saveOffersCloud();
            renderOffersList();
            offerIdx = 0;
            showOfferBanner();
        }
        pendingOfferDeleteIdx = null;
    }

    if (addOfferBtn) {
        addOfferBtn.addEventListener('click', () => {
            const val = offerInput ? offerInput.value.trim() : '';
            if (!val) return;
            const hours = offerTimerSelect ? parseInt(offerTimerSelect.value) : 0;
            const expiresAt = hours > 0 ? Date.now() + hours * 3600000 : null;
            offersData.push({
                text: val,
                image: offerPendingImage || null,
                expiresAt: expiresAt
            });
            saveOffersCloud();
            if (offerInput) offerInput.value = '';
            if (offerTimerSelect) offerTimerSelect.value = '0';
            offerPendingImage = null;
            if (offerImgName) offerImgName.textContent = '+ Image';
            if (offerImgLabel) offerImgLabel.classList.remove('has-image');
            if (offerImgUpload) offerImgUpload.value = '';
            renderOffersList();
            offerIdx = 0;
            bannerDismissed = false;
            startOfferRotation();
        });
    }

    if (offerInput) {
        offerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (addOfferBtn) addOfferBtn.click();
            }
        });
    }

    // --- Init offers from cloud + auto-refresh ---
    fetchOffersCloud().then(() => {
        setTimeout(startOfferRotation, 2500);
    });
    // Poll cloud every 30s so all devices stay in sync
    setInterval(async () => {
        await fetchOffersCloud();
        showOfferBanner();
    }, 30000);

    // ═══ ADMIN PIN SYSTEM ═══
    const ADMIN_PIN = '1008';
    // isAdminAuth already declared at top
    let pendingAdminAction = null;

    function showAdminElements() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = '';
        });
    }

    function hideAdminElements() {
        document.querySelectorAll('.admin-only').forEach(el => {
            el.style.display = 'none';
        });
    }

    // Always show image add/delete buttons (PIN is checked on click)
    if (addImgBtn) addImgBtn.style.display = '';
    if (galleryLbDelete) galleryLbDelete.style.display = '';

    // If already authenticated this session, show admin elements
    if (isAdminAuth) {
        showAdminElements();
    }

    // Admin PIN Modal
    const adminPinModal = document.getElementById('admin-pin-modal');
    const adminPinClose = document.querySelector('.admin-pin-close');
    const adminPinOverlay = document.querySelector('.admin-pin-overlay');
    const adminPinSubmit = document.getElementById('admin-pin-submit');
    const adminPinError = document.getElementById('admin-pin-error');
    const pinDigits = document.querySelectorAll('.pin-digit');

    openAdminPinModal = function(callback) {
        pendingAdminAction = callback;
        if (adminPinModal) {
            adminPinModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            pinDigits.forEach(d => d.value = '');
            if (adminPinError) adminPinError.textContent = '';
            setTimeout(() => pinDigits[0]?.focus(), 100);
        }
    };

    function closeAdminPinModal() {
        if (adminPinModal) {
            adminPinModal.classList.remove('active');
            document.body.style.overflow = '';
            // Don't nullify pendingAdminAction here — 
            // it's needed by the submit handler after closing
        }
    }

    if (adminPinClose) adminPinClose.addEventListener('click', closeAdminPinModal);
    if (adminPinOverlay) adminPinOverlay.addEventListener('click', closeAdminPinModal);

    // PIN digit auto-focus
    pinDigits.forEach((digit, idx) => {
        digit.addEventListener('input', (e) => {
            const val = e.target.value;
            if (val && idx < pinDigits.length - 1) {
                pinDigits[idx + 1].focus();
            }
            // Auto-submit when all 4 digits entered
            if (idx === pinDigits.length - 1 && val) {
                setTimeout(() => adminPinSubmit?.click(), 100);
            }
        });
        digit.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && idx > 0) {
                pinDigits[idx - 1].focus();
            }
        });
    });

    function getEnteredPIN() {
        return Array.from(pinDigits).map(d => d.value).join('');
    }

    if (adminPinSubmit) {
        adminPinSubmit.addEventListener('click', () => {
            const entered = getEnteredPIN();
            if (entered === ADMIN_PIN) {
                isAdminAuth = true;
                sessionStorage.setItem('aromaAdmin', 'true');
                showAdminElements();
                // Save callback before closing (closeAdminPinModal doesn't nullify it anymore)
                const callback = pendingAdminAction;
                pendingAdminAction = null;
                closeAdminPinModal();
                // Execute the pending action AFTER closing the PIN modal
                if (callback) {
                    setTimeout(() => callback(), 150);
                }
            } else {
                if (adminPinError) {
                    adminPinError.textContent = 'Incorrect PIN. Try again.';
                    adminPinError.style.color = '#ff4d4d';
                }
                pinDigits.forEach(d => d.value = '');
                pinDigits[0]?.focus();
                // Shake animation
                const panel = document.querySelector('.admin-pin-panel');
                if (panel) {
                    panel.style.animation = 'none';
                    void panel.offsetWidth;
                    panel.style.animation = 'pinShake 0.4s ease';
                }
            }
        });
    }

    // Override offers admin open — require PIN if not authenticated
    const origOpenOffersAdmin = openOffersAdmin;
    const origMobileOffersBtn = mobileOffersBtn;

    if (origOpenOffersAdmin) {
        origOpenOffersAdmin.removeEventListener('click', openOffersModal);
        origOpenOffersAdmin.addEventListener('click', () => {
            if (isAdminAuth) {
                openOffersModal();
            } else {
                openAdminPinModal(openOffersModal);
            }
        });
    }

    if (origMobileOffersBtn) {
        origMobileOffersBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (mobileMenu) mobileMenu.classList.remove('active');
            const spans = menuToggle ? menuToggle.querySelectorAll('span') : [];
            if (spans.length) {
                gsap.to(spans[0], { rotate: 0, y: 0, duration: 0.3 });
                gsap.to(spans[1], { rotate: 0, y: 0, duration: 0.3 });
            }
            if (isAdminAuth) {
                openOffersModal();
            } else {
                openAdminPinModal(openOffersModal);
            }
        });
    }

    // Note: PIN check for add photo button is now handled inline in the click handler above (line ~590)

    // ═══ IMAGE PROTECTION — Prevent Download ═══
    // Disable right-click on all images
    document.addEventListener('contextmenu', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Disable drag on all images
    document.addEventListener('dragstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    // Disable long-press on mobile (touch devices)
    document.addEventListener('touchstart', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.style.webkitTouchCallout = 'none';
        }
    }, { passive: true });

    // ═══ GLOBAL ESCAPE KEY — Close any open modal ═══
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (adminPinModal && adminPinModal.classList.contains('active')) return closeAdminPinModal();
            if (galleryLightbox && galleryLightbox.classList.contains('active')) return closeGalleryLightbox();
            if (offersAdminModal && offersAdminModal.classList.contains('active')) return closeOffersModal();
            if (branchPopup && branchPopup.classList.contains('active')) return closeBranchPopup();
            if (pModal && pModal.classList.contains('active')) return closePModal();
            if (modal && modal.classList.contains('active')) return closeModal();
            // Close membership branch modal on Escape
            const memModal = document.getElementById('mem-branch-modal');
            if (memModal && memModal.style.display === 'flex') closeMembershipModal();
        }
    });

    // ═══ MEMBERSHIP WHATSAPP ENQUIRY ═══
    const memBranchModal = document.getElementById('mem-branch-modal');
    const memBranchBackdrop = document.getElementById('mem-branch-backdrop');
    const memBranchCancel = document.getElementById('mem-branch-cancel');
    const memBranchChoices = document.querySelectorAll('.mem-branch-choice');
    let activeMembershipData = { package: '', price: '' };

    function openMembershipModal(pkg, price) {
        activeMembershipData = { package: pkg, price: price };
        memBranchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeMembershipModal() {
        memBranchModal.style.display = 'none';
        document.body.style.overflow = '';
    }

    // WA button click on each membership card
    document.querySelectorAll('.mem-wa-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrap = btn.closest('.mem-price-wrap');
            const pkg = wrap ? wrap.dataset.package : '';
            const price = wrap ? wrap.dataset.price : '';
            openMembershipModal(pkg, price);
        });
    });

    // Branch selection → open WhatsApp
    memBranchChoices.forEach(choice => {
        choice.addEventListener('click', () => {
            const wa = choice.dataset.wa;
            const branch = choice.dataset.branch;
            const { package: pkg, price } = activeMembershipData;

            const msg =
`*AROMA INTERNATIONAL SPA*
*Membership Enquiry*
━━━━━━━━━━━━━━━━━━━━

Package : ${pkg}
Price   : ${price}
Branch  : ${branch}

━━━━━━━━━━━━━━━━━━━━
*My Details:*
Name    : 
Phone   : 
City    : 

I am interested in this membership. Please contact me at the earliest. Thank you!`;

            closeMembershipModal();
            window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    if (memBranchBackdrop) memBranchBackdrop.addEventListener('click', closeMembershipModal);
    if (memBranchCancel) memBranchCancel.addEventListener('click', closeMembershipModal);

});
