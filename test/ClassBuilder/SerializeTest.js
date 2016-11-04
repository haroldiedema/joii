/*
 Javascript Object                               ______  ________________
 Serialize Implementation                    __ / / __ \/  _/  _/\_____  \
                                            / // / /_/ // /_/ /    _(__  <
 Copyright 2014, Harold Iedema.             \___/\____/___/___/   /       \
 --------------------------------------------------------------- /______  / ---
 Permission is hereby granted, free of charge, to any person obtaining  \/
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ------------------------------------------------------------------------------
*/

/**
 * Tests getters, setters and inheritance of instantiated class defintions.
 */
test('ClassBuilder:SerializeTest', function(assert) {

    // BaseClass declaration with 3 public properties. We'll be extending on
    // this class to see if the integrity of these values stay intact within
    // the correct context.
    var BaseClass = JOII.ClassBuilder('BaseClass', {}, {
        'public a': 1,
        'public noserialize b': 'foo',
        'protected serialize c': 'bar',
        'protected d': '2',
        'public verifyDefaultValues': function (name)
        {
            if (!name)
            {
                name = 'Base';
            }
            assert.equal(this.getA(), 1, name + '.getA() == 1');
            assert.equal(this.getB(), 'foo', name + '.getB() == foo');
            assert.equal(this.getC(), 'bar', name + '.getC() == bar');
            assert.equal(this.getD(), 2, name + '.getD() == 2');
        },
        'public changeValues': function ()
        {
            this.setA(100);
            this.setB('foo2');
            this.setC('bar2');
            this.setD(200);
        },
        'public verifyChangedValues': function ()
        {
            assert.equal(this.getA(), 100, 'Base.getA() == 100');
            assert.equal(this.getB(), 'foo', 'Base.getB() == foo'); // not serialized, so should still be the original
            assert.equal(this.getC(), 'bar2', 'Base.getC() == bar2');
            assert.equal(this.getD(), 2, 'Base.getD() == 2'); // not serialized, so should still be the original
        }
    });
    var Child1 = JOII.ClassBuilder('Child1', { 'extends': BaseClass }, {
        'public e': 3,
        'public verifyDefaultValues': function ()
        {
            this['super']('verifyDefaultValues', 'Child1');
            assert.equal(this.getE(), 3, 'Base.getE() == 3');
        },
        'public changeValues': function () {
            this.setA(1000);
            this.setB('foo21');
            this.setC('bar21');
            this.setD(2000);
            this.setE(3000);
        },
        'public verifyChangedValues': function () {
            assert.equal(this.getA(), 1000, 'Base.getA() == 1000');
            assert.equal(this.getB(), 'foo', 'Base.getB() == foo'); // not serialized, so should still be the original
            assert.equal(this.getC(), 'bar21', 'Base.getC() == bar21');
            assert.equal(this.getD(), 2, 'Base.getD() == 2'); // not serialized, so should still be the original
            assert.equal(this.getE(), 3000, 'Base.getE() == 3000');
        }
    });
    var Child2 = JOII.ClassBuilder('Child2', { 'extends': BaseClass }, {
        'protected f': 4,
        'public verifyDefaultValues': function () {
            this['super']('verifyDefaultValues', 'Child2');
            assert.equal(this.getF(), 4, 'Base.getF() == 4');
        },
        'public changeValues': function () {
            this.setA(10000);
            this.setB('foo22');
            this.setC('bar22');
            this.setD(20000);
            this.setF(40000);
        },
        'public verifyChangedValues': function () {
            assert.equal(this.getA(), 10000, 'Base.getA() == 10000');
            assert.equal(this.getB(), 'foo', 'Base.getB() == foo'); // not serialized, so should still be the original
            assert.equal(this.getC(), 'bar22', 'Base.getC() == bar22');
            assert.equal(this.getD(), 2, 'Base.getD() == 2'); // not serialized, so should still be the original
            assert.equal(this.getF(), 4, 'Base.getF() == 4'); // not serialized, so should still be the original
        }
    });

    var HolderClass = JOII.ClassBuilder({}, {
        'public BaseClass base': null,
        'public BaseClass c1': null,
        'public BaseClass c2': null
    });

    // Verify that getters and setters exist within the instantiated children.
    var base1 = new BaseClass();
    var c1 = new Child1();
    var c2 = new Child2();

    var h1 = new HolderClass();
    h1.setBase(base1);
    h1.setC1(c1);
    h1.setC2(c2);

    var json = h1.serialize();

    var h2 = HolderClass.deserialize(json);


    // change the values of the original objects, to make sure our data was actually restored from a serialized object, resulting in new data
    base1.changeValues();
    c1.changeValues();
    c2.changeValues();

    // verify the default data
    h2.getBase().verifyDefaultValues();
    h2.getC1().verifyDefaultValues();
    h2.getC2().verifyDefaultValues();

    // re-serialize with the changed values
    var json2 = h1.serialize();
    var h3 = HolderClass.deserialize(json2);

    // verify the changed values, for inheritance and expected changes, based on serialized fields
    h3.getBase().verifyChangedValues();
    h3.getC1().verifyChangedValues();
    h3.getC2().verifyChangedValues();


});
