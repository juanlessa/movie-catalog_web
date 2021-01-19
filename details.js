function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
//get title
async function getTitle(id){
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Titles/"+id,
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


var parms = getUrlVars()

$(document).ready(async function () {
    var title = await getTitle(parms.id)
    console.log(title)
    $("#titleName").text(title.Name)
    $("#releaseYear").text(title.ReleaseYear)
    $("#duration").text(title.Duration)
    $("#description").text(title.Description)
    var directors = title.Directors.reduce((a, b) => a = a+b.Name+", ", "")
    $("#director").text(directors)

    var actors = title.Actors
    for (let i = 0; i < actors.length; i++) {
        $("#actorsList").append('<div class="col-6 mb-5">'+ actors[i].Name +'</div>');
    }
    $("#rating").text(title.Rating.Code)
});