/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SchemaMetadata, SecurityContext} from '../core';
import {isNgContainer, isNgContent} from '../ml_parser/tags';
import {dashCaseToCamelCase} from '../util';

import {SECURITY_SCHEMA} from './dom_security_schema';
import {ElementSchemaRegistry} from './element_schema_registry';

const EVENT = 'event';
const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';
const OBJECT = 'object';

/**
 * This array represents the DOM schema. It encodes inheritance, properties, and events.
 *
 * 此数组表示 DOM 模式。它对继承、属性和事件进行编码。
 *
 * ## Overview
 *
 * ## 概览
 *
 * Each line represents one kind of element. The `element_inheritance` and properties are joined
 * using `element_inheritance|properties` syntax.
 *
 * 每行都代表一种元素。使用 `element_inheritance|properties` 语法连接 `element_inheritance` 和
 * properties。
 *
 * ## Element Inheritance
 *
 * ## 元素继承
 *
 * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
 * Here the individual elements are separated by `,` (commas). Every element in the list
 * has identical properties.
 *
 * `element_inheritance` 可以进一步细分为 `element1,element2,...^parentElement` 。在这里，各个元素用
 * `,` （逗号）分隔。列表中的每个元素都具有相同的属性。
 *
 * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
 * specified then `""` (blank) element is assumed.
 *
 * `element` 可以从 `parentElement` 继承其他属性如果没有指定 `^parentElement` ，则假定为 `""`
 * （空白）元素。
 *
 * NOTE: The blank element inherits from root `[Element]` element, the super element of all
 * elements.
 *
 * 注意：blank 元素继承自根 `[Element]` 元素，这是所有元素的超级元素。
 *
 * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
 *
 * 注意 `:svg:` 等元素前缀对模式没有特殊含义。
 *
 * ## Properties
 *
 * ## 属性
 *
 * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
 * by a special character designating its type:
 *
 * 每个元素都有一组用 `,` （逗号）分隔的属性。每个属性都可以以指定其类型的特殊字符为前缀：
 *
 * - (no prefix): property is a string.
 *
 *   （无前缀）：属性是一个字符串。
 *
 * - `*`: property represents an event.
 *
 *   `*` ：属性表示一个事件。
 *
 * - `!`: property is a boolean.
 *
 *   `!` : 属性是布尔值。
 *
 * - `#`: property is a number.
 *
 *   `#` ：属性是一个数字。
 *
 * - `%`: property is an object.
 *
 *   `%` ：属性是一个对象。
 *
 * ## Query
 *
 * ## 查询
 *
 * The class creates an internal squas representation which allows to easily answer the query of
 * if a given property exist on a given element.
 *
 * 类创建了一个内部 squas 表示，它可以轻松回答给定元素上是否存在给定属性的查询。
 *
 * NOTE: We don't yet support querying for types or events.
 * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
 *       see dom_element_schema_registry_spec.ts
 *
 * 注：我们尚不支持查询类型或事件。注意：此模式是从位于 test 文件夹中的 `schema_extractor.ts`
 * 中自动提取的，请参阅 dom_element_schema_registry_spec.ts
 *
 */

// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
//
// Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
// dom_security_schema.ts. Reach out to mprobst & rjamet for details.
//
// =================================================================================================

