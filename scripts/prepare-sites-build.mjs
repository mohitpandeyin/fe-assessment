import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const serverDirectory = resolve('dist', 'server')
const serverEntry = resolve(serverDirectory, 'index.js')

const workerSource = `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const fallbackUrl = new URL(request.url)
    fallbackUrl.pathname = '/'

    return env.ASSETS.fetch(new Request(fallbackUrl, request))
  },
}
`

await mkdir(serverDirectory, { recursive: true })
await writeFile(serverEntry, workerSource)
