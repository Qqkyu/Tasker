#pragma once
#include <AppCore/AppCore.h>
#include <vector>

char* createFetchAllSQL(const std::vector<ultralight::JSString>& args);
char* createFetchClosestSQL();

int fetchCallback(void* tasks, int argc, char **argv, char **azColName);

JSObjectRef createRowsObject(const ultralight::JSObject& thisObject, const std::vector<std::pair<std::string, std::string>>& tasks);
JSObjectRef createSingleRowObject(const ultralight::JSObject& thisObject, const std::vector<std::pair<std::string, std::string>>& task);
