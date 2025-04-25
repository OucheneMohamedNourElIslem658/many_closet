import { OAuthProvider, Permission, Role } from "appwrite"
import { account, databaseID, databases } from "./config"


export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:3000/auth/success',
        'http://localhost:3000/',
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
        'http://localhost:3000/auth/success',
        'http://localhost:3000/',
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
    ]
  )
}

export const loginWithEmailAndPassword = async (email, password) => {
  await account.createEmailPasswordSession(email, password)
  window.location.href = '/admin/products'
}