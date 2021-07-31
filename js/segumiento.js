/* Variables globales */
var map;
var timerStatus;
var timerRoute;
var route = 0;
var progress = 0;
var markersArray = [];
let status = [
    {"id":1,"status":"Orden Creada"},
    {"id":2,"status":"Buscando Mensajero Cercano"},
    {"id":3,"status":"Orden en Proceso"},
    {"id":4,"status":"Punto de Origen A: En Proceso"},
    {"id":5,"status":"Punto de Origen A: Finalizado"},
    {"id":6,"status":"En Ruta de Entrega"},
    {"id":7,"status":"Punto de Origen B: En Proceso"},
    {"id":8,"status":"Punto de Origen B: Finalizado"},
    {"id":9,"status":"Orden Finalizada"},
];
let routeList = [
    {lat:19.383556004927538,  lng:-99.1603779494569}, 
    {lat:19.400291763259215, lng:-99.17045039424912},
    {lat:19.4146520554983, lng:-99.1650368127006}, 
    {lat:19.43027005889854, lng:-99.1599199140194}
]

/*Inicializar el mapa */
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 19.4196230782163, lng: -99.14126327899908},
    zoom: 12
    });
}

/* Trazar la ruta del punto A al B */
function traceRoute(){
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);
    directionsService.route({
        origin: {lat:19.386273221029416, lng:-99.1570302167304},
        destination: {lat:19.43389297361043, lng:-99.15400003207365},
        travelMode: google.maps.TravelMode.BICYCLING,
        provideRouteAlternatives: true
    }).then((response) => {
        directionsRenderer.setDirections(response);
    
    });
}

function markPointA(){
    var marker = new google.maps.Marker({
        position: {lat:19.386273221029416, lng:-99.1570302167304},
        map: map,
        title: 'Punto A',
        stopover: true,
    });
}

function markPointB(){
    var marker = new google.maps.Marker({
        position: {lat:19.43389297361043, lng:-99.15400003207365},
        map: map,
        title: 'Punto B',
        stopover: true,
    });
}

function showStatus(message){
    var containerStatus = document.getElementById('status');
    containerStatus.style.display = "block";
    var p = document.createElement("P"); 
    var childrenStatus = document.createTextNode(new Date().toLocaleString() + ' ' + message );
    p.appendChild(childrenStatus);  
    containerStatus.appendChild(p);
}

/*Cambio de estado del pedido*/
function changeStatus(){
    switch (progress){
        case 0:
            document.getElementById("start").style.display = "block";
            showStatus(status[progress].status);
            progress = progress + 1;
            break;
        case 1:
            document.getElementById("delivery").style.display = "block";
            showStatus(status[progress].status);
            progress = progress + 1;
            break;
        case 2:
            document.getElementById("delivery").style.display = "none";
            document.getElementById("deliveryFound").style.display = "block";
            showStatus(status[progress].status);
            progress = progress + 1;
            break;
        case 3:
            showStatus(status[progress].status);
            progress = progress + 1;
            break;
        case 4:
            showStatus(status[progress].status);
            progress = progress + 1;
            markPointA();
            break;
        case 5:
            document.getElementById("deliveryFound").style.display = "none";
            document.getElementById("guide").style.display = "block";
            showStatus(status[progress].status);
            progress = progress + 1;
            startRoute();
            break;
        case 6:
            showStatus(status[progress].status);
            progress = progress + 1;
            markPointB();
            break;
        case 7:
            showStatus(status[progress].status);
            progress = progress + 1;
            break;
        case 8:
            document.getElementById("end").style.display = "block";
            showStatus(status[progress].status);
            endTracing();
            traceRoute();
            break;
    }
    
}
/*Simulación de recorrido*/
function changeRoute(){
    console.log(routeList[route]);
    var marker = new google.maps.Marker({
        position: routeList[route],
        map: map,
        icon:'https://img.icons8.com/color/48/000000/car--v1.png'
    });
    markersArray.push(marker);
    markersArray[route].setMap(null);
    route = route + 1 ;
}

function startRoute(){
    console.log('change route')
    var marker = new google.maps.Marker({
        position: {lat:19.386273221029416, lng:-99.1570302167304},
        map: map,
        icon:'https://img.icons8.com/color/48/000000/car--v1.png'
    });
    markersArray.push(marker);
    timerRoute = setInterval(changeRoute, 300);
}

/*Comenzar el siguimiento */
function startTracing(){
    timerStatus = setInterval(changeStatus, 500);
}

/*Terminda el seguimiento del pedido*/
function endTracing(){
    clearInterval(timerStatus);
    clearInterval(timerRoute);
}