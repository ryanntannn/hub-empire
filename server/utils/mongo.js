const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { MongoClient } = require('mongodb');

class MongoBot {
  constructor() {
    this.uri = process.env.MONGO_URI.replace("<user>", process.env.MONGO_USERNAME).replace("<password>", process.env.MONGO_PASSWORD)
    this.client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    this.connect();
  }

  async connect() {
    try{
      await this.client.connect();
      console.log('Connected to MongoDB');
    }
    catch (error) {
      console.error(error)
    }
    return;
  }
}

module.exports = new MongoBot();