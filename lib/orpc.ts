import { createORPCHandler, createORPCNextHandler } from '@orpc/next'
import { createORPCReactQueryClient } from '@orpc/react-query'
import { testsContract } from '@/contracts/tests'

export const orpcClient = createORPCReactQueryClient(testsContract, {
  baseURL: '/rpc'
})

export const testApi = {
  categories: orpcClient.testCategories,
  groups: orpcClient.testGroups,
  tests: orpcClient.tests
}
