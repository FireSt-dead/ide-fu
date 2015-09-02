var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var ui;
(function (ui) {
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button() {
            _super.apply(this, arguments);
        }
        Button.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = Button.document.querySelector('#ui-button');
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
        };
        Button.document = document.currentScript.ownerDocument;
        Button = __decorate([
            component("ui-button")
        ], Button);
        return Button;
    })(HTMLElement);
    var CheckBox = (function (_super) {
        __extends(CheckBox, _super);
        function CheckBox() {
            _super.apply(this, arguments);
        }
        CheckBox.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = CheckBox.document.querySelector('#ui-check-box');
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
            this.addEventListener('click', toggle);
            this.addEventListener('keyup', function (e) {
                if (e.keyCode == 32) {
                    toggle.call(this);
                }
            });
            function toggle() {
                if (this.getAttribute('checked')) {
                    this.removeAttribute("checked");
                }
                else {
                    this.setAttribute("checked", true);
                }
            }
        };
        CheckBox.document = document.currentScript.ownerDocument;
        CheckBox = __decorate([
            component("ui-check-box")
        ], CheckBox);
        return CheckBox;
    })(HTMLElement);
    var RadioButton = (function (_super) {
        __extends(RadioButton, _super);
        function RadioButton() {
            _super.apply(this, arguments);
        }
        RadioButton.prototype.createdCallback = function () {
            var root = this.createShadowRoot();
            var template = RadioButton.document.querySelector('#ui-radio-button');
            var clone = document.importNode(template.content, true);
            root.appendChild(clone);
            this.addEventListener('click', toggle);
            this.addEventListener('keyup', function (e) {
                if (e.keyCode == 32) {
                    toggle.call(this);
                }
            });
            function toggle() {
                if (this.getAttribute('checked')) {
                    this.removeAttribute("checked");
                }
                else {
                    this.setAttribute("checked", true);
                }
            }
        };
        RadioButton.document = document.currentScript.ownerDocument;
        RadioButton = __decorate([
            component("ui-radio-button")
        ], RadioButton);
        return RadioButton;
    })(HTMLElement);
})(ui || (ui = {}));
//# sourceMappingURL=ui-buttons.js.map