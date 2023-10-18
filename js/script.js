import { Car } from "./Car.js";

const searchInput = document.querySelector("#search");
const searchResult = document.querySelector(".table-results");
const searchNoResult = document.querySelector(".table-no-results");

// Rajouter fonctionnalité recherche avec des tries
// Checkbox + Prix entre tel et tel attribut

var dataArray = new Array();

/**
 * Cette fonction asynchrone est utilisée pour récupérer des données de voitures à partir d'un fichier JSON.
 */
async function getCars() {
  try {
    // Effectue une requête pour obtenir les données du fichier JSON.
    const data = await fetch("../src/car-data.json");
    // Vérifie si la requête a réussi (code HTTP 200 OK).
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    // Transforme les données JSON en un objet JavaScript.
    const dataJSON = await data.json();
    // Transforme l'objet JSON en un tableau de marques de voitures avec des voitures converties en objets 'Car'.
    dataArray = createInstanceOfCar(dataJSON);
    // ADD COMMENTAIRE
    await verifyImagesOfCar(dataArray);
    // Trie le tableau de marques de voitures.
    sortData(dataArray);
    // Appelle potentiellement une fonction 'createCarList(dataArray)' pour effectuer d'autres traitements.
    createCarList(dataArray);
  } catch (error) {
    // En cas d'erreur lors de l'exécution de l'une des étapes précédentes,
    // cette partie du code sera exécutée.
    console.error(
      "==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error
    );
    // Affiche l'erreur détaillée dans
  }
}

/**
 * Cette fonction asynchrone est utilisée pour récupérer des données de voitures.
 */
async function fetchData() {
  try {
    // Attend que la fonction getCars() soit résolue (ou complétée).
    await getCars();
  } catch (error) {
    // En cas d'erreur lors de l'exécution de getCars(),
    // cette partie du code sera exécutée.
    console.error(
      "==========================\n⚠️ ↓ ↓ Error detected ↓ ↓ ⚠️\n" + error
    );
    // Affiche l'erreur détaillée dans la console pour le débogage.
  }
}

// Appelez la fonction asynchrone pour récupérer les données
fetchData();

/**
 * Convertit chaque voiture en un objet de type 'Car'
 * et remplace le tableau de voitures d'origine par le nouveau tableau de voitures converties.
 * @param {Array<Brand>} carList - Liste des voitures classées par marque.
 * @returns {Array<Brand>} Liste de voitures transformer en instance de la classe Car.
 */
function createInstanceOfCar(data) {
  var brandArray = [];
  // Boucle à travers la liste des marques de voitures
  for (let brand in data) {
    // Récupère le tableau des voitures de la marque actuelle
    const carsOfBrand = data[brand]["cars"];
    // Crée un nouveau tableau pour stocker les voitures converties en objets 'Car'
    let carListInstance = new Array();
    // Boucle à travers les voitures de la marque actuelle
    for (let car in carsOfBrand) {
      // Crée une instance de la classe 'Car' en utilisant les propriétés de la voiture actuelle
      const carInstance = new Car(
        carsOfBrand[car].name,
        carsOfBrand[car].brandAndName,
        data[brand].brand,
        carsOfBrand[car].parameter.rate,
        carsOfBrand[car].parameter.path,
        carsOfBrand[car].parameter.availability,
        carsOfBrand[car].parameter.image
      );
      // Ajoute l'instance de 'Car' au nouveau tableau
      carListInstance.push(carInstance);
    }
    // Remplace le tableau de voitures d'origine par le nouveau tableau de voitures converties
    data[brand]["cars"] = carListInstance;
    brandArray[brand] = data[brand];
  }
  return brandArray; // type brand
}

/**
 * Prend un tableau d'objets de type 'Brand' en entrée
 * et trie le tableau par ordre alphabétique de la marque et des voitures par nom.
 * @param {Array} data - Tableau de dictionnaire de type Brand.
 */
function sortData(data) {
  // Trie les données principales par marque (ordre alphabétique)
  sortBrand(data);
  // Trie les voitures de chaque marque par nom (ordre alphabétique)
  for (let brand in data) {
    sortCarInBrand(brand, data);
  }
}

/**
 * Trie le tableau de données par marque (ordre alphabétique).
 * @param {Array} data - Tableau de dictionnaire de type Brand.
 */
