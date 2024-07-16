document.getElementById('data-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get the form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Create a new row and cells
    const table = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    // Insert new cells into the row
    const nameCell = newRow.insertCell(0);
    const emailCell = newRow.insertCell(1);
    const phoneCell = newRow.insertCell(2);

    // Add the form data to the cells
    nameCell.textContent = name;
    emailCell.textContent = email;
    phoneCell.textContent = phone;

    // Clear the form fields
    document.getElementById('data-form').reset();
});


