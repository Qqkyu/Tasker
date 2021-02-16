#include "database/modify/db_modify.hpp"
#include "database/insert/db_insert.hpp"
#include "database/fetch/db_fetch.hpp"
#include "todo.hpp"
#include <sqlite3.h>
#include <vector>
#include <string>

const int WINDOW_WIDTH = 1920;
const int WINDOW_HEIGHT = 1080;

TodoApp::TodoApp() {
    ///
    /// Create our main App instance.
    ///
    app_ = App::Create();

    ///
    /// Create a resizable window by passing by OR'ing our window flags with
    /// kWindowFlags_Resizable.
    ///
    window_ = Window::Create(app_->main_monitor(), WINDOW_WIDTH, WINDOW_HEIGHT,
                             false, kWindowFlags_Titled | kWindowFlags_Resizable);

    ///
    /// Tell our app to use 'window' as our main window.
    ///
    /// This call is required before creating any overlays or calling App::Run
    ///
    app_->set_window(*window_.get());

    ///
    /// Create our HTML overlay-- we don't care about its initial size and
    /// position because it'll be calculated when we call OnResize() below.
    ///
    overlay_ = Overlay::Create(*window_.get(), 1, 1, 0, 0);

    ///
    /// Force a call to OnResize to perform size/layout of our overlay.
    ///
    OnResize(window_->width(), window_->height());

    ///
    /// Load a page into our overlay's View
    ///
    overlay_->view()->LoadURL("file:///app.html");

    ///
    /// Register our TodoApp instance as an AppListener so we can handle the
    /// App's OnUpdate event below.
    ///
    app_->set_listener(this);

    ///
    /// Register our TodoApp instance as a WindowListener so we can handle the
    /// Window's OnResize event below.
    ///
    window_->set_listener(this);

    ///
    /// Register our TodoApp instance as a LoadListener so we can handle the
    /// View's OnFinishLoading and OnDOMReady events below.
    ///
    overlay_->view()->set_load_listener(this);

    ///
    /// Register our TodoApp instance as a ViewListener so we can handle the
    /// View's OnChangeCursor and OnChangeTitle events below.
    ///
    overlay_->view()->set_view_listener(this);
}

TodoApp::~TodoApp() {
}

void TodoApp::Run() {
    app_->Run();
}

void TodoApp::OnUpdate() {
    ///
    /// This is called repeatedly from the application's update loop.
    ///
    /// You should update any app logic here.
    ///
}

void TodoApp::OnClose() {
}

void TodoApp::OnResize(uint32_t width, uint32_t height) {
    ///
    /// This is called whenever the window changes size (values in pixels).
    ///
    /// We resize our overlay here to take up the entire window.
    ///
    overlay_->Resize(width, height);
}

void TodoApp::OnFinishLoading(ultralight::View* caller,
                              uint64_t frame_id,
                              bool is_main_frame,
                              const String& url) {
    ///
    /// This is called when a frame finishes loading on the page.
    ///
}

void TodoApp::OnDOMReady(ultralight::View* caller,
                         uint64_t frame_id,
                         bool is_main_frame,
                         const String& url) {
    Ref<JSContext> context = caller->LockJSContext();
    SetJSContext(context.get());
    JSObject global = JSGlobalObject();
    global["fetchAllTasks"] = BindJSCallbackWithRetval(&TodoApp::fetchAllTasks);
    global["fetchClosestTask"] = BindJSCallbackWithRetval(&TodoApp::fetchClosestTask);
    global["insertTask"] = BindJSCallback(&TodoApp::insertTask);
    global["markAsDone"] = BindJSCallback(&TodoApp::markTaskAsDone);
}

void TodoApp::OnChangeCursor(ultralight::View* caller,
                             Cursor cursor) {
    ///
    /// This is called whenever the page requests to change the cursor.
    ///
    /// We update the main window's cursor here.
    ///
    window_->SetCursor(cursor);
}

