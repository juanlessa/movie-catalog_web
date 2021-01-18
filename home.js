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
    //$().append( "<p>Test</p>" );
    console.log("ikaa")
    pageToJump = event.target.text
    var cats = await getCategories(pageToJump, init_pagesize);
    var cat_list = await getCategoryTitles(cats);
    cat_list.map((category) =>
        categories.list.push({
            Id: category.Id,
            Name: category.Name,
            Titles: ko.observableArray(category.Titles),
        })
    );
}

//lista de categorias
function CategoriesViewModel(){
    var self = this;

    self.list = ko.observableArray([]);
}
categories = new CategoriesViewModel()
ko.applyBindings(categories);

//paginação
var init_page = 1;
var init_pagesize = 5;
var number_of_pages = 1;
$(document).ready(async function () {
    var cats = await getCategories(init_page, init_pagesize);
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
        $("#pageList").append( "<li class='page-item'><a class='page-link' href='#' onclick='changePage()'>"+i+"</a></li>" );
    }onclick

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    console.log(categories.list());
    console.log(categories.list()[0].Titles());

 
});






/*
//variable to store categories information temporally
var categ = []
$(document).ready(function () {
    //get categories list
    $.get("http://192.168.160.58/netflix/api/Categories?page=1&pagesize=10", function (data, status) {
        var cats = data.Categories
        categ = cats.map(category => (
            {"Id": category.Id, "Name": category.Name, "Titles": []}
        ));
    }).done(function(res){
        for (let i = 0; i < categ.length; i++){
            var id = categ[i].Id
            $.get("http://192.168.160.58/netflix/api/Categories/"+id, function (data, status) {
                categories_list.push({"Id": categ[i].Id, "Name": categ[i].Name, "Titles": ko.observableArray(data.Titles.slice(0,10))})
                console.log(data.Titles.slice(0,10))
            })
        }
        ko.applyBindings(categories_list)
        console.log(categ)
    })

    
    

});


/*

    $.getJSON(
        "http://192.168.160.58/netflix/api/Categories?page=1&pagesize=10",
        function (data) {
            var cats = data.Categories
            cats.map(category => (
                categories_list.push({"Id": category.Id, "Name": category.Name, "Titles": []})
            ));
            ko.applyBindings(categories_list)
        }
    );
*/
