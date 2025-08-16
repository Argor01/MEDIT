import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  const sqlFilePath = path.resolve(__dirname, '../scripts/seed_data.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Split the SQL into individual statements and execute them
  for (const statement of sql.split(/;\s*$/m).filter(s => s.trim() !== '')) {
    await prisma.$executeRawUnsafe(statement);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