const SCHEMA: string[] = [
  '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' +
      /* added manually to avoid breaking changes */
      ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored',
  '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
  'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
  'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume',
  ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
  ':svg:graphics^:svg:|',
  ':svg:animation^:svg:|*begin,*end,*repeat',
  ':svg:geometry^:svg:|',
  ':svg:componentTransferFunction^:svg:|',
  ':svg:gradient^:svg:|',
  ':svg:textContent^:svg:graphics|',
  ':svg:textPositioning^:svg:textContent|',
  'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
  'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username',
  'audio^media|',
  'br^[HTMLElement]|clear',
  'base^[HTMLElement]|href,target',
  'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
  'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
  'canvas^[HTMLElement]|#height,#width',
  'content^[HTMLElement]|select',
  'dl^[HTMLElement]|!compact',
  'datalist^[HTMLElement]|',
  'details^[HTMLElement]|!open',
  'dialog^[HTMLElement]|!open,returnValue',
  'dir^[HTMLElement]|!compact',
  'div^[HTMLElement]|align',
  'embed^[HTMLElement]|align,height,name,src,type,width',
  'fieldset^[HTMLElement]|!disabled,name',
  'font^[HTMLElement]|color,face,size',
  'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
  'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
  'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
  'hr^[HTMLElement]|align,color,!noShade,size,width',
  'head^[HTMLElement]|',
  'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
  'html^[HTMLElement]|version',
  'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
  'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
  'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
  'li^[HTMLElement]|type,#value',
  'label^[HTMLElement]|htmlFor',
  'legend^[HTMLElement]|align',
  'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type',
  'map^[HTMLElement]|name',
  'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
  'menu^[HTMLElement]|!compact',
  'meta^[HTMLElement]|content,httpEquiv,name,scheme',
  'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
  'ins,del^[HTMLElement]|cite,dateTime',
  'ol^[HTMLElement]|!compact,!reversed,#start,type',
  'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
  'optgroup^[HTMLElement]|!disabled,label',
  'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
  'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
  'p^[HTMLElement]|align',
  'param^[HTMLElement]|name,type,value,valueType',
  'picture^[HTMLElement]|',
  'pre^[HTMLElement]|#width',
  'progress^[HTMLElement]|#max,#value',
  'q,blockquote,cite^[HTMLElement]|',
  'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
  'select^[HTMLElement]|autocomplete,!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
  'shadow^[HTMLElement]|',
  'slot^[HTMLElement]|name',
  'source^[HTMLElement]|media,sizes,src,srcset,type',
  'span^[HTMLElement]|',
  'style^[HTMLElement]|!disabled,media,type',
  'caption^[HTMLElement]|align',
  'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
  'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
  'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
  'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
  'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
  'template^[HTMLElement]|',
  'textarea^[HTMLElement]|autocapitalize,autocomplete,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
  'title^[HTMLElement]|text',
  'track^[HTMLElement]|!default,kind,label,src,srclang',
  'ul^[HTMLElement]|!compact,type',
  'unknown^[HTMLElement]|',
  'video^media|#height,poster,#width',
  ':svg:a^:svg:graphics|',
  ':svg:animate^:svg:animation|',
  ':svg:animateMotion^:svg:animation|',
  ':svg:animateTransform^:svg:animation|',
  ':svg:circle^:svg:geometry|',
  ':svg:clipPath^:svg:graphics|',
  ':svg:defs^:svg:graphics|',
  ':svg:desc^:svg:|',
  ':svg:discard^:svg:|',
  ':svg:ellipse^:svg:geometry|',
  ':svg:feBlend^:svg:|',
  ':svg:feColorMatrix^:svg:|',
  ':svg:feComponentTransfer^:svg:|',
  ':svg:feComposite^:svg:|',
  ':svg:feConvolveMatrix^:svg:|',
  ':svg:feDiffuseLighting^:svg:|',
  ':svg:feDisplacementMap^:svg:|',
  ':svg:feDistantLight^:svg:|',
  ':svg:feDropShadow^:svg:|',
  ':svg:feFlood^:svg:|',
  ':svg:feFuncA^:svg:componentTransferFunction|',
  ':svg:feFuncB^:svg:componentTransferFunction|',
  ':svg:feFuncG^:svg:componentTransferFunction|',
  ':svg:feFuncR^:svg:componentTransferFunction|',
  ':svg:feGaussianBlur^:svg:|',
  ':svg:feImage^:svg:|',
  ':svg:feMerge^:svg:|',
  ':svg:feMergeNode^:svg:|',
  ':svg:feMorphology^:svg:|',
  ':svg:feOffset^:svg:|',
  ':svg:fePointLight^:svg:|',
  ':svg:feSpecularLighting^:svg:|',
  ':svg:feSpotLight^:svg:|',
  ':svg:feTile^:svg:|',
  ':svg:feTurbulence^:svg:|',
  ':svg:filter^:svg:|',
  ':svg:foreignObject^:svg:graphics|',
  ':svg:g^:svg:graphics|',
  ':svg:image^:svg:graphics|',
  ':svg:line^:svg:geometry|',
  ':svg:linearGradient^:svg:gradient|',
  ':svg:mpath^:svg:|',
  ':svg:marker^:svg:|',
  ':svg:mask^:svg:|',
  ':svg:metadata^:svg:|',
  ':svg:path^:svg:geometry|',
  ':svg:pattern^:svg:|',
  ':svg:polygon^:svg:geometry|',
  ':svg:polyline^:svg:geometry|',
  ':svg:radialGradient^:svg:gradient|',
  ':svg:rect^:svg:geometry|',
  ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
  ':svg:script^:svg:|type',
  ':svg:set^:svg:animation|',
  ':svg:stop^:svg:|',
  ':svg:style^:svg:|!disabled,media,title,type',
  ':svg:switch^:svg:graphics|',
  ':svg:symbol^:svg:|',
  ':svg:tspan^:svg:textPositioning|',
  ':svg:text^:svg:textPositioning|',
  ':svg:textPath^:svg:textContent|',
  ':svg:title^:svg:|',
  ':svg:use^:svg:graphics|',
  ':svg:view^:svg:|#zoomAndPan',
  'data^[HTMLElement]|value',
  'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name',
  'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
  'summary^[HTMLElement]|',
  'time^[HTMLElement]|dateTime',
  ':svg:cursor^:svg:|',
];

