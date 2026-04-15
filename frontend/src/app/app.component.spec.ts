import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('AppComponent (Testing)', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, FormsModule, CommonModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ciclo de vida inicial
  });

  it('debe renderizar la vista de Login si NO hay un token seteado', () => {
    component.token = ''; // Estado por defecto
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain('Iniciar Sesión');
  });

  it('debe renderizar y ocultar correctamente la lista de tareas tras una interaccion básica por Token', () => {
    // Simulamos un comportamiento básico tras login
    component.token = 'bearer_fake_token_generado';
    component.tasks = [
      { id: 1, title: 'Prueba Unitaria de Front end', completed: false }
    ];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.task-list li');
    
    // Verificamos que se rompe la vista de login y enseña las tareas (Interactividad 1)
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].textContent).toContain('Prueba Unitaria de Front end');
  });
});
