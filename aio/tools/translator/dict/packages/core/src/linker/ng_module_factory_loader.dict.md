Use `getNgModuleById` instead.

改用 `getNgModuleById`。

Returns the NgModuleFactory with the given id \(specified using [&commat;NgModule.id
field](api/core/NgModule#id)\), if it exists and has been loaded. Factories for NgModules that do
not specify an `id` cannot be retrieved. Throws if an NgModule cannot be found.

返回具有给定 id 的 NgModuleFactory（如果存在并且已加载）。无法检索未指定过 `id`
的模块工厂。如果找不到模块，则抛出该异常。

Returns the NgModule class with the given id \(specified using [&commat;NgModule.id
field](api/core/NgModule#id)\), if it exists and has been loaded. Classes for NgModules that do
not specify an `id` cannot be retrieved. Throws if an NgModule cannot be found.

返回具有给定 id（使用[&commat;NgModule.id 字段](api/core/NgModule#id)指定）的 NgModule
类（如果存在并且已加载）。无法检索未指定 `id` 的 NgModules 类。如果找不到 NgModule，则抛出。