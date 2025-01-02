function getNewsItems(elem, containerName, reload) {
    if (!$(elem).hasClass('ajax-loading')) {
        $(elem).addClass('ajax-loading');
    } else {
        return false;
    }
    $.ajax({
        type: 'GET',
        url: $(elem).attr('data-ajax'),
        success: function(data) {
            if (reload === true) {
                $('#' + containerName).html(data);
            } else {
                $('#' + containerName).append(data);
            }
            $(elem).removeClass('ajax-loading');
        }
    });
}

function showFilterLoading() {
    $('#catalog-content').addClass('loading');
    $('#catalog-preloader').show();
    $('.filter-tip').css('display', 'none');
}
function hideFilterLoading() {
    $('#catalog-content').removeClass('loading');
    $('#catalog-preloader').hide();
}

function getCatalogItems(elem, block, reload, tab, init) {
    if (!$(elem).hasClass('ajax-loading')) {
        $(elem).addClass('ajax-loading');
    } else {
        return false;
    }
    var url = $(elem).attr('data-ajax');
    if (!url) {
        url = $(elem).attr('href');
    }
    var reloadIsotope = false;
    var isHistory = true;
    var urlHistory = url.replace('&load=Y', '');
    urlHistory = urlHistory.replace('?load=Y&', '?');
    urlHistory = urlHistory.replace('?load=Y', '');
    if (tab !== true) {
        if (!(window.history && history.pushState)) {
            isHistory = false;
        }
    }
    if (isHistory === true) {
        if (reload === true) {
            showFilterLoading();
        }
        $.ajax({
            type: 'GET',
            url: url,
            success: function(data) {
                if (tab !== true) {
                    history.replaceState(null, null, urlHistory);
                }
                if (reload === true) {
                    $(block).html(data).foundation();
                    initSelect(block + ' select');
                    initCatalogSelect();
                    hideFilterLoading();
                    if ($('.products-flex-grid').length > 0) {
                        if (Foundation.MediaQuery.current !== 'small' || !$('.products-flex-grid').hasClass('small-down-2')) {
                            reloadIsotope = true;
                        }
                    }
                } else {
                    if (tab === true) {
                        if ($('.products-flex-grid').hasClass('sortable-grid')) {
                            $(block).append($(data).find('.products-flex-grid').html());
                            $('.products-flex-grid.sortable-grid').sortable("refresh");
                        } else {
                            $(block).append($(data).find('.content-scripts').html());
                            $(block).append($(data).html());
                            var blockGrid = ($(block).hasClass('product-grid')) ? $(block) : $(block).find('.product-grid');
                            if (Foundation.MediaQuery.current !== 'small' || !$(blockGrid).hasClass('small-down-2')) {
                                reloadIsotope = true;
                            }
                        }
                        $(elem).parent().find(".sticky-container").remove();
                    } else {
                        $(block).append($(data).find(block).html());
                    }
                    if ($('#catalog-content .catalog-footer').length > 0) {
                        $('#catalog-content .catalog-footer').html($(data).find('.catalog-footer').html());
                    }
                }
                if ($('.products-flex-grid').length > 0) {
                    if (reload !== true) {
                        var gridBlock = (init === true) ? elem + '.products-flex-grid' : '.products-flex-grid';
                        if ($(gridBlock).data('isotope') !== undefined) {
                            reloadIsotope = true;
                            $(gridBlock).isotope('reloadItems');
                            
                        }
                    }
                    if (reloadIsotope) {
                        $('.products-flex-grid').isotope(productGridOptions);
                    }
                } else if (init === true) {
                    initOwl();
                }
                if (init === true) {
                    $(block).addClass('init-load');
                }
                if ($('.product-list-item .dropdown-pane').length > 0) {
                    $('.product-list-item .dropdown-pane').foundation();
                }
                $(elem).removeClass('ajax-loading');
                updateAdd2Basket();
                updateAdd2Liked();
                updateAdd2Compare();
                initTimer();
                if ($("#page").hasClass("page-lazy")) {
                    setTimeout (function() {
                        initLazyLoad();
                    }, 500);
                }
            }
        });
        return false;
    } else {
        window.location.href = urlHistory;
    }
}

function beforSubmitRegistration(formBlock) {
    if ("hidden" == formBlock.find('input[name=USER_LOGIN]').attr('type')) {
        var email = formBlock.find('input[name=USER_EMAIL]').val();
        formBlock.find('input[name=USER_LOGIN]').val(email);
    }
    var fullName = formBlock.find('input[name=USER_FULL_NAME]').val().split(' ');
    formBlock.find('input[name=USER_LAST_NAME]').val(fullName[0].trim());
    delete fullName[0];
    formBlock.find('input[name=USER_NAME]').val(fullName.join(' ').trim());
}

function initValidateOrder(formId, rulesArray) {
   $(formId).validate({
        rules: rulesArray,
        onsubmit: false,
        highlight: function( element ){
            $(element).addClass('error');
        },
        unhighlight: function( element ){
            $(element).removeClass('error');
        },
        submitHandler: function( form ){
            return true;
        },
        errorPlacement: function( error, element ){
            $.fancybox.hideLoading();
            $.fancybox.hideOverlay();
            return false;
        }
    });
}

function initValidateWithRules(formId, rulesArray) {
   $(formId).validate({
        rules: rulesArray,
        highlight: function( element ){
            $(element).addClass('error');
        },
        unhighlight: function( element ){
            $(element).removeClass('error');
        },
        submitHandler: function( form ){
            switch (formId) {
                case "#registration-static form":
                case "#registration form":
                case ".registration-block form":
                    beforSubmitRegistration($(form));
                    break;
            }
            return true;
        },
        errorPlacement: function( error, element ){
            return false;
        }
    });
}

