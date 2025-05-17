$(document).ready(function () {
    mostrarDeFormularioDeDireccion();
    formularioDeDireccionNormalizada();
    seleccionarDireccionValida();
    publicarNoticia();
})


function publicarNoticia() {
    $('#registrarNoticia').submit(function (e) {
        e.preventDefault();
        const noticia = validarFormulario();
        if (noticia) {
            redirigirYGuardarNoticiaEnLocalStorage(noticia);
        }
    })
}
function validarFormulario() {
    const noticia = obtenerCamposFormularioNoticia();
    if (validarCampos(noticia)) {
        return noticia;
    }
    else {
        alert("Error: Todos los campos son obligatorios");
        return "";
    }
}
function validarCampos(noticia) {
    if (noticia.titulo.length > 0 && noticia.tema.length > 0
        && noticia.autor.length > 0 && noticia.fecha.length > 0 && noticia.descripcion.length > 0
        && noticia.cuerpo.length > 0) {
        return true;
    }
    return false
}

function obtenerCamposFormularioNoticia() {
    const titulo = $("#tituloNoticia").val();
    const tema = $("#temaNoticia").val();
    const autor = $("#autorNoticia").val();
    const fecha = $("#fechaNoticia").val();
    const descripcion = $("#descripcionNoticia").val();
    const cuerpo = $("#cuerpoNoticia").val();
    const direccionNormalizada = $("#direccionNormalizadaNoticia").val();
    // const fotos = $("#imagenesNoticia").val();

    const noticia = { titulo, tema, autor, fecha, descripcion, cuerpo, direccionNormalizada };
    return noticia;

}
function mostrarDeFormularioDeDireccion() {
    $('input[name="existeDireccion"]').change(function () {
        if ($(this).is(':checked')) {
            $(".direccionNoticia").show();
            $("#direccionNormalizadaNoticia").show();
            $("#direccionNormalizadaNoticia").prop("disabled", true);
        }
        if (!$(this).is(':checked')) {
            $(".direccionNoticia").hide();
            $("#direccionNormalizadaNoticia").hide();
        }
    })
}

function formularioDeDireccionNormalizada() {
    $("#buscarDireccion").submit(function (e) {
        e.preventDefault();
        limpiarDireccionesValidas();
        const direccion = obtenerCamposFormularioDireccion();
        if (validarCamposDireccion(direccion)) {
            obtenerDireccionNormalizada(direccion)
                .then(listaDeDireccionesNormalizadas => {
                    let listaDeDirecciones = listaDeDireccionesNormalizadas;
                   agregarDireccionesValidas(listaDeDirecciones);
                });
        }
    })
}
function agregarDireccionesValidas(listaDeDirecciones) {
    if (listaDeDirecciones) {
        const direcciones = $(".direcciones");
        for (let i = 0; i < listaDeDirecciones.length; i++) {
            const itemDireccion = (`<li><button type="button" class="boton-opcion">${listaDeDirecciones[i].direccion}</button></li>`)
            direcciones.append(itemDireccion);
        }
    }
}

function seleccionarDireccionValida(){
    $(".direcciones").on("click", ".boton-opcion", function () {
        const direccionNormalizada = $(this).text();
        guardarDireccionSeleccionada(direccionNormalizada);
        $("#direccionNormalizadaNoticia").val(direccionNormalizada);
    })
}

function guardarDireccionSeleccionada(direccionNormalizada) {
    fetch("http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=" + direccionNormalizada).
    then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
    }).then(data => {
        console.log(data);
        localStorage.setItem("ubicacion", JSON.stringify(data));
    }).catch(error => {
        console.error("Error al obtener la dirección normalizada:", error);
    })
}

function limpiarDireccionesValidas(){
    $(".direcciones").empty();
}


function obtenerCamposFormularioDireccion() {
    const calle = $("#calleNoticia").val();
    const altura = $("#alturaNoticia").val();
    return direccion = { calle, altura };
}

function validarCamposDireccion(direccion) {
    if (direccion.calle.length > 0 && direccion.altura.length > 0) {
        return true;
    }
    return false
}

function obtenerDireccionNormalizada(direccion) {
    return fetch("http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=" + direccion.calle + " " + direccion.altura)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            if(data.direccionesNormalizadas.length > 0){
              return validarDireccionesCalleYAltura(data);
            }else{
                alert("Error: No se encontraron direcciones normalizadas");
            }
            
        })
        .catch(error => {
            console.error("Error al obtener la dirección normalizada:", error);
            return [];

        });
}

function validarDireccionesCalleYAltura(data) {
    let listaDeDireccionesNormalizadas = [];
    if (data.direccionesNormalizadas.length > 0) {
        for (let i = 0; i < data.direccionesNormalizadas.length; i++) {
            if (data.direccionesNormalizadas[i].tipo == "calle_altura") {
                listaDeDireccionesNormalizadas.push(data.direccionesNormalizadas[i]);
            }
        }

        return listaDeDireccionesNormalizadas;

    } else {
        return "";
    }
}


function redirigirYGuardarNoticiaEnLocalStorage(noticia) {
    localStorage.setItem("noticia", JSON.stringify(noticia));
    window.location.href = "../../assets/pages/noticia.html";
}