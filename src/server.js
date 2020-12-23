import app from './app';

const PORT = process.env.APP_PORT;
// TESTE NOVA BRANCH DE DESENVOLVIMENTO
app.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
});
