# Getting started with standalone components

# 独立组件入门

In v14 and higher, **standalone components** provide a simplified way to build Angular applications. Standalone components, directives, and pipes aim to streamline the authoring experience by reducing the need for `NgModule`s. Existing applications can optionally and incrementally adopt the new standalone style without any breaking changes.

在 v14 及更高版本中，**独立组件**提供了一种简化的方式来构建 Angular 应用程序。独立组件、指令和管道旨在通过减少对 `NgModule` 的需求来简化创作体验。现有应用程序可以选择性地以增量方式采用新的独立风格，而无需任何重大更改。

<div class="alert is-important">

The standalone component feature is available for developer preview. 
It's ready for you to try; but it might change before it is stable.

独立组件特性可用于开发人员预览。它已准备好供你尝试；但它可能会在稳定之前发生变化。

</div>

## Creating standalone components

## 创建独立组件

### The `standalone` flag and component `imports`

### `standalone` 标志和组件 `imports`

Components, directives, and pipes can now be marked as `standalone: true`. Angular classes marked as standalone do not need to be declared in an `NgModule` (the Angular compiler will report an error if you try).

组件、指令和管道现在可以标记为 `standalone: true`。标记为独立的 Angular 类不需要在 `NgModule` 中声明（如果你尝试，Angular 编译器会报告错误）。

Standalone components specify their dependencies directly instead of getting them through `NgModule`s. For example, if `PhotoGalleryComponent` is a standalone component, it can directly import another standalone component `ImageGridComponent`:

独立组件直接指定它们的依赖项，而不是通过 `NgModule` 获取它们。例如，如果 `PhotoGalleryComponent` 是独立组件，它可以直接导入另一个独立组件 `ImageGridComponent` ：

```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  imports: [ImageGridComponent],
  template: `
    ... <image-grid [images]="imageList"></image-grid>
  `,
})
export class PhotoGalleryComponent {
  // component logic
}
```

`imports` can also be used to reference standalone directives and pipes. In this way, standalone components can be written without the need to create an `NgModule` to manage template dependencies.

`imports` 也可用于引用独立指令和管道。通过这种方式，可以编写独立组件，而无需创建 `NgModule` 来管理模板依赖项。

### Using existing NgModules in a standalone component

### 在独立组件中使用现有的 NgModules

When writing a standalone component, you may want to use other components, directives, or pipes in the component's template. Some of those dependencies might not be marked as standalone, but instead declared and exported by an existing `NgModule`. In this case, you can import the `NgModule` directly into the standalone component:

编写独立组件时，你可能希望在组件的模板中使用其他组件、指令或管道。其中某些依赖项可能不会标记为独立，而是由现有的 `NgModule` 声明和导出。在这种情况下，你可以将 `NgModule` 直接导入到独立组件中：

```ts
@Component({
  standalone: true,
  selector: 'photo-gallery',
  // an existing module is imported directly into a standalone component
  imports: [MatButtonModule],
  template: `
    ...
    <button mat-button>Next Page</button>
  `,
})
export class PhotoGalleryComponent {
  // logic
}
```

You can use standalone components with existing `NgModule`-based libraries or dependencies in your template. Standalone components can take full advantage of the existing ecosystem of Angular libraries.

你可以在模板中将独立组件与现有的基于 `NgModule` 的库或依赖项一起使用。独立组件可以充分利用现有的 Angular 库生态系统。

## Using standalone components in NgModule-based applications

## 在基于 NgModule 的应用程序中使用独立组件

Standalone components can also be imported into existing NgModules-based contexts. This allows existing applications (which are using NgModules today) to incrementally adopt the new, standalone style of component.

独立组件也可以导入到现有的基于 NgModules 的上下文中。这允许现有应用程序（今天使用 NgModules）逐步采用新的独立风格的组件。

You can import a standalone component (or directive, or pipe) just like you would an `NgModule` - using `NgModule.imports`:

你可以像导入 `NgModule` 一样导入独立组件（或指令或管道）- 使用 `NgModule.imports` ：

