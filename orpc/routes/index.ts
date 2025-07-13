import { implement } from '@orpc/server'
import { contract } from '../contracts'
import { testsRouter } from './tests'

const os = implement(contract)

// TODO: lazy loading
export const router = os.router({
    ...testsRouter
})
