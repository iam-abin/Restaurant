# Restaurant


It is a Restaurant application where users can order food from different restaurants.

### prerequsties
- Vscode
- Nodejs v20.16.0+
- Mongodb 
- Stripe CLI // Necessary only for development environment

## Installation

1. Clone the repository:

```
git clone https://github.com/iam-abin/Restaurant.git
```

2. Navigate to the project directory:

```
cd Restaurant
```

3. Install the dependencies:

- Install all dependencies from root directory

```
npm run install-all
```

***or***
- Install dependencies seperately

To install some dev dependencies, from root directory, run

```
npm install
```

```
cd backend
```
```
npm install 
```
- open another tab in vscode terminal and run
```
cd frontend
```
```
npm install 
```

4. Setup stripe

- Install stripe cli in local system (refer stripe website's webhook section)
- Login to stripe cli in local system 

5. Set up the required environment variables.
- Rename the `.env.example` file in frontend to `.env`
- Rename the `.env.example` file in backend to `.env.development`, `.env.production`
- Provide the necessary values for environment in frontend and backend.

6. Start server (Running the app):

- We can run all the start command from root directory using
```
npm run dev
```
***or***
- In both frontend and backend terminal tabs, run

```
npm run dev
```
- Run stript webhook (for payment confirmation) in backend terminal 

```
npm run stripe
```

7. Access the application from browser using:

***For user***
```
http://localhost:5000
```
***For restaurant***
```
http://localhost:5000/auth/restaurant
```

***For admin***
```
http://localhost:5000/auth/admin
```

# Images
![Screenshot from 2025-01-21 08-18-25](https://github.com/user-attachments/assets/461c8020-cb3d-4fef-9651-78aafa1bc299)

![Screenshot from 2025-01-21 11-51-33](https://github.com/user-attachments/assets/9606b925-8553-4fbd-8eb0-b38532e3b887)

![Screenshot from 2025-01-21 11-52-20](https://github.com/user-attachments/assets/aaa9dce8-685a-41f7-9685-3dfa9cdb4274)

![Screenshot from 2025-01-29 17-25-51](https://github.com/user-attachments/assets/060c2e60-e448-46ba-85bd-9dea033a007a)

![Screenshot from 2025-01-21 11-55-31](https://github.com/user-attachments/assets/9f7ae398-1653-4c55-af71-b90ec8ab17e7)


### Docker compose
1. install docker 
2. docker componse
3. makefile
- For docker compose commands check [Makefile](Makefile)
  
  ***or***
  
- Run the following command in the root directory of project
```
make
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
