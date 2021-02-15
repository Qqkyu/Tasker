#pragma once
#include <AppCore/AppCore.h>
#include <vector>

using namespace ultralight;

char* createSQL(const std::vector<JSString>& args);
int callback(void* tasks, int argc, char **argv, char **azColName);
