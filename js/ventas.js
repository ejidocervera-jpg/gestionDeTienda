
// mis variables iniciales o globales
let productos = [];
let factura = [];

// las expresiones regulares de los 
const PatronCodigo = /^[0-9]+$/;
const PatronProducto = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]+$/;    

document.addEventListener("DOMContentLoaded", function () {
    cargarProductos();
    let codigo = document.getElementById("codigo");
    let busqueda = document.getElementById("busqueda");
    let errorCodigo = document.getElementById("error-codigo");
    let errorBusqueda = document.getElementById("error-busqueda");

    // validar el codigo en tiempo real
    codigo.addEventListener("input", function () {
        if (codigo.value.length === 0) {
            codigo.classList.remove("correcto");
            codigo.classList.remove("error");
            errorCodigo.style.display = "none";
            return false;
        }

        if (PatronCodigo.test(codigo.value)) {
            codigo.classList.add("correcto");
            codigo.classList.remove("error");
            errorCodigo.style.display = "none";
        } else {
            codigo.classList.add("error");
            codigo.classList.remove("correcto");
            errorCodigo.textContent = "Solo se permiten números";
            errorCodigo.style.display = "block";
        }
    });

    // validar la busqueda en tiempo real
    busqueda.addEventListener("input", function () {
        if (busqueda.value.length === 0) {
            busqueda.classList.remove("correcto");
            busqueda.classList.remove("error");
            errorBusqueda.style.display = "none";
            return false;
        }

        if (PatronProducto.test(busqueda.value)) {
            busqueda.classList.add("correcto");
            busqueda.classList.remove("error");
            errorBusqueda.style.display = "none";
        } else {
            busqueda.classList.add("error");
            busqueda.classList.remove("correcto");
            errorBusqueda.textContent = "Solo letras y números";
            errorBusqueda.style.display = "block";
        }
    });

    // capturando los botones
    document.getElementById("btnAgregar").addEventListener("click", function(e) {
        e.preventDefault(); 
        agregarProducto();
    });
    
    document.getElementById("btnRemover").addEventListener("click", function(e) {
        e.preventDefault(); 
        removerLinea();
    });

    document.getElementById("btnConfirmar").addEventListener("click", function(e) {
        e.preventDefault(); 
        confirmarVenta();
    });

    document.getElementById("efectivo").addEventListener("input", calcularCambio);
});

//  Cargar productos desde JSON =====
function cargarProductos() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./json/ventas.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const datos = JSON.parse(xhr.responseText);
            productos = datos.productos;
            console.log(productos);
        }
    };
    xhr.send();
}

//  Buscar producto por código o nombre =====
function buscarProducto() {
    const codigo = document.getElementById("codigo").value.trim();
    const busqueda = document.getElementById("busqueda").value.trim().toLowerCase();
    let productoEncontrado = null;
    if (codigo.length > 0) {
        productoEncontrado = productos.find(p => String(p.codigo) === codigo);
    } else if (busqueda.length > 0) {
        productoEncontrado = productos.find(p => p.nombre.toLowerCase().includes(busqueda));
    }

    return productoEncontrado;
}

//  Añadiendo producto a la factura =====
function agregarProducto() {
    const producto = buscarProducto();
    if (!producto) {
        alert("Producto no encontrado");
        return false;
    }

    const cantidad = parseInt(document.getElementById("cantidad").value);
    const descuento = parseFloat(document.getElementById("descuento").value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Cantidad inválida");
        return false;
    }

    if (isNaN(descuento) || descuento < 0 || descuento > 100) {
        alert("Descuento inválido");
        return false;
    }
 // realizando el calculo de resumen venta ====
    const precio = producto.precio;
    const subtotalLinea = precio * cantidad;
    const descuentoLinea = subtotalLinea * (descuento / 100);
    const totalLinea = subtotalLinea - descuentoLinea;

    // añadiendo a la factura ====
    factura.push({
        codigo: producto.codigo,
        nombre: producto.nombre,
        cantidad: cantidad,
        precio: precio,
        descuento: descuento,
        subtotal: totalLinea
    });

    renderFactura();
    calcularTotales();
    limpiarFormulario();
}

