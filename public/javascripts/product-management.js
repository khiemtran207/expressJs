$(document).ready(function() {
    $('#addProductBtn').click(function (){
        $('#productForm').removeClass('hidden');
    });
    $('#cancelBtn').click(function() {
        $('#productForm').addClass('hidden');
    });
});