
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
    number_of_pages = result.TotalPages
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
