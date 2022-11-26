# NgModule API

At a high level, NgModules are a way to organize Angular applications and they accomplish this through the metadata in the `@NgModule` decorator.
The metadata falls into three categories:

宏观来讲，NgModule 是组织 Angular 应用的一种方式，它们通过 `@NgModule` 装饰器中的元数据来实现这一点。这些元数据可以分成三类：

| Category | Details |
| :------- | :------ |
| 分类 | 详情 |
| Static | Compiler configuration which tells the compiler about directive selectors and where in templates the directives should be applied through selector matching. This is configured using the `declarations` array. |
| 静态 | 这个编译器配置用于告诉编译器指令的选择器并通过选择器匹配的方式决定要把该指令应用到模板中的什么位置。它是通过 `declarations` 数组来配置的。 |
| Runtime | Injector configuration using the `providers` array. |
| 运行时 | 通过 `providers` 数组提供给注入器的配置。 |
| Composability / Grouping | Bringing NgModules together and making them available using the `imports` and `exports` arrays. |
| 组合 / 分组 | 通过 `imports` 和 `exports` 数组来把多个 NgModule 放在一起，并让它们可用。 |

<code-example format="typescript" language="typescript">

&commat;NgModule({
  // Static, that is compiler configuration
  declarations: [], // Configure the selectors

  // Runtime, or injector configuration
  providers: [], // Runtime injector configuration

  // Composability / Grouping
  imports: [], // composing NgModules together
  exports: [] // making NgModules available to other parts of the app
})

</code-example>

## `@NgModule` metadata

## `@NgModule` 元数据

The following table summarizes the `@NgModule` metadata properties.

下面是 `@NgModule` 元数据中属性的汇总表。

| Property | Details |
| :------- | :------ |
| 属性 | 详情 |
| `declarations` | A list of [declarable](guide/ngmodule-faq#q-declarable) classes (*components*, *directives*, and *pipes*) that *belong to this module*. <ol> <li> When compiling a template, you need to determine a set of selectors which should be used for triggering their corresponding directives. </li> <li> The template is compiled within the context of an NgModule —the NgModule within which the template's component is declared— which determines the set of selectors using the following rules: <ul> <li> All selectors of directives listed in `declarations`. </li> <li> All selectors of directives exported from imported NgModules. </li> </ul> </li> </ol> Components, directives, and pipes must belong to *exactly* one module. The compiler emits an error if you try to declare the same class in more than one module. Be careful not to re-declare a class that is imported directly or indirectly from another module. |
| `declarations` | *属于此模块*的可[声明](guide/ngmodule-faq#q-declarable)类（*组件*、*指令*和*管道*）的列表。<ol><li>编译模板时，你需要确定一组选择器，用于触发其对应的指令。</li><li>模板是在 NgModule（声明模板组件的 NgModule）的上下文中编译的，它使用以下规则确定选择器集：<ul><li>`declarations` 中列出的指令的所有选择器。</li><li>从导入的 NgModules 导出的指令的所有选择器。</li></ul></li></ol>组件、指令和管道必须*正好*属于一个模块。如果你尝试在多个模块中声明同一个类，编译器会发出错误。请注意不要重新声明从另一个模块直接或间接导入的类。 |
| `providers` | A list of dependency-injection providers. <br /> Angular registers these providers with the NgModule's injector. If it is the NgModule used for bootstrapping then it is the root injector. <br /> These services become available for injection into any component, directive, pipe or service which is a child of this injector. <br /> A lazy-loaded module has its own injector which is typically a child of the application root injector. <br /> Lazy-loaded services are scoped to the lazy module's injector. If a lazy-loaded module also provides the `UserService`, any component created within that module's context (such as by router navigation) gets the local instance of the service, not the instance in the root application injector. <br /> Components in external modules continue to receive the instance provided by their injectors. <br /> For more information on injector hierarchy and scoping, see [Providers](guide/providers) and the [DI Guide](guide/dependency-injection). |
| `providers` | 依赖注入提供者的列表。<br />Angular 会使用 NgModule 的注入器注册这些提供者。如果是用于引导的 NgModule，则它是根注入器。<br />这些服务可用于注入到作为此注入器子项的任何组件、指令、管道或服务中。<br />惰性加载的模块有自己的注入器，它通常是应用程序根注入器的子。<br />惰性加载的服务的范围为延迟模块的注入器。如果惰性加载的模块还提供了 `UserService`，则在该模块的上下文中创建的任何组件（例如通过路由器导航）都会获取服务的本地实例，而不是根应用程序注入器中的实例。<br />外部模块中的组件会继续接收其注入器提供的实例。<br />有关注入器层次结构和范围的更多信息，请参阅[提供者](guide/providers)和[DI 指南](guide/dependency-injection)。 |
| `imports` | A list of modules which should be folded into this module. Folded means it is as if all the imported NgModule's exported properties were declared here. <br /> Specifically, it is as if the list of modules whose exported components, directives, or pipes are referenced by the component templates were declared in this module. <br /> A component template can [reference](guide/ngmodule-faq#q-template-reference) another component, directive, or pipe when the reference is declared in this module or if the imported module has exported it. For example, a component can use the `NgIf` and `NgFor` directives only if the module has imported the Angular `CommonModule` (perhaps indirectly by importing `BrowserModule`). <br /> You can import many standard directives from the `CommonModule` but some familiar directives belong to other modules. For example, you can use `[(ngModel)]` only after importing the Angular `FormsModule`. |
| `imports` | 应该折叠到此模块中的模块列表。Folded 意味着就好像所有导入的 NgModule 的导出属性都在这里声明了。<br />具体来说，就好像在此模块中声明了其导出的组件、指令或管道被组件模板引用的模块列表。<br />当在此模块中声明引用或者导入的模块已导出它时，组件模板[可以引用](guide/ngmodule-faq#q-template-reference)另一个组件、指令或管道。例如，只有在模块导入了 Angular `CommonModule`（可能是通过导入 `BrowserModule` 间接）时，组件才能使用 `NgIf` 和 `NgFor` 指令。<br />你可以从 `CommonModule` 导入许多标准指令，但一些熟悉的指令属于其他模块。例如，你只能在导入 Angular `FormsModule` 之后使用 `[(ngModel)]`。 |
| `exports` | A list of declarations —*component*, *directive*, and *pipe* classes— that an importing module can use. <br /> Exported declarations are the module's *public API*. A component in another module can [use](guide/ngmodule-faq#q-template-reference) *this* module's `UserComponent` if it imports this module and this module exports `UserComponent`. <br /> Declarations are private by default. If this module does *not* export `UserComponent`, then only the components within *this* module can use `UserComponent`. <br /> Importing a module does *not* automatically re-export the imported module's imports. Module 'B' can't use `ngIf` just because it imported module 'A' which imported `CommonModule`. Module 'B' must import `CommonModule` itself. <br /> A module can list another module among its `exports`, in which case all of that module's public components, directives, and pipes are exported. <br /> [Re-export](guide/ngmodule-faq#q-reexport) makes module transitivity explicit. If Module 'A' re-exports `CommonModule` and Module 'B' imports Module 'A', Module 'B' components can use `ngIf` even though 'B' itself didn't import `CommonModule`. |
| `exports` | 导入模块可以使用的声明列表（*组件*、*指令*和*管道*类）。<br />导出的声明是模块的*公共 API*。如果另一个模块中的组件导入此模块并且此模块导出 `UserComponent`，则另一个模块中的组件可以[用](guide/ngmodule-faq#q-template-reference)*此*模块的 `UserComponent`。<br />默认情况下，声明是私有的。如果此模块*不*导出 `UserComponent`，则只有*此*模块中的组件可以使用 `UserComponent`。<br />导入模块*不会*自动重新导出导入模块的导入。模块“B”不能使用 `ngIf`，因为它导入了模块“A”，而模块“A”又导入 `CommonModule`。模块“B”必须导入 `CommonModule` 本身。<br />一个模块可以在其 `exports` 中列出另一个模块，在这种情况下，该模块的所有公共组件、指令和管道都会被导出。<br />[重新导出](guide/ngmodule-faq#q-reexport)使模块可传递性显式。如果模块“A”重新导出 `CommonModule`，而模块“B”导入了模块“A”，则模块“B”组件可以用 `ngIf`，即使“B”本身没有导入 `CommonModule`。 |
| `bootstrap` | A list of components that are automatically bootstrapped. <br /> Usually there's only one component in this list, the *root component* of the application. <br /> Angular can launch with multiple bootstrap components, each with its own location in the host web page. |
| `bootstrap` | 自动引导的组件列表。<br />通常此列表中只有一个组件，即应用程序的*根组件*。<br />Angular 可以用多个引导组件启动，每个组件在宿主网页中都有自己的位置。 |

## More on NgModules

## 关于 NgModule 的更多知识

You may also be interested in the following:

你可能还对下列内容感兴趣：

* [Feature Modules](guide/feature-modules)

  [特性模块](guide/feature-modules)

* [Entry Components](guide/entry-components)

  [入口组件](guide/entry-components)

* [Providers](guide/providers)

  [服务提供者](guide/providers)

* [Types of Feature Modules](guide/module-types)

  [特性模块的分类](guide/module-types)

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28