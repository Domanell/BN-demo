$(document).on('ready', function () {
	const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
	//fancybox
	$('.fancybox').fancybox({
		helpers: {
			overlay: {
				locked: false,
			},
		},
	});
	//menu
	$('.navigation-dropdown__click').on('click', function () {
		$(this).parent().find('.navigation-dropdown').toggleClass('active');
	});
	$('.dropdown-menu__button').on('click', function () {
		$(this).toggleClass('active');
		$(this).parent().find('.dropdown-menu__dropdown').toggleClass('active');
	});
	$('body').on('click', function (e) {
		if (!$(e.target).hasClass('dropdown-menu__button') && $('.dropdown-menu__button').hasClass('active')) {
			$('.dropdown-menu__button').removeClass('active');
			$('.dropdown-menu__dropdown').removeClass('active');
		}
	});
	//form
	$('.footer-btn-submit').on('click', function () {
		$.fancybox.open({ src: '#modal-thanks', type: 'inline' });
	});

	$('.show-picker-on-click').on('click', function (event) {
		try {
			event.target.showPicker();
		} catch (error) {
			console.error(error);
		}
	});

	if ($('.property-slider').length) {
		const $container = $('.property-slider');
		// Add Swiper structure
		$container.addClass('swiper');
		if ($container.find('.swiper-wrapper').length === 0) {
			const $slides = $container.children('.property-slider__slide');
			$slides.addClass('swiper-slide');
			$slides.wrapAll('<div class="swiper-wrapper"></div>');
		}
		// Add navigation arrows if missing to match previous Slick UI
		if ($container.find('.swiper-arrow').length === 0) {
			$container.append('<div class="swiper-arrow swiper-arrow--prev"></div><div class="swiper-arrow swiper-arrow--next"></div>');
		}

		// Initialize Swiper
		const propertySwiper = new Swiper('.property-slider', {
			slidesPerView: 3,
			centeredSlides: true,
			loop: true,
			spaceBetween: 0,
			slideToClickedSlide: true,
			navigation: {
				nextEl: '.swiper-arrow--next',
				prevEl: '.swiper-arrow--prev',
			},
			breakpoints: {
				0: { slidesPerView: 1, centeredSlides: true },
				768: { slidesPerView: 3, centeredSlides: true },
			},
		});
	}

	if ($('.customer-carousel').length) {
		const $cc = $('.customer-carousel');
		if ($cc.find('.swiper').length === 0) {
			const $items = $cc.children('.customer-carousel__item');
			$items.wrapAll('<div class="swiper"><div class="swiper-wrapper"></div></div>');
		}
		$cc.find('.customer-carousel__item').addClass('swiper-slide');

		if ($cc.find('.swiper-arrow').length === 0) {
			$cc.append('<div class="swiper-arrow swiper-arrow--prev"></div><div class="swiper-arrow swiper-arrow--next"></div>');
		}
		const customerSwiper = new Swiper('.customer-carousel .swiper', {
			loop: true,
			slidesPerView: 3,
			spaceBetween: 12,
			navigation: {
				nextEl: '.swiper-arrow--next',
				prevEl: '.swiper-arrow--prev',
			},
			breakpoints: {
				0: { slidesPerView: 1 },
				768: { slidesPerView: 2 },
				1024: { slidesPerView: 3 },
			},
		});
	}

	if ($('.slider-outside').length) {
		const solutionSlider = new Swiper('.slider-outside .swiper', {
			slidesPerView: 'auto',
			slidesPerGroup: 3,
			spaceBetween: 32,
			breakpoints: {
				0: { slidesPerView: 1, slidesPerGroup: 1 },
				480: { slidesPerView: 1.5, slidesPerGroup: 1 },
				768: { slidesPerView: 'auto', slidesPerGroup: 2 },
				992: { slidesPerView: 'auto', slidesPerGroup: 2 },
				1200: { slidesPerView: 'auto', slidesPerGroup: 3 },
			},
			navigation: {
				nextEl: '.swiper-arrow--next',
				prevEl: '.swiper-arrow--prev',
			},
			pagination: {
				el: '.slider-outside__pagination',
				clickable: true,
				bulletClass: 'slider-outside__bullet',
				bulletActiveClass: 'slider-outside__bullet--active',
			},
		});
	}

	// Pricing plans
	$('.pricing-size__item').on('click', function () {
		$('.pricing-size__item').removeClass('active');
		$(this).addClass('active');
	});

	if ($('.pricing-addons__slider').length) {
		const $container = $('.pricing-addons__slider');
		// Add Swiper CSS hooks and structure dynamically
		$container.addClass('swiper');
		if ($container.find('.swiper-wrapper').length === 0) {
			const $slides = $container.children('.pricing-addons__slide');
			$slides.addClass('swiper-slide');
			$slides.wrapAll('<div class="swiper-wrapper"></div>');
		}
		// Add navigation arrows to reuse existing styling
		if ($container.find('.swiper-arrow').length === 0) {
			$container.append('<div class="swiper-arrow swiper-arrow--prev"></div><div class="swiper-arrow swiper-arrow--next"></div>');
		}

		function updateAddonsGhostSlides(swiper) {
			const slides = swiper.slides ? Array.from(swiper.slides) : Array.from($container.find('.swiper-slide'));
			slides.forEach((el) => el.classList.remove('previous-slide', 'next-slide'));
			const total = slides.length;
			if (!total) return;
			let spv = Number(swiper.params.slidesPerView);
			if (!Number.isFinite(spv) || spv < 1) spv = 1;
			const firstIdx = swiper.activeIndex ?? 0;
			const lastIdx = (firstIdx + spv - 1) % total;
			const prevIdx = (firstIdx - 1 + total) % total;
			const nextIdx = (lastIdx + 1) % total;
			slides[prevIdx]?.classList.add('previous-slide');
			slides[nextIdx]?.classList.add('next-slide');
		}

		const addonsSwiper = new Swiper('.pricing-addons__slider', {
			loop: true,
			loopAdditionalSlides: 2,
			watchSlidesProgress: true,
			slidesPerView: 4,
			spaceBetween: 0,
			navigation: {
				nextEl: $container.find('.swiper-arrow--next')[0],
				prevEl: $container.find('.swiper-arrow--prev')[0],
			},
			breakpoints: {
				0: { slidesPerView: 1 },
				768: { slidesPerView: 2 },
				992: { slidesPerView: 3 },
				1200: { slidesPerView: 4 },
			},
			on: {
				init(sw) {
					updateAddonsGhostSlides(sw);
				},
				slideChange(sw) {
					updateAddonsGhostSlides(sw);
				},
				resize(sw) {
					updateAddonsGhostSlides(sw);
				},
			},
		});
	}

	//wow
	new WOW().init();

	//accordion
	$('.faq__trigger').on('click', function () {
		$(this).next().slideToggle('fast');
		$(this).toggleClass('active');
	});
	$('.segment-accordion__trigger').on('click', function () {
		$(this).next().slideToggle('fast');
		$(this).parent().toggleClass('active');
	});
	$('.add-code-button').on('click', function () {
		$('.add-code-container').slideToggle('fast');
	});
	$('.accordion__header').on('click', function () {
		$(this).parent().find('.accordion__content').slideToggle('fast');
		$(this).toggleClass('active');
	});
	$('.interactive-card__trigger').on('click', function (event) {
		const $trigger = $(this);
		const $listRoot = $trigger.closest('.interactive-list');
		const $item = $trigger.closest('.interactive-card');
		// If already active, do nothing
		if ($item.hasClass('active')) return;

		// Activate clicked card within its list only
		$listRoot.find('.interactive-card.active').removeClass('active');
		$item.addClass('active');

		// Determine index by position in list
		const $contentCards = $listRoot.find('.interactive-list__content-card');
		const $current = $contentCards.filter('.active');
		const $next = $contentCards.eq($item.index());
		if (!$next.length || $next.is($current)) return;
		const currentVideo = $current.find('video').get(0);
		const nextVideo = $next.find('video').get(0);

		// Animate switch
		$current.stop(true, true).fadeOut(150, function () {
			$(this).removeClass('active');
			if (currentVideo) {
				currentVideo.pause();
				currentVideo.currentTime = 0;
			}
			if (nextVideo) {
				nextVideo.play();
			}
			$next.stop(true, true).fadeIn(150).addClass('active');
		});
	});

	//tabs
	$('.tab a').on('click', function (event) {
		event.preventDefault();
		$('.tab li a').removeClass('active');
		$(this).addClass('active');
		$('.tab-content').hide();
		$($(this).attr('href')).show();
	});
	$('.payment-method__selector label.radio__item input').on('click', function () {
		$('.payment-method__content.active').removeClass('active');
		$('.payment-method__content[data-method="' + $(this).data('paymentMethod') + '"]').addClass('active');
	});

	if ($('.calendly-button').length) {
		const pageName = window.location.pathname.split('/')?.slice(-1);
		let targetButton = $('.calendly-button').filter(function () {
			return $(this).data('variables')?.split(',').includes(pageName);
		});
		if (targetButton.length === 0) {
			targetButton = $('.calendly-button').first();
		}
		const page = targetButton.data('target');

		changeCalendlyTab(page);
	}
	$('.calendly-button').on('click', function () {
		if ($(this).hasClass('active')) return;
		const target = $(this).data('target');
		changeCalendlyTab(target);
	});

	function changeCalendlyTab(target) {
		$('.calendly-button').removeClass('active');
		$('.calendly-form__content').removeClass('active');
		$(`.calendly-button[data-target='${target}']`).addClass('active');
		$(`#${target}`).addClass('active');
	}

	// International Telephone Input
	if (document.querySelector('[id$=trial-phone]')) {
		var input = document.querySelector('[id$=trial-phone]');
		window.intlTelInput(input, {
			preferredCountries: ['us'],
			separateDialCode: true,
			// any initialization options go here
		});
	}

	// input number arrows
	$('.input-number button').on('click', function () {
		if ($(this).hasClass('input-number__plus')) {
			this.nextElementSibling.stepUp();
		} else if ($(this).hasClass('input-number__minus')) {
			this.previousElementSibling.stepDown();
		}
	});

	//webinar forms - get values from register buttons
	$('.webinar-register').on('click', function () {
		var webinarDate = $(this).data('webinar-month') + ' ' + $(this).data('webinar-day') + ' ' + $(this).data('webinar-time');
		$('.webinar-id input').val($(this).data('webinar-id'));
		$('.webinar-name input').val($(this).data('webinar-name'));
		$('.webinar-display-name').text($(this).data('webinar-name'));
		$('.webinar-date').text(webinarDate);
	});

	//Add new payment modal (activation page)
	$('.activation-card .add-payment').fancybox({
		// Returns the first step on modal close
		afterClose: function () {
			$('.add-payment__form').show();
			$('.add-payment-modal__thank-you').hide();
		},
	});
	// Shows Thank you section
	$('.add-payment-modal .add-payment-modal__button').on('click', function () {
		$('.add-payment__form').toggle();
		$('.add-payment-modal__thank-you').toggle();
	});

	// Scroll to element
	$('.scroll-to').on('click', function (event) {
		event.preventDefault();
		const { target, offset = 100 } = event.target.dataset;
		const targetPosition = document.querySelector(`.${target}`).getBoundingClientRect().top;
		const offsetPosition = targetPosition + window.pageYOffset - offset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		});
	});

	$('.pricing-accordion__trigger').on('click', function () {
		$(this).next().slideToggle('fast');
		$(this).parent().toggleClass('active');
	});
	//gallery
	$('.gallery-content__switch input').on('click', function () {
		$('.gallery-content__tab').toggleClass('active');
	});
	// gallery
	$('.thumb').fancybox({
		prevEffect: 'none',
		nextEffect: 'none',
		afterLoad: function () {
			this.title = this.title + '<a href="' + this.href + '" target="_blank">Download</a> ';
		},
		helpers: {
			thumbs: {
				width: 100,
				height: 100,
			},
			buttons: {},
		},
	});
	$('.proceed-payment').on('click', function (event) {
		event.preventDefault();
		$('.checkout-form__first-step').hide();
		$('.checkout-form__second-step').show();
	});

	// Optimized Mega menu
	const menu = document.querySelector('.menu');

	if (menu) {
		// Cache DOM elements
		const menuOverlay = document.querySelector('.menu-overlay');
		const mobileMenuTrigger = document.querySelector('.mobile-menu-trigger');
		const menuCurrentTitle = menu.querySelector('.menu__current-title');
		const menuMobileHead = menu.querySelector('.menu__mobile-head');
		const menuBack = menu.querySelector('.menu__back');
		const menuClose = menu.querySelector('.menu__close');
		const header = document.querySelector('header');

		let subMenu = null;

		const changeCategory = (catIndex) => {
			const activeDropdown = document.querySelector('.menu__dropdown.active');
			if (!activeDropdown) return;

			activeDropdown.querySelector('.categories-menu__item.active')?.classList.remove('active');
			activeDropdown.querySelector('.categories-menu__links.active')?.classList.remove('active');

			const categoryList = activeDropdown.querySelectorAll('.categories-menu__item');
			const categoryLinks = activeDropdown.querySelectorAll('.categories-menu__links');
			const categoryData = activeDropdown.querySelector('.categories-menu__data');

			if (catIndex < 0) {
				categoryData?.classList.remove('active');
			} else {
				categoryData?.classList.add('active');
				categoryList[catIndex]?.classList.add('active');
				categoryLinks[catIndex]?.classList.add('active');
				menuCurrentTitle.textContent = menuCurrentTitle.textContent + ' > ' + categoryList[catIndex].textContent.trim();
			}
		};

		const hideMegaMenu = (keepMenuActive = false) => {
			menu?.classList.toggle('active', keepMenuActive);
			menuOverlay?.classList.toggle('active', keepMenuActive);
			document.querySelector('.menu__dropdown.active')?.classList.remove('active');
		};

		const handleHoverMenu = (item) => {
			const hasMegaMenu = item.classList.contains('menu__item--has-submenu');
			// hideMegaMenu(hasMegaMenu);

			if (hasMegaMenu) {
				subMenu = item.querySelector('.menu__dropdown');
				subMenu?.classList.add('active');
				menuOverlay?.classList.add('active');
				changeCategory(window.innerWidth < 992 ? -1 : 0);
			}
		};

		const toggleMobileMenu = () => {
			menu.classList.contains('active') ? hideMobileMenu() : showMobileMenu();
		};

		const showMobileMenu = () => {
			menuCurrentTitle.textContent = '';
			menu.classList.add('active', 'animated');
			document.body.classList.add('no-scroll');
			header.classList.add('active');
		};

		const hideMobileMenu = () => {
			menu.classList.remove('active');
			document.body.classList.remove('no-scroll');
			header.classList.remove('active');
			setTimeout(() => {
				menu.classList.remove('animated');
			}, 400);
			closeSubMenuMobile();
		};

		const openSubMenuMobile = (menuGroup) => {
			subMenu = menuGroup.querySelector('.menu__dropdown');
			subMenu?.classList.add('active');

			const menuLinkTitle = menuGroup.querySelector('.menu__link-title');
			if (menuLinkTitle) {
				menuCurrentTitle.textContent = menuLinkTitle.textContent;
			}
			changeCategory(-1);
			menuMobileHead?.classList.add('active');
		};

		const closeSubMenuMobile = () => {
			subMenu?.classList.remove('active');
			menuCurrentTitle.textContent = '';
			menuMobileHead?.classList.remove('active');
		};

		const backMenu = () => {
			// Back to submenu if category menu is open
			const selectedCategoryData = document.querySelector('.menu__dropdown.active .categories-menu__data.active');
			if (selectedCategoryData) {
				selectedCategoryData.classList.remove('active');
				menuCurrentTitle.textContent = menuCurrentTitle.textContent.split(' > ')[0];
			} else {
				closeSubMenuMobile();
			}
		};

		const handleResize = () => {
			if (window.innerWidth >= 992 && menu.classList.contains('active')) {
				hideMobileMenu();
			}
		};

		// Event listeners
		menu.querySelectorAll('.menu__item').forEach((menuItem) => {
			menuItem.addEventListener('mouseenter', () => {
				if (window.innerWidth >= 992) handleHoverMenu(menuItem);
			});
			menuItem.addEventListener('mouseleave', () => {
				if (window.innerWidth >= 992) hideMegaMenu();
			});
		});

		// Mobile menu click handler - only for mobile submenu navigation
		menu.querySelectorAll('.menu__link-title')?.forEach((linkTitle) => {
			linkTitle.addEventListener('click', (event) => {
				if (!menu.classList.contains('active') || window.innerWidth >= 992) return;

				const submenuItem = event.target.closest('.menu__item--has-submenu');
				if (submenuItem) {
					event.preventDefault();
					openSubMenuMobile(submenuItem);
				}
			});
		});
		// Category menu click handler - works in both desktop and mobile
		menu.addEventListener('click', (event) => {
			const categoryItem = event.target.closest('.categories-menu__item');
			if (categoryItem) {
				event.preventDefault();
				const index = Array.from(categoryItem.parentNode.children).indexOf(categoryItem);
				changeCategory(index);
			}
		});

		mobileMenuTrigger?.addEventListener('click', toggleMobileMenu);
		menuOverlay?.addEventListener('click', toggleMobileMenu);
		menuBack?.addEventListener('click', backMenu);
		menuClose?.addEventListener('click', toggleMobileMenu);
		window.addEventListener('resize', handleResize);
	}

	// Autoplay videos on iOS
	if (isIOS) {
		document.querySelectorAll('video[autoplay]').forEach((video) => {
			if (video.paused) {
				video.play().catch(() => {
					const unlock = () => {
						video.play();
						document.removeEventListener('touchstart', unlock);
						document.removeEventListener('click', unlock);
					};

					document.addEventListener('touchstart', unlock, { passive: true });
					document.addEventListener('click', unlock);
				});
			}
		});
	}
});

//fixed
$(window).on('scroll', function () {
	var scroll = $(window).scrollTop();

	if (scroll >= 100) {
		$('.header').addClass('fixed');
	} else {
		$('.header').removeClass('fixed');
	}
});

// Currency change
function handleBasePlanCurrencyChange(target) {
	let rate = 1;
	let currencySymbol = '$';

	const selectedOption = target.options[target.selectedIndex];
	currencyISO = target.value;
	rate = selectedOption.dataset.rate;
	currencySymbol = selectedOption.dataset.currencySymbol;

	// Update content
	const formatNumberWithCommas = (number) => {
		return (
			currencySymbol +
			parseFloat(number * rate)
				.toFixed(0)
				.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		);
	};

	const basePlanPriceText = document.querySelector('.plan-detail__price');
	basePlanPriceText.innerText = formatNumberWithCommas(basePlanPriceText.dataset.price);
}
