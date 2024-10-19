document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("movieForm");
    const tableBody = document.querySelector("tbody");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita el envío del formulario
        const newRow = `
            <tr>
                <td scope="row">${document.getElementById("nombre").value}</td>
                <td scope="row">${document.getElementById("status").value}</td>
                <td scope="row"><img src="${document.getElementById("url").value}" alt=" " style="width: 150px; height: auto;"></td>
                <td scope="row">${document.getElementById("stars").value + "/5"}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', newRow); // Agrega la nueva fila
        form.reset(); // Limpia el formulario
    });
});

//<td><img src="${document.getElementById("url").value}" alt="Imagen de ${document.getElementById("nombre").value}" style="width: 150px; height: auto;"></td>