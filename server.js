const app = require('./app');
const db_connection = require("./db_connection");

db_connection();

const port = process.env.PORT || 7020;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});