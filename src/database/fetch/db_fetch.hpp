#pragma once
#include <AppCore/AppCore.h>
#include <vector>

char* createFetchSQL(const std::vector<ultralight::JSString>& args);
int fetchCallback(void* tasks, int argc, char **argv, char **azColName);
JSObjectRef createRowsObject(const ultralight::JSObject& thisObject, const std::vector<std::pair<std::string, std::string>>& tasks);
