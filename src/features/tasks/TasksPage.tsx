import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksRepo } from '../../db/repositories'; // <--- Conexión a DB real
import type { Task } from '../../types';
import Card from '../../ui/components/Card';

export function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar tareas reales al iniciar
  useEffect(() => {
    tasksRepo.getAll().then((data) => {
      setTasks(data);
      setLoading(false);
    });
  }, []);

  const toggleTask = async (task: Task) => {
    // Actualización optimista en la UI
    const updatedTask = { ...task, done: !task.done };
    setTasks(tasks.map(t => t.id === task.id ? updatedTask : t));
    // Guardar en DB
    await tasksRepo.update(updatedTask);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando operaciones...</div>;

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Operaciones</h1>
          <p className="text-sm text-slate-400">Listado de tareas y vencimientos</p>
        </div>
        <Link to="/tasks/new" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500">
          + Nueva
        </Link>
      </header>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-10 text-slate-500 border border-dashed border-slate-800 rounded-xl">
            No hay tareas pendientes. ¡Buen trabajo!
          </div>
        )}
        
        {tasks.map((task) => (
          <Card key={task.id} className={`p-4 flex items-center gap-4 transition-all ${task.done ? 'opacity-50' : 'hover:border-emerald-500/50'}`}>
            <button
              onClick={() => toggleTask(task)}
              className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                task.done ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-slate-600 hover:border-emerald-500'
              }`}
            >
              {task.done && '✓'}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-bold ${task.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                {task.title}
              </h3>
              <div className="flex gap-2 mt-1">
                 {task.priority === 'alta' && <span className="text-[10px] bg-rose-900/50 text-rose-400 px-1.5 py-0.5 rounded uppercase font-bold">Alta</span>}
                 {task.dueDate && <span className="text-[10px] text-slate-500">Vence: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
