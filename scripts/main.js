const locationsElement = document.querySelector('#locations');

const getLocationsFromBackend = async () => {

    const res = await fetch ("http://localhost:8080/silverymoonPoints")
    const data = await res.json();
    return data
}

const addLocationsToDom = async () => {

    const locations = await getLocationsFromBackend();
    console.log("List of Locations:");
    console.log(locations);


    locations.forEach(location => {
        const div = document.createElement("div");
        
        var locationInfo = ""
        location.location_info.forEach(tInfo => {
            locationInfo += tInfo.info_content
        })
        div.innerHTML= `
            <h3>${location.location_name}</h3>
            <p>${locationInfo}</p>
        `
        div.className = "location";
        locationsElement.appendChild(div);
    });
}

const addMap = async() => {
    const locations = await getLocationsFromBackend();

    mapboxgl.accessToken =
    "pk.eyJ1IjoianVuZG1hc3RlciIsImEiOiJjbGI5YXMwaDUwbjZ5M25uNTVtb2p0Z2t0In0.koGwNrs4q43aSknCky4Pwg";
    const bounds = [
    [-130, -80], // Southwest coordinates
    [130, 80], // Northeast coordinates
    ];

    const map = new mapboxgl.Map({
    container: "map", // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: "mapbox://styles/jundmaster/clb9m84sw002514qytybhkprd", // style URL
    center: [0, 0], // starting position [lng, lat]
    zoom: 1, // starting zoom
    maxBounds: bounds,
    });
    

    // Adds city points from file
    map.on("load", () => {
    map.loadImage(
        "https://cdn.glitch.global/d433aa7f-c4c6-45bd-b836-26fd0a51e2f6/crown_icon.svg?v=1670270171521",
        (error, image) => {
        if (error) throw error;
        map.addImage("icon_government", image);
        }
    );

    map.addSource("city-points", {
        type: "geojson",
        data: "../points/City Points.geojson",
    });

    map.addLayer({
        id: "city-points-layer",
        // References the GeoJSON source defined above
        // and does not require a `source-layer`
        source: "city-points",
        type: "symbol",

        // Set layout properties
        layout: {
        "text-field": ["get", "name"],
        "text-font": ["Alegreya ExtraBold", "Arial Unicode MS Regular"],
        "text-size": [
            "interpolate",
            ["cubic-bezier", 0.5, 1, 1, 1],
            ["zoom"],
            1.8,
            8,
            5,
            25,
        ],
        "text-max-width": 20,
        "icon-image": [
            "match",
            ["get", "type"],
            ["government"],
            "crown-svgrepo-com",
            ["tavern", "inn"],
            "tavern-sign-svgrepo-com",
            ["education"],
            "college-svgrepo-com",
            ["conclave_of_silverymoon"],
            "suitcase",
            ["forest"],
            "leaf",
            ["religion"],
            "cross-svgrepo-com",
            "border-dot-13",
        ],
        "icon-size": [
            "interpolate",
            ["linear"],
            ["zoom"],
            1.75,
            1.3,
            2.62,
            2,
        ],
        "text-offset": [0, -2],
        },

        // Set paint properties
        paint: {
        "text-color": "hsl(0, 2%, 89%)",
        "text-opacity": [
            "interpolate",
            ["exponential", 1],
            ["zoom"],
            1.55,
            0,
            1.6,
            1,
        ],
        "text-halo-color": "hsl(146, 0%, 2%)",
        "text-halo-width": 2,
        "text-halo-blur": 2,
        },
    });
    });
    
    
    
    map.on("mouseenter", "city-points-layer", () => {
    map.getCanvas().style.cursor = "pointer";
    });

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "city-points-layer", (e) => {
    // Copy coordinates array.
    const coordinates = e.features[0].geometry.coordinates.slice();
    const name = e.features[0].properties.name;
    var info = e.features[0].properties.info;
    
    locations.forEach(location => {
        console.log("GEOJson location name: " + name);
        console.log("Notion location name: " + location.location_name);
        if (name == location.location_name)
        {
            console.log("Overwrite " + name + "' information");
            var locationInfo = ""
            location.location_info.forEach(tInfo => {
                locationInfo += tInfo.info_content
            })
            info = locationInfo;
            return;   
        }
        // else
        //     info = e.features[0].properties.info;
    });
    // const info = e.features[0].properties.info;

    var popupContent;

    if (name != "null") {
        popupContent =
        "<h2 style='padding-bottom: 1px;'>" + name + "</h2><hr>";
    }

    if (info != "null") {
        popupContent += info;
    }

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
    });

    map.on("mouseleave", "city-points-layer", () => {
    map.getCanvas().style.cursor = "";
    });

    // disable map rotation using right click + drag
    map.dragRotate.disable();
    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();
}

// addLocationsToDom();
addMap();

