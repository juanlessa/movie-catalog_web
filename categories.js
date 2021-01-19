function toggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}

function untoggleBorder(object) {
    object.classList.toggle("border");
    object.classList.toggle("border-light");
}
async function getCategories(page, pagesize) {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Categories?page="+page+"&pagesize="+pagesize,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    number_of_pages = result.TotalPages
    return result.Categories;
}

//muda de pagina
async function changePage(){
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");

    pageToJump = event.target.text

    var len =  categories.list().length
    for (let i = 0; i < len - 1; i++) {
        categories.list.pop()
    }
    $("#page"+pageToJump).toggleClass("disabled");
    $("#page"+current_page).toggleClass("disabled");
    current_page = pageToJump


    var cats = await getCategories(current_page, current_pagesize);
    cats.map((category) =>
        categories.list.push({
            Id: category.Id,
            Name: category.Name,
        })
    );
    categories.list.shift()
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
}
//redirect
function redirectPage(elem){
    
    var id = elem.id
    window.location.replace("categoryTitles.html?id="+id);
}



//lista de categorias
function CategoriesViewModel(){
    var self = this;

    self.list = ko.observableArray([]);
}
categories = new CategoriesViewModel()
ko.applyBindings(categories);

//paginação
var current_page = 1;
var current_pagesize = 12;
var number_of_pages = 1;
$(document).ready(async function () {
    var cats = await getCategories(current_page, current_pagesize);
    cats.map((category) =>
        categories.list.push({
            Id: category.Id,
            Name: category.Name,
        })
    );
    //pagination
    for (let i = 2; i <= number_of_pages; i++) {
        $("#pageList").append( "<li id='page"+ i +"' class='page-item'><a class='page-link' href='#' onclick='changePage()'>"+i+"</a></li>" );
    }

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    console.log(categories.list());
});


