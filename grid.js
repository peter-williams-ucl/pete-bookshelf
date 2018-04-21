var gridster = [];

//Initialize gridster.js grid for each of the tasks.
$(function() {
    gridster[0] = $('#task-1 ul')
        .gridster({
            widget_base_dimensions: [165, 260],
            widget_margins: [27, 38],
            shift_widgets_up: false,
            shift_larger_widgets_down: false,
            max_cols: 6,
            collision: {
                wait_for_mouseup: true
            },
            serialize_params: function($w, wgd) {
                return { id: $w.attr('id'), title: $w.attr('title'), col: wgd.col, row: wgd.row };
            }
        })
        .data('gridster');

    gridster[1] = $('#task-2 ul')
        .gridster({
            widget_base_dimensions: [165, 260],
            widget_margins: [27, 38],
            shift_widgets_up: false,
            shift_larger_widgets_down: false,
            max_cols: 6,
            collision: {
                wait_for_mouseup: true
            },
            serialize_params: function($w, wgd) {
                return { id: $w.attr('id'), title: $w.attr('title'), col: wgd.col, row: wgd.row };
            }
        })
        .data('gridster');

    gridster[2] = $('#task-3 ul')
        .gridster({
            widget_base_dimensions: [165, 260],
            widget_margins: [27, 38],
            shift_widgets_up: false,
            shift_larger_widgets_down: false,
            max_cols: 6,
            collision: {
                wait_for_mouseup: true
            },
            serialize_params: function($w, wgd) {
                return { id: $w.attr('id'), title: $w.attr('title'), col: wgd.col, row: wgd.row };
            }
        })
        .data('gridster');

    gridster[3] = $('#task-4 ul')
        .gridster({
            widget_base_dimensions: [165, 260],
            widget_margins: [27, 38],
            shift_widgets_up: false,
            shift_larger_widgets_down: false,
            max_cols: 6,
            collision: {
                wait_for_mouseup: true
            },
            serialize_params: function($w, wgd) {
                return { id: $w.attr('id'), title: $w.attr('title'), col: wgd.col, row: wgd.row };
            }
        })
        .data('gridster');
});

//Function to show initial modal popups for each task.
function popup(task) {
    switch (task) {
        case 1:
            $('#myModal').modal('show');
            break;
        case 2:
            $('#task2intro').appendTo('body').modal('show');
            break;
        case 3:
            $('#task3intro').appendTo('body').modal('show');
            break;
        case 4:
            $('#task4intro').modal('show');
    }
}

//Function to store books" HTML for first and second set of tasks.
function storebooks(task) {
    switch (task) {
        case 1:
            var dictionary = gridster[0].serialize();
            var fullelement = 'task1book';
            var bookcolumn = 'task1bookcol';
            var booklevel = 'task1bookrow';
            break;

        case 3:
            var dictionary = gridster[2].serialize();
            var fullelement = 'task3book';
            var bookcolumn = 'task3bookcol';
            var booklevel = 'task3bookrow';
            break;
    }
    for (book in dictionary) {
        if (dictionary[book].row == 1) {
            var bookid = dictionary[book].id;
            var bookcol = dictionary[book].col;
            var bookrow = dictionary[book].row;
            break;
        }
    }

    div = document.getElementById(bookid).outerHTML;
    sessionStorage.setItem(fullelement, div);
    sessionStorage.setItem(bookcolumn, bookcol);
    sessionStorage.setItem(booklevel, bookrow);
}

//Function to load books" HTML from session storage in order to populate next task with a book from the previous task.
function loadbooks(task) {
    var list = document.getElementById('listoftasks');
    switch (task) {
        case 2:
            var books = gridster[1].serialize();
            var fulldiv = 'task1book';
            var colcheck = 'task1bookcol';
            var rowcheck = 'task1bookrow';
            var gridnumber = 1;
            break;

        case 4:
            var books = gridster[3].serialize();
            var fulldiv = 'task3book';
            var colcheck = 'task3bookcol';
            var rowcheck = 'task3bookrow';
            var gridnumber = 3;
            break;
    }

    //Check if there is a book in the same column and row as the carried over book - if so, remove the existing book and replace with the carried over book.
    for (var book in books) {
        if (
            books[book].col == sessionStorage.getItem(colcheck) &&
            books[book].row == sessionStorage.getItem(rowcheck)
        ) {
            var deletiontarget = books[book].id;
            break;
        } else {
            deletiontarget = list.children[0].id;
        }
    }
    gridster[gridnumber].remove_widget('#' + deletiontarget, true);
    gridster[gridnumber].add_widget(
        sessionStorage.getItem(fulldiv),
        1,
        1,
        sessionStorage.getItem(colcheck),
        sessionStorage.getItem(rowcheck),
        1,
        1
    );
}

