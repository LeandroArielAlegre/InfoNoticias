var noticias = Object.entries(diccionarioNoticias);
$(document).ready(function(){ 
    leerDiccionarioNoticias(noticias);
    filtrarNoticias();
})



function leerDiccionarioNoticias(noticias){
     colocarNoticias(noticias)
    
}


function colocarNoticias(noticias){
     const listadoNoticias = $(".listadoNoticias");
     listadoNoticias.empty();
    noticias.forEach(([id,noticia]) => {
       const card = 
        $("<div class='card'>").html(`
            <img src="assets/resources/image/img${noticia.fotos[0]}.jpg" alt="imagen de la noticia">
            <h2>${noticia.titulo}</h2>
            <p>${noticia.descripcion}</p>
            <button class="boton">Leer más</button>
            <p id = tema>${noticia.tema}</p>
        `);
        card.find(".boton").click(() => redirigirYGuardarNoticiaEnLocalStorage(noticia));
        listadoNoticias.append(card);
    });

}

function filtrarNoticias(){
     $("#formularioFiltrado").submit(function(e) {
        e.preventDefault(); // Evita recarga de la página

        const temaSeleccionado = $("#filtroTema").val(); 
        
        if (temaSeleccionado === "todos" || !temaSeleccionado) {
            colocarNoticias(noticias);
        } else {
            const filtradas = noticias.filter(([id, noticia]) => noticia.tema === temaSeleccionado);
            colocarNoticias(filtradas);
        }
    });
}

function redirigirYGuardarNoticiaEnLocalStorage(noticia){
    localStorage.setItem("noticia", JSON.stringify(noticia));
    window.location.href = "assets/pages/noticia.html";
}



