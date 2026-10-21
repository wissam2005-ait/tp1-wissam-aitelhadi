// CONTROLLER : traduit les actions de la vue en opérations sur le modèle.
// Il mémorise le filtre courant et demande au modèle les données à afficher.
export class TodoController {
  #filtre = 'toutes';

  constructor(model, view) {
    this.model = model;
    this.view = view;

    view.bindAdd(title => {
      try {
        model.add(title);
        view.showError('');
      } catch (e) {
        view.showError(e.message);
      }
    });
    view.bindToggle(id => model.toggle(id));
    view.bindRemove(id => model.remove(id));
    view.bindFilter(nom => {
      try {
        this.#filtre = nom;
        this.#refresh();
        view.showError('');
      } catch (e) {
        view.showError(e.message);
      }
    });

    model.subscribe(() => this.#refresh()); // la vue observe le modèle (via le contrôleur)
  }

  #refresh() {
    const { model, view } = this;
    view.render(model.filtrer(this.#filtre), model.restantes());
    view.showFiltre(this.#filtre);
  }
}