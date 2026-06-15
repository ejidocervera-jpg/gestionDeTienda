document.addEventListener("DOMContentLoaded", function () {
    let proveedores = [];
    let ordenes = [];

    const listaProveedores = document.getElementById("listaproveedores");
    const listaOrdenes = document.getElementById("ordenes-lista");
    const totalProveedores = document.getElementById("totalProveedores");
    const totalOrdenes = document.getElementById("totalOrdenes");
    const ordenesPendientes = document.getElementById("ordenesPendientes");

    const abrirModal = document.getElementById("abrirModal");
    const modalProveedor = document.getElementById("modalProveedor");
    const cerrarModal = document.querySelector(".cerrar-modal");
    const formulario = document.getElementById("agregar-proveedor-form");
    const buscarProveedorInput = document.querySelector(".buscar-proveedor input");

    function renderProveedores(lista) {
        listaProveedores.innerHTML = "";

        lista.forEach(proveedor => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${proveedor.id}</td>
                <td>${proveedor.nombre}</td>
                <td>${proveedor.contacto}</td>
                <td>${proveedor.telefono}</td>
                <td>
                    <button class="btn-eliminar" data-id="${proveedor.id}">Eliminar</button>
                </td>
            `;
            listaProveedores.appendChild(fila);
        });
    }

    function renderOrdenes(lista) {
        listaOrdenes.innerHTML = "";

        lista.forEach(orden => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${orden.id}</td>
                <td>${orden.proveedor}</td>
                <td>${orden.producto}</td>
                <td>${orden.cantidad}</td>
                <td>${orden.fecha}</td>
                <td>${orden.estado}</td>
            `;
            listaOrdenes.appendChild(fila);
        });
    }

    function actualizarResumen() {
        totalProveedores.textContent = proveedores.length;
        totalOrdenes.textContent = ordenes.length;
        ordenesPendientes.textContent = ordenes.filter(orden => orden.estado.toLowerCase() === "pendiente").length;
    }

    function generarIdProveedor() {
        return `P-${Date.now()}`;
    }

    function generarIdOrden() {
        return `O-${Date.now()}`;
    }

    function cerrarModalProveedor() {
        modalProveedor.style.display = "none";
    }

    abrirModal.addEventListener("click", function () {
        modalProveedor.style.display = "block";
    });

    cerrarModal.addEventListener("click", cerrarModalProveedor);

    window.addEventListener("click", function (event) {
        if (event.target === modalProveedor) {
            cerrarModalProveedor();
        }
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const contacto = document.getElementById("contacto").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const productoSolicitado = document.getElementById("producto-solicitado").value.trim();
        const cantidadOrden = parseInt(document.getElementById("cantidad-orden").value, 10);

        if (!nombre || !contacto || !telefono || !productoSolicitado || Number.isNaN(cantidadOrden)) {
            return;
        }

        const nuevoProveedor = {
            id: generarIdProveedor(),
            nombre,
            contacto,
            telefono,
            correo: `${nombre.toLowerCase().replace(/\s+/g, "")}@correo.com`
        };

        proveedores.push(nuevoProveedor);

        const nuevaOrden = {
            id: generarIdOrden(),
            proveedor: nombre,
            producto: productoSolicitado,
            cantidad: cantidadOrden,
            fecha: new Date().toISOString().split("T")[0],
            estado: "Pendiente"
        };

        ordenes.push(nuevaOrden);
        renderProveedores(proveedores);
        renderOrdenes(ordenes);
        actualizarResumen();
        formulario.reset();
        cerrarModalProveedor();
    });

    buscarProveedorInput.addEventListener("input", function () {
        const termino = this.value.trim().toLowerCase();
        const filtrados = termino
            ? proveedores.filter(proveedor =>
                  proveedor.id.toLowerCase().includes(termino) ||
                  proveedor.nombre.toLowerCase().includes(termino) ||
                  proveedor.contacto.toLowerCase().includes(termino) ||
                  proveedor.telefono.toLowerCase().includes(termino)
              )
            : proveedores;

        renderProveedores(filtrados);
    });

    listaProveedores.addEventListener("click", function (event) {
        if (!event.target.classList.contains("btn-eliminar")) {
            return false;
        }

        const id = event.target.dataset.id;
        proveedores = proveedores.filter(proveedor => proveedor.id !== id);
        renderProveedores(proveedores);
        actualizarResumen();
    });

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./json/proveedoresadmin.json", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const datos = JSON.parse(xhr.responseText);
            proveedores = datos.proveedores;
            ordenes = datos.ordenes;
            renderProveedores(proveedores);
            renderOrdenes(ordenes);
            actualizarResumen();
        }
    };
    xhr.send();
});

