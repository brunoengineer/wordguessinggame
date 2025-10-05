# Word Guessing Game

This is a real-time multiplayer word guessing game built with React (Vite) for the frontend and Node.js/Express/Socket.IO for the backend.

## Features
- Create or join game rooms
- Real-time gameplay and chat
- Master rotation and scoring
- Mobile-friendly UI

## Getting Started

### Local Development
1. **Install dependencies:**
	```
	npm install
	```
2. **Start the backend server:**
	```
	npm run server
	```
3. **Start the frontend:**
	```
	npm run dev
	```
4. Open your browser at `http://localhost:5173` (or the port shown in terminal).

### Deploy Frontend to GitHub Pages
1. Build the frontend:
	```
	npm run build
	```
2. Deploy the `dist` folder to GitHub Pages (e.g. using `gh-pages`):
	```
	npm install --save-dev gh-pages
	npx gh-pages -d dist
	```
3. Enable GitHub Pages in your repo settings (set branch to `gh-pages`).
4. Update the frontend Socket.IO URL to your backend’s public address.

### Deploy Backend
- Use Render, Railway, Heroku, or similar to host your Node.js/Socket.IO server.
- Make sure to use a public port and update the frontend to connect to the deployed backend.

## License
MIT
