const fs = require('fs');
const path = require('path');

function resetDatabase() {
  const dbPath = path.join(__dirname, '..', 'todos.db');

  try {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Database file deleted');
    } else {
      console.log('ℹ️  Database file does not exist');
    }

    console.log(
      '🔄 Database reset complete. Run npm run dev to create a fresh database.'
    );
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
