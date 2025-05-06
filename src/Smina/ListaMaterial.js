import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';

const ListaMaterial = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await apiService.getMaterials();
                setMaterials(response.data);
            } catch (error) {
                setError('Errora al buscar los materiales ');
            }
        };

        fetchMaterials();
    }, []);

    const handleDelete = async (id) => {
        try {
            await apiService.deleteMaterial(id);
            setMaterials(materials.filter(material => material._id !== id));
        } catch (error) {
            setError('Error al eliminar los materiales.');
        }
    };

    return (
        <div>
            <h2>Lista Material</h2>
            {error && <p>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>fecha</th>
                        <th>Nombre</th>
                        <th>cantidad</th>
                        <th>Tipo</th>
                        <th>provedor</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {materials.map(material => (
                        <tr key={material._id}>
                            <td>{new Date(material.date).toLocaleDateString()}</td>
                            <td>{material.nombre}</td>
                            <td>{material.cantidad}</td>
                            <td>{material.tipo}</td>
                            <td>{material.provedor}</td>
                            <td>
                                <button onClick={() => handleDelete(material._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListaMaterial;