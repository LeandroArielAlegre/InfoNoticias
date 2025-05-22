$(document).ready(function () {
    //insertarEnFormularioImagenesDisponibles();
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
    //const fotos = $("#imagenesNoticia").val();
    const fotos = $('#imagenNoticia').val();
    const noticia = { titulo, tema, autor, fecha, descripcion, cuerpo, fotos, direccionNormalizada };
    return noticia;
}

function eliminarImagenesDelLocalStorage() {
    const clavesAEliminar = [];

    for (let i = 0; i < localStorage.length; i++) {
        const clave = localStorage.key(i);
        if (clave.startsWith("imagen_")) {
            clavesAEliminar.push(clave);
        }
    }

    clavesAEliminar.forEach(clave => localStorage.removeItem(clave));
}

function guardarImagenesEnLocalStorage() {

    eliminarImagenesDelLocalStorage();
    const archivos = $("#imagenNoticia")[0].files;

    if (archivos.length === 0) return;

    for (let i = 0; i < archivos.length; i++) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const base64 = e.target.result;
            const clave = `imagen_${Date.now()}_${i}`;
            localStorage.setItem(clave, base64);
        };
        reader.readAsDataURL(archivos[i]);
    }
}

function mostrarDeFormularioDeDireccion() {
    $('input[name="existeDireccion"]').change(function () {
        if ($(this).is(':checked')) {
            $(".direccionNoticia").show();
            $("#direccionNormalizadaNoticia").show();
            
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
                    if (listaDeDireccionesNormalizadas.length == 0) {
                        alert("Error: No se encontraron direcciones normalizadas");
                    }
                    if (listaDeDireccionesNormalizadas.length > 1) {
                        alert("Hay mas de una direccion con el mismo nombre, se mas especifico colocando la localidad");
                        $("#localidadNoticia").show();
                    }
                     if (listaDeDireccionesNormalizadas.length == 1) {
                        const direccionNormalizada = listaDeDireccionesNormalizadas;
                        localStorage.setItem("ubicacion", JSON.stringify(direccionNormalizada[0]));
                         agregarDireccionValida(direccionNormalizada);
                     }
                });
        }
    })
}
function agregarDireccionValida(direccionNormalizada) {
    if (direccionNormalizada) {
        const direcciones = $(".direcciones");
        const itemDireccion = (`<li><button type="button" class="boton-opcion">${direccionNormalizada[0].direccion}</button></li>`)
        direcciones.append(itemDireccion);
        
    }
}

function seleccionarDireccionValida() {
    $(".direcciones").on("click", ".boton-opcion", function () {
        const direccionNormalizada = $(this).text();
        $("#direccionNormalizadaNoticia").val(direccionNormalizada);
    })
}

function limpiarDireccionesValidas() {
    $(".direcciones").empty();
}


function obtenerCamposFormularioDireccion() {
    const calle = $("#calleNoticia").val();
    const altura = $("#alturaNoticia").val();
    const localidad = $("#localidadNoticia").val();
    return direccion = { calle, altura , localidad};
}

function validarCamposDireccion(direccion) {
    if (direccion.calle.length > 0 && direccion.altura.length > 0) {
        console.log(direccion.localidad);
        return true;
    }
    return false
}

function obtenerDireccionNormalizada(direccion) {
    return fetch("http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=" + direccion.calle + " " + direccion.altura + ", " + direccion.localidad)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            if (data.direccionesNormalizadas.length > 0) {
                return validarDireccionesCalleYAltura(data);
            } else {
                alert("Error: No se encontraron direcciones normalizadas");
                return [];
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
    }
}


function redirigirYGuardarNoticiaEnLocalStorage(noticia) {
    guardarImagenesEnLocalStorage();
    localStorage.setItem("noticia", JSON.stringify(noticia));
    window.location.href = "../../assets/pages/noticia.html";
}