function sortBrand(data) {
  data.sort((a, b) => {
    const currentBrand = a.brand.toLowerCase();
    const nextBrand = b.brand.toLowerCase();
    // Compare les marques pour déterminer l'ordre de tri
    if (currentBrand < nextBrand) {
      return -1; // a est avant b
    }
    if (currentBrand > nextBrand) {
      return 1; // a est après b
    }
    return 0; // les marques sont égales
  });
}

/**
 * Trie le tableau de voitures d'une marque spécifique par nom (ordre alphabétique).
 * @param {string/number} brand - Marque que l'on souhaite trier.
 * @param {Array} data - Tableau de dictionnaire de type Brand.
 */
function sortCarInBrand(brand, data) {
  // Récupère le tableau des voitures de la marque actuelle
  const carsOfBrand = data[brand]["cars"];
  // Trie les voitures par nom (ordre alphabétique)
  carsOfBrand.sort((a, b) => {
    const currentBrandAndName = a.fullNameCar.toLowerCase(); // brand and name
    const nextBrandAndName = b.fullNameCar.toLowerCase();
    // Compare les noms des voitures pour déterminer l'ordre de tri
    if (currentBrandAndName < nextBrandAndName) {
      return -1; // a est avant b
    }
    if (currentBrandAndName > nextBrandAndName) {
      return 1; // a est après b
    }
    return 0; // les noms sont égaux
  });
}

/**
 * Collecte les images des voitures à partir des données d'entrée et les ajoute à un tableau.
 * @param {Array} carImgsArray - Tableau dans lequel les images de voitures seront stockées.
 * @param {Array} dataArray - Tableau contenant les données des voitures regroupées par marque.
 */
function getImagesOfCar(carImgsArray, dataArray) {
  // Parcourt les marques et les voitures pour collecter les images des voitures
  for (let brand of dataArray) {
    for (let car of brand.cars) {
      carImgsArray.push(car.imagesCar);
    }
  }
}

/**
 * Envoie les images des voitures au script PHP via une requête POST et met à jour les données locales avec la réponse.
 * @param {Array} carImagesArray - Tableau contenant les images de voitures à envoyer.
 * @param {Array} dataArray - Tableau contenant les données des voitures regroupées par marque.
 * @returns {Promise} - La promesse de l'envoi des images et de la mise à jour des données locales.
 */
async function sendImagesToServer(carImagesArray, dataArray) {
  let jsonCarImages = JSON.stringify(carImagesArray);
  await fetch("../php/verify_images.php", {
    method: "POST",
    body: jsonCarImages,
  })
    .then((response) => response.json()) // Récupère le texte de la réponse du script PHP
    .then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        updateCarImages(data, dataArray);
      }
    })
    .catch((error) => {
      console.error("Erreur : " + error.message);
    });
}

/**
 * Met à jour les images des voitures et les propriétés associées en fonction des données de réponse.
 * @param {Array} data - Données de réponse du script PHP contenant les images des voitures.
 * @param {Array} dataArray - Tableau contenant les données des voitures regroupées par marque.
 */
function updateCarImages(data, dataArray) {
  let indexArrayJSON = 0;
  for (let brand of dataArray) {
    for (let car of brand.cars) {
      car.imagesCar = data[indexArrayJSON];
      indexArrayJSON++;
      car.maxIndexSlide = car.imagesCar.length - 1;
    }
  }
}

/**
 * Vérifie les images des voitures en collectant, envoyant et mettant à jour les données d'images.
 * @param {Array} dataArray - Tableau contenant les données des voitures regroupées par marque.
 */
async function verifyImagesOfCar(dataArray) {
  let carImagesArray = new Array();
  getImagesOfCar(carImagesArray, dataArray);

  await sendImagesToServer(carImagesArray, dataArray);
}

/**
 * Crée une chaîne de caractères représentant le slider d'images pour une voiture donnée.
 * @param {Object} car - Objet représentant les données d'une voiture.
 * @returns {string} - Chaîne de caractères HTML représentant le slider d'images pour la voiture.
 */
