$(document).ready(function () {
    $("#productsTable").DataTable({
        "processing": true,
        "serverSide": true,
        "ajax": {
            "url": "http://localhost:8000/serverside.php",
            "type": "GET"
        },
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "category" },
            { "data": "price" },
            { "data": "stock" }
        ]
    })
});