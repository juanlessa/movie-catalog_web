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
async function getCategoryTitles(categories) {
    var cat_list = [];
    for (let i = 0; i < categories.length; i++) {
        var cat = { Id: categories[i].Id, Name: categories[i].Name };
        const result = await $.ajax({
            url: "http://192.168.160.58/netflix/api/Categories/" + cat.Id,
            type: "GET",
            success: function (data) {
                //wacky nested anonymous callbacks go here
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // Empty most of the time...
            },
        });
        cat.Titles = result.Titles.slice(0, 3);
        cat_list.push(cat);
    }
    return cat_list;
}
//muda de pagina
async function changePage(){
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");

    pageToJump = event.target.text
    for (let i = 0; i < current_pagesize - 1; i++) {
        categories.list.pop()
    }
    $("#page"+pageToJump).toggleClass("disabled");
    $("#page"+current_page).toggleClass("disabled");
    current_page = pageToJump


    var cats = await getCategories(pageToJump, current_pagesize);
    var cat_list = await getCategoryTitles(cats);
    cat_list.map((category) =>
        categories.list.push({
            Id: category.Id,
            Name: category.Name,
            Titles: ko.observableArray(category.Titles),
        })
    );
    categories.list.shift()
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
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
var current_pagesize = 3;
var number_of_pages = 1;
$(document).ready(async function () {
    var cats = await getCategories(current_page, current_pagesize);
    var cat_list = await getCategoryTitles(cats);
    cat_list.map((category) =>
        categories.list.push({
            Id: category.Id,
            Name: category.Name,
            Titles: ko.observableArray(category.Titles),
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
    console.log(categories.list()[0].Titles());
});