function createImageSliderString(car) {
  const imagesHTML = car.imagesCar.map((img, index) => {
    const isActive = index === 0 ? "img-active" : ""; // Ajouter la classe 'active' à la première image
    return `<img class="img-slide ${isActive}" src="${img}">`;
  });

  // Remise de currentIndexSlide à 0 pour éviter le décalage lors de la recherche
  car.currentIndexSlide = 0;

  return imagesHTML.join("\n");
}

/**
 * Permet de faire défiler les images du slider en fonction du bouton cliqué.
 * @param {string} pressedButton - Le bouton de direction (gauche ou droite) qui a été pressé.
 * @param {number} indiceBrand - L'indice de la marque de la voiture dans le tableau de données.
 * @param {number} indiceCarInBrand - L'indice de la voiture dans le tableau de données de la marque.
 */
function swipeImagesOfSlider(pressedButton, indiceBrand, indiceCarInBrand) {
  // Récupération de l'élément de la voiture dans le tableau de données
  let carElement = dataArray[indiceBrand]["cars"][indiceCarInBrand];

  // Sélection des éléments d'images du slider correspondant à la voiture
  const className = `.slider_${indiceBrand}_${indiceCarInBrand} img`;
  let slider = document.querySelectorAll(className);

  // Suppression de la classe 'img-active' de l'image actuelle
  slider[carElement.currentIndexSlide].classList.remove("img-active");

  // Appel de la fonction de changement d'indice de slide et sauvegarde du nouvel indice
  carElement.changeAndSaveNumberOfSlide(pressedButton);

  // Ajout de la classe 'img-active' à la nouvelle image affichée
  slider[carElement.currentIndexSlide].classList.add("img-active");
}

// Assignation de la fonction swipeImagesOfSlider à la propriété window pour la rendre accessible globalement
window.swipeImagesOfSlider = swipeImagesOfSlider;

/**
 * Affiche ou masque la liste des voitures pour une marque donnée en fonction de son identifiant.
 * @param {number} idBrand - L'identifiant de la marque dont la liste des voitures doit être affichée ou masquée.
 */
function showCarListInBrand(idBrand) {
  // Création de l'identifiant du conteneur de la marque
  const idName = "id_brand_" + idBrand;

  // Récupération de l'élément contenant la liste des voitures de la marque
  var element = document.getElementById(idName);

  // Basculer la classe 'container-car-active' pour afficher ou masquer la liste des voitures
  element.classList.toggle("container-car-active");

  // Création du sélecteur de la classe d'éléments d'images d'ouverture/fermeture
  const className = ".brand_" + idBrand;
  let imgCloseOpen = document.querySelector(className);

  // Vérification de l'existence des éléments d'images et bascule de la classe 'brand-img-active' si présents
  if (imgCloseOpen !== null) {
    let imgElements = imgCloseOpen.querySelectorAll("img");

    // Vérification du nombre d'éléments d'images
    if (imgElements.length === 2) {
      imgElements[0].classList.toggle("brand-img-active");
      imgElements[1].classList.toggle("brand-img-active");
    }
  }
}

// Assignation de la fonction showCarListInBrand à la propriété window pour la rendre accessible globalement
window.showCarListInBrand = showCarListInBrand;

// TO DO ??
// Fonction pour créer globalement div -> class [...] id [...]

/**
 * Crée un élément de div représentant un élément de tableau pour une marque spécifique.
 * @param {number} indiceBrand - L'indice de la marque pour laquelle créer l'élément de div du tableau.
 * @returns {HTMLDivElement} - L'élément de div créé représentant l'élément de tableau pour la marque.
 */
function createDivTableItem(indiceBrand) {
  // Crée un nouvel élément de div
  const div = document.createElement("div");

  // Définit les attributs de classe et d'identifiant pour l'élément de div
  div.setAttribute("class", "table-item scroll-target");
  div.setAttribute("id", `id_${indiceBrand}`);

  return div;
}

/**
 * Crée un élément de div représentant une marque dans le tableau.
 * @param {Brand} brand - Objet représentant les données d'une marque de voiture.
 * @returns {HTMLDivElement} - L'élément de div créé représentant la marque dans le tableau.
 */
