const url = "http://127.0.0.1:8000/tareas";

async function cargar() {
    const res = await fetch(url);
    const tareas = await res.json();
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    
    tareas.forEach(t => {
        let estado = t.completada ? "✅ Completada" : "⏳ Pendiente";
        lista.innerHTML += `
            <li>
                <strong>${t.materia}</strong> - ${t.titulo} <br>
                <small><em>Estado: ${estado}</em></small> <br><br>
                <button onclick="cambiarEstado(${t.id}, '${t.titulo}', '${t.materia}', ${t.completada})" style="margin-bottom: 5px; background-color: #555;">Cambiar Estado</button>
                <button onclick="eliminar(${t.id})" style="background-color: #d9534f;">Eliminar</button>
            </li>`;
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