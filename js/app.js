define(['jquery', 'bootstrap', 'sweetalert2', 'jqueryEasing'], function (){
    'use strict';
    var App = {
        initialize: function () {
            this.events();
        },
        events: function () {
            this.toggleMenu();
            this.setCarouselOptions();
            this.submitContactForm();
            this.listenForFormChanges();
            this.scrollToAnchor();
        },
        scrollToAnchor: function () {
            $('a.page-scroll').on('click', function(event) {
                var $anchor = $(this);
                $('html, body').stop().animate({
                    scrollTop: ($($anchor.attr('href')).offset().top)
                }, 1250, 'easeInOutExpo');
                event.preventDefault();
            });
        },
        toggleMenu: function () {
            var $menuList = [];
            $('.toggle-menu').on('click', function () {
                $menuList = $('.menu-list');
                if ($menuList.height() === 0) {
                    var currentHeight = $menuList.height(),
                        autoHeight = $menuList.css('height', 'auto').height();
                
                    $menuList.height(currentHeight);
                    $menuList.stop().animate({ height: autoHeight }, 200);
                } else {
                    $menuList.stop().animate({"height": 0}, 200);
                }
            });
            $(window).on("resize", function () {
                $menuList = $('.menu-list');
                $menuList.css({'height': 0});
            });
        },
        setCarouselOptions: function () {
            $('.carousel').carousel({
                interval: 10000
            });
        },
        submitContactForm: function () {
            $('#submit').on("click", function (e) {
                e.preventDefault();
                $.ajax({
                    url: 'php/contact_us.php',
                    data: {
                        name: $('#name').val(),
                        email: $('#email').val(),
                        phone: $('#phone').val(),
                        message: $('#message').val(),
                        'g-recaptcha-response': $("#g-recaptcha-response").val()
                    },
                    type: 'post',
                    success: function() {
                        // put your swal Success here with w/e message you want.
                        swal('Email Sent!', 'A Representative from SEI will contact you shortly.', 'success');
                    },
                    error: function (response) {
                        var errorMessage = '';

                        switch (response.status) {
                            case 400:
                                errorMessage = "Please fill out all fields before submitting."
                                break;
                            case 403: 
                                errorMessage = "Failed to verify reCaptcha.";
                                break; 
                            default:
                                errorMessage = "An error has occurred, try again later."
                        }
                        // Put your swal Error here (Hint: user errorMessage for your message).
                        swal('Oh-no!', errorMessage, 'error');
                    }
                });
            });
        },
        listenForFormChanges: function () {
            var that = this;
            if (document.querySelector('form') !== null) {
                $('#contactForm').on("keyup", function () {
                    that.tryToActivateFormSubmitBtn(that);
                });
                grecaptcha.render(
                    document.querySelector('.g-recaptcha-wrapper'),
                    {
                        callback: function (response) {
                            that.tryToActivateFormSubmitBtn(that);
                        },
                        sitekey: "6Lc-1BITAAAAAIM8B0IlyS2OZE8-H4tsfXHa5O9F"
                    } 
                );
            } 
        },
        tryToActivateFormSubmitBtn: function (that) {     
            if (that.validateFormData() && grecaptcha.getResponse().length !== 0) {
                $('#submit').removeAttr('disabled');
            } else {
                $('#submit').attr('disabled', 'disabled');
            }
        },
        validateFormData: function () {
            var formData = document.querySelectorAll('#contactForm .form-control');
            for (var i = 0 ; i < formData.length; i++) {
                if (!formData[i].validity.valid) {
                    $(formData[i]).siblings('.help-block').empty().append('Please provide ' + 
                        $('label[for=' + formData[i].getAttribute('id') + ']').html() + 
                        ' i.e., ' + 
                        $(formData[i]).attr('data-example'));
                    return false;
                } else {
                    $(formData[i]).siblings('.help-block').empty();
                }
            }
            return true;
        }
    };
    App.initialize();
    
    return App;
});