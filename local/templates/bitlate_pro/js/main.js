var productGridOptions = {
    // options
    itemSelector: '.products-flex-item',
    masonry: {
        columnWidth: 240
    },
    animationOptions: {
        duration: 0,
        easing: 'linear',
        queue: false
    }
};

var profileGridOptions = {
    itemSelector: '.profile-column-item',
    animationOptions: {
        duration: 0,
        easing: 'linear',
        queue: false
    },
    getSortData: {
        order: '[data-order]'
    },
    sortBy : 'order'
}

var breakpoints = {
    small: 0,
    medium: 518,
    large: 758,
    xlarge: 998,
    xxlarge: 1238,
}

var slideout = '';

function initOwl() {
    var $mainSlider      = $('.main-slider'),
        $mainBanner      = $('.main-banner'),
        $mainBannerGrid  = $('.main-banner-grid'),
        $mainNews        = $('.main-news-carousel'),
        $mainBrand       = $('.main-brand-carousel'),
        $productPreview  = $('.product-slider'),
        $productPack     = $('.product-pack-carousel'),
        $productSet      = $('.product-set-carousel'),
        $productCompare  = $('.product-compare-carousel'),
        $productSeeIt    = $('.product-carousel'),
        $innerGallery    = $('.inner-carousel'),
        $innerTeam       = $('.inner-team');

    if ($mainSlider.length) {
        var itemLength = $mainSlider.find('.item').length,
            $itemParallax = $mainSlider.find('.parallax-item'),
            itemParallaxLength = $itemParallax.length,
            $itemVideo = $mainSlider.find('.video-item'),
            $svgDots = $('#owl-dots-svg'),
            params = {
                items: 1,
                center: true,
                navText: [],
                dotsContainer: '#owl-dots-svg'
            },
            small = $mainSlider.parent().hasClass('small'),
            timeout = 70,
            timer = timeout,
            timerId = null,
            players = [],
            initOwlTimer = function(){
                timer--;
                return setInterval(function(){
                    timer--;
                    if (!timer) {
                        $mainSlider.trigger('next.owl.carousel');
                    }
                }, 100);
            };

        if (itemLength > 1) {
            params['loop'] = true;
            params['nav'] = (small) ? false : true;
        } else {
            params['loop'] = false;
            params['dots'] = false;
        }
        $mainSlider.on('initialized.owl.carousel', function(){
            $svgDots.removeClass('hide').appendTo($mainSlider);
            $svgDots.children('.owl-dot').click(function(){
                $mainSlider.trigger('to.owl.carousel', [$(this).index()]);
            });
            $mainSlider.hover(
                function(){
                    clearInterval(timerId);
                    $svgDots.addClass('pause');
                },
                function(){
                    timerId = initOwlTimer();
                    $svgDots.removeClass('pause');
                }
            );
            timerId = initOwlTimer();
        });
        $mainSlider.on('translate.owl.carousel', function(e){
            var player = players[e.relatedTarget._current];

            timer = timeout;
            if ($itemVideo.length) {
                for (var i in players) {
                    players[i].stopVideo();
                }
                if (player !== undefined && player.g !== undefined) {
                    player.seekTo(player.g.g.playerVars.start);
                }
            }
        });
        $mainSlider.owlCarousel(params);
        if (itemParallaxLength) {
            $itemParallax.mouseParallax();
        }
        function initYoutube($itemVideo) {
            $('<script/>',{'src':'https://www.youtube.com/iframe_api'}).appendTo('body');

            onYouTubeIframeAPIReady = function(){
                $itemVideo.each(function(){
                    var $self = $(this),
                        $parent = $self.closest('.owl-item'),
                        videoId = $self.attr('data-video'),
                        time = $self.attr('data-time'),
                        tagId = 'video-' + videoId,
                        index = $parent.index();

                    $('<div/>',{'id':tagId}).prependTo($self);
                    var player = new YT.Player(tagId, {
                        videoId: videoId,
                        playerVars:{
                            loop: 1,
                            showinfo: 0,
                            controls: 0,
                            disablekb: 1,
                            modestbranding: 0,
                            iv_load_policy: 3,
                            playlist: videoId,
                            start: (time === undefined) ? 0 : parseInt(time)
                        },
                        events:{
                            'onReady':function(){
                                player.mute();
                                if ($parent.hasClass('active')) {
                                    player.playVideo();
                                }
                            }
                        }
                    });
                    players[index] = player;
                });
            };
        }
        if ($itemVideo.length) {
            if ($("#page").hasClass("page-lazy")) {
                $(window).on('load', function() {
                    setTimeout(function(){
                        initYoutube($itemVideo);
                    })
                })
            } else {
                initYoutube($itemVideo);
            }
        }
    }
    if ($mainBanner.length) {
        $mainBanner.each(function(){
            var $self = $(this),
                isLazy = ($self.hasClass('is-lazy')),
                isRightBanner = ($self.closest('.main-slider-banner').hasClass('banner-right')),
                isDrag = !($self.hasClass('sortable-banner') || isRightBanner),
                isMobileDisabled = ($self.hasClass('mobile-disabled')),
                itemLength = $self.find('.item').length,
                params = {
                    loop: true,
                    items: 1,
                    margin: 20,
                    lazyLoad: isLazy,
                    navText: [],
                    responsive: {}
                };
            params['responsive'][breakpoints['large']] = {
                items: 2,
            };
            params['responsive'][breakpoints['xlarge']] = {
                items: (isRightBanner) ? 1 : 3,
                loop: false,
                dots: false,
                mouseDrag: isDrag,
                touchDrag: isDrag,
                freeDrag: !isDrag,
            };
            switch (itemLength) {
                case 1:
                    params['loop'] = false;
                    params['dots'] = false;
                    break;
                case 2:
                    params['responsive'][breakpoints['large']]['loop'] = false;
                    params['responsive'][breakpoints['large']]['dots'] = false;
                    break;
            }
            if (isMobileDisabled) {
                $self.data({
                    initCarousel: false,
                    optionsCarousel: params
                });
                var checkMainBanner = function() {
                    var options = $self.data();

                    if ($.inArray(Foundation.MediaQuery.current, ['large', 'xlarge', 'xxlarge']) !== -1) {
                        if (!options.initCarousel) {
                            $self.owlCarousel(options.optionsCarousel);
                            $self.data('initCarousel', true);
                        }
                        if (options.optionsCarousel.lazyLoad) {
                            $self.addClass('is-lazy');
                        }
                    } else {
                        if (options.initCarousel) {
                            $self.trigger('destroy.owl.carousel');
                            $self.data('initCarousel', false);
                        }
                        if (options.optionsCarousel.lazyLoad) {
                            $self.removeClass('is-lazy');
                            initLazyLoad('.owl-lazy');
                        }
                    }
                };
                watchFunction(checkMainBanner);
            } else {
                $self.owlCarousel(params);
            }
        });
    }
    if ($mainBannerGrid.length) {
        $mainBannerGrid.each(function(){
            var $self = $(this),
                isSortableGrid = $self.hasClass('sortable-grid'),
                isMobileDisabled = $self.hasClass('mobile-disabled');

            $self.data({
                initIsotope: false,
                initCarousel: false,
                lazyCarousel: false,
                optionsIsotope: {
                    itemSelector: '.main-banner-item',
                    layoutMode: 'packery',
                    transitionDuration: isSortableGrid ? 0 : '0.4s'
                },
                optionsCarousel: {
                    items: 1,
                    margin: 20,
                    autoWidth: true
                }
            });
            var checkMainBannerIsotope = function() {
                var options = $self.data();

                if ($.inArray(Foundation.MediaQuery.current, ['medium', 'large', 'xlarge', 'xxlarge']) !== -1) {
                    if (!options.initIsotope) {
                        $self.isotope(options.optionsIsotope);
                        $self.data('initIsotope', true);
                    }
                } else {
                    if (options.initIsotope) {
                        $self.isotope('destroy');
                        $self.data('initIsotope', false);
                    }
                }
            };
            watchFunction(checkMainBannerIsotope);
            if (!isMobileDisabled) {
                var checkMainBannerCarousel = function() {
                    var options = $self.data();

                    if ($.inArray(Foundation.MediaQuery.current, ['medium', 'large', 'xlarge', 'xxlarge']) !== -1) {
                        if (options.initCarousel) {
                            $self.trigger('destroy.owl.carousel');
                            $self.removeClass('owl-carousel');
                            $self.data('initCarousel', false);
                        }

                    } else {
                        if (!options.initCarousel) {
                            $self.addClass('owl-carousel');
                            $self.owlCarousel(options.optionsCarousel);
                            $self.data('initCarousel', true);
                        }
                    }
                };
                watchFunction(checkMainBannerCarousel);
            }
        });
    }
    if ($mainNews.length) {
        $mainNews.each(function(){
            var $self = $(this),
                isLazy = ($self.hasClass('is-lazy')),
                itemLength = $self.find('.item').length,
                params = {
                    items: 1,
                    margin: 23,
                    lazyLoad: isLazy,
                    nav: true,
                    navText: [],
                    responsive: {},
                };
            params['responsive'][breakpoints['large']] = {
                items: 2,
            };
            params['responsive'][breakpoints['xlarge']] = {
                items: 3,
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: 4,
            };
            switch (itemLength) {
                case 1:
                    params['nav'] = false;
                    params['dots'] = false;
                    break;
                case 2:
                    params['responsive'][breakpoints['large']]['dots'] = false;
                    params['responsive'][breakpoints['xlarge']]['dots'] = false;
                    params['responsive'][breakpoints['xxlarge']]['dots'] = false;
                    break;
                case 3:
                    params['responsive'][breakpoints['xlarge']]['dots'] = false;
                    params['responsive'][breakpoints['xxlarge']]['dots'] = false;
                    break;
                case 4:
                    params['responsive'][breakpoints['xxlarge']]['dots'] = false;
                    break;
            }
            $self.owlCarousel(params);
        });
    }
    if ($mainBrand.length) {
        $mainBrand.each(function(){
            var $self = $(this),
                isLazy = ($self.hasClass('is-lazy')),
                itemLength = $self.find('.item').length,
                params = {
                    items: 4,
                    loop: true,
                    lazyLoad: isLazy,
                    navText: [],
                    responsive: {},
                };
            params['responsive'][breakpoints['large']] = {
                items: 6,
            };
            params['responsive'][breakpoints['xlarge']] = {
                items: 8,
                dots: false,
            };
            if (itemLength <= 4) {
                params['dots'] = false;
                params['loop'] = false;
            } else if (itemLength <= 6) {
                params['responsive'][breakpoints['large']]['dots'] = false;
                params['responsive'][breakpoints['large']]['loop'] = false;
            } else if (itemLength <= 8) {
                params['responsive'][breakpoints['xlarge']]['dots'] = false;
                params['responsive'][breakpoints['xlarge']]['loop'] = false;
            } else {
                params['responsive'][breakpoints['xlarge']]['nav'] = true;
            }
            $(this).owlCarousel(params);
        });
    }
    if ($productPreview.length) {
        $productPreview.each(function(){
            var params = {
                items: 2,
                nav: true,
                dots: false,
                navText: [],
                responsive: {},
            };
            params['responsive'][breakpoints['medium']] = {
                items: 4,
            };
            $(this).owlCarousel(params);
        });
    }
    if ($productSeeIt.length) {
        $productSeeIt.each(function(){
            var $self = $(this),
                isLazy = ($self.hasClass('is-lazy')),
                isBanner = ($self.hasClass('is-banner')),
                isBannerXlarge = ($self.hasClass('is-banner-xlarge')),
                variation = $self.parent().hasClass('product-pack-variation'),
                inner = $self.hasClass('product-carousel-inner'),
                itemLength = $self.children('.item').length,
                params = {
                    items: 1,
                    margin: -1,
                    lazyLoad: isLazy,
                    dragEndSpeed: 100,
                    navText: [],
                    rewind: !variation,
                    responsive: {},
                    mouseDrag: false
                };

            params['responsive'][breakpoints['medium']] = {
                items: (isBanner && !isBannerXlarge) ? 1 : 2
            };
            params['responsive'][breakpoints['large']] = {
                items: (isBanner && !isBannerXlarge) ? 2 : 3
            };
            params['responsive'][breakpoints['xlarge']] = {
                items: (inner || isBanner) ? 3 : 4,
                nav: true,
                dots: false,
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: (inner || isBanner) ? 4 : 5,
                nav: true,
                dots: false,
            };
            if (!variation) {
                switch (itemLength) {
                    case 1:
                        params['loop'] = false;
                        params['dots'] = false;
                    case 2:
                        params['responsive'][breakpoints['medium']]['loop'] = false;
                        params['responsive'][breakpoints['medium']]['dots'] = false;
                    case 3:
                        params['responsive'][breakpoints['large']]['loop'] = false;
                        params['responsive'][breakpoints['large']]['dots'] = false;
                    case 4:
                        params['responsive'][breakpoints['xlarge']]['loop'] = false;
                        params['responsive'][breakpoints['xlarge']]['nav'] = false;
                    case 5:
                        params['responsive'][breakpoints['xxlarge']]['loop'] = (itemLength === 5 && inner);
                        params['responsive'][breakpoints['xxlarge']]['nav'] = (itemLength === 5 && inner);
                        break;
                }
            }
            $self.data('owlParams', params);
            if (!(variation && !itemLength)) {
                $self.owlCarousel(params);
            }
        });
    }
    if ($productPack.length) {
        $productPack.each(function(){
            var $self = $(this),
                params = {
                    items: 1,
                    margin: -1,
                    responsive: {},
                };
            params['responsive'][breakpoints['xlarge']] = {
                items: 2,
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: 3,
            };
            $self.owlCarousel(params);
        });
    }
    if ($productSet.length) {
        $productSet.each(function(){
            var $self = $(this),
                params = {
                    items: 1,
                    margin: -1,
                    responsive: {}
                };
            params['responsive'][breakpoints['medium']] = {
                items: 2
            };
            params['responsive'][breakpoints['large']] = {
                items: 3
            };
            params['responsive'][breakpoints['xlarge']] = {
                items: 4
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: 5
            };
            $self.owlCarousel(params);
        });
    }
    if ($productCompare.length) {
        var itemLength = $productCompare.children('.item').length,
            $compareTd = $('.compare-table-td'),
            heightArr = [],
            params = {
            items: 1,
            margin: -1,
            navText: [],
            responsive: {},
            mouseDrag: false,
        };
        params['responsive'][breakpoints['medium']] = {
            items: 2,
        };
        params['responsive'][breakpoints['xlarge']] = {
            items: 3,
            nav: true,
            dots: false,
        };
        params['responsive'][breakpoints['xxlarge']] = {
            items: 4,
            nav: true,
            dots: false,
        };
        switch (itemLength) {
            case 1:
                params['dots'] = false;
            case 2:
                params['responsive'][breakpoints['medium']]['dots'] = false;
                break;
        }
        
        $compareTd.each(function(){
            var $td = $(this),
                index = $td.index(),
                heightColumn = $td.find('.column:not(.transparent)').outerHeight();

            if ((heightColumn > heightArr[index]) || (heightArr[index] === undefined)) {
                heightArr[index] = heightColumn;
            }
        });
        $compareTd.each(function(){
            var $td = $(this),
                index = $td.index(),
                $column = $td.find('.column:not(.transparent, .hide-for-large)');

            if ($column.length) {
                $column.css('height', heightArr[index]);
            }
        });
        
        $productCompare.owlCarousel(params);
    }
    if ($innerGallery.length) {
        $innerGallery.each(function() {
            var $self = $(this),
                itemLength = $self.children('.item').length,
                params = {
                    items: 2,
                    margin: 15,
                    loop: true,
                    navText: [],
                    responsive: {},
                };

            params['responsive'][breakpoints['large']] = {
                nav: true,
                dots: false,
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: 3,
                nav: true,
                dots: false,
            };
            switch (itemLength) {
                case 1:
                case 2:
                    params['loop'] = false;
                    params['dots'] = false;
                    params['responsive'][breakpoints['large']]['nav'] = false;
                case 3:
                    params['responsive'][breakpoints['xxlarge']]['nav'] = false;
                    break;
            }
            $self.owlCarousel(params);
        });
    }
    if ($innerTeam.length) {
        $innerTeam.each(function() {
            var $self = $(this),
                itemLength = $self.children('.item').length,
                params = {
                    items: 1,
                    loop: true,
                    navText: [],
                    responsive: {},
                };

            params['responsive'][breakpoints['medium']] = {
                items: 2,
            };
            params['responsive'][breakpoints['large']] = {
                items: 3,
            };
            params['responsive'][breakpoints['xxlarge']] = {
                items: 4,
                nav: true,
                dots: false,
            };
            switch (itemLength) {
                case 1:
                case 2:
                    params['loop'] = false;
                    params['dots'] = false;
                case 4:
                    params['responsive'][breakpoints['xxlarge']]['nav'] = false;
                    break;
            }
            $self.owlCarousel(params);
        });
    }
}

