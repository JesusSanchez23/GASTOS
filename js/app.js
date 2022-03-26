// variables y selectores

const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");

// eventos
evenListeners();
function evenListeners() {
  document.addEventListener("DOMContentLoaded", preguntarPresupuesto);
}

// clases

class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    // se creo un arreglo de gastos en el constructor para que se añadan los gatsos que recibimos
    this.gastos = [...this.gastos, gasto];
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    const { presupuesto, restante } = cantidad;
    // agregar al HTML
    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;

    formulario.addEventListener("submit", agregarGasto);
  }

  ImprimirAlerta(tipo, mensaje) {
    const parrafo = document.createElement("P");
    parrafo.classList.add("text-center", "alert");
    parrafo.textContent = mensaje;

    if (tipo === "error") {
      parrafo.classList.add("alert-danger");
    } else {
      parrafo.classList.add("alert-success");
    }

    document.querySelector(".primario").insertBefore(parrafo, formulario);

    setTimeout(() => {
      parrafo.remove();
    }, 2000);
  }

  imprimirListado(gastos) {
    // crear los componentes e iterar
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      // crear LI
      const liGasto = document.createElement("LI");
      liGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // liGasto.setAttribute("data-id", id);
      liGasto.dataset.id = id;
      console.log(liGasto);

      // AGREGAR EL HTML DEL GATSO
      liGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> ${cantidad} </span>`;

      // AGREGAR BOTON

      const btnGasto = document.createElement("button");
      btnGasto.classList.add("btn", "btn-danger", "borrar-gasto");
      btnGasto.textContent = "x";
      liGasto.appendChild(btnGasto);
      gastoListado.appendChild(liGasto);
    });
  }
}

// instanciar
const ui = new UI();
let presupuesto;

// funciones

function preguntarPresupuesto() {
  const presupuestoUsuario = prompt("Ingresa tu presupuesto");

  if (
    presupuestoUsuario == "" ||
    isNaN(presupuestoUsuario) ||
    presupuestoUsuario === null ||
    presupuestoUsuario <= 0
  ) {
    window.location.reload();
  }

  // presupuestoValido INSTANCIANDO LA CLASE DE PRESUPUESTO
  presupuesto = new Presupuesto(presupuestoUsuario);
  ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
  e.preventDefault();
  // leer los datos del formulario

  const nombre = document.querySelector("#gasto").value;
  const cantidad = Number(document.querySelector("#cantidad").value);

  if (nombre === "" || cantidad === "") {
    ui.ImprimirAlerta("error", "Ambos campos son obligatorios");
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    console.log(cantidad);

    ui.ImprimirAlerta("error", "Cantidad incorrecta");
    return;
  }

  // generar un objeto

  const gasto = {
    nombre,
    cantidad,
    id: Date.now(),
  };

  presupuesto.nuevoGasto(gasto);

  // mensaje de ok y reinicio del form
  ui.ImprimirAlerta("exito", "Guardado");

  console.log(presupuesto);

  const { gastos } = presupuesto;
  limpiarHTML();
  ui.imprimirListado(gastos);
  formulario.reset();
}

// limipar html

function limpiarHTML() {
  if (gastoListado.firstChild) {
    gastoListado.removeChild(gastoListado.firstChild);
  }
}
