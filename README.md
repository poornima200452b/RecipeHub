# RecipeHub

RecipeHub is a React/Vite frontend with an Express API and MongoDB database.

## Run locally

1. Start MongoDB Community Server, or create a MongoDB Atlas database.
2. Create `backend/.env` with:

   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017/recipehub
   JWT_SECRET=replace-with-a-long-random-secret
   PORT=3000
   ```

   Use the Atlas connection string for `MONGODB_URI` if you are using Atlas.
   Keep this file private; it is ignored by Git.

3. In a terminal, start the backend:

   ```powershell
   cd backend
   npm install
   npm run dev
   ```

   For a non-watching server process, use `npm start` instead.

4. In a second terminal, start the frontend:

   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

5. Open the local address Vite prints, normally `http://localhost:5173`.
   Register a chef account and create recipes from the chef dashboard.

## Database and ratings

MongoDB creates the `recipehub` database and collections as data is written.
A new database has no recipe records until a chef creates them, so recipe
pages are expected to be empty at first.

Recipe ratings are stored in the `ratings` array embedded in each recipe
document. The API's `/api/ratings/:recipeId` endpoints and recipe rating
endpoints use this same data.

If this project was previously used with the separate `ratings` collection,
back up the database and run the optional, idempotent migration from the
`backend` directory:

```powershell
npm run migrate:ratings
```

It copies ratings that are not already embedded and leaves the old collection
unchanged. Existing embedded ratings take precedence when a user has rated the
same recipe in both places.

## Backend checks

Run the backend's unit tests from the `backend` directory:

```powershell
npm test
```
