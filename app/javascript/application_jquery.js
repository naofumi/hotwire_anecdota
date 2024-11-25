$(function () {
  $("[data-js='click-user-row']").on("click", function (event) {
    event.preventDefault();

    const href = $(this).data('href');

    $("[data-js='click-user-row']").removeClass("bg-yellow-200")
    $(this).addClass("bg-yellow-200")

    $.ajax(href, {
      success: function (data) {
        $("#user-profile").html(data);
      }
    })
  })
})
