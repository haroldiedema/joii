/* Javascript Object Inheritance Implementation                ______  ________
 * (c) 2016 <harold@iedema.me>                             __ / / __ \/  _/  _/
 * Licensed under MIT.                                    / // / /_/ // /_/ /
 * ------------------------------------------------------ \___/\____/___/__*/
var JOII = require('../../dist/joii').JOII;

/**
 * Tests a method call in a 'middle' class.
 */
test('IssueReports:IssueReport19', function(assert) {
    var A = JOII.ClassBuilder({
        'public function f1': function() {},
        'public function type': function() {
            return 'A';
        },
        'public function f2': function() {
            this.f1();
            return this.type();
        }
    });
    var B = JOII.ClassBuilder({'extends': A}, {
        'public function type': function() {
            return this.anotherMethod();
        },
        'public function anotherMethod': function() {
            return 'B';
        }
    });
    var C = JOII.ClassBuilder({'extends': B}, {
    });

    var b = new B();
    var c = new C();

    assert.equal(b.f2(), 'B');
    assert.equal(c.f2(), 'B');  // Error happens here, it actually returns 'A'

    // Harold: We need to go deeper!
    var DeepA = JOII.ClassBuilder('A', { 'public number a': 1 }),
        DeepB = JOII.ClassBuilder('B', {extends: DeepA}, { 'public number b': 2 }),
        DeepC = JOII.ClassBuilder('C', {extends: DeepB}, { 'public number c': 3 }),
        DeepD = JOII.ClassBuilder('D', {extends: DeepC}, { 'public number d': 4 }),
        DeepE = JOII.ClassBuilder('E', {extends: DeepD}, { 'public number e': 5 }),
        DeepF = JOII.ClassBuilder('F', {extends: DeepE}, { 'public number f': 6 }),
        DeepG = JOII.ClassBuilder('G', {extends: DeepF}, { 'public number g': 7 }),
        DeepH = JOII.ClassBuilder('H', {extends: DeepG}, { 'public number h': 8 }),
        DeepI = JOII.ClassBuilder('I', {extends: DeepH}, { 'public number i': 9 }),
        DeepJ = JOII.ClassBuilder('J', {extends: DeepI}, { 'public number j': 10 }),
        DeepK = JOII.ClassBuilder('K', {extends: DeepJ}, { 'public number k': 11 });

    var a = new DeepA(), b = new DeepB(), c = new DeepC(), d = new DeepD(),
        e = new DeepE(), f = new DeepF(), g = new DeepG(), h = new DeepH(),
        i = new DeepI(), j = new DeepJ(), k = new DeepK();

    assert.ok(k.instanceOf(DeepA));
    assert.ok(k.instanceOf(DeepB));
    assert.ok(k.instanceOf(DeepC));
    assert.ok(k.instanceOf(DeepD));
    assert.ok(k.instanceOf(DeepE));
    assert.ok(k.instanceOf(DeepF));
    assert.ok(k.instanceOf(DeepG));
    assert.ok(k.instanceOf(DeepH));
    assert.ok(k.instanceOf(DeepI));
    assert.ok(k.instanceOf(DeepJ));
    assert.ok(k.instanceOf(DeepK));

    assert.ok(! f.instanceOf(DeepK));
    assert.ok(f.instanceOf(DeepA));
    assert.ok(f.instanceOf(DeepB));
    assert.ok(f.instanceOf(DeepC));
    assert.ok(f.instanceOf(DeepD));
    assert.ok(f.instanceOf(DeepE));
    assert.ok(f.instanceOf(DeepF));
    assert.ok(! f.instanceOf(DeepG));
    assert.ok(! f.instanceOf(DeepH));
    assert.ok(! f.instanceOf(DeepI));
    assert.ok(! f.instanceOf(DeepJ));

    assert.equal(a.getA(), 1);
    assert.equal(b.getA() + b.getB(), 3);
    assert.equal(c.getA() + c.getB() + c.getC(), 6);
    assert.equal(d.getA() + d.getB() + d.getC() + d.getD(), 10);
    assert.equal(e.getA() + e.getB() + e.getC() + e.getD() + e.getE(), 15);
    assert.equal(f.getA() + f.getB() + f.getC() + f.getD() + f.getE() + f.getF(), 21);
    assert.equal(g.getA() + g.getB() + g.getC() + g.getD() + g.getE() + g.getF() + g.getG(), 28);
    assert.equal(h.getA() + h.getB() + h.getC() + h.getD() + h.getE() + h.getF() + h.getG() + h.getH(), 36);
    assert.equal(i.getA() + i.getB() + i.getC() + i.getD() + i.getE() + i.getF() + i.getG() + i.getH() + i.getI(), 45);
    assert.equal(j.getA() + j.getB() + j.getC() + j.getD() + j.getE() + j.getF() + j.getG() + j.getH() + j.getI() + j.getJ(), 55);
    assert.equal(k.getA() + k.getB() + k.getC() + k.getD() + k.getE() + k.getF() + k.getG() + k.getH() + k.getI() + k.getJ() + k.getK(), 66);
});