```ts
@NgModule({
  declarations: [AlbumComponent],
  exports: [AlbumComponent], 
  imports: [PhotoGalleryComponent],
})
export class AlbumModule {}
```

## Bootstrapping an application using a standalone component

## 使用独立组件引导应用程序

An Angular application can be bootstrapped without any `NgModule` by using a standalone component as the application's root component. This is done using the `bootstrapApplication` API:

通过使用独立组件作为应用程序的根组件，可以在没有任何 `NgModule` 的情况下引导 Angular 应用程序。这是使用 `bootstrapApplication` API 来完成的：

```ts
// in the main.ts file
import {bootstrapApplication} from '@angular/platform-browser';
import {PhotoAppComponent} from './app/photo.app.component';

bootstrapApplication(PhotoAppComponent);
```

### Configuring dependency injection

### 配置依赖注入

When bootstrapping an application, often you want to configure Angular’s dependency injection and provide configuration values or services for use throughout the application. You can pass these as providers to `bootstrapApplication`:

引导应用程序时，你通常希望配置 Angular 的依赖注入并提供配置值或服务以在整个应用程序中使用。你可以将这些作为提供者传递给 `bootstrapApplication` ：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    // ...
  ]
});
```

The standalone bootstrap operation is based on explicitly configuring a list of `Provider`s for dependency injection. However, existing libraries may rely on `NgModule`s for configuring DI. For example, Angular’s router uses the `RouterModule.forRoot()` helper to set up routing in an application. You can use these existing `NgModule`s in `bootstrapApplication` via the `importProvidersFrom` utility:

独立的引导操作基于显式配置 `Provider` 列表以进行依赖注入。但是，现有的库可能依赖 `NgModule` 来配置 DI。例如，Angular 的路由器使用 `RouterModule.forRoot()` 帮助器在应用程序中设置路由。你可以通过 `importProvidersFrom` 实用程序在 `bootstrapApplication` 中使用这些现有的 `NgModule` ：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    importProvidersFrom(
      RouterModule.forRoot([/* app routes */]),
    ),
    // ...
  ]
});
```

## Routing and lazy-loading

## 路由和惰性加载

The router APIs were updated and simplified to take advantage of the standalone components: an `NgModule` is no longer required in many common, lazy-loading scenarios.

路由器 API 进行了更新和简化，以利用独立组件的优势：在许多常见的惰性加载场景中不再需要 `NgModule`。

### Lazy loading a standalone component

### 惰性加载独立组件

Any route can lazily load its routed, standalone component by using `loadComponent`:

任何路由都可以用 `loadComponent` 惰性加载其路由到的独立组件：

```ts
export const ROUTES: Route[] = [
  {path: 'admin', loadComponent: () => import('./admin/panel.component').then(mod => mod.AdminPanelComponent)},
  // ...
];
```

This works as long as the loaded component is standalone.

只要加载的组件是独立的，就可以用。

### Lazy loading many routes at once

### 一次惰性加载多个路由

The `loadChildren` operation now supports loading a new set of child `Route`s without needing to write a lazy loaded `NgModule` that imports `RouterModule.forChild` to declare the routes. This works when every route loaded this way is using a standalone component.

`loadChildren` 操作现在支持加载一组新的子 `Route`，而无需编写惰性加载的 `NgModule` 来导入 `RouterModule.forChild` 来声明路由。当以这种方式加载的每个路由都使用独立组件时，这会起作用。

```ts
// In the main application:
export const ROUTES: Route[] = [
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ...
];

// In admin/routes.ts:
export const ADMIN_ROUTES: Route[] = [
  {path: 'home', component: AdminHomeComponent},
  {path: 'users', component: AdminUsersComponent},
  // ...
];
```

### Providing services to a subset of routes

### 为路由的子集提供服务

The lazy loading API for `NgModule`s (`loadChildren`) creates a new "module" injector when it loads the lazily loaded children of a route. This feature was often useful to provide services only to a subset of routes in the application. For example, if all routes under `/admin` were scoped using a `loadChildren` boundary, then admin-only services could be provided only to those routes. Doing this required using the `loadChildren` API, even if lazy loading of the routes in question was unnecessary.