//Function to remove book from shelf when user clicks "X".
function delete_book(span) {
    try {
        gridster[0].remove_widget('#' + $(span).closest('li').attr('id'), true);
    } catch (e) {
        if (e instanceof TypeError) {
            try {
                gridster[1].remove_widget('#' + $(span).closest('li').attr('id'), true);
            } catch (e) {
                if (e instanceof TypeError) {
                    try {
                        gridster[2].remove_widget('#' + $(span).closest('li').attr('id'), true);
                    } catch (e) {
                        if (e instanceof TypeError) {
                            try {
                                gridster[3].remove_widget('#' + $(span).closest('li').attr('id'), true);
                            } catch (e) {
                                if (e instanceof TypeError) {
                                    console.log(e);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//Disable "proceed" button in introductory modal
$('#proceed').prop('disabled', true);

//Firebase Configuration
var config = {
    apiKey: 'AIzaSyCv_7eTxl2YacwTJN9qqfwB-uriQ6sXTVM',
    authDomain: 'preferencesurvey.firebaseapp.com',
    databaseURL: 'https://preferencesurvey.firebaseio.com',
    projectId: 'preferencesurvey',
    storageBucket: '',
    messagingSenderId: '689180908224'
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

//Create a new reference for each user under "users"
var userlist = firebase.database().ref('users').push();

//Function to user store demographic information.
function storedemographics() {
    var inputEmail = document.getElementById('email').value;
    var inputAge = document.getElementById('age').value;

    if (document.getElementById('male').checked) {
        gender = document.getElementById('male').value;
    } else if (document.getElementById('female').checked) {
        gender = document.getElementById('female').value;
    } else {
        gender = document.getElementById('rathernotsay').value;
    }

    localStorage.setItem('email', inputEmail);
    localStorage.setItem('age', inputAge);
    localStorage.setItem('gender', gender);
}

//Store each task"s book ordering in session storage.
function storetask(task) {
    switch (task) {
        case 1:
            localStorage.setItem('task1', JSON.stringify(gridster[0].serialize()));
            break;

        case 2:
            localStorage.setItem('task2', JSON.stringify(gridster[1].serialize()));
            break;

        case 3:
            localStorage.setItem('task3', JSON.stringify(gridster[2].serialize()));
            break;

        case 4:
            localStorage.setItem('task4', JSON.stringify(gridster[3].serialize()));
            break;
    }
}

//Retrieve book orderings from session storage and send to database.
function writeUserData() {
    firebase.database().ref('users/' + userlist.key).set({
        email: localStorage.getItem('email'),
        age: localStorage.getItem('age'),
        gender: localStorage.getItem('gender')
    });

    var serializeddata1 = JSON.parse(localStorage.getItem('task1'));

    for (book in serializeddata1) {
        firebase.database().ref('preferences/' + userlist.key + '/task1/' + serializeddata1[book].id).set({
            title: serializeddata1[book].title,
            column: serializeddata1[book].col,
            row: serializeddata1[book].row
        });
    }

    var serializeddata2 = JSON.parse(localStorage.getItem('task2'));

    for (book in serializeddata2) {
        firebase.database().ref('preferences/' + userlist.key + '/task2/' + serializeddata2[book].id).set({
            title: serializeddata2[book].title,
            column: serializeddata2[book].col,
            row: serializeddata2[book].row
        });
    }

    var serializeddata3 = JSON.parse(localStorage.getItem('task3'));

    for (book in serializeddata3) {
        firebase.database().ref('preferences/' + userlist.key + '/task3/' + serializeddata3[book].id).set({
            title: serializeddata3[book].title,
            column: serializeddata3[book].col,
            row: serializeddata3[book].row
        });
    }

    var serializeddata4 = JSON.parse(localStorage.getItem('task4'));

    for (book in serializeddata4) {
        firebase.database().ref('preferences/' + userlist.key + '/task4/' + serializeddata4[book].id).set({
            title: serializeddata4[book].title,
            column: serializeddata4[book].col,
            row: serializeddata4[book].row
        });
    }
}
