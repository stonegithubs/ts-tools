import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | newroute', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:newroute');
    assert.ok(route);
  });
});
