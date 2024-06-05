$(document).ready(function() {
    $('#btnCloseAlertSuccess').click(function () {
        $('#successNotification').removeClass('show');
    });
    $('#btnCloseAlertError').click(function () {
        $('#errorNotification').removeClass('show');
    });
});