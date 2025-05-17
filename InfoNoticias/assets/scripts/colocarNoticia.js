
$(document).ready(function(){
    colocarNoticias();


})

function colocarNoticias(){
    const noticia = JSON.parse(localStorage.getItem("noticia"));

    $("#tituloNoticia").text(noticia.titulo);
    $("#temaNoticia").text(noticia.tema);
    $("#descripcionNoticia").text(noticia.descripcion);
    $("#cuerpoNoticia").text(noticia.cuerpo);
    if(noticia.direccionNormalizada.length > 0){
        $("#map").show();
        colocarMapa();
    }
    colocarImagenes(noticia.fotos);
   

}

function colocarImagenes(fotos) {
    if (fotos && fotos.filter(f => f.trim() !== "").length) {
    $("#imagenesNoticia").show();
    $("#imagenesNoticia").empty();
    fotos.forEach(foto => {
        if (foto.trim() !== "") {
            $("#imagenesNoticia").append(`<img src="../../assets/resources/image/${foto}" alt="imagen de la noticia">`);
        }
    });
    } else {
        $("#imagenesNoticia").hide().empty();
    }
}


function colocarMapa() {
  const coordenadas = obtenerCoordenadasDeUbicacion();  
  var map = L.map('map').setView([coordenadas.y, coordenadas.x], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var marker = L.marker([coordenadas.y, coordenadas.x]).addTo(map);
}
function obtenerCoordenadasDeUbicacion(){
    const ubicacion = JSON.parse(localStorage.getItem("ubicacion"));
   const coordenadas = {
    x: ubicacion.direccionesNormalizadas[0].coordenadas.x,
    y: ubicacion.direccionesNormalizadas[0].coordenadas.y
    };
   return coordenadas;
}