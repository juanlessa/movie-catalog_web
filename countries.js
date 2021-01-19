
async function getCountries() {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Countries?page=1&pagesize=110",
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    return result.Countries;
}

async function changePage(){

    pageToJump = event.target.text
    console.log(countries.list().length)
    var len =  countries.list().length
    for (let i = 0; i < len; i++){
        countries.list.pop()
    }
    console.log(countries.list().length)


    $("#page"+pageToJump).toggleClass("active");
    $("#page"+current_page).toggleClass("active");
    current_page = pageToJump

    for (let i = 0; i < allcountries.length; i++) {
        var firstL = String(allcountries[i].Name[0])
        if (pageToJump == firstL) {
            countries.list.push(allcountries[i])
        }        
    }
 
    countries.list.shift()

}
//redirect
function redirectPage(elem){
    var id = elem.id
    window.location.replace("countryTitles.html?id="+id);
}

//lista de categorias
function CountriesViewModel(){
    var self = this;

    self.list = ko.observableArray([]);
}
countries = new CountriesViewModel()
ko.applyBindings(countries);
//all countries
var allcountries = []

//paginação
var current_page = "A";
$(document).ready(async function () {
    console.log("comecou")
    allcountries = await getCountries();
    for (let i = 0; i < allcountries.length; i++) {
        var firstL = String(allcountries[i].Name[0])
        if ("A" == firstL) {
            countries.list.push(allcountries[i])
        }        
    }
    console.log(countries.list())
    
    //hide loader
    $("#conteudo").toggleClass("hide");
    $("#loader").toggleClass("hide-loader");
    ;
});

//seach
async function getCountryByName(name) {
    const result = await $.ajax({
        url: "http://192.168.160.58/netflix/api/Search/Countries?name="+name,
        type: "GET",
        success: function (data) {
            //wacky nested anonymous callbacks go here
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Empty most of the time...
        },
    });
    return result
}

$("#btn_search").click(async function (e) { 
    var input = $("#input_search").val();
    if (input == "") {
        return false
    }
    //hide loader
    $("#conteudo").addClass("hide");
    $("#loader").removeClass("hide-loader");
    //hide pagination
    $("#pagination").addClass("d-none");
    $("#noResult").addClass("d-none");
    console.log("seach")
    var counts = await getCountryByName(input)
    console.log(counts)

    if (counts.length == 0) {
        //hide loader
        $("#noResult").removeClass("d-none");
        $("#loader").addClass("hide-loader");
        return false
    }

    var len =  countries.list().length
    for (let i = 0; i < len - 1; i++) {
        countries.list.pop()
    }
    counts.map((country) =>
        countries.list.push({
            Id: country.Id,
            Name: country.Name,
        })
    );
    countries.list.shift()
    //hide loader
    $("#conteudo").removeClass("hide");
    $("#loader").addClass("hide-loader");

    return false
});


