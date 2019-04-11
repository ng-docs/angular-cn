/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ɵɵdefineInjectable, ɵɵdefineInjector,} from '../../di/interface/defs';
import {ɵɵinject} from '../../di/injector_compatibility';
import * as r3 from '../index';
import * as sanitization from '../../sanitization/sanitization';


/**
 * A mapping of the @angular/core API surface used in generated expressions to the actual symbols.
 *
 * This should be kept up to date with the public exports of @angular/core.
 */
export const angularCoreEnv: {[name: string]: Function} = {
  'ɵɵdefineBase': r3.ɵɵdefineBase,
  'ɵɵdefineComponent': r3.ɵɵdefineComponent,
  'ɵɵdefineDirective': r3.ɵɵdefineDirective,
  'ɵɵdefineInjectable': ɵɵdefineInjectable,
  'ɵɵdefineInjector': ɵɵdefineInjector,
  'ɵɵdefineNgModule': r3.ɵɵdefineNgModule,
  'ɵɵdefinePipe': r3.ɵɵdefinePipe,
  'ɵɵdirectiveInject': r3.ɵɵdirectiveInject,
  'ɵɵgetFactoryOf': r3.ɵɵgetFactoryOf,
  'ɵɵgetInheritedFactory': r3.ɵɵgetInheritedFactory,
  'ɵɵinject': ɵɵinject,
  'ɵɵinjectAttribute': r3.ɵɵinjectAttribute,
  'ɵɵtemplateRefExtractor': r3.ɵɵtemplateRefExtractor,
  'ɵɵNgOnChangesFeature': r3.ɵɵNgOnChangesFeature,
  'ɵɵProvidersFeature': r3.ɵɵProvidersFeature,
  'ɵɵInheritDefinitionFeature': r3.ɵɵInheritDefinitionFeature,
  'ɵɵelementAttribute': r3.ɵɵelementAttribute,
  'ɵɵbind': r3.ɵɵbind,
  'ɵɵcontainer': r3.ɵɵcontainer,
  'ɵɵnextContext': r3.ɵɵnextContext,
  'ɵɵcontainerRefreshStart': r3.ɵɵcontainerRefreshStart,
  'ɵɵcontainerRefreshEnd': r3.ɵɵcontainerRefreshEnd,
  'ɵɵnamespaceHTML': r3.ɵɵnamespaceHTML,
  'ɵɵnamespaceMathML': r3.ɵɵnamespaceMathML,
  'ɵɵnamespaceSVG': r3.ɵɵnamespaceSVG,
  'ɵɵenableBindings': r3.ɵɵenableBindings,
  'ɵɵdisableBindings': r3.ɵɵdisableBindings,
  'ɵɵallocHostVars': r3.ɵɵallocHostVars,
  'ɵɵelementStart': r3.ɵɵelementStart,
  'ɵɵelementEnd': r3.ɵɵelementEnd,
  'ɵɵelement': r3.ɵɵelement,
  'ɵɵelementContainerStart': r3.ɵɵelementContainerStart,
  'ɵɵelementContainerEnd': r3.ɵɵelementContainerEnd,
  'ɵɵpureFunction0': r3.ɵɵpureFunction0,
  'ɵɵpureFunction1': r3.ɵɵpureFunction1,
  'ɵɵpureFunction2': r3.ɵɵpureFunction2,
  'ɵɵpureFunction3': r3.ɵɵpureFunction3,
  'ɵɵpureFunction4': r3.ɵɵpureFunction4,
  'ɵɵpureFunction5': r3.ɵɵpureFunction5,
  'ɵɵpureFunction6': r3.ɵɵpureFunction6,
  'ɵɵpureFunction7': r3.ɵɵpureFunction7,
  'ɵɵpureFunction8': r3.ɵɵpureFunction8,
  'ɵɵpureFunctionV': r3.ɵɵpureFunctionV,
  'ɵɵgetCurrentView': r3.ɵɵgetCurrentView,
  'ɵɵrestoreView': r3.ɵɵrestoreView,
  'ɵɵinterpolation1': r3.ɵɵinterpolation1,
  'ɵɵinterpolation2': r3.ɵɵinterpolation2,
  'ɵɵinterpolation3': r3.ɵɵinterpolation3,
  'ɵɵinterpolation4': r3.ɵɵinterpolation4,
  'ɵɵinterpolation5': r3.ɵɵinterpolation5,
  'ɵɵinterpolation6': r3.ɵɵinterpolation6,
  'ɵɵinterpolation7': r3.ɵɵinterpolation7,
  'ɵɵinterpolation8': r3.ɵɵinterpolation8,
  'ɵɵinterpolationV': r3.ɵɵinterpolationV,
  'ɵɵlistener': r3.ɵɵlistener,
  'ɵɵload': r3.ɵɵload,
  'ɵɵprojection': r3.ɵɵprojection,
  'ɵɵelementProperty': r3.ɵɵelementProperty,
  'ɵɵcomponentHostSyntheticProperty': r3.ɵɵcomponentHostSyntheticProperty,
  'ɵɵcomponentHostSyntheticListener': r3.ɵɵcomponentHostSyntheticListener,
  'ɵɵpipeBind1': r3.ɵɵpipeBind1,
  'ɵɵpipeBind2': r3.ɵɵpipeBind2,
  'ɵɵpipeBind3': r3.ɵɵpipeBind3,
  'ɵɵpipeBind4': r3.ɵɵpipeBind4,
  'ɵɵpipeBindV': r3.ɵɵpipeBindV,
  'ɵɵprojectionDef': r3.ɵɵprojectionDef,
  'ɵɵpipe': r3.ɵɵpipe,
  'ɵɵqueryRefresh': r3.ɵɵqueryRefresh,
  'ɵɵviewQuery': r3.ɵɵviewQuery,
  'ɵɵstaticViewQuery': r3.ɵɵstaticViewQuery,
  'ɵɵstaticContentQuery': r3.ɵɵstaticContentQuery,
  'ɵɵloadViewQuery': r3.ɵɵloadViewQuery,
  'ɵɵcontentQuery': r3.ɵɵcontentQuery,
  'ɵɵloadContentQuery': r3.ɵɵloadContentQuery,
  'ɵɵreference': r3.ɵɵreference,
  'ɵɵelementHostAttrs': r3.ɵɵelementHostAttrs,
  'ɵɵelementStyling': r3.ɵɵelementStyling,
  'ɵɵelementStylingMap': r3.ɵɵelementStylingMap,
  'ɵɵelementStyleProp': r3.ɵɵelementStyleProp,
  'ɵɵelementStylingApply': r3.ɵɵelementStylingApply,
  'ɵɵelementClassProp': r3.ɵɵelementClassProp,
  'ɵɵelementHostStyling': r3.ɵɵelementHostStyling,
  'ɵɵelementHostStylingMap': r3.ɵɵelementHostStylingMap,
  'ɵɵelementHostStyleProp': r3.ɵɵelementHostStyleProp,
  'ɵɵelementHostStylingApply': r3.ɵɵelementHostStylingApply,
  'ɵɵelementHostClassProp': r3.ɵɵelementHostClassProp,
  'ɵɵselect': r3.ɵɵselect,
  'ɵɵtemplate': r3.ɵɵtemplate,
  'ɵɵtext': r3.ɵɵtext,
  'ɵɵtextBinding': r3.ɵɵtextBinding,
  'ɵɵembeddedViewStart': r3.ɵɵembeddedViewStart,
  'ɵɵembeddedViewEnd': r3.ɵɵembeddedViewEnd,
  'ɵɵi18n': r3.ɵɵi18n,
  'ɵɵi18nAttributes': r3.ɵɵi18nAttributes,
  'ɵɵi18nExp': r3.ɵɵi18nExp,
  'ɵɵi18nStart': r3.ɵɵi18nStart,
  'ɵɵi18nEnd': r3.ɵɵi18nEnd,
  'ɵɵi18nApply': r3.ɵɵi18nApply,
  'ɵɵi18nPostprocess': r3.ɵɵi18nPostprocess,
  'ɵɵi18nLocalize': r3.ɵɵi18nLocalize,
  'ɵɵresolveWindow': r3.ɵɵresolveWindow,
  'ɵɵresolveDocument': r3.ɵɵresolveDocument,
  'ɵɵresolveBody': r3.ɵɵresolveBody,
  'ɵɵsetComponentScope': r3.ɵɵsetComponentScope,
  'ɵɵsetNgModuleScope': r3.ɵɵsetNgModuleScope,

  'ɵɵsanitizeHtml': sanitization.ɵɵsanitizeHtml,
  'ɵɵsanitizeStyle': sanitization.ɵɵsanitizeStyle,
  'ɵɵdefaultStyleSanitizer': sanitization.ɵɵdefaultStyleSanitizer,
  'ɵɵsanitizeResourceUrl': sanitization.ɵɵsanitizeResourceUrl,
  'ɵɵsanitizeScript': sanitization.ɵɵsanitizeScript,
  'ɵɵsanitizeUrl': sanitization.ɵɵsanitizeUrl,
  'ɵɵsanitizeUrlOrResourceUrl': sanitization.ɵɵsanitizeUrlOrResourceUrl
};