const _ATTR_TO_PROP: {[name: string]: string} = {
  'class': 'className',
  'for': 'htmlFor',
  'formaction': 'formAction',
  'innerHtml': 'innerHTML',
  'readonly': 'readOnly',
  'tabindex': 'tabIndex',
};

// Invert _ATTR_TO_PROP.
const _PROP_TO_ATTR: {[name: string]: string} =
    Object.keys(_ATTR_TO_PROP).reduce((inverted, attr) => {
      inverted[_ATTR_TO_PROP[attr]] = attr;
      return inverted;
    }, {} as {[prop: string]: string});

export class DomElementSchemaRegistry extends ElementSchemaRegistry {
  private _schema: {[element: string]: {[property: string]: string}} = {};
  // We don't allow binding to events for security reasons. Allowing event bindings would almost
  // certainly introduce bad XSS vulnerabilities. Instead, we store events in a separate schema.
  private _eventSchema: {[element: string]: Set<string>} = {};

  constructor() {
    super();
    SCHEMA.forEach(encodedType => {
      const type: {[property: string]: string} = {};
      const events: Set<string> = new Set();
      const [strType, strProperties] = encodedType.split('|');
      const properties = strProperties.split(',');
      const [typeNames, superName] = strType.split('^');
      typeNames.split(',').forEach(tag => {
        this._schema[tag.toLowerCase()] = type;
        this._eventSchema[tag.toLowerCase()] = events;
      });
      const superType = superName && this._schema[superName.toLowerCase()];
      if (superType) {
        Object.keys(superType).forEach((prop: string) => {
          type[prop] = superType[prop];
        });
        for (const superEvent of this._eventSchema[superName.toLowerCase()]) {
          events.add(superEvent);
        }
      }
      properties.forEach((property: string) => {
        if (property.length > 0) {
          switch (property[0]) {
            case '*':
              events.add(property.substring(1));
              break;
            case '!':
              type[property.substring(1)] = BOOLEAN;
              break;
            case '#':
              type[property.substring(1)] = NUMBER;
              break;
            case '%':
              type[property.substring(1)] = OBJECT;
              break;
            default:
              type[property] = STRING;
          }
        }
      });
    });
  }

  override hasProperty(tagName: string, propName: string, schemaMetas: SchemaMetadata[]): boolean {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
      return true;
    }

