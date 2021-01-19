function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
async function getCountryTitles(countId, page) {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Countries/" + countId + "?page="+ page +"&pagesize="+ current_pagesize,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    number_of_pages = result.TotalPages
    return result;
}


//muda de pagina
async function changePage(){
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");

    pageToJump = event.target.text
    if (pageToJump == "Next") {
        pageToJump = current_page + 1
    }else{
        pageToJump = current_page - 1
        $("#pNext").removeClass("disabled");

    }
    var title_list = await getCountryTitles(parms.id, pageToJump);
    title_list = title_list.Titles
    if (title_list.length == 0) {
        $("#pNext").toggleClass("disabled");
        //hide loader
        $("#conteudo").toggleClass("hide");
        $("#loader").toggleClass("hide-loader");
        return false
    }

    var len =  titles.list().length
    for (let i = 0; i < len - 1; i++){
        titles.list.pop()
    }
    if (pageToJump == 1){
        $("#pLast").toggleClass("disabled");
    }
    if (current_page == 1){
        $("#pLast").toggleClass("disabled");
    }
    current_page = pageToJump


    
    title_list.map((title) =>
        titles.list.push(title)
    )
    titles.list.shift()
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    return true
}

//redirect
function redirectPage(elem){
    var id = elem.parentNode.childNodes[1].innerHTML
    window.location.replace("details.html?id="+id);
}


//lista de categorias
function TitlesViewModel(){
    var self = this;

    self.list = ko.observableArray([]);
}
titles = new TitlesViewModel()
ko.applyBindings(titles);

//paginação
var current_page = 1;
var current_pagesize = 12;
var number_of_pages = 1;

var parms = getUrlVars()
console.log(parms.id)
$(document).ready(async function () {
    var title_list = await getCountryTitles(parms.id, current_page);
    var count_name = title_list.Name
    $("#countryName").text(count_name)
    title_list = title_list.Titles
    title_list.map((title) =>
        titles.list.push(title)
    )
    console.log(titles.list())

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
});