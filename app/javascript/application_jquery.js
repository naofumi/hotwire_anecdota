$(function () {
  $("[data-js='click-user-row']").on("click", function (event) {
    event.preventDefault();

    const href = $(this).data('href');

    $.ajax(href, {
      success: function (data) {
        $("#user-profile").html(data);
      }
    })
  })
})
