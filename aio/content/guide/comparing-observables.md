# Observables compared to other techniques

# 可观察对象与其它技术的比较

You can often use observables instead of promises to deliver values asynchronously.
Similarly, observables can take the place of event handlers.
Finally, because observables deliver multiple values, you can use them where you might otherwise build and operate on arrays.

你可以经常使用可观察对象（Observable）而不是承诺（Promise）来异步传递值。类似的，可观察对象也可以取代事件处理器的位置。最后，由于可观察对象传递多个值，所以你可以在任何可能构建和操作数组的地方使用可观察对象。

Observables behave somewhat differently from the alternative techniques in each of these situations, but offer some significant advantages.
Here are detailed comparisons of the differences.

在这些情况下，可观察对象的行为与其替代技术有一些差异，不过也提供了一些显著的优势。下面是对这些差异的详细比较。

## Observables compared to promises

## 可观察对象 vs. 承诺

Observables are often compared to promises.
Here are some key differences:

可观察对象经常拿来和承诺进行对比。有一些关键的不同点：

* Observables are declarative; computation does not start until subscription.
  Promises execute immediately on creation.
  This makes observables useful for defining recipes that can be run whenever you need the result.

  可观察对象是声明式的，在被订阅之前，它不会开始执行。承诺是在创建时就立即执行的。这让可观察对象可用于定义那些应该按需执行的菜谱。

* Observables provide many values.
  Promises provide one.
  This makes observables useful for getting multiple values over time.

  可观察对象能提供多个值。承诺只提供一个。这让可观察对象可用于随着时间的推移获取多个值。

* Observables differentiate between chaining and subscription.
  Promises only have `.then()` clauses.
  This makes observables useful for creating complex transformation recipes to be used by other part of the system, without causing the work to be executed.

  可观察对象会区分串联处理和订阅语句。承诺只有 `.then()` 语句。这让可观察对象可用于创建供系统的其它部分使用而不希望立即执行的复杂菜谱。

* Observables `subscribe()` is responsible for handling errors.
  Promises push errors to the child promises.
  This makes observables useful for centralized and predictable error handling.

  可观察对象的 `subscribe()` 会负责处理错误。承诺会把错误推送给它的子承诺。这让可观察对象可用于进行集中式、可预测的错误处理。

### Creation and subscription

### 创建与订阅

* Observables are not executed until a consumer subscribes.
  The `subscribe()` executes the defined behavior once, and it can be called again.
  Each subscription has its own computation.
  Resubscription causes recomputation of values.

  在有消费者订阅之前，可观察对象不会执行。`subscribe()` 会执行一次定义好的行为，并且可以再次调用它。每次订阅都是单独计算的。重新订阅会导致重新计算这些值。

  <code-example header="src/observables.ts (observable)" path="comparing-observables/src/observables.ts" region="observable"></code-example>

* Promises execute immediately, and just once.
  The computation of the result is initiated when the promise is created.
  There is no way to restart work.
  All `then` clauses (subscriptions) share the same computation.

  承诺会立即执行，并且只执行一次。当承诺创建时，会立即计算出结果。没有办法重新做一次。所有的 `then` 语句（订阅）都会共享同一次计算。

  <code-example header="src/promises.ts (promise)" path="comparing-observables/src/promises.ts" region="promise"></code-example>

### Chaining

### 串联

* Observables differentiate between transformation function such as a map and subscription.
  Only subscription activates the subscriber function to start computing the values.

  可观察对象会区分各种转换函数，比如映射和订阅。只有订阅才会激活订阅者函数，以开始计算那些值。

  <code-example header="src/observables.ts (chain)" path="comparing-observables/src/observables.ts" region="chain"></code-example>

* Promises do not differentiate between the last `.then` clauses (equivalent to subscription) and intermediate `.then` clauses (equivalent to map).

  承诺并不区分最后的 `.then()` 语句（等价于订阅）和中间的 `.then()` 语句（等价于映射）。

  <code-example header="src/promises.ts (chain)" path="comparing-observables/src/promises.ts" region="chain"></code-example>

### Cancellation

### 可取消

* Observable subscriptions are cancellable.
  Unsubscribing removes the listener from receiving further values, and notifies the subscriber function to cancel work.

  可观察对象的订阅是可取消的。取消订阅会移除监听器，使其不再接受将来的值，并通知订阅者函数取消正在进行的工作。

  <code-example header="src/observables.ts (unsubscribe)" path="comparing-observables/src/observables.ts" region="unsubscribe"></code-example>

* Promises are not cancellable.

  承诺是不可取消的。

### Error handling

### 错误处理

* Observable execution errors are delivered to the subscriber's error handler, and the subscriber automatically unsubscribes from the observable.

  可观察对象的错误处理工作交给了订阅者的错误处理器，并且该订阅者会自动取消对这个可观察对象的订阅。

  <code-example header="src/observables.ts (error)" path="comparing-observables/src/observables.ts" region="error"></code-example>

