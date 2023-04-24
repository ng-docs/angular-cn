/****************************************************************************************************
 * PARTIAL FILE: component.js
 ****************************************************************************************************/
import { Component } from '@angular/core';
import * as i0 from "@angular/core";
class OtherCmp {
}
OtherCmp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: OtherCmp, deps: [], target: i0.ɵɵFactoryTarget.Component });
OtherCmp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: OtherCmp, isStandalone: true, isSignal: true, selector: "other-cmp", ngImport: i0, template: '', isInline: true });
export { OtherCmp };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: OtherCmp, decorators: [{
            type: Component,
            args: [{
                    signals: true,
                    standalone: true,
                    selector: 'other-cmp',
                    template: '',
                }]
        }] });
class SignalCmp {
}
SignalCmp.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: SignalCmp, deps: [], target: i0.ɵɵFactoryTarget.Component });
SignalCmp.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: SignalCmp, isStandalone: true, isSignal: true, selector: "ng-component", ngImport: i0, template: '<other-cmp></other-cmp>', isInline: true, dependencies: [{ kind: "component", type: OtherCmp, selector: "other-cmp" }] });
export { SignalCmp };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: SignalCmp, decorators: [{
            type: Component,
            args: [{
                    signals: true,
                    standalone: true,
                    template: '<other-cmp></other-cmp>',
                    imports: [OtherCmp],
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: component.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class OtherCmp {
    static ɵfac: i0.ɵɵFactoryDeclaration<OtherCmp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OtherCmp, "other-cmp", never, {}, {}, never, never, true, never, true>;
}
export declare class SignalCmp {
    static ɵfac: i0.ɵɵFactoryDeclaration<SignalCmp, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SignalCmp, "ng-component", never, {}, {}, never, never, true, never, true>;
}

/****************************************************************************************************
 * PARTIAL FILE: directive.js
 ****************************************************************************************************/
import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
class SignalDir {
}
SignalDir.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: SignalDir, deps: [], target: i0.ɵɵFactoryTarget.Directive });
SignalDir.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "0.0.0-PLACEHOLDER", type: SignalDir, isSignal: true, ngImport: i0 });
export { SignalDir };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "0.0.0-PLACEHOLDER", ngImport: i0, type: SignalDir, decorators: [{
            type: Directive,
            args: [{
                    signals: true,
                }]
        }] });

/****************************************************************************************************
 * PARTIAL FILE: directive.d.ts
 ****************************************************************************************************/
import * as i0 from "@angular/core";
export declare class SignalDir {
    static ɵfac: i0.ɵɵFactoryDeclaration<SignalDir, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<SignalDir, never, never, {}, {}, never, never, false, never, true>;
}

