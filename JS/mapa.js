document.addEventListener('DOMContentLoaded', () => {
    
    // 1. CONFIGURACIÓN DE MAPBOX
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2FnZWthb28iLCJhIjoiY210Nmttbjh2MTQ2MzJ5b2Q2dXJuM2FoeiJ9.0HKpOqqrF-HKkEtSRrCXvA';

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/standard', 
        center: [-70.6440, -33.5386], 
        zoom: 13.5,
        pitch: 0, 
        bearing: 0,
        attributionControl: false
    });

    // 2. PERÍMETRO Y CÍRCULOS
    const perimetroSanRamon = [
        [-70.64820, -33.51860],
        [-70.63220, -33.52220],
        [-70.63400, -33.53500],
        [-70.63600, -33.54600],
        [-70.63860, -33.55830],
        [-70.65580, -33.55620],
        [-70.65300, -33.54200],
        [-70.65050, -33.53000],
        [-70.64820, -33.51860]
    ];

    function crearCirculo(lng, lat, radioMetros) {
        const puntos = 64;
        const coords = [];
        const km = radioMetros / 1000;
        const distX = km / (111.320 * Math.cos(lat * Math.PI / 180));
        const distY = km / 110.574;

        for (let i = 0; i < puntos; i++) {
            const theta = (i / puntos) * (2 * Math.PI);
            coords.push([lng + (distX * Math.cos(theta)), lat + (distY * Math.sin(theta))]);
        }
        coords.push(coords[0]);
        return coords;
    }

    const circulosNDVI = [
        { lng: -70.6465, lat: -33.5370, r: 220, op: 0.28 },
        { lng: -70.6450, lat: -33.5410, r: 220, op: 0.28 },
        { lng: -70.6380, lat: -33.5300, r: 210, op: 0.30 },
        { lng: -70.6500, lat: -33.5465, r: 140, op: 0.30 },
        { lng: -70.6390, lat: -33.5465, r: 140, op: 0.30 },
        { lng: -70.6460, lat: -33.5525, r: 200, op: 0.30 },
        { lng: -70.6410, lat: -33.5210, r: 70,  op: 0.38 },
        { lng: -70.6345, lat: -33.5230, r: 100, op: 0.40 },
        { lng: -70.6500, lat: -33.5310, r: 65,  op: 0.38 },
        { lng: -70.6375, lat: -33.5390, r: 110, op: 0.35 },
        { lng: -70.6500, lat: -33.5555, r: 80,  op: 0.40 },
        { lng: -70.6515, lat: -33.5425, r: 120, op: 0.32 },
        { lng: -70.6405, lat: -33.54225, r: 170, op: 0.30 }
    ];

    const featuresNDVI = circulosNDVI.map(c => ({
        type: 'Feature',
        properties: { opacidad: c.op },
        geometry: { type: 'Polygon', coordinates: [crearCirculo(c.lng, c.lat, c.r)] }
    }));

    featuresNDVI.push({
        type: 'Feature',
        properties: { opacidad: 0.40 },
        geometry: { type: 'Polygon', coordinates: [[
            [-70.6374, -33.5533], [-70.6378, -33.5533], [-70.6385, -33.5525], 
            [-70.6378, -33.5517], [-70.6374, -33.5517], [-70.6374, -33.5533]
        ]]}
    });

    // 3. UI DEL SLIDER 
    const sliderContainer = document.createElement('div');
    sliderContainer.style.cssText = 'position: absolute; bottom: 30px; left: 20px; z-index: 999; background: rgba(19, 24, 34, 0.95); padding: 15px 25px; border: 1px solid rgba(0, 255, 135, 0.5); border-radius: 8px; width: 350px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: none; flex-direction: column; gap: 8px;';
    sliderContainer.innerHTML = `
        <div style="display:flex; justify-content: space-between; align-items: center; color: #00FF87; font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: bold;">
            <span>☀️ Luz Solar 3D</span>
            <span id="time-display" style="background: rgba(0,255,135,0.1); padding: 4px 10px; border-radius: 4px;">Atardecer</span>
        </div>
        <input type="range" id="time-slider" min="1" max="4" step="1" value="3" style="width: 100%; cursor: pointer; margin-top: 10px; accent-color: #00FF87;">
        <div style="display:flex; justify-content: space-between; color: #94A3B8; font-size: 11px; font-weight: 600; font-family: 'Inter', sans-serif;">
            <span>Alba</span><span>Día</span><span>Ocaso</span><span>Noche</span>
        </div>
    `;
    document.body.appendChild(sliderContainer);

    const slider = document.getElementById('time-slider');
    const display = document.getElementById('time-display');

    const lightPresets = { 1: { id: 'dawn', label: 'Amanecer' }, 2: { id: 'day', label: 'Mediodía' }, 3: { id: 'dusk', label: 'Atardecer' }, 4: { id: 'night', label: 'Noche' } };

    slider.addEventListener('input', (e) => {
        const preset = lightPresets[e.target.value];
        display.innerText = preset.label;
        map.setConfigProperty('basemap', 'lightPreset', preset.id);
    });

    // 4. CARGA DE CAPAS
    map.on('load', () => {
        // Configuramos el mapa en modo diurno para que se vea todo a color y brillante
        map.setConfigProperty('basemap', 'lightPreset', 'day'); 
        map.setConfigProperty('basemap', 'show3dObjects', false);

        map.setConfigProperty('basemap', 'showRoadLabels', true); 
        map.setConfigProperty('basemap', 'showPointOfInterestLabels', false); 
        map.setConfigProperty('basemap', 'showPlaceLabels', true); 
        map.setConfigProperty('basemap', 'showTransitLabels', false); 

        // Delimitador de San Ramón (Cuadrado/Perímetro brillante)
        map.addSource('perimetro-source', {
            type: 'geojson',
            data: { type: 'Feature', geometry: { type: 'Polygon', coordinates: [perimetroSanRamon] } }
        });

        map.addLayer({
            id: 'perimetro-linea',
            type: 'line',
            source: 'perimetro-source',
            slot: 'top',
            paint: { 'line-color': '#00FF87', 'line-width': 3.5 }
        });

        map.addSource('ndvi-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresNDVI }
        });

        map.addLayer({
            id: 'ndvi-layer',
            type: 'fill',
            source: 'ndvi-source',
            slot: 'top', 
            paint: { 'fill-color': '#00FF87', 'fill-opacity': ['get', 'opacidad'] }
        });
        
        map.addLayer({
            id: 'ndvi-borde',
            type: 'line',
            source: 'ndvi-source',
            slot: 'top',
            paint: { 'line-color': '#00FF87', 'line-width': 1.5 }
        });

        // 5. CONTROL DE CHECKBOXES Y CÁMARA
        const checkNdvi = document.getElementById('layer-ndvi');
        const checkSombra = document.getElementById('layer-sombra');
        const checkCalor = document.getElementById('layer-calor');

        function actualizarModo(seleccionado) {
            if (checkNdvi) checkNdvi.checked = (seleccionado === 'ndvi');
            if (checkSombra) checkSombra.checked = (seleccionado === 'sombra');
            if (checkCalor) checkCalor.checked = (seleccionado === 'calor');

            if (seleccionado === 'sombra') {
                map.setLayoutProperty('ndvi-layer', 'visibility', 'none');
                map.setLayoutProperty('ndvi-borde', 'visibility', 'none');
                
                map.setConfigProperty('basemap', 'show3dObjects', true);
                map.setConfigProperty('basemap', 'lightPreset', lightPresets[slider.value].id);
                sliderContainer.style.display = 'flex';
                
                map.flyTo({
                    center: [-70.6465, -33.5370],
                    zoom: 16.5,
                    pitch: 65, 
                    bearing: -20,
                    duration: 2500
                });
            } else {
                map.setConfigProperty('basemap', 'show3dObjects', false);
                sliderContainer.style.display = 'none';

                if (seleccionado === 'ndvi') {
                    map.setLayoutProperty('ndvi-layer', 'visibility', 'visible');
                    map.setLayoutProperty('ndvi-borde', 'visibility', 'visible');
                    map.setConfigProperty('basemap', 'lightPreset', 'day'); 
                }

                map.flyTo({
                    center: [-70.6440, -33.5386],
                    zoom: 13.5,
                    pitch: 0,
                    bearing: 0,
                    duration: 2500
                });
            }
        }

        if (checkNdvi) checkNdvi.addEventListener('change', () => { if (checkNdvi.checked) actualizarModo('ndvi'); else checkNdvi.checked = true; });
        if (checkSombra) checkSombra.addEventListener('change', () => { if (checkSombra.checked) actualizarModo('sombra'); else { checkNdvi.checked = true; actualizarModo('ndvi'); } });
        if (checkCalor) checkCalor.addEventListener('change', () => { if (checkCalor.checked) actualizarModo('calor'); else { checkNdvi.checked = true; actualizarModo('ndvi'); } });
    });
});