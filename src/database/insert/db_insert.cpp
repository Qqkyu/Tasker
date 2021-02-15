#include "db_insert.hpp"

using namespace ultralight;

char* createInsertSQL(const std::vector<JSString>& args) {
/*
 * Arguments in "args" are passed in the following convention (<index>: <column name>):
 * 0: description, 1: startDay, 2: startMonth, 3: startYear, 4: endDay, 5: endMonth, 6: endYear, 7: timeHour, 8: timeMinute
*/
    std::string SQL = "INSERT INTO tasks(description, startDay, startMonth, startYear, endDay, endMonth, endYear, timeHour, timeMinute)" \
                      "VALUES";

    // description
    auto length = JSStringGetLength(args[0]);
    auto buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[0], buffer, length);
        SQL += ("('" + std::string(buffer) + "',");
    }
    else {
        SQL += "(null,";
    }

    // startDay
    length = JSStringGetLength(args[1]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[1], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // startMonth
    length = JSStringGetLength(args[2]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[2], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // startYear
    length = JSStringGetLength(args[3]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[3], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // endDay
    length = JSStringGetLength(args[4]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[4], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // endMonth
    length = JSStringGetLength(args[5]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[5], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // endYear
    length = JSStringGetLength(args[6]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[6], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // timeHour
    length = JSStringGetLength(args[7]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[7], buffer, length);
        SQL += (std::string(buffer) + ",");
    }
    else {
        SQL += "null,";
    }

    // timeMinute
    length = JSStringGetLength(args[8]);
    buffer = new char[length];
    if(length) {
        JSStringGetUTF8CString(args[8], buffer, length);
        SQL += (std::string(buffer) + ")");
    }
    else {
        SQL += "null)";
    }

    char* cstr = new char[SQL.length() + 1];
    strcpy(cstr, SQL.c_str());
    return cstr;
}
