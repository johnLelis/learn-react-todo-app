const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function seedDatabase() {
  console.log('🌱 Seeding database with sample data...');

  try {
    const db = await open({
      filename: './todos.db',
      driver: sqlite3.Database,
    });

    // Clear existing data
    await db.run('DELETE FROM todos');

    // Sample todos with variety
    const sampleTodos = [
      {
        text: 'Learn React 19 form Actions - the biggest game-changer!',
        description:
          'Deep dive into React 19 form actions and server-driven UI',
        completed: 0,
        priority: 'high',
        category: 'learning',
        due_date: '2025-09-15',
      },
      {
        text: 'Master useFormStatus hook for loading states',
        description: 'Experiment with pending UI and async validation',
        completed: 0,
        priority: 'high',
        category: 'learning',
        due_date: '2025-09-20',
      },
      {
        text: 'Implement useOptimistic for immediate UI feedback',
        description: 'Ensure smooth optimistic updates in the task list',
        completed: 0,
        priority: 'high',
        category: 'learning',
        due_date: '2025-09-25',
      },
      {
        text: 'Set up development environment',
        description: 'Configure Vite, ESLint, Prettier, and TypeScript',
        completed: 1,
        priority: 'medium',
        category: 'setup',
        due_date: '2025-08-30',
      },
      {
        text: 'Build progressive enhancement with form Actions',
        description: 'Enhance fallback form submissions',
        completed: 0,
        priority: 'medium',
        category: 'learning',
        due_date: '2025-09-28',
      },
      {
        text: 'Add server-side validation patterns',
        description: 'Improve input validation in Express API',
        completed: 0,
        priority: 'medium',
        category: 'backend',
        due_date: '2025-09-12',
      },
      {
        text: 'Implement real-time collaboration features',
        description: 'Use WebSockets or WebRTC for shared editing',
        completed: 0,
        priority: 'low',
        category: 'features',
        due_date: '2025-10-05',
      },
      {
        text: 'Write comprehensive tests',
        description: 'Add unit, integration, and end-to-end tests',
        completed: 0,
        priority: 'medium',
        category: 'testing',
        due_date: '2025-09-18',
      },
      {
        text: 'Deploy to production',
        description: 'CI/CD pipeline with Azure or Vercel',
        completed: 0,
        priority: 'low',
        category: 'deployment',
        due_date: '2025-09-30',
      },
      {
        text: 'Document React 19 learnings',
        description: 'Write internal documentation for the team',
        completed: 0,
        priority: 'low',
        category: 'documentation',
        due_date: '2025-10-10',
      },
    ];

    // Insert sample data
    const stmt = await db.prepare(`
      INSERT INTO todos (text, description, completed, priority, category, due_date) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const todo of sampleTodos) {
      await stmt.run([
        todo.text,
        todo.description,
        todo.completed,
        todo.priority,
        todo.category,
        todo.due_date,
      ]);
    }

    await stmt.finalize();
    await db.close();

    console.log(
      `✅ Database seeded successfully with ${sampleTodos.length} todos`
    );
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
