
$(document).ready(function(){ 
    leerJson();
})



function leerJson(){
     const noticias = Object.entries(diccionarioNoticias);
     colocarNoticias(noticias)
    
}


function colocarNoticias(noticias){
     const listadoNoticias = $(".listadoNoticias");
    noticias.forEach(([id,noticia]) => {
       const card = 
        $("<div class='card'>").html(`
            <img src="assets/resources/image/img1.jpg" alt="imagen de la noticia">
            <h2>${noticia.titulo}</h2>
            <p>${noticia.descripcion}</p>
            <button class="boton">Leer más</button>
        `);
        card.find(".boton").click(() => redirigirYGuardarNoticiaEnLocalStorage(noticia));
        listadoNoticias.append(card);
    });

}


function redirigirYGuardarNoticiaEnLocalStorage(noticia){
    localStorage.setItem("noticia", JSON.stringify(noticia));
    window.location.href = "assets/pages/noticia.html";
}



