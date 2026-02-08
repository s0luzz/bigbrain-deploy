import app from './app.js';

const port = process.env.PORT || 5005;

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend is now listening on port ${port}!`);
  console.log(`For API docs, navigate to http://localhost:${port}`);
});
