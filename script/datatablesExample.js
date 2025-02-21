let toolbar = document.createElement('div');
toolbar.innerHTML = '<button id="addrow">Add Row</button><p>(not work in dynamic datatables)</p>';

$(document).ready(function () {
    let Highlighted = false;
    const table = $("#myTable").DataTable({

        ajax: "data/data.json",
        columns: [
            { data: "id" },
            {
                data: null,
                render: function (data, type, row) {
                    return row.name + " " + "\"" + row.position + "\"";
                },
                "title": "Name & Position",
            },
            { data: "department", orderSequence: ['asc', 'desc'] },
            { data: "salary" },
            { data: "experience" },
            { data: "location" },
            { data: "education" },
            { data: "employment_type" },
            { data: "rating" },
            {
                data: null,
                defaultContent: `<button id='summary'>Summary</button>`,
            }
        ],
        "layout": {
            topStart: {
                search: {
                    placeholder: "type Here"
                },

            },
            topEnd: 'info',
            bottom: {
                "paging": {
                    buttons: 4
                }
            },
            bottomEnd: null,
            bottomStart: null,

        },
        drawCallback: function () {
            if (Highlighted) {
                highlightSalaries();
            }
        },
        // footerCallback: function () {
        //     let api = this.api();
        //     let intVal = function (i) {
        //         let ans = 0;
        //         if (typeof i === 'string') {
        //             ans = i.replace(/[\$,]/g, '') * 1;
        //         }
        //         else if (typeof i === 'number') {
        //             ans = i;
        //         }

        //         return ans;
        //     };
        //    let total = api.column(3).data().reduce((a, b) => intVal(a) + intVal(b), 0);
        //    let pageTotal = api.column(3, { page: 'current' }).data().reduce((a, b) => intVal(a) + intVal(b), 0);
        //     api.column(3).footer().innerHTML =
        //         '$' + pageTotal + ' ( $' + total + ' total)';
        // },
        responsive: true,
        "stateSave": true,
    });

    function highlightSalaries() {
        table.rows().every(function () {
            if (this.data().salary.replace(/[\$,]/g, '') > 120000) {
                $(this.node()).find('td:nth-child(4)').addClass('highlight');
                
                // $(this.node()).addClass('highlight'); //highlight row
                
            }
        })
    }

    $("#summary").on('click', function () {
        console.log("summary clicked");

    })
    $("#add-action").on('click', function () {
        if (!Highlighted) {
            Highlighted = true
            table.draw()
        }
    })

    table.on('mouseup', 'tbody td', function (e) {

        if (e.target.tagName.toLowerCase() === 'button') {
            let cell = table.cell(e.target.parentNode)
            if (cell) {
                let i = cell.index().row;
                let data = table.rows(i).data()[0]
                alert(data.name + ' ' + data.position + ' ' + data.salary + ' ' + data.location);
            }
            return;

        }
        let val = window.getSelection().toString().trim();
        navigator.clipboard.writeText(val).then(() => {
            alert("copied!")

        }).catch((err) => {
            console.log(err);

        })
    })
});

$(document).ready(function () {
    let counter = 1;
    let table2 = $("#example").DataTable({

        ajax: 'data/data2.json',
        columns: [
            {
                className: 'dt-control',
                orderable: false,
                data: null,
                defaultContent: ''
            },
            { data: 'name' },
            { data: 'position' },
            { data: 'office' },
            { data: 'salary' }
        ],
        order: [[1, 'asc']],
        // paging: false,
        // scrollY: '200px',
        "layout": {
            top2: toolbar,
        }
    })

    DataTable.Api.register('column().data().sum()', function () {
        return this.reduce(function (a, b) {
            let x = (typeof a === 'string') ? a.replace(/[\$,]/g, '') : a;
            let y = (typeof b === 'string') ? b.replace(/[\$,]/g, '') : b;
            x = parseFloat(x) || 0;
            y = parseFloat(y) || 0;
            return x + y;
        }, 0);
    })

    function addOutput(text) {
        let newEl = document.createElement('div');
        newEl.textContent = text;

        document.querySelector('#demo-output').prepend(newEl);
    }

    $('#sum-all').on('click', function () {
        addOutput('Column sum is : $' + table2.column(4).data().sum());
    })
    $('#sum-visible').on('click', function () {
        addOutput('current page sum is : $' + table2.column(4,{ page: 'current' }).data().sum());
    })

    document.querySelectorAll('a.toggle-vis').forEach((el) => {
        el.addEventListener('click', function (e) {
            e.preventDefault();

            let columnIdx = e.target.getAttribute('data-column');
            let column = table2.column(columnIdx);
            // Toggle the visibility
            column.visible(!column.visible());
        });
    });
    function format(d) {
        return (
            '<dl>' +
            '<dt>Full name:</dt>' +
            '<dd>' +
            d.name +
            '</dd>' +
            '<dt>Extension number:</dt>' +
            '<dd>' +
            d.extn +
            '</dd>' +
            '<dt>Extra info:</dt>' +
            '<dd>And any further details here (images etc)...</dd>' +
            '</dl>'
        );
    }
    // function addNewRow() {
    //     table2.row
    //         .add([
    //             counter + '.1',
    //             counter + '.2',
    //             counter + '.3',
    //             counter + '.4',
    //             counter + '.5',
    //             counter + '.6',
    //             counter + '.7',
    //             counter + '.8',
    //             counter + '.9',
    //             counter + '.10'
    //         ])
    //         .draw(false);

    //     counter++;
    // }
    // $("#addrow").on('click', function () {
    //     console.log(counter);

    //     console.log("add row clicked");
    //     addNewRow();

    // });
    table2.on('click', 'td.dt-control', function (e) {
        let tr = e.target.closest('tr');
        let row = table2.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
        }
        else {
            row.child(format(row.data())).show();
        }


    })
    // table2.on('click','tbody tr',function(e){
    //     e.currentTarget.classList.toggle('selected')

    // })
    table2.on('click', 'tbody tr', (e) => {
        let classList = e.currentTarget.classList;

        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            table2.rows('.selected').nodes().each((row) => row.classList.remove('selected'));
            classList.add('selected');
        }
    });
    document.querySelector('#button').addEventListener('click', function () {
        table2.row('.selected').remove().draw(false);
    });

});