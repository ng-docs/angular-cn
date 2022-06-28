/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {assertFirstCreatePass} from '../assert';
import {attachPatchData} from '../context_discovery';
import {registerPostOrderHooks} from '../hooks';
import {ComponentTemplate} from '../interfaces/definition';
import {LocalRefExtractor, TAttributes, TContainerNode, TNodeType} from '../interfaces/node';
import {isDirectiveHost} from '../interfaces/type_checks';
import {HEADER_OFFSET, LView, RENDERER, TView, TViewType} from '../interfaces/view';
import {appendChild} from '../node_manipulation';
import {getLView, getTView, setCurrentTNode} from '../state';
import {getConstant} from '../util/view_utils';

import {addToViewTree, createDirectivesInstances, createLContainer, createTView, getOrCreateTNode, resolveDirectives, saveResolvedLocalsInData} from './shared';



function templateFirstCreatePass(
    index: number, tView: TView, lView: LView, templateFn: ComponentTemplate<any>|null,
    decls: number, vars: number, tagName?: string|null, attrsIndex?: number|null,
    localRefsIndex?: number|null): TContainerNode {
  ngDevMode && assertFirstCreatePass(tView);
  ngDevMode && ngDevMode.firstCreatePass++;
  const tViewConsts = tView.consts;
  // TODO(pk): refactor getOrCreateTNode to have the "create" only version
  const tNode = getOrCreateTNode(
      tView, index, TNodeType.Container, tagName || null,
      getConstant<TAttributes>(tViewConsts, attrsIndex));

  resolveDirectives(tView, lView, tNode, getConstant<string[]>(tViewConsts, localRefsIndex));
  registerPostOrderHooks(tView, tNode);

  const embeddedTView = tNode.tViews = createTView(
      TViewType.Embedded, tNode, templateFn, decls, vars, tView.directiveRegistry,
      tView.pipeRegistry, null, tView.schemas, tViewConsts);

  if (tView.queries !== null) {
    tView.queries.template(tView, tNode);
    embeddedTView.queries = tView.queries.embeddedTView(tNode);
  }

  return tNode;
}

/**
 * Creates an LContainer for an ng-template (dynamically-inserted view), e.g.
 *
 * 为 ng-template（动态插入的视图）创建一个 LContainer，例如
 *
 * &lt;ng-template #foo>
 *
 * &lt;ng-模板 #foo>
 *
 *    <div></div>
 * </ng-template>
 *
 * @param index The index of the container in the data array
 *
 * 容器在数据数组中的索引
 *
 * @param templateFn Inline template
 *
 * 内联模板
 *
 * @param decls The number of nodes, local refs, and pipes for this template
 *
 * 此模板的节点、本地引用和管道的数量
 *
 * @param vars The number of bindings for this template
 *
 * 此模板的绑定数
 *
 * @param tagName The name of the container element, if applicable
 *
 * 容器元素的名称（如果适用）
 *
 * @param attrsIndex Index of template attributes in the `consts` array.
 *
 * `consts` 数组中模板属性的索引。
 *
 * @param localRefs Index of the local references in the `consts` array.
 *
 * `consts` 数组中的本地引用的索引。
 *
 * @param localRefExtractor A function which extracts local-refs values from the template.
 *        Defaults to the current element associated with the local-ref.
 *
 * 从模板中提取 local-refs 值的函数。默认为与 local-ref 关联的当前元素。
 *
 * @codeGenApi
 */
export function ɵɵtemplate(
    index: number, templateFn: ComponentTemplate<any>|null, decls: number, vars: number,
    tagName?: string|null, attrsIndex?: number|null, localRefsIndex?: number|null,
    localRefExtractor?: LocalRefExtractor) {
  const lView = getLView();
  const tView = getTView();
  const adjustedIndex = index + HEADER_OFFSET;

  const tNode = tView.firstCreatePass ? templateFirstCreatePass(
                                            adjustedIndex, tView, lView, templateFn, decls, vars,
                                            tagName, attrsIndex, localRefsIndex) :
                                        tView.data[adjustedIndex] as TContainerNode;
  setCurrentTNode(tNode, false);

  const comment = lView[RENDERER].createComment(ngDevMode ? 'container' : '');
  appendChild(tView, lView, comment, tNode);
  attachPatchData(comment, lView);

  addToViewTree(lView, lView[adjustedIndex] = createLContainer(comment, lView, comment, tNode));

  if (isDirectiveHost(tNode)) {
    createDirectivesInstances(tView, lView, tNode);
  }

  if (localRefsIndex != null) {
    saveResolvedLocalsInData(lView, tNode, localRefExtractor);
  }
}
