require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/index');
const { initSequelize } = require('./config/db');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

initSequelize().then((sequelize) => {
    sequelize.sync({ force: true }).then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch(error => {
        console.log(error),
            process.exit(1);
    })
})

module.exports = app;