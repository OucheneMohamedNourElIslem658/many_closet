// src/appwrite.js
import { Account, Client } from 'appwrite'

const client = new Client()
client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('67fc030f003b267f06de')

const account = new Account(client)

export { account }

