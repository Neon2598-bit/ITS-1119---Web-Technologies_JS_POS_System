// ======================== Sidebar Controller ========================
let sidebar_open = false;

// Inject mobile logout button at bottom of drawer
$('#navLinks').append(`
    <li class="mobileLogoutLi" style="display:none; margin-top:auto; padding-top:1rem; border-top:1px solid rgba(255,255,255,0.1); list-style:none;">
        <button class="button-87 btnLogOut" style="width:100%; margin:0;">LOG OUT</button>
    </li>
`);

// Mobile logout triggers the real desktop logout button
$('#navLinks').on('click', '.mobileLogoutLi .btnLogOut', function () {
    sidebar_open = false;
    $('#navLinks').removeClass('open');
    $('#navOverlay').hide();
    $('.dashboardNav > .btnLogOut').trigger('click');
});

// Hamburger open/close
$('#hamburgerBtn').on('click', function () {
    if (sidebar_open) {
        $('#navLinks').removeClass('open');
        $('#navOverlay').hide();
        sidebar_open = false;
    } else {
        $('#navLinks').addClass('open');
        $('#navOverlay').show();
        sidebar_open = true;
    }
});

// Overlay click closes drawer
$('#navOverlay').on('click', function () {
    $('#navLinks').removeClass('open');
    $('#navOverlay').hide();
    sidebar_open = false;
});

// Any nav link click closes drawer
// (your existing controllers handle the page switching)
$('.navLink').on('click', function () {
    $('#navLinks').removeClass('open');
    $('#navOverlay').hide();
    sidebar_open = false;
});

// Escape key
$(document).on('keydown', function (e) {
    if (e.key === 'Escape' && sidebar_open) {
        $('#navLinks').removeClass('open');
        $('#navOverlay').hide();
        sidebar_open = false;
    }
});

// Resize to desktop — close drawer
$(window).on('resize', function () {
    if ($(window).width() >= 992) {
        $('#navLinks').removeClass('open');
        $('#navOverlay').hide();
        sidebar_open = false;
    }
});
// ======================== Sidebar Controller ========================