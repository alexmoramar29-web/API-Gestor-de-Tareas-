from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Este es un permiso para que pyhton se comunique con html sin problemad
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"], 
    allow_headers=["*"],
)

class Tarea(BaseModel):
    titulo: str
    materia: str
    completada: bool = False

tareas_db = [
    {"id": 1, "titulo": "Terminar web", "materia": "Aplicaciones web", "completada": True}
]

@app.get("/tareas", status_code=status.HTTP_200_OK)
async def obtener_tareas():
    return tareas_db

@app.get("/tareas/{id}", status_code=status.HTTP_200_OK)
async def obtener_tarea(id: int):
    for t in tareas_db:
        if t["id"] == id:
            return t
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No existe")

@app.post("/tareas", status_code=status.HTTP_201_CREATED)
async def crear_tarea(tarea: Tarea):
    if not tarea.titulo or not tarea.materia:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Faltan datos")
    
    nueva_tarea = {
        "id": len(tareas_db) + 1,
        "titulo": tarea.titulo,
        "materia": tarea.materia,
        "completada": tarea.completada
    }
    tareas_db.append(nueva_tarea)
    return nueva_tarea