//  Removiendo la última línea de la factura si esta vacia ===
function removerLinea() {
    if (factura.length === 0) {
        alert("No hay líneas para remover");
        return false;
    }
    factura.pop();
    renderFactura();
    calcularTotales();
}

//  transformando los datos de  la tabla de la factura
function renderFactura() {
    const cuerpo = document.getElementById("carro-body");
    cuerpo.innerHTML = "";

    factura.forEach(linea => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${linea.codigo}</td>
            <td>${linea.nombre}</td>
            <td>${linea.cantidad}</td>
            <td>${linea.precio} XFA</td>
            <td>${linea.descuento}%</td>
            <td>${linea.subtotal.toFixed(2)} XFA</td>
        `;
        cuerpo.appendChild(fila);
    });
}

//  Calcular subtotal, descuento === 
function calcularTotales() {
    let subtotal = 0;
    let descuentoTotal = 0;

   factura.forEach(linea => {
    const subtotalLinea = linea.precio * linea.cantidad;
    subtotal += subtotalLinea;
    descuentoTotal += subtotalLinea * (linea.descuento / 100);
});

    const total = subtotal - descuentoTotal;
    document.getElementById("subtotalResumen").textContent = subtotal.toFixed(0) + " XFA";
    document.getElementById("descuentoResumen").textContent = descuentoTotal.toFixed(0) + " XFA";
    document.getElementById("totalResumen").textContent = total.toFixed(0) + " XFA";
    calcularCambio();
}

// intentando  Calcular el cambio según el dinero que se va ha recibir 
function calcularCambio() {
    const totalTexto = document.getElementById("totalResumen").textContent;
    const total = parseFloat(totalTexto) || 0;
    const efectivo = parseFloat(document.getElementById("efectivo").value) || 0;
    const cambio = efectivo - total;
    document.getElementById("cambioResumen").textContent = (cambio >= 0 ? cambio.toLocaleString("fr-FR") : "0") + " XFA";
}

// Limpiando el formulario después de agregar 
function limpiarFormulario() {
    document.getElementById("codigo").value = "";
    document.getElementById("busqueda").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("descuento").value = 0;
    document.getElementById("codigo").classList.remove("correcto", "error");
    document.getElementById("busqueda").classList.remove("correcto", "error");
}

// aqui estoy empezando a introducir locastorage generando un numero de factura
  // bloqueo temporal pata localstorage


// Confirmar venta 
function confirmarVenta() {
    if (factura.length === 0) {
        alert("No hay productos en la factura");
        return false;
    }

    const subtotal = parseFloat(document.getElementById("subtotalResumen").textContent) || 0;
    const descuentoTotal = parseFloat(document.getElementById("descuentoResumen").textContent) || 0;
    const total = parseFloat(document.getElementById("totalResumen").textContent) || 0;
    const efectivo = parseFloat(document.getElementById("efectivo").value) || 0;
    const metodoPago = document.getElementById("metodoPago").value;

    if (efectivo < total) {
        alert("El efectivo recibido es insuficiente");
        return false;
    }
    const cambio = efectivo - total;

    // creando  el objeto de la venta
    const venta = {
        numeroFactura: generarNumeroFactura(),
        fecha: new Date().toLocaleString(),
        productos: [...factura],
        subtotal: subtotal,
        descuento: descuentoTotal,
        total: total,
        metodoPago: metodoPago,
        efectivo: efectivo,
        cambio: cambio
    };

    guardarVenta(venta);
    alert("Venta numero " + venta.numeroFactura + " confirmada. Total: " + total.toFixed(0) + " XFA. Cambio: " + cambio.toFixed(0) + " XFA");

    // reiniciar la factura
    factura = [];
    renderFactura();
    calcularTotales();
    document.getElementById("efectivo").value = 0;
}