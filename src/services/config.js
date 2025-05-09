// src/appwrite.js
import { Account, Client, Databases, Storage } from 'appwrite'

const appwriteEndpoint = process.env.REACT_APP_APPWRITE_ENDPOINT
const appwriteProject = process.env.REACT_APP_APPWRITE_PROJECT

const client = new Client()
client
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProject)

const account = new Account(client)

const databases = new Databases(client)
const databaseID = '67fd5541001594d976c4'

const fileStorage = new Storage(client)

export { client, account, databases, databaseID, fileStorage }

