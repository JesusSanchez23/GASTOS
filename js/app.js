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
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado = this.gastos.reduce(
      (total, gasto) => (total += gasto.cantidad),
      0
    );

    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
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
    this.limpiarHTML();
    // crear los componentes e iterar
    gastos.forEach((gasto) => {
      const { cantidad, nombre, id } = gasto;

      // crear LI
      const liGasto = document.createElement("LI");
      liGasto.className =
        "list-group-item d-flex justify-content-between align-items-center";
      // liGasto.setAttribute("data-id", id);
      liGasto.dataset.id = id;

      // AGREGAR EL HTML DEL GATSO
      liGasto.innerHTML = `${nombre} <span class='badge badge-primary badge-pill'> $${cantidad} </span>`;

      // AGREGAR BOTON

      const btnGasto = document.createElement("button");
      btnGasto.classList.add("btn", "btn-danger", "borrar-gasto");
      btnGasto.textContent = "x";
      liGasto.appendChild(btnGasto);

      btnGasto.onclick = () => {
        eliminarGasto(id);
      };
      gastoListado.appendChild(liGasto);
    });
  }

  // limipar html

  limpiarHTML() {
    while (gastoListado.firstChild) {
      gastoListado.removeChild(gastoListado.firstChild);
    }
  }

  actualizarRestante(restante) {
    document.querySelector("#restante").textContent = restante;
  }

  comprobarPresupuesto(presupuestoObj) {
    const { presupuesto, restante } = presupuestoObj;

    const restanteDiv = document.querySelector(".restante");
    //comprobar 25

    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove("alert-success", "alert-warning");
      restanteDiv.classList.add("alert-danger");
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove("alert-success");
      restanteDiv.classList.add("alert-warning");
    } else {
      restanteDiv.classList.remove("alert-danger", "alert-warning");
      restanteDiv.classList.add("alert-success");
    }

    // si el restante ya es 0

    if (restante <= 0) {
      ui.ImprimirAlerta("error", "Sin dinero");
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
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

  const { gastos, restante } = presupuesto;
  ui.imprimirListado(gastos);

  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
  formulario.reset();
}

function eliminarGasto(id) {
  presupuesto.eliminarGasto(id);
  const { gastos, restante } = presupuesto;

  ui.imprimirListado(gastos);
  ui.actualizarRestante(restante);

  ui.comprobarPresupuesto(presupuesto);
}
