import { TodoAppService } from './todo-app.service';
import {
	AngularFirestoreModule,
	AngularFirestore,
	AngularFirestoreCollection
} from 'angularfire2/firestore';
import { Todo } from './todo.interface';
import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.css' ]
})
export class AppComponent {
	// Array de Tareas para  manejo de datos.
	todos: Todo[];
	// Array de Tareas Activas
	actives: Todo[];
	total: number;
	item: string;
	constructor(private service: TodoAppService) {
		service.getTodos().subscribe((content) => {
			this.todos = content;
			this.actives = this.todos.filter((todo) => todo.status === 'Active');
			this.total = this.actives.length;
			if (this.total === 0) {
				this.item = '';
			} else if (this.total === 1) {
				this.item = this.total + ' item left';
			} else {
				this.item = this.total + ' items left';
			}
		});
	}
	/**
	 * Metodo que envia al servicio el nombre de la tarea
	 * y así agregarla a la BD.
	 * @param nameTwo Nombre de la tarea.
	 */
	addToTodos(nameTwo: HTMLInputElement) {
		if (nameTwo.value !== '') {
			this.service.addToTodos(nameTwo.value);
			nameTwo.value = '';
		}
	}
	/**
	 * Metodo que envia al servicio el id y el estado
	 * de una tarea para que lo edite.
	 * @param event Evento de check.
	 * @param id Identificador de la tarea.
	 * @param status Estado de la tarea a cambiar.
	 */
	changeToStatus(event, id: string, status: string) {
		if (event.target.checked) {
			this.service.changeToStatus(id, status);
		} else {
			this.service.changeToStatus(id, status);
		}
	}
	/**
	 * Metodo que permite enviar el id al servicio
	 * y este lo eliminara.
	 * @param id Identificador de la tarea.
	 */
	deleteTodo(id: string) {
		this.service.deleteTodo(id);
	}
	/**
	 * Metodo que permite filtrar al Array de tareas
	 * y así obtener las tareas especificas dependiendo
	 * del estado que se envie.
	 * @param status Estado de la tarea.
	 */
	changeTable(status: string) {
		this.todos = [];
		this.service.getTodos().subscribe((content) => {
			this.todos = content;
			if (status === 'actives') {
				this.todos = this.todos.filter((todo) => todo.status === 'Active');
			} else if (status === 'completes') {
				this.todos = this.todos.filter((todo) => todo.status === 'Complete');
			} else if (status === 'showAll') {
				this.service.getTodos();
			}
		});
	}
	/**
	 * Metodo que emvia al servicio, un array de tareas
	 * ya filtradas para que estas sean eliminadas.
	 */
	clearCompletes() {
		this.service.getTodos().subscribe((content) => {
			this.todos = content;
		});
		this.todos = this.todos.filter((todo) => todo.status === 'Complete');
		this.service.clearCompletes(this.todos);
	}
	/**
	 * Metodo que permite enviar el array de tareas
	 * para que este sea recorrido y asi cambiar el estado
	 * de las tareas a "Complete" o a "Actives".
	 */
	changeToCompletes(event) {
		if (event.target.checked) {
			this.service.changeToCompletes(this.todos, 'Complete');
		} else {
			this.service.changeToCompletes(this.todos, 'Active');
		}
	}
}
