$(document).ready(function(){
    

    for (let index = 0; index < 10;  index++) {
        $(".listadoNoticias").append(`
        <div class="card">
            <img src="" alt="imagen de la noticia">
            <h2>MATAN A 2 PERSONAS Y 1 BOLIVIANO</h2>
            <p>Descripción de la noticia</p>
        </div>
        `)
    }

})

