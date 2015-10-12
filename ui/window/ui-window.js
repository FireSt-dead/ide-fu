var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ui;
(function (ui) {
    var Window = (function (_super) {
        __extends(Window, _super);
        function Window() {
            _super.apply(this, arguments);
        }
        Window.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = Window.document.getElementById("ui-window");
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
        };
        Window.document = document.currentScript.ownerDocument;
        Window = __decorate([
            component("ui-window")
        ], Window);
        return Window;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-window.js.map