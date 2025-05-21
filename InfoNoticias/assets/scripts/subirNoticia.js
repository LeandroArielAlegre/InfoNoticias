const USIG_API_URL = "http://servicios.usig.buenosaires.gob.ar/normalizar/?direccion=";

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
/*
function insertarEnFormularioImagenesDisponibles(){
    const cantidadDeImagenes = 6; 
  const select = $('#imagenNoticia');
  for (let i = 1; i <= cantidadDeImagenes; i++) {
    const ruta = `img${i}.jpg`;
    const opcion = `<option value="${ruta}">Imagen ${i}</option>`;
    select.append(opcion);
  }
}*/


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
                    if (listaDeDireccionesNormalizadas.length == 0) {
                        alert("Error: No se encontraron direcciones normalizadas");
                    }
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

function seleccionarDireccionValida() {
    $(".direcciones").on("click", ".boton-opcion", function () {
        const direccionNormalizada = $(this).text();
        guardarDireccionSeleccionada(direccionNormalizada);
        //guardarDireccionUnicaConCoordenadas(direccionNormalizada);
        $("#direccionNormalizadaNoticia").val(direccionNormalizada);
    })
}

function guardarDireccionSeleccionada(direccionNormalizada) {
    fetch(USIG_API_URL + direccionNormalizada).
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



function limpiarDireccionesValidas() {
    $(".direcciones").empty();
}


function obtenerCamposFormularioDireccion() {
    //const calle = $("#direccion").val();
    // const altura = $("#alturaNoticia").val();
    return direccion = $("#direccion").val();
}

function validarCamposDireccion(direccion) {
    if (direccion.length > 0) {
        return true;
    }
    return false
}

function obtenerDireccionNormalizada(direccion) {
    return fetch(USIG_API_URL + direccion)
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
            }

        })
        .catch(error => {
            console.error("Error al obtener la dirección normalizada:", error);
            return [];

        });
}

// PROOF OF CONCEPT - ITERAR HASTA OBTENER JSON CON UN SOLO RESULTADO
async function guardarDireccionUnicaConCoordenadas(direccionNormalizada) {
    try {
        const primeraRespuesta = await fetch(USIG_API_URL + direccionNormalizada);
        if (!primeraRespuesta.ok) throw new Error("Error en la respuesta del servidor");

        const datos = await primeraRespuesta.json();
        const direcciones = datos.direccionesNormalizadas;

        if (!direcciones || direcciones.length === 0) {
            throw new Error("No se encontraron direcciones normalizadas");
        }

        for (const direccion of direcciones) {
            const nuevaDireccion = direccion.direccion;

            const respuesta = await fetch(USIG_API_URL + nuevaDireccion);
            if (!respuesta.ok) continue;

            const datosNorm = await respuesta.json();
            const resultados = datosNorm.direccionesNormalizadas;

            if (resultados && resultados.length === 1 && resultados[0].coordenadas) {
                // 🎯 Found it
                console.log("Dirección única con coordenadas:", resultados[0]);
                localStorage.setItem("ubicacion", JSON.stringify(resultados[0]));
                return;
            }
        }

        console.warn("No se encontró una dirección única con coordenadas.");
    } catch (error) {
        console.error("Error durante la búsqueda de dirección:", error);
    }
}


function validarDireccionesCalleYAltura(data) {
    let listaDeDireccionesNormalizadas = [];
    if (data.direccionesNormalizadas.length > 0) {
        for (let i = 0; i < data.direccionesNormalizadas.length; i++) {
            if (data.direccionesNormalizadas[i].tipo == "calle_altura" || data.direccionesNormalizadas[i].tipo == "calle_y_calle") {
                listaDeDireccionesNormalizadas.push(data.direccionesNormalizadas[i]);
            }
        }

        return listaDeDireccionesNormalizadas;

    } else {
        return "";
    }
}


function redirigirYGuardarNoticiaEnLocalStorage(noticia) {
    guardarImagenesEnLocalStorage();
    localStorage.setItem("noticia", JSON.stringify(noticia));
    window.location.href = "../../assets/pages/noticia.html";
}