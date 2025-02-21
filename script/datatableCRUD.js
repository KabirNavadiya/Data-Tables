
let fetchedData = JSON.parse(localStorage.getItem('Data'));
if (fetchedData) {
    ShowTable(fetchedData);
} else {
    $.ajax({
        url: "data/data.json",
        dataType: "json",
        success: function (data) {
            localStorage.setItem("Data", JSON.stringify(data));
            ShowTable(data);
        }
    });
}

function ShowTable(data) {
    $(document).ready(function () {
        const table = $("#myTable").DataTable({
            data: data.data,
            columns: [
                { data: "id" },
                { data: "name" },
                { data: "position" },
                { data: "department", orderSequence: ['asc', 'desc'] },
                { data: "salary" },
                { data: "experience" },
                { data: "location" },
                { data: "education" },
                { data: "employment_type" },
                { data: "rating" },
                {
                    data: "id",
                    render: function (data) {
                        return `<button class='edit' data-id='${data}'><i class="bi bi-pencil" data-id='${data}'></i></button>
                        <button class='delete' data-id='${data}'><i class="bi bi-trash3" data-id='${data}'></i></button>`;
                    }
                }
            ]
        })

        //edit / update
        $("#myTable tbody").on('click', '.edit', function (e) {
            let i;
            for (let index = 0; index < fetchedData.data.length; index++) {
                const element = fetchedData.data[index];
                if (element.id == e.target.dataset.id) {
                    i = index;
                    break;
                }
            }
            let row = table.row($(this).closest('tr'));
            $("#myModal").show();
            document.getElementById('name').value = data.data[i].name;
            document.getElementById('position').value = data.data[i].position;
            document.getElementById('department').value = data.data[i].department;
            document.getElementById('salary').value = data.data[i].salary;
            document.getElementById('experience').value = data.data[i].experience;
            document.getElementById('location').value = data.data[i].location;
            document.getElementById('education').value = data.data[i].education;
            document.getElementById('employment_type').value = data.data[i].employment_type;
            document.getElementById('rating').value = data.data[i].rating;
            document.getElementById('submitBtn').innerText = "Save Changes";

            $("#Form").off('submit.edit').on('submit.edit', function (e) {
                let newName = document.getElementById('name').value;
                let newPos = document.getElementById('position').value;
                let newDep = document.getElementById('department').value;
                let newSalary = document.getElementById('salary').value;
                let newExp = document.getElementById('experience').value;
                let newLoc = document.getElementById('location').value;
                let newEd = document.getElementById('education').value;
                let newEmp = document.getElementById('employment_type').value;
                let newRat = document.getElementById('rating').value;

                data.data[i].name = newName;
                data.data[i].position = newPos;
                data.data[i].department = newDep;
                data.data[i].salary = newSalary;
                data.data[i].experience = newExp;
                data.data[i].location = newLoc;
                data.data[i].education = newEd;
                data.data[i].employment_type = newEmp;
                data.data[i].rating = newRat;

                localStorage.setItem("Data", JSON.stringify(data));
                row.remove().draw()
                $("#myModal").hide();
            })

        });
        //delete
        $('.delete').click(function (e) {
            for (let index = 0; index < fetchedData.data.length; index++) {
                const element = fetchedData.data[index];
                if (element.id == e.target.dataset.id) {
                    fetchedData.data.splice(index, 1);
                }
            }
            localStorage.setItem('Data', JSON.stringify(fetchedData));
            $("#myTable").DataTable().destroy();
            ShowTable(data);

        });

        $(".close").on("click", function () {
            $("#myModal").hide();
        });
        $(window).on("click", function (e) {
            if ($(e.target).is("#myModal")) {
                $("#myModal").hide();
            }
        });

    });




}
$("#addRow").on('click', function () {
    console.log("add clicked");
    $("#myModal").show();
    document.getElementById('name').value = "";
    document.getElementById('position').value = "";
    document.getElementById('department').value = "";
    document.getElementById('salary').value = "";
    document.getElementById('experience').value = "";
    document.getElementById('location').value = "";
    document.getElementById('education').value = "";
    document.getElementById('employment_type').value = "";
    document.getElementById('rating').value = "";
    document.getElementById('submitBtn').innerText = "Add";

    $("#Form").off("submit.add").on('submit.add', function (e) {
        let AddData = {
            id: fetchedData.data.length + 1,
            name: document.getElementById('name').value,
            position: document.getElementById('position').value,
            department: document.getElementById('department').value,
            salary: document.getElementById('salary').value,
            experience: document.getElementById('experience').value,
            location: document.getElementById('location').value,
            education: document.getElementById('education').value,
            employment_type: document.getElementById('employment_type').value,
            rating: document.getElementById('rating').value
        };

        fetchedData.data.push(AddData);
        localStorage.setItem("Data", JSON.stringify(fetchedData));

        $("#myTable").DataTable().destroy();
        ShowTable(fetchedData);

        $("#myModal").hide();
    });

})