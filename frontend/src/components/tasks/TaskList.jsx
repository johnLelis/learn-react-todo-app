import { useContext } from 'react';
import { GlobalTodosContext } from '../../context/GlobalTodosContext';
import { formatDate, getDaysSince } from '../../utils/dateUtils';
import { capitalizeFirstLetter } from '../../utils/stringUtils';
import EmptyTask from './EmptyTask';

const TaskList = () => {
  const { activeFilter, allTodos, filteredTodos } =
    useContext(GlobalTodosContext);

  const priorityCircle = {
    high: '🔴',
    medium: '🟡',
    low: '🟢',
  };

  const displayData = todos => {
    return todos.map(
      ({
        id,
        text,
        description,
        completed,
        created_at: createdAt,
        priority,
        category,
        due_date: dueDate,
      }) => {
        const pastDays = getDaysSince(createdAt);
        return (
          <li key={id} className={`task-item priority-${priority}`}>
            <div className="task-content">
              <div className="task-header">
                <div className="task-checkbox" role="button" tabIndex="0"></div>
                <div className="task-main">
                  <h3 className="task-title">{text}</h3>
                  <p className="task-description">{description}</p>
                  <div className="task-meta">
                    <span className="meta-item">
                      {capitalizeFirstLetter(category)}
                    </span>
                    <span className={`priority-badge priority-${priority}`}>
                      {`${priorityCircle[priority]} ${priority} Priority`}
                    </span>
                    {completed !== 0 && (
                      <span className="meta-item">✅ Completed</span>
                    )}
                    {dueDate && (
                      <span className="meta-item">
                        🗓️ {formatDate(dueDate)}
                      </span>
                    )}
                    <span className="meta-item">
                      {`🕒 Created ${
                        pastDays === 0 ? 'Today' : `${pastDays} days ago`
                      }`}
                    </span>
                  </div>
                </div>
                <div className="task-actions">
                  <button className="task-btn edit-btn">✏️ Edit</button>
                  <button className="task-btn delete-btn">🗑️ Delete</button>
                </div>
              </div>
            </div>
          </li>
        );
      }
    );
  };

  return (
    <ul className="task-list" id="taskList">
      {activeFilter === 'all' && allTodos.length > 0 ? (
        displayData(allTodos)
      ) : filteredTodos?.length > 0 ? (
        displayData(filteredTodos)
      ) : (
        <EmptyTask />
      )}
    </ul>
  );
};

export default TaskList;

//  <li className="task-item priority-medium completed" data-id="2">
//         <div className="task-content">
//           <div className="task-header">
//             <div
//               className="task-checkbox checked"
//               role="button"
//               tabIndex="0"
//             ></div>
//             <div className="task-main">
//               <h3 className="task-title">
//                 Set up Modern Development Environment
//               </h3>
//               <p className="task-description">
//                 Configure Vite, ESLint, Prettier, and TypeScript for optimal
//                 React development experience.
//               </p>
//               <div className="task-meta">
//                 <span className="meta-item">⚙️ Setup</span>
//                 <span className="priority-badge priority-medium">
//                   Medium Priority
//                 </span>
//                 <span className="meta-item">✅ Completed</span>
//               </div>
//             </div>
//             <div className="task-actions">
//               <button className="task-btn edit-btn">✏️ Edit</button>
//               <button className="task-btn delete-btn">🗑️ Delete</button>
//             </div>
//           </div>
//         </div>
//       </li>

//       <li className="task-item priority-low" data-id="3">
//         <div className="task-content">
//           <div className="task-header">
//             <div className="task-checkbox" role="button" tabIndex="0"></div>
//             <div className="task-main">
//               <h3 className="task-title">Implement Optimistic Updates</h3>
//               <p className="task-description">
//                 Add useOptimistic hook for better user experience during form
//                 submissions.
//               </p>
//               <div className="task-meta">
//                 <span className="meta-item">💻 Development</span>
//                 <span className="priority-badge priority-low">
//                   Low Priority
//                 </span>
//                 <span className="meta-item">📅 Dec 20, 2024</span>
//               </div>
//             </div>
//             <div className="task-actions">
//               <button className="task-btn edit-btn">✏️ Edit</button>
//               <button className="task-btn delete-btn">🗑️ Delete</button>
//             </div>
//           </div>
//         </div>
//       </li>
