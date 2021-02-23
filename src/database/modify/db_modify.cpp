#include "db_modify.hpp"
#include <string>

using namespace ultralight;

char* createUpdateSQL(const std::vector<ultralight::JSString>& args) {
/*
 * Arguments in "args" are passed in the following convention (<index>: <column name>):
 * 0: id, 1: description, 2: startDay, 3: startMonth, 4: startYear, 5: endDay, 6: endMonth, 7: endYear, 8: timeHour, 9: timeMinute, 10: isDone
*/

    std::string SQL = "UPDATE tasks" \
                      "SET ";

    // description
    auto length = JSStringGetLength(args[1]);
    auto buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[1], buffer, length);
        SQL += "description = " + std::string(buffer) + ", ";
    }

    // startDay
    length = JSStringGetLength(args[2]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[2], buffer, length);
        SQL += " startDay = " + std::string(buffer) + ", ";
    }

    // startMonth
    length = JSStringGetLength(args[3]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[3], buffer, length);
        SQL += " startMonth = " + std::string(buffer) + ", ";
    }

    // startYear
    length = JSStringGetLength(args[4]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[4], buffer, length);
        SQL += " startYear = " + std::string(buffer) + ", ";
    }

    // endDay
    length = JSStringGetLength(args[4]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[4], buffer, length);
        SQL += " endDay = " + std::string(buffer) + ", ";
    }

    // endMonth
    length = JSStringGetLength(args[5]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[5], buffer, length);
        SQL += " endMonth = " + std::string(buffer) + ", ";
    }

    // endYear
    length = JSStringGetLength(args[6]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[6], buffer, length);
        SQL += " endYear = " + std::string(buffer) + ", ";
    }

    // timeHour
    length = JSStringGetLength(args[7]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[7], buffer, length);
        SQL += " timeHour = " + std::string(buffer) + ", ";
    }

    // timeMinute
    length = JSStringGetLength(args[8]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[8], buffer, length);
        SQL += " timeMinute = " + std::string(buffer) + ", ";
    }

    // isDone
    length = JSStringGetLength(args[9]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[9], buffer, length);
        SQL += " isDone = " + std::string(buffer) + ", ";
    }

    // Remove unnecessary last comma
    SQL.erase(SQL.length() - 2, 2);

    // id
    length = JSStringGetLength(args[0]);
    buffer = new char[length];
    JSStringGetUTF8CString(args[0], buffer, length);
    SQL += " WHERE id = " + std::string(buffer);

    char* cstr = new char[SQL.length() + 1];
    strcpy(cstr, SQL.c_str());
    return cstr;
}

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
