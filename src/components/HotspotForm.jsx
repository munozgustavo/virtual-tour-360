import React, { useState } from 'react';

const HotspotForm = ({ 
  availableScenes, 
  onSave, 
  onClose, 
  initialCoords,
  currentSceneId 
}) => {
  const [hotspot, setHotspot] = useState({
    type: 'scene',
    title: '',
    text: '',
    pitch: initialCoords.pitch,
    yaw: initialCoords.yaw,
    targetScene: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!hotspot.title) {
      alert('Por favor ingresa un título para el punto');
      return;
    }

    if (hotspot.type === 'scene' && !hotspot.targetScene) {
      alert('Por favor selecciona una escena destino');
      return;
    }

    onSave({
      ...hotspot,
      id: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Agregar Punto de Navegación</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de punto
            </label>
            <select
              value={hotspot.type}
              onChange={(e) => setHotspot({ ...hotspot, type: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="scene">Navegación</option>
              <option value="info">Información</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              value={hotspot.title}
              onChange={(e) => setHotspot({ ...hotspot, title: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Ir a la cocina"
            />
          </div>

          {hotspot.type === 'info' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información
              </label>
              <textarea
                value={hotspot.text}
                onChange={(e) => setHotspot({ ...hotspot, text: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe este punto de interés..."
              />
            </div>
          )}

          {hotspot.type === 'scene' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destino
              </label>
              <select
                value={hotspot.targetScene}
                onChange={(e) => setHotspot({ ...hotspot, targetScene: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar destino</option>
                {availableScenes
                  .filter(scene => scene.id !== currentSceneId)
                  .map(scene => (
                    <option key={scene.id} value={scene.id}>
                      {scene.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="bg-gray-50 p-3 rounded-md">
            <h4 className="text-sm font-medium text-gray-700 mb-1">Coordenadas</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500">Pitch (vertical)</label>
                <p className="font-mono text-sm">{hotspot.pitch.toFixed(2)}°</p>
              </div>
              <div>
                <label className="text-xs text-gray-500">Yaw (horizontal)</label>
                <p className="font-mono text-sm">{hotspot.yaw.toFixed(2)}°</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HotspotForm;
