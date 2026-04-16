const VIEW = {

    showSection: function (sectionID) {

        const $CURRENT = $('section.active');
        const $NEXT = $('#' + sectionID);

        if ($CURRENT.length) {
            $CURRENT.fadeOut(300, function () {
                $CURRENT.removeClass('active');
                $NEXT.addClass('active').fadeIn(300);
            });

        } else {
            $NEXT.addClass('active').fadeIn(300);
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