function createDivTableBrand(brand) {
  // Crée un nouvel élément de div
  const div = document.createElement("div");

  // Définit la classe de l'élément de div
  div.setAttribute("class", "table-brand");

  // Remplit le contenu HTML de l'élément de div avec les données de la marque
  div.innerHTML = `
    <div class="container-logo-brand"> 
      <img class="brand-logo" src="${brand["logo"]}">
    </div>

    <div class="brand-info">
      <div class="brand-name">${brand["brand"]}</div>
      <div class="nbr-resultat">Nombre de résultat : ${brand["cars"].length}</div>
    </div>
  `;

  return div;
}

/**
 * Crée un élément de div représentant le bouton "Voir plus" pour une marque donnée.
 * @param {number} indiceBrand - L'indice de la marque pour laquelle créer le bouton "Voir plus".
 * @returns {HTMLDivElement} - L'élément de div créé représentant le bouton "Voir plus" pour la marque.
 */
function createDivVoirPlus(indiceBrand) {
  // Crée un nouvel élément de div
  const div = document.createElement("div");

  // Définit la classe de l'élément de div
  div.setAttribute("class", "table-voir-plus");

  // Remplit le contenu HTML de l'élément de div avec le bouton "Voir plus" et ajoute le gestionnaire d'événement
  div.innerHTML = `
    <a href="#id_${indiceBrand}" class="brand_${indiceBrand}" onclick="window.showCarListInBrand(${indiceBrand})">
      <img class="brand-button brand-img-active" src="../assets/imgs/catalogue/voir_plus_open.png">
      <img class="brand-button" src="../assets/imgs/catalogue/voir_plus_close.png">
    </a>
  `;

  return div;
}

/**
 * Crée un élément de div représentant le conteneur des voitures d'une marque.
 * @returns {HTMLDivElement} - L'élément de div créé représentant le conteneur des voitures de la marque.
 */
function createDivContainerBrandCar() {
  const div = document.createElement("div");
  div.setAttribute("class", "table-container-brand-car");

  return div;
}

/**
 * Crée un élément de div représentant le conteneur des voitures pour une marque spécifique.
 * @param {number} indiceBrand - L'indice de la marque pour laquelle créer le conteneur des voitures.
 * @returns {HTMLDivElement} - L'élément de div créé représentant le conteneur des voitures de la marque.
 */
function createContainerCar(indiceBrand) {
  const div = document.createElement("div");
  div.setAttribute("class", "table-container-car");
  div.setAttribute("id", `id_brand_${indiceBrand}`);

  return div;
}

/**
 * Crée le contenu HTML du conteneur d'images pour une voiture spécifique.
 * @param {Object} carObject - L'objet représentant les données d'une voiture.
 * @param {number} indiceBrand - L'indice de la marque à laquelle appartient la voiture.
 * @param {number} counterCar - L'indice de la voiture dans le contexte de sa marque.
 * @returns {string} - Le contenu HTML du conteneur d'images pour la voiture.
 */
function createContainerImageHTML(carObject, indiceBrand, counterCar) {
  // Génère le code HTML du slider d'images pour la voiture
  let sliderHTML = createImageSliderString(carObject);

  // Crée les fonctions de glissement pour le slider
  let swipeRight = `window.swipeImagesOfSlider('right', ${indiceBrand}, ${counterCar})`;
  let swipeLeft = `window.swipeImagesOfSlider('left', ${indiceBrand}, ${counterCar})`;

  // Génère le contenu HTML complet du conteneur d'images avec les boutons de glissement
  let containerImageHTML = `
    <a href="javascript:void(0)" onclick="${swipeLeft}">
      <img class="angle" src="../assets/imgs/icone/angle-gauche.png">
    </a>

    <div class="slider_${indiceBrand}_${counterCar}">
      ${sliderHTML}
    </div>

    <a href="javascript:void(0)" onclick="${swipeRight}">
      <img class="angle" src="../assets/imgs/icone/angle-droit.png">
    </a>
  `;

  return containerImageHTML;
}

/**
 * Crée un élément div représentant un élément de tableau contenant les informations d'une voiture.
 * @param {Object} car - Objet contenant les informations de la voiture.
 * @param {string} containerImageHTML - HTML représentant le conteneur des images de la voiture.
 * @returns {HTMLElement} - Élément div contenant les informations de la voiture.
 */
