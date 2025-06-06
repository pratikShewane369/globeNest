const mongoose = require('mongoose');

const initData = require("./data.js");
const Listening = require("../models/listening.js");

main()
.then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listening.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner:"683faa83ee5db5ffd9065be6",
    }))
    await Listening.insertMany(initData.data);
    console.log("Data has saved");
};

initDB();