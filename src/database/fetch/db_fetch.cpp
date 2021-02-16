#include "db_fetch.hpp"

using namespace ultralight;

char* createFetchAllSQL(const std::vector<JSString>& args) {
/*
 * Can be called in two ways:
 *  (1): with an empty vector, which results in selecting all rows
 *  (2): with vector of size 10, where at least one argument has to be non-empty string,
 *       which results in selecting rows which fulfill given conditions (e.g. specific start day)
 * Arguments in "args" are passed in the following convention (<index>: <column name>):
 * 0: description, 1: startDay, 2: startMonth, 3: startYear, 4: endDay, 5: endMonth, 6: endYear, 7: timeHour, 8: timeMinute, 9: isDone
*/
    std::string SQL = "SELECT * FROM tasks";
    if(args.size() == 10) {
        SQL += " WHERE ";

        // description
        auto length = JSStringGetLength(args[0]);
        auto buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[0], buffer, length);
            SQL += (" description = '" + std::string(buffer) + "' AND ");
        }

        // startDay
        length = JSStringGetLength(args[1]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[1], buffer, length);
            SQL += (" startDay = " + std::string(buffer) + " AND ");
        }

        // startMonth
        length = JSStringGetLength(args[2]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[2], buffer, length);
            SQL += (" startMonth = " + std::string(buffer) + " AND ");
        }

        // startYear
        length = JSStringGetLength(args[3]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[3], buffer, length);
            SQL += (" startYear = " + std::string(buffer) + " AND ");
        }

        // endDay
        length = JSStringGetLength(args[4]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[4], buffer, length);
            SQL += (" endDay = " + std::string(buffer) + " AND ");
        }

        // endMonth
        length = JSStringGetLength(args[5]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[5], buffer, length);
            SQL += (" endMonth = " + std::string(buffer) + " AND ");
        }

        // endYear
        length = JSStringGetLength(args[6]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[6], buffer, length);
            SQL += (" endYear = " + std::string(buffer) + " AND ");
        }

        // timeHour
        length = JSStringGetLength(args[7]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[7], buffer, length);
            SQL += (" timeHour = " + std::string(buffer) + " AND ");
        }

        // timeMinute
        length = JSStringGetLength(args[8]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[8], buffer, length);
            SQL += (" timeMinute = " + std::string(buffer) + " AND ");
        }

        // isDone
        length = JSStringGetLength(args[9]);
        buffer = new char[length];
        if(length) {
            JSStringGetUTF8CString(args[9], buffer, length);
            SQL += (" isDone = " + std::string(buffer) + " AND ");
        }

        // Remove unnecessary last "AND"
        SQL.erase(SQL.length() - 4, 4);
    }
    SQL += " ORDER BY tasks.startYear, tasks.startMonth, tasks.startDay, tasks.timeHour IS NULL, tasks.timeMinute IS NULL";
    char* csql = new char[SQL.length() + 1];
    strcpy(csql, SQL.c_str());
    return csql;
}

char* createFetchClosestSQL() {
/*
 * Returns SQL query for selecting a row with the future task which is the closest to current time.
*/
    std::string SQL = "SELECT * FROM tasks\n"
                      "WHERE (((tasks.startDay > strftime('%d', date('now'))) AND (tasks.startMonth >= strftime('%m', date('now'))) AND (tasks.startYear >= strftime('%Y', date('now')))) OR\n"
                      "      ((tasks.startDay == strftime('%d', date('now'))) AND (tasks.startMonth == strftime('%m', date('now'))) AND (tasks.startYear == strftime('%Y', date('now'))) AND \n"
                      "      ((tasks.timeHour IS NULL) OR (tasks.timeHour > strftime('%H', time('now')) OR (tasks.timeHour == strftime('%H', time('now')) AND tasks.timeMinute > time('%M', time('now')))))))\n"
                      "      AND isDone == 0\n"
                      "ORDER BY tasks.startYear, tasks.startMonth, tasks.startDay, tasks.timeHour IS NULL, tasks.timeMinute IS NULL\n"
                      "LIMIT 1";
    char* csql = new char[SQL.length() + 1];
    strcpy(csql, SQL.c_str());
    return csql;
}

int fetchCallback(void* tasks, int argc, char **argv, char **azColName) {
/*
 * Callback used on each row selected from database.
 * Creates pairs for the current row consisting of column name and value stored in it, that
 * are later appended to the passed vector.
*/
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

JSObjectRef createRowsObject(const JSObject& thisObject, const std::vector<std::pair<std::string, std::string>>& tasks) {
/*
 * Given vector of (column name, column value) pairs, function creates objects representing rows with properties set to column names
 * and values set to column values. Then it creates array of those objects and returns it back to JS for further processing.
*/
    // Create array of objects, where every object is a single row
    JSObjectRef selectedTasks = JSObjectMakeArray(thisObject.context(), 0, NULL, NULL);
    const int colAmount = 11;
    for(auto i{ 0u }; i < (tasks.size() / colAmount); ++i) {
        // Object representing single row
        JSObjectRef row = JSObjectMake(thisObject.context(), NULL, NULL);
        for(auto k{ 0 }; k != colAmount; ++k) {
            JSStringRef colName = JSStringCreateWithUTF8CString(tasks[k].first.c_str());
            JSStringRef colVal = JSStringCreateWithUTF8CString(tasks[(i * colAmount) + k].second.c_str());
            JSObjectSetProperty(thisObject.context(), row, colName, JSValueMakeString(thisObject.context(), colVal), NULL, NULL);
        }
        // Append created object to array of objects
        JSObjectSetPropertyAtIndex(thisObject.context(), selectedTasks, i, row, NULL);
    }
    return selectedTasks;
}

JSObjectRef createSingleRowObject(const ultralight::JSObject& thisObject, const std::vector<std::pair<std::string, std::string>>& task) {
/*
 * Given vector of (column name, column value) pairs, function creates object representing a single row with properties set to column names
 * and values set to column values. That object is then returned back to JS for further processing. Returns empty object if such object doesn't exist.
*/
    // Object representing single row
    JSObjectRef row = JSObjectMake(thisObject.context(), NULL, NULL);
    for(auto k{ 0 }; k != task.size(); ++k) {
        JSStringRef colName = JSStringCreateWithUTF8CString(task[k].first.c_str());
        JSStringRef colVal = JSStringCreateWithUTF8CString(task[k].second.c_str());
        JSObjectSetProperty(thisObject.context(), row, colName, JSValueMakeString(thisObject.context(), colVal), NULL, NULL);
    }
    return row;
}