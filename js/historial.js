
let historial = [];
document.addEventListener("DOMContentLoaded", function(){
    cargarHistorial();
});

// CARGAR DATOS DEsde JSON
function cargarHistorial(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./json/historial.json", true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            historial = JSON.parse(xhr.responseText);
            mostrarHistorial(historial);
            actualizarResumen(historial);
        }
    };
    xhr.send();
}
// MOSTRANDO EL  HISTORIAL EN LA TABLA
function mostrarHistorial(listaVentas){
    const tbody = document.getElementById("historial-body");
    tbody.innerHTML = "";
    for(let i = 0; i < listaVentas.length; i++){
        const fila = document.createElement("tr");
        const tdId = document.createElement("td");
        const tdFecha = document.createElement("td");
        const tdCliente = document.createElement("td");
        const tdTotal = document.createElement("td");
        const tdPago = document.createElement("td");
        const tdEstado = document.createElement("td");
        tdId.textContent = listaVentas[i].id;
        tdFecha.textContent = listaVentas[i].fecha;
        tdCliente.textContent = listaVentas[i].cliente;
        tdTotal.textContent = listaVentas[i].total + " XFA";
        tdPago.textContent = listaVentas[i].pago;
       
        // Estado con estilo CSS
        const estado = document.createElement("span");
        estado.textContent = listaVentas[i].estado;
        if(listaVentas[i].estado === "Completado"){
            estado.classList.add("estado-completado");

        }else if(listaVentas[i].estado === "anulado"){
            estado.classList.add("estado-anulado")
        }else if(listaVentas[i].estado === "pendiente"){
            estado.classList.add("estado-pendiente")
        }
        tdEstado.appendChild(estado);
        fila.appendChild(tdId);
        fila.appendChild(tdFecha);
        fila.appendChild(tdCliente);
        fila.appendChild(tdTotal);
        fila.appendChild(tdPago);
        fila.appendChild(tdEstado);
        tbody.appendChild(fila);
    }

}
// TRABAJANDO EN ACTUALIZAR RESUMEN

function actualizarResumen(listaVentas){
    // TOTAL DE VENTAS
    document.getElementById("totalVentas").textContent = listaVentas.length;
    // CONTADOR  DEL EFECTIVO
    let efectivo = 0;

    // CONTADOR DE LA  TARJETA
    let tarjeta = 0;
    for(let i = 0; i < listaVentas.length; i++){
        if(listaVentas[i].pago === "Efectivo"){
            efectivo++;
        }

        if(listaVentas[i].pago === "Tarjeta"){
            tarjeta++;
        }

    }

    document.getElementById("ventasEfectivo").textContent = efectivo;
    document.getElementById("ventasTarjeta").textContent = tarjeta;

}
     
