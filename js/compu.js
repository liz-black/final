// ================= FUNCIONES ÚTILES =================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ================= DATOS BASE =================
const hardware = ["Teclado", "Mouse", "Monitor", "CPU", "Impresora"];
const software = ["Windows", "Word", "Excel", "Chrome", "PowerPoint"];

const entrada = ["Teclado", "Mouse", "Escáner", "Micrófono"];
const salida = ["Monitor", "Impresora", "Parlantes", "Proyector"];

const programas = ["Word", "Excel", "PowerPoint", "Paint", "Chrome"];

// ================= GENERADORES RANDOM =================
function preguntaHardwareSoftware() {
  const esHardware = Math.random() > 0.5;
  const item = esHardware
    ? hardware[rand(0, hardware.length - 1)]
    : software[rand(0, software.length - 1)];

  return {
    q: `${item} es:`,
    o: mezclar(["Hardware", "Software"]),
    a: esHardware ? "Hardware" : "Software"
  };
}

function preguntaEntradaSalida() {
  const esEntrada = Math.random() > 0.5;
  const item = esEntrada
    ? entrada[rand(0, entrada.length - 1)]
    : salida[rand(0, salida.length - 1)];

  return {
    q: `${item} es un dispositivo de:`,
    o: mezclar(["Entrada", "Salida"]),
    a: esEntrada ? "Entrada" : "Salida"
  };
}

function preguntaPrograma() {
  const prog = programas[rand(0, programas.length - 1)];
  return {
    q: `${prog} es un programa de computadora:`,
    o: mezclar(["Verdadero", "Falso"]),
    a: "Verdadero"
  };
}

// ================= QUIZZES POR SESIÓN =================
const sesiones = {
  quiz1: [
    preguntaHardwareSoftware(),
    preguntaHardwareSoftware()
  ],
  quiz2: [
    preguntaEntradaSalida(),
    preguntaEntradaSalida()
  ],
  quiz3: [
    preguntaPrograma(),
    preguntaPrograma()
  ]
};

// ================= MOSTRAR QUIZZES =================
function crearQuiz(id) {
  let html = "";
  sesiones[id].forEach((p, i) => {
    html += `<div class="quiz">
      <p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="${id}${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById(id).innerHTML = html;
}

["quiz1", "quiz2", "quiz3"].forEach(crearQuiz);

// ================= REVISAR QUIZ =================
function revisarClase(quizId, resId) {
  let correctas = 0;

  sesiones[quizId].forEach((p, i) => {
    const marcada = document.querySelector(
      `input[name="${quizId}${i}"]:checked`
    );
    if (marcada && marcada.value === p.a) correctas++;
  });

  document.getElementById(resId).innerText =
    `Correctas: ${correctas} / ${sesiones[quizId].length}`;
}

// ================= EVALUACIÓN FINAL RANDOM =================
let bancoFinal = [];
for (let i = 0; i < 10; i++) {
  const tipo = rand(1, 3);
  if (tipo === 1) bancoFinal.push(preguntaHardwareSoftware());
  if (tipo === 2) bancoFinal.push(preguntaEntradaSalida());
  if (tipo === 3) bancoFinal.push(preguntaPrograma());
}

function crearEvaluacionFinal() {
  let html = "";
  bancoFinal.forEach((p, i) => {
    html += `<div class="quiz">
      <p>${p.q}</p>`;
    p.o.forEach(op => {
      html += `
        <label>
          <input type="radio" name="f${i}" value="${op}">
          ${op}
        </label><br>`;
    });
    html += `</div>`;
  });
  document.getElementById("finalQuiz").innerHTML = html;
}

crearEvaluacionFinal();

// ================= CALCULAR NOTA FINAL =================
function calcularFinal() {
  let nota = 0;

  bancoFinal.forEach((p, i) => {
    const marcada = document.querySelector(
      `input[name="f${i}"]:checked`
    );
    if (marcada && marcada.value === p.a) nota += 2;
  });

  document.getElementById("notaFinal").innerText =
    `Nota final: ${nota} / 20`;
}

// ================= DESCARGAR EVALUACIÓN EN PDF =================
function descargarEvaluacion() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  let nota = 0;

  doc.setFontSize(14);
  doc.text("EVALUACIÓN FINAL - COMPUTACIÓN", 10, y);
  y += 10;

  doc.setFontSize(11);

  bancoFinal.forEach((p, i) => {
    const marcada = document.querySelector(
      `input[name="f${i}"]:checked`
    );

    const respuesta = marcada ? marcada.value : "No respondió";
    if (respuesta === p.a) nota += 2;

    doc.text(`${i + 1}. ${p.q}`, 10, y);
    y += 6;

    p.o.forEach(op => {
      let textoOpcion = `- ${op}`;
      if (op === respuesta) {
        textoOpcion += "  ← seleccionada";
      }
      doc.text(textoOpcion, 14, y);
      y += 5;
    });

    doc.text(`Respuesta del estudiante: ${respuesta}`, 14, y);
    y += 5;
    doc.text(`Respuesta correcta: ${p.a}`, 14, y);
    y += 8;

    // Salto de página automático
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  doc.setFontSize(13);
  doc.text(`NOTA FINAL: ${nota} / 20`, 10, y + 5);

  doc.save("evaluacion_computacion.pdf");
}

// ================= NAVEGACIÓN =================
document.querySelectorAll(".session-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".session").forEach(
      s => s.style.display = "none"
    );
    document.getElementById(btn.dataset.s).style.display = "block";
  };
});

// Mostrar primera sesión
document.getElementById("s1").style.display = "block";
