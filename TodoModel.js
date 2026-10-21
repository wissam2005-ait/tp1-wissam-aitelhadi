// MODEL : données + règles métier. Ne connaît ni la vue ni le contrôleur.
export class TodoModel {
  #todos = [];
  #listeners = [];

  add(title) {
    const clean = title.trim();
    if (!clean) throw new Error('Le titre est obligatoire');
    this.#todos.push({ id: crypto.randomUUID(), title: clean, done: false });
    this.#notify();
  }
  toggle(id) {
    const todo = this.#todos.find(t => t.id === id);
    if (todo) {
      todo.done = !todo.done;
      this.#notify();
    }
  }
  remove(id) {
    this.#todos = this.#todos.filter(t => t.id !== id);
    this.#notify();
  }
  all() {
    return this.#todos.map(t => ({ ...t }));
  } // copie défensive
    // Renvoie une copie filtrée : 'toutes' | 'faites' | 'a-faire'.
  filtrer(nom) {
    switch (nom) {
      case 'toutes':
        return this.all();
      case 'faites':
        return this.all().filter(t => t.done);
      case 'a-faire':
        return this.all().filter(t => !t.done);
      default:
        throw new Error(`Filtre inconnu : ${nom}`);
    }
  }
  // Nombre total de tâches non faites (indépendant du filtre affiché).
  restantes() {
    return this.#todos.filter(t => !t.done).length;
  }

  subscribe(fn) {
    this.#listeners.push(fn);
    fn(this.all());
  }
  #notify() {
    this.#listeners.forEach(fn => fn(this.all()));
  }
}