function initOwlGift(){
    var $self = $('.sale-products-gift');

    $self.data('visibleCount', {
        small: 1,
        medium: 2,
        large: 3,
        xlarge: 4,
        xxlarge: 5
    });

    if ($self.length) {
        $self.wrap('<div class="sale-products-gift-carousel disabled"></div>');
        $self.wrap('<div class="sale-products-gift-outer"></div>');
        var $carousel = $('.sale-products-gift-carousel'),
            $owlNav = $('<div/>', {
                class: "owl-nav"
            }).appendTo($carousel),
            $prev = $('<div/>', {
                id: "sale-products-gift-carousel-prev",
                class: "owl-prev disabled"
            }).appendTo($owlNav),
            $next = $('<div/>', {
                id: "sale-products-gift-carousel-next",
                class: "owl-next disabled"
            }).appendTo($owlNav);

        $prev.click(function(){
            var scroll = $self.data('scroll'),
                width = $self.data('width'),
                visibleCount = $self.data('visibleCount'),
                visibleWidth = 240 * visibleCount[Foundation.MediaQuery.current],
                scrollEnd = width - visibleWidth;

            if (scroll > 0) {
                scroll -= 240;
                $self.css('transform', 'translateX(' + -scroll + 'px)');
                if (scroll <= 0) {
                    $prev.addClass('disabled');
                }
                if (scroll < scrollEnd) {
                    $next.removeClass('disabled');
                }
                $self.data('scroll', scroll);
            }
        });
        $next.click(function(){
            var scroll = $self.data('scroll'),
                width = $self.data('width'),
                visibleCount = $self.data('visibleCount'),
                visibleWidth = 240 * visibleCount[Foundation.MediaQuery.current],
                scrollEnd = width - visibleWidth;

            if (scroll < scrollEnd) {
                scroll += 240;
                $self.css('transform', 'translateX(' + -scroll + 'px)');
                if (scroll > 0) {
                    $prev.removeClass('disabled');
                }
                if (scroll >= scrollEnd) {
                    $next.addClass('disabled');
                }
                $self.data('scroll', scroll);
            }
        });
        $(window).resize(updateOwlGift);
        $('.sale-products-gift').on("DOMSubtreeModified", updateOwlGift);
    }
};

