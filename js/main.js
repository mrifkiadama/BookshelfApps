init();

function init() {
    allData();
}

window.onload = () => {
    'use strict';
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }
}


function save() {
    const listItem = localStorage.getItem('listItem') || '[]'
    const bookList = JSON.parse(listItem)

    var id

    bookList.length != 0 ? bookList.findLast((item) => id = item.id) : id = 0

    if (document.getElementById('id').value) {
        bookList.forEach(value => {
            if (document.getElementById('id').value == value.id) {
                value.title = document.getElementById('title').value,
                    value.author = document.getElementById('author').value,
                    value.year = document.getElementById('year').value,
                    value.isComplete = document.getElementById('isComplete').value === "true" ? true : false
            }
        })

        document.getElementById('id').value = ''
    } else {
        var item = {
            id: id + 1,
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: document.getElementById('year').value,
            isComplete: document.getElementById('isComplete').value === "true" ? true : false
        }

        //add item data to array bookList
        bookList.push(item)
    }

    // save array into localstorage
    localStorage.setItem('listItem', JSON.stringify(bookList))

    //update table list
    allData()

    //remove form data
    document.getElementById('form').reset()
}

function allData(search = '') {
    var reading = document.getElementById('reading');
    var finishedTable = document.getElementById('table-finished');

    reading.innerHTML = ``;
    finishedTable.querySelector('tbody').innerHTML = '';

    const listItem = localStorage.getItem('listItem') || '[]'
    const bookList = JSON.parse(listItem)

    const readingBooks = bookList.filter(function(item) {
        if (search) {
            var regex = new RegExp(search, 'gi')
            return item.title.match(regex) && !item.isComplete
        }

        return !item.isComplete
    })

    const finishedBooks = bookList.filter(function(item) {
        if (search) {
            var regex = new RegExp(search, 'gi')
            return item.title.match(regex) && item.isComplete
        }

        return item.isComplete
    })

    if (readingBooks.length > 0) {
        readingBooks.forEach(function(value, i) {
            appendItemToTable(reading, value, i)
        })
    } else {
        reading.innerHTML = '<td colspan="6" style="text-align:center">Not found data</td>'
    }

    if (finishedBooks.length > 0) {
        finishedBooks.forEach(function(value, i) {
            appendItemToTable(finishedTable.querySelector('tbody'), value, i)
        })
    } else {
        finishedTable.querySelector('tbody').innerHTML = '<td colspan="6" style="text-align:center">Not found data</td>'
    }


}

function appendItemToTable(tableBodyEl, value, i) {
    var status = '';

    if (!value.isComplete) {
        status += 'Reading';
    } else {
        status += 'Finished';
    }

    tableBodyEl.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${value.title}</td>
            <td>${value.author}</td>
            <td>${value.year}</td>
            <td><small>${status}</small></td>
            <td>
                <button class="btn btn-sm btn-success" onclick="find(${value.id})">
                    <i class="fa fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="removeData(${value.id})">
                <i class="fa fa-trash"></i>
            </button>
            </td>
        </tr>`
}

function find(id) {
    const bookList = JSON.parse(localStorage.getItem('listItem')) || []

    bookList.forEach(function(value) {
        if (value.id == id) {
            document.getElementById('id').value = value.id
            document.getElementById('title').value = value.title
            document.getElementById('author').value = value.author
            document.getElementById('year').value = value.year

            const status = value.isComplete === true ? "true" : "false"
            document.getElementById('isComplete').value = status
        }
    })
}

function removeData(id) {
    let bookList = JSON.parse(localStorage.getItem('listItem')) || []

    bookList = bookList.filter(function(value) {
        return value.id != id
    })

    // save data to localstorage
    localStorage.setItem('listItem', JSON.stringify(bookList))

    // get show data again
    allData();
}

function search() {
    var search = document.getElementById('searcbox').value;

    allData(search)
}