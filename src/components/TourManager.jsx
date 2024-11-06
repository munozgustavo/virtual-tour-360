// src/components/TourManager.jsx
import React, { useState } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';

const TourManager = ({ tours, onAddTour, onEditTour, onDeleteTour, onSelectTour, selectedTourId }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTourName, setNewTourName] = useState('');

  const handleAddTour = (e) => {
    e.preventDefault();
    if (newTourName.trim()) {
      onAddTour({
        id: Date.now(),
        name: newTourName,
        scenes: []
      });
      setNewTourName('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Recorridos Virtuales</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Recorrido
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddTour} className="mb-6 flex gap-2 bg-gray-700 p-4 rounded-lg">
          <input
            type="text"
            value={newTourName}
            onChange={(e) => setNewTourName(e.target.value)}
            placeholder="Nombre del recorrido"
            className="flex-1 p-2 rounded-md bg-gray-600 text-white placeholder-gray-400 border border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancelar
          </button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedTourId === tour.id
                ? 'border-blue-500 bg-blue-900/30'
                : 'border-gray-600 hover:border-blue-400 bg-gray-700'
            }`}
            onClick={() => onSelectTour(tour.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg text-white">{tour.name}</h3>
                <p className="text-sm text-gray-300">
                  {tour.scenes.length} escena{tour.scenes.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTour(tour.id);
                  }}
                  className="p-2 text-blue-400 hover:bg-blue-900/50 rounded-full transition-colors"
                  title="Editar recorrido"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('¿Estás seguro de eliminar este recorrido?')) {
                      onDeleteTour(tour.id);
                    }
                  }}
                  className="p-2 text-red-400 hover:bg-red-900/50 rounded-full transition-colors"
                  title="Eliminar recorrido"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No hay recorridos creados</p>
          <p className="text-sm">Crea un nuevo recorrido para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default TourManager;