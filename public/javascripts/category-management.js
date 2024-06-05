$(document).ready(function() {
    $('#addCategoryBtn').click(function() {
        $('#categoryForm').removeClass('hidden');
        initializeForm();
    });

    $(".btnEditCategory").click(function() {
        var categoryId = $(this).closest('tr').data('id');
        fetchAndPopulateForm(categoryId);
    });

    $('#cancelBtn').click(function() {
        $('#categoryForm').addClass('hidden').find('form')[0].reset();
        $('.form-error').addClass('hidden').text('');
    });

    function fetchAndPopulateForm(categoryId) {
        if (categoryId) {
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
        } else {
            $("#errorNotification").addClass('show');
        }
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
            image: $("#image").val(),
            enable: $("#enable").is(":checked"),
            metaTitle: $("#meta-title").val(),
            metaDescription: $("#meta-description").val(),
            metaKeywords: $("#meta-keywords").val()
        };
    }

    function processFormSuccess(result, categoryId = null) {
        $('#categoryForm').addClass('hidden');
        $("#successNotification").addClass('show');
        $("#successMessage").text(result.message);
        refreshCategoryList(result.category, categoryId);
        $('#categoryForm').find('form')[0].reset();
        $('.form-error').addClass('hidden').text('');
    }

    function refreshCategoryList(category, categoryId) {
        if (!categoryId) {
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
                <td class="p-3">${category.created_at || ''}</td>
                <td class="p-3">${category.updated_at || ''}</td>
                <td class="p-3 text-center">
                    <button class="btnEditCategory bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 mr-2">Edit</button>
                    <button class="btnRemoveCategory bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
                </td>
            </tr>
        `;
            $("#categoryList").prepend(newRow);
        } else {
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
            row.find('td:eq(9)').text(category.created_at || '');
            row.find('td:eq(10)').text(category.updated_at || '');
        }
        $('#categoryForm').addClass('hidden');
        $('#categoryForm')[0].reset();
        $("#enable").prop("checked", false);
        $("#errorNotification").removeClass('show');
    }

    function ajaxErrorHandler(xhr) {
        $("#categoryForm").removeClass('hidden');
        const errorData = xhr.responseJSON.errors.errors;
        $.each(errorData, function(index, item) {
            $('#' + item.path + "Error").removeClass('hidden').text(item.msg);
        });
        $("#errorNotification").addClass('show');
    }
});