import React, { useEffect, useState} from "react";

function NotasList() {
    const [notas, setNotas] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [contenido, setContenido] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        cargarNotas();
    }, []);

    const cargarNotas = () => {
        fetch("http://localhost:8080/notas")
            .then((res) => res.json())
            .then((data) => setNotas(data));
    }

    const guardarNota = (e) => {
        e.preventDefault();

        if(editandoId !== null) {
            fetch(`http://localhost:8080/notas/${editandoId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({titulo, contenido}),
            }).then(() => {
                setTitulo("");
                setContenido("");
                setEditandoId(null);
                cargarNotas();
            });
        }
        else {
            fetch("http://localhost:8080/notas", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({titulo, contenido}),
            }).then(() => {
                setTitulo("");
                setContenido("");
                cargarNotas();
            });
        }
    };

    const editarNota = (nota) => {
        setTitulo(nota.titulo);
        setContenido(nota.contenido);
        setEditandoId(nota.id);
    }

    const eliminarNota = (id) => {
        fetch(`http://localhost:8080/notas/${id}`, {
            method: "DELETE",
        }).then(() => cargarNotas());
    };

    return (
        <div>
            <h1>
                Mis Notas
            </h1>

            <form onSubmit={guardarNota}>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Contenido"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    required
                />
                <button type="sumbit">
                    {editandoId ? "Actualizar" : "Crear"}
                </button>
                {editandoId && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditandoId(null);
                            setTitulo("");
                            setContenido("");
                        }}
                    >
                        Cancelar
                    </button>
                )}
            </form>

            <ul>
                {notas.map((nota) => (
                    <li key={nota.id}>
                        <strong>
                            {nota.titulo}
                        </strong>: {nota.contenido}{" "}
                        <button onClick={() => editarNota(nota)}>
                            Editar
                        </button>
                        <button onClick={() => eliminarNota(nota.id)}>
                            Eliminar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotasList