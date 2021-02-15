#include "database.hpp"

int callback(void* tasks, int argc, char **argv, char **azColName) {
    auto tasksObj = reinterpret_cast<std::vector<std::pair<std::string, std::string>>*>(tasks);
    for(int i = 0; i < argc; i++) {
        if(argv[i]) {
            tasksObj->push_back(std::make_pair(azColName[i], std::string(argv[i])));
        }
        else {
            tasksObj->push_back(std::make_pair(azColName[i], ""));
        }
    }
    return 0;
}

char* createSQL(const std::vector<JSString>& args) {
    // Either all (8) arguments are passed or none.
    // args are passed in following convention:
    // 0: startDay, 1: startMonth, 2: startYear, 3: endDay, 4: endMonth, 5: endYear, 6: timeHour, 7: timeMinute
    std::string SQL = "SELECT * FROM tasks";
    if(args.size() == 8) {
        SQL += " WHERE ";

        // startDay
        auto length = JSStringGetLength(args[0]);
        auto buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[0], buffer, length);
            SQL += (" startDay = " + std::string(buffer) + " AND ");
        }

        // startMonth
        length = JSStringGetLength(args[1]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[1], buffer, length);
            SQL += (" startMonth = " + std::string(buffer) + " AND ");
        }

        // startYear
        length = JSStringGetLength(args[2]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[2], buffer, length);
            SQL += (" startYear = " + std::string(buffer) + " AND ");
        }

        // endDay
        length = JSStringGetLength(args[3]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[3], buffer, length);
            SQL += (" endDay = " + std::string(buffer) + " AND ");
        }

        // endMonth
        length = JSStringGetLength(args[4]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[4], buffer, length);
            SQL += (" endMonth = " + std::string(buffer) + " AND ");
        }

        // endYear
        length = JSStringGetLength(args[5]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[5], buffer, length);
            SQL += (" endYear = " + std::string(buffer) + " AND ");
        }

        // timeHour
        length = JSStringGetLength(args[6]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[6], buffer, length);
            SQL += (" timeHour = " + std::string(buffer) + " AND ");
        }

        // timeMinute
        length = JSStringGetLength(args[7]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[7], buffer, length);
            SQL += (" timeMinute = " + std::string(buffer) + " AND ");
        }

        // Remove unnecessary last "AND"
        SQL.erase(SQL.length() - 4, 4);
    }
    char* cstr = new char[SQL.length() + 1];
    strcpy(cstr, SQL.c_str());
    return cstr;
}