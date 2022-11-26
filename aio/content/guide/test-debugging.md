# Debugging tests

# 调试测试代码

If your tests aren't working as you expect them to, you can inspect and debug them in the browser.

如果你的测试没能如预期般工作，可以在浏览器中查看和调试它们。

Debug specs in the browser in the same way that you debug an application.

在浏览器中调试这些测试规约的方式与调试应用时相同。

1. Reveal the Karma browser window.
   See [Set up testing](guide/testing#set-up-testing) if you need help with this step.

   打开 Karma 的浏览器窗口。如果需要帮助，请参阅[“设置测试”](guide/testing#set-up-testing)。

1. Click the **DEBUG** button to open a new browser tab and re-run the tests.

   单击**DEBUG**按钮以打开新的浏览器选项卡并重新运行测试。

2. Open the browser's **Developer Tools**. On Windows, press `Ctrl-Shift-I`. On macOS, press `Command-Option-I`.

   打开浏览器的**开发者工具**。在 Windows 上，按 `Ctrl-Shift-I` 。在 macOS 上，按 `Command-Option-I` 。

3. Pick the **Sources** section.

   选择**Sources**部分。

4. Press `Control/Command-P`, and then start typing the name of your test file to open it.

   按 `Control/Command-P` ，然后开始键入测试文件的名称以打开它。

5. Set a breakpoint in the test.

   在测试中设置一个断点。

6. Refresh the browser, and notice how it stops at the breakpoint.

   刷新浏览器，注意它会在这个断点处停下来。

<div class="lightbox">

<img alt="Karma debugging" src="generated/images/guide/testing/karma-1st-spec-debug.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28