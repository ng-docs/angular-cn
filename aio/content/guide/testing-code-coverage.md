<a id="code-coverage"></a>

# Find out how much code you're testing

# 找出你要测试多少代码

The CLI can run unit tests and create code coverage reports.
Code coverage reports show you any parts of your code base that might not be properly tested by your unit tests.

CLI 可以运行单元测试并创建代码覆盖率报告。代码覆盖率报告会向你展示代码库中可能无法通过单元测试进行正确测试的任意部位。

<div class="alert is-helpful">

If you'd like to experiment with the application that this guide describes, <live-example name="testing" noDownload>run it in your browser</live-example> or <live-example name="testing" downloadOnly>download and run it locally</live-example>.

</div>

To generate a coverage report run the following command in the root of your project.

要生成覆盖率报告，请在项目的根目录下运行以下命令。

<code-example format="shell" language="shell">

ng test --no-watch --code-coverage

</code-example>

When the tests are complete, the command creates a new `/coverage` folder in the project.
Open the `index.html` file to see a report with your source code and code coverage values.

测试完成后，该命令会在项目中创建一个 `/coverage` 目录。打开 `index.html` 文件，可以查看带有源代码和代码覆盖率值的报表。

If you want to create code-coverage reports every time you test, set the following option in the CLI configuration file, `angular.json`:

如果要在每次测试时都创建代码覆盖率报告，可以在 CLI 配置文件 `angular.json` 中设置以下选项：

<code-example format="json" language="json">

"test": {
  "options": {
    "codeCoverage": true
  }
}

</code-example>

## Code coverage enforcement

## 代码覆盖的实施

The code coverage percentages let you estimate how much of your code is tested.
If your team decides on a set minimum amount to be unit tested, enforce this minimum with the Angular CLI.

代码覆盖率可以让你估算出你的代码测试了多少。如果你的团队确定要设置单元测试的最小覆盖率，可以使用 Angular CLI 来强制实施这个最低要求。

For example, suppose you want the code base to have a minimum of 80% code coverage.
To enable this, open the [Karma](https://karma-runner.github.io) test platform configuration file, `karma.conf.js`, and add the `check` property in the `coverageReporter:` key.

例如，假设你希望代码库的代码覆盖率至少达到 80％。要启用此功能，请打开 [Karma](https://karma-runner.github.io) 测试平台的配置文件 `karma.conf.js`，并在 `coverageReporter:` 键下添加 `check` 属性。

<code-example format="javascript" language="javascript">

coverageReporter: {
  dir: require('path').join(__dirname, './coverage/&lt;project-name&gt;'),
  subdir: '.',
  reporters: [
    { type: 'html' },
    { type: 'text-summary' }
  ],
  check: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80
    }
  }
}

</code-example>

The `check` property causes the tool to enforce a minimum of 80% code coverage when the unit tests are run in the project.

`check` 属性会让该工具在项目中运行单元测试时强制要求至少 80％的代码覆盖率。

Find more information about the different coverage configuration options [here](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md).

可以在[此处](https://github.com/karma-runner/karma-coverage/blob/master/docs/configuration.md)找到关于其它覆盖率配置项的更多信息。

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28