
$(document).ready(function(){
    colocarNoticias();


})

function colocarNoticias(){
    const noticia = JSON.parse(localStorage.getItem("noticia"));
    
    $(".noticia").append(`
        <h1>${noticia.titulo}</h1>
        <h3>${noticia.descripcion}</h3>
        <p>${noticia.cuerpo}</p>
    `)


}