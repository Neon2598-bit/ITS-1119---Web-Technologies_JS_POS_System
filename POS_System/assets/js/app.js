$(document).ready(function () {

    VIEW.hideLoginError();

    $('.button-78').on('click', function () {

        const ENTERED_EMAIL = $('#emailInput').val().trim();
        const ENTERED_PASSWORD = $('#passwordInput').val().trim();

        if (!ENTERED_EMAIL || !ENTERED_PASSWORD) {
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

    $('.navLink').on('click', function(e) {
        e.preventDefault();

        const PAGE = $(this).data('page');

        const SECTION_MAP = {
            'dashboard': 'dashboardSection',
            'customers': 'customersSection',
            'products': 'itemsSection',
            'orders': 'ordersSection',
            'history': 'historySection'
        };

        const SECTION_ID = SECTION_MAP[PAGE];

        if (SECTION_ID) {
            VIEW.showSection(SECTION_ID);
        }

    });

    $('.btnLogOut').on('click', function () {
        MODEL.currentUser = null;
        VIEW.showSection('loginSection');
    });

    $('#emailInput, #passwordInput').on('keydown', function (e) {
        if (e.key === 'Enter') $('.button-78').trigger('click');
    })
});