function createDivCar(car, containerImageHTML) {
  const div = document.createElement("div");
  div.setAttribute("class", "table-car");
  div.innerHTML = `
    <div class="container-img">
      ${containerImageHTML}
    </div>

    <div class="car-info">
      <p class="name">${car.brandCar} ${car.nameCar}</p>
      <p class="price">À partir de [METTRE A PARTIR DE RATE]</p>
      <div class="car-disponibilite">
        <img src=${
          car.availabilityCar
            ? "../assets/imgs/icone/disponible.png"
            : "../assets/imgs/icone/non-disponible.png"
        }>
        <p>${car.availabilityCar ? "Disponible" : "Non disponible"}</p>
      </div>
      <a href="#${car.nameCar}" class="button">En savoir plus →</a>
    </div>
  `;

  return div;
}

/*
function createCarList(carList) {
  // Vérifie si l'objet carList contient des éléments
  if (Object.keys(carList).length !== 0) {
    // Chaîne HTML représentant une image par défaut en cas d'absence d'images disponibles
    let noImagesAvailable = `<img class="img-slide img-active" src="../assets/imgs/catalogue/image_not_available.png">`;

    // Boucle parcourant chaque marque dans l'objet carList
    for (let brand in carList) {
      // Crée un élément de div représentant un élément de tableau incluant une section pour la marque et la liste des voitures
      const divTableItem = createDivTableItem(brand);

      // Crée un élément de div représentant la marque dans le tableau
      const divTableBrand = createDivTableBrand(carList[brand]);

      // Crée un élément de div représentant le bouton "Voir plus" pour la marque spécifique
      const divVoirPlus = createDivVoirPlus(brand);

      // Crée un élément de div représentant le conteneur des voitures de la marque
      const divContainerBrandCar = createDivContainerBrandCar();

      // Crée un élément de div représentant le conteneur des voitures pour la marque spécifique
      const divContainerCar = createContainerCar(brand);

      let counterOfCar = 0;
      let containerImageHTML; // Voir c'est quoi le mieux entre le mettre en dehors ou à l'intérieur
      // Detruis / Assigne nouvelle valeur à chaque tour de boucle

      for (let car of carList[brand]["cars"]) {
        if (car.imagesCar.length === 0) {
          containerImageHTML = noImagesAvailable;
        } else {
          containerImageHTML = createContainerImageHTML(
            car,
            brand,
            counterOfCar
          );
        }

        const divCar = createDivCar(car, containerImageHTML);

        counterOfCar++;

        if (divContainerCar !== null) {
          divContainerCar.appendChild(divCar);
        }
      }

      if (searchResult !== null && divTableItem !== null) {
        divContainerBrandCar.appendChild(divTableBrand);
        divContainerBrandCar.appendChild(divContainerCar);

        divTableItem.appendChild(divContainerBrandCar);
        divTableItem.appendChild(divVoirPlus);

        searchResult.appendChild(divTableItem);
      }
    }
  } else {
    const divNoResult = document.createElement("div"); // Change with <p> ??
    divNoResult.setAttribute("class", "table-noresults");
    divNoResult.innerHTML = `
      Aucun résultat correspondant à votre recherche.
    `;
    if (searchNoResult != null) {
      searchNoResult.appendChild(divNoResult);
    }
  }
}*/

/**
 * Crée un élément de div représentant un élément de tableau incluant une section pour la marque et la liste des voitures.
 * @param {string} brand - Nom de la marque.
 * @param {Object} carList - Liste des voitures pour la marque.
 */
function createTableItem(brand, carList) {
  const divTableItem = createDivTableItem(brand);
  const divTableBrand = createDivTableBrand(carList[brand]);
  const divVoirPlus = createDivVoirPlus(brand);
  const divContainerBrandCar = createDivContainerBrandCar();
  const divContainerCar = createContainerCar(brand);

  createCarElements(carList[brand]["cars"], brand, divContainerCar);

  if (searchResult !== null && divTableItem !== null) {
    divContainerBrandCar.appendChild(divTableBrand);
    divContainerBrandCar.appendChild(divContainerCar);
    divTableItem.appendChild(divContainerBrandCar);
    divTableItem.appendChild(divVoirPlus);
    searchResult.appendChild(divTableItem);
  }
}

