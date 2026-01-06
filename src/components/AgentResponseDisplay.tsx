import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Info, Activity } from "lucide-react"

interface AgentResponseDisplayProps {
    data: any
    type?: "default" | "risk" | "medical"
}

export function AgentResponseDisplay({ data, type = "default" }: AgentResponseDisplayProps) {
    if (!data) return null

    // Handle string data (likely from Context Agent or simple messages)
    if (typeof data === "string") {
        try {
            // Try parsing if it's a JSON string
            const parsed = JSON.parse(data)
            return <RecursiveDisplay data={parsed} />
        } catch {
            return (
                <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-sm">
                    {data}
                </div>
            )
        }
    }

    // Handle object data
    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <RecursiveDisplay data={data} level={0} />
        </div>
    )
}

function RecursiveDisplay({ data, level }: { data: any; level: number }) {
    if (data === null || data === undefined) return <span className="text-muted-foreground italic">None</span>

    if (Array.isArray(data)) {
        if (data.length === 0) return <span className="text-muted-foreground text-sm">Empty list</span>

        return (
            <div className="grid gap-2">
                {data.map((item, i) => (
                    <div key={i} className="pl-4 border-l-2 border-primary/20">
                        <RecursiveDisplay data={item} level={level + 1} />
                    </div>
                ))}
            </div>
        )
    }

    if (typeof data === "object") {
        // Special highlighting for risk levels
        if (data.risk_level || data.overall_risk) {
            const risk = (data.risk_level || data.overall_risk).toUpperCase()
            const color = risk.includes("HIGH") || risk.includes("CRITICAL") ? "destructive" :
                risk.includes("MODERATE") ? "warning" : "default" // Warning variant might not exist, fallback to default or handle via className
        }

        return (
            <div className={`grid gap-4 ${level === 0 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-1'}`}>
                {Object.entries(data).map(([key, value]) => {
                    // Skip technical keys or empty values if needed
                    if (key.startsWith("_")) return null

                    const formattedKey = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())

                    // Specific card styling for top-level objects
                    if (typeof value === "object" && value !== null && level === 0) {
                        return (
                            <Card key={key} className="overflow-hidden border-t-4 border-t-primary/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-3">
                                    <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        {getKeyIcon(key)}
                                        {formattedKey}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-4">
                                    <RecursiveDisplay data={value} level={level + 1} />
                                </CardContent>
                            </Card>
                        )
                    }

                    return (
                        <div key={key} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold uppercase text-muted-foreground">{formattedKey}</span>
                            <div className="text-sm">
                                <RecursiveDisplay data={value} level={level + 1} />
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }

    // Primitive values
    return <PrimitiveDisplay value={data} />
}

function PrimitiveDisplay({ value }: { value: any }) {
    if (typeof value === "boolean") {
        return (
            <Badge variant={value ? "default" : "secondary"}>
                {value ? "Yes" : "No"}
            </Badge>
        )
    }

    if (typeof value === "number") {
        // Format large numbers or percentages if verifiable, for now just custom style
        return <span className="font-mono font-medium text-primary">{value.toLocaleString()}</span>
    }

    // Heuristics for special strings
    const stringVal = String(value)
    if (stringVal.match(/^(HIGH|CRITICAL|SEVERE)/i)) {
        return <Badge variant="destructive" className="animate-pulse">{stringVal}</Badge>
    }
    if (stringVal.match(/^(MODERATE|MEDIUM)/i)) {
        return <Badge className="bg-yellow-500/15 text-yellow-600 hover:bg-yellow-500/25 border-yellow-500/20">{stringVal}</Badge>
    }
    if (stringVal.match(/^(LOW|SAFE|STABLE|NORMAL)/i)) {
        return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20">{stringVal}</Badge>
    }

    return <span>{stringVal}</span>
}

function getKeyIcon(key: string) {
    const k = key.toLowerCase()
    if (k.includes("risk")) return <AlertTriangle className="h-4 w-4 text-destructive" />
    if (k.includes("recommend") || k.includes("action")) return <CheckCircle className="h-4 w-4 text-emerald-500" />
    if (k.includes("analysis") || k.includes("prediction")) return <Activity className="h-4 w-4 text-blue-500" />
    return <Info className="h-4 w-4 text-muted-foreground" />
}
