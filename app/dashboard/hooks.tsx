'use client'

import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/orpc'

export function useDashboardData() {
    const { data: folders = [], isLoading: foldersLoading } = useQuery(
        orpc.testFolders.list.queryOptions({
            input: {
                parentFolderId: null
            }
        })
    )

    const { data: specs = [], isLoading: specsLoading } = useQuery(
        orpc.testSpecs.list.queryOptions({
            input: { testFolderId: '' }
        })
    )

    const { data: requirements = [], isLoading: requirementsLoading } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: { testSpecId: '' }
        })
    )

    // Debug: Log requirements data
    if (!requirementsLoading && requirements.length > 0) {
        // console.log('Requirements fetched:', requirements.length)
        // console.log('First requirement:', requirements[0])
    }

    const { data: tests = [], isLoading: testsLoading } = useQuery(
        orpc.tests.list.queryOptions({
            input: { testRequirementId: '' }
        })
    )

    const loading = foldersLoading || specsLoading || requirementsLoading || testsLoading

    return {
        folders,
        specs,
        requirements,
        tests,
        loading
    }
}

// export function useDashboardMutations(
//     queryClient: any,
//     selectedTest: Test | null,
//     setSelectedTest: (test: Test | null) => void
// ) {
//     // Mutations for CRUD operations
//     const deleteTestFolderMutation = useMutation(
//         orpc.testFolders.delete.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testFolders'] })
//                 queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
//                 queryClient.invalidateQueries({ queryKey: ['tests'] })
//             }
//         })
//     )

//     const createTestCategoryMutation = useMutation(
//         orpc.testFolders.create.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testFolders'] })
//             }
//         })
//     )

//     const updateTestCategoryMutation = useMutation(
//         orpc.testFolders.update.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testFolders'] })
//             }
//         })
//     )

//     const deleteTestSpecMutation = useMutation(
//         orpc.testSpecs.delete.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
//                 queryClient.invalidateQueries({ queryKey: ['tests'] })
//             }
//         })
//     )

//     const createTestSpecMutation = useMutation(
//         orpc.testSpecs.create.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
//             }
//         })
//     )

//     const updateTestSpecMutation = useMutation(
//         orpc.testSpecs.update.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['testSpecs'] })
//             }
//         })
//     )

//     const deleteTestMutation = useMutation(
//         orpc.tests.delete.mutationOptions({
//             onSuccess: () => {
//                 queryClient.invalidateQueries({ queryKey: ['tests'] })
//                 if (selectedTest && deleteTestMutation.variables?.id === selectedTest.id) {
//                     setSelectedTest(null)
//                 }
//             }
//         })
//     )

//     const handleDelete = async (node: any) => {
//         if (node.type === 'folder') {
//             deleteTestFolderMutation.mutate({ id: node.id })
//         } else if (node.type === 'spec') {
//             deleteTestSpecMutation.mutate({ id: node.id })
//         } else if (node.type === 'test') {
//             deleteTestMutation.mutate({ id: node.id })
//         }
//     }

//     return {
//         deleteTestFolderMutation,
//         createTestFolderMutation,
//         updateTestFolderMutation,
//         deleteTestSpecMutation,
//         createTestSpecMutation,
//         updateTestSpecMutation,
//         deleteTestMutation,
//         handleDelete
//     }
// }
