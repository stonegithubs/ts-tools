import Component from '@ember/component';

export default class SomeInput extends Component.extend({
  // anything which *must* be merged to prototype here
  // init() {
  //   this._super(...arguments);
  // }
}) {
  // normal class body definition here
  constructor(){
    super(...arguments);
  }
};
