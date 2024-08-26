let root = document.querySelector(".root");

root.innerHTML = `
    <header class="header">
        <span class="material-symbols-outlined logo">sports_bar</span>
        <h1 class="titulo">Cervecerías de Estados Unidos</h1>
        <input type="text" class="buscars" placeholder="Buscar cervecerías...">
        <a href="https://github.com/cris2265" class="git">GitHub</a>
    </header>
    <div class="paises"></div>
    <main class="cuerpo">
        <div class="listas"></div>
    </main>
`;

let listas = document.querySelector(".listas");
let paises = document.querySelector(".paises");
let buscars = document.querySelector(".buscars");

// Función para obtener y mostrar cervecerías de la API
function fetchBreweries(search = '') {
    let url = 'https://api.openbrewerydb.org/breweries';
    let params = [];

    if (search) {
        params.push(`by_name=${search}`);
    }
    if (params.length > 0) {
        url += '?' + params.join('&');
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            listas.innerHTML = ''; // Limpiar la lista existente

            data.forEach(brewery => {
                let breweryDiv = document.createElement("div");
                breweryDiv.classList.add("brewery");

                breweryDiv.innerHTML = `
                    <h2>${brewery.name}</h2>
                    <p>Tipo: ${brewery.brewery_type}</p>
                    <p>Ciudad: ${brewery.city}</p>
                    <p>Estado: ${brewery.state}</p>
                    <p>Celular: ${brewery.phone}</p>
                    <a href="${brewery.website_url}" target="_blank">Visitar Sitio Web</a>
                `;

                breweryDiv.dataset.state = brewery.state;
                listas.appendChild(breweryDiv);
            });

            // Crear los checkboxes para los estados únicos solo una vez
            if (paises.children.length === 0) {
                let uniqueStates = new Set();
                data.forEach(brewery => {
                    uniqueStates.add(brewery.state);
                });

                uniqueStates.forEach((state, index) => {
                    let checkboxDiv = document.createElement("div");
                    checkboxDiv.classList.add("cuadro");

                    let categoria = document.createElement("input");
                    categoria.type = "checkbox";
                    categoria.classList.add(`pais-${index}`);
                    categoria.value = state;

                    let label = document.createElement("label");
                    label.textContent = state;
                    label.setAttribute("for", `pais-${index}`);

                    categoria.id = `pais-${index}`;

                    checkboxDiv.appendChild(categoria);
                    checkboxDiv.appendChild(label);
                    paises.appendChild(checkboxDiv);

                    // Añadir evento para filtrar las cervecerías según el estado
                    categoria.addEventListener("change", filterBreweries);
                });
            }

            // Filtrar cervecerías al cambiar los checkboxes
            function filterBreweries() {
                let selectedStates = Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map(checkbox => checkbox.value);

                document.querySelectorAll(".brewery").forEach(breweryDiv => {
                    if (selectedStates.length === 0 || selectedStates.includes(breweryDiv.dataset.state)) {
                        breweryDiv.style.display = "block";
                    } else {
                        breweryDiv.style.display = "none";
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Evento para buscar cervecerías conforme se escribe en el campo de búsqueda
buscars.addEventListener("input", (event) => {
    fetchBreweries(event.target.value); // Llamar a la función de búsqueda en tiempo real
});

// Inicializar con una búsqueda vacía para cargar todas las cervecerías al cargar la página
fetchBreweries();
