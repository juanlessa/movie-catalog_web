async function getActors(current_page, current_pagesize) {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Actors?page="+ current_page +"&pagesize="+ current_pagesize,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    number_of_pages = result.TotalPages
    return result.Actors;
}

async function changePage() {
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    
    pageToJump = event.target.text;

    var len = actors.list().length;
    for (let i = 0; i < len; i++) {
        actors.list.pop();
    }
    $("#page" + pageToJump).toggleClass("active");
    $("#page" + current_page).toggleClass("active");

    current_page = pageToJump;
    
    actors_list = await getActors(current_page, current_pagesize);
    actors_list.map((actor) => 
        actors.list.push(actor)
    );

    actors.list.shift();

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
}
//redirect
function redirectPage(elem) {
    var id = elem.id;
    window.location.replace("actorTitles.html?id=" + id);
  }

//lista de categorias
function ActorsViewModel() {
    var self = this;

    self.list = ko.observableArray([]);
}
actors = new ActorsViewModel();
ko.applyBindings(actors);
//all countries
var allactors = [];

//paginação
var current_page = 1;
var current_pagesize = 200;
var number_of_pages = 1;

$(document).ready(async function () {
    console.log("comecou");
    actors_list = await getActors(current_page, current_pagesize);
    actors_list.map((actor) => 
        actors.list.push(actor)
    );
   
    console.log(actors.list());
    
    for (let i = 2; i <= 20; i++) {
        $("#pageList").append( "<li id='page"+ i +"' class='page-item'><a class='page-link' href='#' onclick='changePage()'>"+i+"</a></li>" );
    }

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
});
