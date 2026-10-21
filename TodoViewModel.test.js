// Le ViewModel se teste sans navigateur : il ne touche jamais au DOM.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TodoViewModel } from './TodoViewModel.js';

test('ajouter une tâche met à jour la liste et le compteur', () => {
  const vm = new TodoViewModel();
  vm.ajouter('Lire le cours');
  assert.equal(vm.visibles.get().length, 1);
  assert.equal(vm.restantes.get(), 1);
});

test('un titre vide remplit erreur et n’ajoute rien', () => {
  const vm = new TodoViewModel();
  vm.ajouter('   ');
  assert.match(vm.erreur.get(), /obligatoire/);
  assert.equal(vm.visibles.get().length, 0);
  assert.equal(vm.restantes.get(), 0);
});

test('le filtre « faites » ne garde que les tâches cochées', () => {
  const vm = new TodoViewModel();
  vm.ajouter('A');
  vm.ajouter('B');
  vm.basculer(vm.visibles.get()[0].id);
  vm.changerFiltre('faites');
  assert.deepEqual(
    vm.visibles.get().map(t => t.title),
    ['A']
  );
  assert.equal(vm.filtre.get(), 'faites');
});

test('basculer une tâche fait baisser restantes', () => {
  const vm = new TodoViewModel();
  vm.ajouter('A');
  vm.ajouter('B');
  assert.equal(vm.restantes.get(), 2);
  vm.basculer(vm.visibles.get()[0].id);
  assert.equal(vm.restantes.get(), 1);
});

test('un filtre inconnu provoque une erreur', () => {
  const vm = new TodoViewModel();
  vm.changerFiltre('nimporte');
  assert.match(vm.erreur.get(), /inconnu/);
  assert.equal(vm.filtre.get(), 'toutes'); // le filtre courant n'a pas changé
});