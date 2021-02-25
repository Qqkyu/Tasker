# Tasker

Application which simplifies managing and organizing daily tasks done in C++, JS, HTML, CSS. In addition SQLite database is used and Ultralight renderer.

## Requirements

- CMake
- SQLite

## Installation

```
git clone https://github.com/Qqkyu/Tasker
cd Tasker
mkdir build
cd build
cmake ..
cmake --build . --config Release
```

## Screenshots and usage

#### Welcome screen

[![main-window.png](https://i.postimg.cc/rpnHhSfs/main-window.png)](https://postimg.cc/PLDKJ8sn)

Section that user sees after launching application, immediately nearest task is fetched from database and displayed in side-card where the button for marking task as done is also displayed.

#### Your day

[![my-day.png](https://i.postimg.cc/NjVJmgF2/my-day.png)](https://postimg.cc/RW7Lzxcv)

List of all tasks that have today's starting date, every task can be easily removed, edited or marked as done.

#### Tasks 

[![tasks.png](https://i.postimg.cc/nLDd169R/tasks.png)](https://postimg.cc/WDs6NYng)

List of all tasks, as in "Your day" section tasks can be easily removed, edited or marked as done.

#### Calendar

[![calendar.png](https://i.postimg.cc/VN8ZLzNq/calendar.png)](https://postimg.cc/qN1x1Vyq)

Calendar which marks days with tasks. Additionally upcoming events in current month are displayed.

#### Adding tasks

[![my-day-add-task.png](https://i.postimg.cc/ZRXMmJth/my-day-add-task.png)](https://postimg.cc/bDHTHcw6)

Tasks can be added in all three sections, in "Your day" and "Tasks" by clicking bottom-right button which will open modal where tasks information can be filled and then saved. In "Calendar" section clicking on top-right button in calendar will have the same result. Starting date will be automatically set to today's date.

#### Modyfing tasks

[![tasks-edit-task.png](https://i.postimg.cc/qMV5ZBxs/tasks-edit-task.png)](https://postimg.cc/bdggZhMr)

Tasks information can be modified in "Your day" and "Tasks" sections. To do that just click "Edit" button on desired task which will open modal with automatically filled-in information about chosen task. Above example shows modal after clicking "Edit" on "Meet with George" task.

#### Removing tasks

[![calendar-remove-section.png](https://i.postimg.cc/G2456HfQ/calendar-remove-section.png)](https://postimg.cc/CBV7qLSB)

Tasks can be easily removed by clicking button "Remove" in "Your day" and "Tasks" section. In addition removing tasks is available in "Calendar" section by clicking top-left button which opens modal with all tasks, then desired task can be removed by clicking the button.

