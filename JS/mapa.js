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

    const temporadasCalor = {
        verano: {
            franjas: [
                { sur: -33.5600, norte: -33.5500, intensidad: 0.48 },
                { sur: -33.5500, norte: -33.5430, intensidad: 0.66 },
                { sur: -33.5430, norte: -33.5370, intensidad: 0.9 },
                { sur: -33.5370, norte: -33.5310, intensidad: 1.0 },
                { sur: -33.5310, norte: -33.5250, intensidad: 0.82 },
                { sur: -33.5250, norte: -33.5180, intensidad: 0.58 }
            ],
            maximo: [-70.6445, -33.5340],
            minimo: [-70.6500, -33.5540],
            templado: [-70.6385, -33.5450]
        },
        otoño: {
            franjas: [
                { sur: -33.5600, norte: -33.5510, intensidad: 0.35 },
                { sur: -33.5510, norte: -33.5450, intensidad: 0.52 },
                { sur: -33.5450, norte: -33.5390, intensidad: 0.72 },
                { sur: -33.5390, norte: -33.5320, intensidad: 0.94 },
                { sur: -33.5320, norte: -33.5250, intensidad: 0.78 },
                { sur: -33.5250, norte: -33.5180, intensidad: 0.45 }
            ],
            maximo: [-70.6410, -33.5355],
            minimo: [-70.6370, -33.5220],
            templado: [-70.6470, -33.5480]
        },
        invierno: {
            franjas: [
                { sur: -33.5600, norte: -33.5520, intensidad: 0.22 },
                { sur: -33.5520, norte: -33.5450, intensidad: 0.38 },
                { sur: -33.5450, norte: -33.5380, intensidad: 0.56 },
                { sur: -33.5380, norte: -33.5310, intensidad: 0.72 },
                { sur: -33.5310, norte: -33.5230, intensidad: 0.62 },
                { sur: -33.5230, norte: -33.5180, intensidad: 0.3 }
            ],
            maximo: [-70.6375, -33.5290],
            minimo: [-70.6500, -33.5530],
            templado: [-70.6450, -33.5420]
        },
        primavera: {
            franjas: [
                { sur: -33.5600, norte: -33.5490, intensidad: 0.4 },
                { sur: -33.5490, norte: -33.5420, intensidad: 0.6 },
                { sur: -33.5420, norte: -33.5350, intensidad: 0.82 },
                { sur: -33.5350, norte: -33.5280, intensidad: 0.96 },
                { sur: -33.5280, norte: -33.5220, intensidad: 0.74 },
                { sur: -33.5220, norte: -33.5180, intensidad: 0.5 }
            ],
            maximo: [-70.6480, -33.5320],
            minimo: [-70.6390, -33.5480],
            templado: [-70.6420, -33.5500]
        }
    };

    function recortarPorLatitud(coordenadas, limite, conservarMayor) {
        const puntos = coordenadas.slice(0, -1);
        const recortados = [];

        const estaDentro = punto => conservarMayor ? punto[1] >= limite : punto[1] <= limite;
        const interseccion = (inicio, fin) => {
            const proporcion = (limite - inicio[1]) / (fin[1] - inicio[1]);
            return [
                inicio[0] + ((fin[0] - inicio[0]) * proporcion),
                limite
            ];
        };

        for (let indice = 0; indice < puntos.length; indice++) {
            const actual = puntos[indice];
            const siguiente = puntos[(indice + 1) % puntos.length];
            const actualDentro = estaDentro(actual);
            const siguienteDentro = estaDentro(siguiente);

            if (actualDentro && siguienteDentro) {
                recortados.push(siguiente);
            } else if (actualDentro && !siguienteDentro) {
                recortados.push(interseccion(actual, siguiente));
            } else if (!actualDentro && siguienteDentro) {
                recortados.push(interseccion(actual, siguiente), siguiente);
            }
        }

        return recortados;
    }

    function crearFranjaCalor(franja) {
        let poligono = recortarPorLatitud(perimetroSanRamon, franja.sur, true);
        poligono = recortarPorLatitud(poligono.concat([poligono[0]]), franja.norte, false);
        return poligono.length >= 3 ? poligono.concat([poligono[0]]) : [];
    }

    function crearFeaturesCalor(franjas) {
        return franjas.map(franja => ({
            type: 'Feature',
            properties: { intensidad: franja.intensidad },
            geometry: {
                type: 'Polygon',
                coordinates: [crearFranjaCalor(franja)]
            }
        }));
    }

    const featuresCalor = crearFeaturesCalor(temporadasCalor.verano.franjas);

    const zonasSombra = [
        { lng: -70.6465, lat: -33.5370, r: 520, intensidad: 0.88 },
        { lng: -70.6385, lat: -33.5300, r: 410, intensidad: 0.62 },
        { lng: -70.6500, lat: -33.5480, r: 330, intensidad: 0.38 },
        { lng: -70.6400, lat: -33.5440, r: 260, intensidad: 0.76 },
        { lng: -70.6460, lat: -33.5525, r: 240, intensidad: 0.70 }
    ];

    const featuresSombra = zonasSombra.map(zona => ({
        type: 'Feature',
        properties: { intensidad: zona.intensidad },
        geometry: { type: 'Polygon', coordinates: [crearCirculo(zona.lng, zona.lat, zona.r)] }
    }));

    const featuresPuntosSombra = zonasSombra.map(zona => ({
        type: 'Feature',
        properties: { etiqueta: `Sombra ${Math.round(zona.intensidad * 100)}%` },
        geometry: { type: 'Point', coordinates: [zona.lng, zona.lat] }
    }));

    // 3. UI DEL SLIDER 
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'solar-slider';
    sliderContainer.style.cssText = 'position: absolute; bottom: 30px; left: 20px; z-index: 999; background: rgba(19, 24, 34, 0.95); padding: 15px 25px; border: 1px solid rgba(0, 255, 135, 0.5); border-radius: 8px; width: 350px; box-shadow: 0 4px 20px rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: none; flex-direction: column; gap: 8px;';
    sliderContainer.innerHTML = `
        <div style="display:flex; justify-content: space-between; align-items: center; color: #00FF87; font-family: 'Orbitron', sans-serif; font-size: 14px; font-weight: bold;">
            <span><i class="bi bi-sun-fill" aria-hidden="true"></i> Luz Solar 3D</span>
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

        map.addSource('sombra-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresSombra }
        });

        map.addLayer({
            id: 'sombra-layer',
            type: 'fill',
            source: 'sombra-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'fill-opacity': 0.2,
                'fill-color': [
                    'interpolate', ['linear'], ['get', 'intensidad'],
                    0.3, '#60EFFF',
                    0.6, '#00FF87',
                    0.9, '#FFE600'
                ]
            }
        });

        map.addSource('sombra-puntos-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresPuntosSombra }
        });

        map.addLayer({
            id: 'sombra-puntos',
            type: 'circle',
            source: 'sombra-puntos-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'circle-radius': 5,
                'circle-color': '#FFFFFF',
                'circle-stroke-color': '#0B0E14',
                'circle-stroke-width': 2
            }
        });

        map.addLayer({
            id: 'sombra-etiquetas',
            type: 'symbol',
            source: 'sombra-puntos-source',
            slot: 'top',
            layout: {
                visibility: 'none',
                'text-field': ['get', 'etiqueta'],
                'text-size': 11,
                'text-font': ['Open Sans Bold'],
                'text-offset': [0, 1.3],
                'text-allow-overlap': true
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#0B0E14',
                'text-halo-width': 1.5
            }
        });

        map.addSource('calor-source', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: featuresCalor }
        });

        map.addLayer({
            id: 'calor-layer',
            type: 'fill',
            source: 'calor-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'fill-opacity': 0.68,
                'fill-color': [
                    'interpolate', ['linear'], ['get', 'intensidad'],
                    0.4, '#00C8FF',
                    0.6, '#00FF87',
                    0.75, '#FFE600',
                    0.9, '#FF8A00',
                    1, '#E60000'
                ]
            }
        });

        map.addSource('calor-maximo-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: { etiqueta: 'Zona más calurosa' },
                geometry: { type: 'Point', coordinates: temporadasCalor.verano.maximo }
            }
        });

        map.addLayer({
            id: 'calor-maximo-layer',
            type: 'symbol',
            source: 'calor-maximo-source',
            slot: 'top',
            layout: {
                visibility: 'none',
                'text-field': ['get', 'etiqueta'],
                'text-size': 12,
                'text-font': ['Open Sans Bold'],
                'text-offset': [0, 1.6],
                'text-allow-overlap': true
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#8B0000',
                'text-halo-width': 1.5
            }
        });

        map.addLayer({
            id: 'calor-maximo-punto',
            type: 'circle',
            source: 'calor-maximo-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'circle-radius': 7,
                'circle-color': '#FF2A00',
                'circle-stroke-color': '#FFFFFF',
                'circle-stroke-width': 2
            }
        });

        map.addSource('calor-minimo-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: { etiqueta: 'Zona más fría' },
                geometry: { type: 'Point', coordinates: [-70.6500, -33.5540] }
            }
        });

        map.addLayer({
            id: 'calor-minimo-layer',
            type: 'symbol',
            source: 'calor-minimo-source',
            slot: 'top',
            layout: {
                visibility: 'none',
                'text-field': ['get', 'etiqueta'],
                'text-size': 12,
                'text-font': ['Open Sans Bold'],
                'text-offset': [0, 1.6],
                'text-allow-overlap': true
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#0066CC',
                'text-halo-width': 1.5
            }
        });

        map.addLayer({
            id: 'calor-minimo-punto',
            type: 'circle',
            source: 'calor-minimo-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'circle-radius': 7,
                'circle-color': '#00AEEF',
                'circle-stroke-color': '#FFFFFF',
                'circle-stroke-width': 2
            }
        });

        map.addSource('calor-templado-source', {
            type: 'geojson',
            data: {
                type: 'Feature',
                properties: { etiqueta: 'Zona más templada' },
                geometry: { type: 'Point', coordinates: temporadasCalor.verano.templado }
            }
        });

        map.addLayer({
            id: 'calor-templado-layer',
            type: 'symbol',
            source: 'calor-templado-source',
            slot: 'top',
            layout: {
                visibility: 'none',
                'text-field': ['get', 'etiqueta'],
                'text-size': 12,
                'text-font': ['Open Sans Bold'],
                'text-offset': [0, 1.6],
                'text-allow-overlap': true
            },
            paint: {
                'text-color': '#FFFFFF',
                'text-halo-color': '#B87900',
                'text-halo-width': 1.5
            }
        });

        map.addLayer({
            id: 'calor-templado-punto',
            type: 'circle',
            source: 'calor-templado-source',
            slot: 'top',
            layout: { visibility: 'none' },
            paint: {
                'circle-radius': 7,
                'circle-color': '#FFC107',
                'circle-stroke-color': '#FFFFFF',
                'circle-stroke-width': 2
            }
        });

        map.moveLayer('perimetro-linea');
        map.moveLayer('ndvi-borde');
        map.moveLayer('calor-maximo-punto');
        map.moveLayer('calor-maximo-layer');
        map.moveLayer('calor-minimo-punto');
        map.moveLayer('calor-minimo-layer');
        map.moveLayer('calor-templado-punto');
        map.moveLayer('calor-templado-layer');

        // 5. CONTROL DE CHECKBOXES Y CÁMARA
        const checkNdvi = document.getElementById('layer-ndvi');
        const checkSombra = document.getElementById('layer-sombra');
        const toggleSombra = document.getElementById('toggle-sombra');
        const checkCalor = document.getElementById('layer-calor');
        const heatLegend = document.getElementById('heat-legend');
        const shadowInfo = document.getElementById('shadow-info');
        const temporadaCalor = document.getElementById('temporada-calor');
        const seasonControl = document.querySelector('.season-control');

        if (temporadaCalor) {
            temporadaCalor.addEventListener('change', () => {
                const temporada = temporadasCalor[temporadaCalor.value];
                map.getSource('calor-source').setData({
                    type: 'FeatureCollection',
                    features: crearFeaturesCalor(temporada.franjas)
                });
                map.getSource('calor-maximo-source').setData({
                    type: 'Feature',
                    properties: { etiqueta: 'Zona más calurosa' },
                    geometry: { type: 'Point', coordinates: temporada.maximo }
                });
                map.getSource('calor-minimo-source').setData({
                    type: 'Feature',
                    properties: { etiqueta: 'Zona más fría' },
                    geometry: { type: 'Point', coordinates: temporada.minimo }
                });
                map.getSource('calor-templado-source').setData({
                    type: 'Feature',
                    properties: { etiqueta: 'Zona más templada' },
                    geometry: { type: 'Point', coordinates: temporada.templado }
                });
            });
        }

        function actualizarModo(seleccionado) {
            if (checkNdvi) checkNdvi.checked = (seleccionado === 'ndvi');
            if (checkSombra) checkSombra.checked = (seleccionado === 'sombra');
            if (toggleSombra && seleccionado !== 'sombra') {
                toggleSombra.setAttribute('aria-pressed', 'false');
                toggleSombra.style.display = 'none';
            }
            if (checkCalor) checkCalor.checked = (seleccionado === 'calor');

            if (seleccionado === 'sombra') {
                map.setLayoutProperty('ndvi-layer', 'visibility', 'none');
                map.setLayoutProperty('ndvi-borde', 'visibility', 'none');
                map.setLayoutProperty('sombra-layer', 'visibility', 'none');
                map.setLayoutProperty('sombra-puntos', 'visibility', 'none');
                map.setLayoutProperty('sombra-etiquetas', 'visibility', 'none');
                map.setLayoutProperty('calor-layer', 'visibility', 'none');
                map.setLayoutProperty('calor-maximo-layer', 'visibility', 'none');
                map.setLayoutProperty('calor-maximo-punto', 'visibility', 'none');
                map.setLayoutProperty('calor-minimo-layer', 'visibility', 'none');
                map.setLayoutProperty('calor-minimo-punto', 'visibility', 'none');
                map.setLayoutProperty('calor-templado-layer', 'visibility', 'none');
                map.setLayoutProperty('calor-templado-punto', 'visibility', 'none');
                if (seasonControl) seasonControl.style.display = 'none';
                if (heatLegend) heatLegend.style.display = 'none';
                if (shadowInfo) shadowInfo.style.display = 'none';
                
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
                map.setLayoutProperty('ndvi-layer', 'visibility', 'none');
                map.setLayoutProperty('ndvi-borde', 'visibility', 'none');

                if (seleccionado === 'ndvi') {
                    map.setLayoutProperty('ndvi-layer', 'visibility', 'visible');
                    map.setLayoutProperty('ndvi-borde', 'visibility', 'visible');
                    map.setLayoutProperty('sombra-layer', 'visibility', 'none');
                    map.setLayoutProperty('sombra-puntos', 'visibility', 'none');
                    map.setLayoutProperty('sombra-etiquetas', 'visibility', 'none');
                    map.setConfigProperty('basemap', 'lightPreset', 'day'); 
                    map.setLayoutProperty('calor-layer', 'visibility', 'none');
                    map.setLayoutProperty('calor-maximo-layer', 'visibility', 'none');
                    map.setLayoutProperty('calor-maximo-punto', 'visibility', 'none');
                    map.setLayoutProperty('calor-minimo-layer', 'visibility', 'none');
                    map.setLayoutProperty('calor-minimo-punto', 'visibility', 'none');
                    map.setLayoutProperty('calor-templado-layer', 'visibility', 'none');
                    map.setLayoutProperty('calor-templado-punto', 'visibility', 'none');
                    if (seasonControl) seasonControl.style.display = 'none';
                    if (heatLegend) heatLegend.style.display = 'none';
                    if (shadowInfo) shadowInfo.style.display = 'none';
                }

                if (seleccionado === 'calor') {
                    map.setLayoutProperty('sombra-layer', 'visibility', 'none');
                    map.setLayoutProperty('sombra-puntos', 'visibility', 'none');
                    map.setLayoutProperty('sombra-etiquetas', 'visibility', 'none');
                    map.setLayoutProperty('calor-layer', 'visibility', 'visible');
                    map.setLayoutProperty('calor-maximo-layer', 'visibility', 'visible');
                    map.setLayoutProperty('calor-maximo-punto', 'visibility', 'visible');
                    map.setLayoutProperty('calor-minimo-layer', 'visibility', 'visible');
                    map.setLayoutProperty('calor-minimo-punto', 'visibility', 'visible');
                    map.setLayoutProperty('calor-templado-layer', 'visibility', 'visible');
                    map.setLayoutProperty('calor-templado-punto', 'visibility', 'visible');
                    if (seasonControl) seasonControl.style.display = 'flex';
                    if (heatLegend) heatLegend.style.display = 'block';
                    if (shadowInfo) shadowInfo.style.display = 'none';
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
        if (checkSombra) checkSombra.addEventListener('change', () => {
            if (checkSombra.checked) {
                actualizarModo('sombra');
                toggleSombra.style.display = 'inline-flex';
            } else {
                toggleSombra.style.display = 'none';
                actualizarModo('ndvi');
            }
        });
        if (toggleSombra) toggleSombra.addEventListener('click', () => {
            const sombrasActivas = toggleSombra.getAttribute('aria-pressed') === 'true';
            const visibilidad = sombrasActivas ? 'none' : 'visible';
            map.setLayoutProperty('sombra-layer', 'visibility', visibilidad);
            map.setLayoutProperty('sombra-puntos', 'visibility', visibilidad);
            map.setLayoutProperty('sombra-etiquetas', 'visibility', visibilidad);
            toggleSombra.setAttribute('aria-pressed', String(!sombrasActivas));
            if (shadowInfo) shadowInfo.style.display = sombrasActivas ? 'none' : 'block';
        });
        if (checkCalor) checkCalor.addEventListener('change', () => { if (checkCalor.checked) actualizarModo('calor'); else { checkNdvi.checked = true; actualizarModo('ndvi'); } });
    });
});