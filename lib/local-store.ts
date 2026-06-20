import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { randomUUID, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCallback)

export type AppRole = 'admin' | 'user'
export type ActivityKind = 'register' | 'login' | 'analysis'

export type StoredUser = {
  username: string
  passwordHash: string
  createdAt: string
}

export type ActivityRecord = {
  id: string
  username: string
  kind: ActivityKind
  title: string
  summary: string
  createdAt: string
  payload?: Record<string, unknown>
}

export type AppState = {
  users: StoredUser[]
  activities: ActivityRecord[]
}

const SEED_FILE = path.join(process.cwd(), 'data', 'app-state.seed.json')
const LOCAL_RUNTIME_FILE = path.join(process.cwd(), 'data', 'app-state.runtime.json')
const VERCEL_RUNTIME_FILE = path.join(os.tmpdir(), 'skincheck-state.json')

function getStateFilePath() {
  return process.env.VERCEL ? VERCEL_RUNTIME_FILE : LOCAL_RUNTIME_FILE
}

async function ensureStateFile() {
  const runtimeFile = getStateFilePath()
  await fs.mkdir(path.dirname(runtimeFile), { recursive: true })

  try {
    await fs.access(runtimeFile)
  } catch {
    const seed = await readSeedState()
    await fs.writeFile(runtimeFile, JSON.stringify(seed, null, 2), 'utf8')
  }
}

async function readSeedState(): Promise<AppState> {
  try {
    const raw = await fs.readFile(SEED_FILE, 'utf8')
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    }
  } catch {
    return {
      users: [],
      activities: [],
    }
  }
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase()
}

async function hashPassword(password: string) {
  const salt = randomUUID().replace(/-/g, '')
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

async function readState(): Promise<AppState> {
  await ensureStateFile()
  const runtimeFile = getStateFilePath()
  const raw = await fs.readFile(runtimeFile, 'utf8')

  try {
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    }
  } catch {
    return { users: [], activities: [] }
  }
}

async function writeState(state: AppState) {
  await ensureStateFile()
  const runtimeFile = getStateFilePath()
  const tempFile = `${runtimeFile}.tmp`

  await fs.writeFile(tempFile, JSON.stringify(state, null, 2), 'utf8')
  await fs.rename(tempFile, runtimeFile)
}

export async function getAppState() {
  return readState()
}

export async function registerUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username)

  if (!normalizedUsername || !password) {
    return {
      success: false as const,
      error: 'Username and password are required.',
    }
  }

  if (normalizedUsername === 'admin') {
    return {
      success: false as const,
      error: 'The admin username is reserved.',
    }
  }

  if (password.length < 4) {
    return {
      success: false as const,
      error: 'Password must be at least 4 characters.',
    }
  }

  const state = await readState()
  const existingUser = state.users.find((user) => user.username === normalizedUsername)

  if (existingUser) {
    return {
      success: false as const,
      error: 'That username is already registered.',
    }
  }

  const user: StoredUser = {
    username: normalizedUsername,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  }

  state.users.unshift(user)
  state.activities.unshift({
    id: randomUUID(),
    username: normalizedUsername,
    kind: 'register',
    title: 'Registered account',
    summary: `Created a new user account for ${normalizedUsername}.`,
    createdAt: new Date().toISOString(),
  })

  await writeState(state)

  return {
    success: true as const,
    user,
  }
}

export async function authenticateUser(username: string, password: string) {
  const normalizedUsername = normalizeUsername(username)

  if (normalizedUsername === 'admin' && password === '1234') {
    return {
      username: 'admin',
      role: 'admin' as AppRole,
    }
  }

  const state = await readState()
  const user = state.users.find((entry) => entry.username === normalizedUsername)

  if (!user) {
    return null
  }

  const isValid = await verifyPassword(password, user.passwordHash)

  if (!isValid) {
    return null
  }

  return {
    username: user.username,
    role: 'user' as AppRole,
  }
}

export async function logActivity(entry: Omit<ActivityRecord, 'id' | 'createdAt'> & { createdAt?: string }) {
  const state = await readState()
  const record: ActivityRecord = {
    id: randomUUID(),
    username: entry.username,
    kind: entry.kind,
    title: entry.title,
    summary: entry.summary,
    createdAt: entry.createdAt || new Date().toISOString(),
    payload: entry.payload,
  }

  state.activities.unshift(record)
  await writeState(state)

  return record
}

export async function getUserActivity(username: string, limit = 20) {
  const normalizedUsername = normalizeUsername(username)
  const state = await readState()

  return state.activities
    .filter((activity) => normalizeUsername(activity.username) === normalizedUsername && activity.kind === 'analysis')
    .slice(0, limit)
}

export async function getAllUsersReport() {
  const state = await readState()
  const activityByUser = new Map<string, ActivityRecord[]>()

  for (const activity of state.activities) {
    const key = normalizeUsername(activity.username)
    const items = activityByUser.get(key) || []
    items.push(activity)
    activityByUser.set(key, items)
  }

  const users = [
    {
      username: 'admin',
      role: 'admin' as const,
      createdAt: 'Built-in demo account',
      loginCount: activityByUser.get('admin')?.filter((item) => item.kind === 'login').length || 0,
      analysisCount: activityByUser.get('admin')?.filter((item) => item.kind === 'analysis').length || 0,
      lastActivityAt: activityByUser.get('admin')?.[0]?.createdAt || null,
    },
    ...state.users.map((user) => {
      const items = activityByUser.get(normalizeUsername(user.username)) || []

      return {
        username: user.username,
        role: 'user' as const,
        createdAt: user.createdAt,
        loginCount: items.filter((item) => item.kind === 'login').length,
        analysisCount: items.filter((item) => item.kind === 'analysis').length,
        lastActivityAt: items[0]?.createdAt || null,
      }
    }),
  ]

  const activities = state.activities.slice(0, 100)

  const totals = {
    users: users.length,
    analyses: state.activities.filter((item) => item.kind === 'analysis').length,
    logins: state.activities.filter((item) => item.kind === 'login').length,
    registrations: state.activities.filter((item) => item.kind === 'register').length,
  }

  return { users, activities, totals }
}

export async function recordLogin(username: string) {
  return logActivity({
    username,
    kind: 'login',
    title: 'Login successful',
    summary: `Signed in as ${username}.`,
  })
}

export async function recordAnalysis(username: string, result: {
  predictedDisease: string
  confidenceScore: number
  observations: string
  prevention: string
  cure: string
  additionalNotes: string
}) {
  return logActivity({
    username,
    kind: 'analysis',
    title: `Analyzed ${result.predictedDisease || 'skin condition'}`,
    summary: `${result.predictedDisease} at ${result.confidenceScore}% confidence.`,
    payload: {
      predictedDisease: result.predictedDisease,
      confidenceScore: result.confidenceScore,
      observations: result.observations,
      prevention: result.prevention,
      cure: result.cure,
      additionalNotes: result.additionalNotes,
    },
  })
}

