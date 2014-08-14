'use strict';

/**
 * Provide a service that takes the filepath of a `Module` object and returns
 * a proxy that encapsulates the knowledge of how to contact the `Module`
 * object.
 * @constructor
 */
function ModuleRegistry() {
  this.registry = {};
}

/**
 * Holds the internal registry.
 * @type {object}
 * @private
 * @static
 */
ModuleRegistry.registry = null;

/**
 * Holds a shared instance of the registry.
 * @type {Module}
 * @private
 * @static
 */
ModuleRegistry.instance = null;

/**
 * Static function that returns a singleton instance of the `Module` class.
 * @return {ModuleRegistry}
 * @static
 */
ModuleRegistry.getSingleton = function() {
  if (ModuleRegistry.instance) {
    return ModuleRegistry.instance;
  }
  return (ModuleRegistry.instance = new ModuleRegistry());
};

/**
 * Iterates through all modules in the registry.
 * @param {function} callback.
 */
ModuleRegistry.prototype.each = function(fn) {
  for (var path in this.registry) {
    fn.apply(this, [this.registry[path], path]);
  }
};

/**
 * Gets the `Module` instance from the registry.
 * @param {Module | string} module Module instance or its `toString` value,
 *     effectively the module file path.
 * @return {Module}
 */
ModuleRegistry.prototype.get = function(module) {
  return this.registry[module];
};

/**
 * Checks if the `Module` instance is on the registry.
 * @param {Module | string} module Module instance or its `toString` value,
 *     effectively the module file path.
 * @return {boolean}
 */
ModuleRegistry.prototype.isRegistered = function(module) {
  return this.get(module) !== undefined;
};

/**
 * Register a `Module` instance indexed by the `toString` value, effectively
 * the module file path.
 * @param {Module} module Module instance.
 */
ModuleRegistry.prototype.register = function(module) {
  this.registry[module.name] = module;
};

/**
 * Unregister the `Module` instance.
 * @param {Module | string} module Module instance or its `toString` value,
 *     effectively the module file path.
 */
ModuleRegistry.prototype.unregister = function(module) {
  delete this.registry[module];
};

module.exports = ModuleRegistry;
