const mongoose = require('mongoose');

module.exports = {
    connect: async (connStr) => {
        await mongoose.connect(connStr);
    },

    close: async () => {
        await mongoose.disconnect();
    }
}