

let productos = [];
let carrito = [];

document.addEventListener("DOMContentLoaded", function(){
    cargarProductos();
    document.getElementById("btnAgregar").addEventListener("click", agregarProducto);
    document.getElementById("btnRemover").addEventListener("click", removerLinea);
    document.getElementById("btnConfirmar").addEventListener("click", confirmarVenta);
    document.getElementById("efectivo").addEventListener("input", calcularCambio);
    console.log("JS cargado correctamente");
});


// AQUI ESTOY CARGANDO LOS  PRODUCTOS DESDE JSON
function cargarProductos(){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./json/ventas.json", true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            const datos = JSON.parse(xhr.responseText);
            productos = datos.productos;
        }

    };
   xhr.send();
}

// AQUI ESTOY TRATANDO DE AGREGAR PRODUCTO A LA FACTURA
function agregarProducto(){
    const codigo = document.getElementById("codigo").value.trim();
    const busqueda = document.getElementById("busqueda").value.trim().toLowerCase();
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const descuento = parseFloat(document.getElementById("descuento").value);
    let productoEncontrado = null;
console.log("Botón pulsado");
    // AQUI ESTOY BUSCANDO POR CÓDIGO
    if(codigo !== ""){
        for(let i = 0; i < productos.length; i++){
            if(productos[i].codigo === codigo){
                productoEncontrado = productos[i];
            }
                
        }
// AQUI ESTOY BUSCANDO POR NOMBRE
    }else if(busqueda !== ""){
        for(let i = 0; i < productos.length; i++){
            if(productos[i].nombre.toLowerCase().includes(busqueda)){
                productoEncontrado = productos[i];
            }

        }

    }

    // VALIDANDO EL PRODUCTO
    if(productoEncontrado === null){
        alert("Producto no encontrado");
        return;

    }


    // VALIDANDO EL STOCK PARA COMPROBAR QUE LOS PRODUCTOS SEAN MAYORES QUE LA CANTIDAD

    if(cantidad > productoEncontrado.stock){
        alert("No hay suficiente stock disponible");
        return;
    }


    // REALIZANDO LOS CALCULOS
    let subtotal = productoEncontrado.precio * cantidad;
    let valorDescuento = subtotal * descuento / 100;
    let totalLinea = subtotal - valorDescuento;


    // CREANDO EL OBJETO QUE CONTRENDRA EL CARRITO

    const carrito = {
        codigo: productoEncontrado.codigo,
        nombre: productoEncontrado.nombre,
        cantidad: cantidad,
        precio: productoEncontrado.precio,
        descuento: descuento,
        subtotal: totalLinea

    };

console.log(carrito);
console.log(typeof carrito);
    // GUARDANDO EN EL CARRITO
    carrito.push(carrito);


    // ACTUALIZAR TABLA Y TOTALES
    mostrarFactura();
    calcularTotales();

    // LIMPIAR CAMPOS
    document.getElementById("codigo").value = "";
    document.getElementById("busqueda").value = "";
    document.getElementById("cantidad").value = 1;
    document.getElementById("descuento").value = 0;

}



// ELABORANDO MOSTRAR FACTURA

function mostrarFactura(){
    const tbody = document.getElementById("carro-body");
    tbody.innerHTML = "";
    for(let i = 0; i < carrito.length; i++){
        const fila = document.createElement("tr");
        fila.innerHTML =
        "<td>" + carrito[i].codigo + "</td>" +
        "<td>" + carrito[i].nombre + "</td>" +
        "<td>" + carrito[i].cantidad + "</td>" +
        "<td>" + carrito[i].precio + " XFA</td>" +
        "<td>" + carrito[i].descuento + "%</td>" +
        "<td>" + carrito[i].subtotal + " XFA</td>";
        tbody.appendChild(fila);

    }

}


// AQUI ESTOY CALCULANDO  LA TOTALIDAD 

function calcularTotales(){
    let subtotalGeneral = 0;
    let totalDescuento = 0;
    for(let i = 0; i < carrito.length; i++){
        let subtotalProducto = carrito[i].precio * carrito[i].cantidad;
        subtotalGeneral += subtotalProducto;
        totalDescuento += subtotalProducto * carrito[i].descuento / 100;
    }


    let totalFinal =subtotalGeneral -totalDescuento;
    document.getElementById("subtotalResumen")
    .textContent = subtotalGeneral + " XFA";

    document.getElementById("descuentoResumen")
    .textContent = totalDescuento + " XFA";
    document.getElementById("totalResumen").textContent = totalFinal + " XFA";

    calcularCambio();

}


// CALCULANDO EL  CAMBIO

function calcularCambio(){
    let efectivo = parseFloat( document.getElementById("efectivo").value) || 0;
    let totalTexto = document.getElementById("totalResumen").textContent;
    let total = parseFloat( totalTexto.replace(" XFA", "")) || 0;
    let cambio = efectivo - total;
    if(cambio < 0){
        cambio = 0;
    }
    document.getElementById("cambioResumen").textContent = cambio + " XFA";

}



// REMOVIENDO LA ULTIMA LINEA
function removerLinea(){
    if(carrito.length === 0){
        alert("No hay productos para eliminar");
        return;

    }
    carrito.pop();
    mostrarFactura();
    calcularTotales();

}


// CONFIRMAR VENTA
function confirmarVenta(){
    if(carrito.length === 0){
        alert("No hay productos en la factura");
        return;
    }

    alert("Venta registrada correctamente");


    // LIMPIANDO LA PAGINA FACTURA

    carrito = [];

    mostrarFactura();

    calcularTotales();

    document.getElementById("efectivo").value = 0;

    document.getElementById("cambioResumen").textContent = "0 XFA";

}