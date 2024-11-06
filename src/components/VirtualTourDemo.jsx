import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, Plus, Edit, Trash } from 'lucide-react';
import AddSceneForm from './AddSceneForm';
import EditSceneForm from './EditSceneForm';
import HotspotForm from './HotspotForm';

const VirtualTourDemo = () => {
  const [scenes, setScenes] = useState([
    {
      id: 1,
      title: 'Sala Principal',
      imageUrl: 'https://pannellum.org/images/alma.jpg',
      hotspots: [
        {
          id: 1,
          type: 'scene',
          title: 'Ir a Cocina',
          pitch: -2.1,
          yaw: 132.9,
          targetScene: 2
        }
      ]
    },
    {
      id: 2,
      title: 'Cocina',
      imageUrl: 'https://pannellum.org/images/elm-tree.jpg',
      hotspots: [
        {
          id: 2,
          type: 'scene',
          title: 'Volver a Sala',
          pitch: 14.1,
          yaw: 1.5,
          targetScene: 1
        }
      ]
    }
  ]);

  const [currentScene, setCurrentScene] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewer, setViewer] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [isPlacingHotspot, setIsPlacingHotspot] = useState(false);
  const [showHotspotForm, setShowHotspotForm] = useState(false);
  const [tempHotspot, setTempHotspot] = useState(null);
  const containerRef = useRef(null);

  const handleHotspotButtonClick = () => {
    setIsPlacingHotspot(!isPlacingHotspot);
    if (isPlacingHotspot) {
      setShowHotspotForm(false);
      setTempHotspot(null);
    }
  };

  const setupHotspotPlacement = (viewer) => {
    const container = document.getElementById('panorama');
    
    container.addEventListener('mousedown', (e) => {
      if (!isPlacingHotspot) return;

      const coords = viewer.mouseEventToCoords(e);
      setTempHotspot({
        pitch: coords[0],
        yaw: coords[1]
      });
      setShowHotspotForm(true);
    });
  };

  const createViewer = (sceneIndex) => {
    if (viewer) {
      viewer.destroy();
    }

    try {
      const newViewer = window.pannellum.viewer('panorama', {
        type: 'equirectangular',
        panorama: scenes[sceneIndex].imageUrl,
        autoLoad: true,
        hotSpots: scenes[sceneIndex].hotspots.map(hotspot => ({
          ...hotspot,
          cssClass: 'custom-hotspot-scene',
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          clickHandlerFunc: () => {
            if (hotspot.type === 'scene' && hotspot.targetScene) {
              const targetIndex = scenes.findIndex(scene => scene.id === hotspot.targetScene);
              if (targetIndex !== -1) {
                setCurrentScene(targetIndex);
              }
            }
          }
        })),
        autoRotate: -2,
        compass: true,
        hfov: 100,
        showControls: false,
        minHfov: 50,
        maxHfov: 120,
        initHfov: 100,
        showZoomControls: false,
        keyboardZoom: true,
        mouseZoom: true
      });
      
      setViewer(newViewer);
      setupHotspotPlacement(newViewer);
    } catch (error) {
      console.error('Error al crear el visor:', error);
    }
  };

  useEffect(() => {
    if (window.pannellum && scenes.length > 0) {
      createViewer(currentScene);
    }

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, [currentScene, scenes]);

  const handleSceneChange = (direction) => {
    setCurrentScene(prev => {
      const newIndex = direction === 'next' 
        ? (prev === scenes.length - 1 ? 0 : prev + 1)
        : (prev === 0 ? scenes.length - 1 : prev - 1);
      return newIndex;
    });
  };

  const handleSaveHotspot = (newHotspot) => {
    setScenes(prevScenes => 
      prevScenes.map(scene => {
        if (scene.id === scenes[currentScene].id) {
          return {
            ...scene,
            hotspots: [...scene.hotspots, {
              ...newHotspot,
              pitch: tempHotspot.pitch,
              yaw: tempHotspot.yaw,
              id: Date.now()
            }]
          };
        }
        return scene;
      })
    );

    setTimeout(() => {
      if (viewer) {
        createViewer(currentScene);
      }
    }, 100);

    setIsPlacingHotspot(false);
    setShowHotspotForm(false);
    setTempHotspot(null);
  };

  const handleAddScene = (newScene) => {
    setScenes([...scenes, newScene]);
  };

  const handleEditScene = (sceneId) => {
    const scene = scenes.find(s => s.id === sceneId);
    if (scene) {
      setEditingScene(scene);
      setShowEditForm(true);
    }
  };

  const handleSaveEditedScene = (updatedScene) => {
    setScenes(scenes.map(scene => 
      scene.id === updatedScene.id ? updatedScene : scene
    ));
    setShowEditForm(false);
    setEditingScene(null);
  };

  const handleThumbnailClick = (index) => {
    if (viewer) {
      viewer.destroy();
    }
    setCurrentScene(index);
  };

  const handleDeleteScene = (index) => {
    if (scenes.length <= 1) {
      alert('No puedes eliminar la última escena');
      return;
    }

    if (window.confirm('¿Estás seguro de eliminar esta escena?')) {
      setScenes(scenes.filter((_, i) => i !== index));
      if (currentScene >= index) {
        setCurrentScene(prev => prev > 0 ? prev - 1 : 0);
      }
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
    if (containerRef.current) {
      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Tour Virtual 360°</h1>
          <div className="flex gap-2">
            <button
              onClick={handleHotspotButtonClick}
              className={`px-4 py-2 rounded-lg ${
                isPlacingHotspot 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {isPlacingHotspot ? 'Cancelar Punto' : 'Agregar Punto'}
            </button>
            
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Agregar Escena
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`panorama-container relative rounded-lg overflow-hidden shadow-2xl ${
            isFullscreen ? 'fixed inset-0 z-50 bg-black rounded-none' : 'w-full h-[600px]'
          }`}
        >
          <div id="panorama" className="w-full h-full" />

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-between p-4">
              <button
                onClick={() => handleSceneChange('prev')}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 pointer-events-auto"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => handleSceneChange('next')}
                className="p-3 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-all duration-200 hover:scale-110 pointer-events-auto"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/70 via-black/50 to-transparent pointer-events-auto">
              <h2 className="text-white text-xl font-bold">
                {scenes[currentScene].title}
              </h2>
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-all duration-200 hover:scale-110"
              >
                {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        <div className={`mt-6 grid grid-cols-3 gap-4 ${isFullscreen ? 'hidden' : ''}`}>
          {scenes.map((scene, index) => (
            <div key={scene.id} className="relative group">
              <div
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                  index === currentScene 
                    ? 'ring-4 ring-blue-500 scale-105' 
                    : 'hover:ring-2 ring-blue-300'
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={scene.imageUrl}
                  alt={scene.title}
                  className="w-full h-24 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent">
                  <p className="absolute bottom-2 left-2 text-white text-sm font-medium">
                    {scene.title}
                  </p>
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditScene(scene.id);
                  }}
                  className="p-1.5 bg-blue-500 rounded-full text-white hover:bg-blue-600"
                  title="Editar espacio"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteScene(index);
                  }}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Eliminar espacio"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showAddForm && (
          <AddSceneForm
            onAddScene={handleAddScene}
            onClose={() => setShowAddForm(false)}
            availableScenes={scenes}
          />
        )}

        {showEditForm && editingScene && (
          <EditSceneForm
            scene={editingScene}
            availableScenes={scenes}
            onSave={handleSaveEditedScene}
            onClose={() => {
              setShowEditForm(false);
              setEditingScene(null);
            }}
          />
        )}

        {showHotspotForm && tempHotspot && isPlacingHotspot && (
          <HotspotForm
            availableScenes={scenes}
            currentSceneId={scenes[currentScene].id}
            initialCoords={tempHotspot}
            onSave={handleSaveHotspot}
            onClose={() => {
              setShowHotspotForm(false);
              setTempHotspot(null);
              setIsPlacingHotspot(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VirtualTourDemo;