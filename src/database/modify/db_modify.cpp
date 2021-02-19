#include "db_modify.hpp"
#include <string>

using namespace ultralight;

char* createMarkAsDoneSQL(const JSString& ID) {
    auto length = JSStringGetLength(ID);
    auto buffer = new char[length];
    JSStringGetUTF8CString(ID, buffer, length);

    std::string SQL = "UPDATE tasks\n"
                      "SET isDone = 1\n"
                      "WHERE tasks.id = " + std::string(buffer);

    char* csql = new char[SQL.length() + 1];
    strcpy(csql, SQL.c_str());
    return csql;
}

char* createMarkAsUndoneSQL(const JSString& ID) {
    auto length = JSStringGetLength(ID);
    auto buffer = new char[length];
    JSStringGetUTF8CString(ID, buffer, length);

    std::string SQL = "UPDATE tasks\n"
                      "SET isDone = 0\n"
                      "WHERE tasks.id = " + std::string(buffer);

    char* csql = new char[SQL.length() + 1];
    strcpy(csql, SQL.c_str());
    return csql;
}
