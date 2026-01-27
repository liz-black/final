// ================= FUNCIONES ÚTILES =================
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function mezclar(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// ================= QUIZZES POR CLASE (FIJOS) =================
const sesiones = {
  quiz1: [
    { q: "¿Cuál es un número entero?", o: ["5", "0.5"], a: "5" },
    { q: "−3 es un número:", o: ["Entero", "Natural"], a: "Entero" }
  ],
  quiz2: [
    { q: "¿Cuál es un número natural?", o: ["7", "-4"], a: "7" },
    { q: "Los naturales incluyen:", o: ["1", "-1"], a: "1" }
  ],
  quiz3: [
    { q: "4 × (−2) =", o: ["−8", "8"], a: "−8" },
    { q: "(−3) × (−3) =", o: ["9", "−9"], a: "9" }
  ],
  quiz4: [
    { q: "6 × 4 =", o: ["24", "20"], a: "24" },
    { q: "12 ÷ 3 =", o: ["4", "6"], a: "4" }
  ]
};

// ================= CREAR QUIZZES DE CLASE =================
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

["quiz1", "quiz2", "quiz3", "quiz4"].forEach(crearQuiz);

// ================= PREGUNTAS RANDOM (EVALUACIÓN FINAL) =================
function generarPreguntaRandom() {
  let tipo = rand(1, 4);
  let a, b, correcta, pregunta;

  switch (tipo) {
    case 1:
      a = rand(1, 10);
      b = rand(1, 10);
      correcta = a + b;
      pregunta = `¿Cuánto es ${a} + ${b}?`;
      break;

    case 2:
      a = rand(5, 20);
      b = rand(1, 10);
      correcta = a - b;
      pregunta = `¿Cuánto es ${a} − ${b}?`;
      break;

    case 3:
      a = rand(1, 10);
      b = rand(1, 10);
      correcta = a * b;
      pregunta = `¿Cuánto es ${a} × ${b}?`;
      break;

    case 4:
      b = rand(1, 10);
      correcta = rand(1, 10);
      a = correcta * b;
      pregunta = `¿Cuánto es ${a} ÷ ${b}?`;
      break;
  }

  let opciones = mezclar([
    correcta,
    correcta + rand(1, 3),
    correcta - rand(1, 3)
  ]);

  return {
    q: pregunta,
    o: opciones,
    a: correcta
  };
}

// ================= BANCO FINAL ALEATORIO =================
let bancoFinal = [];
for (let i = 0; i < 10; i++) {
  bancoFinal.push(generarPreguntaRandom());
}

// ================= MOSTRAR EVALUACIÓN FINAL =================
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

// ================= CALIFICAR EVALUACIÓN =================
function calcularFinal() {
  let nota = 0;

  bancoFinal.forEach((p, i) => {
    let seleccion = document.querySelector(`input[name="f${i}"]:checked`);
    if (seleccion && Number(seleccion.value) === p.a) {
      nota += 2;
    }
  });

  document.getElementById("notaFinal").innerText =
    `Nota final: ${nota} / 20`;
}

// ================= NAVEGACIÓN ENTRE SECCIONES =================
document.querySelectorAll(".session-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".session").forEach(s => s.style.display = "none");
    document.getElementById(btn.dataset.s).style.display = "block";
  });
});

// Mostrar primera sección
document.getElementById("s1").style.display = "block";


// ================= DESCARGAR EVALUACIÓN DE MATEMÁTICA =================
function descargarEvaluacionPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  let y = 10;
  let nota = 0; // vamos a calcular la nota igual que en computación

  doc.setFontSize(14);
  doc.text("EVALUACIÓN FINAL - MATEMÁTICA", 10, y);
  y += 10;

  doc.setFontSize(11);

  // recorremos el banco de preguntas
  bancoFinal.forEach((p, index) => {
    // seleccionamos la respuesta marcada por el estudiante
    const seleccionada = document.querySelector(`input[name="f${index}"]:checked`);
    const respuestaAlumno = seleccionada ? seleccionada.value : "No respondió";

    // sumamos nota si es correcta
    if (respuestaAlumno === p.a) nota += 2; // asumimos 2 puntos por pregunta

    // escribimos la pregunta
    doc.text(`${index + 1}. ${p.q}`, 10, y);
    y += 6;

    // escribimos las opciones
    p.o.forEach(op => {
      let textoOpcion = `- ${op}`;
      if (op === respuestaAlumno) textoOpcion += "  ← seleccionada";
      doc.text(textoOpcion, 14, y);
      y += 5;
    });

    // respuesta del estudiante
    doc.text(`Respuesta del estudiante: ${respuestaAlumno}`, 14, y);
    y += 5;

    // respuesta correcta
    doc.text(`Respuesta correcta: ${p.a}`, 14, y);
    y += 8;

    // salto de página automático
    if (y > 270) {
      doc.addPage();
      y = 10;
    }
  });

  // nota final
  doc.setFontSize(13);
  doc.text(`NOTA FINAL: ${nota} / ${bancoFinal.length * 2}`, 10, y + 5);

  // descargamos el PDF
  doc.save("evaluacion_matematica.pdf");
}

