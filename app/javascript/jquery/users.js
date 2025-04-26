import $ from "jquery"

$(function () {
  const component = $("[data-js='click-user-row']")
  const insertable = $("#user-profile")
  const highlightClass = "bg-yellow-200"

  component.on("click", function (event) {
    event.preventDefault();
    const target = $(this);
    const href = target.data('href');

    component.removeClass(highlightClass)
    target.addClass(highlightClass)

    $.ajax(href, {
      success: function (data) {
        insertable.html(data);
      }
    })
  })
})
