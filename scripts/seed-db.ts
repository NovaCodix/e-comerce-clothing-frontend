import { config } from 'dotenv';
import { existsSync } from 'fs';
import { join } from 'path';

// Cargar variables de entorno
config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function seedDatabase() {
  try {
    console.log('🌱 Insertando datos de prueba en Supabase...\n');
    
    // Verificar variables de entorno
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.error('❌ Error: Variables de entorno no configuradas');
      console.error('Primero configura tu archivo .env.local\n');
      process.exit(1);
    }

    console.log('✅ Variables de entorno configuradas\n');
    
    // Verificar que existe el archivo seed
    const seedPath = join(process.cwd(), 'scripts', 'seed.sql');
    
    if (!existsSync(seedPath)) {
      console.error('❌ No se encontró el archivo scripts/seed.sql');
      console.error('Asegúrate de que el archivo existe\n');
      process.exit(1);
    }
    
    console.log('📄 Archivo seed.sql encontrado\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('⚠️  IMPORTANTE: Debes ejecutar el SQL manualmente en Supabase\n');
    console.log('Pasos:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. En el menú izquierdo, haz clic en "SQL Editor"');
    console.log('4. Haz clic en "New Query"');
    console.log('5. Abre el archivo: scripts/seed.sql');
    console.log('6. Copia TODO el contenido (Ctrl+A, Ctrl+C)');
    console.log('7. Pégalo en el editor de Supabase (Ctrl+V)');
    console.log('8. Haz clic en "RUN" (esquina inferior derecha)\n');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('✅ Una vez completado, tu base de datos estará lista!');
    console.log('   Puedes verificar los datos en: Table Editor → products\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedDatabase();
