#include <sqlite3.h>
#include <vector>
#include <string>
#include <iostream>
#include "todo.hpp"
#include "database/database.hpp"

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

// This callback will be bound to 'fetchTasks()' on the page.
JSValue TodoApp::fetchTasks(const JSObject& thisObject, const JSArgs& args) {
    sqlite3 *db;
    char *zErrMsg = nullptr;

    std::vector<JSString> vs;
    for(auto i{ 0u }; i < args.size(); ++i) {
        vs.push_back(args[i]);
    }

    bool rc = sqlite3_open("tasks.db", &db);

    if(rc) {
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    char* sql = createSQL(vs);
    std::vector<std::pair<std::string, std::string>> tasks{};
    sqlite3_exec(db, sql, callback, &tasks, &zErrMsg);

    sqlite3_close(db);
    return createRowsObject(thisObject, tasks);
}

void TodoApp::OnDOMReady(ultralight::View* caller,
                         uint64_t frame_id,
                         bool is_main_frame,
                         const String& url) {
    Ref<JSContext> context = caller->LockJSContext();
    SetJSContext(context.get());
    JSObject global = JSGlobalObject();
    global["fetchTasks"] = BindJSCallbackWithRetval(&TodoApp::fetchTasks);
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
