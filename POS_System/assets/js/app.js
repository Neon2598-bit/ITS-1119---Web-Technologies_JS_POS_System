$(document).ready(function () {

    VIEW.hideLoginError();

    $('.button-78').on('click', function () {

        const ENTERED_EMAIL = $('#emailInput').val().trim();
        const ENTERED_PASSWORD = $('#passwordInput').val().trim();

        if (!ENTERED_EMAIL || !ENTERED_PASSWORD) {
            // VIEW.showLoginError('Please Enter Both Email And Password');
            alert('Please Enter Both Email And Password');
            return false;
        }

        const MATCHED_USER = MODEL.users.find(
            u => u.userName === ENTERED_EMAIL && u.password === ENTERED_PASSWORD
        );

        if (MATCHED_USER) {

            MODEL.currentUser = MATCHED_USER;
            VIEW.hideLoginError();
            VIEW.clearLoginForm();
            VIEW.setWelcomeName(MATCHED_USER.userName);
            VIEW.showSection('dashboardSection');
        } else {
            VIEW.showLoginError('Invalid Credentials, Please Try Again.');
        }
    });

    $('#btnLogOut').on('click', function () {
        MODEL.currentUser = null;
        VIEW.showSection('loginSection');
    });

    $('#emailInput, #passwordInput').on('keydown', function (e) {
        if (e.key === 'Enter') $('.button-78').trigger('click');
    });
});