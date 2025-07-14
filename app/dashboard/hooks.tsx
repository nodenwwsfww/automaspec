'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc'
import { Test } from '@/lib/types'

export function useDashboardData() {
    const queryClient = useQueryClient()

    // Fetch data using TanStack Query and ORPC
    const { data: categories = [], isLoading: categoriesLoading } = useQuery(
        orpc.testCategories.list.queryOptions({
            input: {}
        })
    )

    const { data: specs = [], isLoading: specsLoading } = useQuery(
        orpc.testSpecs.list.queryOptions({
            input: {}
        })
    )

    const { data: requirements = [], isLoading: requirementsLoading } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: {}
        })
    )

    const { data: tests = [], isLoading: testsLoading } = useQuery(
        orpc.tests.list.queryOptions({
            input: {}
        })
    )

    const loading = categoriesLoading || specsLoading || requirementsLoading || testsLoading

    return {
        categories,
        specs,
        requirements,
        tests,
        loading,
        queryClient
    }
}

export function useDashboardMutations(
    queryClient: any,
    selectedTest: Test | null,
    setSelectedTest: (test: Test | null) => void
) {
    // Mutations for CRUD operations
    const deleteTestCategoryMutation = useMutation(
        orpc.testCategories.delete.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testCategories'] })
                queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
                queryClient.invalidateQueries({ queryKey: ['tests'] })
            }
        })
    )

    const deleteTestSpecMutation = useMutation(
        orpc.testSpecs.delete.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
                queryClient.invalidateQueries({ queryKey: ['tests'] })
            }
        })
    )

    const deleteTestMutation = useMutation(
        orpc.tests.delete.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['tests'] })
                if (selectedTest && deleteTestMutation.variables?.id === selectedTest.id) {
                    setSelectedTest(null)
                }
            }
        })
    )

    const handleDelete = async (node: any) => {
        if (node.type === 'category') {
            deleteTestCategoryMutation.mutate({ id: node.id })
        } else if (node.type === 'spec') {
            deleteTestSpecMutation.mutate({ id: node.id })
        } else if (node.type === 'test') {
            deleteTestMutation.mutate({ id: node.id })
        }
    }

    return {
        deleteTestCategoryMutation,
        deleteTestSpecMutation,
        deleteTestMutation,
        handleDelete
    }
}
