document.addEventListener("DOMContentLoaded", () => {
    // Obtenemos el ID del video desde la URL (ej: reproductor.html?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const videoId = urlParams.get('id');

    if (videoId) {
        cargarVideo(videoId);
        cargarComentarios(videoId);
        cargarRecomendaciones(videoId);
    } else {
        document.getElementById("titulo-video").textContent = "Video no encontrado";
    }

    // Evento para publicar un comentario nuevo
    document.getElementById("btn-comentar").addEventListener("click", () => {
        publicarComentario(videoId);
    });
});

async function cargarVideo(id) {
    try {
        const respuesta = await fetch(`http://127.0.0.1:8000/videos/${id}`);
        const video = await respuesta.json();

        // Cargar detalles de texto
        document.getElementById("titulo-video").textContent = video.titulo;
        document.getElementById("detalles-video").textContent = `${video.canal} • ${video.vistas} vistas • ${video.fecha}`;

        // Crear elemento de video de forma segura
        const contenedor = document.getElementById("video-container");
        const elementoVideo = document.createElement("video");
        elementoVideo.controls = true;
        elementoVideo.autoplay = true;
        elementoVideo.style.width = "100%";
        elementoVideo.style.borderRadius = "10px";
        
        const source = document.createElement("source");
        source.src = video.video_url; 
        source.type = "video/mp4";

        elementoVideo.appendChild(source);
        contenedor.appendChild(elementoVideo);

    } catch (error) {
        console.error("Error al cargar el video", error);
    }
}


async function cargarComentarios(videoId) {
    const respuesta = await fetch(`http://127.0.0.1:8000/comments/video/${videoId}`);
    const comentarios = await respuesta.json();
    
    const lista = document.getElementById("lista-comentarios");
    // Limpiar lista
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }

    comentarios.forEach(com => {
        const caja = document.createElement("div");
        caja.style.marginBottom = "10px";

        const autor = document.createElement("strong");
        autor.textContent = com.autor + ": ";
        
        const texto = document.createElement("span");
        texto.textContent = com.texto;

        caja.appendChild(autor);
        caja.appendChild(texto);
        lista.appendChild(caja);
    });
}

async function publicarComentario(videoId) {
    const autorInput = document.getElementById("input-autor");
    const textoInput = document.getElementById("input-comentario");

    if (autorInput.value === "" || textoInput.value === "") return;

    const data = {
        autor: autorInput.value,
        texto: textoInput.value,
        video_id: parseInt(videoId)
    };

    await fetch("http://127.0.0.1:8000/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    
    autorInput.value = "";
    textoInput.value = "";
    cargarComentarios(videoId);
}

async function cargarRecomendaciones(videoId) {
    const respuesta = await fetch(`http://127.0.0.1:8000/videos/${videoId}/recomendaciones`);
    const recomendados = await respuesta.json();

    const lista = document.getElementById("lista-recomendaciones");
    
    recomendados.forEach(video => {
        const enlace = document.createElement("a");
        enlace.href = `reproductor.html?id=${video.id}`;
        enlace.style.display = "flex";
        enlace.style.gap = "10px";
        enlace.style.textDecoration = "none";
        enlace.style.color = "white";

        const imagen = document.createElement("img");
        imagen.src = video.miniatura_url;
        imagen.style.width = "120px";
        imagen.style.borderRadius = "5px";

        const info = document.createElement("div");
        const titulo = document.createElement("p");
        titulo.textContent = video.titulo;
        titulo.style.margin = "0 0 5px 0";
        titulo.style.fontSize = "14px";
        titulo.style.fontWeight = "bold";

        const canal = document.createElement("p");
        canal.textContent = video.canal;
        canal.style.margin = "0";
        canal.style.fontSize = "12px";
        canal.style.color = "gray";

        info.appendChild(titulo);
        info.appendChild(canal);
        
        enlace.appendChild(imagen);
        enlace.appendChild(info);
        
        lista.appendChild(enlace);
    });
}