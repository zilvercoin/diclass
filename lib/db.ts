import { neon } from "@neondatabase/serverless"

// Inicializar la conexión a la base de datos
export const sql = neon(process.env.DATABASE_URL!)

// Función para inicializar las tablas de la base de datos
export async function initializeDatabase() {
  try {
    // Verificar si las tablas ya existen
    const tablesExist = await checkTablesExist()

    if (!tablesExist) {
      // Crear las tablas si no existen
      await createTables()
      console.log("Tablas de IA creadas correctamente")

      // Insertar datos iniciales
      await insertInitialData()
      console.log("Datos iniciales insertados correctamente")
    }

    return true
  } catch (error) {
    console.error("Error inicializando la base de datos:", error)
    return false
  }
}

// Verificar si las tablas ya existen
async function checkTablesExist() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'ai_conversations'
      );
    `
    return result[0]?.exists || false
  } catch (error) {
    console.error("Error verificando tablas:", error)
    return false
  }
}

// Crear las tablas necesarias
async function createTables() {
  await sql`
    -- Tabla para almacenar las conversaciones con la IA
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      user_role VARCHAR(50) NOT NULL,
      conversation_id VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla para almacenar los mensajes de cada conversación
    CREATE TABLE IF NOT EXISTS ai_messages (
      id SERIAL PRIMARY KEY,
      conversation_id VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla para almacenar preguntas frecuentes predefinidas
    CREATE TABLE IF NOT EXISTS ai_faqs (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category VARCHAR(100),
      for_role VARCHAR(50) DEFAULT 'both',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla para configuraciones de los asistentes
    CREATE TABLE IF NOT EXISTS ai_assistant_config (
      id SERIAL PRIMARY KEY,
      user_role VARCHAR(50) NOT NULL UNIQUE,
      model VARCHAR(100) NOT NULL,
      temperature DECIMAL(3,2) DEFAULT 0.7,
      max_tokens INTEGER DEFAULT 1000,
      system_prompt TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
}

// Insertar datos iniciales
async function insertInitialData() {
  // Insertar configuraciones iniciales para los asistentes
  await sql`
    INSERT INTO ai_assistant_config (user_role, model, temperature, max_tokens, system_prompt)
    VALUES 
    ('student', 'gpt-4o', 0.7, 800, 'Eres un asistente educativo amigable diseñado para ayudar a estudiantes. Proporciona explicaciones claras y concisas, enfocándote en resolver dudas académicas y ofrecer orientación sobre el uso de la plataforma DiClass. Evita responder preguntas no relacionadas con temas educativos o la plataforma.'),
    ('teacher', 'gpt-4o', 0.7, 1200, 'Eres un asistente educativo avanzado diseñado para profesores. Proporciona respuestas detalladas sobre pedagogía, estrategias de enseñanza, evaluación y uso avanzado de la plataforma DiClass. Puedes ayudar con la creación de materiales didácticos, rúbricas de evaluación y análisis de desempeño estudiantil. Ofrece sugerencias basadas en mejores prácticas educativas.')
    ON CONFLICT (user_role) DO NOTHING;
  `

  // Insertar algunas preguntas frecuentes de ejemplo
  await sql`
    INSERT INTO ai_faqs (question, answer, category, for_role)
    VALUES 
    ('¿Cómo puedo unirme a una clase?', 'Para unirte a una clase, ve a tu Dashboard y haz clic en el botón "Unirse a una clase". Luego, ingresa el código de clase proporcionado por tu profesor.', 'Uso de plataforma', 'student'),
    ('¿Cómo puedo crear una tarea?', 'Para crear una tarea, ve a la página de tu clase, selecciona la pestaña "Trabajo en clase" y haz clic en el botón "Crear". Completa el formulario con los detalles de la tarea y haz clic en "Crear".', 'Uso de plataforma', 'teacher'),
    ('¿Cómo puedo ver mis calificaciones?', 'Para ver tus calificaciones, ve a la página de tu clase y selecciona la pestaña "Calificaciones". Allí verás todas tus tareas calificadas y tu promedio general.', 'Calificaciones', 'student'),
    ('¿Cómo puedo descargar las entregas de mis estudiantes?', 'Para descargar las entregas, ve a la página de la tarea específica y en la sección de entregas de estudiantes, encontrarás los archivos adjuntos que puedes descargar haciendo clic en ellos.', 'Gestión de tareas', 'teacher')
    ON CONFLICT DO NOTHING;
  `
}
