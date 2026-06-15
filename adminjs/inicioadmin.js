
document.addEventListener("DOMContentLoaded", function () {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./json/inicioadmin.json", true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const datos = JSON.parse(xhr.responseText);

            document.getElementById("admin-total-ventas").textContent = datos.totalVentas.toLocaleString() + " XFA";
            document.getElementById("admin-proveedores-activos").textContent = datos.proveedoresActivos;
            document.getElementById("admin-usuarios-activos").textContent = datos.usuariosActivos;
            document.getElementById("admin-stock-critico").textContent = datos.stockCritico;
            document.getElementById("admin-total-ganancia").textContent = datos.gananciaNeta.toLocaleString() + " XFA";

            const topProductosBody = document.getElementById("topDeproductos-body");
            topProductosBody.innerHTML = "";

            datos.topProductos.forEach(producto => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${producto.producto}</td>
                    <td>${producto.ventas}</td>
                    <td>${producto.stock}</td>
                `;
                topProductosBody.appendChild(tr);
            });
        }
    };

    xhr.send();
});

