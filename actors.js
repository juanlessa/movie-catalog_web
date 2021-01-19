async function getActors() {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Actors?page=1&pagesize=27000",
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    return result.Actors;
}

function changePage() {
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    
    pageToJump = event.target.text;

    $("#page" + pageToJump).toggleClass("active");
    $("#page" + current_page).toggleClass("active");

    var len = actors.list().length;
    for (let i = 0; i < len; i++) {
        actors.list.pop();
    }

    
    current_page = pageToJump;

    for (let i = 0; i < allactors.length; i++) {
        var firstL = String(allactors[i].Name[0]);
        if (pageToJump == firstL) {
            actors.list.push(allactors[i]);
        }
    }

    actors.list.shift();
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
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
var current_page = "A";
$(document).ready(async function () {
    console.log("comecou");
    allactors = await getActors();
    for (let i = 0; i < allactors.length; i++) {
        var firstL = String(allactors[i].Name[0]);
        if ("A" == firstL) {
            actors.list.push(allactors[i]);
        }
    }
    console.log(actors.list());

    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
});
