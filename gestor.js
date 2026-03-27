const url = "http://127.0.0.1:8000/tareas";

async function cargar() {
    const res = await fetch(url);
    const tareas = await res.json();
    
    const lista = document.getElementById("lista");
    const plantilla = document.getElementById("plantilla-tarea");
    
    lista.innerHTML = "";
    
    tareas.forEach(t => {
        const clon = plantilla.content.cloneNode(true);

        clon.querySelector(".tarea-materia").textContent = t.materia;
        clon.querySelector(".tarea-titulo").textContent = t.titulo;
        clon.querySelector(".tarea-estado").textContent = t.completada ? "Completada" : "Pendiente";

        clon.querySelector(".btn-estado").onclick = () => cambiarEstado(t.id, t.titulo, t.materia, t.completada);
        clon.querySelector(".btn-eliminar").onclick = () => eliminar(t.id);
        
        lista.appendChild(clon);
    });
}

async function guardar() {
    const titulo = document.getElementById("titulo").value;
    const materia = document.getElementById("materia").value;
    const completada = document.getElementById("completada").checked; 

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo, materia: materia, completada: completada })
    });

    document.getElementById("titulo").value = "";
    document.getElementById("materia").value = "";
    document.getElementById("completada").checked = false; 
    cargar();
}

async function cambiarEstado(id, titulo, materia, estadoActual) {
    await fetch(`${url}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo, materia: materia, completada: !estadoActual })
    });
    cargar();
}

async function eliminar(id) {
    await fetch(`${url}/${id}`, {
        method: "DELETE"
    });
    cargar();
}

cargar();