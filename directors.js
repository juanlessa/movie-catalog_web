function toggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}

function untoggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}
async function getDirectors(page, pagesize) {
    const result = await $.ajax({
        url:
            "http://192.168.160.58/netflix/api/Directors?page=" +
            page +
            "&pagesize=" +
            pagesize,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    number_of_pages = result.TotalPages;
    return result.Directors;
}

//muda de pagina
async function changePage() {
    //hide loader
    $("#conteudo").toggleClass("d-none");
    $("#loader").toggleClass("hide-loader");

    pageToJump = event.target.text;

    var len = directors.list().length;
    for (let i = 0; i < len - 1; i++) {
        directors.list.pop();
    }
    $("#page" + pageToJump).toggleClass("disabled");
    $("#page" + current_page).toggleClass("disabled");
    current_page = pageToJump;

    var cats = await getDirectors(current_page, current_pagesize);
    cats.map((category) =>
        directors.list.push({
            Id: category.Id,
            Name: category.Name,
        })
    );
    directors.list.shift();
    //hide loader
    $("#conteudo").toggleClass("d-none");
    $("#loader").toggleClass("hide-loader");
}
//redirect
function redirectPage(elem) {
    var id = elem.id;
    window.location.replace("directorTitles.html?id=" + id);
}

//lista de categorias
function DirectorsViewModel() {
    var self = this;

    self.list = ko.observableArray([]);
}
directors = new DirectorsViewModel();
ko.applyBindings(directors);

//paginação
var current_page = 1;
var current_pagesize = 200;
var number_of_pages = 1;
$(document).ready(async function () {
    var direcs = await getDirectors(current_page, current_pagesize);
    direcs.map((director) => directors.list.push(director));
    //pagination
    for (let i = 2; i <= number_of_pages; i++) {
        $("#pageList").append(
            "<li id='page" +
                i +
                "' class='page-item'><a class='page-link' href='#' onclick='changePage()'>" +
                i +
                "</a></li>"
        );
    }

    //hide loader
    $("#conteudo").removeClass("d-none");
    $("#loader").toggleClass("hide-loader");
    console.log(directors.list());
    console.log(number_of_pages);
});

//seach
async function getDirectorByName(name) {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Search/Directors?name=" + name,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    return result;
}

$("#btn_search").click(async function (e) {
    var input = $("#input_search").val();
    if (input == "") {
        return false;
    }
    //hide loader
    $("#conteudo").addClass("d-none");
    $("#loader").removeClass("hide-loader");
    //hide pagination
    $("#pagination").addClass("d-none");
    $("#noResult").addClass("d-none");
    console.log("seach");
    var direcs = await getDirectorByName(input);
    console.log(direcs);

    if (direcs.length == 0) {
        //hide loader
        $("#noResult").removeClass("d-none");
        $("#loader").addClass("hide-loader");
        return false;
    }

    var len = directors.list().length;
    for (let i = 0; i < len - 1; i++) {
        directors.list.pop();
    }
    direcs.map((director) =>
        directors.list.push({
            Id: director.Id,
            Name: director.Name,
        })
    );
    directors.list.shift();
    //hide loader
    $("#conteudo").removeClass("d-none");
    $("#loader").addClass("hide-loader");

    return false;
});
