const extractJson = async (text) => {
    if (!text) {
        return null
    }
    
    try {
        // Remove markdown code blocks
        const cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find JSON boundaries
        const firstBrace = cleaned.indexOf('{')
        const closeBrace = cleaned.lastIndexOf('}')
        
        if (firstBrace === -1 || closeBrace === -1) {
            console.log("No valid JSON braces found")
            return null
        }
        
        const jsonString = cleaned.slice(firstBrace, closeBrace + 1)
        
        // Try to parse
        const parsed = JSON.parse(jsonString)
        
        // Validate required fields
        if (!parsed.code || !parsed.message) {
            console.log("Missing required fields in JSON")
            return null
        }
        
        return parsed
    } catch (error) {
        console.error("JSON parse error:", error.message)
        console.log("Problematic text length:", text?.length)
        
        // Try to fix common issues
        try {
            // Remove any trailing commas
            let fixed = text
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .replace(/,(\s*[}\]])/g, '$1')
                .trim()
            
            const firstBrace = fixed.indexOf('{')
            const closeBrace = fixed.lastIndexOf('}')
            
            if (firstBrace !== -1 && closeBrace !== -1) {
                fixed = fixed.slice(firstBrace, closeBrace + 1)
                const parsed = JSON.parse(fixed)
                
                if (parsed.code && parsed.message) {
                    return parsed
                }
            }
        } catch (retryError) {
            console.error("Retry parse also failed")
        }
        
        return null
    }
}

export default extractJson