import { OAuthProvider, Permission, Query, Role } from "appwrite"
import { account, databaseID, databases } from "./config"

const appURL = process.env.REACT_APP_APP_URL


export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
        OAuthProvider.Google,
        appURL + '/auth/success',
        appURL,
        ['email', 'profile']
    )

  } catch (error) {
    console.error(error)
  }
}

export const loginWithFacebook = async () => {
  try {
    account.createOAuth2Session(
        OAuthProvider.Facebook,
        appURL + '/auth/success',
        appURL,
        ['email', 'public_profile']
    )
  } catch (error) {
    console.error(error)
  }
}

export const logoutUser = async () => {
  try {
    await account.deleteSession('current')
    window.location.href = '/'
  } catch (error) {
    console.error(error)
  }
}

export const getUser = async () => {
  try {
    const user = await account.get()
    return user
  } catch (error) {}
}

export const storeCurrentUser = async () => {
  const user = await getUser()

  const existingUser = await databases.listDocuments(
    databaseID,
    'users',
    [Query.equal('$id', user.$id)],
  )

  if (existingUser.documents.length > 0) {
    await databases.updateDocument(
      databaseID,
      'users',
      existingUser.documents[0].$id,
      {
        name: user.name,
        email: user.email,
      },
    )
    return
  }
  
  await databases.createDocument(
    databaseID,
    'users',
    user.$id,
    {
      name: user.name,
      email: user.email,
    },
    [
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.user(user.$id)),
    ]
  )
}

export const loginWithEmailAndPassword = async (email, password) => {
  await account.createEmailPasswordSession(email, password)
  window.location.href = '/admin/products'
}