function updateOwlGift(){
    var $self = $('.sale-products-gift'),
        itemsCount = $self.find('.product-item').length,
        width = itemsCount * 240,
        visibleCount = $self.data('visibleCount'),
        visibleWidth = 240 * visibleCount[Foundation.MediaQuery.current];

    $self.data({
        scroll: 0,
        width: width
    });
    $self.css('transform', 'translateX(0)');
    if (itemsCount) {
        $('.sale-products-gift-carousel').removeClass('disabled');
    } else {
        $('.sale-products-gift-carousel').addClass('disabled');
    }
    $('#sale-products-gift-carousel-prev').addClass('disabled');
    if (width > visibleWidth) {
        $('#sale-products-gift-carousel-next').removeClass('disabled');
    } else {
        $('#sale-products-gift-carousel-next').addClass('disabled');
    }
};

function removeOwlItem($self){
    var $owlCarousel = $self.closest('.owl-carousel'),
        $item = $self.closest('.owl-item'),
        index = $item.index();

    $item.find('.product-pack-change').toggleClass('remove add');
    var item = $item.html();
    $owlCarousel.trigger('remove.owl.carousel', index);
    $owlCarousel.trigger('refresh.owl.carousel');
    $owlCarousel.trigger('next.owl.carousel');
    return item;
}

function setPackVariation(target) {
    var $parentSet = target.parents('.set_group_block'),
        $mobileButton = $parentSet.find('.product-pack-mobile-button');
    $('.product-pack').removeClass('edit');
    $('.product-pack-caption.apply').hide();
    $mobileButton.children('.product-pack-set-variation').css('display','none');
    $mobileButton.children('.product-pack-get-variation').show();
    $parentSet.find('.product-pack-caption.change').show();
    $parentSet.find('.product-pack-variation').slideUp();
}

function setFilter() {
    if ($('html').hasClass('slideout-filter')) {
        if (slideout.isOpen()) {
            slideout.close();
        }
        $("body,html").delay(200).animate({scrollTop: $('#catalog-content').offset().top - 70}, 400);
    }
}

