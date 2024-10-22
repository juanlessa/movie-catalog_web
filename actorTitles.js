function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}
async function getActorTitles(actId) {
  const result = await $.ajax({
    url: "http://192.168.160.58/netflix/api/Actors/" + actId,
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

//muda de pagina

//redirect
function redirectPage(elem) {
  var id = elem.parentNode.childNodes[1].innerHTML;
  window.location.replace("details.html?id=" + id);
}

//lista de categorias
function TitlesViewModel() {
  var self = this;

  self.list = ko.observableArray([]);
}
titles = new TitlesViewModel();
ko.applyBindings(titles);

//paginação

var parms = getUrlVars();
console.log(parms.id);
$(document).ready(async function () {
  var title_list = await getActorTitles(parms.id);
  var act_name = title_list.Name;
  console.log(act_name);
  $("#actorName").text(act_name);
  title_list = title_list.Titles;
  console.log(title_list);
  title_list.map((title) => titles.list.push(title));
  console.log(titles.list());

  //hide loader
  $("#conteudo").toggleClass("hide");
  $("#cont").toggleClass("hide");
  $("#loader").toggleClass("hide-loader");
});
