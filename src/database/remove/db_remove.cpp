#include "db_remove.hpp"
#include <string>

using namespace ultralight;

char* createRemoveSQL(const JSString& ID) {
    auto length = JSStringGetLength(ID);
    auto buffer = new char[length];
    JSStringGetUTF8CString(ID, buffer, length);

    std::string SQL = "DELETE FROM tasks WHERE tasks.id = " + std::string(buffer);

    char* csql = new char[SQL.length() + 1];
    strcpy(csql, SQL.c_str());
    return csql;
}