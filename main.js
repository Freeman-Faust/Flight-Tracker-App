
(function(){
     //create map in leaflet and tie it to the div called 'theMap'
    let map = L.map('theMap').setView([42, -60], 4);
     //add a marker for each plane location L.marker()
    const plnIcon = L.icon({
        iconUrl: 'plane4-45.png',
        iconSize: [32,32],
    });
   
    planeLayer= L.geoJSON(null,{pointToLayer: function (feature, latlng) {

        return L.marker(latlng,
            {
                icon: plnIcon,
                rotationAngle: feature.properties.bearing
    
            }).bindPopup("Name: " + feature.properties.name + "<br> Speed (m/s): " + feature.properties.horiz_speed).openPopup();

    }}).addTo(map);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        //fetch and get back JSON from teh API that looks like [{lat,long}{lat,long}] X
        //gonna do a for loop to iterate through the objects in cndFlts and put them into the L.marker function below

    //set marker
    // L.marker([loc.lat,loc.long]).addTo(map)

    //update marker
    // setLatLng([loc.lat,loc.long]).addTo(map)


    //setInterval (function, ms, param1, param2)
     setInterval(updateWorld,2000,map);
   
})();

function genGeoFromLatLong(lat,long,FltId,plnHead,speed)
{
    return({
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [long,lat]
        },
        "properties": {
            "name": FltId,
            "bearing": plnHead,
            "horiz_speed": speed,
        }});
}
    // const geoObj = {};
    // return a geoJSON object
    // populate the object
    // geoObj.type = "Feature";
    // geoObj.geometry={};
    // geoObj.geometry.type="point";
    // geoObj.geometry.coordinates=[long,lat];
    // geoObj.properties={};
    // geoObj.properties.name="test";
    // return(geoObj);

function updateWorld(map)
{
    fetch('https://opensky-network.org/api/states/all').then(x=>x.json()).then(d=> 
        {planeLayer.clearLayers(); 
        d.states.filter(x=>x[2] == 'Canada').map(x=>{
        const lat = x[6];
        const long = x[5];
        const FltId = x[1];
        const plnHead = x[10];
        const speed = x[9];
        planeLayer.addData(genGeoFromLatLong(lat,long,FltId,plnHead,speed));

        // if(!planeLocations[id])
        // {
        //    planeLocations[id] = L.marker([lat,long],{icon: plnIcon}).addTo(map);
        // }
        // else
        // {
        //     planeLocations[id].setLatLng([lat,long],{icon: plnIcon}).update();
        // }
        // console.dir(planeLocations);
        });
    });
}