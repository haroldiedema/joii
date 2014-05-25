/*                                                        ____.      .__.__
 Javascript Object Inheritance Implementation            |    | ____ |__|__|
 Copyright 2014, Harold Iedema. All rights reserved.     |    |/  _ \|  |  |
---------------------------------------------------- /\__|    (  <_> )  |  | --
                                                     \________|\____/|__|__|

 THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS
 OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
 BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 POSSIBILITY OF SUCH DAMAGE.

 ------------------------------------------------------------------------------
*/

/**
 * Adds mix-in support to any instantiated class, allowing you to implement
 * trait objects on-the-fly.
 *
 * Example:
 *
 *      var MyClass = Class({
 *          __construct: function() {
 *              this.mixin(SomeObject, AnotherObject);
 *          }
 *      });
 *
 *      var m = new MyClass();
 *      m.mixin(AndAnotherOne);
 */
_g.$JOII.PublicAPI.RegisterJOIIPlugin('mixin', {

    /**
     * Only implement mixin support on classes that currently don't have a
     * mixin method applied.
     *
     * @param function product
     * @return bool
     */
    supports: function(product) {
        return typeof(product.prototype.mixin) === 'undefined';
    },

    scope: {
        /**
         * Adds traits on-the-fly to any existing class instance.
         *
         * @param object ...
         */
        mixin: function(_)
        {
            var obj, i;
            for (i = 0; i < arguments.length; i++) {
                obj = arguments[i];
                // Mix-ins (traits) can only be a series of objects.
                if (typeof(obj) === 'object') {
                    for (var i in obj) {
                        // We only want to apply mix-ins that currently don't
                        // exist in the current context.
                        if (typeof(this[i]) === 'undefined') {
                            this[i] = obj[i];
                        }
                    }
                }
            }
        }
    }
});
