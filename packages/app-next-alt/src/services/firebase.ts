import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import { v4 as uuid } from 'uuid'
import config from 'config'
import { AppState } from 'store'
import {
  FirestoreCollection,
  FirestoreCollections,
  FirestoreDocument,
  FirestoreLoginProvider,
  StorageReference,
} from 'typings/firebase'
import logger from 'utilities/logger'
import { BugReport } from 'typings/bugReport'
import { getDeviceInfo } from 'utilities/getDeviceInfo'
import { isValidHttpUrl } from 'utilities/isUrl'
import { setSessionEntry } from './sessionStorage'

/**
 * Table of contents:
 * 1. Authentication
 * 2. Collections
 * 3. Files
 */

// const downloadURLWorker = new DownloadURLWorker()
let firebaseApp: firebase.app.App

export function initFirebaseApp(options: Record<string, string> = {}): void {
  try {
    firebaseApp = firebase.initializeApp(options)
  } catch (error) {
    if (error.code !== 'app/duplicate-app') {
      logger(`Failed to initialize Firebase with error ${error.message}`, true)
    }
  }
}

/**
 * ###################### 1. Authentication ######################
 */
export async function signInUser(payload: {
  provider: FirestoreLoginProvider
  email: string
  password: string
}): Promise<void> {
  if (payload.provider === 'email') {
    await firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
  } else {
    // We are setting this property to later on check for it when the user returns to the app.
    setSessionEntry(config.localStorage.userAuthProgress, 'true')

    let provider
    switch (payload.provider) {
      case 'google':
        provider = new firebase.auth.GoogleAuthProvider()
        break
      case 'github':
        provider = new firebase.auth.GithubAuthProvider()
        break
      case 'twitter':
        provider = new firebase.auth.TwitterAuthProvider()
        break
    }

    await firebase.auth().signInWithRedirect(provider)
  }
}

export async function forgotPassword(email: string): Promise<void> {
  return firebase.auth().sendPasswordResetEmail(email)
}

export async function getAuthRedirectResults(): Promise<Partial<AppState>> {
  const results = await firebase.auth().getRedirectResult()
  return {
    user: results?.user,
    isSignedIn: true,
  }
}

export async function signOutUser() {
  return firebase.auth().signOut()
}

/**
 * ###################### 2. Collections ######################
 */
export function getUserDoc(userId: string): FirestoreDocument {
  return firebaseApp.firestore().collection(FirestoreCollections.Users).doc(userId)
}

export function getCollection(userId: string, collection: string): FirestoreCollection {
  return getUserDoc(userId).collection(collection)
}

export function getPlantDoc(userId: string, documentId: string) {
  return getCollection(userId, FirestoreCollections.Plants).doc(documentId)
}

export async function addBugReport(report: Partial<BugReport>) {
  const guid = uuid()
  const now = Date.now()
  const fullReport = {
    ...report,
    deviceInfo: getDeviceInfo(),
    appVersion: config.version,
    created: now,
    modified: now,
  } as BugReport

  return firebaseApp
    .firestore()
    .collection(FirestoreCollections.BugReports)
    .doc(guid)
    .set(fullReport)
}

/**
 * ###################### 2. Files ######################
 */
export function getFileRef(path: string): StorageReference {
  if (isValidHttpUrl(path)) {
    return firebase.storage().refFromURL(path)
  }
  return firebase.storage().ref(path)
}
