import { Todo } from './todo.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class TodoAppService {
	constructor(private db: AngularFirestore) {}
	/**
	 * Metodo que retorna un array con todos los datos de
	 * la BD.
	 */
	getTodos() {
		return this.db.collection<Todo>('Todos').valueChanges();
	}
	/**
	 * Metodo que agrega una tarea en la BD enviando un id
	 * que se genera con la funcion createId() y con el nombre
	 * que llega por parametro y se le envia por defecto el
	 * estado "Active".
	 * @param name Nombre de la tarea.
	 */
	addToTodos(name: string) {
		if (name !== '') {
			const id = this.db.createId();
			const status = 'Active';
			this.db.collection('Todos').doc(id).set({ id, name, status });
		}
	}
	/**
	 * Metodo que busca en la BD la tarea con el id que
	 * llego por parametro y cuando lo encuentra, le actualiza
	 * el estado por el que estado que llega por parametro (status).
	 * @param id Identificador de la tarea.
	 * @param status Estado que se actualizara en la tarea.
	 */
	changeToStatus(id: string, status: string) {
		this.db.collection('Todos').doc(id).update({ status });
	}
	/**
	 * Metodo que elimina de la BD una tarea que tenga
	 * el id que llega por parametro.
	 * @param id Identificador de la tarea.
	 */
	deleteTodo(id: string) {
		this.db.collection('Todos').doc(id).delete();
	}
	/**
	 * Metodo que recorre el array que llego por parametro, y a cada
	 * uno lo elimina de la BD.
	 * @param to Array de tareas que tienen el estado "Complete".
	 */
	clearCompletes(to: Todo[]) {
		for (const todoo of to) {
			this.db.collection('Todos').doc(todoo.id).delete();
		}
	}
	/**
	 * Metodo que recorre el array que llega por parametro, y a cada
	 * uno le actualiza el estado actual por el estado que llega por
	 * parametro.
	 * @param to Array de todas las tareas.
	 * @param status Estado por el cual se actualizara.
	 */
	changeToCompletes(to: Todo[], status: string) {
		for (const todoo of to) {
			this.db.collection('Todos').doc(todoo.id).update({ status });
		}
	}
}
