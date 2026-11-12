/* Qadence content · interview question bank · automation (general + Selenium), Playwright, coding, behavioural.
   String fields use template literals so code samples can contain both quote styles. */
QA_CONTENT.addInterview([
  /* ───────────── automation (general + Selenium) ───────────── */
  {
    id: 'iq-aut-01', cat: 'automation', level: 'beginner', freq: 'very-common',
    q: `Which test cases would you automate, and which would you keep manual?`,
    short: `Automate stable, repeatable, high-value checks — regression, smoke, data-driven and cross-browser runs. Keep exploratory, usability, one-off and rapidly changing areas manual.`,
    answer: `I decide by return on investment and risk, not by a blanket rule.<br><b>Good automation candidates:</b> the regression suite that runs every release, smoke checks on each build, data-driven cases (the same login flow with 30 data sets), cross-browser runs and API checks. They are stable, repeated often and costly to do by hand.<br><b>Better kept manual:</b> exploratory testing, usability and look-and-feel judgements, features whose UI changes every sprint, one-time checks, and things that are hard to automate reliably, such as CAPTCHA or physical device behaviour.<br>For example, on a ShopFlow checkout I would automate login, add-to-cart and payment happy paths plus key negative cases, but explore a newly redesigned promo banner manually first. Automation does not replace manual testing — it frees testers to spend their time where human judgement matters.`,
    followups: [`How would you estimate the ROI of automating a test?`, `Would you automate a feature that still changes every sprint?`, `Can you automate CAPTCHA? What would you do instead?`],
    mistakes: [`Saying “automate 100% of test cases” — it is neither possible nor cost-effective.`, `Choosing tests by how easy they are to script rather than by value, frequency and stability.`],
    lesson: 'au-what-to-automate'
  },
  {
    id: 'iq-aut-02', cat: 'automation', level: 'beginner', freq: 'common',
    q: `What is the test automation pyramid and why does it matter?`,
    short: `A model that suggests many fast unit tests at the base, fewer API/integration tests in the middle and a small number of slow end-to-end UI tests at the top.`,
    answer: `The pyramid is a guide for balancing an automated suite.<br><b>Base — unit tests:</b> the most numerous. They are fast, cheap and point straight at the broken function. Usually written by developers.<br><b>Middle — API, service and integration tests:</b> check business rules and contracts between components without a browser, so they are much faster and more stable than UI tests.<br><b>Top — end-to-end UI tests:</b> a small set covering critical journeys such as login, search and checkout. They give the most realistic confidence but are slow, costly to maintain and more prone to flakiness.<br>The inverted shape — the “ice-cream cone”, with hundreds of UI tests and few unit tests — gives slow feedback and fragile pipelines. As a tester I apply the idea by pushing checks down a layer when possible: if a discount rule can be verified through the API, I don’t need ten UI tests for it.`,
    followups: [`Where would contract tests sit in the pyramid?`, `What is the ice-cream cone anti-pattern?`],
    mistakes: [`Treating the pyramid as a strict ratio rather than a guideline.`, `Saying the top layer is the most important because it is closest to the user.`],
    lesson: 'au-what-to-automate'
  },
  {
    id: 'iq-aut-03', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `What types of test automation frameworks are there? Explain data-driven, keyword-driven, hybrid and BDD.`,
    short: `Linear and modular frameworks script steps; data-driven separates test data from logic; keyword-driven maps action words to code; hybrid combines approaches; BDD writes behaviour in Gherkin and binds it to code.`,
    answer: `<b>Linear / record-and-playback:</b> steps scripted one after another — quick to start, painful to maintain.<br><b>Modular:</b> reusable functions or page objects for parts of the app.<br><b>Data-driven:</b> the same test logic runs with many data sets from Excel, CSV, JSON or a TestNG <code>@DataProvider</code> — one login test, 20 credential combinations.<br><b>Keyword-driven:</b> actions are written as keywords (<code>openBrowser</code>, <code>enterText</code>, <code>click</code>) in a table, and an engine maps each keyword to code, so non-programmers can compose tests.<br><b>Hybrid:</b> the most common in practice — usually Page Object Model plus data-driven, with utilities for configuration, waits and reporting.<br><b>BDD:</b> Given/When/Then scenarios (Cucumber, SpecFlow) bound to step definitions. Its main value is shared understanding with business people.<br>In an interview, name the type you actually used and explain why it suited your team.`,
    followups: [`Which framework type did you use, and why?`, `What are the downsides of a keyword-driven framework?`],
    mistakes: [`Confusing a tool (Selenium, TestNG) with a framework design.`, `Calling BDD a testing tool rather than a collaboration practice.`],
    lesson: 'au-pom'
  },
  {
    id: 'iq-aut-04', cat: 'automation', level: 'intermediate', freq: 'very-common',
    q: `Can you explain the automation framework structure used in your project?`,
    short: `Walk through the layers: language and test runner, page objects, test classes, test data, configuration, utilities (waits, screenshots), reporting and CI execution — and be honest about which parts you built.`,
    answer: `Interviewers want a clear, layered walkthrough rather than a list of buzzwords. A typical Selenium + Java answer:<br>1. <b>Stack:</b> Java, Selenium WebDriver, TestNG, Maven for dependencies and builds.<br>2. <b>Pages:</b> Page Object Model — one class per page with its locators and actions.<br>3. <b>Tests:</b> TestNG classes grouped as smoke and regression, extending a <code>BaseTest</code> that starts and quits the driver.<br>4. <b>Data and config:</b> URLs, browser and credentials from properties files or environment variables; test data via <code>@DataProvider</code> or JSON.<br>5. <b>Utilities:</b> explicit-wait helpers, a TestNG listener that takes a screenshot on failure, logging.<br>6. <b>Reporting:</b> Extent or Allure reports.<br>7. <b>Execution:</b> runs headless and in parallel from Jenkins or GitHub Actions on each merge.<br>Say which parts you designed and which you inherited. A fresher should describe a portfolio framework they really built — never claim a project you did not do.`,
    followups: [`How do you switch between environments such as QA and staging?`, `How does your framework capture a screenshot on failure?`, `What would you improve in that framework?`],
    mistakes: [`Reciting tool names without explaining how the layers connect.`, `Claiming you designed a framework you only used — follow-up questions expose it quickly.`],
    lesson: 'au-pom'
  },
  {
    id: 'iq-aut-05', cat: 'automation', level: 'intermediate', freq: 'very-common',
    q: `What is the Page Object Model, and how is Page Factory different?`,
    short: `POM is a design pattern: one class per page holding its locators and actions, so tests call meaningful methods instead of raw locators. Page Factory is an optional Selenium Java helper that initialises @FindBy fields lazily.`,
    answer: `<b>Page Object Model</b> is a design pattern, not a library. Each page or component gets a class that owns its locators and exposes meaningful actions, such as <code>loginPage.loginAs(user, pass)</code>. Tests read like user journeys and hold the assertions. When a locator changes, I fix it in one place instead of in 40 tests.<br><b>Page Factory</b> is Selenium Java’s built-in support for POM: fields are annotated with <code>@FindBy(id = "username")</code> and initialised with <code>PageFactory.initElements(driver, this)</code>. Each field is a proxy that locates the element when it is used.<br>Many teams now prefer plain <code>By</code> locators plus explicit waits inside page objects, because Page Factory hides when lookups happen, and fields marked <code>@CacheLookup</code> can go stale after the page re-renders. POM is the essential idea; Page Factory is just one way to implement it.`,
    followups: [`Should page objects contain assertions?`, `How do you model a header or menu that appears on every page?`, `What does @CacheLookup do, and when is it risky?`],
    mistakes: [`Saying POM and Page Factory are the same thing.`, `Burying assertions and hard-coded test data inside page classes so they cannot be reused.`],
    lesson: 'au-pom'
  },
  {
    id: 'iq-aut-06', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `Explain the Selenium WebDriver architecture.`,
    short: `Test code calls the language bindings, which send W3C WebDriver commands over HTTP to a browser-specific driver (chromedriver, geckodriver). The driver controls the real browser and returns the response.`,
    answer: `In Selenium 4 the flow has four parts:<br>1. <b>Language bindings</b> — the Java (or Python, C#, JavaScript) API you code against: <code>driver.findElement(By.id("email")).sendKeys("ali@test.pk")</code>.<br>2. <b>W3C WebDriver protocol</b> — each call becomes a standard HTTP request with a JSON body, such as “find element” or “element click”. Selenium 3 used the older JSON Wire Protocol; Selenium 4 is fully W3C-compliant, so behaviour is more consistent across browsers.<br>3. <b>Browser driver</b> — chromedriver, geckodriver, msedgedriver or safaridriver: a small server that receives the commands and translates them into the browser’s native automation.<br>4. <b>Browser</b> — performs the action, and the result travels back the same way.<br>With Selenium Grid, a Grid server sits between the client and the drivers and routes each session to a suitable node. Since Selenium 4.6, Selenium Manager finds and downloads the matching driver automatically.`,
    followups: [`What changed when Selenium moved from the JSON Wire Protocol to W3C?`, `Does Selenium talk to the browser directly?`],
    mistakes: [`Saying Selenium controls the browser directly without a driver in between.`, `Describing the JSON Wire Protocol as the current standard.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-07', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `What are the main new features in Selenium 4?`,
    short: `Full W3C WebDriver compliance, relative locators, a new window/tab API, element screenshots, DevTools/BiDi access, a redesigned Grid, Duration-based waits and Selenium Manager for drivers.`,
    answer: `The changes worth mentioning:<br>• <b>W3C protocol</b> end to end, replacing the JSON Wire Protocol.<br>• <b>Relative locators:</b> <code>RelativeLocator.with(By.tagName("input")).below(By.id("email"))</code> — handy when an element has no good attributes.<br>• <b>New window/tab API:</b> <code>driver.switchTo().newWindow(WindowType.TAB)</code>.<br>• <b>Element screenshots:</b> <code>element.getScreenshotAs(OutputType.FILE)</code>.<br>• <b>DevTools and BiDi access</b> for network interception, console logs and geolocation emulation.<br>• <b>Redesigned Grid</b> with standalone, hub-and-node and fully distributed modes, plus Docker support.<br>• <b>Waits take a <code>Duration</code>:</b> <code>new WebDriverWait(driver, Duration.ofSeconds(10))</code>; the old constructor that took plain seconds was deprecated.<br>• <b>Selenium Manager</b> (since 4.6) resolves browser drivers automatically, so manual driver downloads are usually unnecessary.<br>Browser options classes such as <code>ChromeOptions</code> also replaced most <code>DesiredCapabilities</code> usage.`,
    followups: [`When would you use a relative locator?`, `How would you capture network traffic in Selenium 4?`],
    mistakes: [`Listing Selenium IDE or Selenium RC features as Selenium 4 WebDriver features.`, `Still writing new WebDriverWait(driver, 10) in a Selenium 4 answer.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-08', cat: 'automation', level: 'beginner', freq: 'very-common',
    q: `What locator strategies does Selenium support, and which do you prefer?`,
    short: `Eight By strategies: id, name, className, tagName, linkText, partialLinkText, cssSelector and xpath. I prefer a unique, stable id or a dedicated test attribute, then short CSS, and XPath when I need text or relationships.`,
    answer: `Selenium’s <code>By</code> class offers eight strategies: <code>id</code>, <code>name</code>, <code>className</code>, <code>tagName</code>, <code>linkText</code>, <code>partialLinkText</code>, <code>cssSelector</code> and <code>xpath</code>; Selenium 4 adds relative locators on top.<br>My order of preference is about <b>stability</b>, not speed:<br>1. A unique, stable <code>id</code>, or a test attribute agreed with developers: <code>By.cssSelector("[data-testid='login-btn']")</code>.<br>2. <code>name</code> for form fields when it is unique.<br>3. A short CSS selector built on meaningful attributes.<br>4. XPath when I need visible text, or need to move from a known element to a related one — for example the Cancel button in the row containing “Order #1042”.<br>I avoid auto-generated ids, long absolute paths, index-based selectors and styling classes that change with redesigns. Before using a locator I check in DevTools that it matches exactly one element.`,
    followups: [`What do you do if an element has no id or name?`, `How do you verify a locator in the browser before using it?`],
    mistakes: [`Saying XPath is always best because it can find anything.`, `Copying the absolute XPath that browser DevTools generates.`],
    lesson: 'au-locators'
  },
  {
    id: 'iq-aut-09', cat: 'automation', level: 'beginner', freq: 'very-common',
    q: `What is the difference between absolute and relative XPath, and when would you choose XPath over a CSS selector?`,
    short: `Absolute XPath starts from the root (/html/body/...) and breaks with any layout change; relative XPath (//) starts anywhere and anchors on attributes or text. CSS is concise; XPath can match text and walk to parents or siblings.`,
    answer: `<b>Absolute XPath</b> starts at the document root with a single slash: <code>/html/body/div[2]/form/input[1]</code>. One extra wrapper div breaks it, so I avoid it.<br><b>Relative XPath</b> starts with <code>//</code> and anchors on something meaningful: <code>//input[@name='email']</code> or <code>//button[normalize-space()='Place order']</code>.<br><b>CSS vs XPath:</b><br>• CSS (<code>input[name='email']</code>, <code>#cart .item</code>) is shorter, easy to read and ideal for ids, classes and attributes.<br>• XPath can match visible text and move up or sideways with axes such as <code>parent</code>, <code>ancestor</code> and <code>following-sibling</code>: <code>//tr[td[text()='Order #1042']]//button[text()='Cancel']</code>. CSS cannot match elements by their text.<br>Speed differences are negligible in modern browsers, so I choose on readability and stability rather than performance.`,
    followups: [`Write an XPath for a button whose text is “Submit”.`, `What do contains() and starts-with() do in XPath?`, `What are XPath axes? Give an example.`],
    mistakes: [`Claiming CSS is so much faster that XPath should never be used.`, `Using exact text() matching on text with extra spaces — normalize-space() is safer.`],
    lesson: 'au-locators'
  },
  {
    id: 'iq-aut-10', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `How do you handle dynamic elements whose IDs or attributes change on every page load?`,
    short: `Anchor on the stable part — partial matching (contains, starts-with), nearby labels or text, or a data-testid from developers — and use an explicit wait for the element’s state instead of sleeping.`,
    answer: `First I check what actually changes. If an id looks like <code>btn_save_83721</code>, the prefix is stable, so I use <code>//button[starts-with(@id,'btn_save_')]</code> or CSS <code>button[id^='btn_save_']</code>. For a stable middle part, <code>contains(@id,'save')</code> or <code>[id*='save']</code>.<br>Other options:<br>• Anchor on visible text or a stable label: <code>//label[text()='Email']/following-sibling::input</code>.<br>• Find a stable container first, then search inside it.<br>• Ask developers for a <code>data-testid</code> attribute — the most robust long-term fix.<br>“Dynamic” can also mean the element appears late or is re-rendered. Then the fix is timing, not the locator: <code>wait.until(ExpectedConditions.elementToBeClickable(locator))</code>, and finding the element again after the DOM updates instead of reusing an old reference. I avoid index-based locators, because new items shift positions.`,
    followups: [`What is the difference between contains() and starts-with()?`, `How would you click the row for a specific order when the row order keeps changing?`],
    mistakes: [`Using Thread.sleep to “wait for the id to settle”.`, `Relying on positions like (//button)[5] that shift when content changes.`],
    lesson: 'au-locators'
  },
  {
    id: 'iq-aut-11', cat: 'automation', level: 'beginner', freq: 'very-common',
    q: `What is the difference between implicit, explicit and fluent waits in Selenium?`,
    short: `Implicit wait is a global timeout for finding elements. Explicit wait (WebDriverWait) waits for a specific condition where you need it. Fluent wait is an explicit wait with custom polling and ignored exceptions. Don’t mix implicit and explicit waits.`,
    answer: `<b>Implicit wait</b> — set once for the driver: <code>driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5))</code>. Every <code>findElement</code> polls up to that time until the element is <em>present</em>. It cannot wait for visibility, clickability or text.<br><b>Explicit wait</b> — waits for a specific condition at a specific step:<br><code>WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));<br>wait.until(ExpectedConditions.elementToBeClickable(By.id("pay"))).click();</code><br><b>Fluent wait</b> — an explicit wait you configure fully:<br><code>Wait&lt;WebDriver&gt; fluent = new FluentWait&lt;&gt;(driver)<br>  .withTimeout(Duration.ofSeconds(20))<br>  .pollingEvery(Duration.ofMillis(500))<br>  .ignoring(NoSuchElementException.class);</code><br><code>WebDriverWait</code> is itself a <code>FluentWait</code> with sensible defaults.<br>Key rule from the Selenium docs: <b>do not mix implicit and explicit waits</b> — the timeouts combine unpredictably. Most frameworks leave implicit wait at zero and use explicit waits inside helper methods.`,
    followups: [`Why shouldn’t you mix implicit and explicit waits?`, `Which ExpectedConditions do you use most often?`, `What is the default polling interval of WebDriverWait?`],
    mistakes: [`Saying implicit wait waits for elements to become visible or clickable.`, `Recommending a large implicit wait plus explicit waits together “for extra safety”.`],
    lesson: 'au-waits'
  },
  {
    id: 'iq-aut-12', cat: 'automation', level: 'beginner', freq: 'common',
    q: `Why is Thread.sleep() considered bad practice in automation, and what do you use instead?`,
    short: `A fixed sleep always waits the full time, slowing every run, yet still fails whenever the app is slower than the guess. Wait for a real condition with an explicit wait (or rely on Playwright’s auto-waiting).`,
    answer: `<code>Thread.sleep(5000)</code> pauses for exactly five seconds whatever the app is doing. That causes two problems:<br>• <b>Slow suites:</b> if the element appears after 300 ms you still wait 5 s. Across hundreds of tests that adds minutes or hours to the pipeline.<br>• <b>Still flaky:</b> on a slow CI machine the element may need 6 s, so the test fails anyway. The sleep hides the timing problem without solving it.<br>Instead I wait for the condition the next step depends on: <code>wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("toast")))</code>, <code>ExpectedConditions.urlContains("/orders")</code>, <code>invisibilityOfElementLocated</code> for a spinner, or <code>textToBePresentInElementLocated</code>. These return as soon as the condition is true and fail with a clear timeout message if it never becomes true.<br>Playwright has the same rule: rely on auto-waiting and web-first assertions, and avoid <code>page.waitForTimeout()</code>.`,
    followups: [`Is there ever a valid use for a fixed wait?`, `How would you wait for a loading spinner to disappear?`],
    mistakes: [`Increasing the sleep every time the test fails.`, `Claiming a big implicit wait fixes every timing issue.`],
    lesson: 'au-waits'
  },
  {
    id: 'iq-aut-13', cat: 'automation', level: 'intermediate', freq: 'very-common',
    q: `What is a StaleElementReferenceException and how do you fix it?`,
    short: `The WebElement you stored no longer points to a node in the current DOM because the page refreshed or re-rendered it. Re-locate the element right before using it, after waiting for the update to finish.`,
    answer: `<code>findElement</code> returns a reference to one specific DOM node. If that node is removed or replaced — a refresh, navigation, an AJAX update, or a framework such as React re-rendering a list — the reference is stale, and any action on it throws <code>StaleElementReferenceException</code>.<br>Typical case: I store the rows of an orders table, click “Sort by date”, then read <code>rows.get(0)</code>. The table was rebuilt, so the stored rows are stale.<br>Fixes:<br>• Keep <b>locators</b> (<code>By</code>) rather than elements, and find the element just before acting on it.<br>• Wait for the change to complete — for example <code>wait.until(ExpectedConditions.stalenessOf(oldRow))</code> — then find it again.<br>• Avoid <code>@CacheLookup</code> on elements that re-render.<br>• Only as a last resort, a small retry around the find-and-act step, and only once you understand why the DOM changed.`,
    followups: [`How is this different from NoSuchElementException?`, `How does Playwright avoid stale element problems?`],
    mistakes: [`Wrapping every action in try-catch with a retry loop without understanding the cause.`, `Adding Thread.sleep before the action.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-14', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `Which Selenium exceptions do you see most often, and how do you handle NoSuchElement, ElementClickIntercepted and Timeout exceptions?`,
    short: `NoSuchElement: wrong locator, wrong frame or window, or not loaded yet. ElementClickIntercepted: an overlay, banner or sticky header covers the target. TimeoutException: an explicit wait’s condition never became true.`,
    answer: `<b>NoSuchElementException</b> — the element was not found. I check the locator in DevTools, whether it sits inside an iframe or another window, and whether the page had loaded. Fix: correct locator, switch context, or an explicit wait.<br><b>ElementClickInterceptedException</b> — the element exists but something else would receive the click: a cookie banner, loading overlay, sticky header or modal. I wait for the overlay to disappear (<code>invisibilityOfElementLocated</code>), close the banner, or scroll the element into view.<br><b>ElementNotInteractableException</b> — present but hidden or disabled; wait for visibility, or check that the locator isn’t matching a hidden duplicate.<br><b>TimeoutException</b> — thrown by <code>WebDriverWait</code> when the condition is not met in time. It can mean a slow environment, a wrong condition or a genuine product bug, so I read the screenshot and logs before deciding.<br>A JavaScript click to bypass interception is a last resort — a real user couldn’t click there either.`,
    followups: [`When is a JavaScript click acceptable?`, `How do you tell whether a TimeoutException is a test problem or a product bug?`],
    mistakes: [`Using a JavaScript click to “fix” every intercepted click, hiding real UI bugs.`, `Treating every exception as a product defect without investigating.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-15', cat: 'automation', level: 'beginner', freq: 'very-common',
    q: `How do you handle alerts, iframes and multiple windows or tabs in Selenium?`,
    short: `Use driver.switchTo(): alert() to accept or dismiss JavaScript pop-ups, frame() to enter an iframe and defaultContent() to leave it, and window(handle) with getWindowHandles() to move between tabs.`,
    answer: `All three use <code>driver.switchTo()</code>.<br><b>JavaScript alerts:</b> <code>Alert alert = wait.until(ExpectedConditions.alertIsPresent());</code> then <code>getText()</code>, <code>accept()</code>, <code>dismiss()</code> or <code>sendKeys("text")</code> for a prompt. HTML modals are ordinary elements and need no switching.<br><b>iframes:</b> <code>driver.switchTo().frame("paymentFrame")</code> by name/id, index or WebElement, or <code>frameToBeAvailableAndSwitchToIt</code>. Go back with <code>defaultContent()</code>, or <code>parentFrame()</code> for nested frames. Forgetting to switch is a classic cause of NoSuchElementException.<br><b>Windows and tabs:</b> save the original handle, open the new window, then switch:<br><code>String main = driver.getWindowHandle();<br>for (String h : driver.getWindowHandles()) {<br>  if (!h.equals(main)) driver.switchTo().window(h);<br>}</code><br>When done, <code>driver.close()</code> the child and switch back to <code>main</code>. Selenium 4 also offers <code>driver.switchTo().newWindow(WindowType.TAB)</code>.`,
    followups: [`What is the difference between close() and quit()?`, `How do you handle an iframe nested inside another iframe?`, `How do you upload a file with Selenium?`],
    mistakes: [`Trying to handle an HTML modal with switchTo().alert().`, `Forgetting to switch back to the main window or default content afterwards.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-16', cat: 'automation', level: 'beginner', freq: 'common',
    q: `How do you handle dropdowns and mouse actions such as hover, right-click and drag-and-drop in Selenium?`,
    short: `For native HTML select elements use the Select class (selectByVisibleText, selectByValue, selectByIndex). For hover, double-click, right-click and drag-and-drop use the Actions class and end the chain with perform().`,
    answer: `<b>Dropdowns:</b> if the element is a real <code>&lt;select&gt;</code>, wrap it in the <code>Select</code> class:<br><code>Select country = new Select(driver.findElement(By.id("country")));<br>country.selectByVisibleText("Pakistan");</code><br>Other methods: <code>selectByValue</code>, <code>selectByIndex</code>, <code>getFirstSelectedOption()</code>, <code>getOptions()</code>, and <code>isMultiple()</code> / <code>deselectAll()</code> for multi-selects. Many modern dropdowns are custom div-based widgets; <code>Select</code> throws an exception on them, so I click to open the list and then click the option by its text.<br><b>Actions class</b> for gestures:<br><code>new Actions(driver).moveToElement(menu).perform();</code> (hover)<br>Also <code>contextClick(el)</code>, <code>doubleClick(el)</code>, <code>dragAndDrop(source, target)</code>, and key chords with <code>keyDown(Keys.CONTROL)</code>.<br>Every chain must end with <code>perform()</code>, or nothing happens. Hover menus also need an explicit wait for the submenu to become visible before clicking it.`,
    followups: [`How would you verify every option in a dropdown?`, `What happens if you forget perform()?`],
    mistakes: [`Using the Select class on a custom div-based dropdown.`, `Forgetting perform() at the end of an Actions chain.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-17', cat: 'automation', level: 'intermediate', freq: 'very-common',
    q: `What is the execution order of TestNG annotations, and how do priority, dependsOnMethods and groups work?`,
    short: `Before annotations run Suite → Test → Class → Method, then @Test, then the After annotations in reverse. priority orders tests (lower first, default 0); dependsOnMethods skips a test if its dependency fails; groups tag tests for selective runs.`,
    answer: `<b>Order:</b> <code>@BeforeSuite</code> → <code>@BeforeTest</code> → <code>@BeforeClass</code> → <code>@BeforeMethod</code> → <code>@Test</code> → <code>@AfterMethod</code> → <code>@AfterClass</code> → <code>@AfterTest</code> → <code>@AfterSuite</code>. <code>@BeforeMethod</code>/<code>@AfterMethod</code> run around every test method — a common place to start and quit the browser. <code>@BeforeTest</code> refers to a <code>&lt;test&gt;</code> tag in testng.xml, not to each test method.<br><b>priority:</b> <code>@Test(priority = 1)</code>; lower numbers run first, the default is 0, and ties usually fall back to alphabetical method names. Heavy reliance on order is a smell — tests should be independent.<br><b>dependsOnMethods:</b> <code>@Test(dependsOnMethods = "login")</code> runs after <code>login</code> and is <em>skipped</em>, not failed, if <code>login</code> fails (unless <code>alwaysRun = true</code>).<br><b>groups:</b> <code>@Test(groups = {"smoke", "regression"})</code>, then include or exclude groups in testng.xml or through Maven to run just the smoke set.`,
    followups: [`What is the difference between @BeforeTest and @BeforeMethod?`, `How do you re-run only the failed tests in TestNG?`, `What is a TestNG listener used for?`],
    mistakes: [`Saying @BeforeTest runs before every @Test method.`, `Building long chains of dependent tests instead of keeping tests independent.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-18', cat: 'automation', level: 'beginner', freq: 'common',
    q: `What is the difference between a hard assert and a soft assert in TestNG?`,
    short: `A hard assert (Assert) stops the test at the first failure. A soft assert (SoftAssert) records failures and lets the test continue; you must call assertAll() at the end or the failures are silently ignored.`,
    answer: `<b>Hard assert</b> — <code>Assert.assertEquals(actual, expected)</code>. On failure it throws an <code>AssertionError</code> immediately and the rest of the test does not run. Use it when continuing makes no sense: if login failed, there is no point checking the dashboard.<br><b>Soft assert</b> — collects failures and carries on:<br><code>SoftAssert soft = new SoftAssert();<br>soft.assertEquals(title, "My Orders");<br>soft.assertTrue(total.isDisplayed());<br>soft.assertAll();</code><br><code>assertAll()</code> throws at the end, listing every recorded failure. Forget it and the test passes even though checks failed — a dangerous false green.<br>Soft asserts suit checking many independent fields on one screen, such as every label on a profile page, so a single run reports all mismatches. Create a new <code>SoftAssert</code> in each test rather than sharing a static one, or failures leak between tests.`,
    followups: [`What happens if you forget assertAll()?`, `When would you avoid soft asserts?`],
    mistakes: [`Forgetting assertAll(), so failed checks never fail the test.`, `Using soft asserts for preconditions like login, so later steps fail in confusing ways.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-19', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `How do you implement data-driven testing with TestNG’s @DataProvider?`,
    short: `A @DataProvider method returns Object[][] (or an Iterator); each row becomes one run of the test method, whose parameters receive that row’s values. The data can come from code, Excel, CSV or JSON.`,
    answer: `<code>@DataProvider</code> feeds rows of data to a test; TestNG runs the test once per row and reports each run separately.<br><code>@DataProvider(name = "logins")<br>public Object[][] logins() {<br>  return new Object[][] {<br>    {"valid@shopflow.test", "Secret123", true},<br>    {"valid@shopflow.test", "wrong", false},<br>    {"", "Secret123", false}<br>  };<br>}<br>@Test(dataProvider = "logins")<br>public void login(String email, String pass, boolean shouldPass) { ... }</code><br>In real projects the provider often reads Excel (Apache POI), CSV or JSON, so testers can add cases without touching code. <code>@DataProvider(parallel = true)</code> runs rows in parallel, and <code>dataProviderClass</code> shares a provider across classes.<br>Versus <code>@Parameters</code>: <code>@Parameters</code> reads single values from testng.xml, such as the browser name, while <code>@DataProvider</code> supplies many data sets to one test.`,
    followups: [`How do you read test data from an Excel file?`, `What is the difference between @DataProvider and @Parameters?`],
    mistakes: [`Looping over several data sets inside one test, so the first failure hides the rest.`, `Hard-coding environment-specific values such as URLs inside the provider.`],
    lesson: 'au-fixtures-data'
  },
  {
    id: 'iq-aut-20', cat: 'automation', level: 'advanced', freq: 'common',
    q: `How do you run Selenium tests in parallel, and what is Selenium Grid?`,
    short: `Enable parallel in testng.xml (methods, classes or tests, with a thread-count) and give each thread its own driver via ThreadLocal. Selenium Grid runs those sessions on remote machines or containers across browsers and operating systems.`,
    answer: `<b>Parallel with TestNG:</b> in testng.xml set <code>parallel="methods"</code> (or <code>classes</code> / <code>tests</code>) and <code>thread-count="4"</code>. The critical part is thread safety: one static <code>WebDriver</code> shared by all threads makes tests click in each other’s browsers. The usual pattern is <code>ThreadLocal&lt;WebDriver&gt;</code>, so each thread has its own driver, created in <code>@BeforeMethod</code> and quit in <code>@AfterMethod</code>. Tests must also be independent and use their own data.<br><b>Selenium Grid:</b> the test creates a <code>RemoteWebDriver</code> pointing at the Grid URL with the desired options, and the Grid routes the session to a node with that browser and platform. Grid 4 runs as standalone, hub and node, or fully distributed, and works well with Docker. Cloud device and browser services offer the same idea as a service.<br>Grid solves scale and browser coverage, not flakiness — unstable tests simply fail faster in parallel.`,
    followups: [`Why do you need ThreadLocal for WebDriver?`, `How do you choose a sensible thread count?`],
    mistakes: [`Sharing one static WebDriver across parallel threads.`, `Running order-dependent tests in parallel and blaming Selenium for random failures.`],
    lesson: 'au-selenium'
  },
  {
    id: 'iq-aut-21', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `How do you integrate your Selenium suite with CI (Jenkins or GitHub Actions), and how do you report results and failures?`,
    short: `Run the suite through Maven (mvn test) in a pipeline triggered by pull requests, merges or a schedule, headless on the agent; publish TestNG, Allure or Extent reports and attach screenshots captured on failure.`,
    answer: `<b>Pipeline:</b> the suite is a Maven project, so the CI job checks out the code and runs <code>mvn clean test -Dgroups=smoke -Dbrowser=chrome</code>. In Jenkins this is a pipeline stage; in GitHub Actions a workflow step on a Linux runner. Smoke runs on every pull request, full regression nightly or before a release.<br><b>Headless:</b> CI agents usually have no display, so <code>ChromeOptions options = new ChromeOptions(); options.addArguments("--headless=new");</code> plus a fixed window size, because layouts can change at small sizes.<br><b>Failure evidence:</b> a TestNG <code>ITestListener</code> takes a screenshot in <code>onTestFailure</code> with <code>((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE)</code> and attaches it to the report along with logs.<br><b>Reporting:</b> Allure or Extent HTML reports are archived as build artifacts, and a summary goes to the team chat.<br>Passwords and tokens come from the CI secret store, never from the repository.`,
    followups: [`Why might a test pass locally but fail in headless CI?`, `How do you pass the browser or environment into the suite as a parameter?`],
    mistakes: [`Committing passwords or tokens to the test repository.`, `Looking only at a green/red status without keeping screenshots or logs for failures.`],
    lesson: 'au-ci'
  },
  {
    id: 'iq-aut-22', cat: 'automation', level: 'intermediate', freq: 'common',
    q: `What is Cucumber, and how do feature files, step definitions and Scenario Outline fit together?`,
    short: `Cucumber runs BDD scenarios written in Gherkin (Given/When/Then) in .feature files; each step is matched to a step-definition method in code. A Scenario Outline with an Examples table runs one scenario for several data rows.`,
    answer: `<b>Feature file</b> — plain-language scenarios in Gherkin:<br><code>Scenario Outline: Login with different users<br>  Given I am on the login page<br>  When I log in as "&lt;email&gt;" with "&lt;password&gt;"<br>  Then I should see "&lt;result&gt;"<br>  Examples:<br>    | email | password | result |<br>    | ali@test.pk | Pass123 | Dashboard |<br>    | ali@test.pk | wrong | Invalid credentials |</code><br><b>Step definitions</b> — Java methods matched by expression, e.g. <code>@When("I log in as {string} with {string}")</code>. They call page objects, so Selenium code stays out of the feature file.<br><b>Runner</b> — a JUnit or TestNG class with <code>@CucumberOptions</code> for features, glue and tags such as <code>@smoke</code>.<br><b>Background</b> holds steps shared by every scenario in a file; <b>hooks</b> (<code>@Before</code> / <code>@After</code>) handle setup and screenshots.<br>BDD’s real value is shared understanding with product owners. If nobody outside QA reads the feature files, it adds overhead without that benefit.`,
    followups: [`What is the difference between Scenario and Scenario Outline?`, `What is a Background in a feature file?`, `How do you share state between step definition classes?`],
    mistakes: [`Writing UI-level steps like “I click the button with id btn-2” instead of business behaviour.`, `Saying Cucumber replaces Selenium.`],
    lesson: 'au-bdd-api-visual'
  },
  {
    id: 'iq-aut-23', cat: 'automation', level: 'advanced', freq: 'very-common',
    q: `How do you identify and fix flaky automated tests?`,
    short: `Confirm the flake with repeated runs and CI history, classify the cause (timing, test data, test order, environment, or a real intermittent bug), fix the root cause and quarantine the test meanwhile — retries are a signal, not a cure.`,
    answer: `A flaky test passes and fails on the same code. I treat it as a bug in the test, the environment or the product.<br>1. <b>Detect:</b> check CI history, or rerun the test many times locally and in CI.<br>2. <b>Collect evidence:</b> screenshots, logs, video or traces from the failing run — not just the stack trace.<br>3. <b>Classify the cause:</b> timing (fixed sleeps, missing explicit waits, animations), shared or leftover test data, dependence on test order, parallel threads sharing a driver, unstable environments or third-party services, brittle locators — or a genuine intermittent product bug such as a race condition.<br>4. <b>Fix the root cause:</b> condition-based waits, unique data per test, independent setup, stable locators, mocks for unreliable external services.<br>5. <b>Contain:</b> quarantine the test with a ticket so it doesn’t block the team, but never delete or forget it.<br>Automatic retries help surface flakiness, but a test that only passes on retry still needs fixing.`,
    followups: [`How would you prove a flaky failure is a real product bug?`, `What does a good quarantine process look like?`],
    mistakes: [`Adding Thread.sleep or bigger timeouts as the fix.`, `Turning on retries and treating the problem as solved.`],
    lesson: 'au-flaky'
  },

  /* ───────────── playwright ───────────── */
  {
    id: 'iq-pw-01', cat: 'playwright', level: 'beginner', freq: 'very-common',
    q: `What is Playwright, and why are teams choosing it for new automation projects?`,
    short: `Playwright is Microsoft’s open-source framework for automating Chromium, Firefox and WebKit through one API. Teams pick it for auto-waiting, isolated browser contexts, a built-in test runner, tracing and API testing.`,
    answer: `Playwright is an open-source browser automation framework from Microsoft. One API drives Chromium (Chrome, Edge), Firefox and WebKit (the engine behind Safari), with bindings for TypeScript/JavaScript, Python, Java and .NET. Most teams use it with its own runner, <code>@playwright/test</code>.<br>Why it is popular:<br>• <b>Auto-waiting</b> — actions wait for elements to be actionable and assertions retry, which removes most hand-written waits.<br>• <b>Browser contexts</b> — lightweight isolated sessions, so every test starts with fresh cookies and storage without launching a new browser.<br>• <b>Batteries included</b> — parallel workers, retries, projects for several browsers, HTML report, screenshots, video and the trace viewer.<br>• <b>Beyond clicking</b> — network interception and mocking, an API request client, multiple tabs, iframes and downloads.<br>• <b>Tooling</b> — codegen, UI mode and the inspector.<br>Limits to mention honestly: it emulates mobile viewports but does not test native mobile apps, which still need a tool such as Appium.`,
    followups: [`Which browsers and languages does Playwright support?`, `What can’t Playwright do well?`],
    mistakes: [`Describing Playwright as “just a faster Selenium” with the same waiting model.`, `Claiming Playwright tests native iOS or Android apps.`],
    lesson: 'au-playwright-basics'
  },
  {
    id: 'iq-pw-02', cat: 'playwright', level: 'intermediate', freq: 'very-common',
    q: `How does Playwright compare with Selenium and Cypress?`,
    short: `Selenium: mature W3C standard, many languages, huge ecosystem, but you build the framework and manage waits. Cypress: runs inside the browser, great developer experience, JS/TS only. Playwright: all-in-one runner with auto-waiting and multi-tab support.`,
    answer: `<b>Selenium</b> — the long-standing W3C WebDriver standard. Supports Java, Python, C#, JavaScript and more, real branded browsers, and a huge ecosystem (Grid, Appium, cloud vendors). You assemble the framework yourself — TestNG or JUnit, reporting, wait helpers — and synchronisation is your job.<br><b>Cypress</b> — JavaScript/TypeScript only, runs inside the browser next to the app, with an excellent interactive runner and automatic retries. Multiple tabs aren’t supported, cross-origin flows need extra handling, and WebKit support is experimental.<br><b>Playwright</b> — drives browsers from outside over a persistent connection. Auto-waiting, isolated contexts, multiple tabs, iframes, network mocking, API testing, tracing and parallelism are built in; supports TS/JS, Python, Java and .NET.<br><b>My view:</b> none is “best”. For a Java team with a large, stable Selenium suite, a rewrite may not pay off. For a new web project, Playwright usually gives faster, more stable tests. I decide on team skills, existing investment, browsers required and CI cost.`,
    followups: [`Would you migrate an existing Selenium suite to Playwright? How would you approach it?`, `Which tool would you pick for a Java-based team, and why?`],
    mistakes: [`Declaring one tool universally best without discussing context.`, `Saying Selenium is dead or no longer used in industry.`],
    lesson: 'au-frameworks'
  },
  {
    id: 'iq-pw-03', cat: 'playwright', level: 'intermediate', freq: 'very-common',
    q: `How does auto-waiting work in Playwright? What are actionability checks?`,
    short: `Before an action, Playwright waits until the element passes actionability checks — such as visible, stable, enabled and receiving events, plus editable for typing — retrying until the action timeout, then failing with a TimeoutError.`,
    answer: `When you call <code>await page.getByRole('button', { name: 'Pay' }).click()</code>, Playwright resolves the locator and waits until the element is actionable. For a click it checks that the element is <b>visible</b>, <b>stable</b> (not animating), <b>receives events</b> (not covered by an overlay) and <b>enabled</b>. For <code>fill()</code> it checks visible, enabled and <b>editable</b>. It keeps retrying until the checks pass or the timeout expires, then fails with a <code>TimeoutError</code> that explains what it was waiting for.<br>Because the locator is re-resolved on each attempt, you also avoid the stale-element problems common in Selenium.<br>What auto-waiting does <em>not</em> know is your business state. If the order total should update after applying a coupon, use a web-first assertion: <code>await expect(total).toHaveText('Rs 1,800')</code>. And <code>force: true</code> skips non-essential checks — use it rarely, because a real user could not click a covered button either.`,
    followups: [`How is auto-waiting for actions different from web-first assertions?`, `When, if ever, would you use force: true?`],
    mistakes: [`Adding page.waitForTimeout() before every click “to be safe”.`, `Assuming auto-waiting means a test can never have timing problems.`],
    lesson: 'au-waits'
  },
  {
    id: 'iq-pw-04', cat: 'playwright', level: 'beginner', freq: 'very-common',
    q: `Which locators do you prefer in Playwright, and why? What is strict mode?`,
    short: `User-facing locators first — getByRole with an accessible name, getByLabel, getByPlaceholder, getByText — then getByTestId as a stable contract, with CSS/XPath last. Strict mode makes an action fail when a locator matches more than one element.`,
    answer: `Playwright recommends locators that reflect how users and assistive technology see the page:<br>• <code>page.getByRole('button', { name: 'Add to cart' })</code> — role plus accessible name; robust, and it nudges the app towards good accessibility.<br>• <code>page.getByLabel('Email')</code> for form fields; <code>getByPlaceholder</code>; <code>getByText</code> for non-interactive content.<br>• <code>page.getByTestId('cart-count')</code> — matches <code>data-testid</code> by default; a stable contract with developers when there is no good user-facing option.<br>• <code>page.locator()</code> with CSS or XPath only as a last resort.<br>For repeated elements I narrow the scope instead of using indexes: <code>page.getByRole('row').filter({ hasText: 'Order #1042' }).getByRole('button', { name: 'Cancel' })</code>.<br><b>Strict mode:</b> an action on a locator that matches several elements throws a strict mode violation instead of silently clicking the first. The fix is a more specific locator or a filter — not reflexively adding <code>.first()</code>.`,
    followups: [`How do you change the attribute that getByTestId uses?`, `How would you click the right “Edit” button in a table of identical rows?`],
    mistakes: [`Copying long CSS or XPath selectors from DevTools as the default approach.`, `Silencing every strict mode violation with .first() or .nth().`],
    lesson: 'au-locators'
  },
  {
    id: 'iq-pw-05', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `What are web-first assertions in Playwright, and why is expect(locator).toBeVisible() better than checking isVisible()?`,
    short: `Web-first assertions such as toBeVisible, toHaveText and toHaveURL keep retrying until the condition holds or the timeout expires. isVisible() returns the state at that instant without waiting, which creates race conditions.`,
    answer: `Web-first assertions are the async matchers on locators and pages: <code>toBeVisible()</code>, <code>toHaveText()</code>, <code>toContainText()</code>, <code>toHaveValue()</code>, <code>toBeEnabled()</code>, <code>toHaveCount()</code>, <code>toHaveURL()</code>, <code>toHaveTitle()</code>. They re-check the condition until it passes or the expect timeout (5 seconds by default) runs out.<br>Compare:<br><code>expect(await page.getByText('Order placed').isVisible()).toBe(true);</code><br><code>await expect(page.getByText('Order placed')).toBeVisible();</code><br>The first line checks once. If the confirmation appears 200 ms later, it fails — a classic flaky test. The second waits for the message and gives a readable error if it never appears.<br>Related tips: always <code>await</code> web-first assertions; use <code>expect.soft()</code> to collect several failures in one test; and use <code>expect.poll()</code> or <code>expect(...).toPass()</code> to retry non-UI checks, such as a value fetched from an API.`,
    followups: [`What happens if you forget to await an expect?`, `How do you assert a value that is not on the page but updates later, such as an API field?`],
    mistakes: [`Using isVisible() or textContent() inside a generic expect and assuming it waits.`, `Leaving out await, so the assertion may not finish before the test ends.`],
    lesson: 'au-waits'
  },
  {
    id: 'iq-pw-06', cat: 'playwright', level: 'intermediate', freq: 'very-common',
    q: `What is the difference between Browser, BrowserContext and Page in Playwright?`,
    short: `Browser is the launched browser process. A BrowserContext is an isolated, incognito-like session inside it with its own cookies and storage. A Page is a single tab inside a context.`,
    answer: `<b>Browser</b> — a running Chromium, Firefox or WebKit instance. Launching is relatively expensive, so the test runner reuses one browser per worker.<br><b>BrowserContext</b> — an isolated session inside that browser, like a fresh incognito profile: its own cookies, localStorage, cache and permissions. Creating one takes milliseconds. Playwright Test gives <b>every test its own context</b>, which is why tests don’t leak login state into each other.<br><b>Page</b> — one tab inside a context. A context can hold several pages, for example when a link opens a new tab.<br>Practical uses:<br>• Two users in one test, such as a buyer and a seller chatting: create two contexts with <code>browser.newContext()</code>, each with its own page.<br>• Per-context settings: viewport, locale, timezone, geolocation, permissions or a saved <code>storageState</code>.<br>In most tests you just use the built-in <code>page</code> fixture, which comes from a fresh context created for that test.`,
    followups: [`How would you test a chat between two logged-in users?`, `Where do you set the viewport or locale for a context?`],
    mistakes: [`Saying a new context launches a new browser process.`, `Treating context and page as the same thing.`],
    lesson: 'au-playwright-basics'
  },
  {
    id: 'iq-pw-07', cat: 'playwright', level: 'advanced', freq: 'common',
    q: `What are fixtures in Playwright Test, and how do you create a custom fixture with test.extend?`,
    short: `Fixtures hand a test ready-made objects — page, context, browser, request — and handle setup and teardown. test.extend adds your own, such as page objects or seeded data, created only for tests that ask for them.`,
    answer: `Built-in fixtures include <code>page</code>, <code>context</code>, <code>browser</code>, <code>request</code> and <code>browserName</code>. A test lists what it needs in its arguments, and Playwright sets it up before and tears it down after.<br>A custom fixture:<br><code>import { test as base } from '@playwright/test';<br>export const test = base.extend&lt;{ cartPage: CartPage }&gt;({<br>  cartPage: async ({ page }, use) =&gt; {<br>    const cartPage = new CartPage(page);<br>    await cartPage.open();<br>    await use(cartPage);<br>    // teardown runs after use(), e.g. empty the cart<br>  },<br>});</code><br>Tests then write <code>test('apply coupon', async ({ cartPage }) =&gt; { ... })</code>.<br>Why fixtures beat <code>beforeEach</code> hooks: they are on demand (only built if used), composable (one fixture can depend on another) and keep setup and cleanup together. They are test-scoped by default; <code>{ scope: 'worker' }</code> shares an expensive resource, such as a seeded account, across the tests of one worker.`,
    followups: [`What is the difference between test-scoped and worker-scoped fixtures?`, `How do fixtures compare with beforeEach hooks?`],
    mistakes: [`Forgetting to call use(), so the test never receives the fixture.`, `Sharing mutable state between tests through beforeAll and module-level variables.`],
    lesson: 'au-fixtures-data'
  },
  {
    id: 'iq-pw-08', cat: 'playwright', level: 'intermediate', freq: 'very-common',
    q: `How do you avoid logging in through the UI before every Playwright test?`,
    short: `Log in once in a setup project, save cookies and storage to a file with storageState, and make the test projects depend on setup and load that file — each test then starts authenticated, still in its own context.`,
    answer: `The recommended pattern is a <b>setup project</b>:<br>1. <code>auth.setup.ts</code> logs in once — through the UI, or faster through an API call — and saves the session: <code>await page.context().storageState({ path: 'playwright/.auth/user.json' })</code>.<br>2. In <code>playwright.config.ts</code>, a project <code>{ name: 'setup', testMatch: /.*\\.setup\\.ts/ }</code> runs first; the browser projects declare <code>dependencies: ['setup']</code> and <code>use: { storageState: 'playwright/.auth/user.json' }</code>.<br>3. Every test gets a fresh context pre-loaded with those cookies and storage, so it starts logged in but stays isolated.<br>For several roles, save <code>admin.json</code> and <code>customer.json</code> and choose per file with <code>test.use({ storageState: 'playwright/.auth/admin.json' })</code>. Tests that must start logged out can use an empty state.<br>Two cautions: add <code>playwright/.auth</code> to <code>.gitignore</code>, because it holds live session tokens, and keep at least one real UI login test so the login page itself stays covered.`,
    followups: [`What if tests change server-side data for the shared account?`, `How would you handle admin and customer roles in the same suite?`],
    mistakes: [`Committing the storageState file with real session tokens to Git.`, `Dropping all UI login coverage because authentication is now reused.`],
    lesson: 'au-fixtures-data'
  },
  {
    id: 'iq-pw-09', cat: 'playwright', level: 'advanced', freq: 'common',
    q: `How does parallel execution work in Playwright? Explain workers, fullyParallel and sharding.`,
    short: `Playwright runs test files in parallel across worker processes, each with its own browser; tests in one file run in order unless fullyParallel is on. Sharding splits the suite across machines with --shard=1/4.`,
    answer: `<b>Workers:</b> each worker is a separate OS process with its own browser. By default, test files are spread across workers and run in parallel, while tests inside one file run in order in the same worker. Set the count with <code>workers</code> in the config or <code>--workers=4</code>; <code>--workers=1</code> runs serially. Teams often use fewer workers in CI, e.g. <code>workers: process.env.CI ? 2 : undefined</code>.<br><b>fullyParallel: true</b> lets tests within the same file run in parallel too. <code>test.describe.configure({ mode: 'serial' })</code> forces a group to run in order, but dependent tests are best avoided.<br><b>Sharding</b> splits the suite across machines: <code>npx playwright test --shard=1/4</code> on each of four CI jobs. With the blob reporter, shard results can be combined using <code>npx playwright merge-reports</code>.<br>All of this only works if tests are independent: unique data per test (for example a suffix from <code>testInfo.workerIndex</code> or a random id), no shared account being modified concurrently, no order dependencies.`,
    followups: [`Why might a test pass alone but fail when run in parallel?`, `How do you merge reports from sharded CI jobs?`],
    mistakes: [`Making tests depend on each other and then forcing everything to run serially.`, `Confusing workers (processes on one machine) with shards (slices of the suite on different machines).`],
    lesson: 'au-ci'
  },
  {
    id: 'iq-pw-10', cat: 'playwright', level: 'advanced', freq: 'common',
    q: `How do retries work in Playwright, and when do they hide real problems?`,
    short: `Retries are off by default; set retries in the config (often only in CI). A test that fails and then passes on retry is reported as flaky. Retries keep pipelines moving and capture evidence, but every flaky result still needs a root-cause fix.`,
    answer: `Configure with <code>retries: process.env.CI ? 2 : 0</code> or <code>--retries=2</code>. When a test fails, Playwright throws away that worker and its browser, starts a fresh one and runs the test again. Results are <b>passed</b>, <b>failed</b> (failed every attempt) or <b>flaky</b> (failed, then passed on a retry).<br>Retries help with two things: stopping a rare infrastructure blip from blocking a merge, and collecting evidence — <code>trace: 'on-first-retry'</code> records a trace only when a retry happens, so you get the trace without slowing every run.<br>They hide problems when the team stops looking at the flaky count. A test that passes on the second attempt might be masking a race condition in the product, such as a payment being submitted twice on a slow network. So I track flaky tests in the report, study the trace and fix the cause — timing, data, isolation or a real bug.<br><code>testInfo.retry</code> tells a test or fixture it is on a retry, which is useful for cleaning server-side state first.`,
    followups: [`What does trace: 'on-first-retry' do?`, `Would you enable retries for local runs? Why or why not?`],
    mistakes: [`Setting retries to 5 and calling the suite stable.`, `Ignoring tests marked flaky because the pipeline is green.`],
    lesson: 'au-flaky'
  },
  {
    id: 'iq-pw-11', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `How do you intercept and mock network requests in Playwright with page.route?`,
    short: `page.route(urlPattern, handler) intercepts matching requests; the handler can fulfil them with a fake response, abort them, modify and continue them, or fetch the real response and change it. Ideal for error states and unstable third-party APIs.`,
    answer: `<code>page.route()</code> registers a handler for requests that match a glob or regex; inside it you decide what happens:<br><code>await page.route('**/api/orders', route =&gt; route.fulfill({<br>  status: 500,<br>  contentType: 'application/json',<br>  body: JSON.stringify({ error: 'Server down' }),<br>}));<br>await page.goto('/orders');<br>await expect(page.getByText('Something went wrong')).toBeVisible();</code><br>Other options: <code>route.abort()</code> to simulate a network failure or block images and analytics; <code>route.continue({ headers })</code> to modify the request; <code>route.fetch()</code> to get the real response and change part of its JSON.<br>Typical uses: error and empty states that are hard to produce for real, slow responses to check loading spinners, and isolating the UI from an unreliable third-party service. Register the route <b>before</b> the action that triggers the request. To observe traffic without mocking, use <code>page.waitForResponse()</code>.<br>Mocked tests verify the UI, not the backend, so keep some end-to-end tests against the real API.`,
    followups: [`How would you simulate a slow API response?`, `How do you wait for a specific API call to finish after clicking a button?`],
    mistakes: [`Registering the route after the page has already sent the request.`, `Mocking everything and assuming the backend integration is tested.`],
    lesson: 'sa-mocking'
  },
  {
    id: 'iq-pw-12', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `How do you do API testing in Playwright, and how do you combine API and UI steps in one test?`,
    short: `Use the built-in request fixture (an APIRequestContext) to send GET, POST, PUT and DELETE calls and assert status and body. Combine it with UI tests by creating data through the API and then verifying it in the browser.`,
    answer: `The <code>request</code> fixture sends HTTP calls without a browser and picks up <code>baseURL</code> and <code>extraHTTPHeaders</code> from the config:<br><code>test('create product', async ({ request }) =&gt; {<br>  const res = await request.post('/api/products', { data: { name: 'Mug', price: 900 } });<br>  expect(res.status()).toBe(201);<br>  const body = await res.json();<br>  expect(body.name).toBe('Mug');<br>  const check = await request.get('/api/products/' + body.id);<br>  await expect(check).toBeOK();<br>});</code><br>Note the follow-up GET: a 201 on its own doesn’t prove the record was saved.<br><b>Hybrid tests</b> are where this shines: create a customer or order through the API in milliseconds, then open the UI and verify it appears — or perform a UI action and confirm the result through the API. UI tests stay short and focused on what the UI is responsible for. <code>page.request</code> shares cookies with the page’s context, which helps when the API needs the logged-in session.`,
    followups: [`How would you send an auth token with every API call?`, `When would you still choose Postman or REST Assured?`],
    mistakes: [`Checking only the status code, not the response body or persistence.`, `Clicking through the whole UI to create test data that the API could create instantly.`],
    lesson: 'au-bdd-api-visual'
  },
  {
    id: 'iq-pw-13', cat: 'playwright', level: 'beginner', freq: 'occasional',
    q: `What are Playwright codegen, UI mode and the inspector, and how do you use them?`,
    short: `Codegen records your clicks and generates test code with suggested locators. UI mode is an interactive runner with watch mode and a time-travel view of each step. The inspector (--debug) lets you step through a test and try locators live.`,
    answer: `<b>Codegen</b> — <code>npx playwright codegen https://shopflow.test</code> opens a browser and writes code as you interact, preferring role, text and test-id locators. I use it to discover good locators or sketch a flow, then refactor the output into page objects and add real assertions. Generated code is a draft, not a finished test.<br><b>UI mode</b> — <code>npx playwright test --ui</code> lists the tests, lets you run or watch them, and shows a time-travel view of every step with DOM snapshots, network calls and console logs. Great while writing and fixing tests.<br><b>Inspector / debug mode</b> — <code>npx playwright test --debug</code> runs headed, pauses before each action and lets you step through and highlight locators. <code>await page.pause()</code> stops at a chosen line.<br>For CI failures, the <b>trace viewer</b> (<code>npx playwright show-trace trace.zip</code>) gives the same step-by-step view after the fact.`,
    followups: [`Would you commit codegen output directly to the suite?`, `How do you debug a test that only fails in CI?`],
    mistakes: [`Treating recorded codegen scripts as maintainable tests without refactoring them.`, `Leaving page.pause() in committed code.`],
    lesson: 'au-playwright-basics'
  },
  {
    id: 'iq-pw-14', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `How do you handle new tabs, iframes, file downloads and dialogs in Playwright?`,
    short: `Start waiting for the event before triggering it — context.waitForEvent('page') for a new tab, page.waitForEvent('download') for a download. Use frameLocator for iframes and register a dialog handler before the action that opens an alert.`,
    answer: `The key pattern is to <b>start listening before the click</b>, then await the promise.<br><b>New tab:</b><br><code>const pagePromise = context.waitForEvent('page');<br>await page.getByRole('link', { name: 'Invoice' }).click();<br>const invoice = await pagePromise;<br>await expect(invoice).toHaveURL(/invoice/);</code><br><b>Download:</b> <code>const dlPromise = page.waitForEvent('download');</code>, click, then <code>const dl = await dlPromise; await dl.saveAs('downloads/' + dl.suggestedFilename());</code><br><b>iframes:</b> no switching; locate through the frame: <code>await page.frameLocator('#payment-frame').getByLabel('Card number').fill('4111111111111111');</code>. Auto-waiting works inside frames too.<br><b>Dialogs:</b> Playwright dismisses alerts and confirms automatically unless you register a handler first: <code>page.once('dialog', d =&gt; d.accept());</code><br><b>Upload:</b> <code>await page.getByLabel('Upload CV').setInputFiles('files/cv.pdf');</code><br>Compared with Selenium’s window handles and <code>switchTo()</code>, these APIs are event- and locator-based, so you never lose track of the “current” window.`,
    followups: [`Why must waitForEvent start before the click?`, `How would you check the contents of a downloaded file?`],
    mistakes: [`Clicking first and only then waiting for the popup, which can miss the event.`, `Looking for a switchTo-style API instead of using frameLocator.`],
    lesson: 'au-playwright-basics'
  },
  {
    id: 'iq-pw-15', cat: 'playwright', level: 'advanced', freq: 'very-common',
    q: `A Playwright test passes on your machine but fails in CI. How do you investigate?`,
    short: `Start from evidence — the CI report, screenshot, video and especially the trace. Then compare environment differences (headless, viewport, speed, data, time zone, secrets, parallel workers) and fix the root cause instead of adding waits.`,
    answer: `I start from evidence, not guesses.<br>1. <b>Collect artifacts:</b> <code>trace: 'on-first-retry'</code> (or <code>'retain-on-failure'</code>), <code>screenshot: 'only-on-failure'</code> and video, with the <code>playwright-report</code> and <code>test-results</code> folders uploaded as CI artifacts.<br>2. <b>Read the trace:</b> <code>npx playwright show-trace</code> shows each action, DOM snapshots, network requests and console errors. It usually reveals whether a locator matched the wrong element, a request failed or returned different data, or something covered the button.<br>3. <b>Compare environments:</b> headless vs headed, viewport, slower CPUs, parallel workers sharing data, missing environment variables or secrets, different test data, time zone or locale, feature flags.<br>4. <b>Reproduce:</b> run locally with CI settings — the same worker count, <code>--repeat-each=10</code>, the CI Docker image.<br>5. <b>Fix the cause:</b> unique data, web-first assertions, waiting for the right response, correct config — not <code>waitForTimeout</code>.<br>Finally, decide whether it is a test, environment or product issue; a CI-only failure can still be a real bug.`,
    followups: [`What does --repeat-each help you prove?`, `How do you keep test data safe when CI runs tests in parallel?`],
    mistakes: [`Adding waitForTimeout or longer timeouts until CI turns green.`, `Assuming CI is “just slow” without opening the trace.`],
    lesson: 'au-flaky'
  },
  {
    id: 'iq-pw-16', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `What do you usually configure in playwright.config.ts?`,
    short: `testDir, timeouts, retries, workers, reporters and a shared use block (baseURL, trace, screenshot, video), plus projects for browsers, devices or a setup step, and optionally webServer to start the app.`,
    answer: `A typical config built with <code>defineConfig</code>:<br>• <code>testDir: './tests'</code>, <code>fullyParallel: true</code>.<br>• <b>Timeouts:</b> <code>timeout: 30_000</code> per test (the default), <code>expect: { timeout: 5_000 }</code> for assertions, and optional <code>actionTimeout</code> / <code>navigationTimeout</code> inside <code>use</code>.<br>• <code>retries: process.env.CI ? 2 : 0</code>, <code>workers</code>, and <code>forbidOnly: !!process.env.CI</code> so a stray <code>test.only</code> fails the CI build.<br>• <code>reporter: [['html'], ['list']]</code>, plus JUnit or Allure for CI dashboards.<br>• <b>use:</b> <code>baseURL</code> so tests call <code>page.goto('/login')</code>, <code>trace: 'on-first-retry'</code>, <code>screenshot: 'only-on-failure'</code>, and <code>testIdAttribute</code> if the app uses something other than <code>data-testid</code>.<br>• <b>projects:</b> <code>chromium</code>, <code>firefox</code>, <code>webkit</code>, mobile emulation such as <code>devices['Pixel 7']</code>, and a <code>setup</code> project for authentication.<br>• <code>webServer</code> to start the app before the tests.<br>URLs and credentials come from environment variables, not hard-coded strings.`,
    followups: [`How would you run the same suite against QA and staging?`, `What is the difference between the test timeout and the expect timeout?`],
    mistakes: [`Hard-coding full URLs in every test instead of using baseURL.`, `Raising the global timeout to several minutes to hide slow or stuck tests.`],
    lesson: 'au-playwright-basics'
  },
  {
    id: 'iq-pw-17', cat: 'playwright', level: 'intermediate', freq: 'common',
    q: `How do you implement the Page Object Model in Playwright with TypeScript?`,
    short: `Create a class per page that receives a Page in its constructor, defines locators as readonly properties and exposes async action methods; keep most assertions in tests and inject page objects through fixtures.`,
    answer: `<code>export class LoginPage {<br>  readonly email: Locator;<br>  readonly password: Locator;<br>  readonly submit: Locator;<br>  constructor(private readonly page: Page) {<br>    this.email = page.getByLabel('Email');<br>    this.password = page.getByLabel('Password');<br>    this.submit = page.getByRole('button', { name: 'Sign in' });<br>  }<br>  async goto() { await this.page.goto('/login'); }<br>  async login(email: string, password: string) {<br>    await this.email.fill(email);<br>    await this.password.fill(password);<br>    await this.submit.click();<br>  }<br>}</code><br>Defining locators in the constructor is safe because Playwright locators are lazy: they are resolved only when an action or assertion runs, so nothing goes stale.<br>In a test: <code>const login = new LoginPage(page); await login.goto(); await login.login(user, pass); await expect(page).toHaveURL(/dashboard/);</code><br>In larger suites I expose page objects through custom fixtures, so tests simply ask for <code>{ loginPage }</code>, and I model reusable parts such as a header or date picker as component objects.`,
    followups: [`Should page object methods return other page objects?`, `Where do assertions belong — in page objects or in tests?`],
    mistakes: [`Storing element handles or already-read values in page objects instead of lazy locators.`, `Building one giant page object for the whole application.`],
    lesson: 'au-pom'
  },

  /* ───────────── coding ───────────── */
  {
    id: 'iq-cod-01', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `Explain the four pillars of OOP with examples from your automation framework.`,
    short: `Encapsulation: private locators behind public page-object methods. Inheritance: tests extending a BaseTest. Polymorphism: WebDriver driver = new ChromeDriver() and overloaded helpers. Abstraction: the WebDriver interface and high-level page methods.`,
    answer: `<b>Encapsulation</b> — keeping data and the methods that use it together and hiding the internals. In page objects the locators are <code>private</code> and tests call public methods like <code>login(user, pass)</code>, so tests don’t depend on how the page is built.<br><b>Inheritance</b> — reusing another class’s behaviour. <code>LoginTest extends BaseTest</code>, where <code>BaseTest</code> starts and quits the driver in <code>@BeforeMethod</code> / <code>@AfterMethod</code>. Page classes may extend a <code>BasePage</code> with shared wait helpers.<br><b>Polymorphism</b> — one interface, many forms. <code>WebDriver driver = new ChromeDriver();</code> could equally be <code>new FirefoxDriver()</code>: same calls, browser-specific behaviour (runtime polymorphism). Overloaded helpers such as <code>click(By)</code> and <code>click(WebElement)</code> show compile-time polymorphism.<br><b>Abstraction</b> — exposing what something does, not how. <code>WebDriver</code> is an interface; tests call <code>findElement</code> without knowing the protocol underneath. A page method like <code>checkout()</code> hides ten low-level steps.<br>Examples from your own framework are what make this answer convincing.`,
    followups: [`Where have you used an interface in your framework?`, `Is WebDriver a class or an interface?`],
    mistakes: [`Giving only textbook definitions with animal or car examples and no link to test code.`, `Mixing up abstraction and encapsulation.`],
    lesson: 'cg-oop'
  },
  {
    id: 'iq-cod-02', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `What is the difference between method overloading and method overriding?`,
    short: `Overloading: the same method name with different parameter lists, usually in one class, resolved at compile time. Overriding: a subclass redefines an inherited method with the same signature, resolved at runtime.`,
    answer: `<b>Overloading</b> (compile-time polymorphism): same name, different parameter list — number, type or order of parameters. The return type alone cannot distinguish overloads. Selenium examples: <code>driver.switchTo().frame(int index)</code>, <code>frame(String nameOrId)</code> and <code>frame(WebElement element)</code>; or <code>Thread.sleep(long)</code> and <code>Thread.sleep(long, int)</code>.<br><b>Overriding</b> (runtime polymorphism): a subclass supplies its own version of an inherited method with the same signature, marked <code>@Override</code>. Examples: a custom TestNG listener overriding <code>onTestFailure(ITestResult result)</code> to capture a screenshot, or each page class overriding a <code>BasePage.isLoaded()</code> check.<br>Rules: you cannot override <code>static</code>, <code>final</code> or <code>private</code> methods, and an overriding method cannot reduce visibility.<br>For JavaScript/TypeScript: JS has no true method overloading — a later method with the same name simply replaces the earlier one. TypeScript overload signatures only describe types; a single implementation still has to handle every case.`,
    followups: [`Can you overload a method by changing only its return type?`, `Can a static method be overridden?`],
    mistakes: [`Swapping the definitions — saying overriding happens within one class and overloading across parent and child.`, `Claiming JavaScript supports method overloading the way Java does.`],
    lesson: 'cg-oop'
  },
  {
    id: 'iq-cod-03', cat: 'coding', level: 'intermediate', freq: 'very-common',
    q: `What is the difference between an interface and an abstract class in Java? Where have you used each?`,
    short: `An abstract class can hold state, constructors, and both abstract and concrete methods, and a class extends only one. An interface is a contract — abstract, default and static methods, constants only — and a class can implement many.`,
    answer: `<b>Abstract class</b> — declared <code>abstract</code> and cannot be instantiated. It can have instance fields, constructors, and abstract and concrete methods with any access level. A class can extend only one. I use it for a base with shared state and behaviour: <code>public abstract class BasePage</code> holding the <code>driver</code>, a <code>WebDriverWait</code> and common helpers, with an abstract <code>isLoaded()</code> that each page must implement.<br><b>Interface</b> — a contract. Fields are implicitly <code>public static final</code> constants; methods are abstract by default, and since Java 8 can also be <code>default</code> or <code>static</code> (Java 9 added private methods). A class can implement many interfaces.<br>Selenium examples: <code>WebDriver</code>, <code>WebElement</code>, <code>TakesScreenshot</code> and <code>JavascriptExecutor</code> are interfaces — which is why we write <code>(TakesScreenshot) driver</code>. TestNG’s <code>ITestListener</code> is an interface I implement for screenshots on failure.<br>Rule of thumb: an interface for “can do” capabilities, an abstract class for an “is a” family with shared code.`,
    followups: [`Why do we cast the driver to TakesScreenshot?`, `Can an interface have a constructor?`, `What changed for interfaces in Java 8?`],
    mistakes: [`Saying interfaces can never contain method bodies — default and static methods have been allowed since Java 8.`, `Calling WebDriver a class.`],
    lesson: 'cg-oop'
  },
  {
    id: 'iq-cod-04', cat: 'coding', level: 'beginner', freq: 'common',
    q: `What does the static keyword mean in Java, and what is the risk of a static WebDriver in a framework?`,
    short: `static members belong to the class, not to an object: one shared copy, usable without creating an instance. A static WebDriver is convenient but shared by every thread, which breaks parallel runs.`,
    answer: `<code>static</code> means the member belongs to the class itself:<br>• <b>Static variable</b> — one copy shared by all instances, e.g. the constant <code>static final int TIMEOUT = 10;</code><br>• <b>Static method</b> — called without an object: <code>ConfigReader.get("baseUrl")</code>, <code>Math.max(a, b)</code>. It cannot use instance fields or <code>this</code> directly.<br>• <b>Static block</b> — runs once when the class loads; handy for loading a properties file.<br>• <b>Static nested class</b> — a nested class that needs no outer instance.<br><code>main</code> is static so the JVM can call it without creating an object.<br><b>Framework risk:</b> many beginner frameworks declare <code>public static WebDriver driver;</code> so every class can reach it. That works in a single thread but fails in parallel — all threads share one browser and interfere with each other. The usual fix is <code>ThreadLocal&lt;WebDriver&gt;</code>, or passing the driver into page objects through constructors. Static suits constants and stateless utilities, not state that belongs to one test.`,
    followups: [`Can a static method access an instance variable?`, `What is ThreadLocal, and why is it used with WebDriver?`],
    mistakes: [`Making the WebDriver static and then switching on parallel execution.`, `Saying static methods can be overridden.`],
    lesson: 'cg-oop'
  },
  {
    id: 'iq-cod-05', cat: 'coding', level: 'beginner', freq: 'common',
    q: `What is the difference between final, finally and finalize in Java?`,
    short: `final is a keyword that prevents change (a constant variable, a method that can’t be overridden, a class that can’t be extended). finally is a block that runs after try/catch. finalize() was a garbage-collection hook and is now deprecated.`,
    answer: `They only sound alike.<br><b>final</b> (keyword):<br>• a <code>final</code> variable can be assigned only once: <code>final String BASE_URL = "https://qa.shopflow.test";</code><br>• a <code>final</code> method cannot be overridden;<br>• a <code>final</code> class cannot be extended — <code>String</code> is final.<br><b>finally</b> (block) — follows <code>try</code>/<code>catch</code> and runs whether or not an exception was thrown, even when the try block returns. It is for cleanup:<br><code>try { checkout(); }<br>catch (TimeoutException e) { takeScreenshot(); throw e; }<br>finally { driver.quit(); }</code><br>It is skipped only in extreme cases such as <code>System.exit()</code> or a JVM crash. For files and connections, try-with-resources closes them automatically.<br><b>finalize()</b> (method) — was called by the garbage collector before reclaiming an object. Its timing is unpredictable and it has been deprecated since Java 9, so never rely on it. In tests, cleanup belongs in <code>@AfterMethod(alwaysRun = true)</code>.`,
    followups: [`Does finally run if the try block contains a return statement?`, `What is try-with-resources?`],
    mistakes: [`Saying finally runs only when an exception occurs.`, `Suggesting finalize() to clean up browser sessions.`],
    lesson: 'cg-errors-debugging'
  },
  {
    id: 'iq-cod-06', cat: 'coding', level: 'beginner', freq: 'common',
    q: `What is the difference between List, Set and Map in Java, and where do you use them in automation?`,
    short: `List: ordered, allows duplicates, index access (ArrayList). Set: no duplicates (HashSet unordered, LinkedHashSet keeps insertion order, TreeSet sorted). Map: key–value pairs with unique keys (HashMap, LinkedHashMap).`,
    answer: `<b>List</b> — ordered, allows duplicates, index access. <code>ArrayList</code> is the default choice; <code>LinkedList</code> only helps with frequent inserts and removals in the middle. <code>driver.findElements(By.cssSelector(".product-name"))</code> returns a <code>List&lt;WebElement&gt;</code> that I loop over to read texts or check sorting.<br><b>Set</b> — no duplicates. <code>HashSet</code> (no order guarantee), <code>LinkedHashSet</code> (insertion order), <code>TreeSet</code> (sorted). <code>driver.getWindowHandles()</code> returns a <code>Set&lt;String&gt;</code>. A Set also checks a dropdown for duplicate options: if <code>new HashSet&lt;&gt;(options).size() != options.size()</code>, something is repeated.<br><b>Map</b> — key–value pairs with unique keys. <code>HashMap</code> (no order), <code>LinkedHashMap</code> (insertion order), <code>TreeMap</code> (sorted keys). Useful for a test-data row (column → value), configuration values and counting character frequency.<br>A related favourite: <b>array vs ArrayList</b> — an array has a fixed size and can hold primitives; an ArrayList grows dynamically and holds objects.`,
    followups: [`What is the difference between HashMap and Hashtable?`, `Array or ArrayList — when would you use each?`],
    mistakes: [`Saying a HashSet keeps insertion order.`, `Saying Map extends the Collection interface the way List and Set do.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-07', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `Why are Strings immutable in Java, and when should you use StringBuilder or StringBuffer?`,
    short: `A String object never changes; operations like concat return a new String. That enables the string pool, thread safety and safe hashing. Use StringBuilder to build strings in loops; StringBuffer is the older synchronized and slower equivalent.`,
    answer: `Once a <code>String</code> is created, its value cannot change. <code>s.concat("!")</code> or <code>s + "!"</code> produces a new object; <code>s</code> still refers to the old one unless you reassign it.<br>Why Java does this:<br>• <b>String pool</b> — identical literals can safely share one object, saving memory.<br>• <b>Safety</b> — values such as URLs, file paths or class names can’t be altered after they have been checked.<br>• <b>Thread safety</b> — immutable objects can be shared between threads freely.<br>• <b>Hashing</b> — the hash code can be cached, which makes Strings reliable <code>HashMap</code> keys.<br><b>StringBuilder</b> — mutable, not synchronized, fast. Use it when building a string in a loop, or for a quick reverse: <code>new StringBuilder(s).reverse().toString()</code>.<br><b>StringBuffer</b> — mutable and synchronized (thread-safe) but slower; rarely needed today.<br>Related trap: compare String contents with <code>equals()</code>, not <code>==</code>, which compares references.`,
    followups: [`What is the difference between == and equals() for Strings?`, `How many objects does String s = new String("abc") create?`],
    mistakes: [`Thinking s = s + "x" modifies the original String object.`, `Using + concatenation inside a large loop.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-08', cat: 'coding', level: 'intermediate', freq: 'common',
    q: `What is the difference between checked and unchecked exceptions in Java, and how should a test framework handle exceptions?`,
    short: `Checked exceptions (IOException, SQLException) must be caught or declared with throws at compile time. Unchecked exceptions extend RuntimeException (NullPointerException, all Selenium exceptions) and are not compiler-enforced.`,
    answer: `<b>Checked exceptions</b> extend <code>Exception</code> but not <code>RuntimeException</code>. The compiler forces you to catch them or declare them with <code>throws</code>. Examples: <code>IOException</code> and <code>FileNotFoundException</code> when reading a config or Excel file, <code>SQLException</code>.<br><b>Unchecked exceptions</b> extend <code>RuntimeException</code>: <code>NullPointerException</code>, <code>ArrayIndexOutOfBoundsException</code>, <code>NumberFormatException</code>. Selenium’s <code>NoSuchElementException</code>, <code>TimeoutException</code> and <code>StaleElementReferenceException</code> all extend <code>WebDriverException</code>, which is unchecked. A failed assertion throws <code>AssertionError</code>, which is an <code>Error</code>, not an exception.<br>In a framework:<br>• Never swallow exceptions in an empty catch — that turns a real failure into a false pass.<br>• Catch only where you add value (log, screenshot, clean up), then rethrow.<br>• Use <code>finally</code> or <code>@AfterMethod(alwaysRun = true)</code> for <code>driver.quit()</code>.<br>• Let assertion errors fail the test; don’t catch them.`,
    followups: [`What is the difference between throw and throws?`, `Why is catching Exception everywhere a bad idea in tests?`],
    mistakes: [`Wrapping steps in try-catch that only prints the error, so the test still passes.`, `Calling NoSuchElementException a checked exception.`],
    lesson: 'cg-errors-debugging'
  },
  {
    id: 'iq-cod-09', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `Write a program to reverse a string without using a built-in reverse method.`,
    short: `Loop from the last character to the first and append each one to a StringBuilder, or swap characters with two pointers in a char array. Mention StringBuilder.reverse() as the one-line built-in option.`,
    answer: `Java, with a loop:<br><code>public static String reverse(String s) {<br>  if (s == null) return null;<br>  StringBuilder sb = new StringBuilder();<br>  for (int i = s.length() - 1; i &gt;= 0; i--) {<br>    sb.append(s.charAt(i));<br>  }<br>  return sb.toString();<br>}</code><br><code>reverse("Qadence")</code> returns <code>"ecnedaQ"</code>.<br>Why StringBuilder instead of <code>result = result + s.charAt(i)</code>? Strings are immutable, so concatenation in a loop creates a new object on every pass.<br>Two-pointer alternative: convert to a <code>char[]</code>, swap <code>arr[left]</code> and <code>arr[right]</code> while <code>left &lt; right</code>, then return <code>new String(arr)</code>. Both are O(n).<br>Built-ins, if allowed: <code>new StringBuilder(s).reverse().toString()</code> in Java, <code>s.split('').reverse().join('')</code> in JavaScript.<br>Mention edge cases — null, empty string, one character, spaces. A common variant reverses the <em>words</em> of a sentence: split on spaces and join the words in reverse order.`,
    followups: [`How would you reverse each word but keep the word order?`, `What is the time complexity of your solution?`],
    mistakes: [`Concatenating with + inside the loop without knowing why it is inefficient.`, `Ignoring null or empty input.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-10', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `How do you check whether a string is a palindrome?`,
    short: `Compare characters from both ends, moving inwards with two pointers; if any pair differs it is not a palindrome. First clarify whether case, spaces and punctuation should be ignored.`,
    answer: `Two-pointer approach in Java:<br><code>public static boolean isPalindrome(String s) {<br>  String clean = s.toLowerCase().replaceAll("[^a-z0-9]", "");<br>  int left = 0, right = clean.length() - 1;<br>  while (left &lt; right) {<br>    if (clean.charAt(left) != clean.charAt(right)) return false;<br>    left++;<br>    right--;<br>  }<br>  return true;<br>}</code><br><code>isPalindrome("Madam")</code> → true; <code>isPalindrome("Race car")</code> → true after cleaning; <code>isPalindrome("QA")</code> → false.<br>It runs in O(n) and needs no reversed copy. The simpler alternative compares the string with its reverse: <code>clean.equals(new StringBuilder(clean).reverse().toString())</code>.<br>What interviewers like to see: you <b>ask clarifying questions first</b> — ignore case and spaces? what about an empty string? — and you test your own code with a few inputs, just as you would test a feature. A common follow-up is a number palindrome such as 121, solved by reversing the digits with <code>% 10</code> and <code>/ 10</code>.`,
    followups: [`How would you check whether a number is a palindrome without converting it to a string?`, `How would you find the longest palindromic substring?`],
    mistakes: [`Comparing strings with == instead of equals().`, `Not clarifying whether case, spaces and punctuation count.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-11', cat: 'coding', level: 'beginner', freq: 'common',
    q: `How do you find duplicate elements in an array?`,
    short: `Loop once and add each element to a HashSet; when add() returns false, the element is a duplicate. That is O(n). Comparing every pair with nested loops works but is O(n²).`,
    answer: `Efficient Java solution with a <code>HashSet</code>:<br><code>public static Set&lt;Integer&gt; findDuplicates(int[] nums) {<br>  Set&lt;Integer&gt; seen = new HashSet&lt;&gt;();<br>  Set&lt;Integer&gt; dups = new LinkedHashSet&lt;&gt;();<br>  for (int n : nums) {<br>    if (!seen.add(n)) dups.add(n);<br>  }<br>  return dups;<br>}</code><br>For <code>{4, 2, 7, 2, 9, 4, 4}</code> it returns <code>[2, 4]</code>. <code>Set.add()</code> returns <code>false</code> when the value is already present, and collecting duplicates in a second set reports 4 once even though it appears three times.<br>Alternatives:<br>• Nested loops comparing every pair — easy to explain, but O(n²).<br>• Sort a copy, then compare neighbours — O(n log n) with no extra set.<br>• To report <em>how many times</em> each value occurs, count with a <code>HashMap&lt;Integer, Integer&gt;</code>.<br>The QA link: the same idea checks a UI list, such as product names on a search page, for duplicates.`,
    followups: [`How would you remove duplicates but keep the original order?`, `What is the time complexity of each approach?`],
    mistakes: [`Offering only the O(n²) nested loop without mentioning a better option.`, `Printing the same duplicate several times when it appears more than twice.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-12', cat: 'coding', level: 'beginner', freq: 'very-common',
    q: `Write a program to count the occurrences of each character in a string.`,
    short: `Iterate over the characters and keep counts in a map — a LinkedHashMap in Java (keeps first-seen order) using getOrDefault or merge, or a plain object or Map in JavaScript.`,
    answer: `Java:<br><code>public static Map&lt;Character, Integer&gt; charCount(String s) {<br>  Map&lt;Character, Integer&gt; counts = new LinkedHashMap&lt;&gt;();<br>  for (char c : s.toCharArray()) {<br>    if (c == ' ') continue;<br>    counts.put(c, counts.getOrDefault(c, 0) + 1);<br>  }<br>  return counts;<br>}</code><br><code>charCount("testing")</code> → <code>{t=2, e=1, s=1, i=1, n=1, g=1}</code>.<br><code>LinkedHashMap</code> keeps the order in which characters first appear; a <code>HashMap</code> also works but its print order isn’t guaranteed. <code>counts.merge(c, 1, Integer::sum)</code> is a shorter alternative.<br>JavaScript:<br><code>const counts = {};<br>for (const ch of 'testing') counts[ch] = (counts[ch] || 0) + 1;</code><br>Variants built on the same map: print only duplicate characters (count &gt; 1), find the first non-repeating character (the first key with count 1 — another reason to keep insertion order), find the most frequent character, or check whether two words are anagrams. Ask whether upper and lower case count as the same character.`,
    followups: [`How would you find the first non-repeating character?`, `How would you check whether two strings are anagrams?`],
    mistakes: [`Using a HashMap and promising the output will be in insertion order.`, `Not deciding how to treat spaces and letter case.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-13', cat: 'coding', level: 'beginner', freq: 'occasional',
    q: `Write FizzBuzz: print 1 to 100, but “Fizz” for multiples of 3, “Buzz” for multiples of 5 and “FizzBuzz” for multiples of both.`,
    short: `Loop from 1 to 100 and check divisibility by 15 (both 3 and 5) first, then by 3, then by 5, otherwise print the number. The order of the conditions is the whole trick.`,
    answer: `JavaScript (the same logic works in Java with <code>System.out.println</code>):<br><code>for (let i = 1; i &lt;= 100; i++) {<br>  if (i % 15 === 0) console.log('FizzBuzz');<br>  else if (i % 3 === 0) console.log('Fizz');<br>  else if (i % 5 === 0) console.log('Buzz');<br>  else console.log(i);<br>}</code><br>The key detail is checking the combined case <b>first</b>. If you test <code>i % 3</code> first, 15 prints “Fizz” and never reaches “FizzBuzz”.<br>Interviewers use FizzBuzz to see whether you can turn a requirement into correct logic — and, for a QA role, whether you think about testing it. Mention the values you would check: 1 (a plain number), 3, 5, 15, 30, 99 and 100. That is equivalence partitioning and boundary thinking applied to code, exactly what a tester should show.<br>A typical extension: make the rules configurable (say 7 → “Bazz”) without adding more <code>if</code> branches, by looping over a list of rules and building the output string.`,
    followups: [`Which inputs would you use to test your FizzBuzz function?`, `How would you make the rules configurable?`],
    mistakes: [`Checking divisibility by 3 or 5 before checking 15.`, `Declaring the code done without trying a few values.`],
    lesson: 'cg-coding-interview'
  },
  {
    id: 'iq-cod-14', cat: 'coding', level: 'beginner', freq: 'common',
    q: `In JavaScript, what is the difference between var, let and const, and between == and ===?`,
    short: `let and const are block-scoped; const can’t be reassigned (though an object it holds can still change); var is function-scoped and hoisted, so avoid it. == compares after type coercion; === compares value and type without coercion.`,
    answer: `<b>var, let and const</b><br>• <code>var</code> — function-scoped and hoisted (usable before its line, as <code>undefined</code>). It leaks out of <code>if</code> blocks and loops and causes subtle bugs, so avoid it in modern code.<br>• <code>let</code> — block-scoped and can be reassigned: <code>let attempts = 0; attempts++;</code><br>• <code>const</code> — block-scoped and cannot be reassigned, but the object it points to can still change: <code>const user = { name: 'Ali' }; user.name = 'Sara';</code> is allowed.<br>In Playwright tests I default to <code>const</code> — <code>const loginButton = page.getByRole('button', { name: 'Log in' });</code> — and use <code>let</code> only when a value really changes.<br><b>== vs ===</b><br>• <code>==</code> converts types before comparing: <code>'5' == 5</code>, <code>0 == ''</code> and <code>null == undefined</code> are all <code>true</code>.<br>• <code>===</code> checks value and type: <code>'5' === 5</code> is <code>false</code>.<br>Always use <code>===</code>. It matters in tests, where an API might return <code>"200"</code> as a string while you expect the number 200.`,
    followups: [`What is hoisting?`, `What does typeof null return?`],
    mistakes: [`Saying const makes an object completely unchangeable.`, `Using == in checks and getting false passes from type coercion.`],
    lesson: 'cg-js-basics'
  },
  {
    id: 'iq-cod-15', cat: 'coding', level: 'intermediate', freq: 'common',
    q: `What are Promises and async/await in JavaScript, and why does almost every Playwright action start with await?`,
    short: `A Promise represents a result that arrives later; async/await lets you write asynchronous code step by step. Playwright actions and assertions talk to the browser asynchronously, so each returns a Promise you must await.`,
    answer: `A <b>Promise</b> stands for a value that will be available later: it is pending, then fulfilled or rejected. You can chain <code>.then()</code> and <code>.catch()</code>, but <code>async</code>/<code>await</code> reads more clearly:<br><code>async function getUser(id) {<br>  const res = await fetch('/api/users/' + id);<br>  if (!res.ok) throw new Error('Status ' + res.status);<br>  return res.json();<br>}</code><br><code>await</code> pauses that function until the Promise settles, and a rejection becomes a thrown error you can handle with <code>try</code>/<code>catch</code>.<br>Playwright sends actions such as <code>goto</code>, <code>click</code> and <code>fill</code>, and web-first <code>expect</code> checks, to the browser and waits for the reply, so they return Promises. Creating a locator with <code>page.getByRole()</code> is synchronous and needs no <code>await</code>; acting on it does. Forgetting <code>await</code> is a classic bug: steps run out of order, failures look random, or a check never really runs. The <code>@typescript-eslint/no-floating-promises</code> lint rule catches it.<br><code>Promise.all</code> runs things concurrently, for example starting <code>page.waitForResponse()</code> together with the click that triggers it.`,
    followups: [`What happens if you forget await before a click?`, `What is the difference between Promise.all and awaiting calls one by one?`],
    mistakes: [`Putting await in front of locator creation but forgetting it on actions and assertions.`, `Saying async JavaScript code runs on multiple threads.`],
    lesson: 'cg-async'
  },
  {
    id: 'iq-cod-16', cat: 'coding', level: 'intermediate', freq: 'common',
    q: `What is the difference between git merge and git rebase, how do you resolve a merge conflict, and when do you use git stash?`,
    short: `Merge joins branches with a merge commit and keeps history as it happened; rebase replays your commits on top of another branch for a linear history. Resolve conflicts by editing the marked sections, then add and continue. Stash shelves uncommitted work.`,
    answer: `<b>Merge:</b> <code>git merge main</code> joins the histories, usually with a merge commit. It is safe on shared branches because existing commits are not rewritten.<br><b>Rebase:</b> <code>git rebase main</code> replays your branch’s commits on top of the latest <code>main</code>, giving a clean linear history. It rewrites commit hashes, so the golden rule is: never rebase commits that others have already pulled. After rebasing your own pushed branch, use <code>git push --force-with-lease</code>.<br><b>Conflicts:</b> Git marks the file with <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>. I decide what the combined code should be (asking the other author if unsure), remove the markers, run the affected tests, then <code>git add</code> the file and <code>git commit</code> — or <code>git rebase --continue</code>.<br><b>Stash:</b> <code>git stash</code> shelves uncommitted changes so I can switch branches for something urgent; <code>git stash pop</code> brings them back.<br>Daily commands: <code>status</code>, <code>pull</code>, <code>switch -c</code>, <code>add</code>, <code>commit</code>, <code>push</code>, <code>log --oneline</code>, <code>diff</code>.`,
    followups: [`What is the difference between git fetch and git pull?`, `How would you undo a commit you have already pushed?`],
    mistakes: [`Rebasing a shared branch and force-pushing over teammates’ work.`, `Resolving conflicts by blindly accepting “mine” or “theirs” without checking the result.`],
    lesson: 'cg-git'
  },

  /* ───────────── behavioural ───────────── */
  {
    id: 'iq-beh-01', cat: 'behavioral', level: 'beginner', freq: 'very-common',
    q: `Tell me about yourself.`,
    short: `Give a 60–90 second present–past–future pitch: your current role or focus, the QA skills and one concrete result that back it up, and why this role is your logical next step. Professional, not your life story.`,
    answer: `Use a <b>present → past → future</b> structure and keep it to about 60–90 seconds. The quotes below are a model — replace them with your own facts and numbers.<br><b>Present:</b> who you are professionally now. “I’m a QA engineer with two years’ experience testing web and API features for an e-commerce product.”<br><b>Past:</b> the skills, plus one or two concrete results that prove them. “I write test cases from user stories, do exploratory and API testing in Postman, and for the past year I’ve been automating our regression suite with Selenium, Java and TestNG, which took regression from two days to about half a day.”<br><b>Future:</b> why this role. “I want to go deeper into automation and CI, which is why this SDET role interests me.”<br>A fresher replaces work experience with real evidence: ISTQB Foundation, an internship, a final-year project, or a portfolio test suite on GitHub.<br>Avoid reading your CV line by line, personal details unrelated to the job, and any claim you can’t defend when the interviewer digs deeper.`,
    followups: [`Why are you looking to change jobs?`, `What does a typical day look like in your current role?`],
    mistakes: [`Narrating your whole life story from school onwards.`, `Quoting inflated metrics you can’t explain when asked for details.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-02', cat: 'behavioral', level: 'beginner', freq: 'common',
    q: `Why did you choose software testing / QA as a career?`,
    short: `Give a genuine reason tied to what testers really do — curiosity about how things break, caring about users, enjoying investigation — plus evidence you have pursued it, and show you see QA as a career, not a stepping stone.`,
    answer: `Interviewers are checking two things: that your motivation is genuine, and that you won’t leave QA at the first chance unless the role is designed as a path.<br>A strong answer has three parts:<br>1. <b>A real trigger</b>, for example: “During my final-year project I was the one who kept finding edge cases — an empty cart, a double click on Pay — and I enjoyed that more than building new screens.”<br>2. <b>What you like about the work:</b> investigating problems, thinking like different users, protecting customers and the business from costly failures, and working across product, development and support.<br>3. <b>Evidence you followed through:</b> courses, ISTQB Foundation, practice projects, bug reports on open-source or crowd-testing platforms, learning SQL, API testing and automation.<br>If you moved into QA from another field, say what transfers: customer support gives empathy for user pain; accounting gives attention to detail.<br>Only use a trigger that really happened to you — a vague, rehearsed story is easy to spot.`,
    followups: [`Do you plan to move into development later?`, `What do you find hardest about testing?`],
    mistakes: [`Saying “testing is easier than development” or “I couldn’t get a developer job.”`, `Saying only “I like finding bugs” with no evidence.`],
    lesson: 'cp-career'
  },
  {
    id: 'iq-beh-03', cat: 'behavioral', level: 'beginner', freq: 'very-common',
    q: `What are your strengths and weaknesses as a tester?`,
    short: `Pick one or two job-relevant strengths with a short proof each, and one real, non-critical weakness together with the concrete steps you are taking to improve it.`,
    answer: `<b>Strengths:</b> choose one or two that matter in QA and prove each with a short example rather than adjectives.<br>“Attention to detail” alone is weak. Stronger: “I’m thorough with edge cases — on a booking feature I tested time zones and found that appointments booked after 11 p.m. showed on the wrong day.” Other good strengths: clear bug reports, explaining risk to non-technical people, learning tools quickly, API or SQL skills.<br><b>Weakness:</b> choose something real that is not a core requirement of the role, and show your improvement plan.<br>Example shape: “My automation coding was slower than I wanted. For the last few months I’ve practised Java problems weekly and had a senior engineer review my page objects; my pull requests now need far fewer changes.”<br>Skip disguised strengths like “I’m a perfectionist” or “I work too hard” — interviewers hear them daily. Also avoid weaknesses that disqualify you, such as “I find documenting bugs boring” for a QA role. Use situations from your own work or study: specific and honest beats impressive and vague.`,
    followups: [`How do you know you have improved on that weakness?`, `What would your previous manager say about you?`],
    mistakes: [`Presenting a disguised strength, such as perfectionism, as a weakness.`, `Listing adjectives without a single example.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-04', cat: 'behavioral', level: 'intermediate', freq: 'very-common',
    q: `Tell me about a bug you missed that reached production. What did you learn?`,
    short: `Own it without blaming others, explain briefly why it slipped through, show how you helped fix it quickly, and describe the lasting change — a new test, checklist item or automated check — that prevents the same class of bug.`,
    answer: `This tests ownership and learning, so use STAR and spend most of the time on actions and lessons. A model to adapt with your own real incident:<br><b>Situation:</b> “We released a profile-update feature for an HR portal.”<br><b>Task:</b> “I had tested it with typical English names and it passed.”<br><b>Action:</b> “Two days after release, support reported that names with an apostrophe, like O’Brien, failed to save. I reproduced it within the hour, logged a clear bug with the API response, and retested the hotfix the same day. Then I looked at why I’d missed it: my test data had no special characters, and our test cases never mentioned them.”<br><b>Result:</b> “I created a reusable data set with apostrophes, Unicode and very long names, added it to regression and our API checks, and proposed a ‘data variety’ item for test-case reviews. Similar input bugs were caught before release afterwards.”<br>Testing can’t prove the absence of defects, so interviewers expect misses. What they judge is how you respond — even a small miss from a project or internship works.`,
    followups: [`How did you communicate the miss to your team?`, `How do you decide what goes into the regression suite?`],
    mistakes: [`Claiming you have never missed a bug.`, `Blaming developers, requirements or time pressure without showing your own learning.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-05', cat: 'behavioral', level: 'intermediate', freq: 'very-common',
    q: `Tell me about a conflict or disagreement you had with a developer. How did you resolve it?`,
    short: `Choose a real technical disagreement, such as a rejected bug, and tell it with STAR: you gathered evidence, checked the requirement, talked it through in person and involved the product owner if needed. Stress the outcome, not winning.`,
    answer: `Pick a real technical disagreement — a rejected bug, a priority or release-readiness dispute — rather than a personality clash, and show that you rely on evidence, not emotion. A model to adapt:<br><b>Situation:</b> “I reported that the checkout total ignored a discount code when the cart was edited after applying it. The developer closed it as ‘can’t reproduce’.”<br><b>Task:</b> “I had to confirm whether it was really a defect and, if so, get it fixed before release.”<br><b>Action:</b> “I retested in a clean session, recorded a short video, attached the network response showing the wrong total, and listed exact steps and data. The user story said the discount applies to the current cart. Rather than arguing in ticket comments, I asked for ten minutes to walk through it together — he saw the discount was calculated only on the original cart.”<br><b>Result:</b> “It was fixed before release, and I now attach network evidence to similar reports by default.”<br>Had the evidence shown expected behaviour, the right move was to accept it or ask the product owner to clarify. Use your own example — the pattern matters more than the drama.`,
    followups: [`What if the product owner sides with the developer?`, `How do you keep a good working relationship with developers?`],
    mistakes: [`Describing the developer as incompetent or the conflict as a personal win.`, `Escalating to managers immediately without first trying to resolve it together.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-06', cat: 'behavioral', level: 'advanced', freq: 'very-common',
    q: `Tell me about a time you had to test under a tight deadline. What did you do?`,
    short: `Tell a real STAR story: how you ranked the work by risk, agreed the reduced scope openly with your lead or product owner, used automation or pairing to move faster, and reported what was left untested — never silently cutting coverage.`,
    answer: `Interviewers want a real story that shows judgement under pressure, not a promise to work all night. Lead with STAR, then state the principle. A model to adapt with your own case:<br><b>Situation:</b> “A payment-provider change had to ship on Friday, and the build reached QA on Wednesday afternoon.”<br><b>Task:</b> “I had two days for work we normally test in four.”<br><b>Action:</b> “I listed the changed areas and ranked them by risk: the new provider’s success, failure and refund paths first, then the checkout screens it touched, then everything else through our automated smoke suite. I shared the plan with the lead and product owner that afternoon, including two low-risk admin reports I proposed to test after release, and they agreed. I paired with a developer to get through the refund edge cases faster.”<br><b>Result:</b> “We shipped on time with no payment incidents, and the deferred areas were tested the following week.”<br>The principle: I never quietly cut coverage. I prioritise by risk, make the trade-off visible, and report what was and wasn’t tested so the team can make an informed release decision.`,
    followups: [`What would you do if you found a critical bug the day before release?`, `Who makes the final go/no-go decision?`],
    mistakes: [`Saying you would work all night to test everything — that is not a strategy.`, `Silently reducing coverage without telling anyone.`],
    lesson: 'fd-risk-based'
  },
  {
    id: 'iq-beh-07', cat: 'behavioral', level: 'intermediate', freq: 'common',
    q: `Tell me about a time you worked on a feature with unclear or missing requirements. How did you handle it?`,
    short: `Share a real STAR example: the specific questions you raised (with examples), who you involved, the assumptions you documented and got confirmed, and how you kept testing moving — showing communication, not just a checklist.`,
    answer: `This is the behavioural version of the requirements question, so answer with a real example that shows communication, not just a checklist. A model to adapt:<br><b>Situation:</b> “A ‘bulk upload employees’ story for our HR portal only said ‘admin can upload a CSV’.”<br><b>Task:</b> “Testing had to start in the same sprint, so I needed clear expected behaviour quickly.”<br><b>Action:</b> “I wrote specific questions with examples — what is the maximum file size? what if two rows share an employee ID? does one bad row reject the whole file? — and took them to a short three-amigos call with the product owner and developer. Where nobody knew yet, I wrote my assumption into the ticket and asked the product owner to confirm it. Meanwhile I explored the first build to learn how it actually behaved.”<br><b>Result:</b> “We agreed five acceptance criteria. One of my assumptions turned out to be wrong, and we caught it before the code was finished, so duplicate handling shipped the way the business wanted.”<br>Close with the lesson: ask early, use concrete examples, write assumptions down, and keep testing moving while the details settle.`,
    followups: [`What do you do if the product owner is unavailable?`, `How would you test a feature with no documentation at all?`],
    mistakes: [`Waiting for perfect requirements before starting any testing.`, `Testing against your own assumptions without telling anyone.`],
    lesson: 'mt-requirements'
  },
  {
    id: 'iq-beh-08', cat: 'behavioral', level: 'beginner', freq: 'common',
    q: `How do you keep your testing skills up to date?`,
    short: `Name specific, current habits — official docs and release notes for your tools, a few community sources, hands-on practice projects — and one example of applying something new at work, rather than a generic “I read blogs.”`,
    answer: `Interviewers want specific, recent and practical habits, plus evidence that you apply what you learn. Cover a few of these, and name only things you really follow:<br>• <b>Official sources:</b> release notes and documentation for your tools — for example reading the Selenium or Playwright release notes before an upgrade, so you know about new features and deprecations.<br>• <b>Community:</b> a couple of testing newsletters or podcasts, recorded conference talks, local QA meetups or online communities where testers discuss real problems.<br>• <b>Structured learning:</b> a certification path such as ISTQB, or a course in an area you’re growing into, such as API, performance or accessibility testing.<br>• <b>Practice:</b> a small portfolio project — automating a demo site or testing a public API — where you can try new features safely.<br>• <b>Applying it:</b> an example in this shape: “After learning about Playwright’s trace viewer, I turned on traces for retried tests in our pipeline, and debugging CI failures became much faster.”<br>Be ready for the follow-up “What did you learn recently?” with one concrete answer.`,
    followups: [`What is something new you learned in the last month?`, `Which testing trend do you think matters most right now?`],
    mistakes: [`Saying “I read blogs” without naming anything or giving an example.`, `Listing resources you can’t discuss when the interviewer asks about them.`],
    lesson: 'cp-career'
  },
  {
    id: 'iq-beh-09', cat: 'behavioral', level: 'intermediate', freq: 'common',
    q: `What is your biggest achievement in QA so far?`,
    short: `Pick one specific accomplishment with a measurable or clearly described impact — a critical bug caught, a process improved, a suite automated — and tell it with STAR, making your personal contribution clear.`,
    answer: `Choose one story with a clear before and after, with your own role at the centre. A measurable impact is ideal, but an honest qualitative result is fine.<br>A STAR shape to adapt with your real details:<br><b>Situation:</b> “Our regression was fully manual and took three testers two days every release, so releases kept slipping.”<br><b>Task:</b> “I volunteered to automate the most repeated, stable scenarios.”<br><b>Action:</b> “I ranked regression cases by frequency and risk, built a Page Object framework with Selenium, Java and TestNG, added screenshots on failure and scheduled a nightly Jenkins run. I documented it and ran a short session so others could add tests.”<br><b>Result:</b> “Those areas went from two days to a few hours, the team spent the saved time exploring new features, and the suite caught two regressions in its first month.”<br>Other strong choices: finding a high-impact defect such as a double charge before release, introducing a bug-report template that cut rejected bugs, or mentoring a new tester. For a fresher, a well-built portfolio project counts.`,
    followups: [`What was the hardest part of that work?`, `What would you do differently now?`],
    mistakes: [`Saying “we” throughout, so your own contribution is invisible.`, `Choosing an achievement unrelated to the role.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-10', cat: 'behavioral', level: 'intermediate', freq: 'very-common',
    q: `Describe your current project and your role in it.`,
    short: `Explain the product and its users in a line or two, the team and process, your responsibilities, the tools and types of testing you do, and one concrete contribution — without revealing confidential details.`,
    answer: `Structure it so the interviewer can follow quickly. The quotes are a template; describe only what you actually did.<br>1. <b>Product:</b> “A web and mobile clinic-booking platform used by patients and clinic staff.” Leave out client names and confidential details.<br>2. <b>Team and process:</b> “Scrum with two-week sprints; six developers, two testers, one product owner.”<br>3. <b>Your responsibilities:</b> “I review user stories in refinement, write test scenarios and cases, test features within the sprint, do API testing in Postman, log and retest defects in Jira, and maintain part of our Selenium regression suite.”<br>4. <b>Testing types and tools:</b> functional, regression, API, cross-browser, and SQL checks of booking data.<br>5. <b>One contribution:</b> “I added API checks for the booking endpoints that now run in CI on every merge.”<br>Expect deep follow-ups on anything you mention — which modules, how many test cases, a tricky bug, how the CI job is triggered. Freshers can use an internship, final-year or portfolio project with the same structure.`,
    followups: [`Which module was the most challenging to test, and why?`, `How many test cases or automated tests do you maintain?`, `How do you report test progress to your team?`],
    mistakes: [`Describing what the whole team did without making your own role clear.`, `Sharing confidential client names or internal data.`],
    lesson: 'cp-interview-tech'
  },
  {
    id: 'iq-beh-11', cat: 'behavioral', level: 'intermediate', freq: 'common',
    q: `How do you prioritise your testing work when several tasks or tickets compete for your time?`,
    short: `Rank by business impact and risk, release dates and dependencies (what is blocking others), agree the order with your lead or product owner when priorities conflict, and re-check daily as things change.`,
    answer: `I use a few clear criteria and make the order visible.<br>• <b>Release and business impact:</b> whatever ships soonest and touches critical flows such as payments or login comes first.<br>• <b>Risk:</b> new or heavily changed code, complex logic, areas with a history of defects.<br>• <b>Unblocking others:</b> retesting a fix a developer is waiting on, or a smoke test that decides whether a build is testable, beats starting a new feature.<br>• <b>Effort:</b> quick checks that close tickets fit between longer tasks.<br>When priorities genuinely conflict, I confirm with my lead or the product owner instead of guessing, and revisit the order at stand-up.<br>Example to adapt: “On the last day of a sprint I had a blocker fix to retest, a new report screen to explore and an automation update. I retested the blocker first because the release depended on it, explored the report next because it was going to the client, and moved the automation update to the next sprint with my lead’s agreement.”<br>Within a feature, I order test cases by risk so the most important checks run first if time runs short.`,
    followups: [`What do you do if two managers give you conflicting priorities?`, `How do you prioritise test cases within a single feature?`],
    mistakes: [`Saying you simply work on tickets in the order they arrive.`, `Never telling anyone when you can’t finish everything.`],
    lesson: 'mt-prioritization'
  },
  {
    id: 'iq-beh-12', cat: 'behavioral', level: 'beginner', freq: 'common',
    q: `Why should we hire you?`,
    short: `Connect the role’s top two or three needs to your matching skills with evidence, add what makes you distinct (domain knowledge, manual depth plus automation, communication), and close with genuine interest in this team.`,
    answer: `Treat it as a short closing pitch built from the job description, not a list of adjectives.<br>1. <b>Mirror their needs:</b> pick the top two or three requirements — say API testing, Selenium with Java, and Scrum experience.<br>2. <b>Match each with evidence from your own work:</b> “I’ve tested REST APIs in Postman with chained requests and environments, I maintain a Selenium and TestNG suite that runs nightly, and I’ve worked in two-week sprints for over a year.”<br>3. <b>Add a differentiator:</b> domain knowledge (fintech, healthcare, e-commerce), strong bug reporting and communication, or real depth in both manual and automated testing.<br>4. <b>Close with motivation:</b> “I want a team where I can grow into CI and performance testing, and this role offers that.”<br>Keep it under a minute, confident but not arrogant. Don’t compare yourself with candidates you haven’t met, and don’t overclaim a skill the interviewer just saw you struggle with — describe it honestly as something you’re actively building.`,
    followups: [`What would you focus on in your first 90 days here?`, `What makes you different from other QA candidates?`],
    mistakes: [`Answering with generic traits like “hard-working and honest” and nothing specific.`, `Saying “because I really need this job.”`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-13', cat: 'behavioral', level: 'beginner', freq: 'common',
    q: `Where do you see yourself in five years?`,
    short: `Describe a realistic growth direction within quality engineering — deeper automation or SDET skills, a specialism such as performance or security, or test leadership — and link it to what this role offers.`,
    answer: `The interviewer wants to know whether your goals fit the role and whether you’ve thought about your growth — not a precise prediction.<br>A good shape:<br>• <b>A direction within quality:</b> “I see myself as a senior QA engineer or SDET who designs automation frameworks and test strategy,” or “specialising in performance testing,” or “leading a small QA team and mentoring juniors.”<br>• <b>Steps to get there:</b> “Over the next couple of years I want to get strong in API automation and CI, and earn an advanced certification.”<br>• <b>Link to this job:</b> “This role’s mix of manual and automation work, and the chance to work on CI pipelines, is a good step towards that.”<br>Be honest: if you hope to move from manual testing to automation, say so — most teams value that ambition. Avoid answers that suggest you’ll leave soon, such as switching to development or starting your own business, unless that genuinely fits the role’s path.`,
    followups: [`What are you doing now to work towards that goal?`, `Would you prefer a technical path or a management path?`],
    mistakes: [`Saying “I don’t know” or joking “in your seat”.`, `Describing a goal that has nothing to do with QA or the company.`],
    lesson: 'cp-career'
  },
  {
    id: 'iq-beh-14', cat: 'behavioral', level: 'beginner', freq: 'very-common',
    q: `Do you have any questions for us? What should you ask the interviewer?`,
    short: `Always ask two or three thoughtful questions about how the team tests, ships and grows — QA’s role in the process, automation and CI, what success looks like in the first months — rather than asking only about salary or leave.`,
    answer: `“No, everything is clear” wastes a chance to show interest and to judge whether the job suits you. Prepare about five questions and ask two or three that weren’t already answered:<br>• “How is QA involved in the sprint — do testers join refinement and review acceptance criteria?”<br>• “What is the current balance of manual and automated testing, and which tools do you use?”<br>• “When do automated tests run — on every pull request, nightly, before release?”<br>• “How are bugs prioritised, and who makes the release decision?”<br>• “What would success look like in this role after three months?”<br>• “What is the biggest quality challenge the team faces right now?”<br>• “How does the team support learning — certifications, conference time, mentoring?”<br>Listen to the answers and ask a short follow-up; it shows real engagement. Save salary and benefits for the HR round unless the interviewer raises them, and skip questions answered on the company’s website.`,
    followups: [`Which questions would you ask a hiring manager versus a fellow tester on the team?`],
    mistakes: [`Having no questions at all.`, `Asking only about salary, leave or remote work in the first technical round.`],
    lesson: 'cp-interview-behavioral'
  },
  {
    id: 'iq-beh-15', cat: 'behavioral', level: 'beginner', freq: 'common',
    q: `What are your salary expectations, and how should you handle this question?`,
    short: `Research the market range for the role, level and city beforehand, give a reasoned range based on that research and your skills, consider the whole package, and stay polite and flexible — never an unprepared number.`,
    answer: `This is about preparation and tone, not a magic number.<br>1. <b>Research first:</b> salary surveys, job portals and conversations with people in similar roles, for your city, experience and skill set (manual or automation, domain). Ranges vary a lot between cities, company sizes, and local versus international clients.<br>2. <b>Know your numbers:</b> your current package (if any), the minimum you would accept, and your target.<br>3. <b>Give a researched range:</b> “Based on my research for QA engineers with two years of automation experience in this city, and the responsibilities we discussed, I’m looking for something between X and Y, and I’m open to discussing the full package.” Put your real target near the bottom of the range.<br>4. <b>Weigh the whole offer:</b> health cover, bonuses, learning budget, remote work, growth path.<br>5. <b>If it’s too early:</b> it’s fine to ask, “Could you share the budgeted range for this role?”<br>If asked about your current salary, be truthful — figures can be checked during background verification.`,
    followups: [`What would you do if the offer is below your expectation?`, `Should you reveal your current salary?`],
    mistakes: [`Giving a random number without research, or one fixed figure with no flexibility.`, `Inflating your current salary.`],
    lesson: 'cp-career'
  },
]);