void TodoApp::OnChangeTitle(ultralight::View* caller,
                            const String& title) {
    ///
    /// This is called whenever the page requests to change the title.
    ///
    /// We update the main window's title here.
    ///
    window_->SetTitle(title.utf8().data());
}

JSValue TodoApp::fetchAllTasks(const JSObject& thisObject, const JSArgs& jsArgs) {
/*
 * Callback bound to 'fetchTasks()' on the page.
 * Function can take arguments passed in jsArgs parameter, which are then used in SQL query
 * as conditions. If no arguments are passed, all rows are fetched from the database.
*/
    sqlite3 *db;
    char *zErrMsg = nullptr;

    bool rc = sqlite3_open("tasks.db", &db);
    if(rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    // Create vector of arguments and invoke SQL creation function with it
    std::vector<JSString> args;
    for(auto i{ 0u }; i < jsArgs.size(); ++i) {
        args.push_back(jsArgs[i]);
    }
    char* sql = createFetchAllSQL(args);

    // Execute created SQL and store result in tasks object
    std::vector<std::pair<std::string, std::string>> tasks{};
    sqlite3_exec(db, sql, fetchCallback, &tasks, &zErrMsg);

    sqlite3_close(db);

    // Create JS object from given vector and return it back to JS
    return createRowsObject(thisObject, tasks);
}

JSValue TodoApp::fetchClosestTask(const JSObject& thisObject, const JSArgs& jsArgs) {
/*
 * Callback bound to 'fetchClosestTask()' on the page.
 * Function doesn't check for any passed argument. Row, which is the closest task in the future,
 * is returned in a form of the object. If such row doesn't exist, empty object is returned.
*/
    sqlite3 *db;
    char *zErrMsg = nullptr;

    bool rc = sqlite3_open("tasks.db", &db);
    if(rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    // Obtain SQL query
    char* sql = createFetchClosestSQL();

    // Execute created SQL and store result in task object
    std::vector<std::pair<std::string, std::string>> task{};
    sqlite3_exec(db, sql, fetchCallback, &task, &zErrMsg);

    sqlite3_close(db);

    // Create JS object from given vector and return it back to JS
    return createSingleRowObject(thisObject, task);
}

void TodoApp::insertTask(const JSObject& thisObject, const JSArgs& jsArgs) {
/*
 * Callback bound to 'insertTask()' on the page
 * Function takes arguments passed in jsArgs parameter, which are then used in SQL query
 * as values in INSERT statement. If arguments don't meet imposed criteria, database will
 * reject INSERT (e.g. passing empty string as a description).
*/
    sqlite3* db;
    char* zErrMsg = nullptr;

    bool rc = sqlite3_open("tasks.db", &db);
    if(rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    // Create vector of argument and invoke SQL creation function with it
    std::vector<JSString> args;
    for(auto i{ 0u }; i < jsArgs.size(); ++i) {
        args.push_back(jsArgs[i]);
    }
    char* sql = createInsertSQL(args);

    // Execute created SQL
    rc = sqlite3_exec(db, sql, nullptr, nullptr, &zErrMsg);

    if(rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }

    sqlite3_close(db);
}

void TodoApp::markTaskAsDone(const JSObject& thisObject, const JSArgs& jsArgs) {
/*
 * Callback bound to 'markTaskAsDone()' on the page
 * Function takes one argument in jsArgs parameter, which is the ID of a task that
 * is being marked as done.
*/
    if(jsArgs.empty()) {
        fprintf(stderr, "No arguments passed");
        return;
    }

    sqlite3* db;
    char* zErrMsg = nullptr;

    bool rc = sqlite3_open("tasks.db", &db);
    if(rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    // Take ID argument and invoke SQL creation function with it
    char* sql = createMarkAsDoneSQL(jsArgs[0]);

    // Execute created SQL
    rc = sqlite3_exec(db, sql, nullptr, nullptr, &zErrMsg);

    if(rc != SQLITE_OK) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
    }

    sqlite3_close(db);
}
