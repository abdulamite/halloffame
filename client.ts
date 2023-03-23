import { createClient } from '@sanity/client'

export default createClient({
    projectId: 'pxz68hnc',
    dataset: 'production',
    useCdn: true,
})