`NgModule` 的惰性加载 API ( `loadChildren` ) 在加载路由的惰性加载的子项时会创建一个新的“模块”注入器。此特性通常可用于仅向应用程序中的一部分路由提供服务。例如，如果 `/admin` 下的所有路由都使用 `loadChildren` 边界来限定范围，则可以仅向这些路由提供仅限管理的服务。执行此操作需要使用 `loadChildren` API，即使惰性加载有问题的路由不是必要的。

The Router now supports explicitly specifying additional `providers` on a `Route`, which allows this same scoping without the need for either lazy loading or `NgModule`s. For example, scoped services within an `/admin` route structure would look like:

路由器现在支持在 `Route` 上显式指定其他 `providers`，这允许相同的范围限定，而无需惰性加载或 `NgModule`。例如，`/admin` 路由结构中的范围服务将类似于：

```ts
export const ROUTES: Route[] = [
  {
    path: 'admin',
    providers: [
      AdminService,
      {provide: ADMIN_API_KEY, useValue: '12345'},
    ],
    children: [
      path: 'users', component: AdminUsersComponent,
      path: 'teams', component: AdminTeamsComponent,
    ],
  },
  // ... other application routes that don't
  //     have access to ADMIN_API_KEY or AdminService.
];
```

It's also possible to combine `providers` with `loadChildren` of additional routing configuration, to achieve the same effect of lazy loading an `NgModule` with additional routes and route-level providers. This example configures the same providers/child routes as above, but behind a lazy loaded boundary:

也可以将 `providers` 与额外路由配置的 `loadChildren` 结合使用，以实现与惰性加载带有额外路由和路由级服务提供者的 `NgModule` 相同的效果。此示例配置与上面相同的提供者/子路由，但在惰性加载边界之后：

```ts
// Main application:
export const ROUTES: Route[] = {
  // Lazy-load the admin routes.
  {path: 'admin', loadChildren: () => import('./admin/routes').then(mod => mod.ADMIN_ROUTES)},
  // ... rest of the routes
}

// In admin/routes.ts:
export const ADMIN_ROUTES: Route[] = [{
  path: '',
  pathMatch: 'prefix',
  providers: [
    AdminService,
    {provide: ADMIN_API_KEY, useValue: 12345},
  ],
  children: [
    {path: 'users', component: AdminUsersCmp},
    {path: 'teams', component: AdminTeamsCmp},
  ],
}];
```

Note the use of an empty-path route to host `providers` that are shared among all the child routes.

请注意这里使用了空路径路由来定义供所有子路由共享的宿主 `providers`。

## Advanced topics

## 高级主题

This section goes into more details that are relevant only to more advanced usage patterns. You can safely skip this section when learning about standalone components, directives, and pipes for the first time. 

本节会更详细地介绍仅与更高级的使用模式相关的。第一次了解独立组件、指令和管道时，你可以安全地跳过本节。

### Standalone components for library authors

### 针对库作者的独立组件

Standalone components, directives, and pipes can be exported from `NgModule`s that import them:

独立的组件、指令和管道可以从导入它们的 `NgModule` 中导出：

```ts
@NgModule({
  imports: [ImageCarouselComponent, ImageSlideComponent],
  exports: [ImageCarouselComponent, ImageSlideComponent],
})
export class CarouselModule {}
```

This pattern is useful for Angular libraries that publish a set of cooperating directives. In the above example, both the `ImageCarouselComponent` and `ImageSlideComponent` need to be present in a template to build up one logical "carousel widget". 

此模式对于发布一组合作指令的 Angular 库很有用。在上面的示例中，`ImageCarouselComponent` 和 `ImageSlideComponent` 需要出现在模板中，以构建一个逻辑上的“轮播小部件”。

As an alternative to publishing a `NgModule`, library authors might want to export an array of cooperating directives:

作为发布 `NgModule` 的替代方案，库作者可能希望导出一个合作指令数组：

