const extractJson = async (text) => {
    if (!text) {
        console.error("extractJson: Empty text provided")
        return null
    }
    
    try {
        // Remove markdown code blocks and extra whitespace
        let cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find JSON boundaries
        const firstBrace = cleaned.indexOf('{')
        const closeBrace = cleaned.lastIndexOf('}')
        
        if (firstBrace === -1 || closeBrace === -1) {
            console.error("extractJson: No valid JSON braces found")
            return null
        }
        
        let jsonString = cleaned.slice(firstBrace, closeBrace + 1)
        
        // Try to parse directly first
        try {
            const parsed = JSON.parse(jsonString)
            
            // Validate required fields
            if (!parsed.code || !parsed.message) {
                console.error("extractJson: Missing required fields (code or message)")
                return null
            }
            
            return parsed
        } catch (parseError) {
            console.log("extractJson: Initial parse failed, attempting fixes...")
            
            // Attempt multiple fix strategies
            const fixStrategies = [
                // Strategy 1: Remove trailing commas
                (str) => str.replace(/,(\s*[}\]])/g, '$1'),
                
                // Strategy 2: Fix unterminated strings by finding last complete quote
                (str) => {
                    // Count quotes to detect unterminated strings
                    const quoteCount = (str.match(/"/g) || []).length
                    if (quoteCount % 2 !== 0) {
                        // Find the last opening quote and close it
                        const lastQuoteIndex = str.lastIndexOf('"')
                        if (lastQuoteIndex !== -1) {
                            // Try to close the string before the last brace
                            const beforeLastBrace = str.lastIndexOf('}')
                            if (beforeLastBrace > lastQuoteIndex) {
                                return str.slice(0, beforeLastBrace) + '"}}'
                            }
                        }
                    }
                    return str
                },
                
                // Strategy 3: Remove control characters
                (str) => str.replace(/[\x00-\x1F\x7F]/g, ''),
                
                // Strategy 4: Try to extract just the first complete JSON object
                (str) => {
                    let braceCount = 0
                    let inString = false
                    let escape = false
                    
                    for (let i = 0; i < str.length; i++) {
                        const char = str[i]
                        
                        if (escape) {
                            escape = false
                            continue
                        }
                        
                        if (char === '\\') {
                            escape = true
                            continue
                        }
                        
                        if (char === '"') {
                            inString = !inString
                            continue
                        }
                        
                        if (!inString) {
                            if (char === '{') braceCount++
                            if (char === '}') {
                                braceCount--
                                if (braceCount === 0) {
                                    return str.slice(0, i + 1)
                                }
                            }
                        }
                    }
                    return str
                }
            ]
            
            // Try each strategy
            for (const strategy of fixStrategies) {
                try {
                    const fixed = strategy(jsonString)
                    const parsed = JSON.parse(fixed)
                    
                    if (parsed.code && parsed.message) {
                        console.log("extractJson: Successfully fixed JSON with strategy")
                        return parsed
                    }
                } catch (strategyError) {
                    // Continue to next strategy
                    continue
                }
            }
            
            console.error("extractJson: All fix strategies failed")
            console.error("extractJson: Parse error:", parseError.message)
            console.error("extractJson: Text length:", text.length)
            console.error("extractJson: First 200 chars:", text.slice(0, 200))
            console.error("extractJson: Last 200 chars:", text.slice(-200))
        }
        
        return null
    } catch (error) {
        console.error("extractJson: Unexpected error:", error.message)
        return null
    }
}

export default extractJson