    if (tagName.indexOf('-') > -1) {
      if (isNgContainer(tagName) || isNgContent(tagName)) {
        return false;
      }

      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
        // Can't tell now as we don't know which properties a custom element will get
        // once it is instantiated
        return true;
      }
    }

    const elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
    return !!elementProperties[propName];
  }

  override hasElement(tagName: string, schemaMetas: SchemaMetadata[]): boolean {
    if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
      return true;
    }

    if (tagName.indexOf('-') > -1) {
      if (isNgContainer(tagName) || isNgContent(tagName)) {
        return true;
      }

      if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
        // Allow any custom elements
        return true;
      }
    }

    return !!this._schema[tagName.toLowerCase()];
  }

  /**
   * securityContext returns the security context for the given property on the given DOM tag.
   *
   * securityContext 会返回给定 DOM 标签上给定属性的安全上下文。
   *
   * Tag and property name are statically known and cannot change at runtime, i.e. it is not
   * possible to bind a value into a changing attribute or tag name.
   *
   * 标签和属性名称是静态已知的，在运行时不能更改，即不可能将值绑定到不断变化的属性或标签名称。
   *
   * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
   * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
   * string values. Only specific well known attack vectors are assigned their appropriate context.
   *
   * 过滤是基于允许的标签|属性列表的。上面的模式中的所有属性都假定具有 'NONE'
   * 安全上下文，即它们是安全的惰性字符串值。只有特定的知名攻击向量才会被分配适当的上下文。
   *
   */
  override securityContext(tagName: string, propName: string, isAttribute: boolean):
      SecurityContext {
    if (isAttribute) {
      // NB: For security purposes, use the mapped property name, not the attribute name.
      propName = this.getMappedPropName(propName);
    }

    // Make sure comparisons are case insensitive, so that case differences between attribute and
    // property names do not have a security impact.
    tagName = tagName.toLowerCase();
    propName = propName.toLowerCase();
    let ctx = SECURITY_SCHEMA()[tagName + '|' + propName];
    if (ctx) {
      return ctx;
    }
    ctx = SECURITY_SCHEMA()['*|' + propName];
    return ctx ? ctx : SecurityContext.NONE;
  }

  override getMappedPropName(propName: string): string {
    return _ATTR_TO_PROP[propName] || propName;
  }

  override getDefaultComponentElementName(): string {
    return 'ng-component';
  }

  override validateProperty(name: string): {error: boolean, msg?: string} {
    if (name.toLowerCase().startsWith('on')) {
      const msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
          `please use (${name.slice(2)})=...` +
          `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
          ` current module.`;
      return {error: true, msg: msg};
    } else {
      return {error: false};
    }
  }

  override validateAttribute(name: string): {error: boolean, msg?: string} {
    if (name.toLowerCase().startsWith('on')) {
      const msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
          `please use (${name.slice(2)})=...`;
      return {error: true, msg: msg};
    } else {
      return {error: false};
    }
  }

  override allKnownElementNames(): string[] {
    return Object.keys(this._schema);
  }

  allKnownAttributesOfElement(tagName: string): string[] {
    const elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
    // Convert properties to attributes.
    return Object.keys(elementProperties).map(prop => _PROP_TO_ATTR[prop] ?? prop);
  }

  allKnownEventsOfElement(tagName: string): string[] {
    return Array.from(this._eventSchema[tagName.toLowerCase()] ?? []);
  }

  override normalizeAnimationStyleProperty(propName: string): string {
    return dashCaseToCamelCase(propName);
  }

  override normalizeAnimationStyleValue(
      camelCaseProp: string, userProvidedProp: string,
      val: string|number): {error: string, value: string} {
    let unit: string = '';
    const strVal = val.toString().trim();
    let errorMsg: string = null!;

    if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
      if (typeof val === 'number') {
        unit = 'px';
      } else {
        const valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
        if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
          errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
        }
      }
    }
    return {error: errorMsg, value: strVal + unit};
  }
}

function _isPixelDimensionStyle(prop: string): boolean {
  switch (prop) {
    case 'width':
    case 'height':
    case 'minWidth':
    case 'minHeight':
    case 'maxWidth':
    case 'maxHeight':
    case 'left':
    case 'top':
    case 'bottom':
    case 'right':
    case 'fontSize':
    case 'outlineWidth':
    case 'outlineOffset':
    case 'paddingTop':
    case 'paddingLeft':
    case 'paddingBottom':
    case 'paddingRight':
    case 'marginTop':
    case 'marginLeft':
    case 'marginBottom':
    case 'marginRight':
    case 'borderRadius':
    case 'borderWidth':
    case 'borderTopWidth':
    case 'borderLeftWidth':
    case 'borderRightWidth':
    case 'borderBottomWidth':
    case 'textIndent':
      return true;

    default:
      return false;
  }
}
