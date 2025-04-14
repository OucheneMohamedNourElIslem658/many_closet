import { OAuthProvider } from "appwrite"
import { account } from "./config"


export const loginWithGoogle = async () => {
  try {
    account.createOAuth2Session(
        OAuthProvider.Google,
        'http://localhost:3000/',
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
        'http://localhost:3000/',
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
    window.location.reload()
  } catch (error) {
    console.error(error)
  }
}

export const getUser = async () => {
  try {
    return await account.get()
  } catch (error) {
    console.error(error)
  }
}

