let currentPage = 1;
const usersPerPage = 5;
document.getElementById('userForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Collect form data
    const userId = document.getElementById('userId').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const phone = document.getElementById('phone').value;
   

    const userData = { 
        name, 
        email, 
        age, 
        phone, 
        createdAt: new Date().toISOString(), 
        isActive: true 
      };

      try {
        debugger;
        if (userId) {
          // If userId exists, update the user
          const response = await fetch(`https://63debe54f1af41051b181ca8.mockapi.io/users/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error('Failed to update data');
          }
        } else {
          // If no userId, create a new user
          const response = await fetch('https://63debe54f1af41051b181ca8.mockapi.io/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          if (!response.ok) {
            throw new Error('Failed to post data');
          }
        }

        // Refresh and repopulate the table
        populateTable();
      } catch (error) {
        console.error('Error:', error);
      }

    // Reset the form
    event.target.reset();
    document.getElementById('userId').value = '';
  });

  async function populateTable(page = 1) {
    try {
      const response = await fetch('https://63debe54f1af41051b181ca8.mockapi.io/users');

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }  
      const users = await response.json();
      const tableBody = document.querySelector('#userTable tbody');

      // Clear the existing table rows
      tableBody.innerHTML = '';

      // Calculate pagination details
      const startIndex = (page - 1) * usersPerPage;
      const endIndex = startIndex + usersPerPage;
      const paginatedUsers = users.slice(startIndex, endIndex);

      // Populate the table with the paginated users
      paginatedUsers.forEach(user => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.age}</td>
          <td>${user.phone}</td>
           <td>${user.createdAt}</td>
          <td>
            <button onclick="editUser('${user.id}')">Edit</button>
            <button onclick="deleteUser('${user.id}')">Delete</button>
          </td>
        `;
        tableBody.appendChild(newRow);
      });

      // Display pagination controls
      displayPagination(users.length);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function editUser(userId) {
    try {
      const response = await fetch(`https://63debe54f1af41051b181ca8.mockapi.io/users/${userId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const user = await response.json();
       debugger;
      // Populate the form with user data
      document.getElementById('name').value = user.name;
      document.getElementById('email').value = user.email;
      document.getElementById('age').value = user.age;
      document.getElementById('phone').value = user.phone;
      document.getElementById('userId').value = user.id;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function deleteUser(userId) {
    try {
      const response = await fetch(`https://63debe54f1af41051b181ca8.mockapi.io/users/${userId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Refresh the table
      populateTable();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  function displayPagination(totalUsers) {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    // Create Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
      currentPage--;
      populateTable(currentPage);
    });
    paginationContainer.appendChild(prevButton);

    // Create page number buttons
    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.disabled = i === currentPage;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        populateTable(currentPage);
      });
      paginationContainer.appendChild(pageButton);
    }

    // Create Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
      currentPage++;
      populateTable(currentPage);
    });
    paginationContainer.appendChild(nextButton);
  }

  // Initial population of the table
  populateTable();