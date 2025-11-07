import { config } from 'dotenv';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Cargar variables de entorno
config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function setupDatabase() {
  try {
    console.log('🚀 Configurando base de datos en Supabase...\n');
    
    // Verificar variables de entorno
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ Error: Variables de entorno no configuradas\n');
      console.error('Pasos para configurar:');
      console.error('1. Copia el archivo .env.example a .env.local');
      console.error('2. Ve a https://supabase.com/dashboard');
      console.error('3. Selecciona tu proyecto (o crea uno nuevo)');
      console.error('4. Ve a Settings → API');
      console.error('5. Copia el Project URL y el anon/public key');
      console.error('6. Pégalos en tu archivo .env.local\n');
      process.exit(1);
    }

    console.log('✅ Variables de entorno configuradas');
    console.log(`📍 URL: ${SUPABASE_URL}\n`);
    
    // Verificar que existe el archivo schema
    const schemaPath = join(process.cwd(), 'scripts', 'schema.sql');
    
    if (!existsSync(schemaPath)) {
      console.error('❌ No se encontró el archivo scripts/schema.sql');
      console.error('Asegúrate de que el archivo existe\n');
      process.exit(1);
    }
    
    console.log('📄 Archivo schema.sql encontrado\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANTE: Debes ejecutar el SQL manualmente en Supabase\n');
    console.log('Pasos:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. En el menú izquierdo, haz clic en "SQL Editor"');
    console.log('4. Haz clic en "New Query"');
    console.log('5. Abre el archivo: scripts/schema.sql');
    console.log('6. Copia TODO el contenido (Ctrl+A, Ctrl+C)');
    console.log('7. Pégalo en el editor de Supabase (Ctrl+V)');
    console.log('8. Haz clic en "RUN" (esquina inferior derecha)\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('✅ Una vez completado, ejecuta: pnpm db:seed');
    console.log('   para insertar datos de prueba\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setupDatabase();
