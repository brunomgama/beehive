'use client'

import { useState } from 'react'
import { Plus, Check, Circle, MoreVertical, Trash2 } from 'lucide-react'

type Tab = 'notes' | 'todos'

interface Note {
  id: number
  title: string
  content: string
  date: string
  color: string
}

interface Todo {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
}

export function NotesMobile() {
  const [activeTab, setActiveTab] = useState<Tab>('notes')
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Budget Planning', content: 'Review monthly expenses and adjust budget for next quarter', date: 'Nov 28', color: 'from-blue-400 to-blue-600' },
    { id: 2, title: 'Investment Ideas', content: 'Research index funds and dividend stocks for long-term portfolio', date: 'Nov 27', color: 'from-purple-400 to-purple-600' },
    { id: 3, title: 'Savings Goals', content: 'Emergency fund target: $10,000\nVacation fund: $3,000', date: 'Nov 25', color: 'from-green-400 to-green-600' }
  ])

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Pay electricity bill', completed: false, priority: 'high' },
    { id: 2, text: 'Review credit card statement', completed: false, priority: 'high' },
    { id: 3, text: 'Schedule financial advisor meeting', completed: false, priority: 'medium' },
    { id: 4, text: 'Update expense tracker', completed: true, priority: 'medium' },
    { id: 5, text: 'Research new savings account', completed: false, priority: 'low' },
    { id: 6, text: 'Cancel unused subscription', completed: true, priority: 'low' }
  ])

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-orange-500'
      case 'low': return 'border-l-green-500'
      default: return 'border-l-gray-300'
    }
  }

  const incompleteTodos = todos.filter(t => !t.completed)
  const completedTodos = todos.filter(t => t.completed)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32">
      
      {/* Header */}
      <div className="px-6 pt-16 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Notes & Tasks</h1>

        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('notes')}
            className={`py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'notes'
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab('todos')}
            className={`py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'todos'
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            To-Do Lists
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">
        {activeTab === 'notes' ? (
          <div className="space-y-4">
            {notes.map((note) => (
              <div 
                key={note.id}
                className={`bg-gradient-to-br ${note.color} rounded-3xl p-5 text-white shadow-lg`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold">{note.title}</h3>
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <p className="text-sm text-white/90 mb-3 line-clamp-2">{note.content}</p>
                <p className="text-xs text-white/70">{note.date}</p>
              </div>
            ))}

            {/* Add Note Button */}
            <button className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors">
              <Plus size={24} />
              <span className="font-semibold">Add New Note</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Active Tasks */}
            {incompleteTodos.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Active Tasks</h3>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                  {incompleteTodos.map((todo) => (
                    <div 
                      key={todo.id}
                      className={`p-4 flex items-center gap-4 border-l-4 ${getPriorityColor(todo.priority)} first:rounded-t-3xl last:rounded-b-3xl`}
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-gray-900 transition-colors flex-shrink-0"
                      >
                        <Circle size={12} className="text-gray-300" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 flex-1">{todo.text}</span>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTodos.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Completed</h3>
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                  {completedTodos.map((todo) => (
                    <div 
                      key={todo.id}
                      className="p-4 flex items-center gap-4 border-l-4 border-l-gray-200 first:rounded-t-3xl last:rounded-b-3xl opacity-60"
                    >
                      <button 
                        onClick={() => toggleTodo(todo.id)}
                        className="w-6 h-6 bg-green-500 border-2 border-green-500 rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Check size={14} className="text-white" />
                      </button>
                      <span className="text-sm font-medium text-gray-900 line-through flex-1">{todo.text}</span>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add Todo Button */}
            <button className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-center gap-3 text-gray-600 hover:bg-gray-50 transition-colors">
              <Plus size={24} />
              <span className="font-semibold">Add New Task</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-gray-900 rounded-full shadow-lg flex items-center justify-center text-white">
        <Plus size={28} />
      </button>
    </div>
  )
}