// src/appwrite.js
import { Account, Client, Databases } from 'appwrite'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67fc030f003b267f06de')

const account = new Account(client)

const databases = new Databases(client)
const databaseID = '67fd5541001594d976c4'

export { account, databases, databaseID }

