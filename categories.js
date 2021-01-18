function toggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}

function untoggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}


var categories_list = {}
$(document).ready(function () {
    //get categories list
    $.getJSON(
        "http://192.168.160.58/netflix/api/Categories?page=1&pagesize=10",
        function (data) {
            categories_list = ko.observableArray(data.Categories)
            ko.applyBindings(categories_list)

        }
    );
});


