const VIEW = {

    showSection: function (sectionID) {
        const $CURRENT = $('section.active');
        const $NEXT = $('#'+sectionID);

        if ($CURRENT.length) {
            $CURRENT.css('opacity', '0');

            setTimeout(() => {
                $CURRENT.removeClass('active');

                $NEXT.addClass('active').css('opacity', '0');

                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        $NEXT.css('opacity', '1');
                    });
                });
            }, 400);
        } else {
            $NEXT.addClass('active').css('opacity', '1');
        }
    },

    showLoginError: function (message) {
        $('#loginError').text(message).fadeIn(200);
    },

    hideLoginError: function () {
        $('#loginError').hide();
    },

    clearLoginForm: function () {
        $('#emailInput').val('');
        $('#passwordInput').val('');
    },

    setWelcomeName: function (name) {
        $('#welcomeName').text(name);
    }
}