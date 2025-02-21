<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "Simform@123";
$dbname = "testdb";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed"]));
}

$draw = isset($_GET['draw']) ? intval($_GET['draw']) : 1;
$start = isset($_GET['start']) ? intval($_GET['start']) : 0;
$length = isset($_GET['length']) ? intval($_GET['length']) : 10;
$searchValue = isset($_GET['search']['value']) ? $_GET['search']['value'] : '';

// Get sorting parameters
$orderColumn = isset($_GET['order'][0]['column']) ? intval($_GET['order'][0]['column']) : 0; // Default to the first column
$orderDirection = isset($_GET['order'][0]['dir']) ? $_GET['order'][0]['dir'] : 'asc'; // Default to ascending

// Mapping DataTables columns to actual database columns
$columns = ['id', 'name', 'category', 'price', 'stock']; // Add the actual column names from the database here

// Building SQL for filtering
$sql = "";
if (!empty($searchValue)) {
    $sql = " WHERE name LIKE '%$searchValue%' 
              OR category LIKE '%$searchValue%' 
              OR price LIKE '%$searchValue%' 
              OR stock LIKE '%$searchValue%'";
}

// Build the ORDER BY clause using the sorting parameters
// Modify the ORDER BY clause to sort numerically based on the product name
if ($columns[$orderColumn] == 'name') {
    // Use regular expression to extract the numeric part of the product name
    $orderBy = "ORDER BY CAST(SUBSTRING_INDEX(name, ' ', -1) AS UNSIGNED) $orderDirection";
} else {
    // Default ordering for other columns
    $orderBy = "ORDER BY " . $columns[$orderColumn] . " $orderDirection";
}

// Get total records without filtering
$totalRecordsQuery = "SELECT COUNT(*) as total FROM products";
$totalRecordsResult = $conn->query($totalRecordsQuery);
$totalRecords = $totalRecordsResult->fetch_assoc()['total'];

// Get total records with filtering
$filteredRecordsQuery = "SELECT COUNT(*) as total FROM products $sql";
$filteredRecordsResult = $conn->query($filteredRecordsQuery);
$filteredRecords = $filteredRecordsResult->fetch_assoc()['total'];

// Fetch data with LIMIT and ORDER BY
$dataQuery = "SELECT * FROM products $sql $orderBy LIMIT $start, $length";
$dataResult = $conn->query($dataQuery);

// Prepare JSON Response
$data = [];
while ($row = $dataResult->fetch_assoc()) {
    $data[] = $row;
}

$response = [
    "draw" => $draw,
    "recordsTotal" => $totalRecords,
    "recordsFiltered" => $filteredRecords,
    "data" => $data
];

echo json_encode($response);
$conn->close();
?>