```ts
export CAROUSEL_DIRECTIVES = [ImageCarouselComponent, ImageSlideComponent] as const;
```

Such an array could be imported by applications using `NgModule`s and added to the `@NgModule.imports`. Please note the presence of the TypeScript’s `as const` construct: it gives Angular compiler additional information required for proper compilation and is a recommended practice (as it makes the exported array immutable from the TypeScript point of view).

这样的数组可以由使用 `NgModule` 的应用程序导入并添加到 `@NgModule.imports`。请注意 TypeScript 的 `as const` 构造的存在：它为 Angular 编译器提供了正确编译所需的额外信息，并且是一种推荐的实践（因为它使导出的数组从 TypeScript 的角度来看是不可变的）。

### Dependency injection and injectors hierarchy

### 依赖注入和注入器层次结构

Angular applications can configure dependency injection by specifying a set of available providers. In a typical application, there are two different injector types:

Angular 应用程序可以通过指定一组可用的提供者来配置依赖注入。在典型应用中，有两种不同的注入器类型：

* **module injector** with providers configured in `@NgModule.providers` or `@Injectable({providedIn: "..."})`. Those application-wide providers are visible to all components in as well as to other services configured in a module injector.

  具有在 `@NgModule.providers` 或 `@Injectable({providedIn: "..."})` 中配置的服务提供者的**模块注入器**。这些应用程序范围的提供者对模块注入器中配置的所有组件以及其他服务可见。

* **node injectors** configured in `@Directive.providers` / `@Component.providers` or `@Component.viewProviders`. Those providers are visible to a given component and all its children only.

  在 `@Directive.providers` / `@Component.providers` 或 `@Component.viewProviders` 中配置的**节点注入器**。这些提供程序仅对给定组件及其所有子项可见。

#### Environment injectors

#### 环境注入器

