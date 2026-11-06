document.addEventListener("DOMContentLoaded", () => {
    cargarVideos();
});

async function cargarVideos() {
    try {
        const respuesta = await fetch("http://127.0.0.1:8000/videos/");
        const videos = await respuesta.json();
        
        const contenedor = document.getElementById("contenedor-videos");
        while (contenedor.firstChild) {
            contenedor.removeChild(contenedor.firstChild);
        }

        videos.forEach(video => {
            const enlace = document.createElement("a");
            enlace.href = `reproductor.html?id=${video.id}`; 
            enlace.className = "video-card";
            enlace.style.textDecoration = "none";
            enlace.style.color = "white";

            const imagen = document.createElement("img");
            imagen.src = video.miniatura_url; 
            imagen.className = "miniatura";
            imagen.alt = video.titulo;

            const titulo = document.createElement("h3");
            titulo.textContent = video.titulo;
            titulo.style.margin = "8px 0 4px 0";
            titulo.style.fontSize = "16px";

            const canal = document.createElement("p");
            canal.textContent = video.canal;
            canal.className = "detalles";

            const info = document.createElement("p");
            info.textContent = `${video.vistas} vistas • ${video.fecha}`;
            info.className = "detalles";

          
            enlace.appendChild(imagen);
            enlace.appendChild(titulo);
            enlace.appendChild(canal);
            enlace.appendChild(info);

            contenedor.appendChild(enlace);
        });
    } catch (error) {
        console.error("Error al cargar los videos:", error);
    }
}