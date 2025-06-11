import { NextResponse } from "next/server"
import {
  getAssistantConfigByRole,
  getMessagesByConversationId,
  createConversation,
  createMessage,
  updateConversation,
} from "@/lib/ai-storage"

export async function POST(req: Request) {
  try {
    const { message, conversationId, userRole } = await req.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Obtener la configuración del asistente según el rol del usuario
    const config = getAssistantConfigByRole(userRole || "student")

    if (!config) {
      return NextResponse.json({ error: "Assistant configuration not found" }, { status: 404 })
    }

    // Obtener mensajes previos si existe una conversación
    let previousMessages: { role: string; content: string }[] = []
    let conversation_id = conversationId

    if (conversationId) {
      const messages = getMessagesByConversationId(conversationId)

      previousMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    } else {
      // Crear nueva conversación
      conversation_id = Date.now().toString()

      createConversation({
        user_id: "user-id",
        user_role: userRole,
        conversation_id,
      })
    }

    // Guardar mensaje del usuario
    createMessage({
      conversation_id,
      role: "user",
      content: message,
    })

    // Construir el historial de mensajes para la API
    const chatHistory = [
      { role: "system", content: config.system_prompt },
      ...previousMessages,
      { role: "user", content: message },
    ]

    // Simular respuesta de IA (en una implementación real, usaríamos OpenAI)
    const aiResponse = simulateAIResponse(message, userRole)

    // Guardar respuesta del asistente
    createMessage({
      conversation_id,
      role: "assistant",
      content: aiResponse,
    })

    // Actualizar timestamp de la conversación
    updateConversation(conversation_id, {
      updated_at: new Date().toISOString(),
    })

    return NextResponse.json({
      response: aiResponse,
      conversationId: conversation_id,
    })
  } catch (error) {
    console.error("Error in AI chat:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Función para simular respuestas de IA más completas, similar a Alexa
function simulateAIResponse(message: string, userRole: string): string {
  const lowerMessage = message.toLowerCase()

  // Resolver problemas matemáticos
  if (isMathProblem(lowerMessage)) {
    return solveMathProblem(message)
  }

  // Responder a preguntas sobre la hora
  if (lowerMessage.includes("hora") || lowerMessage.includes("qué hora es")) {
    const now = new Date()
    return `Son las ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")} del ${now.getDate()} de ${getMonthName(now.getMonth())} de ${now.getFullYear()}.`
  }

  // Responder a preguntas sobre el día/fecha
  if (lowerMessage.includes("día es hoy") || lowerMessage.includes("fecha")) {
    const now = new Date()
    return `Hoy es ${getDayName(now.getDay())}, ${now.getDate()} de ${getMonthName(now.getMonth())} de ${now.getFullYear()}.`
  }

  // Respuestas de materias académicas
  const academicResponses = getAcademicResponses()
  for (const [keyword, response] of Object.entries(academicResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Respuestas de cultura general
  const generalKnowledge = {
    "quién fue einstein":
      "Albert Einstein fue un físico teórico alemán, nacionalizado después suizo, austriaco y estadounidense. Desarrolló la teoría de la relatividad y es considerado uno de los científicos más importantes del siglo XX.",
    "capital de francia": "La capital de Francia es París.",
    "capital de españa": "La capital de España es Madrid.",
    "capital de italia": "La capital de Italia es Roma.",
    "capital de alemania": "La capital de Alemania es Berlín.",
    "capital de reino unido": "La capital del Reino Unido es Londres.",
    "capital de japón": "La capital de Japón es Tokio.",
    "capital de china": "La capital de China es Pekín (Beijing).",
    "capital de rusia": "La capital de Rusia es Moscú.",
    "capital de brasil": "La capital de Brasilia.",
    "capital de argentina": "La capital de Argentina es Buenos Aires.",
    "capital de méxico": "La capital de México es Ciudad de México.",
    "capital de canadá": "La capital de Canadá es Ottawa.",
    "capital de australia": "La capital de Australia es Canberra.",
    "quién escribió don quijote":
      "Don Quijote de la Mancha fue escrito por Miguel de Cervantes Saavedra y publicado en dos partes, en 1605 y 1615.",
    "quién pintó la mona lisa": "La Mona Lisa (o La Gioconda) fue pintada por Leonardo da Vinci entre 1503 y 1519.",
    "cuántos planetas hay":
      "En nuestro sistema solar hay 8 planetas reconocidos oficialmente: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano y Neptuno. Plutón fue reclasificado como planeta enano en 2006.",
    "cuál es el río más largo":
      "El río más largo del mundo es el Nilo, con aproximadamente 6,650 kilómetros de longitud, aunque algunos estudios sugieren que el Amazonas podría ser ligeramente más largo.",
    "cuál es la montaña más alta":
      "El Monte Everest es la montaña más alta del mundo, con una altura de 8,848.86 metros sobre el nivel del mar.",
    "quién ganó el último mundial":
      "La selección de Argentina ganó la Copa Mundial de la FIFA 2022, celebrada en Qatar, venciendo a Francia en la final por penales.",
    "cuándo fue la primera guerra mundial": "La Primera Guerra Mundial tuvo lugar entre 1914 y 1918.",
    "cuándo fue la segunda guerra mundial": "La Segunda Guerra Mundial tuvo lugar entre 1939 y 1945.",
    "quién fue napoleón":
      "Napoleón Bonaparte fue un militar y estadista francés, que llegó a ser emperador de Francia. Es considerado uno de los mayores genios militares de la historia.",
    "quién descubrió américa":
      "Cristóbal Colón llegó a América el 12 de octubre de 1492, aunque ya había sido descubierta por los pueblos indígenas que la habitaban y posiblemente por los vikingos siglos antes.",
    "cuál es el animal más grande":
      "La ballena azul es el animal más grande conocido que ha existido, pudiendo alcanzar hasta 30 metros de longitud y 173 toneladas de peso.",
    "cuántos huesos tiene el cuerpo humano": "El cuerpo humano adulto tiene 206 huesos.",
    "cuál es el elemento más abundante":
      "El hidrógeno es el elemento más abundante en el universo, mientras que el oxígeno es el más abundante en la corteza terrestre.",
    "quién inventó la bombilla":
      "Thomas Edison patentó la bombilla eléctrica incandescente en 1879, aunque hubo otros inventores que trabajaron en diseños similares.",
    "quién inventó internet":
      "Internet no tiene un único inventor, sino que fue el resultado del trabajo de muchas personas. Sin embargo, se considera que Tim Berners-Lee inventó la World Wide Web en 1989.",
    "cuántos continentes hay":
      "Hay 7 continentes: África, América, Antártida, Asia, Europa, Oceanía y, según algunas clasificaciones, Oceanía o Australia.",
  }

  // Buscar en respuestas de cultura general
  for (const [keyword, response] of Object.entries(generalKnowledge)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Respuestas para saludos y conversación general
  const conversational = {
    hola: "¡Hola! ¿En qué puedo ayudarte hoy?",
    "buenos días": "¡Buenos días! ¿Cómo puedo asistirte hoy?",
    "buenas tardes": "¡Buenas tardes! ¿En qué puedo ayudarte?",
    "buenas noches": "¡Buenas noches! ¿Necesitas ayuda con algo?",
    "cómo estás": "Estoy funcionando perfectamente, gracias por preguntar. ¿En qué puedo ayudarte?",
    gracias: "¡De nada! Estoy aquí para ayudarte. ¿Hay algo más en lo que pueda asistirte?",
    adiós: "¡Hasta luego! Si necesitas más ayuda, estaré aquí.",
    chiste: "¿Por qué los programadores prefieren el frío? Porque odian los bugs. 😄",
    "cuéntame un chiste": "¿Qué le dice un bit al otro? Nos vemos en el bus. 😄",
    "quién eres":
      "Soy el asistente de DiClass, diseñado para ayudarte con tus preguntas sobre la plataforma, tareas académicas y proporcionar información general.",
    "qué puedes hacer":
      "Puedo ayudarte con información sobre DiClass, responder preguntas de cultura general, decirte la hora y fecha actual, y asistirte con tus tareas académicas.",
  }

  // Buscar en respuestas conversacionales
  for (const [keyword, response] of Object.entries(conversational)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Respuestas específicas de DiClass
  const diclassResponses = {
    ayuda: "Estoy aquí para ayudarte. ¿Qué necesitas saber sobre DiClass?",
    clase: "En DiClass puedes crear o unirte a clases fácilmente. ¿Necesitas ayuda con alguna clase específica?",
    tarea:
      userRole === "teacher"
        ? "Puedes crear tareas desde la pestaña 'Trabajo en clase' en tu página de clase. ¿Necesitas ayuda para configurar algún tipo específico de tarea?"
        : "Puedes ver tus tareas pendientes en el dashboard o en cada clase. ¿Necesitas ayuda con alguna tarea específica?",
    calificación:
      userRole === "teacher"
        ? "Puedes calificar las entregas de tus estudiantes desde la página de cada tarea. ¿Necesitas ayuda con el proceso de calificación?"
        : "Puedes ver tus calificaciones en la pestaña 'Calificaciones' de cada clase. ¿Tienes alguna duda sobre tus calificaciones?",
    "unirme a una clase":
      "Para unirte a una clase, ve a tu Dashboard y haz clic en el botón 'Unirse a una clase'. Luego, ingresa el código de clase proporcionado por tu profesor.",
    "crear una clase":
      "Para crear una clase, ve a tu Dashboard y haz clic en el botón 'Crear Clase'. Completa el formulario con los detalles de la clase y haz clic en 'Crear'.",
    "entregar tarea":
      "Para entregar una tarea, ve a la página de la tarea específica, sube tus archivos y haz clic en el botón 'Entregar'.",
    "cambiar contraseña":
      "Para cambiar tu contraseña, ve a tu perfil y selecciona la pestaña 'Cuenta'. Allí encontrarás la opción para cambiar tu contraseña.",
    "cambiar tema":
      "Puedes cambiar entre tema claro y oscuro desde la configuración o usando el botón de tema en la barra de navegación.",
  }

  // Buscar en respuestas de DiClass
  for (const [keyword, response] of Object.entries(diclassResponses)) {
    if (lowerMessage.includes(keyword)) {
      return response
    }
  }

  // Respuesta por defecto
  return userRole === "teacher"
    ? "Como asistente avanzado, estoy aquí para ayudarte con estrategias de enseñanza, evaluación, uso de DiClass y proporcionar información general. ¿Podrías ser más específico con tu pregunta?"
    : "Estoy aquí para ayudarte con tus dudas sobre DiClass, tus estudios y proporcionar información general. ¿Podrías ser más específico con tu pregunta?"
}

// Funciones auxiliares para fechas
function getMonthName(month: number): string {
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]
  return months[month]
}

function getDayName(day: number): string {
  const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
  return days[day]
}

// Función para detectar si es un problema matemático
function isMathProblem(message: string): boolean {
  // Patrones para detectar problemas matemáticos
  const mathPatterns = [
    /\d+\s*[+\-*/]\s*\d+/, // Operaciones básicas: 2 + 3, 5 - 2, etc.
    /\d+\s*[x×]\s*\d+/, // Multiplicación con x: 2 x 3, 5×2, etc.
    /\d+\s*÷\s*\d+/, // División con ÷: 6 ÷ 2, etc.
    /\d*\.?\d+\s*[+\-*/]\s*\d*\.?\d+/, // Operaciones con decimales
    /\d+\s*\^\s*\d+/, // Potencias: 2^3, etc.
    /raíz\s+cuadrada\s+de\s+\d+/, // Raíz cuadrada
    /\d+\s*%\s*de\s*\d+/, // Porcentajes: 20% de 50, etc.
    /resolver\s+.+=.+/, // Ecuaciones: resolver 2x = 6, etc.
    /calcul[a|ar]\s+.+/, // Calcular algo
    /cuánto\s+es\s+.+/, // Cuánto es...
    /resuelve\s+.+/, // Resuelve...
    /\d+x\s*[+-]\s*\d+\s*=\s*\d+/, // Ecuaciones lineales: 3x + 5 = 20
  ]

  return mathPatterns.some((pattern) => pattern.test(message))
}

// Función para resolver problemas matemáticos simples
function solveMathProblem(message: string): string {
  try {
    // Limpiar el mensaje para extraer la expresión matemática
    let expression = message
      .toLowerCase()
      .replace(/[¿?¡!]/g, "")
      .replace(/cuánto es/g, "")
      .replace(/resuelve/g, "")
      .replace(/calcular?/g, "")
      .trim()

    // Manejar ecuaciones lineales simples (ej: 3x + 5 = 20)
    if (/\d+x\s*[+-]\s*\d+\s*=\s*\d+/.test(expression)) {
      return solveLinearEquation(expression)
    }

    // Manejar raíz cuadrada
    if (/raíz\s+cuadrada\s+de\s+\d+/.test(expression)) {
      const num = Number.parseInt(expression.match(/\d+/)?.[0] || "0")
      const result = Math.sqrt(num)
      return `La raíz cuadrada de ${num} es ${result}.`
    }

    // Manejar porcentajes
    if (/\d+\s*%\s*de\s*\d+/.test(expression)) {
      const matches = expression.match(/(\d+)\s*%\s*de\s*(\d+)/)
      if (matches && matches.length >= 3) {
        const percent = Number.parseInt(matches[1])
        const total = Number.parseInt(matches[2])
        const result = (percent / 100) * total
        return `El ${percent}% de ${total} es ${result}.`
      }
    }

    // Reemplazar operadores en texto por símbolos
    expression = expression
      .replace(/multiplicado por|por|x|×/g, "*")
      .replace(/dividido por|entre|÷/g, "/")
      .replace(/más/g, "+")
      .replace(/menos/g, "-")
      .replace(/elevado a|al cuadrado/g, "^")

    // Evaluar expresiones matemáticas simples
    if (/[\d+\-*/$$$$.^]+/.test(expression)) {
      // Manejar potencias (^)
      expression = expression.replace(/(\d+)\s*\^\s*(\d+)/g, (_, base, exp) => {
        return Math.pow(Number.parseFloat(base), Number.parseFloat(exp)).toString()
      })

      // Evaluar la expresión
      // Nota: En una implementación real, usaríamos una biblioteca segura para evaluar expresiones
      const result = Function('"use strict"; return (' + expression + ")")()
      return `El resultado es ${result}.`
    }

    return "Lo siento, no pude resolver este problema matemático. Por favor, intenta expresarlo de otra manera."
  } catch (error) {
    console.error("Error solving math problem:", error)
    return "Lo siento, hubo un error al resolver este problema matemático. Por favor, intenta expresarlo de otra manera."
  }
}

// Función para resolver ecuaciones lineales simples
function solveLinearEquation(equation: string): string {
  try {
    // Extraer coeficientes y término independiente
    const parts = equation.split("=").map((part) => part.trim())
    if (parts.length !== 2) return "No pude entender la ecuación. Por favor, escríbela en formato 'ax + b = c'."

    const leftSide = parts[0]
    const rightSide = parts[1]

    // Extraer coeficiente de x
    const coefficientMatch = leftSide.match(/(-?\d+)x/)
    if (!coefficientMatch) return "No pude identificar el coeficiente de x."
    const coefficient = Number.parseInt(coefficientMatch[1])

    // Extraer término independiente
    const constantMatch = leftSide.match(/x\s*([+-])\s*(\d+)/)
    if (!constantMatch) return "No pude identificar el término independiente."
    const operation = constantMatch[1]
    const constant = Number.parseInt(constantMatch[2])

    // Valor del lado derecho
    const rightValue = Number.parseInt(rightSide)

    // Resolver la ecuación
    let result
    if (operation === "+") {
      // ax + b = c => x = (c - b) / a
      result = (rightValue - constant) / coefficient
    } else {
      // ax - b = c => x = (c + b) / a
      result = (rightValue + constant) / coefficient
    }

    return `Para resolver ${equation}:
1. Despejamos x: ${coefficient}x ${operation} ${constant} = ${rightValue}
2. Pasamos ${constant} al otro lado: ${coefficient}x = ${rightValue} ${operation === "+" ? "-" : "+"} ${constant}
3. Operamos: ${coefficient}x = ${operation === "+" ? rightValue - constant : rightValue + constant}
4. Dividimos por ${coefficient}: x = ${result}

La solución es x = ${result}.`
  } catch (error) {
    console.error("Error solving linear equation:", error)
    return "Lo siento, hubo un error al resolver esta ecuación. Por favor, intenta expresarla de otra manera."
  }
}

// Función para obtener respuestas académicas
function getAcademicResponses() {
  return {
    // Historia
    aztecas:
      "Los aztecas fueron una civilización mesoamericana que floreció en el centro de México entre los siglos XIV y XVI. Fundaron la ciudad de Tenochtitlán (actual Ciudad de México) en 1325. Desarrollaron una sociedad compleja con avances en arquitectura, matemáticas, astronomía y agricultura. Su imperio fue conquistado por los españoles liderados por Hernán Cortés en 1521.",

    mayas:
      "Los mayas fueron una civilización mesoamericana que habitó el sureste de México, Guatemala, Belice, Honduras y El Salvador. Desarrollaron un sistema de escritura jeroglífica, un calendario preciso, avanzados conocimientos matemáticos y astronómicos, y construyeron impresionantes ciudades con pirámides escalonadas. Su período clásico fue entre 250 y 900 d.C.",

    incas:
      "Los incas crearon el imperio más grande de la América precolombina entre los siglos XIII y XVI. Su territorio abarcaba desde Colombia hasta Chile, con capital en Cusco (Perú). Desarrollaron un sistema de caminos de más de 30,000 km, terrazas agrícolas, y una organización social y política muy eficiente. Su imperio cayó ante los conquistadores españoles liderados por Francisco Pizarro en 1532.",

    "revolución francesa":
      "La Revolución Francesa (1789-1799) fue un período de cambios políticos y sociales radicales en Francia que derrocó la monarquía absoluta, estableció una república y culminó con el ascenso de Napoleón Bonaparte. Sus ideales de 'Libertad, Igualdad y Fraternidad' inspiraron movimientos revolucionarios en todo el mundo. Entre sus logros están la Declaración de los Derechos del Hombre y del Ciudadano y la abolición del feudalismo.",

    "revolución industrial":
      "La Revolución Industrial fue un período de transformación económica y social que comenzó en Gran Bretaña a finales del siglo XVIII y se extendió por Europa y América. Se caracterizó por la transición de una economía agraria y artesanal a otra dominada por la industria y la manufactura mecanizada. Introdujo la máquina de vapor, la producción en masa, y cambió radicalmente los patrones de vida y trabajo.",

    "guerra fría":
      "La Guerra Fría (1947-1991) fue un período de tensión geopolítica entre Estados Unidos y la Unión Soviética y sus respectivos aliados. No hubo un conflicto directo entre las superpotencias, pero sí guerras por delegación, competencia armamentística, y rivalidad ideológica entre capitalismo y comunismo. Terminó con la caída del Muro de Berlín (1989) y la disolución de la URSS (1991).",

    // Biología
    fotosíntesis:
      "La fotosíntesis es el proceso mediante el cual las plantas, algas y algunas bacterias convierten la energía luminosa en energía química. Utilizan dióxido de carbono (CO₂) y agua (H₂O) para producir glucosa (C₆H₁₂O₆) y oxígeno (O₂) con ayuda de la luz solar. La ecuación simplificada es: 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂. Este proceso es fundamental para la vida en la Tierra, ya que produce oxígeno y es la base de las cadenas alimenticias.",

    célula:
      "La célula es la unidad estructural y funcional básica de todos los organismos vivos. Existen dos tipos principales: procariotas (sin núcleo definido, como bacterias) y eucariotas (con núcleo y orgánulos membranosos, como células animales y vegetales). Las células contienen material genético (ADN), están rodeadas por una membrana plasmática y realizan todas las funciones vitales como metabolismo, reproducción y respuesta a estímulos.",

    adn: "El ADN (Ácido Desoxirribonucleico) es una molécula que contiene las instrucciones genéticas para el desarrollo, funcionamiento, crecimiento y reproducción de todos los organismos vivos. Tiene estructura de doble hélice formada por nucleótidos que contienen bases nitrogenadas (adenina, timina, guanina y citosina). El ADN se organiza en genes, que son segmentos que codifican proteínas específicas o ARN funcional.",

    "sistema nervioso":
      "El sistema nervioso es una red compleja de órganos y tejidos que coordina las acciones del cuerpo y transmite señales entre sus diferentes partes. Se divide en sistema nervioso central (cerebro y médula espinal) y sistema nervioso periférico (nervios y ganglios). Funciona mediante impulsos eléctricos y neurotransmisores químicos. Es responsable de recibir estímulos, procesarlos y generar respuestas, además de controlar funciones conscientes e inconscientes.",

    // Química
    "tabla periódica":
      "La tabla periódica es un esquema que organiza los elementos químicos según su número atómico, configuración electrónica y propiedades químicas recurrentes. Fue creada por Dmitri Mendeléyev en 1869. Los elementos se organizan en 18 grupos (columnas) y 7 períodos (filas). Los grupos comparten propiedades químicas similares. La tabla moderna contiene 118 elementos, desde el hidrógeno (H) hasta el oganesón (Og), incluyendo elementos naturales y sintéticos.",

    "enlace químico":
      "Un enlace químico es la fuerza que mantiene unidos a los átomos en moléculas o compuestos. Los principales tipos son: enlace iónico (transferencia de electrones entre metales y no metales), enlace covalente (compartición de electrones entre no metales) y enlace metálico (electrones deslocalizados entre átomos metálicos). La naturaleza del enlace determina las propiedades físicas y químicas de las sustancias.",

    "ácidos y bases":
      "Los ácidos son sustancias que donan protones (H⁺) o aceptan electrones, mientras que las bases aceptan protones o donan electrones. Según la teoría de Brønsted-Lowry, un ácido dona protones y una base los acepta. Según la teoría de Lewis, un ácido acepta pares de electrones y una base los dona. El pH mide la acidez o basicidad en una escala de 0 a 14, donde 7 es neutro, menos de 7 es ácido y más de 7 es básico.",

    // Física
    "leyes de newton":
      "Las tres leyes de Newton son principios fundamentales de la física clásica:\n\n1. Ley de inercia: Un cuerpo permanece en reposo o movimiento rectilíneo uniforme a menos que actúe sobre él una fuerza externa.\n\n2. Ley de fuerza: La fuerza es igual a la masa por la aceleración (F = m·a).\n\n3. Ley de acción y reacción: A toda acción le corresponde una reacción igual y opuesta.",

    relatividad:
      "La teoría de la relatividad, desarrollada por Albert Einstein, consta de dos partes:\n\n1. Relatividad Especial (1905): Establece que las leyes de la física son iguales en todos los sistemas de referencia inerciales y que la velocidad de la luz es constante. Introduce la equivalencia entre masa y energía (E = mc²).\n\n2. Relatividad General (1915): Explica la gravedad como una curvatura del espacio-tiempo causada por la masa y la energía. Ha sido confirmada por observaciones como la desviación de la luz por el Sol y las ondas gravitacionales.",

    termodinámica:
      "La termodinámica estudia la energía, el calor y el trabajo, y sus relaciones con la materia. Sus leyes fundamentales son:\n\n1. Primera ley: La energía no se crea ni se destruye, solo se transforma (conservación de la energía).\n\n2. Segunda ley: La entropía del universo siempre aumenta en procesos espontáneos.\n\n3. Tercera ley: Es imposible alcanzar el cero absoluto de temperatura.\n\n4. Ley cero: Si dos sistemas están en equilibrio térmico con un tercero, están en equilibrio térmico entre sí.",

    // Matemáticas
    "teorema de pitágoras":
      "El teorema de Pitágoras establece que en un triángulo rectángulo, el cuadrado de la longitud de la hipotenusa (el lado opuesto al ángulo recto) es igual a la suma de los cuadrados de las longitudes de los otros dos lados (catetos). Se expresa como: a² + b² = c², donde c es la hipotenusa y a y b son los catetos. Este teorema es fundamental en geometría y tiene numerosas aplicaciones en matemáticas, física e ingeniería.",

    derivada:
      "La derivada es un concepto fundamental del cálculo que mide la tasa de cambio instantánea de una función respecto a una variable. Geométricamente, representa la pendiente de la recta tangente a la curva de la función en un punto dado. Se denota como f'(x) o df/dx. Las reglas básicas incluyen la regla del producto, la regla del cociente y la regla de la cadena. Las derivadas son esenciales para optimización, análisis de funciones y modelado de fenómenos físicos.",

    integral:
      "La integral es un concepto del cálculo que representa la acumulación de cantidades infinitesimales. Hay dos tipos principales: la integral definida, que calcula el área bajo una curva entre dos puntos, y la integral indefinida, que es la antiderivada de una función. El Teorema Fundamental del Cálculo establece la relación entre derivadas e integrales. Las integrales son fundamentales en física para calcular trabajo, energía, centros de masa y muchas otras cantidades.",

    // Literatura
    "realismo mágico":
      "El realismo mágico es un género literario que incorpora elementos fantásticos o mágicos en un entorno realista. Surgió en América Latina a mediados del siglo XX y se caracteriza por presentar lo extraordinario como parte de la realidad cotidiana. Gabriel García Márquez con 'Cien años de soledad' es su máximo exponente. Otros autores destacados son Isabel Allende, Jorge Luis Borges y Julio Cortázar. El género explora temas como la identidad cultural, la historia y las tradiciones latinoamericanas.",

    "generación del 98":
      "La Generación del 98 fue un grupo de escritores españoles que reaccionaron críticamente ante la crisis española tras la pérdida de las últimas colonias en 1898. Sus miembros principales fueron Miguel de Unamuno, Pío Baroja, Azorín, Antonio Machado y Ramiro de Maeztu. Se caracterizaron por su preocupación por España, la renovación del lenguaje literario, el individualismo y la introspección. Sus obras reflexionan sobre la identidad nacional, la tradición y la modernización de España.",

    "boom latinoamericano":
      "El Boom latinoamericano fue un fenómeno literario de las décadas de 1960 y 1970 que proyectó internacionalmente la literatura de América Latina. Sus principales representantes fueron Gabriel García Márquez ('Cien años de soledad'), Julio Cortázar ('Rayuela'), Mario Vargas Llosa ('La ciudad y los perros') y Carlos Fuentes ('La muerte de Artemio Cruz'). Se caracterizó por la experimentación narrativa, el realismo mágico, la crítica social y política, y la exploración de la identidad latinoamericana.",

    // Geografía
    "placas tectónicas":
      "La teoría de las placas tectónicas explica que la litosfera terrestre está dividida en grandes placas que flotan sobre la astenosfera y se mueven lentamente. Este movimiento causa terremotos, actividad volcánica y la formación de montañas en los límites de las placas. Existen tres tipos de límites: divergentes (las placas se separan), convergentes (las placas chocan) y transformantes (las placas se deslizan lateralmente). Esta teoría, desarrollada en los años 1960, revolucionó nuestra comprensión de la geología terrestre.",

    "cambio climático":
      "El cambio climático es la variación global del clima de la Tierra debido a causas naturales y, principalmente, a la actividad humana. El aumento de gases de efecto invernadero (CO₂, metano) por la quema de combustibles fósiles, deforestación y ganadería intensiva está elevando la temperatura global. Sus consecuencias incluyen el derretimiento de glaciares, aumento del nivel del mar, eventos climáticos extremos y alteraciones en ecosistemas. El Acuerdo de París (2015) busca limitar el calentamiento global por debajo de 2°C respecto a niveles preindustriales.",

    amazonas:
      "La Amazonía es la selva tropical más grande del mundo, abarcando 6.7 millones de km² principalmente en Brasil, Perú, Colombia y otros países sudamericanos. El río Amazonas, con más de 6,400 km, es el más caudaloso del planeta. Este ecosistema alberga la mayor biodiversidad terrestre: 10% de las especies conocidas, incluyendo 40,000 especies de plantas, 2.5 millones de insectos y miles de aves, mamíferos y peces. Enfrenta graves amenazas por deforestación, minería ilegal, agricultura industrial y cambio climático.",
  }
}
