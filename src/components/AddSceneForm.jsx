// src/components/AddSceneForm.jsx
import React, { useState } from 'react';

const AddSceneForm = ({ onAddScene, onClose, availableScenes }) => {
  const [newScene, setNewScene] = useState({
    title: '',
    imageFile: null,
    hotspots: []
  });

  const [hotspot, setHotspot] = useState({
    type: 'scene',
    title: '',
    text: '',
    pitch: 0,
    yaw: 0,
    targetScene: ''
  });

  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      setNewScene({ ...newScene, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addHotspot = () => {
    if (!hotspot.title) {
      setError('Por favor, ingresa un título para el punto');
      return;
    }

    if (hotspot.type === 'scene' && !hotspot.targetScene) {
      setError('Por favor, selecciona una escena destino');
      return;
    }

    setNewScene({
      ...newScene,
      hotspots: [...newScene.hotspots, { ...hotspot, id: Date.now() }]
    });
    setHotspot({
      type: 'scene',
      title: '',
      text: '',
      pitch: 0,
      yaw: 0,
      targetScene: ''
    });
    setError('');
  };

  const removeHotspot = (hotspotId) => {
    setNewScene({
      ...newScene,
      hotspots: newScene.hotspots.filter(h => h.id !== hotspotId)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newScene.title || !previewUrl) {
      setError('Por favor, completa el título y selecciona una imagen');
      return;
    }

    const sceneData = {
      id: Date.now(),
      title: newScene.title,
      imageUrl: previewUrl,
      hotspots: newScene.hotspots
    };

    onAddScene(sceneData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Agregar Nueva Escena</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título de la escena
            </label>
            <input
              type="text"
              value={newScene.title}
              onChange={(e) => setNewScene({ ...newScene, title: e.target.value })}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Sala Principal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen 360°
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Puntos de Interés (Opcional)</h3>
            
            <div className="space-y-2">
              <select
                value={hotspot.type}
                onChange={(e) => setHotspot({ ...hotspot, type: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="scene">Punto de navegación</option>
                <option value="info">Punto de información</option>
              </select>

              <input
                type="text"
                placeholder="Título del punto"
                value={hotspot.title}
                onChange={(e) => setHotspot({ ...hotspot, title: e.target.value })}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />

              {hotspot.type === 'info' && (
                <textarea
                  placeholder="Información descriptiva"
                  value={hotspot.text}
                  onChange={(e) => setHotspot({ ...hotspot, text: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              )}

              {hotspot.type === 'scene' && (
                <select
                  value={hotspot.targetScene}
                  onChange={(e) => setHotspot({ ...hotspot, targetScene: e.target.value })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar escena destino</option>
                  {availableScenes.map(scene => (
                    <option key={scene.id} value={scene.id}>
                      {scene.title}
                    </option>
                  ))}
                </select>
              )}

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Pitch (vertical)"
                  value={hotspot.pitch}
                  onChange={(e) => setHotspot({ ...hotspot, pitch: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Yaw (horizontal)"
                  value={hotspot.yaw}
                  onChange={(e) => setHotspot({ ...hotspot, yaw: parseFloat(e.target.value) })}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={addHotspot}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Agregar Punto
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {newScene.hotspots.map((spot) => (
                <div
                  key={spot.id}
                  className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                >
                  <div>
                    <p className="font-medium">{spot.title}</p>
                    <p className="text-sm text-gray-500">
                      {spot.type === 'scene' 
                        ? `Navega a: ${availableScenes.find(s => s.id === parseInt(spot.targetScene))?.title || 'Escena seleccionada'}`
                        : spot.text}
                    </p>
                    <p className="text-xs text-gray-400">
                      Pitch: {spot.pitch}, Yaw: {spot.yaw}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHotspot(spot.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
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
              Guardar Escena
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSceneForm;