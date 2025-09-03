import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Sets the first available organization as active for the user
 * @param authClient - The auth client instance
 * @returns Promise<boolean> - true if organization was set, false if no organizations exist
 */
export async function setActiveOrganization(authClient: any): Promise<boolean> {
    try {
        const { data: organizations } = await authClient.organization.list()
        if (!organizations || organizations.length === 0) {
            return false
        }

        const firstOrg = organizations[0]
        const { error } = await authClient.organization.setActive({
            organizationId: firstOrg.id,
            organizationSlug: firstOrg.slug || ''
        })

        if (error) {
            console.error('Error setting active organization:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error in setActiveOrganization:', error)
        return false
    }
}
