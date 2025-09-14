// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

// Database setup
let db = null;

async function initializeDatabase() {
  try {
    // Open SQLite database
    db = await open({
      filename: './todos.db',
      driver: sqlite3.Database,
    });

    // Create todos table if it doesn't exist
    await db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL CHECK(length(text) > 0 AND length(text) <= 500),
    description TEXT DEFAULT '',
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    category TEXT DEFAULT 'general',
    due_date DATE
  )
`);

    // Create index for better performance
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_created_at ON todos(created_at);
    `);

    console.log('✅ Database initialized successfully');

    // Insert some sample data if table is empty
    const count = await db.get('SELECT COUNT(*) as count FROM todos');
    if (count.count === 0) {
      await insertSampleData();
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

async function insertSampleData() {
  const sampleTodos = [
    { text: 'Learn React 19 form Actions', completed: 0, priority: 'high' },
    {
      text: 'Set up development environment',
      completed: 1,
      priority: 'medium',
    },
    { text: 'Implement useOptimistic hook', completed: 0, priority: 'high' },
    { text: 'Master useFormStatus hook', completed: 0, priority: 'medium' },
    {
      text: 'Build todo app with Server Actions',
      completed: 0,
      priority: 'high',
    },
  ];

  for (const todo of sampleTodos) {
    await db.run(
      'INSERT INTO todos (text, completed, priority) VALUES (?, ?, ?)',
      [todo.text, todo.completed, todo.priority]
    );
  }
  console.log('✅ Sample data inserted');
}

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware for validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      message: 'Validation failed',
    });
  }
  next();
};

// Validation rules
const todoValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .escape(),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .escape(),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters')
    .escape(),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
];

const updateTodoValidation = [
  body('text')
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Todo text must be between 1 and 500 characters')
    .escape(),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters')
    .escape(),
];

// Routes

// GET /api/todos - Get all todos with filtering and sorting
app.get('/api/todos', async (req, res) => {
  try {
    const {
      filter = 'all',
      sort = 'created_at',
      order = 'desc',
      category,
      priority,
      search,
      limit = 100,
      offset = 0,
    } = req.query;

    let query = 'SELECT * FROM todos WHERE 1=1';
    const params = [];

    // Apply filters
    if (filter === 'active') {
      query += ' AND completed = 0';
    } else if (filter === 'completed') {
      query += ' AND completed = 1';
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (priority && priority !== 'all') {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND text LIKE ?';
      params.push(`%${search}%`);
    }

    // Apply sorting
    const validSorts = ['created_at', 'updated_at', 'text', 'priority'];
    const validOrders = ['asc', 'desc'];

    if (validSorts.includes(sort)) {
      if (sort === 'priority') {
        query += `
      ORDER BY CASE priority
        WHEN 'high' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
        ELSE 4
      END ASC
    `;
      } else if (validOrders.includes(order.toLowerCase())) {
        query += ` ORDER BY ${sort} ${order.toUpperCase()}`;
      } else {
        query += ` ORDER BY ${sort} DESC`;
      }
    } else {
      query += ' ORDER BY created_at DESC';
    }

    // Apply pagination
    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const todos = await db.all(query, params);

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM todos WHERE 1=1';
    const countParams = [];

    if (filter === 'active') {
      countQuery += ' AND completed = 0';
    } else if (filter === 'completed') {
      countQuery += ' AND completed = 1';
    }

    if (category && category !== 'all') {
      countQuery += ' AND category = ?';
      countParams.push(category);
    }

    if (priority && priority !== 'all') {
      countQuery += ' AND priority = ?';
      countParams.push(priority);
    }

    if (search) {
      countQuery += ' AND text LIKE ?';
      countParams.push(`%${search}%`);
    }

    const { total } = await db.get(countQuery, countParams);

    // Get statistics
    const stats = await db.all(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN completed = 0 THEN 1 ELSE 0 END) as active,
        COUNT(DISTINCT category) as categories
      FROM todos
    `);

    res.json({
      success: true,
      data: todos,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total,
      },
      stats: stats[0],
      filters: {
        filter,
        category,
        priority,
        search,
        sort,
        order,
      },
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// GET /api/todos/:id - Get specific todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID',
      });
    }

    const todo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      data: todo,
    });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch todo',
    });
  }
});

// POST /api/todos - Create new todo (React 19 form action compatible)
app.post(
  '/api/todos',
  todoValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const {
        title,
        priority = 'medium',
        category = 'general',
        description = '',
        dueDate = null,
      } = req.body;

      const result = await db.run(
        `INSERT INTO todos (text, description, priority, category, due_date) 
       VALUES (?, ?, ?, ?, ?)`,
        [title, description, priority, category, dueDate]
      );

      const newTodo = await db.get('SELECT * FROM todos WHERE id = ?', [
        result.lastID,
      ]);

      if (req.accepts(['json', 'html']) === 'json') {
        res.status(201).json({
          success: true,
          message: 'Todo created successfully',
          data: newTodo,
        });
      } else {
        res.redirect('/');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to create todo' });
    }
  }
);

// PUT /api/todos/:id - Update todo
app.put(
  '/api/todos/:id',
  updateTodoValidation,
  handleValidationErrors,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, priority, category, dueDate, completed } =
        req.body;

      const todo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
      if (!todo) {
        return res
          .status(404)
          .json({ success: false, message: 'Todo not found' });
      }

      await db.run(
        `UPDATE todos 
       SET text = COALESCE(?, text),
           description = COALESCE(?, description),
           priority = COALESCE(?, priority),
           category = COALESCE(?, category),
           due_date = COALESCE(?, due_date),
           completed = COALESCE(?, completed),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
        [title, description, priority, category, dueDate, completed, id]
      );

      const updated = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
      res.json({ success: true, data: updated });
    } catch (error) {
      console.error('Error updating todo:', error);
      res
        .status(500)
        .json({ success: false, message: 'Failed to update todo' });
    }
  }
);

