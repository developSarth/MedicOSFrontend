
export function formatToMarkdown(data: any, level = 0): string {
    if (!data) return ""

    // Handle strings (already markdown or plain text)
    if (typeof data === 'string') return data

    // Handle simple primitives
    if (typeof data === 'number' || typeof data === 'boolean') {
        return String(data)
    }

    // Handle Arrays
    if (Array.isArray(data)) {
        if (data.length === 0) return "_Empty list_"
        return "\n" + data.map(item => {
            const content = formatToMarkdown(item, level + 1).trim()
            const indent = "  ".repeat(level)
            return `${indent}- ${content}`
        }).join("\n")
    }

    // Handle Objects
    if (typeof data === 'object') {
        const lines: string[] = []

        Object.entries(data).forEach(([key, value]) => {
            // Skip internal or technical keys
            if (key.startsWith('_')) return

            const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

            // Header for top-level objects if they contain complex data
            if (level === 0 && typeof value === 'object' && value !== null && !Array.isArray(value)) {
                lines.push(`\n### ${formattedKey}\n`)
                lines.push(formatToMarkdown(value, level + 1))
            }
            // Standard Key-Value pair
            else {
                const indent = "  ".repeat(level)
                const valStr = formatToMarkdown(value, level + 1).trim()

                // If the value is a multiline string/block (like a nested object/list), ensure formatting
                if (valStr.includes('\n')) {
                    lines.push(`${indent}**${formattedKey}**:`)
                    lines.push(valStr) // arrays/objects already have newlines
                } else {
                    lines.push(`${indent}**${formattedKey}**: ${valStr}`)
                }
            }
        })
        return lines.join("\n")
    }

    return String(data)
}
