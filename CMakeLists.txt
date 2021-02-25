project(todo)
cmake_minimum_required(VERSION 3.10)

include(cmake/App.cmake)

set(SOURCES "src/todo.hpp"
            "src/todo.cpp"
            "src/main.cpp"
            "src/database/fetch/db_fetch.hpp"
            "src/database/fetch/db_fetch.cpp"
            "src/database/insert/db_insert.hpp"
            "src/database/insert/db_insert.cpp"
            "src/database/modify/db_modify.hpp"
            "src/database/modify/db_modify.cpp"
            "src/database/remove/db_remove.hpp"
            "src/database/remove/db_remove.cpp")

add_app("${SOURCES}")

find_package (SQLite3)
include_directories(${SQLITE3_INCLUDE_DIRS})
target_link_libraries (todo ${SQLITE3_LIBRARIES})