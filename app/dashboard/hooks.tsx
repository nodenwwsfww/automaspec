'use client'

import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/orpc/orpc'
import { type TestFolder, type TestSpec, type TestRequirement } from '@/lib/types'

export function useFolders(parentFolderId: TestFolder['id']) {
    const { data: folders = [], isLoading: foldersLoading } = useQuery(
        orpc.testFolders.list.queryOptions({
            input: { parentFolderId }
        })
    )

    const folderIds = folders.map((f) => f.id)
    const folderById = Object.fromEntries(folders.map((f) => [f.id, f]))

    return {
        folders,
        folderIds,
        folderById,
        foldersLoading
    }
}

export function useSpecs(folderId: TestFolder['id']) {
    const { data: specs = [], isLoading: specsLoading } = useQuery(
        orpc.testSpecs.list.queryOptions({
            input: { folderId }
        })
    )

    const specIds = specs.map((s) => s.id)
    const specById = Object.fromEntries(specs.map((s) => [s.id, s]))

    return { specs, specIds, specById, specsLoading }
}

export function useRequirements(specId: TestSpec['id']) {
    const { data: requirements = [], isLoading: requirementsLoading } = useQuery(
        orpc.testRequirements.list.queryOptions({
            input: { specId }
        })
    )

    const requirementIds = requirements.map((r) => r.id)
    const requirementById = Object.fromEntries(requirements.map((r) => [r.id, r]))

    return { requirements, requirementIds, requirementById, requirementsLoading }
}

export function useTests(requirementId: TestRequirement['id']) {
    const { data: tests = [], isLoading: testsLoading } = useQuery(
        orpc.tests.list.queryOptions({
            input: { requirementId }
        })
    )

    const testIds = tests.map((t) => t.id)
    const testById = Object.fromEntries(tests.map((t) => [t.id, t]))

    return { tests, testIds, testById, testsLoading }
}