/**
 * Crée les éléments de voiture et les ajoute au conteneur de voitures.
 * @param {Object[]} cars - Liste des voitures pour la marque.
 * @param {string} brand - Nom de la marque.
 * @param {HTMLElement} divContainerCar - Élément div du conteneur de voitures.
 * @returns {number} - Le nombre de voitures ajoutées.
 */
function createCarElements(cars, brand, divContainerCar) {
  let counterOfCar = 0;
  const noImagesAvailable = `<img class="img-slide img-active" src="../assets/imgs/catalogue/image_not_available.png">`;

  // Parcours de chaque voiture dans la liste
  for (let car of cars) {
    // Crée le contenu HTML du conteneur d'images de la voiture
    const containerImageHTML =
      car.imagesCar.length === 0
        ? noImagesAvailable
        : createContainerImageHTML(car, brand, counterOfCar);

    // Crée l'élément div représentant la voiture
    const divCar = createDivCar(car, containerImageHTML);
    counterOfCar++;

    // Ajoute l'élément div de la voiture au conteneur de voitures
    if (divContainerCar !== null) {
      divContainerCar.appendChild(divCar);
    }
  }

  return counterOfCar;
}

/**
 * Crée le tableau des voitures pour chaque marque dans la liste de voitures.
 * @param {Array} carList - Liste des voitures pour chaque marque.
 */
function createCarList(carList) {
  if (Object.keys(carList).length !== 0) {
    for (let brand in carList) {
      createTableItem(brand, carList);
    }
  } else {
    const divNoResult = document.createElement("div");
    divNoResult.setAttribute("class", "table-noresults");
    divNoResult.innerHTML = `Aucun résultat correspondant à votre recherche.`;
    if (searchNoResult !== null) {
      searchNoResult.appendChild(divNoResult);
    }
  }
}

// Vérifie si l'élément DOM avec l'ID 'searchInput' existe
if (searchInput != null) {
  // Si 'searchInput' existe, ajoute un écouteur d'événement 'input' qui
  // déclenchera la fonction 'filterData' lorsqu'un utilisateur saisit dans l'input.
  searchInput.addEventListener("input", filterData);
}

// Définition de la fonction 'filterData' qui sera appelée en réponse à l'événement 'input'
/**
 * Fonction permettant de filtrer les résultats en fonction d'un texte entré.
 * @param elementInput - Contient des informations sur l'événement lui-même
 */
function filterData(elementInput) {
  // Vérifie si les éléments DOM avec les ID 'searchResult' et 'searchNoResult' existent
  if (searchResult != null && searchNoResult != null) {
    // Si ces éléments existent, vide leur contenu.
    searchResult.innerHTML = "";
    searchNoResult.innerHTML = "";
  } else {
    // Si l'un des éléments n'existe pas, lance une erreur avec un message.
    throw new Error("searchResult or searchNoResult null");
  }
  // Récupère la chaîne saisie par l'utilisateur, convertit en minuscules et supprime les espaces blancs
  const searchedString = elementInput.target.value
    .toLowerCase()
    .replace(/\s/g, "");
  // Crée une copie de dataArray (tableau d'objets Brand)
  let filteredArray = dataArray.map((element) => ({
    brand: element.brand,
    logo: element.logo,
    cars: element.cars,
  }));
  // Parcourt chaque objet Brand dans 'filteredArray'
  for (let brand of filteredArray) {
    // Filtre le tableau 'cars' de chaque objet Brand en fonction de la chaîne de recherche
    brand["cars"] = brand["cars"].filter(
      (car) =>
        car.nameCar.toLowerCase().includes(searchedString) ||
        car.brandCar.toLowerCase().includes(searchedString) ||
        `${car.brandCar + car.nameCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString) ||
        `${car.nameCar + car.brandCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString) ||
        `${car.fullNameCar}`
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchedString)
    );
  }
  filteredArray = filteredArray.filter((brand) => brand["cars"].length !== 0);
  // Appelle une fonction 'createCarList' avec le tableau 'filteredArray' filtré comme argument
  createCarList(filteredArray);
}

function showNavbar() {
  var element = document.getElementById("links");
  if (element !== null) {
    if (element.style.display == "block") {
      element.style.display = "none";
    } else {
      element.style.display = "block";
    }
  }
}

window.showNavbar = showNavbar;