$(document).ready(function() {
    watchFunction = function(funName) {
        $(window).resize(function() {
            funName();
        });
        funName();
    };

    $.fancybox.showLoading = function(){
        var $fLoading = $('#fancybox-loading');

        if (!$fLoading.length) {
            $('<div id="fancybox-loading" class="fancybox-loading fancybox-loading-overlay"><div class="md-preloader"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" height="44" width="44" viewBox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="4"></circle></svg></div></div>').appendTo("body");
        }
    };
    
    $.fancybox.hideLoading = function(){
        var $fLoading = $('#fancybox-loading');

        if ($fLoading.length) {
            $fLoading.remove();
        }
    };
    
    $.fancybox.showOverlay = function(){
        var $fBg = $('#fancybox-bg');

        if (!$fBg.length) {
            $('body').addClass('compensate-for-scrollbar');
            $fBg = $('<div id="fancybox-bg" class="fancybox-bg fancybox-bg-overlay"></div>').appendTo("body");

        }
    };
    
    $.fancybox.hideOverlay = function(){
        var $fBg = $('#fancybox-bg');

        if ($fBg.length) {
            $fBg.remove();
            $('body').removeClass('compensate-for-scrollbar');
        }
    };
    
    $.fn.extend({
        mouseParallax: function(options) {
            var defaults = {
                    speed: 5,
                    vertical: true
                };
            options = $.extend(defaults, options);

            return this.each(function() {
                var $self = $(this),
                    dataSpeed = $self.attr('data-speed'),
                    dataVertical = $self.attr('data-vertical'),
                    speed = (dataSpeed !== undefined) ? parseInt(dataSpeed) : options.speed,
                    vertical = (dataVertical !== undefined) ? (dataVertical === 'true') : options.vertical;

                //background.parent()
                $('body').on('mousemove', function(e){
                    if ($self.closest('.owl-item').hasClass('active')) {
                        mouseX = e.pageX;
                        mouseY = e.pageY;

                        centerH = $(window).width() / 2;
                        centerV = $(window).height() / 2;

                        // (координаты курсора относительно центральной линии экрана)/ ("50" - 1% = 50px) * скорость * ("0.05" - коэффициент ускорения)
                        percentX = (centerH - mouseX) / 50 * speed * 0.05;
                        percentY = (centerV - mouseY) / 50 * speed * 0.05;

                        if (vertical) {
                            $self.css('transform', 'translate(' + percentX + '%,' + percentY + '%)');
                        } else {
                            $self.css('transform', 'translateX(' + percentX + '%)');
                        }
                    }
                });
            });
        }
    });
    
    $(document).foundation();

    var windowWidth = $(window).width(),
        foundationScreenOld = Foundation.MediaQuery.current,
        scrTop = 0,
        $scrollUpDown = $(".scroll-up-down"),
        $cookie = $('.cookie'),
        $page = $('#page'),
        $mobileMenu = $('#mobile-menu'),
        $customMenu = $('#custom-menu'),
        $headerMainMenu = $('#header-main-menu'),
        $headerMainMenuBlock = $headerMainMenu.find('.main-menu-block'),
        $headerMainMenuOther = $headerMainMenu.find('.main-menu-other'),
        $headerMainMenuFull = $('#header-main-menu-full'),
        $headerMenuFixed = $('.header-menu-fixed'),
        $headerMobileFixed = $('.header-mobile-fixed'),
        $headerMenuWrap = $('#header-main-menu-wrap'),
        $headerBannerTop = $('.promo-block-top'),
        $productGrid = $('.products-flex-grid'),
        $cFilter = $('#catalog-filter'),
        isFilterTip = ($cFilter.attr('data-filter-tip') !== undefined),
        isHorizontal = $('.catalog-wrapper').hasClass('catalog-wrapper--horizontal');
    window['var'] = {
        bxPanelHeight: 0,
        menuOffsetTop: 0,
        menuScrollTop: 0,
        menuPositionTop: $headerMenuFixed.position().top,
        menuHeight: $headerMenuFixed.outerHeight(),
        bannerTopHeight: ($headerBannerTop.length) ? $headerBannerTop.outerHeight() : 0,
        isMenuFixed: $page.hasClass('menu-fixed')
    };
    window['func'] = {};
    slideout = new Slideout({
        'panel': document.getElementById('page'),
        'menu': document.getElementById('mobile-menu'),
        'padding': 260,
        'tolerance': 70
    });
    
    initOwl();
    
    //Все, что связано с шаблоном
    var $productGrid = $('.products-flex-grid'),
        $bannerGrid = $('.main-banner-grid');

    if ($productGrid.length) {
        $('.products-flex-grid.sortable-grid').sortable({
            update: function(e, ui){
                var params = '',
                    $sortBlock = ui.item.closest('.products-flex-grid.sortable-grid'),
                    url = $sortBlock.attr('data-url');
                
                $sortBlock.find('input[name="product_position"], input[name="banner_position"]').each(function() {
                    params = params + '|' + $(this).val();
                });
                url = url.replace('productpositions=', 'productpositions=' + params);
                window.location.href = url;
                applyChange();
            }
        });
    }
    if ($bannerGrid.length) {
        $('.main-banner-grid.sortable-grid').sortable({
            update: function(e, ui){
                var params = '',
                    $sortBlock = $('.main-banner-grid.sortable-grid'),
                    url = $sortBlock.attr('data-url');
                
                $sortBlock.find('input').each(function() {
                    params = params + '|' + $(this).val();
                });
                url = url.replace('bannerpositions=', 'bannerpositions=' + params);
                window.location.href = url;
                applyChange();
            }
        });
    }
    
    if ($.inArray(foundationScreenOld, ['xlarge', 'xxlarge']) !== -1) {
        slideout.disableTouch();
    }
    
    initCatalogSelect();
    initFancybox();
    if ($("section").hasClass("cart-simply")) {
        initSelect('select');
    } else {
        initSelect('select:not([name=PROFILE_ID]):not([name=PERSON_TYPE]):not([data-init=Y])');
    }
    initPhone();
    initZip();
    
    $(document).on('click', '.fancybox-cancel', function(e){
        $.fancybox.close();
        e.preventDefault();
    });
    
    $(document).on('click', '.preview-button', function(e){
        var $self = $(this);
        if ($self.attr('data-href') !== undefined) {
            $.fancybox.open({
                type: 'ajax',
                src: $self.attr('data-href'),
                afterLoad: function(instance, current) {
                    current.$content.css('display', 'inline-block');
                },
                touch: false
            });
            e.preventDefault();
        }
    });
    
    $(document).on('click', '.show-href', function(e){
        var $self = $(this);
        $self.closest('.fancybox-block').hide();
        $($self.attr('href')).show();
        e.preventDefault();
    });
    
    $(document).click(function(e){
        var $dropdown = $('.dropdown-custom.is-open');
    
        if ($dropdown.length && !$dropdown.has(e.target).length) {
            $dropdown.removeClass('is-open');
        }
    });
    
    $('#geolocation-confirm').on('hide.zf.dropdown', function(){
        $('.geolocation-link').removeClass('is-active');
    });
    
    $(document).on('click', '.header-search-toggle', function(e){
        $('.header-mobile-search').toggleClass('is-active');
        e.preventDefault();
    });
    
    $(document).on('click', '.scrollto', function(){
        var data = $(this).data(),
            $target = $(data['target']);
    
        if ($target.length) {
            $("html,body").animate({scrollTop: $target.offset().top}, 300);
            if (data['action'] !== undefined) {
                $target.trigger(data['action']);
            }
        }
    });
    
    function initProductGrid($elements){
        if ($elements.length){
            $elements.each(function(){
                var $element = $(this);
    
                if ((foundationScreenOld === 'small') && ($element.hasClass('small-down-2'))) {
                    if ($element.data('isotope') !== undefined) {
                        $element.isotope('destroy');
                    }
                } else {
                    $element.isotope({
                        itemSelector: '.isotope-item',
                        masonry: {
                            columnWidth: 240
                        },
                        animationOptions: {
                            duration: 0,
                            easing: 'linear',
                            queue: false
                        },
                        transitionDuration: $productGrid.hasClass('sortable-grid') ? 0 : '0.4s'
                    });
                }
            });
        }
    }
    
    /**
     * Позиционирование декоративного треугольника в скрытом меню относительно ссылки-вызова
     */
    function mainMenuArrowPosition(){
        var left = $headerMainMenuOther.offset().left,
            width = $headerMainMenuOther.width();
    
        $('.main-menu-dropdown-arrow').css({'left': left + width/2 - 10});
    }
    
    /**
     * Функция отвечает за перемещение категорий главного меню в скрытую или видимую часть
     *
     * @param action {string} show - переместить в видимое меню|hide - переместить в скрытое меню
     */
    function hsMainMenuItems(action) {
        if ($headerMainMenu.is(':visible')) {
            var $headerBase = $headerMainMenu.find('.main-menu-base'),
                $headerFullCont = $headerMainMenuFull.find('.container'),
                $mainSlider = $('.main-slider'),
                innerHeight = (foundationScreenOld === 'xxlarge') ? 500 : 450,
                maxWidth = parseInt($headerMainMenuBlock.css('maxWidth')),
                maxHeight = (($mainSlider.length) ? $mainSlider.height() + 20 : innerHeight) - 45,
                baseWidth = $headerBase.width() - 16,
                baseHeight = $headerBase.height(),
                isVertical = ($headerMainMenu.parent('.main-menu-dropdown-wrap').length);
    
            /**
             * Перемещение категории в скрытое меню
             */
            function hideMainMenuItems(){
                var $replaceItem = $headerBase.find('.main-menu-category:last-child');
    
                if ($headerMainMenuOther.hasClass('hide')) {
                    $headerMainMenuOther.removeClass('hide');
                }
                if ($replaceItem.length) {
                    $headerFullCont.prepend($replaceItem);
                    hsMainMenuItems('hide');
                }
            }
    
            /**
             * Перемещение категории в видимое меню
             */
            function showMainMenuItems(){
                var $replaceItem = $headerFullCont.find('.main-menu-category:first-child');
    
                if (!$headerMainMenuOther.hasClass('hide')) {
                    $headerMainMenuOther.addClass('hide');
                }
                if ($replaceItem.length) {
                    $headerBase.append($replaceItem);
                    hsMainMenuItems('show');
                }
            }
    
            if (action === 'hide') {
                if (isVertical) {
                    if (baseHeight > maxHeight) {
                        hideMainMenuItems();
                        $headerMainMenuFull.on('closeme.zf.dropdown', function(){
                            return false;
                        });
                    }
                } else {
                    if (baseWidth > maxWidth) {
                        hideMainMenuItems();
                    }
                }
            }
            if (action === 'show') {
                if (isVertical) {
                    if (baseHeight <= maxHeight) {
                        showMainMenuItems();
                    } else {
                        hsMainMenuItems('hide');
                    }
                } else {
                    if (baseWidth <= maxWidth) {
                        showMainMenuItems();
                    } else {
                        hsMainMenuItems('hide');
                    }
                }
            }
            mainMenuArrowPosition();
        }
    }
    
    /**
     * Скрытие избыточного количества категорий меню каталога
     */
    function hCatalogMenuItems() {
        var $catalogMainMenu = $('#catalog-main-menu');
    
        if ($catalogMainMenu.length) {
            var $catalogBase = $catalogMainMenu.find('.main-menu-base'),
                $catalogOther = $catalogMainMenu.find('.main-menu-other'),
                $catalogMainMenuFull = $('#catalog-main-menu-full'),
                $catalogFullCont = $catalogMainMenuFull.find('.container');
    
            while ($catalogBase.children('.main-menu-category').length > 9) {
                $catalogFullCont.prepend($catalogBase.children('.main-menu-category:last-child'));
                if ($catalogOther.hasClass('hide')) {
                    $catalogOther.removeClass('hide');
                }
            }
            $catalogMainMenuFull.on('closeme.zf.dropdown', function(){
                return false;
            });
        }
    }
    
    window.func.headerFixed = function(){
        var top = '';
    
        if ($.inArray(foundationScreenOld, ['xlarge', 'xxlarge']) !== -1) {
            if ($page.hasClass('header-v1') || $page.hasClass('header-v2')) {
                window.var.menuHeight = $headerMenuFixed.outerHeight();
            }
            if (scrTop > window.var.menuPositionTop + window.var.menuScrollTop) {
                $headerMenuFixed.css('top', window.var.menuOffsetTop);
                $page.addClass('is-fixed');
                if ($page.hasClass('index-page') && $page.hasClass('header-v3')) {
                    if ($headerMenuWrap.hasClass('is-open') && !$headerMenuWrap.hasClass('open-to-click') && !$headerMenuWrap.hasClass('open-to-hover')) {
                        $headerMenuWrap.foundation('close');
                    }
                }
            } else {
                $headerMenuFixed.css('top', 0);
                $page.removeClass('is-fixed');
                if ($page.hasClass('index-page') && $page.hasClass('header-v3')) {
                    $headerMenuWrap.removeClass('open-to-click');
                    if (!$headerMenuWrap.hasClass('is-open')) {
                        $headerMenuWrap.foundation('open');
                    }
                }
            }
        }
        if ($.inArray(foundationScreenOld, ['small', 'medium', 'large']) !== -1) {
            $page.addClass('is-fixed');
            $headerMenuFixed.css('top', top);
            if (window.var.menuScrollTop) {
                top = (scrTop > window.var.menuScrollTop) ? 0 : window.var.menuScrollTop - scrTop;
            }
        }
        $headerMobileFixed.css('top', top);
    };
    
    if (window.var.isMenuFixed) {
        window.func.headerFixed();
        slideout.on('beforeopen', function(){
            $headerMobileFixed.css('top', (scrTop > window.var.menuScrollTop) ? scrTop - window.var.menuScrollTop : 0);
        });
        slideout.on('close', function(){
            $headerMobileFixed.css('top', (window.var.menuScrollTop) ? ((scrTop > window.var.menuScrollTop) ? 0 : window.var.menuScrollTop - scrTop) : '');
        });
        if (window.BX !== undefined && BX.admin !== undefined) {
            var BxPanel,
                headerFixedBX = function () {
                    var mobileTop = 0;
                    window.var.bxPanelHeight = BxPanel.DIV.clientHeight;
    
                    if (BxPanel.isFixed()) {
                        window.var.menuOffsetTop = window.var.bxPanelHeight;
                        window.var.menuScrollTop = window.var.bannerTopHeight + 0;
                        mobileTop += window.var.bxPanelHeight;
                    } else {
                        window.var.menuOffsetTop = 0;
                        window.var.menuScrollTop = window.var.bxPanelHeight + window.var.bannerTopHeight;
                        mobileTop = (scrTop >= window.var.bxPanelHeight) ? 0 : window.var.bxPanelHeight - scrTop;
                    }
                    $mobileMenu.css({
                        top: mobileTop,
                        height: window.innerHeight - mobileTop
                    });
                    window.func.headerFixed();
                };
    
            BX.ready(function () {
                BxPanel = BX.admin.panel;
                BX.addCustomEvent('onTopPanelCollapse', BX.delegate(headerFixedBX, this));
                BX.addCustomEvent('onTopPanelFix', BX.delegate(headerFixedBX, this));
                headerFixedBX();
            });
        }
        if ($headerBannerTop.length) {
            window.var.menuScrollTop = window.var.bannerTopHeight;
        }
    }
    
    hsMainMenuItems('hide');
    hCatalogMenuItems();
    
    if ($page.hasClass('index-page') && $page.hasClass('header-v3') && $headerMenuWrap.length) {
        $headerMenuWrap.foundation('open');
        $headerMenuWrap.on('hide.zf.dropdown', function(){
            if (!$page.hasClass('is-fixed')) {
                $headerMenuWrap.foundation('open');
            }
        });
        $('.header-main-menu-button').click(function(){
            if ($page.hasClass('is-fixed')) {
                $headerMenuWrap.addClass('open-to-click');
            } else {
                return false;
            }
        });
        if ($page.hasClass('menu-fixed')) {
            $headerMenuWrap.hover(function(){
                $headerMenuWrap.addClass('open-to-hover');
            },function(){
                $headerMenuWrap.removeClass('open-to-hover');
                if ($page.hasClass('is-fixed') && !$headerMenuWrap.hasClass('open-to-click')) {
                    $headerMenuWrap.foundation('close');
                }
            });
        }
    }
    
    function menuFilterToggle(inMobile)
    {
        $('#catalog-filter').prependTo((inMobile) ? $mobileMenu : $('#catalog-filter-wrapper'));
        $mobileMenu.find('.mobile-menu-wrapper').toggleClass('hide');
        $('html').toggleClass('slideout-filter');
    }
    
    function menuFilterToggleOnce()
    {
        menuFilterToggle(true);
        slideout.open();
        slideout.once('close', function(){
            menuFilterToggle();
        });
    }
    
    $('.header-mobile-toggle').on('click', function() {
        $customMenu.removeClass('active');
        if (slideout.isOpen() && $('html').hasClass('slideout-filter')) {
            slideout.close();
            slideout.once('close', function(){
                slideout.open();
            });
        } else {
            slideout.toggle();
        }
    });
    
    $(document).on('click', '.filter-mobile-toggle', function(e){
        $customMenu.removeClass('active');
        if (slideout.isOpen()) {
            if ($('html').hasClass('slideout-filter')) {
                slideout.close();
            } else {
                slideout.close();
                slideout.once('close', function(){
                    menuFilterToggleOnce();
                });
            }
        } else {
            menuFilterToggleOnce();
            initSlider();
        }
        e.preventDefault();
    });
    
    $(document).on('open.zf.drilldown', function(){
        $mobileMenu.animate({scrollTop: 0}, 200);
    });
    
    $scrollUpDown.click(function(e){
        $('body, html').animate({scrollTop: 0}, 200);
        e.preventDefault();
    });
    
    $cookie.click(function(e){
        $scrollUpDown.css('marginBottom', 0);
        e.preventDefault();
    });
    
    $(window).resize(function() {
        var windowWidthNew = $(this).width(),
            foundationScreenNew = Foundation.MediaQuery.current;
    
        if (window.var.isMenuFixed && $headerBannerTop.length) {
            window.var.bannerTopHeight = $headerBannerTop.outerHeight();
            window.var.menuScrollTop = window.var.bannerTopHeight;
        }
        if (windowWidthNew > windowWidth) {
            hsMainMenuItems('show');
        }
        if (windowWidthNew < windowWidth) {
            hsMainMenuItems('hide');
        }
        if (foundationScreenOld !== foundationScreenNew) {
            if (($.inArray(foundationScreenOld, ['small', 'medium', 'large']) !== -1)
                && ($.inArray(foundationScreenNew, ['xlarge', 'xxlarge']) !== -1)) {
                if (slideout.isOpen()) {
                    slideout.close();
                }
                slideout.disableTouch();
            }
            if (($.inArray(foundationScreenNew, ['small', 'medium', 'large']) !== -1)
                && ($.inArray(foundationScreenOld, ['xlarge', 'xxlarge']) !== -1)) {
                if ($page.hasClass('is-fixed')) {
                    $page.removeClass('is-fixed');
                }
                slideout.enableTouch();
            }
            foundationScreenOld = foundationScreenNew;
            if (window.var.isMenuFixed) {
                $page.removeClass('is-fixed');
                window.var.menuHeight = $headerMenuFixed.outerHeight();
                window.var.menuPositionTop = $headerMenuFixed.position().top;
                if (headerFixedBX !== undefined) {
                    headerFixedBX();
                } else {
                    window.func.headerFixed();
                }
            }
            initProductGrid($('.products-flex-grid'));
            $scrollUpDown.css('marginBottom', ($cookie.is(':visible') ? $cookie.outerHeight() : 0));
        }
        windowWidth = windowWidthNew;
    
        $('.tracker').data('largeimage', false);
        checkAccordionTabs(foundationScreenNew);
    });
    
    $(window).scroll(function() {
        scrTop = window.pageYOffset;
        if (scrTop > 250) {
            $scrollUpDown.fadeIn();
        } else {
            $scrollUpDown.fadeOut();
        }
        if (window.var.isMenuFixed) {
            if (headerFixedBX !== undefined) {
                headerFixedBX();
            } else {
                window.func.headerFixed();
            }
        }
    });
    
    //Сетка продуктов на главной
    
    $('.main-product-tabs .tabs').on('change.zf.tabs', function(e, $tab) {
        var index = $tab.index(),
            target = $tab.find('a').attr('href'),
            $productGrid = $(target + ' .products-flex-grid'),
            $productCarousel = $(target + ' .product-carousel');
    
        $tab.closest('.main-product-tabs').find('.select-tabs option').eq(index).prop('selected', true).trigger('refresh');
        initProductGrid($productGrid);
        if ($productCarousel.length) {
            $productCarousel.trigger('refresh.owl.carousel');
        }
    });
    
    $(document).on('change', '.main-product-tabs select.select-tabs', function(){
        var target = $(this).find('option:selected').val();
        var tabType = $(this).find('option:selected').attr('data-tab-type');
        $('.main-product-tabs .tabs').foundation('selectTab', $(target));
        initDeferTab(tabType);
    });
    
    if ($cFilter.length) {
        $(document).on('click', '.set-filter', function(e){
            e.preventDefault();
            setFilter();
        });

        // Сворачивание блоков в Фильтре в Каталоге
        $(document).on('click', '.catalog-filters__block .heading', function(e){
            e.preventDefault();
    
            var $self = $(this),
                $parent = $self.parents('.catalog-filters__block');
    
            if (isHorizontal) {
                var $showed = $('.catalog-filters__block.showed');
                if (!$showed.is($parent)) {
                    $showed.toggleClass('showed').find('.body').slideToggle('fast');
                }
            }
                $('.filter-tip').css('display', 'none');
            $parent.toggleClass('showed').find('.body').slideToggle('fast');
            if (!$self.hasClass('showed') || $parent.find('.slider').hasClass('reinit')) {
                initSlider();
            }
        });
    }
    
    $('.search-from-header-button').click(function(e){
        $(this).toggleClass('active');
        $('.search-from-header-wrap').toggleClass('active');
    });
    
    $(document).on('click', '.breadcrumbs a[data-toggle]', function(e){
        var $self = $(this);
    
        if (($.inArray(foundationScreenOld, ['small', 'medium', 'large']) !== -1)) {
            if (!$self.hasClass('visited')) {
                $self.addClass('visited');
                e.preventDefault();
            }
        }
    });

    $('.product-breadcrumbs-dropdown').on('hide.zf.dropdown', function(e, $handle){
        $('a[data-toggle="' + $handle.attr('id') + '"]').removeClass('visited');
    });
    
    $('body').on('click', function(e){
        var $target = $(e.target),
            $filterTip = $('.filter-tip');

        if ($filterTip.length && !$target.closest('.filter-tip').length) {
            $('.filter-tip').css('display', 'none');
        }
        if (isHorizontal) {
            var $showed = $('.catalog-filters__block.showed');

            if ($showed.length && !$target.closest($showed).length) {
                $showed.toggleClass('showed').find('.body').slideToggle('fast');
                $('.filter-tip').css('display', 'none');
            }
        }
    });

    //Все, что связано с карточкой товара
    
    initProductPreviewZoom();
    
    initTimer();
    
    initSlider();
    
    initProductGrid($productGrid);
    
    setTimeout (function() {
        initLazyLoad();
    }, 500);
    
    $(document).on('click', '.product-preview-zoom', function(e){
        var previews = [],
            activeIndex = 0;
        $('.product-slider:visible .item:not([data-content="video"])').each(function(){
            var $self = $(this);
            previews.push({
                src: $self.attr('href'),
                opts: {
                    thumb: $self.attr('href')
                }
            });
            if ($self.hasClass('active')) {
                activeIndex = $self.parent().index();
            }
        });
        $.fancybox.open(previews, {
            infobar: false,
            smallBtn: true,
            backFocus: false,
            thumbs: {
                autoStart: true,
                axis: "x"
            }
        }, activeIndex);
        e.preventDefault();
    });
    
    $(document).on('click', '.product-slider .item', function(e){
        var $self = $(this),
            type = $self.attr('data-content'),
            tag = (type == 'video') ? 'iframe' : 'img';
    
        if (!$self.hasClass('active')) {
            var $contentBlock = $('.product-preview-main-content');
            $contentBlock.removeClass('active');
            $contentBlock.filter('.' + type).addClass('active');
    
            $('.product-slider .item').removeClass('active');
            $('.product-preview-main ' + tag).attr('src', $self.attr('href'));
            $self.addClass('active');
    
            if (type == 'video') {
                $('.product-preview-zoom').addClass('invisible');
            } else {
                $('.product-preview-zoom').removeClass('invisible');
            }
        }
        e.preventDefault();
    });
    
    $(document).on('click', '.product-info-social a', function(e){
        $('.' + $(this).attr('href')).click();
        e.preventDefault();
    });
    
    //Все, что связано с блоком "Набор"
    
    $(document).on('click', '.product-pack-get-variation', function(e){
        var $parentSet = $(this).parents('.set_group_block'),
            $variation = $parentSet.find('.product-pack-variation'),
            $carouselVariation = $parentSet.find('.product-carousel'),
            $mobileButton = $parentSet.find('.product-pack-mobile-button');

        $parentSet.find('.product-pack').addClass('edit');
        $parentSet.find('.product-pack-caption.change').hide();
        $mobileButton.children('.product-pack-get-variation').hide();
        $mobileButton.children('.product-pack-set-variation').css('display','inline-block');
        $parentSet.find('.product-pack-caption.apply').show();
        if ($carouselVariation.data('owl.carousel') !== undefined) {
            if ($carouselVariation.data('owl.carousel')._items.length > 0) {
                $variation.slideDown();
            }
        }

        e.preventDefault();
    });
    
    $(document).on('click', '.product-pack-set-variation', function(e){
        setPackVariation($(this));
        e.preventDefault();
    });
    
    //Синхронизация Аккардиона и Табов
    
    function checkAccordionTabs(foundationScreen){
        var $content = $('.product-accordion-tabs-content'),
            $items   = $('.product-accordion-tabs-item'),
            $wraps   = $('.product-accordion-tabs-wrap');
    
        if ($.inArray(foundationScreen, ['small', 'medium', 'large']) != -1) {
            if ($content.hasClass('tabs-content')) {
                $content.removeClass('tabs-content').addClass('accordion').attr('data-accordion');
                $items.addClass('accordion-item').removeClass('tabs-panel');
                $wraps.addClass('accordion-content').hide();
                $items.filter('.is-active').children('.product-accordion-tabs-wrap').show();
            }
        } else {
            if ($content.hasClass('accordion')) {
                $content.removeAttr('data-accordion').removeClass('accordion').addClass('tabs-content');
                $items.removeClass('accordion-item').addClass('tabs-panel');
                $wraps.removeClass('accordion-content').show();
            }
        }
    }
    
    checkAccordionTabs(foundationScreenOld);
    
    $(document).on('click', '.product-accordion-tabs .accordion-title', function(){
        var $self = $(this),
            $tabsTitle  = $('.product-accordion-tabs .tabs-title'),
            $activeLink = $tabsTitle.children('a[href="#' + $self.attr('id') + '"]');
        $tabsTitle.removeClass('is-active');
        $tabsTitle.children().removeAttr('aria-selected');
        $activeLink.attr('aria-selected', 'true');
        $activeLink.parent().addClass('is-active');
        setTimeout(function(){
            $("body,html").animate({scrollTop: $self.offset().top}, 200);
        }, 250);
    });

    var BxPanel,
        customCalc = function(){
            var panelTop = 0, // отступ "Настройки решения" от верхней границы. Граница = край окна || панель управления Bitrix || шапка сайта на мобиле || закрепленное меню
                offsetTop = 0, // расстояние, равное высоте панели управления Bitrix || высота шапки сайта на мобиле || высота закрепленного меню
                pageYOffset = window.pageYOffset,
                headerHeight = $('header').innerHeight(),
                foundationScreen = Foundation.MediaQuery.current;
    
            if (BxPanel !== undefined) {
                offsetTop += window.var.bxPanelHeight;
    
                if (pageYOffset >= offsetTop && BxPanel.isFixed() === false) {
                    panelTop += 0;
                } else if (BxPanel.isFixed() === true) {
                    panelTop += window.var.bxPanelHeight;
                } else {
                    panelTop = panelTop + window.var.bxPanelHeight - pageYOffset;
                }
            }
            if ($.inArray(foundationScreen, ['small', 'medium', 'large']) !== -1) {
                if (window.var.isMenuFixed) {
                    if ($headerBannerTop.length) {
                        offsetTop += window.var.bannerTopHeight;
                        if (pageYOffset >= offsetTop) {
                            panelTop += headerHeight;
                        } else {
                            panelTop = panelTop + headerHeight + window.var.bannerTopHeight - pageYOffset;
                        }
                    } else {
                        panelTop += headerHeight;
                    }
                } else {
                    offsetTop += headerHeight + window.var.bannerTopHeight;
                    if (offsetTop >= pageYOffset) {
                        panelTop = offsetTop - pageYOffset;
                    }
                }
            }
            if (window.var.isMenuFixed) {
                if ($.inArray(foundationScreen, ['xlarge', 'xxlarge']) !== -1) {
                    if (pageYOffset > window.var.menuPositionTop) {
                        panelTop += window.var.menuHeight;
                    }
                }
            }
            $customMenu.css({
                top: panelTop,
                height: window.innerHeight - panelTop
            });
        };
    window.onscroll = customCalc;
    window.onresize = customCalc;
    if (window.BX !== undefined && BX.admin !== undefined) {
        BX.ready(function(){
            BxPanel = BX.admin.panel;
            BX.addCustomEvent('onTopPanelCollapse',BX.delegate(customCalc,this));
            BX.addCustomEvent('onTopPanelFix',BX.delegate(customCalc,this));
        });
    }
    setTimeout(customCalc, 100);
    
    function changePositions() {
        var params = '',
            $sortBlock = $("#custom-menu .sortable"),
            url = $sortBlock.attr('data-url');
        
        $sortBlock.find('input[type=checkbox]').each(function() {
            var $parent = $(this).closest('.sortable-item'),
                isVisible = ($(this).prop('checked')) ? '1' : '0';
            params = params + '|' + $(this).val() + '-' + isVisible;
        });
        url = url.replace('positions=', 'positions=' + params);
        var tab = $("#custom-menu .custom-tabs-panel.is-active").prop('id');
        window.location.href = url + '&tab=' + tab;
        applyChange();
    }
    
    $(document).on('click', '#custom-toggle', function(){
        $('#custom-menu').toggleClass('active').promise().done(function(){
            if (window.customCalc !== undefined) {
                customCalc();
            }
        });
    });
    
    $(document).on('change', '.custom-option', function(){
        if ($(this).hasClass('custom-visible')) {
            changePositions();
        } else {
            var tab = $("#custom-menu .custom-tabs-panel.is-active").prop('id');
            window.location.href = $(this).val() + '&tab=' + tab;
            applyChange();
        }
    });
    
    var $colorpicker = $('#colorpicker'),
        $colorpickers = $('.colorpicker-element'),
        colorpickerParams = {
            format: 'hex',
            align: 'left',
            inline: true,
            sliders: {
                saturation: {
                    maxLeft: 150,
                    maxTop: 150
                },
                hue: {maxTop: 150}
            },
            container: '#custom-menu'
        };
    if ($colorpickers.length) {
        $colorpickers.each(function(){
            var $self = $(this);
    
            colorpickerParams['container'] = $self.attr('data-wrap');
            $self.colorpicker(colorpickerParams);
        });
        $colorpickers.on('changeColor', function(e){
            var $self = $(e.target),
                color = e.color.toHex().slice(1);
    
            $($self.attr('data-hex')).val(color);
            $self.addClass('change');
        });
        $('.colorpicker-input').inputmask({mask: 'ffffff', definitions: {'f': {validator: "[0-9a-fA-F]"}}});
        $(document).on('change', '.colorpicker-input', function(){
            var $self = $(this);
    
            $('.colorpicker-element[data-hex="#' + $self.attr('id') + '"]').colorpicker('setValue', '#' + $self.val());
        });
        $colorpicker.on('show.zf.dropdown', function(){
            $('.colorpicker-icon').removeClass('checked');
        });
        $colorpicker.on('hide.zf.dropdown', function(){
            if ($colorpickers.filter('.change').length > 0) {
                $('.colorpicker-icon').addClass('checked');
                $('.radio-color input[type="radio"]').prop('checked', false);
                var primary = $('#hex-color-primary').val().replace('_', '');
                var secondary = $('#hex-color-secondary').val().replace('_', '');
                var url = $('.colorpicker-icon').attr('data-url') + '&primary=' + primary + '&secondary=' + secondary;
                var tab = $("#custom-menu .custom-tabs-panel.is-active").prop('id');
                window.location.href = url + '&tab=' + tab;
                applyChange();
            }
        });
        $('.custom-tabs-panel').on('scroll', colorpickerClose);
        $('#custom-tabs').on('change.zf.tabs', colorpickerClose);
        function colorpickerClose(){
            if ($colorpicker.hasClass('is-open')) {
                $colorpicker.foundation('close');
            }
        }
    }
    
    $(".sortable").sortable({
        items: '.sortable-item:not(.sortable-disabled)',
        placeholder: 'sortable-placeholder',
        cancel: '.sortable-invisible',
        forcePlaceholderSize: true,
        update: function(){
            changePositions();
        }
    });
    
    $('.sortable-grid').sortable({
        containment: '#page',
        placeholder: 'sortable-placeholder',
        start: function(e, ui){
            var item  = ui.item;
    
            ui.placeholder.addClass(ui.item.attr('class')).removeClass('ui-sortable-handle');
            if (item.hasClass('main-banner-item')) {
                item.removeClass('main-banner-item');
                item.data('class', 'main-banner-item');
            }
            if (item.hasClass('isotope-item')) {
                item.removeClass('isotope-item');
                item.data('class', 'isotope-item');
            }
            ui.placeholder.css({
                top: ui.originalPosition.top,
                left: ui.originalPosition.left
            });
            $(e.target).isotope('reloadItems');
        },
        change: function(e){
            $(e.target).isotope('reloadItems').isotope({sortBy: 'original-order'});
        },
        stop: function(e, ui){
            var item  = ui.item;
    
            item.addClass(item.data('class')).css('zIndex','');
            $(e.target).isotope('reloadItems').isotope({sortBy: 'original-order'});
        }
    });
    
    $('.sortable-banner').sortable({
        items: '.owl-item',
        placeholder: 'sortable-placeholder owl-item',
        start: function(e, ui){
            ui.placeholder.css({
                width: ui.item.width(),
                height: ui.item.height(),
                marginRight: 20
            });
        },
        update: function(e, ui){
            var params = '',
                $sortBlock = $('.main-banner.sortable-banner'),
                url = $sortBlock.attr('data-url');
            
            $sortBlock.find('input').each(function() {
                params = params + '|' + $(this).val();
            });
            url = url.replace('bannerpositions=', 'bannerpositions=' + params);
            window.location.href = url;
            applyChange();
        }
    });
    
    $(document).on('change', '.sortable input[type="checkbox"]', function(e){
        $(this).parent('.sortable-item').toggleClass('sortable-invisible');
        e.preventDefault();
    });
});