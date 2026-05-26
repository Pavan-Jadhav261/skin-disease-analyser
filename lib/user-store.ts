import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

export type StoredUser = {
  username: string
  passwordHash: string
  createdAt: string
}

type UserRecord = StoredUser

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true })

  try {
    await fs.access(USERS_FILE)
  } catch {
    await fs.writeFile(USERS_FILE, '[]', 'utf8')
  }
}

async function readUsers(): Promise<UserRecord[]> {
  await ensureStore()
  const raw = await fs.readFile(USERS_FILE, 'utf8')

  if (!raw.trim()) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as UserRecord[]) : []
  } catch {
    return []
  }
}

async function writeUsers(users: UserRecord[]) {
  await ensureStore()
  const tempFile = `${USERS_FILE}.tmp`
  await fs.writeFile(tempFile, JSON.stringify(users, null, 2), 'utf8')
  await fs.rename(tempFile, USERS_FILE)
}

function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  return `scrypt$${salt}$${derivedKey.toString('hex')}`
}

async function verifyPassword(password: string, passwordHash: string) {
  const [scheme, salt, hash] = passwordHash.split('$')

  if (scheme !== 'scrypt' || !salt || !hash) {
    return false
  }

  const derivedKey = (await scrypt(password, salt, 64)) as Buffer
  const expectedBuffer = Buffer.from(hash, 'hex')

  if (expectedBuffer.length !== derivedKey.length) {
    return false
  }

  return timingSafeEqual(expectedBuffer, derivedKey)
}

export async function registerUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username)

  if (!normalizedUsername || !password) {
    return {
      success: false as const,
      error: 'Username and password are required.',
    }
  }

  const users = await readUsers()
  const existingUser = users.find((user) => user.username === normalizedUsername)

  if (existingUser) {
    return {
      success: false as const,
      error: 'That username is already registered.',
    }
  }

  const passwordHash = await hashPassword(password)
  const user: UserRecord = {
    username: normalizedUsername,
    passwordHash,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  await writeUsers(users)

  return {
    success: true as const,
    user,
  }
}

export async function authenticateUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username)
  const users = await readUsers()
  const user = users.find((entry) => entry.username === normalizedUsername)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)
  return isValid ? user : null
}

export async function getUserByUsername(username: string) {
  const normalizedUsername = normalizeUsername(username)
  const users = await readUsers()
  return users.find((user) => user.username === normalizedUsername) ?? null
}

export async function listUsers() {
  return readUsers()
}

