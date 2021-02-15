#include <sqlite3.h>
#include <vector>
#include <string>
#include <iostream>
#include "todo.hpp"

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

int callback(void* tasks, int argc, char **argv, char **azColName) {
    auto tasksObj = reinterpret_cast<std::vector<std::pair<std::string, std::string>>*>(tasks);
    int i;
    for(i = 0; i<argc; i++) {
        //task[azColName[i]] = (argv[i] ? argv[i] : "NULL");
        if(argv[i]) {
            tasksObj->push_back(std::make_pair(azColName[i], std::string(argv[i])));
        }
        else {
            tasksObj->push_back(std::make_pair(azColName[i], ""));
        }
    }
    return 0;
}

// This callback will be bound to 'OnButtonClick()' on the page.
JSValue TodoApp::fetchTasks(const JSObject& thisObject, const JSArgs& args) {
    sqlite3 *db;
    char *zErrMsg = nullptr;

    bool rc = sqlite3_open("tasks.db", &db);

    if(rc) {
        //Todo:
        //Error handling
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    }

    char* sql = "SELECT * FROM tasks";
    std::vector<std::pair<std::string, std::string>> tasks{};
    sqlite3_exec(db, sql, callback, &tasks, &zErrMsg);

    // Create array of objects, where every object is single row
    JSObjectRef selectedTasks = JSObjectMakeArray(thisObject.context(), 0, NULL, NULL);
    const int colAmount = 10;
    for(auto i{ 0u }; i < (tasks.size() / colAmount); ++i) {
        // Take all strings from 10 columns
        JSObjectRef row = JSObjectMake(thisObject.context(), NULL, NULL);
        for(auto k{ 0 }; k != colAmount; ++k) {
            JSStringRef key = JSStringCreateWithUTF8CString(tasks[k].first.c_str());
            JSStringRef val = JSStringCreateWithUTF8CString(tasks[(i * colAmount) + k].second.c_str());
            JSObjectSetProperty(thisObject.context(), row, key, JSValueMakeString(thisObject.context(), val), NULL, NULL);
        }
        JSObjectSetPropertyAtIndex(thisObject.context(), selectedTasks, i, row, NULL);
    }
    sqlite3_close(db);
    return selectedTasks;
}

void TodoApp::OnDOMReady(ultralight::View* caller,
                         uint64_t frame_id,
                         bool is_main_frame,
                         const String& url) {
    ///
    /// Set our View's JSContext as the one to use in subsequent JSHelper calls
    ///
    Ref<JSContext> context = caller->LockJSContext();
    SetJSContext(context.get());

    ///
    /// Get the global object (this would be the "window" object in JS)
    ///
    JSObject global = JSGlobalObject();

    ///
    /// Bind MyApp::GetMessage to the JavaScript function named "fetchTasks".
    ///
    /// You can get/set properties of JSObjects by using the [] operator with
    /// the following types as potential property values:
    ///  - JSValue
    ///      Represents a JavaScript value, eg String, Object, Function, etc.
    ///  - JSCallback
    ///      Typedef of std::function<void(const JSObject&, const JSArgs&)>)
    ///  - JSCallbackWithRetval
    ///      Typedef of std::function<JSValue(const JSObject&, const JSArgs&)>)
    ///
    /// We use the BindJSCallbackWithRetval macro to bind our C++ class member
    /// function to our JavaScript callback.
    ///
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
