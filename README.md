# **Heritage Kitchen - A Digital Recipe Book**

## **Project Setup and Installation**

To get started with the project, follow the steps below to initialize, install dependencies, and start the development server.

### **1. Initialize the Project**

Run the following command to initialize a new `npm` project:

```bash
npm init -y
```

This will create a `package.json` file with default configurations.

### **2. Install React and React-DOM**

Next, install **React 18** and **React-DOM** (for UI rendering):

```bash
npm install react@18.2.0 react-dom@18.2.0
```

### **3. Install React-Scripts**

Install **react-scripts** (used for running scripts like `npm start`, `npm build`, etc.):

```bash
npm install react-scripts@5.0.1
```

### **4. Install Material-UI**

Material-UI provides a rich set of React components that follow Google’s Material Design guidelines. Install the necessary packages:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### **5. Install React Router**

Install **React Router** for navigation between pages in your app:

```bash
npm install react-router-dom
```

### **6. Install Firebase**

Install **Firebase** for handling authentication, storage, and database functionalities:

```bash
npm install firebase
```

---

## **Start Development Server**

To start the development server and run the app locally, use the following command:

```bash
npm start
```

This will open the app in your browser at `http://localhost:3000`.

---

## **Install Node Modules (if not present)**

If you clone this repository or start a new instance of the project, **you'll need to install the dependencies**. To do this, run the following command:

```bash
npm install
```

This will automatically install all the dependencies listed in the `package.json` file, including **React**, **Material-UI**, **Firebase**, etc., inside the `node_modules` directory.

> **Note**: The `node_modules/` directory is **not tracked by Git** and is listed in `.gitignore` to avoid unnecessary uploads to the repository.

---

## **Optional: Additional Setup**

- If you need to store environment variables (such as Firebase configuration keys), create a `.env` file in the root directory of your project.
- Ensure that sensitive files like `.env` are added to `.gitignore` to keep them secure.
