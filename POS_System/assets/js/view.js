const VIEW = {

    showSection: function (sectionID) {
        $('section').hide();
        $('#' + sectionID).show();
    },

    showLoginError: function (message) {
        $('#loginError').text(message).show();
    },

    hideLoginError: function () {
        $('#loginError').hide();
    },

    clearLoginForm: function () {
        $('#emailInput').val('');
        $('#passwordInput').val('');
    }
}