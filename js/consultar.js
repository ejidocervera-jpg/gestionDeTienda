
document.addEventListener("DOMContentLoaded", function () {

    cargarProductos();

document.getElementById("btnBuscar").addEventListener("click", buscarProducto);

document.getElementById("buscartodo").addEventListener("click", mostrarTodo);

});

// CARGAR PRODUCTOS DESDE JSON


function cargarProductos() {

    const xhr = new XMLHttpRequest();

    xhr.open("GET", "./json/consultar.json", true);

    xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

            productos = JSON.parse(xhr.responseText);

            mostrarProductos(productos);

            actualizarResumen(productos);

        }

    };

    xhr.send();

}

// mostrar los productos de la tabla


function mostrarProductos(listaProductos) {

    const tbody = document.getElementById("productos-consulta");

    tbody.innerHTML = "";

    for (let i = 0; i < listaProductos.length; i++) {

        //creamos el tr de la tabla
        const fila = document.createElement("tr");
  
        //creando los td de la tabla

        const tdCodigo = document.createElement("td");
        const tdProducto = document.createElement("td");
        const tdCategoria = document.createElement("td");
        const tdStock = document.createElement("td");
        const tdPrecio = document.createElement("td");
        const tdDescripcion = document.createElement("td");

        tdCodigo.textContent = listaProductos[i].codigo;
        tdProducto.textContent = listaProductos[i].nombre;
        tdCategoria.textContent = listaProductos[i].categoria;
        tdStock.textContent = listaProductos[i].stock;
        tdPrecio.textContent = listaProductos[i].precio.toLocaleString() +" XFA";
        tdDescripcion.textContent = listaProductos[i].descripcion;
   
        // añadiendo td a la fila
        fila.appendChild(tdCodigo);
        fila.appendChild(tdProducto);
        fila.appendChild(tdCategoria);
        fila.appendChild(tdStock);
        fila.appendChild(tdPrecio);
        fila.appendChild(tdDescripcion);

        // añadiendo la fila creada desde js a html
        tbody.appendChild(fila);

    }

}
// ACTUALIZAR TARJETAS RESUMEN


function actualizarResumen(listaProductos) {

    // TOTAL PRODUCTOS

    document.getElementById("cantidadProductos").textContent = listaProductos.length;

    // STOCK BAJO

    let stockBajo = 0;

    for (let i = 0; i < listaProductos.length; i++) {

        if (listaProductos[i].stock <= 5) {
            stockBajo++;
         }

    }

    document.getElementById("stockBajo").textContent = stockBajo;

    // CATEGORÍAS

    let categorias = [];

    for (let i = 0; i < listaProductos.length; i++) {

        if (!categorias.includes(
            listaProductos[i].categoria
        )
        
        ) {categorias.push(
                listaProductos[i].categoria
            );

        }

    }

    document.getElementById("categorias").textContent = categorias.length;

}


// BUSCAR PRODUCTO

function buscarProducto() {

  const textoBusqueda = document.getElementById("busquedaProducto").value.toLowerCase();

  const patron = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/;

if(!patron.test(textoBusqueda)){

    alert("Solo se permiten letras y números");

    return;

}
    let resultados = [];

    for (let i = 0; i < productos.length; i++) {

        let codigo = productos[i].codigo.toLowerCase();

        let nombre = productos[i].nombre.toLowerCase();

        let categoria = productos[i].categoria.toLowerCase();

        if (
            codigo.includes(textoBusqueda) ||
            nombre.includes(textoBusqueda) ||
            categoria.includes(textoBusqueda)
        ) {

            resultados.push(productos[i]);

        }if(resultados.length ===0){
            alert("mo se ha encontrado el dato que has introducido");
            input.focus();
            return;
        }

    }

 mostrarProductos(resultados);
 actualizarResumen(resultados);

}

function mostrarTodo() {
    document.getElementById("buscartodo").value = "", 
    mostrarProductos(productos);
    actualizarResumen(productos)
}