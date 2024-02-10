 **# Email Validation API**

**Description:**

This API provides a quick and reliable way to validate email addresses, ensuring their format and deliverability. Use it to verify user input, clean up email lists, and prevent invalid emails from entering your database.

**Installation:**

1. **Install Node.js and npm:**
   - Download and install Node.js from the official website: [https://nodejs.org/](https://nodejs.org/)
   - This will also install npm, the Node Package Manager.

2. **Install dependencies:**
   - Open a terminal in the project directory and run the following command:

     ```
     npm i
     ```

3. **Run the server:**
   - Start the development server using:

     ```
     npm run dev
     ```


**Endpoints:**

1. **Signup:**
    - **Method:** POST
    - **URL:** `http://localhost:5000/signup`
    - **Body:**
        - `name`: User's name (string)
        - `email`: User's email address (string)
        - `password`: User's password (string)
        - `mobile`: User's mobile number (string)
    - **Response:**
        - Success: `{ "message": "User registered successfully", "Email was send to your mail" }`
        - Error: `{ "message": "Registration failed", "reason": "error_details" }`

2. **Login:**
    - **Method:** POST
    - **URL:** `http://localhost:5000/login`
    - **Body:**
        - `email`: User's email address (string)
        - `password`: User's password (string)
    - **Response:**
        - Success: `{  "token": "your_token" }`
        - Error: `{ "message": "Invalid credentials", "reason": "error_details" }`

3. **User Details:**
    - **Methods:** GET, PUT, DELETE
    - **URL:** `http://localhost:5000/userdetail`
    - **Headers:**
        - `Authorization`: Bearer JWT token obtained from login
    - **Request Body (PUT):** (Optional)
        - Any user details to update (e.g., `name`, `mobile`)
    - **Response:**
        - GET: User details in JSON format
        - PUT/DELETE: Success/Error message

4. **Get All Users (Admin):**
    - **Method:** GET
    - **URL:** `http://localhost:5000/`
    - **Response:**
        - List of all user details in JSON format

**Authentication:**

- Login endpoint generates a JWT token for authorized access to user endpoints.
- Include the token in the `Authorization` header with the `Bearer` prefix (`Authorization: Bearer your_token`).
- Admin access requires a specific token with appropriate permissions.

**Additional Notes:**

- Implement robust password hashing and storage mechanisms.
- Validate and sanitize user input to prevent security vulnerabilities.


**Features:**

- Validates email format and syntax.
- Checks for common typos and misspellings.
- Verifies domain existence and deliverability.
- Provides clear and concise API responses.