Making `NgModule`s optional will require new ways of configuring "module" injectors with application-wide providers (for example, [HttpClient](https://angular.io/api/common/http/HttpClient)). In the standalone application (one created with `bootstrapApplication`), “module” providers can be configured during the bootstrap process, in the `providers` option: 

使 `NgModule` 变成可选的将需要一种新方法来用应用程序范围的提供者（例如[HttpClient](https://angular.io/api/common/http/HttpClient)）配置“模块”注入器。在独立应用程序（使用 `bootstrapApplication` 创建的）中，可以在引导过程中在 `providers` 选项中配置“模块”提供程序：

```ts
bootstrapApplication(PhotoAppComponent, {
  providers: [
    {provide: BACKEND_URL, useValue: 'https://photoapp.looknongmodules.com/api'},
    {provide: PhotosService, useClass: PhotosService},
    // ...
  ]
});
```

The new bootstrap API gives us back the means of configuring “module injectors” without using `NgModule`s. In this sense, the “module” part of the name is no longer relevant and we’ve decided to introduce a new term: “environment injectors”. 

新的引导 API 为我们提供了在不使用 `NgModule` 的情况下配置“模块注入器”的方法。从这个意义上说，名称的“模块”部分不再相关，我们决定引入一个新术语：“环境注入器”。

Environment injectors can be configured using one of the following:

可以用以下方法之一配置环境注入器：

* `@NgModule.providers` (in applications bootstrapping through an `NgModule`);

  `@NgModule.providers`（在通过 `NgModule` 引导的应用程序中）；

* `@Injectable({provideIn: "..."})`(in both the NgModule-based as well as “standalone” applications);

  `@Injectable({provideIn: "..."})`（在基于 NgModule 以及“独立”应用程序中）；

* `providers` option in the `bootstrapApplication` call (in fully “standalone” applications);

  `bootstrapApplication` 调用中的 `providers` 选项（在完全“独立”的应用程序中）；

* `providers` field in a `Route` configuration.

  `Route` 配置中的 `providers` 字段。

Angular v14 introduces a new TypeScript type `EnvironmentInjector` to represent this new naming. The accompanying `createEnvironmentInjector` API makes it possible to create environment injectors programmatically: 

Angular v14 引入了一种新的 TypeScript 类型 `EnvironmentInjector` 来表示这种新命名。附带的 `createEnvironmentInjector` API 使得以编程方式创建环境注入器成为可能：

```ts
import {createEnvironmentInjector} from '@angular/core';

const parentInjector = … // existing environment injector
const childInjector = createEnvironmentInjector([{provide: PhotosService, useClass: CustomPhotosService}], parentInjector);
```

Environment injectors have one additional capability: they can execute initialization logic when an environment injector gets created (similar to the `NgModule` constructors that get executed when a module injector is created):

环境注入器还有一个额外的能力：它们可以在创建环境注入器时执行初始化逻辑（类似于创建模块注入器时执行的 `NgModule` 构造函数）：

```ts
import {createEnvironmentInjector, ENVIRONMENT_INITIALIZER} from '@angular/core';

createEnvironmentInjector([
{provide: PhotosService, useClass: CustomPhotosService},
{provide: ENVIRONMENT_INITIALIZER, useValue: () => {
        console.log("This function runs when this EnvironmentInjector gets created");
}}
]);
```

#### Standalone injectors

#### 独立注入器

In reality, the dependency injectors hierarchy is slightly more elaborate in applications using standalone components. Let’s consider the following example:

实际上，依赖注入器层次结构在使用独立组件的应用程序中稍微复杂一些。让我们考虑以下示例：

```ts
// an existing "datepicker" component with an NgModule
@Component({
  selector: 'datepicker',
  template: '...',
})
class DatePickerComponent {
  constructor(private calendar: CalendarService) {}
}

@NgModule({
  declarations: [DatePickerComponent],
  exports: [DatePickerComponent]
  providers: [CalendarService],
})
class DatePickerModule {
}

@Component({
  selector: 'date-modal',
  template: '<datepicker></datepicker>',
  standalone: true,
  imports: [DatePickerModule]
})
class DateModalComponent {
}
```

In the above example, the component `DateModalComponent` is standalone - it can be consumed directly and has no NgModule which needs to be imported in order to use it. However, `DateModalComponent` has a dependency, the `DatePickerComponent,` which is imported via its NgModule (the `DatePickerModule`). This NgModule may declare providers (in this case: `CalendarService`) which are required for the `DatePickerComponent` to function correctly.

在上面的示例中，组件 `DateModalComponent` 是独立的 - 它可以直接使用，并且没有需要导入才能使用它的 NgModule。但是，`DateModalComponent` 有一个依赖项 `DatePickerComponent`，它是通过其 NgModule（`DatePickerModule`）导入的。此 NgModule 可以声明 `DatePickerComponent` 正常运行所需的提供者（在本例中为：`CalendarService`）。

When Angular creates a standalone component, it needs to know that the current injector has all of the necessary services for the standalone component's dependencies, including those based on NgModules. To guarantee that, in some cases Angular will create a new "standalone injector" as a child of the current environment injector. Today, this happens for all bootstrapped standalone components: it will be a child of the root environment injector. The same rule applies to the dynamically created (for example, by the router or the `ViewContainerRef` API) standalone components. 

当 Angular 创建独立组件时，它需要知道当前注入器具有独立组件依赖项的所有必要服务，包括基于 NgModules 的服务。为了保证这一点，在某些情况下，Angular 会创建一个新的“独立注入器”作为当前环境注入器的子项。今天，这种情况发生在所有引导的独立组件上：它将是根环境注入器的子项。相同的规则适用于动态创建的（例如，由路由器或 `ViewContainerRef` API）独立组件。

A separate standalone injector is created to ensure that providers imported by a standalone component are “isolated” from the rest of the application. This lets us think of standalone components as truly self-contained pieces that can’t “leak” their implementation details to the rest of the application.

创建了一个单独的独立注入器，以确保独立组件导入的提供程序与应用程序的其余部分“隔离”。这让我们将独立组件视为真正独立的部分，不能将它们的实现细节“泄漏”给应用程序的其余部分。