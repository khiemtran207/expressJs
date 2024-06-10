$(document).ready(function() {
    var categoryIdToDelete;
    var filePath;

    bindEvents();

    function bindEvents() {
        $('#addCategoryBtn').click(showAddCategoryForm);
        $('#cancelBtn').click(hideCategoryForm);
        $('#categoryList').on('click', '.btnEditCategory', showEditCategoryForm);
        $('#categoryList').on('click', '.btnRemoveCategory', showDeleteModal);
        $('#cancelDeleteBtn').click(hideDeleteModal);
        $('#confirmDeleteBtn').click(confirmDeleteCategory);
        $(document).on('change', '#category-image', handleUploadImage);
        $('#update-image-btn').click(updateImage);
    }

    function showAddCategoryForm() {
        $('#categoryForm').removeClass('hidden').find('form')[0].reset();
        $('#categoryForm form :input[type="checkbox"]').prop("checked", false);
        $('#category-image-box').removeClass('hidden');
        $('#preview-category-image').addClass('hidden');
        initializeForm();
    }

    function showEditCategoryForm() {
        var categoryId = $(this).closest('tr').data('id');
        fetchAndPopulateForm(categoryId);
    }

    function hideCategoryForm() {
        $('#categoryForm').addClass('hidden').find('form')[0].reset();
        $('.form-error').addClass('hidden').text('');
    }

    function showDeleteModal() {
        categoryIdToDelete = $(this).closest('tr').data('id');
        $('#confirmDeleteModal').removeClass('hidden');
    }

    function hideDeleteModal() {
        $('#confirmDeleteModal').addClass('hidden');
        categoryIdToDelete = null;
    }

    function confirmDeleteCategory() {
        if (categoryIdToDelete) {
            $.ajax({
                type: "GET",
                url: "/admin/categories/delete/" + categoryIdToDelete,
                error: function(error) {
                    showErrorNotification();
                },
                success: function(result) {
                    handleDeleteSuccess(result, categoryIdToDelete);
                }
            });
        }
    }

    function fetchAndPopulateForm(categoryId) {
        $.ajax({
            type: "GET",
            url: "/admin/categories/get-one/" + categoryId,
            error: ajaxErrorHandler,
            success: function(result) {
                populateForm(result.category[0]);
                $('#categoryForm').removeClass('hidden');
                handleFormSubmission(categoryId);
            }
        });
    }

    function populateForm(categoryData) {
        $("#name").val(categoryData.name);
        $("#slug").val(categoryData.slug);
        $("#description").val(categoryData.description);
        $("#image").val(categoryData.image_path);
        $("#enable").prop('checked', categoryData.is_active === 1);
        $("#meta-title").val(categoryData.meta_title);
        $("#meta-description").val(categoryData.meta_description);
        $("#meta-keywords").val(categoryData.meta_keywords);
    }

    function initializeForm() {
        handleFormSubmission();
    }

    function handleFormSubmission(categoryId = null) {
        $("#categoryForm form").off('submit').on('submit', function(e) {
            e.preventDefault();
            const formData = getFormData();
            console.log(formData);
            if (categoryId)  {
                formData.id = categoryId;
            }
            const ajaxUrl = categoryId ? "/admin/categories/update/" + categoryId : "/admin/categories/create";
            $.ajax({
                type: "POST",
                url: ajaxUrl,
                data: formData,
                error: ajaxErrorHandler,
                success: function(result) {
                    processFormSuccess(result, categoryId);
                }
            });
        });
    }

    function getFormData() {
        return {
            name: $("#name").val(),
            slug: $("#slug").val(),
            description: $("#description").val(),
            image: filePath,
            enable: $("#enable").is(":checked"),
            metaTitle: $("#meta-title").val(),
            metaDescription: $("#meta-description").val(),
            metaKeywords: $("#meta-keywords").val()
        };
    }

    function processFormSuccess(result, categoryId = null) {
        $('#categoryForm').addClass('hidden');
        showSuccessNotification(result.message);
        refreshCategoryList(result.category, categoryId);
        resetForm();
    }

    function refreshCategoryList(category, categoryId) {
        if (!categoryId) {
            addNewCategoryRow(category);
        } else {
            updateCategoryRow(category, categoryId);
        }
    }

    function addNewCategoryRow(category) {
        const newRow = `
            <tr class="hover:bg-gray-100 new-category-highlight" data-id="${category.id}">
                <td class="p-3">${category.id}</td>
                <td class="p-3">${category.name}</td>
                <td class="p-3">${category.slug}</td>
                <td class="p-3">${category.description || ''}</td>
                <td class="p-3">
                    <img src="${category.image_path || '/img/placeholder.jpg'}" alt="Category" class="w-12 h-12 object-cover rounded">
                </td>
                <td class="p-3 text-center">
                    ${category.is_active
            ? '<span class="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">Active</span>'
            : '<span class="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">Inactive</span>'}
                </td>
                <td class="p-3">${category.meta_title || ''}</td>
                <td class="p-3">${category.meta_description || ''}</td>
                <td class="p-3">${category.meta_keywords || ''}</td>
                <td class="p-3">${formatDate(category.created_at) || ''}</td>
                <td class="p-3">${formatDate(category.updated_at) || ''}</td>
                <td class="p-3 text-center">
                    <button class="btnEditCategory bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 mr-2">Edit</button>
                    <button class="btnRemoveCategory bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                </td>
            </tr>
        `;
        $("#categoryList").prepend(newRow);
    }

    function updateCategoryRow(category, categoryId) {
        const row = $(`#categoryList tr[data-id="${categoryId}"]`);
        row.find('td:eq(1)').text(category.name);
        row.find('td:eq(2)').text(category.slug);
        row.find('td:eq(3)').text(category.description || '');
        row.find('td:eq(4) img').attr('src', category.image_path || '/img/placeholder.jpg');
        row.find('td:eq(5)').html(category.is_active
            ? '<span class="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">Active</span>'
            : '<span class="px-2 py-1 bg-red-200 text-red-800 rounded-full text-xs">Inactive</span>'
        );
        row.find('td:eq(6)').text(category.meta_title || '');
        row.find('td:eq(7)').text(category.meta_description || '');
        row.find('td:eq(8)').text(category.meta_keywords || '');
        row.find('td:eq(9)').text(formatDate(category.created_at) || '');
        row.find('td:eq(10)').text(formatDate(category.updated_at) || '');
    }

    function handleDeleteSuccess(result, categoryId) {
        hideDeleteModal();
        showSuccessNotification(result.message);
        $(`tr[data-id="${categoryId}"]`).fadeOut(500, function() {
            $(this).remove();
        });
    }

    function showErrorNotification() {
        $("#errorNotification").fadeIn().addClass('show');
        setTimeout(function() {
            $("#errorNotification").fadeOut().removeClass('show');
        }, 4000);
    }

    function showSuccessNotification(message) {
        $("#successNotification").fadeIn().addClass('show');
        $("#successMessage").text(message);
        setTimeout(function() {
            $("#successNotification").fadeOut().removeClass('show');
        }, 4000);
    }

    function resetForm() {
        $('#categoryForm').find('form')[0].reset();
        $('.form-error').addClass('hidden').text('');
        $("#enable").prop("checked", false);
    }

    function ajaxErrorHandler(xhr) {
        const errorData = xhr.responseJSON.errors.errors;
        $.each(errorData, function(index, item) {
            $('#' + item.path + "Error").removeClass('hidden').text(item.msg);
        });
        showErrorNotification();
    }

    function formatDate(dateString) {
        if (!dateString) {
            return '';
        }
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    function handleUploadImage(event) {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            $.ajax({
                url: '/upload-image',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    let index = response.indexOf("/public");
                    let result = response.substring(index + 7);
                    filePath = result;
                    $('#preview-category-image').removeClass('hidden');
                    $('#preview-category-image img').attr('src', result)
                    $('#category-image-box').addClass('hidden');
                },
                error: function(error) {
                    console.error('Error when upload:', error);
                }
            });
        }
    }

    function updateImage() {
        $('#preview-category-image').addClass('hidden');
        $('#category-image-box').removeClass('hidden');
    }


});