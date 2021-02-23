#pragma once
#include <AppCore/AppCore.h>
#include <vector>

char* createUpdateSQL(const std::vector<ultralight::JSString>&);
char* createMarkAsDoneSQL(const ultralight::JSString&);
char* createMarkAsUndoneSQL(const ultralight::JSString&);