// PATCH /api/todos/:id/toggle - Toggle todo completion (optimized for frequent updates)
app.patch('/api/todos/:id/toggle', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID',
      });
    }

    const result = await db.run(
      'UPDATE todos SET completed = NOT completed, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    const updatedTodo = await db.get('SELECT * FROM todos WHERE id = ?', [id]);

    res.json({
      success: true,
      message: `Todo ${updatedTodo.completed ? 'completed' : 'reopened'}`,
      data: updatedTodo,
    });
  } catch (error) {
    console.error('Error toggling todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle todo',
    });
  }
});

// DELETE /api/todos/:id - Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid todo ID',
      });
    }

    const result = await db.run('DELETE FROM todos WHERE id = ?', [id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found',
      });
    }

    res.json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete todo',
    });
  }
});

// POST /api/todos/bulk - Bulk operations
app.post('/api/todos/bulk', async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (!action || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk operation parameters',
      });
    }

    const placeholders = ids.map(() => '?').join(',');
    let result;

    switch (action) {
      case 'delete':
        result = await db.run(
          `DELETE FROM todos WHERE id IN (${placeholders})`,
          ids
        );
        break;
      case 'complete':
        result = await db.run(
          `UPDATE todos SET completed = 1, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`,
          ids
        );
        break;
      case 'reopen':
        result = await db.run(
          `UPDATE todos SET completed = 0, updated_at = CURRENT_TIMESTAMP WHERE id IN (${placeholders})`,
          ids
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid bulk action',
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed`,
      affected: result.changes,
    });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed',
    });
  }
});

// GET /api/categories - Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await db.all(
      'SELECT DISTINCT category, COUNT(*) as count FROM todos GROUP BY category ORDER BY category'
    );

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    database: db ? 'connected' : 'disconnected',
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Shutting down server...');
  if (db) {
    await db.close();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, shutting down...');
  if (db) {
    await db.close();
  }
  process.exit(0);
});

function listEndpoints(app) {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      // Route middleware
      const methods = Object.keys(middleware.route.methods)
        .map(m => m.toUpperCase())
        .join(', ');
      routes.push({ path: middleware.route.path, methods });
    } else if (middleware.name === 'router') {
      // Router middleware
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods)
            .map(m => m.toUpperCase())
            .join(', ');
          routes.push({ path: handler.route.path, methods });
        }
      });
    }
  });
  return routes;
}

// Start server
async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`\n🚀 Todo API Server running on port ${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health\n`);

      // Log all endpoints
      console.log('📌 Available Endpoints:');
      const routes = listEndpoints(app);
      routes.forEach(r => {
        console.log(`   [${r.methods}] http://localhost:${PORT}${r.path}`);
      });
      console.log('\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
