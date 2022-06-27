# Debugging tests

# 调试测试代码

If your tests aren't working as you expect them to, you can inspect and debug them in the browser.

如果你的测试没能如预期般工作，可以在浏览器中查看和调试它们。

Debug specs in the browser in the same way that you debug an application.

在浏览器中调试这些测试规约的方式与调试应用时相同。

1. Reveal the Karma browser window.
   See [Set up testing](guide/testing#set-up-testing) if you need help with this step.

   打开 Karma 的浏览器窗口。如果需要帮助，请参阅[“设置测试”](guide/testing#set-up-testing)。

1. Click the **DEBUG** button; it opens a new browser tab and re-runs the tests.

   单击 **DEBUG** 按钮；它会打开一个新的浏览器选项卡并重新运行测试。

1. Open the browser's "Developer Tools" (`Ctrl-Shift-I` on Windows; `Command-Option-I` in macOS).

   打开浏览器的 “Developer Tools”（Windows 上的 `Ctrl-Shift-I` ; macOS 上的 `Command-Option-I`。

1. Pick the "sources" section.

   选择 “sources” 页。

1. Open the `1st.spec.ts` test file (Control/Command-P, then start typing the name of the file).

   打开 `1st.spec.ts` 测试文件（Control/Command-P，然后开始输入该文件的名字）。

1. Set a breakpoint in the test.

   在测试中设置一个断点。

1. Refresh the browser, and it stops at the breakpoint.

   刷新浏览器，它会在这个断点处停下来。

<div class="lightbox">

<img alt="Karma debugging" src="generated/images/guide/testing/karma-1st-spec-debug.png">

</div>

<!-- links -->

<!-- external links -->

<!-- end links -->

@reviewed 2022-02-28