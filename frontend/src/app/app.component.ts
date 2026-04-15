import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>Gestor de Tareas</h1>
      
      <!-- Login Section -->
      <div *ngIf="!token" class="card">
        <h2>Iniciar Sesión</h2>
        <input type="email" [(ngModel)]="email" placeholder="Email" />
        <input type="password" [(ngModel)]="password" placeholder="Contraseña" />
        <button (click)="login()">Login</button>
        <p *ngIf="loginError" class="error">{{loginError}}</p>
      </div>

      <!-- Tasks Section -->
      <div *ngIf="token" class="card">
        <button (click)="logout()" class="logout-btn">Cerrar Sesión</button>
        <h2>Mis Tareas</h2>
        
        <div class="new-task">
          <input type="text" [(ngModel)]="newTaskTitle" placeholder="Nueva tarea..." />
          <button (click)="createTask()">Agregar</button>
        </div>

        <ul class="task-list" *ngIf="tasks.length > 0">
          <li *ngIf="tasks.length === 0">Sin tareas pendientes.</li>
          <li *ngFor="let task of tasks" [class.completed]="task.completed">
            <span class="title">
              {{task.title}} 
            </span>
            <div class="actions">
              <button *ngIf="!task.completed" (click)="toggleComplete(task)">Completar</button>
              <button class="delete-btn" (click)="deleteTask(task.id)">Eliminar</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 40px auto; font-family: -apple-system, sans-serif; }
    .card { padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: #f9f9f9; }
    h1, h2 { text-align: center; color: #333; }
    input { display: block; width: 100%; margin-bottom: 10px; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; }
    button:hover { background: #0056b3; }
    .logout-btn { background: #dc3545; float: right; padding: 5px 10px; }
    .delete-btn { background: #dc3545; margin-left: 10px; }
    .delete-btn:hover, .logout-btn:hover { background: #a71d2a; }
    .task-list { list-style: none; padding: 0; background: white; border-radius: 4px; border: 1px solid #ddd; }
    .task-list li { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
    .task-list li:last-child { border-bottom: none; }
    .completed .title { text-decoration: line-through; color: #888; }
    .error { color: red; text-align:center; margin-top: 10px; }
    .new-task { display: flex; gap: 10px; margin-bottom: 20px; }
    .new-task input { margin-bottom: 0; }
  `]
})
export class AppComponent implements OnInit {
  token = '';
  // Se pone el correo de pruebas estándar que creaste en tu DB local hace poco
  email = 'test@test.com'; 
  password = 'password123'; 
  loginError = '';
  
  tasks: any[] = [];
  newTaskTitle = '';
  
  apiUrl = 'http://localhost:3000'; // Tu backend local de Nest.js

  ngOnInit() {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      this.token = savedToken;
      this.loadTasks();
    }
  }

  async login() {
    try {
      const response = await fetch(`${this.apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: this.email, password: this.password })
      });
      if (!response.ok) throw new Error('Credenciales inválidas');
      
      const data = await response.json();
      this.token = data.access_token;
      localStorage.setItem('token', this.token);
      this.loginError = '';
      this.loadTasks();
    } catch (e: any) {
      this.loginError = e.message || 'Error de conexión';
      this.logout();
    }
  }

  logout() {
    this.token = '';
    this.tasks = [];
    localStorage.removeItem('token');
  }

  async loadTasks() {
    try {
      const response = await fetch(`${this.apiUrl}/tasks`, {
        headers: { 'Authorization': `Bearer ${this.token}` }
      });
      if (response.ok) {
        this.tasks = await response.json();
      } else if (response.status === 401) {
        this.logout();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async createTask() {
    if (!this.newTaskTitle.trim()) return;
    
    const response = await fetch(`${this.apiUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ title: this.newTaskTitle })
    });
    
    if (response.ok) {
      const newTask = await response.json();
      this.tasks.push(newTask);
      this.newTaskTitle = '';
    }
  }

  async toggleComplete(task: any) {
    if (task.completed) return; // Prevent toggling back assuming it stays completed
    
    const response = await fetch(`${this.apiUrl}/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ completed: true })
    });
    
    if (response.ok) {
      task.completed = true;
    }
  }

  async deleteTask(id: number) {
    const response = await fetch(`${this.apiUrl}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    
    if (response.ok) {
      // Actualiza la lista ignorando el objeto con el ID eliminado
      this.tasks = this.tasks.filter(t => t.id !== id);
    }
  }
}