function initValidate(formId) {
    var rulesArray = false;
    switch (formId) {
        case "#main-feedback-form":
            var rulesArray = {
                user_name: {
                    required: true,
                    minlength: 2,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                user_email: {
                    required: true,
                    email: true,
                    minlength: 2
                },
                main_feedback_user_consent: {
                    required: true
                },
                captcha_word: {
                    required: true
                },
                MESSAGE: {
                    required: true,
                    minlength: 4
                }
            };
            break;
        case "#login-static form":
        case "#login form":
            var rulesArray = {
                USER_LOGIN: {
                    required: true
                },
                USER_PASSWORD: {
                    required: true
                },
                auth_authorize_user_consent: {
                    required: true
                }
            };
            break;
        case "#registration-static form":
        case "#registration form":
            var rulesArray = {
                USER_FULL_NAME: {
                    required: true,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                USER_LOGIN: {
                    required: true,
                    email: true,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                USER_PASSWORD: {
                    required: true,
                    minlength: 6,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                USER_CONFIRM_PASSWORD: {
                    required: true,
                    minlength: 6,
                    equalTo: '.registration-form input[name=USER_PASSWORD]',
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                captcha_word: {
                    required: true,
                },
                auth_registration_user_consent: {
                    required: true,
                }
            };
            break;
        case "#confirmation form":
            var rulesArray = {
                login: {
                    required: true,
                    email: true
                },
                confirm_code: {
                    required: true
                },
                auth_confirm_user_consent: {
                    required: true
                }
            };
            break;
        case "#forgot form":
            var rulesArray = {
                captcha_word: {
                    required: true
                },
                auth_forgotpasswd_user_consent: {
                    required: true
                }
            };
            break;
        case "#change form":
            var rulesArray = {
                USER_LOGIN: {
                    required: true
                },
                USER_CHECKWORD: {
                    required: true
                },
                USER_PASSWORD: {
                    required: true,
                    minlength: 6
                },
                USER_CONFIRM_PASSWORD: {
                    required: true,
                    minlength: 6,
                    equalTo: '#change input[name=USER_PASSWORD]'
                },
                captcha_word: {
                    required: true
                },
                auth_changepasswd_user_consent: {
                    required: true
                }
            };
            break;
        case "#profile-pass":
            var rulesArray = {
                NEW_PASSWORD: {
                    required: true,
                    minlength: 6
                },
                NEW_PASSWORD_CONFIRM: {
                    required: true,
                    minlength: 6,
                    equalTo: '#profile-pass input[name=NEW_PASSWORD]'
                },
                personal_password_user_consent: {
                    required: true
                }
            };
            break;
        case "#profile-data":
            var rulesArray = {
                LAST_NAME: {
                    required: true,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                NAME: {
                    required: true,
                    normalizer: function(value) {
                        tmpValue = $.trim(value);
                        if (0 >= tmpValue.length) {
                            this.value = tmpValue;
                        }
                        return this.value;
                    }
                },
                EMAIL: {
                    required: true,
                    email: true
                },
                PHONE_NUMBER: {
                    required: true
                },
                personal_user_consent: {
                    required: true
                }
            };
            break;
        case "#buy-to-click-form":
            var rulesArray = {
                NAME: {
                    required: true,
                    minlength: 3,
                },
                PHONE: {
                    required: true
                },
                buy1click_user_consent: {
                    required: true
                }
            };
            break;
        case "#form_subscr_footer":
            var rulesArray = {
                sf_EMAIL: {
                    required: true,
                    email: true
                },
                subscribe_edit_small_user_consent: {
                    required: true
                }
            };
            break;
        case "#form_subscr_personal":
            var rulesArray = {
                EMAIL: {
                    required: true,
                    email: true
                },
                subscribe_user_consent: {
                    required: true
                }
            };
            break;
        case "#form_subscr_setting":
            var rulesArray = {
                EMAIL: {
                    required: true,
                    email: true
                }
            };
            break;
        case "#form_subscr_sendpassword":
            var rulesArray = {
                sf_EMAIL: {
                    required: true,
                    email: true
                }
            };
            break;
        case "#form_subscr_auth":
            var rulesArray = {
                sf_EMAIL: {
                    required: true,
                    email: true
                },
                AUTH_PASS: {
                    required: true
                }
            };
            break;
        default:
            break;
    }
    if (rulesArray !== false) {
        initValidateWithRules(formId, rulesArray);
    }
}

function initTimer() {
    var $actionTimer = $('.product-action-banner.timer');
    if ($actionTimer.length) {
        $actionTimer.each(function(){
            var $self = $(this),
                $hour = $self.find('.hour strong'),
                $min = $self.find('.min strong'),
                $sec = $self.find('.sec strong'),
                today = new Date();
                timeEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

            function timer($hour, $min, $sec, timeEnd) {
                var timeNow = new Date(),
                    timeLeft = new Date(timeEnd - timeNow),
                    timeLeftSec = parseInt(timeLeft / 1000),
                    timeLeftMin = parseInt(timeLeftSec / 60),
                    timeLeftHour = parseInt(timeLeftMin / 60);

                $hour.text(int2num(timeLeftHour));
                $min.text(int2num(timeLeftMin - (timeLeftHour * 60)));
                $sec.text(int2num(timeLeftSec - (timeLeftMin * 60)));
            }
            setInterval(function(){
                timer($hour, $min, $sec, timeEnd);
            }, 1000);
        });
    }
}

function initProductPreviewZoom() {
    if ($(".product-preview-main img.zoom").length) {
        $(".product-preview-main img.zoom").each(function(){
            var $self = $(this);
    
            if ($self.is(':visible')) {
                $self.imagezoomsl({
                    showstatus: false,
                    magnifiereffectanimate: "fadeIn",
                    loopspeedanimate: 1
                });
            }
        });
    }
}

function initSelect(block) {
    $(block).styler({
        singleSelectzIndex: 20
    });
    $(block).attr('data-init', 'Y');
}

function initCatalogSelect() {
    $('.catalog-filters-select').styler({
        singleSelectzIndex: 10,
        onSelectOpened: function(){
            var $self = $(this),
                $dropdown = $self.children('.jq-selectbox__dropdown'),
                height = $self.children('.jq-selectbox__select').outerHeight();
    
            if ($self.hasClass('dropdown')) {
                $dropdown.css('top', height);
            }
            if ($self.hasClass('dropup')) {
                $dropdown.css('bottom', height);
            }
        }
    });
}

function initFancybox() {
    $('.fancybox:not([disabled],.disabled)').fancybox({
        smallBtn: "auto",
        backFocus: false,
        touch: false
    });
    
    $('[data-fancybox]').fancybox({
        infobar: false,
        smallBtn: true,
        backFocus: false,
        thumbs: {
            autoStart: true,
            axis: "x"
        }
    });
}

function initPhone() {
    $('input.phone').inputmask('+7 (999) 999-9999');
    $('#bx-soa-order input[autocomplete=tel]').inputmask('+7 (999) 999-9999');
}

function initZip() {
    $('input.zip').inputmask({"mask": "999 999", "removeMaskOnSubmit" : 1});
    $('#bx-soa-order input[autocomplete=zip]').inputmask({"mask": "999 999", "removeMaskOnSubmit" : 1});
}

function initSlider()
{
    var $slider = $('.slider');
    if ($slider.length) {
        $slider.each(function () {
            var $self = $(this);

            if ($self.is(':visible') && ($self.data('init') !== true)) {
                new Foundation.Slider($self);
                $self.data({
                    'init': true,
                    'changed': 0
                });
            } else if ($self.hasClass('reinit')) {
                $self.removeClass('reinit');
            }
        });
    }
}

function initLazyLoad(selector){
    selector = selector || '.lazy';
    var $lazy = $(selector);

    if ($lazy.length) {
        $lazy.lazy({
            afterLoad: function(e){
                e.addClass('is-load');
            }
        });
    }
}

function updateAdd2Basket() {
    $('.add2cart span').html(NL_ADD_TO_BASKET_BUTTON);
    $('.add2cart').attr('href', 'javascript:;');
    $('.add2cart').removeClass('in_basket');
    if ($('.add2cart').length > 0 && $('.basket_products div').length > 0) {
        $('.basket_products div').each(function(){
            var productId = $(this).attr('data-product-id');
            $('.add2cart[data-product-id=' + productId + '] span').html(NL_ADD_TO_BASKET);
            $('.add2cart[data-product-id=' + productId + ']').attr('href', NL_ADD_TO_BASKET_URL);
            $('.add2cart[data-product-id=' + productId + ']').addClass('in_basket');
        });
    }
}

function updateAdd2Liked() {
    if ($('#bx_favorite_count').length > 0 && $('.liked_products div').length > 0) {
        $('.liked_products div').each(function(){
            var productId = $(this).attr('data-product-id');
            $('.add2liked[data-product-id=' + productId + '] span').html(NL_ADD_2_LIKED_DELETE);
            $('.add2liked[data-product-id=' + productId + ']').attr('title', NL_ADD_2_LIKED_DELETE);
            $('.add2liked[data-product-id=' + productId + ']').addClass('active');
        });
    }
}

function loadLiked() {
    if ($('#bx_fancybox_blocks #liked').length > 0) {
        $.ajax({
            url: $('#bx_fancybox_blocks #liked').attr('data-ajax'),
            success: function(data){
                $('#bx_fancybox_blocks #liked').replaceWith(data);
                $('.add2liked.add2liked_fancybox').attr('href', '#liked');
                $('#bx_favorite_count_mini .add2likedmini_fancybox').attr('href', '#liked');
            }
        });
    }
}

function updateAdd2Compare() {
    if ($('#bx_compare_count').length > 0 && $('.compare_products div').length > 0) {
        $('.compare_products div').each(function(){
            var productId = $(this).attr('data-product-id');
            $('.add2compare[data-product-id=' + productId + '] span').html(NL_ADD_2_COMPARE);
            $('.add2compare[data-product-id=' + productId + ']').attr('title', NL_ADD_2_COMPARE);
            $('.add2compare[data-product-id=' + productId + ']').attr('href', NL_ADD_2_COMPARE_URL);
            $('.add2compare[data-product-id=' + productId + ']').addClass('active');
        });
    }
}

function preview2Basket($self) {
    if ($self) {
        $self.addClass('in_basket');
        if ($self.attr('data-preview') !== undefined) {
            var $preview = $($self.attr('data-preview') + ':visible'),
                $cart = $('.header-cart:visible');

            if ($preview.length) {
                $preview.clone().css({
                    'position':'absolute',
                    'top':$preview.offset().top,
                    'left':$preview.offset().left,
                    'z-index':3,
                    'max-width':'200px'
                }).appendTo('#page').animate({
                    'top' :$cart.offset().top,
                    'left':$cart.offset().left,
                    'width':'75px'
                }, 700, function(){
                    $(this).remove();
                });
            }
        }
    }
}

function int2num(val) {
    return val < 10 ? '0' + val : val;
}

function inclination(n, s1, s2, s3) {
    var m = n % 10;
    var j = n % 100;
    if (m == 0 || m >= 5 || (j >= 10 && j <= 20)) return s3;
    if (m >= 2 && m <= 4) return s2;
    return s1;
}

function add2compare(productId, count, message, url) {
    var captionMini = count + ' ' + inclination(count, NL_PRODUCT_1, NL_PRODUCT_2, NL_PRODUCT_10);
    var caption = count + ' ' + inclination(count, NL_PRODUCT_1, NL_PRODUCT_2, NL_PRODUCT_10) + ' ' + NL_ADD_2_COMPARE_CAPTION;
    $(".add2compare[data-product-id=" + productId + "] span").html(message);
    $(".add2compare[data-product-id=" + productId + "]").attr('title', message);
    $(".add2compare[data-product-id=" + productId + "]").attr('href', url);
    $(".add2compare[data-product-id=" + productId + "]").addClass('active');
    $('#bx_compare_count .compare_products').append('<div data-product-id="' + productId + '"></div>');
    if (count > 0) {
        if ($("#page").hasClass("header-v1") || $("#page").hasClass("header-v3")) {
            $('#bx_compare_count .add2compare_counter').html(count);
        } else {
            $('#bx_compare_count .add2compare_counter').html(' (' + count + ')');
        }
        $('#bx_compare_count_mini .header-block-info-counter').html(count);
        $('#bx_compare_count_mini .header-block-info-counter').attr('title', captionMini);
    } else {
        $('#bx_compare_count span').html('');
        $('#bx_compare_count_mini .header-block-info-counter').html('');
        $('#bx_compare_count_mini .header-block-info-counter').attr('title', '');
    }
    $('#bx_compare_count_mini .header-block-info-desc').html(caption);
    $('#bx_compare_count_mini .header-block-info-desc').attr('title', caption);
}

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

if (window.frameCacheVars !== undefined) {
    BX.addCustomEvent("onFrameDataReceived" , function(json) {
        $('#bx_personal_menu .dropdown-pane').foundation();
        loadLiked();
        initFancybox();
        updateAdd2Basket();
        updateAdd2Liked();
        updateAdd2Compare();
        if (!!BX.UserConsent) {
            BX.UserConsent.loadFromForms();
        }
    });
} else {
    $(document).ready(function() {
        loadLiked();
        initFancybox();
        updateAdd2Basket();
        updateAdd2Liked();
        updateAdd2Compare();
    });
}

function setInfoCookie(name, value, options) {
    options = options || {};

    var expires = options.expires;

    if (typeof expires == "number" && expires) {
        var d = new Date();
        d.setTime(d.getTime() + expires * 1000 * 60 * 60 * 24);
        expires = options.expires = d;
    }
    if (expires && expires.toUTCString) {
        options.expires = expires.toUTCString();
    }

    value = encodeURIComponent(value);

    var updatedCookie = name + "=" + value;

    for (var propName in options) {
        updatedCookie += "; " + propName;
        var propValue = options[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue;
        }
    }

    document.cookie = updatedCookie;
}

function applyChange(){
    $.fancybox.showOverlay();
    $.fancybox.showLoading();
}

function initDeferTab(tabType) {
    if ($(".defer-tabs").length > 0) {
        if (!$(".product-grid-" + tabType).hasClass("ajax-loading") && !$(".product-grid-" + tabType).hasClass("init-load")) {
            getCatalogItems(".product-grid-" + tabType, ".product-grid-" + tabType, false, true, true);
        }
    }
}

$(document).ready(function() {
    var initSlider = false;
    var initSliderCount = 0;
    
    if ($('section').hasClass('fancy')) {
        if ($('article #login-static').hasClass('fancybox-block-login') && $('article').hasClass('cart-container-order')) {
            $('article.cart-container-order').attr('class', 'inner-container float-center table-container');
        }
        $('article .fancybox-block:not(.delivery-form, .del-delivery, .all-history, #notify-subscriber)').show();
    }
    
    $(document).on('click', '#bx_cookie_info .cookie-close', function(e){
        setInfoCookie("bitlate-cookie-info", 1, {expires: 365 * 10, path: '/'});
        return false;
    });
    
    $('#catalog-filter .slider').on('moved.zf.slider', function(e, handle){
        if (handle.attr('aria-valuenow') == handle.attr('aria-valuemax') || handle.attr('aria-valuenow') == handle.attr('aria-valuemin')) {
            $("#" + handle.attr('aria-controls')).val('');
        }
    })
    
    $('#catalog-filter .slider').on('changed.zf.slider', function(e, handle){
        initSliderCount++;
        if (!initSlider) {
            if (initSliderCount >= $('#catalog-filter .slider').length) {
                initSlider = true;
            }
        } else {
            if (!$("#catalog-content").hasClass("loading")) {
                smartFilter.reload($("#" + handle.attr('aria-controls')).get(0));
            }
        }
    });
    
    $(document).on('change', '.catalog-sorting select', function(e){
        var url = $(this).val();
        if (url != '') {
            var newSort = $(this).find('option:selected').attr('data-sort-code');
            $('#catalog-filter input[name=sort]').val(newSort);
            $(this).attr('data-ajax', url);
            $('#catalog-filter #set_filter').attr('href', $(this).attr('data-ajax'));
            getCatalogItems(this, '.catalog-reload', true);
            return false;
        }
    });
    
    $(document).on('click', '.catalog-view-select a', function(e){
        var newView = $(this).attr('data-view-code');
        $('#catalog-filter input[name=view]').val(newView);
        $('#catalog-filter #set_filter').attr('href', $(this).attr('data-ajax'));
        getCatalogItems(this, '.catalog-reload', true);
        return false;
    });
    
    $(document).on('click', '.catalog-show-count a', function(e){
        var newCount = $(this).attr('data-count-code');
        $('#catalog-filter input[name=PAGE_EL_COUNT]').val(newCount);
        $('#catalog-filter #set_filter').attr('href', $(this).attr('data-ajax'));
        getCatalogItems(this, '.catalog-reload', true);
        return false;
    });
    
    $(document).on('click', '.show-del-delivery', function(e){
        $('.message-block').addClass('hide');
        $('.confirm-block').removeClass('hide');
        $('#del-delivery form input[name=id]').val($(this).attr('data-id'));
    });
    
    $(document).on('click', '.add2liked_fancybox, .add2likedmini_fancybox', function(e){
        var $self = $(this);
        if ($self.attr('href') != "javascript:;") {
            $.fancybox.open({
                type: 'inline',
                backFocus: false,
                touch: false,
                src: $self.attr('href')
            })
        }
        e.preventDefault();
    })
    $(document).on('click', '.add2liked:not(.add2liked_fancybox), .remove2liked', function(e){
        var productId = $(this).attr('data-product-id'),
            sessid = BX.bitrix_sessid(),
            action = 'check';
        var isShowLoading = ($(this).hasClass('close-button')) ? true : false;
        if (productId && action) {
            if (isShowLoading) {
                $.fancybox.showLoading();
            }
            $.post($(this).attr('data-ajax'), {'action': action, 'ID': productId, 'sessid': sessid}, function(data) {
                if (data.success == true) {
                    if (data.type == 'add') {
                        $('.add2liked[data-product-id=' + productId + '] span').html(NL_ADD_2_LIKED_DELETE);
                        $('.add2liked[data-product-id=' + productId + '] title').html(NL_ADD_2_LIKED_DELETE);
                        $('.add2liked[data-product-id=' + productId + ']').attr('title', NL_ADD_2_LIKED_DELETE);
                        $('.add2liked[data-product-id=' + productId + ']').addClass('active');
                        $('#bx_favorite_count .liked_products').append('<div data-product-id="' + productId + '"></div>');
                        $('.add2liked.add2liked_fancybox').attr('href', 'javascript:;');
                        $('#bx_favorite_count_mini .add2likedmini_fancybox').attr('href', 'javascript:;');
                        $.ajax({
                            url: $('#liked').attr('data-ajax'),
                            success: function(data){
                                $('#bx_fancybox_blocks #liked').replaceWith(data);
                                $('.add2liked.add2liked_fancybox').attr('href', '#liked');
                                $('#bx_favorite_count_mini .add2likedmini_fancybox').attr('href', '#liked');
                                updateAdd2Basket();
                            }
                        });
                    } else {
                        $('.add2liked[data-product-id=' + productId + '] span').html(NL_ADD_2_LIKED);
                        $('.add2liked[data-product-id=' + productId + '] title').html(NL_ADD_2_LIKED);
                        $('.add2liked[data-product-id=' + productId + ']').attr('title', NL_ADD_2_LIKED);
                        $('.add2liked[data-product-id=' + productId + ']').removeClass('active');
                        $('#bx_favorite_count .liked_products div[data-product-id=' + productId + ']').remove();
                        if (!isShowLoading) {
                            $('#liked .cart-product-item[data-product-id=' + productId + ']').remove();
                        }
                    }
                    var captionMini = data.count + ' ' + inclination(data.count, NL_PRODUCT_1, NL_PRODUCT_2, NL_PRODUCT_10);
                    var caption = data.count + ' ' + inclination(data.count, NL_PRODUCT_1, NL_PRODUCT_2, NL_PRODUCT_10) + ' ' + NL_ADD_2_LIKED_CAPTION;
                    if (data.count > 0) {
                        if ($("#page").hasClass("header-v1") || $("#page").hasClass("header-v3")) {
                            $('header .add2liked .add2liked_counter').html(data.count);
                        } else {
                            $('header .add2liked .add2liked_counter').html(' (' + data.count + ')');
                        }
                        $('#bx_favorite_count_mini a .header-block-info-counter').html(data.count);
                        $('#bx_favorite_count_mini a .header-block-info-counter').attr('title', captionMini);
                    } else {
                        $('.add2liked.add2liked_fancybox').attr('href', 'javascript:;');
                        $('#bx_favorite_count_mini .add2likedmini_fancybox').attr('href', 'javascript:;');
                        $('header .add2liked span').html('');
                        $('#bx_favorite_count_mini a .header-block-info-counter').html('');
                        $('#bx_favorite_count_mini a .header-block-info-counter').attr('title', '');
                    }
                    $('#bx_favorite_count_mini a .header-block-info-desc').html(caption);
                    $('#bx_favorite_count_mini a .header-block-info-desc').attr('title', caption);
                    if (isShowLoading) {
                        $.fancybox.hideLoading();
                    }
                }
            }, 'json');
        }
        e.preventDefault();
    });
    
    // $(document).on('click', '.go2buy:not([disabled],.disabled)', function(e){
    //     var $self = $(this);
    //     var parentBlock = $(this).parent();
    //     $.fancybox.open({
    //         type: 'inline',
    //         src: $self.attr('href'),
    //         backFocus: false,
    //         touch: false,
    //         smallBtn: "auto",
    //         beforeLoad: function() {
    //             initPhone();
    //             if ($("#basket-root").length > 0) {
    //                 $("#buy-to-click input[name=cart]").val("Y");
    //             } else {
    //                 $("#buy-to-click input[name=cart]").val(parentBlock.find('input[name=cart]').val());
    //             }
    //             $("#buy-to-click input[name=id]").val(parentBlock.find('input[name=id]').val());
    //             $("#buy-to-click input[name=offer_id]").val(parentBlock.find('input[name=offer_id]').val());
    //             $("#buy-to-click input[name=props]").val(parentBlock.find('input[name=props]').val());
    //             $("#buy-to-click input[name=price]").val(parentBlock.find('input[name=price]').val());
    //             $("#buy-to-click input[name=currency]").val(parentBlock.find('input[name=currency]').val());
    //             $("#buy-to-click input[name=quantity]").val(parentBlock.parents('.product-container').find('.product-count input[name=count]').val());
    //             $("#buy-to-click .callout").remove();
    //             $("#buy-to-click .result-text").remove();
    //             $("#buy-to-click .form-block").show();
    //         }
    //     });
    // e.preventDefault();
    // });
    
    $(document).on('click', '#del-delivery .profile-remove', function(e){
        $.ajax({
            type: 'POST',
            url: $('#del-delivery form').attr('action'),
            data: $('#del-delivery form').serialize(),
            dataType: 'json',
            success: function(response){
                $('#del-delivery .message-block').removeClass('hide');
                $('#del-delivery .confirm-block').addClass('hide');
                if (response.success == 'N') {
                    if ($(response.error).length) {
                        $('#del-delivery .message-block').html(response.error);
                    }
                }
                if (response.success == 'Y') {
                    $('#del-delivery .message-block').html(response.message);
                    if ($('.profile-delivery-container .column').length > 0) {
                        $('.profile-delivery-container .column[data-id=' + response.id + ']').remove();
                        $('.profile-delivery-container .column .secondary').remove();
                        if ($('.profile-delivery-container .column').length > 0) {
                            $('.profile-delivery-container .column').eq(0).find('.profile-delivery-body').prepend($('#profile-default-text').html());
                        } else {
                            $('.profile-delivery-container').prepend($('#profile-empty-text').html());
                        }
                    } else {
                        $('.block-delivery .profile-block-list li[data-id=' + response.id + ']').remove();
                        $('.block-delivery .profile-block-list li .secondary').remove();
                        if ($('.block-delivery .profile-block-list li').length > 0) {
                            $('.block-delivery .profile-block-list li').eq(0).prepend($('#profile-default-text').html());
                            $('.block-delivery .profile-block-list li').eq(0).removeClass('hide');
                            $('.block-delivery .profile-block-list li').eq(1).removeClass('hide');
                        } else {
                            $('.block-delivery').prepend($('#profile-empty-text').html());
                        }
                    }
                }
            }
        });
        e.preventDefault();
    });
    
    $(document).on('click', '.delivery-form input[name=PERSON_TYPE]', function(e) {
        var curForm = $(this).parents('form');
        var curBlock = $(this).parents('.delivery-form');
        var curAction = curForm.attr('action');
        curForm.find('input[name=action]').val('change');
        $.ajax({
            type: 'POST',
            url: curForm.attr('data-ajax'),
            data: curForm.serialize(),
            success: function(data){
                curBlock.html($(data).html());
                curBlock.find('form').attr('action', curAction);
                if (!!BX.UserConsent) {
                    BX.UserConsent.loadFromForms();
                }
            }
        });
        e.preventDefault();
    })
    
    $(document).on('submit', '#form_subscr_personal', function(e) {
        var curForm = $(this);
        $.ajax({
            type: 'POST',
            url: curForm.attr('data-ajax'),
            data: curForm.serialize(),
            success: function(data){
                $(curForm).parents('.profile-block-wrap').html($(data));
                if (!!BX.UserConsent) {
                    BX.UserConsent.loadFromForms();
                }
            }
        });
        e.preventDefault();
    })
    
    $(document).on('click', '#registration-static .show-static, #login-static .show-static', function(e){
        if ($(this).attr('data-static') != undefined) {
            var idStatic = $(this).attr('data-static');
            $('article .fancybox-block').html($("#" + idStatic).html());
            if (!!BX.UserConsent) {
                BX.UserConsent.loadFromForms();
            }
            $('article .fancybox-block').attr('id', idStatic + '-static');
            $('article .fancybox-block input[name=static]').val("Y");
            $('article .fancybox-block .show-static').removeClass("fancybox");
            initValidate("#" + idStatic + '-static');
            initFancybox();
            e.preventDefault();
        }
    });
    
    $(document).on('click', '.inner-menu-filter .menu li a', function(e){
        if ($(this).parent().hasClass('active')) {
            e.preventDefault();
        }
        $('.inner-menu-filter .menu li').removeClass('active');
        $(this).parent().addClass('active');
        if ($(this).attr('data-ajax') != undefined) {
            getNewsItems($(this), $('.inner-content-list').attr('id'), true);
            e.preventDefault();
        }
    });
    
    $(document).on('submit', '#main-feedback-form', function(e) {
        var curForm = $(this);
        $.ajax({
            type: 'POST',
            url: curForm.attr('data-ajax'),
            data: curForm.serialize(),
            success: function(data){
                $('.feedback-container').replaceWith(data);
                if (!!BX.UserConsent) {
                    BX.UserConsent.loadFromForms();
                }
            }
        });
        e.preventDefault();
    });
    
    $(document).on('submit', '.custom_iblock_add, .fancybox-block-form, #subscribe-edit form', function(e) {
        var curForm = $(this);
        var curBlock = $(this).parents('.fancybox-block');
        var curCloseButton = curBlock.find(".fancybox-close-small");
        if ($(curForm).parents('#subscribe-edit').length > 0) {
            curBlock = $(this).parents('#subscribe-edit');
        }
        if (curForm.attr('data-ajax') != undefined) {
            if ($(curForm).parents('#service-order').length > 0) {
                $('#service-order input[data-property-code=PROPERTY_SERVICE]').val($('h1').html());
            }
            if ($(curForm).parents('#question').length > 0) {
                $('#question input[data-property-code=PROPERTY_URL]').val($('h1').html());
            }
            $.ajax({
                type: 'POST',
                url: curForm.attr('data-ajax'),
                data: curForm.serialize(),
                success: function(data){
                    if (curForm.attr("id") == "order-cancel") {
                        if (data.indexOf("advanced-container-medium") > 0) {
                            window.location.reload();
                            return;
                        }
                    }
                    curBlock.html(curCloseButton.outerHTML() + $(data).html());
                    if (!!BX.UserConsent) {
                        BX.UserConsent.loadFromForms();
                    }
                }
            });
            e.preventDefault();
        }
    });
    
    $(document).on('submit', '#login-static form, #login form, #registration-static.reload-form form, #registration.reload-form form, #forgot.reload-form form, #change.reload-form form, #confirmation form', function(e) {
        var curForm = $(this);
        var curBlock = $(this).parents('.fancybox-block');
        var curCloseButton = curBlock.find(".fancybox-close-small");
        if (curBlock.attr('id') == 'registration' || curBlock.attr('id') == 'registration-static') {
            beforSubmitRegistration(curBlock);
        }
        $.ajax({
            type: 'POST',
            url: curForm.attr('data-ajax'),
            data: curForm.serialize(),
            success: function(data){
                curBlock.find('.callout.error').remove();
                var result = $(data).find('.fancybox-block-result').html();
                if (result !== undefined) {
                    curBlock.append(result);
                    if (!!BX.UserConsent) {
                        BX.UserConsent.loadFromForms();
                    }
                    initFancybox();
                } else {
                    var resultForm = $(data).find("#" + curBlock.attr('id')).html();
                    if (resultForm == undefined) {
                        window.location.reload();
                    } else {
                        if (curBlock.attr('id') == 'registration' || curBlock.attr('id') == 'registration-static') {
                            var lastName = $(resultForm).find('input[name=USER_LAST_NAME]').val();
                            var name = $(resultForm).find('input[name=USER_NAME]').val();
                        }
                        curBlock.html(resultForm);
                        $(curBlock).find('.fancybox-block-caption').after($(data).find('.error-block').html());
                        curBlock.prepend(curCloseButton.outerHTML());
                        if (!!BX.UserConsent) {
                            BX.UserConsent.loadFromForms();
                        }
                        initValidate("#" + curBlock.attr('id'));
                        initFancybox();
                    }
                }
            }
        });
        e.preventDefault();
    });
    
    if ($(".profile-order-container").length > 0) {
        $(document).on('click', '.order-cancel-button', function(e){
            var $self = $(this);
            $.fancybox.open({
                type: 'ajax',
                src: $self.attr('data-ajax'),
                backFocus: false,
                touch: false,
                afterLoad: function(instance, current) {
                    $(".fancybox-content").css('display', 'inline-block');
                },
            });
            e.preventDefault();
        });
        
        $(document).on('click', '.sale-order-detail-about-order-inner-container-name-read-more', function(e){
            var orderBlock = $(this).parents(".profile-order-block");
            orderBlock.find(".sale-order-detail-about-order-inner-container-details").show();
            orderBlock.find(".sale-order-detail-about-order-inner-container-name-read-less").css('display', 'inline-block');
            $(this).css('display', 'none');
        });
        
        $(document).on('click', '.sale-order-detail-about-order-inner-container-name-read-less', function(e){
            var orderBlock = $(this).parents(".profile-order-block");
            orderBlock.find(".sale-order-detail-about-order-inner-container-details").hide();
            orderBlock.find(".sale-order-detail-about-order-inner-container-name-read-more").css('display', 'inline-block');
            $(this).css('display', 'none');
        });
        
        $(document).on('click', '.profile-order-action-more', function(e){
            var $self = $(this),
                orderId = $self.attr('data-id'),
                orderUrl = $self.attr('data-ajax'),
                $target = $("#profile-order-" + orderId),
                selfText = $self.text(),
                toggleText = $self.data('toggle-text');
            
            if (!$self.hasClass("profile-loading")) {
                if (orderUrl !== undefined) {
                    $.fancybox.showOverlay();
                    $.fancybox.showLoading();
                    $self.addClass("profile-loading");
                    $.ajax({
                        type: 'GET',
                        url: orderUrl,
                        success: function(data){
                            $self.text(toggleText).data('toggle-text', selfText);
                            $target.toggleClass('is-open');
                            $target.html($(data).find(".profile-order").html());
                            $.fancybox.hideLoading();
                            $.fancybox.hideOverlay();
                        }
                    });
                } else {
                    $self.text(toggleText).data('toggle-text', selfText);
                    $target.toggleClass('is-open');
                }
            }
            e.preventDefault();
        });
    }
    
    function orderInitCheck(inputSelector) {
        var orderInput = $(inputSelector);
        if (orderInput.length > 0) {
            var orderInputChecked = $(inputSelector + ":checked");
            orderInput.parent().addClass('radio-inline');
            orderInput.parent().removeClass('checked');
            orderInputChecked.parent().addClass('checked');
        }
    }
    
    function orderUpdateCheck(blockSelector, inputSelector) {
        $("body").on('DOMSubtreeModified', blockSelector, function() {
            var orderInput = $(inputSelector);
            var orderInputChecked = $(inputSelector + ":checked");
            if (orderInput.length > 0 && !orderInputChecked.parent().hasClass('checked')) {
                orderInput.parent().addClass('radio-inline');
                orderInput.parent().removeClass('checked');
                orderInputChecked.parent().addClass('checked');
            }
            initSelect('select:not([name=PROFILE_ID]):not([name=PERSON_TYPE]):not([data-init=Y])');
        })
    }
    
    if ($("#bx-soa-order-form").length > 0) {
        orderInitCheck("#bx-soa-region .form-group input[name=PERSON_TYPE]");
        orderInitCheck("#bx-soa-delivery input[name=DELIVERY_ID]");
        orderInitCheck("#bx-soa-paysystem input[type=checkbox]");
        orderInitCheck("#bx-soa-auth input[name=NEW_GENERATE]");
        orderInitCheck("#bx-soa-properties input[type=radio]");
        orderInitCheck("#bx-soa-properties input[type=checkbox]");
        
        orderUpdateCheck("#bx-soa-region", "#bx-soa-region .form-group input[name=PERSON_TYPE]");
        orderUpdateCheck("#bx-soa-paysystem", "#bx-soa-paysystem input[type=checkbox]");
        orderUpdateCheck("#bx-soa-auth", "#bx-soa-auth input[name=NEW_GENERATE]");
        orderUpdateCheck("#bx-soa-properties", "#bx-soa-properties input[type=radio]");
        orderUpdateCheck("#bx-soa-properties", "#bx-soa-properties input[type=checkbox]");
        
        BX.addCustomEvent("onAjaxSuccess", function() {
           orderInitCheck("#bx-soa-paysystem input[type=checkbox]");
           initSelect('select:not([name=PROFILE_ID]):not([name=PERSON_TYPE]):not([data-init=Y])');
           initPhone();
           initZip();
        });
        
        $(document).on('click', '#bx-soa-properties input[type=radio], #bx-soa-properties input[type=checkbox], #bx-soa-auth input[name=NEW_GENERATE]', function(e){
            orderInitCheck("#bx-soa-properties input[type=radio]");
            orderInitCheck("#bx-soa-properties input[type=checkbox]");
            orderInitCheck("#bx-soa-auth input[name=NEW_GENERATE]");
        });
    }
    
    if ($(".basket-wrap").length > 0) {
        initOwlGift();
    }
    
    $(document).on('click', '#review-link-add', function(e){
        $.fancybox.open({
            src: $(this).attr('href'),
        });
        e.preventDefault();
    });
    
    // if ($("#basket-root").length > 0) {
    //     $('<a/>',{'href':'#buy-to-click', 'class':'button secondary go2buy basket-btn-go2buy', 'html':$('#buy-to-click .fancybox-block-caption').text()}).appendTo('#basket-root .basket-checkout-block-btn');
    //     BX.addCustomEvent("onAjaxSuccess", function() {
    //         if ($('#basket-root .basket-checkout-block-btn .go2buy').length <= 0) {
    //             $('<a/>',{'href':'#buy-to-click', 'class':'button secondary go2buy basket-btn-go2buy', 'html':$('#buy-to-click .fancybox-block-caption').text()}).appendTo('#basket-root .basket-checkout-block-btn');
    //         }
    //     });
    // }
	
	$(document).on("click", ".catalog-wrapper a.detail-url", function() {
		if ($('.products-flex-item').length > 0) {
			var item = $(this).parents('.products-flex-item').attr('data-item');
		} else {
			var item = $(this).parents('.product-list-item').attr('data-item');
		}
		if (item !== undefined) {
			var link = location.href;
			if (link.indexOf('#') > -1) {
				link = link.split("#");
				link = link[0];
			}
			location.href = link + "#item" + item;
		}
	})
	
	if ($(".catalog-wrapper .last-page").length > 0) {
		$(".full-page .catalog-content .catalog-page-to-block").html($(".last-page .catalog-page-to-block").html());
		$(".full-page .catalog-content .catalog-load-more-block").html($(".last-page .catalog-load-more-block").html());
		$(".full-page .catalog-content .catalog-pagination-block").html($(".last-page .catalog-pagination-block").html());
		$(".last-page").remove();
		var link = location.href;
		if (link.indexOf('#item') > -1) {
			var item = link.split("#item");
			item = item[1];
			if ($('.products-flex-item').length > 0) {
				$("html,body").animate({scrollTop: ($(".products-flex-item[data-item='" + item + "']").offset().top)}, 500);
			} else {
				$("html,body").animate({scrollTop: ($(".product-list-item[data-item='" + item + "']").offset().top)}, 500);
			}
		}
	}
});