* Promises push errors to the child promises.

  承诺会把错误推给其子承诺。

  <code-example header="src/promises.ts (error)" path="comparing-observables/src/promises.ts" region="error"></code-example>

### Cheat sheet

### 速查表

The following code snippets illustrate how the same kind of operation is defined using observables and promises.

下列代码片段揭示了同样的操作要如何分别使用可观察对象和承诺进行实现。

| Operation | Observable | Promise |
| :-------- | :--------- | :------ |
| 操作 | 可观察对象 | 承诺 |
| Creation | <code-example format="typescript" hideCopy language="typescript"> new Observable((observer) =&gt; { &NewLine;&nbsp; observer.next(123); &NewLine;}); </code-example> | <code-example format="typescript" hideCopy language="typescript"> new Promise((resolve, reject) =&gt; { &NewLine;&nbsp; resolve(123); &NewLine;}); </code-example> |
| 创建 | <code-example format="typescript" hideCopy language="typescript"> new Observable((observer) =&gt; { &NewLine;&nbsp; observer.next(123); &NewLine;}); </code-example> | <code-example format="typescript" hideCopy language="typescript"> new Promise((resolve, reject) =&gt; { &NewLine;&nbsp; resolve(123); &NewLine;}); </code-example> |
| Transform | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(map((value) => value \* 2));</pre> | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; value &ast; 2);</code-example> |
| 转换 | <code-example format="typescript" hideCopy language="typescript">obs.pipe(map((value) => value \* 2));</pre> | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; value &ast; 2);</code-example> |
| Subscribe | <code-example format="typescript" hideCopy language="typescript"> sub = obs.subscribe((value) =&gt; { &NewLine;&nbsp; console.log(value) &NewLine;});</code-example> | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; { &NewLine;&nbsp; console.log(value); &NewLine;}); </code-example> |
| 订阅 | <code-example format="typescript" hideCopy language="typescript"> sub = obs.subscribe((value) =&gt; { &NewLine;&nbsp; console.log(value) &NewLine;});</code-example> | <code-example format="typescript" hideCopy language="typescript"> promise.then((value) =&gt; { &NewLine;&nbsp; console.log(value); &NewLine;}); </code-example> |
| Unsubscribe | <code-example format="typescript" hideCopy language="typescript"> sub.unsubscribe();</code-example> | Implied by promise resolution. |
| 取消订阅 | <code-example format="typescript" hideCopy language="typescript"> sub.unsubscribe();</code-example> | 承诺被解析时隐式完成。 |

## Observables compared to events API

## 可观察对象 vs. 事件 API

Observables are very similar to event handlers that use the events API.
Both techniques define notification handlers, and use them to process multiple values delivered over time.
Subscribing to an observable is equivalent to adding an event listener.
One significant difference is that you can configure an observable to transform an event before passing the event to the handler.

可观察对象和事件 API 中的事件处理器很像。这两种技术都会定义通知处理器，并使用它们来处理一段时间内传递的多个值。订阅可观察对象与添加事件处理器是等价的。一个显著的不同是你可以配置可观察对象，使其在把事件传给事件处理器之前先进行转换。

Using observables to handle events and asynchronous operations can have the advantage of greater consistency in contexts such as HTTP requests.

使用可观察对象来处理错误和异步操作在 HTTP 请求这样的场景下更加具有一致性。

Here are some code samples that illustrate how the same kind of operation is defined using observables and the events API.

下列代码片段揭示了同样的操作要如何分别使用可观察对象和事件 API 进行实现。

