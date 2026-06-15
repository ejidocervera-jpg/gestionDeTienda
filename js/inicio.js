
document.addEventListener("DOMContentLoaded", function () {

    // Crear la petición AJAX
    const xhr = new XMLHttpRequest();

    // Configurando la petición
    xhr.open("GET", "./json/inicio.json", true);

    // Procesamos  la respuesta comprobando el estado de nuestra peticion

    xhr.onreadystatechange = function () {

        // Verificar que la petición terminó correctamente
        if (xhr.readyState === 4 && xhr.status === 200) {

            // Convertir el JSON recibido a objeto JavaScript
            const datos = JSON.parse(xhr.responseText);

            // TARJETAS DE RESUMEN
            document.getElementById("ventas-hoy").textContent = datos.ventasHoy.toLocaleString() + " XFA";
            document.getElementById("transacciones-hoy").textContent = datos.transaccionesHoy;
            document.getElementById("stock-critico").textContent = datos.stockCritico + " productos";
            document.getElementById("ganancia-neta").textContent = datos.gananciaNeta.toLocaleString() + " XFA";

            // ÚLTIMAS VENTAs
            const listaVentas = document.getElementById("ultimas-ventas");
            datos.ultimasVentas.forEach(venta => {
                const li = document.createElement("li");
                li.textContent = "Venta :" + venta.id +" - " + venta.cliente +  " - " + venta.total;
                listaVentas.appendChild(li);

            });

            // ALERTAS DE STOCK
            const listaAlertas = document.getElementById("alertas-stock");
            datos.alertasStock.forEach(alerta => {
                const li = document.createElement("li");
                li.textContent = alerta.producto + ":"+ alerta.stock;
                listaAlertas.appendChild(li);
            });

        }

    };

    // Enviando  la petición
    xhr.send();

});