|  | Observable | Events API |
| :-- | :--------- | :--------- |
|  | 可观察对象 | 事件 API |
| Creation & cancellation | <code-example format="typescript" hideCopy language="typescript"> // Setup &NewLine;const clicks&dollar; = fromEvent(buttonEl, 'click'); &NewLine;// Begin listening &NewLine;const subscription = clicks&dollar; &NewLine;&nbsp; .subscribe(e =&gt; console.log('Clicked', e)) &NewLine;// Stop listening &NewLine;subscription.unsubscribe(); </code-example> | <code-example format="typescript" hideCopy language="typescript">function handler(e) { &NewLine;&nbsp; console.log('Clicked', e); &NewLine;} &NewLine;// Setup &amp; begin listening &NewLine;button.addEventListener('click', handler); &NewLine;// Stop listening &NewLine;button.removeEventListener('click', handler); </code-example> |
| 创建和取消 | <code-example format="typescript" hideCopy language="typescript"> // Setup &NewLine;const clicks&dollar; = fromEvent(buttonEl, 'click'); &NewLine;// Begin listening &NewLine;const subscription = clicks&dollar; &NewLine;&nbsp; .subscribe(e =&gt; console.log('Clicked', e)) &NewLine;// Stop listening &NewLine;subscription.unsubscribe(); </code-example> | <code-example format="typescript" hideCopy language="typescript">function handler(e) { &NewLine;&nbsp; console.log('Clicked', e); &NewLine;} &NewLine;// Setup &amp; begin listening &NewLine;button.addEventListener('click', handler); &NewLine;// Stop listening &NewLine;button.removeEventListener('click', handler); </code-example> |
| Subscription | <code-example format="typescript" hideCopy language="typescript">observable.subscribe(() =&gt; { &NewLine;&nbsp; // notification handlers here &NewLine;});</code-example> | <code-example format="typescript" hideCopy language="typescript">element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // notification handler here &NewLine;}); </code-example> |
| 订阅 | <code-example format="typescript" hideCopy language="typescript">observable.subscribe(() =&gt; { &NewLine;&nbsp; // notification handlers here &NewLine;});</code-example> | <code-example format="typescript" hideCopy language="typescript">element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // notification handler here &NewLine;}); </code-example> |
| Configuration | Listen for keystrokes, but provide a stream representing the value in the input. <code-example format="typescript" hideCopy language="typescript"> fromEvent(inputEl, 'keydown').pipe( &NewLine;&nbsp; map(e =&gt; e.target.value) &NewLine;); </code-example> | Does not support configuration. <code-example format="typescript" hideCopy language="typescript"> element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // Cannot change the passed Event into another &NewLine;&nbsp; // value before it gets to the handler &NewLine;}); </code-example> |
| 配置 | 侦听击键，但提供表示输入值的流。<code-example format="typescript" hideCopy language="typescript"> fromEvent(inputEl, 'keydown').pipe( &NewLine;&nbsp; map(e =&gt; e.target.value) &NewLine;); </code-example> | 不支持配置。<code-example format="typescript" hideCopy language="typescript"> element.addEventListener(eventName, (event) =&gt; { &NewLine;&nbsp; // Cannot change the passed Event into another &NewLine;&nbsp; // value before it gets to the handler &NewLine;}); </code-example> |

## Observables compared to arrays

## 可观察对象 vs. 数组

An observable produces values over time.
An array is created as a static set of values.
In a sense, observables are asynchronous where arrays are synchronous.
In the following examples, <code>→</code> implies asynchronous value delivery.

可观察对象会随时间生成值。数组是用一组静态的值创建的。某种意义上，可观察对象是异步的，而数组是同步的。
在下面的例子中，➞ 符号表示异步传递值。

| Values | Observable | Array |
| :----- | :--------- | :---- |
| 值 | 可观察对象 | 数组 |
| Given | <code-example format="typescript" hideCopy language="typescript"> obs: &rarr;1&rarr;2&rarr;3&rarr;5&rarr;7 </code-example> <code-example format="typescript" hideCopy language="typescript"> obsB: &rarr;'a'&rarr;'b'&rarr;'c' </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr: [1, 2, 3, 5, 7] </code-example> <code-example format="typescript" hideCopy language="typescript"> arrB: ['a', 'b', 'c'] </code-example> |
| 给定值 | <code-example format="typescript" hideCopy language="typescript"> obs: &rarr;1&rarr;2&rarr;3&rarr;5&rarr;7 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr: [1, 2, 3, 5, 7] </code-example> |
| `concat()` | <code-example format="typescript" hideCopy language="typescript"> concat(obs, obsB) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;1&rarr;2&rarr;3&rarr;5&rarr;7&rarr;'a'&rarr;'b'&rarr;'c' </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.concat(arrB) </code-example> <code-example format="typescript" hideCopy language="typescript"> [1,2,3,5,7,'a','b','c'] </code-example> |
| `filter()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(filter((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;5&rarr;7 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.filter((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> [5, 7] </code-example> |
| `find()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(find((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;5 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.find((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> 5 </code-example> |
| `findIndex()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(findIndex((v) =&gt; v&gt;3)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;3 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.findIndex((v) =&gt; v&gt;3) </code-example> <code-example format="typescript" hideCopy language="typescript"> 3 </code-example> |
| `forEach()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(tap((v) =&gt; { &NewLine; &nbsp; console.log(v); &NewLine; })) &NewLine; 1 &NewLine; 2 &NewLine; 3 &NewLine; 5 &NewLine; 7 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.forEach((v) =&gt; { &NewLine; &nbsp; console.log(v); &NewLine; }) &NewLine; 1 &NewLine; 2 &NewLine; 3 &NewLine; 5 &NewLine; 7 </code-example> |
| `map()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(map((v) =&gt; -v)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;-1&rarr;-2&rarr;-3&rarr;-5&rarr;-7 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.map((v) =&gt; -v) </code-example> <code-example format="typescript" hideCopy language="typescript"> [-1, -2, -3, -5, -7] </code-example> |
| `reduce()` | <code-example format="typescript" hideCopy language="typescript"> obs.pipe(reduce((s,v)=&gt; s+v, 0)) </code-example> <code-example format="typescript" hideCopy language="typescript"> &rarr;18 </code-example> | <code-example format="typescript" hideCopy language="typescript"> arr.reduce((s,v) =&gt; s+v, 0) </code-example> <code-example format="typescript" hideCopy language="typescript"> 18 </code-example> |

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28